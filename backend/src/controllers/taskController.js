import Task from '../models/Task.js';
import { enrichTasksWithScores, calculatePriorityScore, calculateRiskLevel } from '../utils/priorityEngine.js';
import { computeAndSaveBalance } from '../utils/lifeBalanceEngine.js';

export const getTasks = async (req, res, next) => {
  try {
    const { status, category, sort = '-createdAt' } = req.query;
    const filter = { user: req.user._id };
    if (status) filter.status = status;
    if (category) filter.category = category;

    const tasks = await Task.find(filter).sort(sort).lean();
    const enriched = tasks.map((t) => ({
      ...t,
      priorityScore: calculatePriorityScore(t),
      riskLevel: calculateRiskLevel(t),
    }));

    res.json({ tasks: enriched });
  } catch (err) {
    next(err);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { title, description, deadline, estimatedMinutes, category, priority, tags, dependencies, parentGoal } = req.body;

    if (!title || !deadline || !estimatedMinutes) {
      return res.status(400).json({ message: 'Title, deadline, and estimated time are required' });
    }

    const taskData = { user: req.user._id, title, description, deadline, estimatedMinutes, category, priority };
    if (tags) taskData.tags = tags;
    if (dependencies) taskData.dependencies = dependencies;
    if (parentGoal) taskData.parentGoal = parentGoal;

    const task = await Task.create(taskData);
    const plain = task.toObject();
    plain.priorityScore = calculatePriorityScore(plain);
    plain.riskLevel = calculateRiskLevel(plain);

    await Task.findByIdAndUpdate(task._id, { priorityScore: plain.priorityScore, riskLevel: plain.riskLevel });

    res.status(201).json({ task: plain });
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const wasCompleted = task.status === 'completed';

    const allowedFields = ['title', 'description', 'deadline', 'estimatedMinutes', 'category', 'priority', 'status', 'tags', 'dependencies', 'parentGoal'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) task[field] = req.body[field];
    });

    if (req.body.status === 'completed' && !task.completedAt) {
      task.completedAt = new Date();
    }

    task.priorityScore = calculatePriorityScore(task.toObject());
    task.riskLevel = calculateRiskLevel(task.toObject());

    await task.save();

    // Recalculate life balance asynchronously when a task is completed
    if (!wasCompleted && task.status === 'completed') {
      computeAndSaveBalance(task.user).catch(() => {});
    }

    res.json({ task });
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};

export const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id }).lean();
    if (!task) return res.status(404).json({ message: 'Task not found' });
    task.priorityScore = calculatePriorityScore(task);
    task.riskLevel = calculateRiskLevel(task);
    res.json({ task });
  } catch (err) {
    next(err);
  }
};
