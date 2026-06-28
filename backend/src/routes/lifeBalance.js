import { Router } from 'express';
import protect from '../middlewares/auth.js';
import { getLifeBalance, saveLifeBalance, recalculate, getHistory } from '../controllers/lifeBalanceController.js';

const router = Router();
router.use(protect);
router.get('/', getLifeBalance);
router.post('/', saveLifeBalance);
router.post('/recalculate', recalculate);
router.get('/history', getHistory);
export default router;
