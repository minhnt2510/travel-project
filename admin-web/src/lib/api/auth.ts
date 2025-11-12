import api from '../api'
import type { User } from './types'

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  user: User
  accessToken: string
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials)
    if (data.success && data.accessToken) {
      localStorage.setItem('travel_app_token', data.accessToken)
    }
    return data
  },

  logout: () => {
    localStorage.removeItem('travel_app_token')
  },

  getCurrentUser: async (): Promise<User> => {
    const { data } = await api.get<User>('/me')
    return data
  },
}

