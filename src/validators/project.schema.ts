import { z } from 'zod';

export const ProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  createdById: z.string().uuid('Invalid user ID format (must be UUID)'),
});

export const ProjectUpdateSchema = ProjectSchema.partial();
