import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    deadline: { type: Date, required: true },
    estimatedMinutes: { type: Number, required: true, min: 1 },
    category: {
      type: String,
      enum: ['work', 'study', 'personal', 'health', 'finance', 'other'],
      default: 'work',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    priorityScore: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    riskLevel: {
      type: String,
      enum: ['safe', 'moderate', 'high'],
      default: 'safe',
    },
    dependencies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    tags: [String],
    completedAt: { type: Date },
    isAIGenerated: { type: Boolean, default: false },
    parentGoal: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal' },
  },
  { timestamps: true }
);

taskSchema.index({ user: 1, deadline: 1 });
taskSchema.index({ user: 1, status: 1 });

export default mongoose.model('Task', taskSchema);
