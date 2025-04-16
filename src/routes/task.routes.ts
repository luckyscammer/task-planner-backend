import { Router } from 'express';
import * as taskController from '@/controllers/task.controller';
import { validate } from '@/middleware/validate';
import { TaskSchema, TaskUpdateSchema } from '@/validators/task.schema';

const router = Router();

// @ts-ignore
router.post('/', validate(TaskSchema), taskController.createTask);
router.get('/', taskController.getAllTasks);
// @ts-ignore
router.get('/:id', taskController.getTaskById);
// @ts-ignore
router.put('/:id', validate(TaskUpdateSchema), taskController.updateTask);
// @ts-ignore
router.delete('/:id', taskController.deleteTask);
router.get('/filter', taskController.getFilteredTasks);

export default router;
