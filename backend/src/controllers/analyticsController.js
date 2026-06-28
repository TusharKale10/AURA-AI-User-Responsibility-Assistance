import Task from '../models/Task.js';
import Goal from '../models/Goal.js';
import Reflection from '../models/Reflection.js';
import { geminiChat } from '../utils/gemini.js';

const fmtHour = (h) => {
  if (h === undefined || h === null) return 'N/A';
  h = parseInt(h);
  if (h === 0) return '12 AM';
  if (h === 12) return '12 PM';
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
};

export const getOverview = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const thirtyDaysAgo = new Date(now - 30 * 86400000);
    const sevenDaysAgo = new Date(now - 7 * 86400000);

    const [allTasks, goals] = await Promise.all([
      Task.find({ user: userId, createdAt: { $gte: thirtyDaysAgo } }).lean(),
      Goal.find({ user: userId }).lean(),
    ]);

    const completed = allTasks.filter((t) => t.status === 'completed');
    const completionRate = allTasks.length > 0 ? Math.round((completed.length / allTasks.length) * 100) : 0;

    // Category breakdown
    const categoryBreakdown = {};
    allTasks.forEach((t) => {
      if (!categoryBreakdown[t.category]) categoryBreakdown[t.category] = { total: 0, completed: 0 };
      categoryBreakdown[t.category].total++;
      if (t.status === 'completed') categoryBreakdown[t.category].completed++;
    });

    // Daily trend (last 14 days)
    const dailyTrend = [];
    for (let i = 13; i >= 0; i--) {
      const date = new Date(now - i * 86400000);
      const ds = date.toDateString();
      dailyTrend.push({
        date: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }),
        completed: completed.filter((t) => t.completedAt && new Date(t.completedAt).toDateString() === ds).length,
        created: allTasks.filter((t) => new Date(t.createdAt).toDateString() === ds).length,
      });
    }

    // Priority distribution
    const priorityDist = { low: 0, medium: 0, high: 0, critical: 0 };
    allTasks.forEach((t) => { priorityDist[t.priority] = (priorityDist[t.priority] || 0) + 1; });

    // Risk distribution (active tasks only)
    const riskDist = { safe: 0, moderate: 0, high: 0 };
    allTasks.filter((t) => t.status !== 'completed').forEach((t) => {
      riskDist[t.riskLevel || 'safe'] = (riskDist[t.riskLevel || 'safe'] || 0) + 1;
    });

    // Week comparison
    const thisWeekCompleted = completed.filter((t) => t.completedAt && new Date(t.completedAt) >= sevenDaysAgo).length;
    const lastWeekCompleted = completed.filter((t) => {
      const d = t.completedAt ? new Date(t.completedAt) : null;
      return d && d >= new Date(now - 14 * 86400000) && d < sevenDaysAgo;
    }).length;
    const weekImprovement = lastWeekCompleted > 0
      ? Math.round(((thisWeekCompleted - lastWeekCompleted) / lastWeekCompleted) * 100) : 0;

    res.json({
      overview: {
        totalTasks: allTasks.length,
        completedTasks: completed.length,
        completionRate,
        activeGoals: goals.filter((g) => g.status === 'active').length,
        completedGoals: goals.filter((g) => g.status === 'completed').length,
        weekImprovement,
        thisWeekCompleted,
        lastWeekCompleted,
      },
      categoryBreakdown,
      dailyTrend,
      priorityDistribution: priorityDist,
      riskDistribution: riskDist,
    });
  } catch (err) {
    next(err);
  }
};

