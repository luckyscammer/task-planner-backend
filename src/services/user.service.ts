import { prisma } from '@/config/prisma';
import { Role } from '@/models/role';

export const createUser = async (data: { fullName: string; email: string; role: Role }) => {
  return prisma.user.create({
    data,
  });
};

export const getAllUsers = async () => {
  return prisma.user.findMany();
};

export const getUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

export const updateUser = async (id: string, data: { fullName?: string; email?: string; role?: Role }) => {
  return prisma.user.update({
    where: { id },
    data,
  });
};

export const deleteUser = async (id: string) => {
  return prisma.user.delete({
    where: { id },
  });
};
