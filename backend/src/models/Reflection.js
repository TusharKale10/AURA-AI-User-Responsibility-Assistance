import mongoose from 'mongoose';

const reflectionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    completedTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    pendingTasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    summary: { type: String },
    tomorrowPriorities: [String],
    mood: { type: Number, min: 1, max: 5 },
    aiInsights: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Reflection', reflectionSchema);
