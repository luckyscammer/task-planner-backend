import { Request, Response } from 'express';
import * as service from '@/services/taskAssignment.service';
import * as userService from '@/services/user.service';
import * as taskService from '@/services/task.service';

export const assignUser = async (req: Request, res: Response) => {
  try {
    const { userId, taskId } = req.body;

    const user = await userService.getUserById(userId);
    const task = await taskService.getTaskById(taskId);
    if (!user || !task) return res.status(404).json({ error: 'User or task not found' });

    const assignment = await service.assignUserToTask({ user: { connect: { id: userId } }, task: { connect: { id: taskId } } });
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign user', details: error });
  }
};

export const getAll = async (_req: Request, res: Response) => {
  const result = await service.getAllAssignments();
  res.json(result);
};

export const getTasksOfUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await service.getTasksByUserId(id);
  res.json(result);
};

export const getUsersOfTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await service.getUsersByTaskId(id);
  res.json(result);
};

export const unassignUser = async (req: Request, res: Response) => {
  const { userId, taskId } = req.body;
  await service.unassignUserFromTask(userId, taskId);
  res.status(204).send();
};
