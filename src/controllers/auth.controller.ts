import { Role } from "@/generated/prisma";
import { Request, Response } from 'express';
import { PrismaClient } from '@/generated/prisma';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/services/auth.service';

const prisma = new PrismaClient();

export async function register(req: Request, res: Response) {
  const { email, password, fullName } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      fullName,
      role: Role.USER
    },
  });

  const token = generateToken(user.id);

  return res.status(201).json({ token });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  const token = generateToken(user.id);
  return res.json({ token });
}

export async function getMe(req: Request, res: Response) {
  const userId = (req as any).userId;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      fullName: true
    },
  });

  if (!user) return res.status(404).json({ message: 'User not found' });

  return res.json(user);
}