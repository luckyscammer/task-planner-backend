import { Router } from 'express';
import { register, login, getMe } from '@/controllers/auth.controller';
import { authMiddleware } from '@/middleware/auth.middleware';

const router = Router();

// @ts-ignore
router.post('/register', register);
// @ts-ignore
router.post('/login', login);
// @ts-ignore
router.get('/me', authMiddleware, getMe);

export default router;
