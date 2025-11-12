import api from '../api'
import type { User } from './types'

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const { data } = await api.get<User[]>('/admin/users')
    return data
  },

  getById: async (id: string): Promise<User> => {
    const { data } = await api.get<User>(`/admin/users/${id}`)
    return data
  },

  updateRole: async (id: string, role: User['role']): Promise<User> => {
    const { data } = await api.put<User>(`/admin/users/${id}/role`, { role })
    return data
  },
}

