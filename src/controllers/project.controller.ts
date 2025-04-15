import { Request, Response } from 'express';
import { getUserById } from "@/services/user.service";
import * as projectService from '@/services/project.service';

export const createProject = async (req: Request, res: Response) => {
  try {
    const { createdById } = req.body;

    const user = await getUserById(createdById);
    if (!user) {
      return res.status(404).json({ error: 'User with this ID does not exist' });
    }

    const project = await projectService.createProject(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project', details: error });
  }
};

export const getAllProjects = async (_req: Request, res: Response) => {
  try {
    const projects = await projectService.getAllProjects();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get projects', details: error });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await projectService.getProjectById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get project', details: error });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  const { id } = req.params;

  const existing = await projectService.getProjectById(id);
  if (!existing) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const project = await projectService.updateProject(id, req.body);
  res.json(project);
};


export const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;

  const existing = await projectService.getProjectById(id);
  if (!existing) {
    return res.status(404).json({ error: 'Project not found' });
  }

  await projectService.deleteProject(id);
  res.status(204).send();
};

