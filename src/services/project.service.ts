import { prisma } from '@/config/prisma';
import { Prisma } from '@/generated/prisma'
import { TaskStatusEnum } from "@/validators/task.schema";
import type { infer as Infer } from 'zod';

export const createProject = async (data: Prisma.ProjectCreateInput) => {
  return prisma.project.create({
    data,
  });
};

export const getAllProjects = async () => {
  return prisma.project.findMany({
    include: {
      createdBy: true,
    },
  });
};

export const getProjectById = async (id: string) => {
  return prisma.project.findUnique({
    where: { id },
    include: {
      createdBy: true,
    },
  });
};

export const updateProject = async (id: string, data: Prisma.ProjectUpdateInput) => {
  return prisma.project.update({
    where: { id },
    data,
  });
};

export const deleteProject = async (id: string) => {
  return prisma.project.delete({
    where: { id },
  });
};

type TaskStatus = Infer<typeof TaskStatusEnum>;
export type ProjectState = 'not_started' | 'in_progress' | 'completed';

export interface ProjectStatus {
  projectId: string;
  totalTasks: number;
  completedTasks: number;
  progress: number;
  state: ProjectState;
}

export const getProjectStatus = async (
  projectId: string
): Promise<ProjectStatus> => {
  const totalTasks = await prisma.task.count({
    where: { projectId },
  });

  const completedTasks = await prisma.task.count({
    where: {
      projectId,
      status: TaskStatusEnum.enum.COMPLETED as TaskStatus,
    },
  });

  const progress = totalTasks === 0
    ? 0
    : Math.round((completedTasks / totalTasks) * 100);

  let state: ProjectState = 'in_progress';
  if (totalTasks === 0) {
    state = 'not_started';
  } else if (progress === 100) {
    state = 'completed';
  }

  return {
    projectId,
    totalTasks,
    completedTasks,
    progress,
    state,
  };
};
