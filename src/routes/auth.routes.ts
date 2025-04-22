import { validate } from "@/middleware/validate";
import { Router } from 'express';
import { register, login, getMe } from '@/controllers/auth.controller';
import { authMiddleware } from '@/middleware/auth.middleware';
import { LoginSchema, RegisterSchema } from "@/validators/auth.schema";

const router = Router();

// @ts-ignore
router.post('/register', validate(RegisterSchema), register);
// @ts-ignore
router.post('/login', validate(LoginSchema), login);
// @ts-ignore
router.get('/me', authMiddleware, getMe);

export default router;
