import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  getTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  toggleTask,
} from '../controllers/task.controller';
import {
  taskCreateValidation,
  taskUpdateValidation,
  taskListValidation,
} from '../middleware/validation.middleware';

const router = Router();

// All task routes require authentication
router.use(authenticate);

router.get('/', taskListValidation, getTasks);
router.post('/', taskCreateValidation, createTask);
router.get('/:id', getTask);
router.patch('/:id', taskUpdateValidation, updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/toggle', toggleTask);

export default router;
