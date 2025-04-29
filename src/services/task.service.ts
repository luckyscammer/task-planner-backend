import { prisma } from '@/config/prisma';
import { Prisma, TaskStatus } from '@/generated/prisma';

export const createTask = async (
  data: Prisma.TaskCreateInput
) => {
  if ('status' in data && data.status) {
    let newProgress = 0;
    switch (data.status as TaskStatus) {
      case TaskStatus.COMPLETED:
        newProgress = 100;
        break;
      case TaskStatus.PENDING_REVIEW:
        newProgress = 75;
        break;
      case TaskStatus.IN_PROGRESS:
        newProgress = 50;
        break;
      case TaskStatus.ASSIGNED:
      case TaskStatus.UNASSIGNED:
      default:
        newProgress = 0;
        break;
    }
    ;(data as any).progress = newProgress;
  }

  return prisma.task.create({ data });
};

export const getAllTasks = async () => {
  return prisma.task.findMany({ include: { project: true } });
};

export const getTaskById = async (id: string) => {
  return prisma.task.findUnique({ where: { id }, include: { project: true } });
};

export const updateTask = async (
  id: string,
  data: Prisma.TaskUpdateInput
) => {
  if ('status' in data && data.status) {
    let newProgress = 0;
    switch (data.status as TaskStatus) {
      case TaskStatus.COMPLETED:
        newProgress = 100;
        break;
      case TaskStatus.PENDING_REVIEW:
        newProgress = 75;
        break;
      case TaskStatus.IN_PROGRESS:
        newProgress = 50;
        break;
      case TaskStatus.ASSIGNED:
      case TaskStatus.UNASSIGNED:
      default:
        newProgress = 0;
        break;
    }
    data.progress = newProgress;
  }

  return prisma.task.update({
    where: { id },
    data,
  });
};


export const deleteTask = async (id: string) => {
  return prisma.task.delete({ where: { id } });
};

export const getTasksWithFilters = async (filters: Prisma.TaskWhereInput) => {
  return prisma.task.findMany({
    where: filters,
    include: {
      project: true,
      assignments: {
        include: {
          user: true,
        },
      },
    },
  });
};

