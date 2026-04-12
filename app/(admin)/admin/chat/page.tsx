'use client'

export const dynamic = 'force-dynamic'

import { useState, useMemo, useRef, useEffect } from 'react'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import { Input } from '@clasing/ui/input'

import {
  MagnifyingGlassIcon,
  PaperPlaneTiltIcon,
  LockIcon,
  LockOpenIcon,
  ChatCircleIcon,
} from '@phosphor-icons/react'
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from '@/lib/mock/chat'
import type { HRChatConversation, HRChatMessage } from '@/lib/types/chat'
import { cn } from '@/lib/utils'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTimeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = Math.floor((now - then) / 1000)
  if (diff < 60) return 'ahora'
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}

// ─── ConversationItem ─────────────────────────────────────────────────────────

interface ConversationItemProps {
  conversation: HRChatConversation
  isSelected: boolean
  onClick: () => void
}

function ConversationItem({ conversation, isSelected, onClick }: ConversationItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50',
        isSelected && 'bg-muted',
      )}
    >
      <div className="shrink-0 size-9 rounded-full bg-muted flex items-center justify-center">
        <span className="label-xs font-semibold text-muted-foreground">
          {getInitials(conversation.employee_name)}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span className="label-sm font-medium text-foreground truncate">
            {conversation.employee_name}
          </span>
          <span className="label-xs text-muted-foreground shrink-0">
            {conversation.last_message_at ? getTimeAgo(conversation.last_message_at) : ''}
          </span>
        </div>
        <div className="flex items-center justify-between gap-1 mt-0.5">
          <span className="paragraph-xs text-muted-foreground truncate">
            {conversation.last_message ?? 'Sin mensajes'}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            {conversation.status === 'closed' && (
              <LockIcon className="size-3 text-muted-foreground" />
            )}
            {conversation.unread_count > 0 && (
              <Badge variant="default" size="xs" className="bg-blue-500 text-white border-0 min-w-4 justify-center">
                {conversation.unread_count}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </button>
  )
}

// ─── MessageBubble ────────────────────────────────────────────────────────────

interface MessageBubbleProps {
  message: HRChatMessage
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isHR = message.sender_role === 'hr'
  return (
    <div className={cn('flex gap-2 max-w-[80%]', isHR ? 'ml-auto flex-row-reverse' : 'mr-auto')}>
      {!isHR && (
        <div className="shrink-0 size-7 rounded-full bg-muted flex items-center justify-center mt-1">
          <span className="label-xs font-semibold text-muted-foreground">
            {getInitials(message.sender_name)}
          </span>
        </div>
      )}
      <div>
        <div
          className={cn(
            'px-3 py-2 rounded-2xl paragraph-sm',
            isHR
              ? 'bg-blue-500 text-white rounded-tr-sm'
              : 'bg-muted text-foreground rounded-tl-sm',
          )}
        >
          {message.content}
        </div>
        <span className={cn('label-xs text-muted-foreground mt-1 block', isHR ? 'text-right' : '')}>
          {new Date(message.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ChatPage() {
  const [conversations, setConversations] = useState<HRChatConversation[]>(MOCK_CONVERSATIONS)
  const [allMessages, setAllMessages] = useState<Record<string, HRChatMessage[]>>(MOCK_MESSAGES)
  const [selectedId, setSelectedId] = useState<string | null>(MOCK_CONVERSATIONS[0]?.id ?? null)
  const [search, setSearch] = useState('')
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    if (!search.trim()) return conversations
    return conversations.filter((c) =>
      c.employee_name.toLowerCase().includes(search.toLowerCase()),
    )
  }, [conversations, search])

  const selectedConv = conversations.find((c) => c.id === selectedId)
  const messages = selectedId ? (allMessages[selectedId] ?? []) : []

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSelectConversation(id: string) {
    setSelectedId(id)
    // Mark as read
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread_count: 0 } : c)),
    )
  }

  function handleSend() {
    if (!input.trim() || !selectedId) return
    const newMsg: HRChatMessage = {
      id: `msg-new-${Date.now()}`,
      conversation_id: selectedId,
      sender_id: 'hr-1',
      sender_name: 'Laura Martínez (RRHH)',
      sender_role: 'hr',
      content: input.trim(),
      created_at: new Date().toISOString(),
      is_read: false,
    }
    setAllMessages((prev) => ({
      ...prev,
      [selectedId]: [...(prev[selectedId] ?? []), newMsg],
    }))
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? { ...c, last_message: newMsg.content, last_message_at: newMsg.created_at }
          : c,
      ),
    )
    setInput('')
  }

  function handleToggleStatus() {
    if (!selectedId) return
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? { ...c, status: c.status === 'open' ? 'closed' : 'open' }
          : c,
      ),
    )
  }

  const isClosed = selectedConv?.status === 'closed'

  return (
    <div className="flex h-[calc(100vh-4rem-3rem)] bg-background rounded-lg border border-border overflow-hidden">
      {/* Left panel — Conversations */}
      <div className="w-80 shrink-0 border-r border-border flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 border-b border-border">
          <span className="label-md font-semibold text-foreground block mb-2">Chat RRHH</span>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar conversaciones..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 paragraph-sm"
            />
          </div>
        </div>

        {/* Conversations list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <ChatCircleIcon className="size-8 text-muted-foreground mb-2" />
              <span className="paragraph-sm text-muted-foreground">Sin conversaciones</span>
            </div>
          ) : (
            filtered.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                isSelected={conv.id === selectedId}
                onClick={() => handleSelectConversation(conv.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Right panel — Messages */}
      {selectedConv ? (
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                <span className="label-sm font-semibold text-muted-foreground">
                  {getInitials(selectedConv.employee_name)}
                </span>
              </div>
              <div>
                <span className="label-sm font-semibold text-foreground block">
                  {selectedConv.employee_name}
                </span>
                <Badge
                  variant={selectedConv.status === 'open' ? 'success' : 'neutral'}
                  size="xs"
                >
                  {selectedConv.status === 'open' ? 'Abierta' : 'Cerrada'}
                </Badge>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleStatus}
            >
              {isClosed ? (
                <><LockOpenIcon className="size-4 mr-1.5" />Reabrir</>
              ) : (
                <><LockIcon className="size-4 mr-1.5" />Cerrar conversación</>
              )}
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 px-4 py-4 overflow-y-auto">
            <div className="flex flex-col gap-3">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <ChatCircleIcon className="size-10 text-muted-foreground mb-2" />
                  <span className="paragraph-sm text-muted-foreground">Sin mensajes aún</span>
                </div>
              ) : (
                messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-border">
            {isClosed ? (
              <div className="flex items-center justify-center gap-2 py-2 text-muted-foreground">
                <LockIcon className="size-4" />
                <span className="paragraph-sm">Esta conversación está cerrada</span>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Escribe un mensaje..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                  className="flex-1 paragraph-sm"
                />
                <Button onClick={handleSend} disabled={!input.trim()} size="sm">
                  <PaperPlaneTiltIcon className="size-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <ChatCircleIcon className="size-12 text-muted-foreground mb-3" />
          <span className="label-md font-medium text-foreground">Selecciona una conversación</span>
          <span className="paragraph-sm text-muted-foreground mt-1">
            Elige una conversación de la lista para ver los mensajes.
          </span>
        </div>
      )}
    </div>
  )
}
