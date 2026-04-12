'use client'

import { useState } from 'react'
import { SidebarTrigger } from '@clasing/ui/sidebar'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@clasing/ui/tooltip'
import { BellIcon } from '@phosphor-icons/react'
import { ClockWidget } from '@/components/time/clock-widget'
import { NotificationPanel } from '@/components/notifications/notification-panel'
import { MOCK_NOTIFICATIONS } from '@/lib/mock/notifications'

// ─── Employee Header ──────────────────────────────────────────────────────────

export function EmployeeHeader() {
  const [notifOpen, setNotifOpen] = useState(false)
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.is_read).length

  return (
    <>
      <NotificationPanel open={notifOpen} onOpenChange={setNotifOpen} />
      <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-background px-4">
        {/* Sidebar toggle */}
        <SidebarTrigger className="shrink-0" />

        {/* Spacer */}
        <div className="flex-1" />

        {/* Clock widget */}
        <ClockWidget />

        {/* Notifications */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" iconOnly className="relative" onClick={() => setNotifOpen(true)}>
              <BellIcon className="size-4" />
              {unreadCount > 0 && (
                <Badge
                  variant="error"
                  size="xs"
                  className="absolute -top-0.5 -right-0.5 size-4 flex items-center justify-center p-0 label-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Notificaciones</TooltipContent>
        </Tooltip>
      </header>
    </>
  )
}
