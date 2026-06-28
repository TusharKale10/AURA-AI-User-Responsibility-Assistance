import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import dashboardRoutes from './routes/dashboard.js';
import aiRoutes from './routes/ai.js';
import goalsRoutes from './routes/goals.js';
import dnaRoutes from './routes/dna.js';
import decisionRoutes from './routes/decision.js';
import knowledgeRoutes from './routes/knowledge.js';
import lifeBalanceRoutes from './routes/lifeBalance.js';
import adaptiveRoutes from './routes/adaptive.js';
import analyticsRoutes from './routes/analytics.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/dna', dnaRoutes);
app.use('/api/decision', decisionRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/life-balance', lifeBalanceRoutes);
app.use('/api/adaptive', adaptiveRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/api/health', (_, res) => res.json({ status: 'ok', version: '2.0.0' }));

app.use(errorHandler);

export default app;
