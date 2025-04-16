import { Router } from 'express';
import * as taskAssignmentController from '@/controllers/taskAssignment.controller';

const router = Router();

// @ts-ignore
router.post('/', taskAssignmentController.assignUser);
router.get('/', taskAssignmentController.getAll);
router.get('/user/:id', taskAssignmentController.getTasksOfUser);
router.get('/task/:id', taskAssignmentController.getUsersOfTask);
// @ts-ignore
router.get('/one', taskAssignmentController.getAssignment);
// @ts-ignore
router.put('/', taskAssignmentController.updateAssignment);
router.delete('/', taskAssignmentController.unassignUser);

export default router;
