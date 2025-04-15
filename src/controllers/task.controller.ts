import { Request, Response } from 'express';
import * as taskService from '@/services/task.service';
import * as projectService from '@/services/project.service';

export const createTask = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.body;
    const project = await projectService.getProjectById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const task = await taskService.createTask(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task', details: error });
  }
};

export const getAllTasks = async (_req: Request, res: Response) => {
  try {
    const tasks = await taskService.getAllTasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get tasks', details: error });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await taskService.getTaskById(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get task', details: error });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await taskService.getTaskById(id);
    if (!existing) return res.status(404).json({ error: 'Task not found' });

    const task = await taskService.updateTask(id, req.body);
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task', details: error });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await taskService.getTaskById(id);
    if (!existing) return res.status(404).json({ error: 'Task not found' });

    await taskService.deleteTask(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task', details: error });
  }
};
