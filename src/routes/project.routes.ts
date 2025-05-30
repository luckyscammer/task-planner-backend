import { Router } from 'express';
import * as projectController from '@/controllers/project.controller';
import { validate } from '@/middleware/validate';
import { ProjectSchema, ProjectUpdateSchema } from '@/validators/project.schema';

const router = Router();

// @ts-ignore
router.post('/', validate(ProjectSchema), projectController.createProject);
router.get('/', projectController.getAllProjects);
// @ts-ignore
router.get('/:id', projectController.getProjectById);
// @ts-ignore
router.put('/:id', validate(ProjectUpdateSchema), projectController.updateProject);
// @ts-ignore
router.delete('/:id', projectController.deleteProject);
// @ts-ignore
router.get('/:id/status', projectController.getProjectStatusController);

export default router;
