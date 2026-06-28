import KnowledgeBase from '../models/KnowledgeBase.js';
import Goal from '../models/Goal.js';
import Task from '../models/Task.js';
import { geminiChat, isQuotaError } from '../utils/gemini.js';

const getFallbackKnowledge = (goalTitle) => {
  const lower = goalTitle.toLowerCase();
  const isInterview = lower.includes('interview') || lower.includes('placement') || lower.includes('job');
  const isHackathon = lower.includes('hackathon') || lower.includes('competition');
  const isDSA = lower.includes('dsa') || lower.includes('leetcode') || lower.includes('algorithm');

  if (isDSA || isInterview) {
    return {
      summary: `Complete preparation guide for ${goalTitle}`,
      estimatedPrepHours: 80,
      items: [
        { type: 'topic', title: 'Arrays & Strings', content: 'Two pointers, sliding window, prefix sum — most frequent topic' },
        { type: 'topic', title: 'Trees & Graphs', content: 'BFS, DFS, topological sort — appears in 40% of interviews' },
        { type: 'topic', title: 'Dynamic Programming', content: 'Memoization and tabulation for optimization problems' },
        { type: 'checklist', title: 'Resume polish', content: 'Quantify all achievements with numbers and impact' },
        { type: 'checklist', title: '10 Mock Interviews', content: 'Use Pramp, Interviewing.io, or peer practice' },
        { type: 'resource', title: 'LeetCode Top 150', content: 'Solve in priority order: Easy → Medium → Hard' },
        { type: 'question', title: 'Tell me about yourself', content: 'Prepare 90-second structured answer using Present-Past-Future framework' },
        { type: 'question', title: 'Behavioral (STAR format)', content: 'Situation, Task, Action, Result — prepare 5 stories' },
        { type: 'timeline', title: 'Week 1: Foundations', content: 'Arrays, Strings, Sorting — 20 easy problems' },
        { type: 'timeline', title: 'Week 2: Core DS', content: 'Trees, Graphs, Linked Lists — 25 medium problems' },
        { type: 'timeline', title: 'Week 3–4: DP + Mock', content: 'Dynamic programming + full mock interviews daily' },
        { type: 'tip', title: 'Think Out Loud', content: 'Interviewers score your process as much as the answer' },
      ],
    };
  }

  if (isHackathon) {
    return {
      summary: 'Complete hackathon execution guide',
      estimatedPrepHours: 24,
      items: [
        { type: 'checklist', title: 'Problem Statement', content: 'Define problem, target user, and unique value prop in <60 seconds' },
        { type: 'checklist', title: 'Tech Stack Decision', content: 'Use what you know best — zero time for learning during hackathon' },
        { type: 'checklist', title: 'GitHub Repo Setup', content: 'README with problem, solution, tech stack, and demo link' },
        { type: 'timeline', title: 'Hour 0–4: Foundation', content: 'Project setup, auth, database schema, core API' },
        { type: 'timeline', title: 'Hour 4–12: Core Features', content: 'Build the 3 main differentiating features' },
        { type: 'timeline', title: 'Hour 12–18: Polish', content: 'UI improvements, edge cases, deploy to Vercel/Render' },
        { type: 'timeline', title: 'Hour 18–24: Demo Prep', content: '3-minute demo script, slides, judging pitch' },
        { type: 'tip', title: 'Working demo wins', content: 'Judges remember a demo that worked over perfect architecture' },
        { type: 'tip', title: 'Tell the story', content: 'Connect your solution to a real user problem with emotion and data' },
        { type: 'checklist', title: 'Deployment Checklist', content: 'Environment variables, seed data, test all flows before judging' },
      ],
    };
  }

  return {
    summary: `Knowledge pack for: ${goalTitle}`,
    estimatedPrepHours: 40,
    items: [
      { type: 'checklist', title: 'Define Success Criteria', content: 'Write down exactly what done looks like' },
      { type: 'timeline', title: 'Week 1: Research', content: 'Gather all information and understand the domain deeply' },
      { type: 'timeline', title: 'Week 2: Plan', content: 'Create detailed action plan with daily milestones' },
      { type: 'timeline', title: 'Week 3–4: Execute', content: 'Execute plan, track daily, adjust weekly' },
      { type: 'resource', title: 'Top 2–3 Learning Resources', content: 'Find the best books, courses, or mentors in this area' },
      { type: 'tip', title: 'Daily consistency wins', content: '30 focused minutes daily beats 8-hour weekend sessions' },
      { type: 'question', title: 'Identify the 3 blockers', content: 'What will most likely stop you? Plan around those now' },
      { type: 'checklist', title: 'Weekly Review', content: 'Every Sunday: what worked, what didn\'t, adjust next week' },
    ],
  };
};

