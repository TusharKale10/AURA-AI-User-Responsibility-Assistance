import { Router } from 'express';
import protect from '../middlewares/auth.js';
import {
  getGoals, createGoal, updateGoal, deleteGoal,
  addMilestone, toggleMilestone, deleteMilestone,
  getConflicts, getGoalHeatmap,
} from '../controllers/goalsController.js';

const router = Router();
router.use(protect);

router.get('/conflicts', getConflicts);
router.get('/', getGoals);
router.post('/', createGoal);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);
router.post('/:id/milestones', addMilestone);
router.patch('/:id/milestones/:milestoneId/toggle', toggleMilestone);
router.delete('/:id/milestones/:milestoneId', deleteMilestone);
router.get('/:id/heatmap', getGoalHeatmap);

export default router;
