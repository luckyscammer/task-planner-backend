import { prisma } from '@/config/prisma';
import { Prisma } from '@/generated/prisma';

export const createTask = async (data: Prisma.TaskCreateInput) => {
  return prisma.task.create({ data });
};

export const getAllTasks = async () => {
  return prisma.task.findMany({ include: { project: true } });
};

export const getTaskById = async (id: string) => {
  return prisma.task.findUnique({ where: { id }, include: { project: true } });
};

export const updateTask = async (id: string, data: Prisma.TaskUpdateInput) => {
  return prisma.task.update({ where: { id }, data });
};

export const deleteTask = async (id: string) => {
  return prisma.task.delete({ where: { id } });
};
