import Goal from '../models/Goal.js';
import Task from '../models/Task.js';
import { geminiChat, isQuotaError } from '../utils/gemini.js';

export const getGoals = async (req, res, next) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({ deadline: 1, createdAt: -1 }).lean();
    const enriched = goals.map((g) => {
      if (g.milestones?.length > 0) {
        const done = g.milestones.filter((m) => m.status === 'completed').length;
        g.progress = Math.round((done / g.milestones.length) * 100);
      }
      return g;
    });
    res.json({ goals: enriched });
  } catch (err) {
    next(err);
  }
};

export const createGoal = async (req, res, next) => {
  try {
    const { title, description, deadline, category, estimatedHours, milestones } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const goal = await Goal.create({
      user: req.user._id,
      title,
      description,
      deadline,
      category: category || 'other',
      estimatedHours: estimatedHours || 0,
      milestones: (milestones || []).map((m, i) => ({ ...m, order: i })),
    });

    const conflict = await detectConflicts(req.user._id, goal);
    if (conflict.severity !== 'none') {
      goal.conflictSeverity = conflict.severity;
      goal.conflictDetails = conflict.details;
      await goal.save();
    }

    res.status(201).json({ goal });
  } catch (err) {
    next(err);
  }
};

export const updateGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
    if (!goal) return res.status(404).json({ message: 'Goal not found' });

    const fields = ['title', 'description', 'deadline', 'category', 'estimatedHours', 'status'];
    fields.forEach((f) => { if (req.body[f] !== undefined) goal[f] = req.body[f]; });
    await goal.save();
    res.json({ goal });
  } catch (err) {
    next(err);
  }
};

export const deleteGoal = async (req, res, next) => {
  try {
    await Goal.deleteOne({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Goal deleted' });
  } catch (err) {
    next(err);
  }
};

export const addMilestone = async (req, res, next) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
    if (!goal) return res.status(404).json({ message: 'Goal not found' });

    const { title, description, deadline } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    goal.milestones.push({ title, description, deadline, order: goal.milestones.length });
    await goal.save();
    res.json({ goal });
  } catch (err) {
    next(err);
  }
};

export const toggleMilestone = async (req, res, next) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
    if (!goal) return res.status(404).json({ message: 'Goal not found' });

    const ms = goal.milestones.id(req.params.milestoneId);
    if (!ms) return res.status(404).json({ message: 'Milestone not found' });

    ms.status = ms.status === 'completed' ? 'pending' : 'completed';
    ms.completedAt = ms.status === 'completed' ? new Date() : undefined;

    const done = goal.milestones.filter((m) => m.status === 'completed').length;
    goal.progress = Math.round((done / goal.milestones.length) * 100);
    if (goal.progress === 100) goal.status = 'completed';

    await goal.save();
    res.json({ goal });
  } catch (err) {
    next(err);
  }
};

export const deleteMilestone = async (req, res, next) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    goal.milestones = goal.milestones.filter((m) => m._id.toString() !== req.params.milestoneId);
    const done = goal.milestones.filter((m) => m.status === 'completed').length;
    goal.progress = goal.milestones.length > 0 ? Math.round((done / goal.milestones.length) * 100) : 0;
    await goal.save();
    res.json({ goal });
  } catch (err) {
    next(err);
  }
};

export const getConflicts = async (req, res, next) => {
  try {
    const goals = await Goal.find({ user: req.user._id, status: 'active' }).lean();
    const conflicts = [];
    const now = new Date();

    goals.forEach((g1, i) => {
      goals.forEach((g2, j) => {
        if (i >= j) return;
        if (g1.deadline && g2.deadline) {
          const diffDays = Math.abs(new Date(g1.deadline) - new Date(g2.deadline)) / 86400000;
          if (diffDays < 5) {
            conflicts.push({
              goals: [g1.title, g2.title],
              goalIds: [g1._id, g2._id],
              reason: `Deadlines within ${Math.round(diffDays)} day(s) of each other`,
              severity: diffDays < 2 ? 'high' : 'medium',
            });
          }
        }
      });
    });

    const totalHours = goals.reduce((s, g) => s + (g.estimatedHours || 0), 0);
    if (totalHours > 80) {
      conflicts.push({
        goals: goals.map((g) => g.title),
        reason: `Total effort (${totalHours}h) exceeds safe weekly capacity`,
        severity: 'medium',
      });
    }

    // AI recommendation for conflicts
    let aiRecommendation = '';
    if (conflicts.length > 0) {
      try {
        const prompt = `User has ${goals.length} active goals with conflicts: ${conflicts.map((c) => c.reason).join('; ')}. Goals: ${goals.map((g) => `${g.title} (${g.estimatedHours || 0}h)`).join(', ')}. Give one short actionable recommendation to resolve the most critical conflict. Under 40 words.`;
        aiRecommendation = await geminiChat(prompt);
      } catch (_) {
        const highest = conflicts.sort((a, b) => (b.severity === 'high' ? 1 : -1))[0];
        aiRecommendation = highest ? `Prioritize ${highest.goals[0]} — its deadline is most critical.` : '';
      }
    }

    res.json({ conflicts, totalEstimatedHours: totalHours, aiRecommendation });
  } catch (err) {
    next(err);
  }
};

export const getGoalHeatmap = async (req, res, next) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
    if (!goal) return res.status(404).json({ message: 'Goal not found' });

    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);
    const tasks = await Task.find({
      user: req.user._id,
      status: 'completed',
      completedAt: { $gte: thirtyDaysAgo },
    }).lean();

    const heatmap = {};
    tasks.forEach((t) => {
      if (t.completedAt) {
        const key = new Date(t.completedAt).toISOString().split('T')[0];
        heatmap[key] = (heatmap[key] || 0) + 1;
      }
    });

    res.json({ heatmap, goal });
  } catch (err) {
    next(err);
  }
};

async function detectConflicts(userId, newGoal) {
  const active = await Goal.find({ user: userId, status: 'active', _id: { $ne: newGoal._id } }).lean();
  if (!active.length) return { severity: 'none', details: '' };

  const totalHours = active.reduce((s, g) => s + (g.estimatedHours || 0), 0) + (newGoal.estimatedHours || 0);
  const overlapping = active.filter((g) => {
    if (!g.deadline || !newGoal.deadline) return false;
    return Math.abs(new Date(g.deadline) - new Date(newGoal.deadline)) / 86400000 < 7;
  });

  if (overlapping.length > 0 && totalHours > 60) {
    return { severity: 'high', details: `Deadline overlaps with "${overlapping[0].title}". Consider reprioritizing.` };
  }
  if (totalHours > 80) {
    return { severity: 'medium', details: `Total effort (${totalHours}h) across goals may be too high.` };
  }
  if (overlapping.length > 0) {
    return { severity: 'low', details: `Deadline is close to "${overlapping[0].title}".` };
  }
  return { severity: 'none', details: '' };
}
