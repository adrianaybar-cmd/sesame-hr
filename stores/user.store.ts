import { create } from 'zustand'
import type { User, Role } from '@/types'
import { ADMIN_ROLES, EMPLOYEE_ROLES } from '@/types'

interface UserStore {
  user: User | null
  setUser: (user: User) => void
  clearUser: () => void
  isAdmin: () => boolean
  isEmployee: () => boolean
  hasRole: (...roles: Role[]) => boolean
}

export const useUserStore = create<UserStore>()((set, get) => ({
  user: null,

  setUser: (user) => set({ user }),

  clearUser: () => set({ user: null }),

  isAdmin: () => {
    const { user } = get()
    if (!user) return false
    return ADMIN_ROLES.includes(user.role)
  },

  isEmployee: () => {
    const { user } = get()
    if (!user) return false
    return EMPLOYEE_ROLES.includes(user.role)
  },

  hasRole: (...roles) => {
    const { user } = get()
    if (!user) return false
    return roles.includes(user.role)
  },
}))
