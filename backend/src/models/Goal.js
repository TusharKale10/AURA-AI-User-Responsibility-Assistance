import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  deadline: Date,
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  order: { type: Number, default: 0 },
  completedAt: Date,
}, { _id: true, timestamps: true });

const goalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    deadline: Date,
    status: { type: String, enum: ['active', 'completed', 'paused', 'cancelled'], default: 'active' },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    category: {
      type: String,
      enum: ['career', 'learning', 'health', 'finance', 'personal_growth', 'habits', 'relationships', 'other'],
      default: 'other',
    },
    estimatedHours: { type: Number, default: 0 },
    milestones: [milestoneSchema],
    conflictSeverity: { type: String, enum: ['none', 'low', 'medium', 'high'], default: 'none' },
    conflictDetails: { type: String, default: '' },
    aiInsights: { type: String, default: '' },
    knowledgeGenerated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

goalSchema.index({ user: 1, status: 1 });
goalSchema.index({ user: 1, deadline: 1 });

export default mongoose.model('Goal', goalSchema);
