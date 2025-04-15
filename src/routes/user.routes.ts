import { Router } from 'express';
import * as userController from '@/controllers/user.controller';
import { validate } from '@/middleware/validate';
import { UserSchema, UserUpdateSchema } from '@/validators/user.schema';

const router = Router();

// @ts-ignore
router.post('/', validate(UserSchema), userController.createUser);
router.get('/', userController.getAllUsers);
// @ts-ignore
router.get('/:id', userController.getUserById);
// @ts-ignore
router.put('/:id', validate(UserUpdateSchema), userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
