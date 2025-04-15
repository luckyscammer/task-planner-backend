import { prisma } from '@/config/prisma';

export const createProject = async (data: { name: string; description?: string; createdById: string }) => {
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

export const updateProject = async (id: string, data: { name?: string; description?: string }) => {
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
