import Task from '../models/Task.js';
import { calculatePriorityScore, calculateRiskLevel } from '../utils/priorityEngine.js';

export const getAdaptivePlan = async (req, res, next) => {
  try {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const pending = await Task.find({
      user: req.user._id,
      status: { $in: ['pending', 'in_progress'] },
    }).sort({ deadline: 1 }).lean();

    const enriched = pending.map((t) => ({
      ...t,
      priorityScore: calculatePriorityScore(t),
      riskLevel: calculateRiskLevel(t),
      hoursLeft: t.deadline ? Math.max(0, (new Date(t.deadline) - now) / 3600000) : 999,
    })).sort((a, b) => b.priorityScore - a.priorityScore);

    const overdue = enriched.filter((t) => t.deadline && new Date(t.deadline) < now);
    const todayTasks = enriched.filter((t) => t.deadline && new Date(t.deadline) >= now && new Date(t.deadline) <= endOfDay);
    const upcoming = enriched.filter((t) => !t.deadline || new Date(t.deadline) > endOfDay);

    const hoursLeft = Math.max(0, (endOfDay - now) / 3600000);
    const workableHours = Math.min(hoursLeft, 8);

    let schedule = [];
    let timeUsed = 0;
    for (const task of enriched.slice(0, 10)) {
      const taskH = (task.estimatedMinutes || 30) / 60;
      if (timeUsed + taskH <= workableHours) {
        schedule.push({
          task: { _id: task._id, title: task.title, category: task.category, priority: task.priority, estimatedMinutes: task.estimatedMinutes, riskLevel: task.riskLevel, priorityScore: task.priorityScore },
          startMinute: Math.round(timeUsed * 60),
          endMinute: Math.round((timeUsed + taskH) * 60),
        });
        timeUsed += taskH;
      }
    }

    const freeMinutes = Math.round(Math.max(0, workableHours - timeUsed) * 60);
    const notScheduled = enriched.filter((t) => !schedule.find((s) => s.task._id.toString() === t._id.toString()));

    let aiSuggestion = '';
    if (overdue.length > 0) {
      aiSuggestion = `${overdue.length} overdue task${overdue.length > 1 ? 's' : ''} need immediate attention. Start with "${overdue[0].title}".`;
    } else if (freeMinutes > 30 && notScheduled.length > 0) {
      aiSuggestion = `You have ${freeMinutes}min free. Consider: "${notScheduled[0].title}"`;
    } else if (freeMinutes > 30) {
      aiSuggestion = `You have ${freeMinutes} free minutes — use them for a break or get ahead on tomorrow.`;
    } else if (schedule.length > 0) {
      aiSuggestion = `Your day is well-planned. Start with "${schedule[0].task.title}" for maximum momentum.`;
    }

    res.json({
      schedule,
      overdueTasks: overdue,
      todayTasks,
      upcomingTasks: upcoming.slice(0, 5),
      freeMinutes,
      hoursLeft: Math.round(hoursLeft),
      totalPending: pending.length,
      aiSuggestion,
    });
  } catch (err) {
    next(err);
  }
};

export const triggerReschedule = async (req, res, next) => {
  try {
    const { freedMinutes, reason } = req.body;
    const now = new Date();

    const pending = await Task.find({
      user: req.user._id,
      status: { $in: ['pending', 'in_progress'] },
    }).sort({ deadline: 1 }).lean();

    const enriched = pending.map((t) => ({
      ...t,
      priorityScore: calculatePriorityScore(t),
      riskLevel: calculateRiskLevel(t),
    })).sort((a, b) => b.priorityScore - a.priorityScore);

    const recommendations = [];

    if (freedMinutes > 0) {
      const fitting = enriched.filter((t) => (t.estimatedMinutes || 30) <= freedMinutes);
      if (fitting.length > 0) {
        recommendations.push({
          type: 'opportunity',
          message: `${freedMinutes} minutes freed (${reason || 'schedule change'})`,
          task: fitting[0],
          action: `Start "${fitting[0].title}" — it fits in your free time.`,
        });
      }
    }

    const overdue = enriched.filter((t) => t.deadline && new Date(t.deadline) < now);
    overdue.forEach((t) => {
      recommendations.push({
        type: 'reschedule',
        message: `"${t.title}" is overdue`,
        task: t,
        action: `Reschedule "${t.title}" to tomorrow and update its deadline.`,
      });
    });

    const highRisk = enriched.filter((t) => t.riskLevel === 'high' && !overdue.find((o) => o._id.toString() === t._id.toString()));
    if (highRisk.length > 0) {
      recommendations.push({
        type: 'risk',
        message: `"${highRisk[0].title}" is at high risk`,
        task: highRisk[0],
        action: `Allocate time now — you need ${highRisk[0].estimatedMinutes}min and the deadline is approaching.`,
      });
    }

    res.json({ recommendations, freedMinutes });
  } catch (err) {
    next(err);
  }
};
