import { GoogleGenerativeAI } from '@google/generative-ai';
import Task from '../models/Task.js';
import Reflection from '../models/Reflection.js';
import AIHistory from '../models/AIHistory.js';

const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-3.5-flash'];

const geminiChat = async (prompt) => {
  if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not set');
  const key = process.env.GEMINI_API_KEY;
  let lastErr;
  for (const modelName of MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${key}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });
      const data = await res.json();
      if (!res.ok) {
        const err = new Error(data.error?.message || `HTTP ${res.status}`);
        err.status = res.status;
        if (res.status === 404 || res.status === 429) { lastErr = err; continue; }
        throw err;
      }
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (err) {
      lastErr = err;
      const msg = err.message || '';
      if (msg.includes('404') || msg.includes('not found') || msg.includes('429') || msg.includes('quota')) continue;
      throw err;
    }
  }
  throw lastErr;
};

const isQuotaError = (err) => {
  const msg = err?.message || '';
  return err?.status === 429 || msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED');
};

const smartFallbackPlan = (goal) => {
  const lower = goal.toLowerCase();
  const isStudy = lower.includes('study') || lower.includes('dsa') || lower.includes('exam') || lower.includes('learn') || lower.includes('interview') || lower.includes('leetcode') || lower.includes('course');
  const isProject = lower.includes('project') || lower.includes('build') || lower.includes('create') || lower.includes('develop') || lower.includes('website') || lower.includes('app');

  if (isStudy) {
    return [
      { title: 'Understand the core concepts', description: 'Review fundamentals and theory related to the topic', estimatedMinutes: 60, priority: 'high', category: 'study' },
      { title: 'Watch tutorials or read documentation', description: 'Use quality learning resources to build understanding', estimatedMinutes: 90, priority: 'high', category: 'study' },
      { title: 'Solve practice problems', description: 'Apply what you learned through hands-on practice', estimatedMinutes: 120, priority: 'critical', category: 'study' },
      { title: 'Review mistakes and weak areas', description: 'Identify gaps and revisit difficult concepts', estimatedMinutes: 45, priority: 'medium', category: 'study' },
      { title: 'Take notes and summarize learnings', description: 'Consolidate knowledge with structured notes', estimatedMinutes: 30, priority: 'low', category: 'study' },
    ];
  }

  if (isProject) {
    return [
      { title: 'Define requirements and scope', description: 'Write down what the project should do and its boundaries', estimatedMinutes: 45, priority: 'high', category: 'work' },
      { title: 'Plan architecture and tech stack', description: 'Decide on tools, structure, and approach', estimatedMinutes: 60, priority: 'high', category: 'work' },
      { title: 'Set up project structure', description: 'Initialize repo, install dependencies, create folder structure', estimatedMinutes: 30, priority: 'medium', category: 'work' },
      { title: 'Build core features', description: 'Implement the main functionality of the project', estimatedMinutes: 180, priority: 'critical', category: 'work' },
      { title: 'Test and fix bugs', description: 'Verify everything works and fix any issues', estimatedMinutes: 60, priority: 'high', category: 'work' },
      { title: 'Deploy and document', description: 'Deploy to production and write basic documentation', estimatedMinutes: 45, priority: 'medium', category: 'work' },
    ];
  }

  return [
    { title: 'Research and gather information', description: 'Collect all relevant information needed to start', estimatedMinutes: 45, priority: 'high', category: 'work' },
    { title: 'Create a detailed plan', description: 'Break down the goal into clear steps with timelines', estimatedMinutes: 30, priority: 'high', category: 'work' },
    { title: 'Execute first milestone', description: 'Complete the first and most important part of the task', estimatedMinutes: 90, priority: 'critical', category: 'work' },
    { title: 'Review progress and adjust', description: 'Check what has been done and refine next steps', estimatedMinutes: 30, priority: 'medium', category: 'work' },
    { title: 'Complete and wrap up', description: 'Finish remaining work and ensure quality', estimatedMinutes: 60, priority: 'high', category: 'work' },
  ];
};

