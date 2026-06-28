import { Router } from 'express';
import protect from '../middlewares/auth.js';
import { getProductivityDNA, refreshDNA } from '../controllers/dnaController.js';

const router = Router();
router.use(protect);
router.get('/', getProductivityDNA);
router.post('/refresh', refreshDNA);
export default router;
