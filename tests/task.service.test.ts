import { describe, it, expect, beforeEach, vi } from 'vitest'
import { prisma } from '@/config/prisma'
import * as taskService from '@/services/task.service'
import { TaskStatus } from '@/generated/prisma'

vi.mock('@/config/prisma', () => ({
  prisma: {
    task: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

describe('task.service', () => {
  const baseData = { title: 'Test Task', description: 'Desc' }
  const mockTask = { id: '1', ...baseData, progress: 0, projectId: 'p1' }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createTask', () => {
    it('створює задачу без статусу і не змінює progress', async () => {
      ;(prisma.task.create as any).mockResolvedValue(mockTask)

      const result = await taskService.createTask({ ...baseData } as any)

      expect(prisma.task.create).toHaveBeenCalledWith({ data: baseData })
      expect(result).toEqual(mockTask)
    })

    it.each([
      [TaskStatus.COMPLETED, 100],
      [TaskStatus.PENDING_REVIEW, 75],
      [TaskStatus.IN_PROGRESS, 50],
      [TaskStatus.ASSIGNED, 0],
      [TaskStatus.UNASSIGNED, 0],
    ])('для status %s встановлює progress = %i', async (status, expected) => {
      ;(prisma.task.create as any).mockResolvedValue({ ...mockTask, progress: expected })

      const input = { ...baseData, status }
      const result = await taskService.createTask(input as any)

      expect(prisma.task.create).toHaveBeenCalledWith({
        data: { ...baseData, status, progress: expected },
      })
      expect(result.progress).toBe(expected)
    })
  })

  describe('getAllTasks', () => {
    it('повертає всі задачі з проектом', async () => {
      ;(prisma.task.findMany as any).mockResolvedValue([mockTask])

      const result = await taskService.getAllTasks()

      expect(prisma.task.findMany).toHaveBeenCalledWith({
        include: { project: true },
      })
      expect(result).toEqual([mockTask])
    })
  })

  describe('getTaskById', () => {
    it('повертає задачу за id з проектом і призначеннями', async () => {
      ;(prisma.task.findUnique as any).mockResolvedValue({
        ...mockTask,
        assignments: [{ id: 'a1', user: { id: 'u1' } }],
      })

      const result = await taskService.getTaskById('1')

      expect(prisma.task.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          project: true,
          assignments: { include: { user: true } },
        },
      })
      // @ts-ignore
      expect(result.assignments?.[0].user.id).toBe('u1')
    })
  })

  describe('updateTask', () => {
    it('оновлює задачу без статусу', async () => {
      ;(prisma.task.update as any).mockResolvedValue(mockTask)

      const result = await taskService.updateTask('1', { description: 'New' } as any)

      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { description: 'New' },
      })
      expect(result).toEqual(mockTask)
    })

    it.each([
      [TaskStatus.COMPLETED, 100],
      [TaskStatus.PENDING_REVIEW, 75],
      [TaskStatus.IN_PROGRESS, 50],
      [TaskStatus.ASSIGNED, 0],
      [TaskStatus.UNASSIGNED, 0],
    ])('для status %s при оновленні встановлює progress = %i', async (status, expected) => {
      ;(prisma.task.update as any).mockResolvedValue({ ...mockTask, progress: expected })

      const result = await taskService.updateTask('1', { status } as any)

      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status, progress: expected },
      })
      expect(result.progress).toBe(expected)
    })
  })

  describe('deleteTask', () => {
    it('видаляє задачу', async () => {
      ;(prisma.task.delete as any).mockResolvedValue(mockTask)

      const result = await taskService.deleteTask('1')

      expect(prisma.task.delete).toHaveBeenCalledWith({ where: { id: '1' } })
      expect(result).toEqual(mockTask)
    })
  })

  describe('getTasksWithFilters', () => {
    it('повертає відфільтровані задачі з проектом і призначеннями', async () => {
      ;(prisma.task.findMany as any).mockResolvedValue([mockTask])

      const filters = { status: TaskStatus.COMPLETED }
      const result = await taskService.getTasksWithFilters(filters as any)

      expect(prisma.task.findMany).toHaveBeenCalledWith({
        where: filters,
        include: {
          project: true,
          assignments: { include: { user: true } },
        },
      })
      expect(result).toEqual([mockTask])
    })
  })
})