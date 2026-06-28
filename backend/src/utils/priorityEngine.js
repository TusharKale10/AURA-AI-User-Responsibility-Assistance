/**
 * Priority scoring algorithm.
 * Higher score = higher priority.
 * Factors: urgency (deadline proximity), importance (user-set priority),
 * effort (estimated time), completion pressure (status).
 */
export const calculatePriorityScore = (task) => {
  const now = Date.now();
  const deadline = new Date(task.deadline).getTime();
  const hoursLeft = Math.max(0, (deadline - now) / (1000 * 60 * 60));

  const urgencyScore = hoursLeft === 0 ? 100 : Math.max(0, 100 - hoursLeft * 0.5);

  const importanceMap = { low: 10, medium: 30, high: 60, critical: 100 };
  const importanceScore = importanceMap[task.priority] ?? 30;

  const effortPenalty = Math.min(30, task.estimatedMinutes / 10);

  const score = urgencyScore * 0.5 + importanceScore * 0.4 - effortPenalty * 0.1;
  return Math.round(Math.min(100, Math.max(0, score)));
};

export const calculateRiskLevel = (task) => {
  const now = Date.now();
  const deadline = new Date(task.deadline).getTime();
  const hoursLeft = (deadline - now) / (1000 * 60 * 60);
  const hoursNeeded = task.estimatedMinutes / 60;

  if (task.status === 'completed') return 'safe';
  if (hoursLeft <= 0) return 'high';

  const buffer = hoursLeft - hoursNeeded;
  if (buffer < 0) return 'high';
  if (buffer < hoursNeeded * 0.5) return 'moderate';
  return 'safe';
};

export const enrichTasksWithScores = (tasks) =>
  tasks.map((t) => {
    const plain = t.toObject ? t.toObject() : { ...t };
    plain.priorityScore = calculatePriorityScore(plain);
    plain.riskLevel = calculateRiskLevel(plain);
    return plain;
  });
