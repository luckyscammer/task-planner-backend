import { z } from 'zod';

export const UserSchema = z.object({
  fullName: z.string().min(1, 'Name is required'),
  email: z.string().email('Incorrect email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['ADMIN', 'MANAGER', 'USER']),
});

export const UserUpdateSchema = UserSchema.partial();
