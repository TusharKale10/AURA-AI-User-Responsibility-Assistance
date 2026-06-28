import Task from '../models/Task.js';
import Goal from '../models/Goal.js';
import LifeBalance from '../models/LifeBalance.js';
import { geminiChat } from './gemini.js';

const SOCIAL_KEYWORDS = [
  'friend', 'family', 'social', 'call', 'lunch', 'dinner', 'meet',
  'team', 'colleague', 'parent', 'sibling', 'partner', 'date', 'coffee',
];

function buildScores(tasks, goals) {
  const b = {
    career:          { total: 0, done: 0 },
    learning:        { total: 0, done: 0 },
    health:          { total: 0, done: 0 },
    finance:         { total: 0, done: 0 },
    personal_growth: { total: 0, done: 0 },
    habits:          { total: tasks.length, done: 0 },
    relationships:   { total: 0, done: 0 },
  };

  for (const t of tasks) {
    const done = t.status === 'completed';
    if (done) b.habits.done++;

    switch (t.category) {
      case 'work':
        b.career.total++; if (done) b.career.done++;
        break;
      case 'study':
        b.learning.total++; if (done) b.learning.done++;
        break;
      case 'health':
        b.health.total++; if (done) b.health.done++;
        break;
      case 'finance':
        b.finance.total++; if (done) b.finance.done++;
        break;
      case 'personal': {
        const text = `${t.title} ${t.description || ''}`.toLowerCase();
        const isSocial = SOCIAL_KEYWORDS.some((kw) => text.includes(kw));
        if (isSocial) {
          b.relationships.total++; if (done) b.relationships.done++;
        } else {
          b.personal_growth.total++; if (done) b.personal_growth.done++;
        }
        break;
      }
      // 'other' only feeds habits (already counted)
    }
  }

  const goalCats = new Set(goals.map((g) => g.category));
  const GOAL_MAP = {
    career:          ['career', 'work'],
    learning:        ['learning', 'study'],
    health:          ['health'],
    finance:         ['finance'],
    personal_growth: ['personal_growth', 'personal'],
    relationships:   ['relationships'],
    habits:          [],
  };

  const goalBonus = (dim) =>
    (GOAL_MAP[dim] || []).some((c) => goalCats.has(c)) ? 15 : 0;

  const calc = (bucket, dim) => {
    const bonus = goalBonus(dim);
    if (bucket.total === 0) return bonus;
    return Math.min(100, Math.round((bucket.done / bucket.total) * 85) + bonus);
  };

  return {
    career:          calc(b.career,          'career'),
    learning:        calc(b.learning,        'learning'),
    health:          calc(b.health,          'health'),
    finance:         calc(b.finance,         'finance'),
    personal_growth: calc(b.personal_growth, 'personal_growth'),
    habits:          calc(b.habits,          'habits'),
    relationships:   calc(b.relationships,   'relationships'),
  };
}

export async function computeAndSaveBalance(userId) {
  const [tasks, goals] = await Promise.all([
    Task.find({ user: userId }).lean(),
    Goal.find({ user: userId, status: 'active' }).lean(),
  ]);

  const scores = buildScores(tasks, goals);
  const sorted = Object.entries(scores).sort((a, b) => a[1] - b[1]);
  const lowest3 = sorted.slice(0, 3).map(([k]) => k.replace(/_/g, ' '));
  const highest = sorted[sorted.length - 1];

  let aiInsights = '';
  let suggestions = [];

  try {
    const raw = await geminiChat(
      `Life balance scores out of 100 (computed from completed tasks):\n${sorted.map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`).join('\n')}\n\nRespond with JSON only:\n{"insights":"2-sentence observation about balance and what to focus on","suggestions":["Specific actionable step 1","Specific actionable step 2","Specific actionable step 3"]}`
    );
    const parsed = JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim());
    aiInsights = parsed.insights || '';
    suggestions = parsed.suggestions || [];
  } catch {
    const [low1, low2, low3] = lowest3;
    aiInsights = `Your lowest scores in ${low1}, ${low2}, and ${low3} indicate a critical need to invest in these areas. Your ${highest[0].replace(/_/g, ' ')} (${highest[1]}/100) is your strongest anchor — use that momentum to lift the rest.`;
    suggestions = [
      `Dedicate 20 minutes every morning to a ${low1} activity`,
      `Reach out to one person this week to strengthen ${low2}`,
      `Create a single concrete task for ${low3} and complete it before the weekend`,
    ];
  }

  return LifeBalance.create({
    user: userId,
    date: new Date(),
    scores,
    suggestions,
    aiInsights,
  });
}