export const getTrends = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);
    const tasks = await Task.find({ user: userId, createdAt: { $gte: thirtyDaysAgo } }).lean();
    const completed = tasks.filter((t) => t.status === 'completed');

    // Weekly buckets (last 4 weeks, newest last)
    const weeklyData = [3, 2, 1, 0].map((weeksAgo) => {
      const start = new Date(Date.now() - (weeksAgo + 1) * 7 * 86400000);
      const end = new Date(Date.now() - weeksAgo * 7 * 86400000);
      const wt = tasks.filter((t) => { const d = new Date(t.createdAt); return d >= start && d < end; });
      const wc = wt.filter((t) => t.status === 'completed');
      return {
        week: weeksAgo === 0 ? 'This week' : `${weeksAgo}w ago`,
        total: wt.length,
        completed: wc.length,
        rate: wt.length > 0 ? Math.round((wc.length / wt.length) * 100) : 0,
      };
    });

    // Hourly productivity (0–23)
    const hourlyProductivity = Array.from({ length: 24 }, (_, h) => ({
      hour: h,
      count: completed.filter((t) => t.completedAt && new Date(t.completedAt).getHours() === h).length,
    }));

    // Category trend over 4 weeks
    const categoryTrend = {};
    completed.forEach((t) => {
      const week = Math.floor((Date.now() - new Date(t.completedAt)) / (7 * 86400000));
      if (week <= 3) {
        if (!categoryTrend[t.category]) categoryTrend[t.category] = [0, 0, 0, 0];
        categoryTrend[t.category][3 - week]++;
      }
    });

    res.json({ weeklyData, hourlyProductivity, categoryTrend });
  } catch (err) {
    next(err);
  }
};

export const generateWeeklyReport = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);
    const [tasks, goals] = await Promise.all([
      Task.find({ user: userId, createdAt: { $gte: sevenDaysAgo } }).lean(),
      Goal.find({ user: userId, status: 'active' }).lean(),
    ]);

    const completed = tasks.filter((t) => t.status === 'completed');
    const completionRate = tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0;

    const hourCounts = {};
    completed.forEach((t) => {
      if (t.completedAt) { const h = new Date(t.completedAt).getHours(); hourCounts[h] = (hourCounts[h] || 0) + 1; }
    });
    const bestHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

    const dayCounts = {};
    tasks.forEach((t) => {
      const day = new Date(t.createdAt).toLocaleDateString('en-IN', { weekday: 'long' });
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    });
    const worstDay = Object.entries(dayCounts).sort((a, b) => a[1] - b[1])[0]?.[0] || 'N/A';

    let report = `This week you completed ${completed.length} of ${tasks.length} tasks — a ${completionRate}% completion rate. ${bestHour ? `Your peak time was ${fmtHour(bestHour)}.` : ''} ${worstDay !== 'N/A' ? `${worstDay} was your lightest day — consider scheduling important work then.` : ''} Keep pushing forward!`;

    try {
      const prompt = `You are AURA. Write a 3-4 sentence warm and specific weekly report.
Data: Completed ${completed.length}/${tasks.length} tasks (${completionRate}%), best time ${fmtHour(bestHour)}, lightest day ${worstDay}, active goals: ${goals.length}, categories: ${[...new Set(completed.map((t) => t.category))].join(', ')}.
Celebrate wins, give one insight, end with one specific recommendation. No bullet points.`;
      report = await geminiChat(prompt);
    } catch (_) {}

    res.json({
      report,
      stats: {
        completed: completed.length,
        total: tasks.length,
        completionRate,
        bestWorkingTime: fmtHour(bestHour),
        worstDay,
        activeGoals: goals.length,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getProductivityScore = async (req, res, next) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);
    const tasks = await Task.find({ user: req.user._id, createdAt: { $gte: sevenDaysAgo } }).lean();
    const completed = tasks.filter((t) => t.status === 'completed');
    const overdue = tasks.filter((t) => t.status !== 'completed' && t.deadline && new Date(t.deadline) < new Date());

    const completionScore = tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 50;
    const onTime = completed.filter((t) => !t.deadline || (t.completedAt && new Date(t.completedAt) <= new Date(t.deadline))).length;
    const punctualityScore = completed.length > 0 ? Math.round((onTime / completed.length) * 100) : 50;
    const productivityScore = Math.round(completionScore * 0.6 + punctualityScore * 0.4);

    res.json({ productivityScore, completionScore, punctualityScore, completedCount: completed.length, overdueCount: overdue.length });
  } catch (err) {
    next(err);
  }
};
