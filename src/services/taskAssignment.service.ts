import { prisma } from '@/config/prisma';
import { Prisma } from '@/generated/prisma';

export const assignUserToTask = async (data: Prisma.TaskAssignmentCreateInput) => {
  return prisma.taskAssignment.create({ data });
};

export const getAllAssignments = async () => {
  return prisma.taskAssignment.findMany({
    include: {
      user: true,
      task: true,
    },
  });
};

export const getTasksByUserId = async (userId: string) => {
  return prisma.taskAssignment.findMany({
    where: { userId },
    include: { task: true },
  });
};

export const getUsersByTaskId = async (taskId: string) => {
  return prisma.taskAssignment.findMany({
    where: { taskId },
    include: { user: true },
  });
};

export const unassignUserFromTask = async (userId: string, taskId: string) => {
  return prisma.taskAssignment.delete({
    where: { taskId_userId: { userId, taskId } },
  });
};
