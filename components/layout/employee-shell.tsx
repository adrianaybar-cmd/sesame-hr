'use client'

import { SidebarProvider, SidebarInset } from '@clasing/ui/sidebar'
import { EmployeeSidebar } from '@/components/layout/employee-sidebar'
import { EmployeeHeader } from '@/components/layout/employee-header'
import { HRChatWidget } from '@/components/chat/hr-chat-widget'

export function EmployeeShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <EmployeeSidebar />
      <SidebarInset>
        <EmployeeHeader />
        <main className="flex-1 p-6 bg-background min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </SidebarInset>
      <HRChatWidget />
    </SidebarProvider>
  )
}
