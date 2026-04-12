import { create } from 'zustand'

export interface Toast {
  id: string
  title: string
  description?: string
  variant: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

interface UIStore {
  // Sidebar
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void

  // Notifications
  notificationCount: number
  setNotificationCount: (count: number) => void

  // Global loading
  isLoading: boolean
  setIsLoading: (loading: boolean) => void

  // Toast queue
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

export const useUIStore = create<UIStore>()((set) => ({
  // Sidebar
  sidebarCollapsed: false,
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  // Notifications
  notificationCount: 0,
  setNotificationCount: (count) => set({ notificationCount: count }),

  // Global loading
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),

  // Toast queue
  toasts: [],
  addToast: (toast) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }))
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}))
