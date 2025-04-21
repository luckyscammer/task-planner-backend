import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from "@/config/env";

export function generateToken(userId: string) {
  // @ts-ignore
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): { userId: string } {
  return jwt.verify(token, JWT_SECRET) as { userId: string };
}