export const plannerBreakdown = async (req, res, next) => {
  try {
    const { goal } = req.body;
    if (!goal) return res.status(400).json({ message: 'Goal is required' });

    const prompt = `You are an expert productivity coach. Break down the following goal into specific, actionable tasks.

Goal: "${goal}"

Return ONLY a valid JSON array (no markdown, no code blocks, just raw JSON) like this:
[
  {"title": "Task title", "description": "Brief description", "estimatedMinutes": 60, "priority": "high", "category": "work"},
  ...
]

Rules:
- 3 to 7 tasks maximum
- estimatedMinutes between 15 and 240
- priority must be one of: low, medium, high, critical
- category must be one of: work, study, personal, health, finance, other
- Make tasks specific and immediately actionable`;

    let tasks;
    let usedFallback = false;

    try {
      const raw = await geminiChat(prompt);
      const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim();
      tasks = JSON.parse(cleaned);
    } catch (err) {
      if (isQuotaError(err)) {
        tasks = smartFallbackPlan(goal);
        usedFallback = true;
      } else {
        return next(err);
      }
    }

    await AIHistory.create({
      user: req.user._id,
      type: 'planner',
      prompt: goal,
      response: JSON.stringify(tasks),
      metadata: { taskCount: tasks.length, usedFallback },
    });

    res.json({ tasks, usedFallback });
  } catch (err) {
    next(err);
  }
};

export const generateReflection = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const completedToday = await Task.find({
      user: userId,
      status: 'completed',
      completedAt: { $gte: startOfDay },
    }).lean();

    const pendingTasks = await Task.find({
      user: userId,
      status: { $in: ['pending', 'in_progress'] },
    }).sort({ deadline: 1 }).limit(5).lean();

    const tomorrowPriorities = pendingTasks.slice(0, 3).map((t) => t.title);
    let summary;
    let usedFallback = false;

    const prompt = `You are AURA, an AI User Responsibility Assistance. Generate a concise, warm end-of-day reflection for a user.

Completed today: ${completedToday.map((t) => t.title).join(', ') || 'Nothing completed yet'}
Still pending: ${pendingTasks.map((t) => t.title).join(', ') || 'None'}

Write a 2-3 sentence reflection that:
1. Acknowledges what they accomplished (or encourages if nothing done)
2. Identifies the most important pending priority
3. Ends with one actionable suggestion for tomorrow

Keep it human, warm, and under 100 words. No bullet points.`;

    try {
      summary = await geminiChat(prompt);
    } catch (err) {
      if (isQuotaError(err)) {
        usedFallback = true;
        const done = completedToday.length;
        const pending = pendingTasks.length;
        if (done > 0) {
          summary = `Great work today — you completed ${done} task${done > 1 ? 's' : ''}! ${pending > 0 ? `You still have ${pending} task${pending > 1 ? 's' : ''} pending, with "${tomorrowPriorities[0]}" being the most important.` : 'All tasks are clear!'} Start tomorrow fresh by tackling your top priority first thing in the morning.`;
        } else {
          summary = `Today was a slow start, and that's okay. ${pending > 0 ? `Your most important pending task is "${tomorrowPriorities[0]}" — it needs your attention.` : 'Your task list is clear.'} Tomorrow, commit to one focused work session to build momentum again.`;
        }
      } else {
        return next(err);
      }
    }

    const reflection = await Reflection.create({
      user: userId,
      date: startOfDay,
      completedTasks: completedToday.map((t) => t._id),
      pendingTasks: pendingTasks.map((t) => t._id),
      summary,
      tomorrowPriorities,
      aiInsights: summary,
    });

    await AIHistory.create({
      user: userId,
      type: 'reflection',
      prompt: `Daily reflection for ${startOfDay.toDateString()}`,
      response: summary,
      metadata: { usedFallback },
    });

    res.json({ reflection, summary, tomorrowPriorities, usedFallback });
  } catch (err) {
    next(err);
  }
};

export const getDailyMission = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const tasks = await Task.find({
      user: userId,
      status: { $in: ['pending', 'in_progress'] },
      deadline: { $lte: endOfDay },
    }).sort({ deadline: 1 }).limit(5).lean();

    if (!tasks.length) {
      return res.json({ mission: null, message: "You're all caught up! No pending tasks for today." });
    }

    const topTask = tasks[0];
    const deadline = new Date(topTask.deadline);
    const timeStr = deadline.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    res.json({
      mission: {
        task: topTask,
        statement: `${topTask.title} by ${timeStr}`,
        hoursLeft: Math.max(0, Math.round((deadline - now) / (1000 * 60 * 60))),
      },
    });
  } catch (err) {
    next(err);
  }
};
