import api from '../api'

export interface Booking {
  _id: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'in_progress'
  guests?: number
  totalPrice?: number
  travelDate?: string
  bookingDate?: string
  paymentStatus?: string
  createdAt?: string
  updatedAt?: string
  tour?: {
    _id?: string
    title?: string
    imageUrl?: string
    destination?: string
  }
  user?: {
    _id?: string
    name?: string
    email?: string
    phone?: string
  }
  [key: string]: any
}

const normalizeBooking = (raw: any): Booking => {
  const tourSource = raw.tour ?? raw.tourId ?? raw.tourInfo ?? null
  const userSource = raw.user ?? raw.userId ?? raw.customer ?? null

  const normalizeNumber = (value: any) => {
    if (typeof value === 'number') return value
    if (typeof value === 'string') {
      const parsed = parseFloat(value.replace(/[^\d.-]/g, ''))
      return isNaN(parsed) ? undefined : parsed
    }
    return undefined
  }

  return {
    ...raw,
    totalPrice: normalizeNumber(raw.totalPrice),
    guests: raw.guests ?? raw.quantity ?? raw.travelers?.length,
    tour: tourSource && typeof tourSource === 'object'
      ? {
          _id: tourSource._id ?? tourSource.id,
          title: tourSource.title ?? tourSource.name ?? tourSource.tourTitle,
          imageUrl: tourSource.imageUrl ?? tourSource.thumbnail,
          destination: tourSource.destination ?? tourSource.location,
        }
      : undefined,
    user: userSource && typeof userSource === 'object'
      ? {
          _id: userSource._id ?? userSource.id,
          name: userSource.name ?? userSource.fullName ?? userSource.customerName,
          email: userSource.email,
          phone: userSource.phone,
        }
      : undefined,
  }
}

export const bookingsApi = {
  getAll: async (): Promise<Booking[]> => {
    const { data } = await api.get<Booking[]>('/admin/bookings')
    return Array.isArray(data) ? data.map(normalizeBooking) : []
  },

  getById: async (id: string): Promise<Booking> => {
    const { data } = await api.get<Booking>(`/bookings/${id}`)
    return normalizeBooking(data)
  },

  updateStatus: async (id: string, status: Booking['status']): Promise<Booking> => {
    const { data } = await api.put<Booking>(`/admin/bookings/${id}/status`, { status })
    return data
  },
}

