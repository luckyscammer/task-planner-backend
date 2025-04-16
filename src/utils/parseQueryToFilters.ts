import { Prisma, TaskStatus } from '@/generated/prisma';

export const parseQueryToFilters = (query: any): Prisma.TaskWhereInput => {
  const {
    status,
    projectId,
    userId,
    search,
    deadlineBefore,
    deadlineAfter,
    createdBefore,
    createdAfter,
  } = query;

  const filters: Prisma.TaskWhereInput = {};

  if (status) {
    const statusList = status.split(',') as TaskStatus[];
    filters.status = { in: statusList };
  }

  if (projectId) {
    filters.projectId = projectId;
  }

  if (search) {
    filters.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (deadlineBefore || deadlineAfter) {
    filters.deadline = {};
    if (deadlineBefore) filters.deadline.lte = new Date(deadlineBefore);
    if (deadlineAfter) filters.deadline.gte = new Date(deadlineAfter);
  }

  if (createdBefore || createdAfter) {
    filters.createdAt = {};
    if (createdBefore) filters.createdAt.lte = new Date(createdBefore);
    if (createdAfter) filters.createdAt.gte = new Date(createdAfter);
  }

  if (userId) {
    filters.assignments = {
      some: {
        userId,
      },
    };
  }

  return filters;
};
