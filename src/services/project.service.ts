import { prisma } from '@/config/prisma';
import {Prisma } from '@/generated/prisma'

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