export const generateKnowledge = async (req, res, next) => {
  try {
    const { goalId, goalTitle } = req.body;
    if (!goalTitle) return res.status(400).json({ message: 'Goal title is required' });

    const prompt = `You are AURA, an expert knowledge curator. Create a comprehensive preparation pack for: "${goalTitle}"

Return ONLY valid JSON (no markdown, no code blocks):
{
  "summary": "One sentence describing this knowledge pack",
  "estimatedPrepHours": 40,
  "items": [
    {"type": "checklist", "title": "Item title", "content": "Brief actionable description"},
    ...
  ]
}

Rules:
- 10–14 items total
- Distribute types: 3 checklists, 3 topics, 2 resources, 2 timelines, 2 tips, 1 question minimum
- type must be exactly one of: checklist, resource, topic, question, timeline, tip
- Make each item specific and immediately actionable for this exact goal
- estimatedPrepHours should be realistic`;

    let data;
    let usedFallback = false;

    try {
      const raw = await geminiChat(prompt);
      const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim();
      data = JSON.parse(cleaned);
    } catch (err) {
      if (isQuotaError(err)) {
        data = getFallbackKnowledge(goalTitle);
        usedFallback = true;
      } else {
        data = getFallbackKnowledge(goalTitle);
        usedFallback = true;
      }
    }

    const filter = { user: req.user._id, ...(goalId ? { goal: goalId } : { goalTitle }) };
    const existing = await KnowledgeBase.findOne(filter);

    let kb;
    if (existing) {
      existing.items = data.items.map((item, i) => ({ ...item, order: i }));
      existing.summary = data.summary;
      existing.estimatedPrepHours = data.estimatedPrepHours;
      kb = await existing.save();
    } else {
      kb = await KnowledgeBase.create({
        user: req.user._id,
        goal: goalId || null,
        goalTitle,
        items: data.items.map((item, i) => ({ ...item, order: i })),
        summary: data.summary,
        estimatedPrepHours: data.estimatedPrepHours,
      });
    }

    if (goalId) {
      await Goal.findOneAndUpdate({ _id: goalId, user: req.user._id }, { knowledgeGenerated: true });
    }

    res.json({ knowledge: kb, usedFallback });
  } catch (err) {
    next(err);
  }
};

export const getKnowledge = async (req, res, next) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.goalId) filter.goal = req.query.goalId;
    const knowledge = await KnowledgeBase.find(filter).sort({ createdAt: -1 });
    res.json({ knowledge });
  } catch (err) {
    next(err);
  }
};

export const convertItemToTask = async (req, res, next) => {
  try {
    const { knowledgeId, itemId, deadline, priority } = req.body;

    const kb = await KnowledgeBase.findOne({ _id: knowledgeId, user: req.user._id });
    if (!kb) return res.status(404).json({ message: 'Knowledge base not found' });

    const item = kb.items.id(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const defaultDeadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    const task = await Task.create({
      user: req.user._id,
      title: item.title,
      description: item.content || '',
      deadline: deadline ? new Date(deadline) : defaultDeadline,
      estimatedMinutes: 60,
      category: 'study',
      priority: priority || 'medium',
      isAIGenerated: true,
    });

    item.convertedToTask = true;
    item.taskId = task._id;
    await kb.save();

    res.json({ task, knowledge: kb });
  } catch (err) {
    next(err);
  }
};

export const deleteKnowledge = async (req, res, next) => {
  try {
    await KnowledgeBase.deleteOne({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
