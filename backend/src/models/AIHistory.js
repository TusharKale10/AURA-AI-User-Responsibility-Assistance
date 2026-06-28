import mongoose from 'mongoose';

const aiHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['planner', 'reflection', 'recommendation', 'mission'],
      required: true,
    },
    prompt: { type: String, required: true },
    response: { type: String, required: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

aiHistorySchema.index({ user: 1, type: 1, createdAt: -1 });

export default mongoose.model('AIHistory', aiHistorySchema);
