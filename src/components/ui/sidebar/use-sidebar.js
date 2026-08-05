import { inject } from 'vue'

export function useSidebar() {
  const context = inject('sidebarContext', null)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}
