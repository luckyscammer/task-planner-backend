import { z } from 'zod';

export const UserSchema = z.object({
  fullName: z.string().min(1, 'Name is required'),
  email: z.string().email('Incorrect email format'),
  role: z.enum(['ADMIN', 'MANAGER', 'USER']),
});

export const UserUpdateSchema = UserSchema.partial();
