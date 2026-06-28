import Task from '../models/Task.js';
import { geminiChat } from '../utils/gemini.js';
import { calculatePriorityScore, calculateRiskLevel } from '../utils/priorityEngine.js';

export const analyzeDecision = async (req, res, next) => {
  try {
    const { task1Id, task2Id, question } = req.body;

    // Free-form question mode
    if (question && !task1Id) {
      const pending = await Task.find({
        user: req.user._id,
        status: { $in: ['pending', 'in_progress'] },
      }).sort({ deadline: 1 }).limit(8).lean();

      const taskList = pending
        .map((t, i) => `${i + 1}. "${t.title}" — ${t.priority} priority, deadline: ${t.deadline ? new Date(t.deadline).toLocaleDateString() : 'none'}`)
        .join('\n');

      let result;
      try {
        const raw = await geminiChat(
          `You are AURA. User asks: "${question}"\n\nTheir tasks:\n${taskList}\n\nRespond with JSON only:\n{"answer":"2-3 sentence response","topRecommendation":"single action","confidence":80,"reasoning":"why"}`
        );
        result = JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim());
      } catch (_) {
        const top = pending[0];
        result = {
          answer: `Focus on "${top?.title || 'your top task'}" first — it has the most urgent deadline.`,
          topRecommendation: top ? `Start "${top.title}" immediately.` : 'Review your task list.',
          confidence: 70,
          reasoning: 'Based on deadline proximity and priority scores.',
        };
      }

      return res.json({ freeForm: true, tasks: pending.slice(0, 3), ...result });
    }

    if (!task1Id || !task2Id) return res.status(400).json({ message: 'Provide task1Id and task2Id, or a question' });

    const [t1raw, t2raw] = await Promise.all([
      Task.findOne({ _id: task1Id, user: req.user._id }).lean(),
      Task.findOne({ _id: task2Id, user: req.user._id }).lean(),
    ]);
    if (!t1raw || !t2raw) return res.status(404).json({ message: 'One or both tasks not found' });

    const now = new Date();
    const enrich = (t) => ({
      ...t,
      priorityScore: calculatePriorityScore(t),
      riskLevel: calculateRiskLevel(t),
      hoursLeft: t.deadline ? Math.max(0, (new Date(t.deadline) - now) / 3600000) : 999,
    });

    const t1 = enrich(t1raw);
    const t2 = enrich(t2raw);

    const prompt = `You are AURA, AI productivity advisor. Decide which task to do first.

Task A: "${t1.title}" | Priority: ${t1.priority} | Score: ${t1.priorityScore}/100 | Risk: ${t1.riskLevel} | Hours left: ${Math.round(t1.hoursLeft)}h | Est: ${t1.estimatedMinutes}min | Category: ${t1.category}
Task B: "${t2.title}" | Priority: ${t2.priority} | Score: ${t2.priorityScore}/100 | Risk: ${t2.riskLevel} | Hours left: ${Math.round(t2.hoursLeft)}h | Est: ${t2.estimatedMinutes}min | Category: ${t2.category}

Return valid JSON only:
{"winner":"A or B","confidence":85,"reasoning":"One sentence why","recommendation":"One action sentence","tradeoffs":"What you sacrifice","estimatedImpact":"High/Medium/Low","successProbability":91}`;

    let winner, confidence, reasoning, recommendation, tradeoffs, estimatedImpact, successProbability;

    try {
      const raw = await geminiChat(prompt);
      const parsed = JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim());
      winner = parsed.winner === 'A' ? t1 : t2;
      const loser = parsed.winner === 'A' ? t2 : t1;
      confidence = parsed.confidence || 80;
      reasoning = parsed.reasoning;
      recommendation = parsed.recommendation;
      tradeoffs = parsed.tradeoffs;
      estimatedImpact = parsed.estimatedImpact || 'Medium';
      successProbability = parsed.successProbability || 85;

      return res.json({ recommended: winner, deferred: loser, confidence, reasoning, recommendation, tradeoffs, estimatedImpact, successProbability, scores: { [t1._id]: t1.priorityScore, [t2._id]: t2.priorityScore } });
    } catch (_) {
      const w = t1.priorityScore >= t2.priorityScore ? t1 : t2;
      const l = t1.priorityScore >= t2.priorityScore ? t2 : t1;
      return res.json({
        recommended: w,
        deferred: l,
        confidence: 74,
        reasoning: `"${w.title}" has a higher priority score (${w.priorityScore}/100) and ${w.hoursLeft < l.hoursLeft ? 'less time left' : 'higher importance'}.`,
        recommendation: `Complete "${w.title}" first.`,
        tradeoffs: `"${l.title}" will be slightly delayed.`,
        estimatedImpact: w.priority === 'critical' ? 'High' : 'Medium',
        successProbability: 82,
        scores: { [t1._id]: t1.priorityScore, [t2._id]: t2.priorityScore },
      });
    }
  } catch (err) {
    next(err);
  }
};

export const getTasksForDecision = async (req, res, next) => {
  try {
    const tasks = await Task.find({
      user: req.user._id,
      status: { $in: ['pending', 'in_progress'] },
    }).sort({ deadline: 1 }).limit(20).lean();

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
