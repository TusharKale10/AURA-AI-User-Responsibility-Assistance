import mongoose from 'mongoose';

const knowledgeItemSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['checklist', 'resource', 'topic', 'question', 'timeline', 'tip'],
    default: 'resource',
  },
  title: { type: String, required: true },
  content: { type: String, default: '' },
  convertedToTask: { type: Boolean, default: false },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  order: { type: Number, default: 0 },
}, { _id: true });

const knowledgeBaseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    goal: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal', default: null },
    goalTitle: { type: String, required: true },
    items: [knowledgeItemSchema],
    summary: { type: String, default: '' },
    estimatedPrepHours: { type: Number, default: 0 },
  },
  { timestamps: true }
);

knowledgeBaseSchema.index({ user: 1, createdAt: -1 });
knowledgeBaseSchema.index({ user: 1, goal: 1 });

export default mongoose.model('KnowledgeBase', knowledgeBaseSchema);
