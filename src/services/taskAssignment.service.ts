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

export const getAssignmentByUserAndTask = async (userId: string, taskId: string) => {
  return prisma.taskAssignment.findUnique({
    where: { taskId_userId: { userId, taskId } },
    include: {
      user: true,
      task: true,
    },
  });
};

export const updateAssignment = async (
  userId: string,
  taskId: string,
  data: Prisma.TaskAssignmentUpdateInput
) => {
  return prisma.taskAssignment.update({
    where: { taskId_userId: { userId, taskId } },
    data,
  });
};

