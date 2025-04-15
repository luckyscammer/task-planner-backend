import { prisma } from '@/config/prisma';
import { Prisma } from "@/generated/prisma";

export const createUser = async (data: Prisma.UserCreateInput) => {
  return prisma.user.create({ data });
};

export const getAllUsers = async () => {
  return prisma.user.findMany();
};

export const getUserById = async (id: string) => {
  return prisma.user.findUnique({ where: { id } });
};

export const updateUser = async (id: string, data: Prisma.UserUpdateInput) => {
  return prisma.user.update({ where: { id }, data });
};

export const deleteUser = async (id: string) => {
  return prisma.user.delete({ where: { id } });
};
