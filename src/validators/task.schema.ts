import { z } from 'zod';

export const TaskSchema = z.object({
  name: z.string().min(1, 'Task name is required'),
  description: z.string().optional(),
  status: z.string().min(1, 'Status is required'),
  projectId: z.string().uuid('Invalid project ID'),
  deadline: z.string().datetime().optional(),
  progress: z.number().min(0).max(100).optional(),
});

export const TaskUpdateSchema = TaskSchema.partial();
