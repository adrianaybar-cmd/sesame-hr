'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import { Input } from '@clasing/ui/input'
import { ScrollArea } from '@clasing/ui/scroll-area'
import {
  ChatCircleIcon,
  XIcon,
  PaperPlaneTiltIcon,
  CaretDownIcon,
} from '@phosphor-icons/react'
import { MOCK_MESSAGES } from '@/lib/mock/chat'
import type { HRChatMessage } from '@/lib/types/chat'
import { cn } from '@/lib/utils'

// ─── Employee conversation (conv-1 is for emp-6 / Sofía) ─────────────────────
const EMPLOYEE_CONV_ID = 'conv-1'

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}

// ─── MessageBubble ────────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: HRChatMessage }) {
  const isEmployee = message.sender_role === 'employee'
  return (
    <div className={cn('flex gap-2', isEmployee ? 'justify-end' : 'justify-start')}>
      {!isEmployee && (
        <div className="shrink-0 size-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
          <span className="label-xs font-semibold text-blue-700">RR</span>
        </div>
      )}
      <div className={cn('max-w-[75%]')}>
        <div
          className={cn(
            'px-3 py-2 rounded-2xl paragraph-xs',
            isEmployee
              ? 'bg-blue-500 text-white rounded-tr-sm'
              : 'bg-muted text-foreground rounded-tl-sm',
          )}
        >
          {message.content}
        </div>
        <span className={cn('label-xs text-muted-foreground mt-0.5 block', isEmployee ? 'text-right' : '')}>
          {new Date(message.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  )
}

// ─── HRChatWidget ─────────────────────────────────────────────────────────────

export function HRChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<HRChatMessage[]>(
    MOCK_MESSAGES[EMPLOYEE_CONV_ID] ?? [],
  )
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const unreadCount = messages.filter((m) => m.sender_role === 'hr' && !m.is_read).length

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, open])

  function handleSend() {
    if (!input.trim()) return
    const newMsg: HRChatMessage = {
      id: `widget-msg-${Date.now()}`,
      conversation_id: EMPLOYEE_CONV_ID,
      sender_id: 'emp-6',
      sender_name: 'Sofía Romero',
      sender_role: 'employee',
      content: input.trim(),
      created_at: new Date().toISOString(),
      is_read: false,
    }
    setMessages((prev) => [...prev, newMsg])
    setInput('')
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat panel */}
      {open && (
        <div className="w-80 bg-background border border-border rounded-2xl shadow-xl flex flex-col overflow-hidden"
          style={{ height: 460 }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="label-xs font-semibold text-blue-700">RR</span>
              </div>
              <div>
                <span className="label-sm font-semibold text-foreground block">Chat con RRHH</span>
                <span className="label-xs text-muted-foreground">Normalmente respondemos en 1h</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" iconOnly onClick={() => setOpen(false)}>
              <CaretDownIcon className="size-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 px-3 py-3">
            <div className="flex flex-col gap-2">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <ChatCircleIcon className="size-8 text-muted-foreground mb-2" />
                  <span className="paragraph-xs text-muted-foreground">
                    ¡Hola! ¿En qué podemos ayudarte?
                  </span>
                </div>
              ) : (
                messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="px-3 py-3 border-t border-border">
            <div className="flex gap-2">
              <Input
                placeholder="Escribe tu consulta..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                className="flex-1 paragraph-xs"
              />
              <Button
                size="sm"
                iconOnly
                onClick={handleSend}
                disabled={!input.trim()}
              >
                <PaperPlaneTiltIcon className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <Button
        size="sm"
        className="size-12 rounded-full shadow-lg relative"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <XIcon className="size-5" />
        ) : (
          <ChatCircleIcon className="size-5" />
        )}
        {!open && unreadCount > 0 && (
          <Badge
            variant="error"
            size="xs"
            className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 label-xs"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>
    </div>
  )
}
