import { Router } from 'express';
import protect from '../middlewares/auth.js';
import { getOverview, getTrends, generateWeeklyReport, getProductivityScore } from '../controllers/analyticsController.js';

const router = Router();
router.use(protect);
router.get('/overview', getOverview);
router.get('/trends', getTrends);
router.get('/productivity', getProductivityScore);
router.post('/generate-report', generateWeeklyReport);
export default router;
