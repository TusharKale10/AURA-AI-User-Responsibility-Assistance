import mongoose from 'mongoose';

const productivityDNASchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    metrics: {
      completionRate: { type: Number, default: 0 },
      missedDeadlines: { type: Number, default: 0 },
      avgEstimationError: { type: Number, default: 0 },
      mostProductiveDays: [String],
      mostProductiveSlots: [{ hour: Number, score: Number }],
      tasksByCategory: { type: mongoose.Schema.Types.Mixed, default: {} },
    },
    profile: {
      morningProductivity: { type: Number, default: 50 },
      codingEfficiency: { type: Number, default: 50 },
      meetingProductivity: { type: Number, default: 50 },
      deepFocusWindow: { type: String, default: '9 AM – 11 AM' },
      peakLearningTime: { type: String, default: '7 PM – 9 PM' },
      avgTaskCompletionAccuracy: { type: Number, default: 50 },
      weeklyTrend: { type: Number, default: 0 },
      consistencyScore: { type: Number, default: 0 },
    },
    aiInsights: { type: String, default: '' },
    lastComputedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model('ProductivityDNA', productivityDNASchema);
