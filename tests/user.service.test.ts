import { describe, it, expect, beforeEach, vi } from 'vitest'
import { prisma } from '@/config/prisma'
import * as userService from '@/services/user.service'

vi.mock('@/config/prisma', () => ({
  prisma: {
    user: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

describe('user.service', () => {
  const mockUser = { id: 'u1', fullName: 'Test User', email: 'test@example.com' }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createUser', () => {
    it('створює користувача', async () => {
      ;(prisma.user.create as any).mockResolvedValue(mockUser)

      const data = { fullName: 'Test User', email: 'test@example.com' }
      const result = await userService.createUser(data as any)

      expect(prisma.user.create).toHaveBeenCalledWith({ data })
      expect(result).toEqual(mockUser)
    })
  })

  describe('getAllUsers', () => {
    it('повертає список користувачів', async () => {
      ;(prisma.user.findMany as any).mockResolvedValue([mockUser])

      const result = await userService.getAllUsers()

      expect(prisma.user.findMany).toHaveBeenCalledWith()
      expect(result).toEqual([mockUser])
    })
  })

  describe('searchUsers', () => {
    it('шукає за fullName та email (insensitive)', async () => {
      ;(prisma.user.findMany as any).mockResolvedValue([mockUser])

      const q = 'test'
      const result = await userService.searchUsers(q)

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { fullName: { contains: q, mode: 'insensitive' } },
            { email: { contains: q, mode: 'insensitive' } },
          ],
        },
      })
      expect(result).toEqual([mockUser])
    })
  })

  describe('getUserById', () => {
    it('повертає користувача за id', async () => {
      ;(prisma.user.findUnique as any).mockResolvedValue(mockUser)

      const result = await userService.getUserById('u1')

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 'u1' } })
      expect(result).toEqual(mockUser)
    })
  })

  describe('updateUser', () => {
    it('оновлює користувача', async () => {
      ;(prisma.user.update as any).mockResolvedValue({ ...mockUser, fullName: 'Updated' })

      const data = { fullName: 'Updated' }
      const result = await userService.updateUser('u1', data as any)

      expect(prisma.user.update).toHaveBeenCalledWith({ where: { id: 'u1' }, data })
      expect(result.fullName).toBe('Updated')
    })
  })

  describe('deleteUser', () => {
    it('видаляє користувача', async () => {
      ;(prisma.user.delete as any).mockResolvedValue(mockUser)

      const result = await userService.deleteUser('u1')

      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 'u1' } })
      expect(result).toEqual(mockUser)
    })
  })
})
