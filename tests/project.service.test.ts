import { describe, it, expect, beforeEach, vi } from 'vitest'
import { prisma } from '@/config/prisma'
import * as projectService from '@/services/project.service'
import { TaskStatusEnum } from '@/validators/task.schema'

vi.mock('@/config/prisma', () => ({
  prisma: {
    project: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    task: {
      count: vi.fn(),
    },
  },
}))

describe('project.service', () => {
  const mockProject = { id: '1', name: 'Test', description: 'Desc' }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createProject', () => {
    it('створює проєкт', async () => {
      // Налаштовуємо мок на повернення mockProject
      ;(prisma.project.create as any).mockResolvedValue(mockProject)

      const data = { name: 'Test', description: 'Desc' }
      const result = await projectService.createProject(data as any)

      expect(prisma.project.create).toHaveBeenCalledWith({ data })
      expect(result).toEqual(mockProject)
    })
  })

  describe('getAllProjects', () => {
    it('повертає список проєктів з createdBy', async () => {
      ;(prisma.project.findMany as any).mockResolvedValue([mockProject])

      const result = await projectService.getAllProjects()

      expect(prisma.project.findMany).toHaveBeenCalledWith({
        include: { createdBy: true },
      })
      expect(result).toEqual([mockProject])
    })
  })

  describe('getProjectById', () => {
    it('повертає проєкт за id', async () => {
      ;(prisma.project.findUnique as any).mockResolvedValue(mockProject)

      const result = await projectService.getProjectById('1')

      expect(prisma.project.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { createdBy: true },
      })
      expect(result).toEqual(mockProject)
    })
  })

  describe('updateProject', () => {
    it('оновлює проєкт', async () => {
      ;(prisma.project.update as any).mockResolvedValue(mockProject)

      const updateData = { description: 'New' }
      const result = await projectService.updateProject('1', updateData as any)

      expect(prisma.project.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateData,
      })
      expect(result).toEqual(mockProject)
    })
  })

  describe('deleteProject', () => {
    it('видаляє проєкт', async () => {
      ;(prisma.project.delete as any).mockResolvedValue(mockProject)

      const result = await projectService.deleteProject('1')

      expect(prisma.project.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      })
      expect(result).toEqual(mockProject)
    })
  })

  describe('getProjectStatus', () => {
    it('повертає not_started, якщо завдань немає', async () => {
      ;(prisma.task.count as any)
        .mockResolvedValueOnce(0)  // totalTasks
        .mockResolvedValueOnce(0)  // completedTasks

      const result = await projectService.getProjectStatus('1')

      expect(prisma.task.count).toHaveBeenNthCalledWith(1, {
        where: { projectId: '1' },
      })
      expect(prisma.task.count).toHaveBeenNthCalledWith(2, {
        where: { projectId: '1', status: TaskStatusEnum.enum.COMPLETED },
      })
      expect(result).toEqual({
        projectId: '1',
        totalTasks: 0,
        completedTasks: 0,
        progress: 0,
        state: 'not_started',
      })
    })

    it('повертає completed, якщо всі завдання виконані', async () => {
      ;(prisma.task.count as any)
        .mockResolvedValueOnce(5)
        .mockResolvedValueOnce(5)

      const result = await projectService.getProjectStatus('1')
      expect(result).toEqual({
        projectId: '1',
        totalTasks: 5,
        completedTasks: 5,
        progress: 100,
        state: 'completed',
      })
    })

    it('повертає in_progress для частково виконаних завдань', async () => {
      ;(prisma.task.count as any)
        .mockResolvedValueOnce(4)
        .mockResolvedValueOnce(2)

      const result = await projectService.getProjectStatus('1')
      expect(result).toEqual({
        projectId: '1',
        totalTasks: 4,
        completedTasks: 2,
        progress: 50,
        state: 'in_progress',
      })
    })
  })
})
