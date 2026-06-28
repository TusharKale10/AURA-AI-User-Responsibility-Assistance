import Task from '../models/Task.js';
import { calculatePriorityScore, calculateRiskLevel } from '../utils/priorityEngine.js';

export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const allActiveTasks = await Task.find({
      user: userId,
      status: { $in: ['pending', 'in_progress'] },
    }).lean();

    const enriched = allActiveTasks.map((t) => ({
      ...t,
      priorityScore: calculatePriorityScore(t),
      riskLevel: calculateRiskLevel(t),
    }));

    const sorted = enriched.sort((a, b) => b.priorityScore - a.priorityScore);

    const todayDeadlines = enriched.filter((t) => {
      const d = new Date(t.deadline);
      return d >= startOfDay && d <= endOfDay;
    });

    const highRisk = enriched.filter((t) => t.riskLevel === 'high');
    const moderateRisk = enriched.filter((t) => t.riskLevel === 'moderate');

    const completedToday = await Task.find({
      user: userId,
      status: 'completed',
      completedAt: { $gte: startOfDay, $lte: endOfDay },
    }).lean();

    const topTask = sorted[0] || null;

    const totalMinutesEstimated = todayDeadlines.reduce((acc, t) => acc + t.estimatedMinutes, 0);
    const completedMinutes = completedToday.reduce((acc, t) => acc + t.estimatedMinutes, 0);
    const progressPercent = totalMinutesEstimated
      ? Math.round((completedMinutes / (totalMinutesEstimated + completedMinutes)) * 100)
      : completedToday.length > 0 ? 100 : 0;

    res.json({
      dashboard: {
        todayMission: topTask,
        upcomingDeadlines: sorted.slice(0, 5),
        priorityTasks: sorted.slice(0, 4),
        riskAlerts: { high: highRisk, moderate: moderateRisk },
        todayProgress: {
          completed: completedToday.length,
          total: completedToday.length + allActiveTasks.length,
          percent: progressPercent,
        },
        todayDeadlines,
        stats: {
          totalActive: allActiveTasks.length,
          completedToday: completedToday.length,
          highRiskCount: highRisk.length,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};
