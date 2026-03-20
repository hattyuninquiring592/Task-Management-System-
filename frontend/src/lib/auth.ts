import api, { setAccessToken, clearAccessToken } from './api'
import { AuthResponse, User } from '@/types'

export const authService = {
  async register(name: string, email: string, password: string): Promise<{ user: User; accessToken: string }> {
    const res = await api.post<AuthResponse>('/auth/register', { name, email, password })
    const { user, accessToken } = res.data.data
    setAccessToken(accessToken)
    saveUser(user)
    return { user, accessToken }
  },

  async login(email: string, password: string): Promise<{ user: User; accessToken: string }> {
    const res = await api.post<AuthResponse>('/auth/login', { email, password })
    const { user, accessToken } = res.data.data
    setAccessToken(accessToken)
    saveUser(user)
    return { user, accessToken }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } finally {
      clearAccessToken()
      clearUser()
    }
  },

  getUser(): User | null {
    if (typeof window === 'undefined') return null
    const raw = sessionStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  },
}

const saveUser = (user: User) => {
  if (typeof window !== 'undefined') sessionStorage.setItem('user', JSON.stringify(user))
}

const clearUser = () => {
  if (typeof window !== 'undefined') sessionStorage.removeItem('user')
}
