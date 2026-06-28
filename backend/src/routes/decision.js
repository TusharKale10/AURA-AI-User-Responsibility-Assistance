import { Router } from 'express';
import protect from '../middlewares/auth.js';
import { analyzeDecision, getTasksForDecision } from '../controllers/decisionController.js';

const router = Router();
router.use(protect);
router.get('/tasks', getTasksForDecision);
router.post('/analyze', analyzeDecision);
export default router;
