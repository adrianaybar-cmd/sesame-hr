'use client'

import { useState, useMemo } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@clasing/ui/sheet'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import { ScrollArea } from '@clasing/ui/scroll-area'
import {
  BellIcon,
  CheckIcon,
  CalendarXIcon,
  ClockIcon,
  FileTextIcon,
  PenIcon,
  GraduationCapIcon,
  ListChecksIcon,
  MegaphoneIcon,
  MoneyIcon,
  CakeIcon,
  CheckSquareIcon,
  AtIcon,
  GearIcon,
  UserCircleIcon,
} from '@phosphor-icons/react'
import { MOCK_NOTIFICATIONS } from '@/lib/mock/notifications'
import type { Notification, NotificationType } from '@/lib/types/notifications'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTimeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = Math.floor((now - then) / 1000)

  if (diff < 60) return 'hace un momento'
  if (diff < 3600) {
    const mins = Math.floor(diff / 60)
    return `hace ${mins} min`
  }
  if (diff < 86400) {
    const hours = Math.floor(diff / 3600)
    return `hace ${hours}h`
  }
  const days = Math.floor(diff / 86400)
  if (days === 1) return 'Ayer'
  if (days < 7) return `hace ${days} días`
  return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

function getDayGroup(dateStr: string): 'today' | 'yesterday' | 'week' {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffDays === 0) return 'today'
  if (diffDays === 1) return 'yesterday'
  return 'week'
}

function getTypeIcon(type: NotificationType) {
  const iconClass = 'size-4'
  switch (type) {
    case 'absence_approved': return <CheckIcon className={iconClass} />
    case 'absence_rejected': return <CalendarXIcon className={iconClass} />
    case 'clocking_incidence': return <ClockIcon className={iconClass} />
    case 'document_shared': return <FileTextIcon className={iconClass} />
    case 'document_sign_request': return <PenIcon className={iconClass} />
    case 'evaluation_assigned': return <CheckSquareIcon className={iconClass} />
    case 'onboarding_task': return <ListChecksIcon className={iconClass} />
    case 'announcement': return <MegaphoneIcon className={iconClass} />
    case 'payslip_available': return <MoneyIcon className={iconClass} />
    case 'birthday': return <CakeIcon className={iconClass} />
    case 'task_assigned': return <CheckSquareIcon className={iconClass} />
    case 'mention': return <AtIcon className={iconClass} />
    case 'system': return <GearIcon className={iconClass} />
    default: return <BellIcon className={iconClass} />
  }
}

function getTypeColor(type: NotificationType): string {
  switch (type) {
    case 'absence_approved': return 'bg-emerald-100 text-emerald-700'
    case 'absence_rejected': return 'bg-red-100 text-red-700'
    case 'clocking_incidence': return 'bg-amber-100 text-amber-700'
    case 'document_shared':
    case 'document_sign_request': return 'bg-blue-100 text-blue-700'
    case 'evaluation_assigned': return 'bg-purple-100 text-purple-700'
    case 'onboarding_task': return 'bg-cyan-100 text-cyan-700'
    case 'announcement': return 'bg-orange-100 text-orange-700'
    case 'payslip_available': return 'bg-green-100 text-green-700'
    case 'birthday': return 'bg-pink-100 text-pink-700'
    case 'task_assigned': return 'bg-indigo-100 text-indigo-700'
    case 'mention': return 'bg-violet-100 text-violet-700'
    case 'system': return 'bg-muted text-muted-foreground'
    default: return 'bg-muted text-muted-foreground'
  }
}

// ─── NotificationItem ─────────────────────────────────────────────────────────

interface NotificationItemProps {
  notification: Notification
  onRead: (id: string) => void
}

function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const router = useRouter()

  function handleClick() {
    onRead(notification.id)
    if (notification.action_url) {
      router.push(notification.action_url)
    }
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50',
        !notification.is_read && 'bg-blue-50/50',
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'shrink-0 size-8 rounded-full flex items-center justify-center mt-0.5',
          getTypeColor(notification.type),
        )}
      >
        {getTypeIcon(notification.type)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span className={cn('label-sm block', !notification.is_read ? 'font-semibold text-foreground' : 'font-regular text-foreground')}>
            {notification.title}
          </span>
          <span className="label-xs text-muted-foreground shrink-0 mt-0.5">
            {getTimeAgo(notification.created_at)}
          </span>
        </div>
        <span className="paragraph-xs text-muted-foreground line-clamp-2 mt-0.5 block">
          {notification.body}
        </span>
        {notification.actor_name && (
          <span className="label-xs text-muted-foreground mt-1 flex items-center gap-1">
            <UserCircleIcon className="size-3" />
            {notification.actor_name}
          </span>
        )}
      </div>

      {/* Unread dot */}
      {!notification.is_read && (
        <span className="shrink-0 size-2 rounded-full bg-blue-500 mt-2" />
      )}
    </button>
  )
}

// ─── NotificationPanel ────────────────────────────────────────────────────────

interface NotificationPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NotificationPanel({ open, onOpenChange }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.is_read).length,
    [notifications],
  )

  const grouped = useMemo(() => {
    const today: Notification[] = []
    const yesterday: Notification[] = []
    const week: Notification[] = []

    for (const n of notifications) {
      const group = getDayGroup(n.created_at)
      if (group === 'today') today.push(n)
      else if (group === 'yesterday') yesterday.push(n)
      else week.push(n)
    }

    return { today, yesterday, week }
  }, [notifications])

  function handleRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
    )
  }

  function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[420px] p-0 flex flex-col">
        {/* Header */}
        <SheetHeader className="px-4 py-3 border-b border-border shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SheetTitle className="label-md font-semibold">Notificaciones</SheetTitle>
              {unreadCount > 0 && (
                <Badge variant="default" size="xs" className="bg-blue-500 text-white border-0">
                  {unreadCount}
                </Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllRead}
                className="label-xs text-muted-foreground"
              >
                <CheckIcon className="size-3 mr-1" />
                Marcar todas como leídas
              </Button>
            )}
          </div>
        </SheetHeader>

        {/* Body */}
        <ScrollArea className="flex-1">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <BellIcon className="size-10 text-muted-foreground mb-3" />
              <span className="label-md font-medium text-foreground">Sin notificaciones</span>
              <span className="paragraph-sm text-muted-foreground mt-1">
                Cuando tengas notificaciones aparecerán aquí.
              </span>
            </div>
          ) : (
            <>
              {grouped.today.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-muted/30 border-b border-border">
                    <span className="label-xs font-semibold text-muted-foreground uppercase tracking-wide">Hoy</span>
                  </div>
                  {grouped.today.map((n) => (
                    <NotificationItem key={n.id} notification={n} onRead={handleRead} />
                  ))}
                </div>
              )}
              {grouped.yesterday.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-muted/30 border-b border-border">
                    <span className="label-xs font-semibold text-muted-foreground uppercase tracking-wide">Ayer</span>
                  </div>
                  {grouped.yesterday.map((n) => (
                    <NotificationItem key={n.id} notification={n} onRead={handleRead} />
                  ))}
                </div>
              )}
              {grouped.week.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-muted/30 border-b border-border">
                    <span className="label-xs font-semibold text-muted-foreground uppercase tracking-wide">Esta semana</span>
                  </div>
                  {grouped.week.map((n) => (
                    <NotificationItem key={n.id} notification={n} onRead={handleRead} />
                  ))}
                </div>
              )}
            </>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
