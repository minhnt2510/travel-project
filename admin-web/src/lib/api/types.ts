export interface User {
  _id: string
  name: string
  email: string
  role: 'client' | 'staff' | 'admin'
  avatar?: string
  phone?: string
  createdAt?: string
}

