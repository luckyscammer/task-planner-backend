import { Router } from 'express';
import * as controller from '@/controllers/taskAssignment.controller';

const router = Router();

// @ts-ignore
router.post('/', controller.assignUser);
router.get('/', controller.getAll);
router.get('/user/:id', controller.getTasksOfUser);
router.get('/task/:id', controller.getUsersOfTask);
router.delete('/', controller.unassignUser);

export default router;
