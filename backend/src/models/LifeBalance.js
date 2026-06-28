import mongoose from 'mongoose';

const lifeBalanceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    scores: {
      career: { type: Number, default: 50, min: 0, max: 100 },
      learning: { type: Number, default: 50, min: 0, max: 100 },
      health: { type: Number, default: 50, min: 0, max: 100 },
      finance: { type: Number, default: 50, min: 0, max: 100 },
      personal_growth: { type: Number, default: 50, min: 0, max: 100 },
      habits: { type: Number, default: 50, min: 0, max: 100 },
      relationships: { type: Number, default: 50, min: 0, max: 100 },
    },
    suggestions: [String],
    aiInsights: { type: String, default: '' },
  },
  { timestamps: true }
);

lifeBalanceSchema.index({ user: 1, date: -1 });

export default mongoose.model('LifeBalance', lifeBalanceSchema);
