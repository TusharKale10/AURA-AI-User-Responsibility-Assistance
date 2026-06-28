import { Router } from 'express';
import protect from '../middlewares/auth.js';
import { getAdaptivePlan, triggerReschedule } from '../controllers/adaptiveController.js';

const router = Router();
router.use(protect);
router.get('/plan', getAdaptivePlan);
router.post('/reschedule', triggerReschedule);
export default router;
