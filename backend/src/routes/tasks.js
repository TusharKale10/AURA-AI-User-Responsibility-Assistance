import { Router } from 'express';
import { getTasks, createTask, updateTask, deleteTask, getTask } from '../controllers/taskController.js';
import protect from '../middlewares/auth.js';

const router = Router();

router.use(protect);

router.get('/', getTasks);
router.post('/', createTask);
router.get('/:id', getTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
