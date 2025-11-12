import api from '../api'

export interface Tour {
  _id: string
  title: string
  description: string
  destination: string
  duration: number
  price: number
  imageUrl?: string
  status: 'pending' | 'approved' | 'rejected'
  featured?: boolean
  createdAt: string
  updatedAt: string
}

type ToursListResponse = {
  tours: Tour[]
  total: number
  limit?: number
  offset?: number
}

export const toursApi = {
  getAll: async (params?: { status?: string }): Promise<ToursListResponse> => {
    const { data } = await api.get<ToursListResponse>('/tours', { params })
    return {
      tours: data?.tours ?? [],
      total: data?.total ?? data?.tours?.length ?? 0,
      limit: data?.limit,
      offset: data?.offset,
    }
  },

  getPending: async (): Promise<Tour[]> => {
    const { data } = await api.get<Tour[]>('/tours/pending')
    return data
  },

  getById: async (id: string): Promise<Tour> => {
    const { data } = await api.get<Tour>(`/tours/${id}`)
    return data
  },

  create: async (tourData: Partial<Tour>): Promise<Tour> => {
    const { data } = await api.post<Tour>('/tours', tourData)
    return data
  },

  update: async (id: string, tourData: Partial<Tour>): Promise<Tour> => {
    const { data } = await api.put<Tour>(`/tours/${id}`, tourData)
    return data
  },

  updateStatus: async (id: string, status: Tour['status']): Promise<Tour> => {
    const { data } = await api.put<Tour>(`/tours/${id}/status`, { status })
    return data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tours/${id}`)
  },
}

