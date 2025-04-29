import { z } from 'zod';

export const TaskStatusEnum = z.enum([
  'UNASSIGNED',
  'ASSIGNED',
  'IN_PROGRESS',
  'PENDING_REVIEW',
  'COMPLETED',
]);

export const TaskSchema = z.object({
  name: z.string().min(1, 'Task name is required'),
  description: z.string().optional(),
  status: TaskStatusEnum,
  projectId: z.string().uuid('Invalid project ID'),
  userId: z.string().uuid().optional(),
  deadline: z.string().datetime({ offset: true }).optional().nullable(),
  progress: z.number().min(0).max(100).optional(),
});


export const TaskUpdateSchema = TaskSchema.partial();
