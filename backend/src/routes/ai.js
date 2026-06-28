import { Router } from 'express';
import { plannerBreakdown, generateReflection, getDailyMission } from '../controllers/aiController.js';
import protect from '../middlewares/auth.js';

const router = Router();

router.use(protect);

router.post('/planner', plannerBreakdown);
router.post('/reflection', generateReflection);
router.get('/mission', getDailyMission);

export default router;
