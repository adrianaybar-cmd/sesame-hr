'use client'

export const dynamic = 'force-dynamic'

import { useState, useMemo } from 'react'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import { Card, CardContent } from '@clasing/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@clasing/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@clasing/ui/tabs'
import { Input } from '@clasing/ui/input'
import { Textarea } from '@clasing/ui/textarea'
import { Switch } from '@clasing/ui/switch'
import {
  PlusIcon,
  UsersThreeIcon,
  LightbulbIcon,
  CrownIcon,
  HandshakeIcon,
  StarIcon,
  HeartIcon,
  RocketIcon,
  ArrowRightIcon,
} from '@phosphor-icons/react'
import { MOCK_BOOST_CARDS } from '@/lib/mock/boost'
import type { BoostCard, BoostCategory } from '@/lib/types/boost'
import { cn } from '@/lib/utils'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CURRENT_USER_ID = 'mgr-1'
const CURRENT_USER_NAME = 'Laura Martínez'

const CATEGORY_CONFIG: Record<BoostCategory, { label: string; color: string; icon: React.ReactNode }> = {
  teamwork: { label: 'Trabajo en equipo', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: <UsersThreeIcon className="size-5" /> },
  innovation: { label: 'Innovación', color: 'bg-violet-100 text-violet-700 border-violet-200', icon: <LightbulbIcon className="size-5" /> },
  leadership: { label: 'Liderazgo', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: <CrownIcon className="size-5" /> },
  customer: { label: 'Orientación cliente', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: <HandshakeIcon className="size-5" /> },
  excellence: { label: 'Excelencia', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: <StarIcon className="size-5" /> },
  values: { label: 'Valores', color: 'bg-pink-100 text-pink-700 border-pink-200', icon: <HeartIcon className="size-5" /> },
}

function getInitials(name: string): string {
  return name.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase()
}

function getTimeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`
  const days = Math.floor(diff / 86400)
  if (days === 1) return 'ayer'
  if (days < 7) return `hace ${days} días`
  return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

// ─── BoostCardItem ────────────────────────────────────────────────────────────

interface BoostCardItemProps {
  card: BoostCard
  onReact: (cardId: string, emoji: string) => void
}

const QUICK_EMOJIS = ['🚀', '👏', '❤️', '⭐', '💡', '🎉', '🏆', '💪']

function BoostCardItem({ card, onReact }: BoostCardItemProps) {
  const cfg = CATEGORY_CONFIG[card.category]
  const [showEmojis, setShowEmojis] = useState(false)

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div className="flex -space-x-2 shrink-0">
            <div className="size-9 rounded-full bg-muted border-2 border-background flex items-center justify-center z-10">
              <span className="label-xs font-semibold text-muted-foreground">
                {getInitials(card.sender_name)}
              </span>
            </div>
            <div className="size-9 rounded-full bg-blue-100 border-2 border-background flex items-center justify-center">
              <span className="label-xs font-semibold text-blue-700">
                {getInitials(card.recipient_name)}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="label-sm font-semibold text-foreground">{card.sender_name}</span>
              <ArrowRightIcon className="size-3.5 text-muted-foreground shrink-0" />
              <span className="label-sm font-semibold text-foreground">{card.recipient_name}</span>
            </div>
            <span className="label-xs text-muted-foreground">{getTimeAgo(card.created_at)}</span>
          </div>
          <Badge size="sm" className={cn('shrink-0 border', cfg.color)}>
            <span className="mr-1">{cfg.icon}</span>
            {cfg.label}
          </Badge>
        </div>

        {/* Message */}
        <p className="paragraph-sm text-foreground bg-muted/40 rounded-lg p-3 mb-3">
          &ldquo;{card.message}&rdquo;
        </p>

        {/* Reactions */}
        <div className="flex items-center gap-2 flex-wrap">
          {card.reactions.map((r) => (
            <button
              key={r.emoji}
              onClick={() => onReact(card.id, r.emoji)}
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-full border text-sm transition-colors hover:bg-muted',
                r.user_ids.includes(CURRENT_USER_ID) ? 'border-blue-300 bg-blue-50' : 'border-border bg-background',
              )}
            >
              <span>{r.emoji}</span>
              <span className="label-xs text-muted-foreground">{r.count}</span>
            </button>
          ))}
          <div className="relative">
            <button
              onClick={() => setShowEmojis((v) => !v)}
              className="flex items-center gap-1 px-2 py-1 rounded-full border border-dashed border-border hover:bg-muted transition-colors label-xs text-muted-foreground"
            >
              + Reaccionar
            </button>
            {showEmojis && (
              <div className="absolute bottom-8 left-0 flex gap-1 bg-background border border-border rounded-xl p-2 shadow-lg z-10">
                {QUICK_EMOJIS.map((e) => (
                  <button
                    key={e}
                    onClick={() => { onReact(card.id, e); setShowEmojis(false) }}
                    className="text-lg hover:scale-125 transition-transform"
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Send Boost Dialog ────────────────────────────────────────────────────────

interface SendBoostDialogProps {
  open: boolean
  onClose: () => void
  onSend: (data: { recipient: string; category: BoostCategory; message: string; isPublic: boolean }) => void
}

function SendBoostDialog({ open, onClose, onSend }: SendBoostDialogProps) {
  const [recipient, setRecipient] = useState('')
  const [category, setCategory] = useState<BoostCategory | null>(null)
  const [message, setMessage] = useState('')
  const [isPublic, setIsPublic] = useState(true)

  function handleSend() {
    if (!recipient.trim() || !category || !message.trim()) return
    onSend({ recipient, category, message, isPublic })
    setRecipient('')
    setCategory(null)
    setMessage('')
    setIsPublic(true)
  }

  return (
    <Dialog open={open} onOpenChange={(v: boolean) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Enviar Boost</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div>
            <label className="label-sm font-medium text-foreground block mb-1.5">
              ¿A quién quieres reconocer?
            </label>
            <Input
              placeholder="Nombre del empleado"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>

          <div>
            <label className="label-sm font-medium text-foreground block mb-2">Categoría</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(CATEGORY_CONFIG) as [BoostCategory, typeof CATEGORY_CONFIG[BoostCategory]][]).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => setCategory(key)}
                  className={cn(
                    'flex items-center gap-2 p-3 rounded-lg border-2 text-left transition-all',
                    category === key
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-border hover:border-muted-foreground',
                  )}
                >
                  <span className={cn('shrink-0 size-8 rounded-lg flex items-center justify-center', cfg.color)}>
                    {cfg.icon}
                  </span>
                  <span className="label-xs font-medium text-foreground">{cfg.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label-sm font-medium text-foreground block mb-1.5">Mensaje</label>
            <Textarea
              placeholder="Escribe un mensaje de reconocimiento sincero y específico..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/40 border border-border">
            <div>
              <span className="label-sm font-medium text-foreground block">Visible para todos</span>
              <span className="label-xs text-muted-foreground">Se publicará en el feed de la empresa</span>
            </div>
            <Switch checked={isPublic} onCheckedChange={setIsPublic} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSend} disabled={!recipient.trim() || !category || !message.trim()}>
            <RocketIcon className="size-4 mr-1.5" />
            Enviar Boost
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminBoostPage() {
  const [cards, setCards] = useState<BoostCard[]>(MOCK_BOOST_CARDS)
  const [sendOpen, setSendOpen] = useState(false)
  const [tab, setTab] = useState('feed')

  const publicFeed = useMemo(() => cards.filter((c) => c.is_public), [cards])
  const myReceived = useMemo(() => cards.filter((c) => c.recipient_id === CURRENT_USER_ID), [cards])

  function handleReact(cardId: string, emoji: string) {
    setCards((prev) =>
      prev.map((card) => {
        if (card.id !== cardId) return card
        const existing = card.reactions.find((r) => r.emoji === emoji)
        if (existing) {
          const alreadyReacted = existing.user_ids.includes(CURRENT_USER_ID)
          return {
            ...card,
            reactions: card.reactions.map((r) =>
              r.emoji === emoji
                ? {
                    ...r,
                    count: alreadyReacted ? r.count - 1 : r.count + 1,
                    user_ids: alreadyReacted
                      ? r.user_ids.filter((id) => id !== CURRENT_USER_ID)
                      : [...r.user_ids, CURRENT_USER_ID],
                  }
                : r,
            ).filter((r) => r.count > 0),
          }
        }
        return {
          ...card,
          reactions: [...card.reactions, { emoji, count: 1, user_ids: [CURRENT_USER_ID] }],
        }
      }),
    )
  }

  function handleSend(data: { recipient: string; category: BoostCategory; message: string; isPublic: boolean }) {
    const newCard: BoostCard = {
      id: `boost-new-${Date.now()}`,
      sender_id: CURRENT_USER_ID,
      sender_name: CURRENT_USER_NAME,
      recipient_id: `emp-new-${Date.now()}`,
      recipient_name: data.recipient,
      category: data.category,
      message: data.message,
      is_public: data.isPublic,
      created_at: new Date().toISOString(),
      reactions: [],
    }
    setCards((prev) => [newCard, ...prev])
    setSendOpen(false)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="title-lg font-semibold text-foreground">Boost — Reconocimiento</h1>
          <p className="paragraph-sm text-muted-foreground mt-0.5">
            Reconoce los logros y actitudes de tus compañeros
          </p>
        </div>
        <Button onClick={() => setSendOpen(true)}>
          <RocketIcon className="size-4 mr-1.5" />
          Enviar Boost
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <span className="label-xs text-muted-foreground block">Total en el feed</span>
            <span className="title-lg font-semibold text-foreground">{publicFeed.length}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <span className="label-xs text-muted-foreground block">Reconocimientos recibidos</span>
            <span className="title-lg font-semibold text-foreground">{myReceived.length}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <span className="label-xs text-muted-foreground block">Boost enviados</span>
            <span className="title-lg font-semibold text-foreground">
              {cards.filter((c) => c.sender_id === CURRENT_USER_ID).length}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList {...({} as any)}>
          <TabsTrigger value="feed">Feed público</TabsTrigger>
          <TabsTrigger value="received">
            Mis reconocimientos
            {myReceived.length > 0 && (
              <Badge variant="default" size="xs" className="ml-1.5">{myReceived.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="mt-4">
          <div className="flex flex-col gap-4 max-w-2xl">
            {publicFeed.length === 0 ? (
              <div className="text-center py-12">
                <RocketIcon className="size-10 text-muted-foreground mx-auto mb-3" />
                <span className="label-md font-medium text-foreground block">Sin boost en el feed</span>
                <span className="paragraph-sm text-muted-foreground">¡Sé el primero en reconocer a un compañero!</span>
              </div>
            ) : (
              publicFeed.map((card) => (
                <BoostCardItem key={card.id} card={card} onReact={handleReact} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="received" className="mt-4">
          <div className="flex flex-col gap-4 max-w-2xl">
            {myReceived.length === 0 ? (
              <div className="text-center py-12">
                <StarIcon className="size-10 text-muted-foreground mx-auto mb-3" />
                <span className="label-md font-medium text-foreground block">Aún no has recibido ningún boost</span>
                <span className="paragraph-sm text-muted-foreground">¡Sigue así, seguro que pronto te reconocerán!</span>
              </div>
            ) : (
              myReceived.map((card) => (
                <BoostCardItem key={card.id} card={card} onReact={handleReact} />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog */}
      <SendBoostDialog open={sendOpen} onClose={() => setSendOpen(false)} onSend={handleSend} />
    </div>
  )
}
