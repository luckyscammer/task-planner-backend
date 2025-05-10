import { describe, it, expect, beforeEach, vi } from 'vitest'
import { prisma } from '@/config/prisma'
import * as assignmentService from '@/services/taskAssignment.service'

vi.mock('@/config/prisma', () => ({
  prisma: {
    taskAssignment: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
    },
  },
}))

describe('taskAssignment.service', () => {
  const mockAssignment = {
    userId: 'u1',
    taskId: 't1',
    user: { id: 'u1', fullName: 'User One' },
    task: { id: 't1', title: 'Task One' },
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('assignUserToTask', () => {
    it('створює зв’язок user–task', async () => {
      ;(prisma.taskAssignment.create as any).mockResolvedValue(mockAssignment)

      const data = { userId: 'u1', taskId: 't1' }
      const result = await assignmentService.assignUserToTask(data as any)

      expect(prisma.taskAssignment.create).toHaveBeenCalledWith({ data })
      expect(result).toEqual(mockAssignment)
    })
  })

  describe('getAllAssignments', () => {
    it('повертає всі призначення з user і task', async () => {
      ;(prisma.taskAssignment.findMany as any).mockResolvedValue([mockAssignment])

      const result = await assignmentService.getAllAssignments()

      expect(prisma.taskAssignment.findMany).toHaveBeenCalledWith({
        include: { user: true, task: true },
      })
      expect(result).toEqual([mockAssignment])
    })
  })

  describe('getTasksByUserId', () => {
    it('повертає призначення для конкретного користувача', async () => {
      ;(prisma.taskAssignment.findMany as any).mockResolvedValue([mockAssignment])

      const result = await assignmentService.getTasksByUserId('u1')

      expect(prisma.taskAssignment.findMany).toHaveBeenCalledWith({
        where: { userId: 'u1' },
        include: { task: true },
      })
      expect(result).toEqual([mockAssignment])
    })
  })

  describe('getUsersByTaskId', () => {
    it('повертає призначення для конкретного завдання', async () => {
      ;(prisma.taskAssignment.findMany as any).mockResolvedValue([mockAssignment])

      const result = await assignmentService.getUsersByTaskId('t1')

      expect(prisma.taskAssignment.findMany).toHaveBeenCalledWith({
        where: { taskId: 't1' },
        include: { user: true },
      })
      expect(result).toEqual([mockAssignment])
    })
  })

  describe('unassignUserFromTask', () => {
    it('видаляє призначення за композитним ключем', async () => {
      ;(prisma.taskAssignment.delete as any).mockResolvedValue(mockAssignment)

      const result = await assignmentService.unassignUserFromTask('u1', 't1')

      expect(prisma.taskAssignment.delete).toHaveBeenCalledWith({
        where: { taskId_userId: { userId: 'u1', taskId: 't1' } },
      })
      expect(result).toEqual(mockAssignment)
    })
  })

  describe('getAssignmentByUserAndTask', () => {
    it('повертає одне призначення за композитним ключем', async () => {
      ;(prisma.taskAssignment.findUnique as any).mockResolvedValue(mockAssignment)

      const result = await assignmentService.getAssignmentByUserAndTask('u1', 't1')

      expect(prisma.taskAssignment.findUnique).toHaveBeenCalledWith({
        where: { taskId_userId: { userId: 'u1', taskId: 't1' } },
        include: { user: true, task: true },
      })
      expect(result).toEqual(mockAssignment)
    })
  })

  describe('updateAssignment', () => {
    it('оновлює призначення за композитним ключем', async () => {
      const updated = { ...mockAssignment, /* тут могли бути поля, що оновлюються */ }
      ;(prisma.taskAssignment.update as any).mockResolvedValue(updated)

      const data = { /* поля для оновлення, наприклад роль */ }
      const result = await assignmentService.updateAssignment('u1', 't1', data as any)

      expect(prisma.taskAssignment.update).toHaveBeenCalledWith({
        where: { taskId_userId: { userId: 'u1', taskId: 't1' } },
        data,
      })
      expect(result).toEqual(updated)
    })
  })
})
