import { Router } from 'express';
import protect from '../middlewares/auth.js';
import { generateKnowledge, getKnowledge, convertItemToTask, deleteKnowledge } from '../controllers/knowledgeController.js';

const router = Router();
router.use(protect);
router.get('/', getKnowledge);
router.post('/generate', generateKnowledge);
router.post('/convert-to-task', convertItemToTask);
router.delete('/:id', deleteKnowledge);
export default router;
