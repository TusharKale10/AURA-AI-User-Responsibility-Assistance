import Task from '../models/Task.js';
import ProductivityDNA from '../models/ProductivityDNA.js';
import { geminiChat } from '../utils/gemini.js';

const fmtHour = (h) => {
  if (h === 0 || h === 24) return '12 AM';
  if (h === 12) return '12 PM';
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
};

async function computeDNA(userId) {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);
  const allTasks = await Task.find({ user: userId, createdAt: { $gte: thirtyDaysAgo } }).lean();
  const completed = allTasks.filter((t) => t.status === 'completed');

  const completionRate = allTasks.length > 0 ? Math.round((completed.length / allTasks.length) * 100) : 0;

  const missedDeadlines = completed.filter(
    (t) => t.completedAt && t.deadline && new Date(t.completedAt) > new Date(t.deadline)
  ).length;

  // Hour distribution
  const hourCounts = {};
  completed.forEach((t) => {
    if (t.completedAt) {
      const h = new Date(t.completedAt).getHours();
      hourCounts[h] = (hourCounts[h] || 0) + 1;
    }
  });

  const mostProductiveSlots = Object.entries(hourCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([hour, score]) => ({ hour: parseInt(hour), score }));

  // Day distribution
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayCounts = {};
  completed.forEach((t) => {
    if (t.completedAt) {
      const d = dayNames[new Date(t.completedAt).getDay()];
      dayCounts[d] = (dayCounts[d] || 0) + 1;
    }
  });
  const mostProductiveDays = Object.entries(dayCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([d]) => d);

  // Category counts
  const tasksByCategory = {};
  allTasks.forEach((t) => { tasksByCategory[t.category] = (tasksByCategory[t.category] || 0) + 1; });

  // Deep focus window (best 2h block)
  let bestWindow = 9;
  let bestCount = 0;
  for (let h = 5; h <= 22; h++) {
    const count = (hourCounts[h] || 0) + (hourCounts[h + 1] || 0);
    if (count > bestCount) { bestCount = count; bestWindow = h; }
  }
  const deepFocusWindow = `${fmtHour(bestWindow)} – ${fmtHour(bestWindow + 2)}`;

  // Study peak time
  const studyHours = {};
  completed.filter((t) => t.category === 'study').forEach((t) => {
    if (t.completedAt) {
      const h = new Date(t.completedAt).getHours();
      studyHours[h] = (studyHours[h] || 0) + 1;
    }
  });
  const peakStudyH = Object.entries(studyHours).sort((a, b) => b[1] - a[1])[0]?.[0];
  const peakLearningTime = peakStudyH
    ? `${fmtHour(parseInt(peakStudyH))} – ${fmtHour(parseInt(peakStudyH) + 2)}`
    : '7 PM – 9 PM';

  // Profile scores
  const morningCompleted = completed.filter((t) => t.completedAt && new Date(t.completedAt).getHours() < 12).length;
  const morningProductivity = completed.length > 0 ? Math.min(100, Math.round((morningCompleted / completed.length) * 150)) : 50;

  const workCompleted = completed.filter((t) => t.category === 'work').length;
  const codingEfficiency = completed.length > 0 ? Math.min(100, Math.round((workCompleted / completed.length) * 130)) : 50;

  const avgTaskCompletionAccuracy = Math.max(0, Math.min(100, completionRate - missedDeadlines * 5));

  // Weekly trend
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);
  const fourteenDaysAgo = new Date(Date.now() - 14 * 86400000);
  const thisWeek = completed.filter((t) => t.completedAt && new Date(t.completedAt) >= sevenDaysAgo).length;
  const lastWeek = completed.filter((t) => t.completedAt && new Date(t.completedAt) >= fourteenDaysAgo && new Date(t.completedAt) < sevenDaysAgo).length;
  const weeklyTrend = lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : 0;

  // Consistency
  const daysWithWork = new Set(
    completed.map((t) => t.completedAt ? new Date(t.completedAt).toDateString() : null).filter(Boolean)
  ).size;
  const consistencyScore = Math.min(100, Math.round((daysWithWork / 30) * 100));

  let aiInsights = `You complete ${completionRate}% of tasks with ${consistencyScore}% consistency. Your peak productivity window is ${deepFocusWindow}.`;
  try {
    const prompt = `Analyze this user's 30-day productivity data and give a warm, specific 2-sentence insight:
Completion Rate: ${completionRate}% | Missed Deadlines: ${missedDeadlines} | Consistency: ${consistencyScore}% | Weekly Trend: ${weeklyTrend > 0 ? '+' : ''}${weeklyTrend}% | Most Productive: ${mostProductiveDays.join(', ')} | Deep Focus Window: ${deepFocusWindow} | Categories: ${JSON.stringify(tasksByCategory)}
No bullet points. Be specific and encouraging.`;
    aiInsights = await geminiChat(prompt);
  } catch (_) {}

  return ProductivityDNA.findOneAndUpdate(
    { user: userId },
    {
      $set: {
        user: userId,
        metrics: { completionRate, missedDeadlines, mostProductiveDays, mostProductiveSlots, tasksByCategory },
        profile: {
          morningProductivity,
          codingEfficiency,
          meetingProductivity: Math.min(100, Math.round(completionRate * 0.7)),
          deepFocusWindow,
          peakLearningTime,
          avgTaskCompletionAccuracy,
          weeklyTrend,
          consistencyScore,
        },
        aiInsights,
        lastComputedAt: new Date(),
      },
    },
    { upsert: true, new: true }
  );
}

export const getProductivityDNA = async (req, res, next) => {
  try {
    let dna = await ProductivityDNA.findOne({ user: req.user._id });
    if (!dna || !dna.lastComputedAt || Date.now() - dna.lastComputedAt > 3600000) {
      dna = await computeDNA(req.user._id);
    }
    res.json({ dna });
  } catch (err) {
    next(err);
  }
};

export const refreshDNA = async (req, res, next) => {
  try {
    const dna = await computeDNA(req.user._id);
    res.json({ dna });
  } catch (err) {
    next(err);
  }
};
