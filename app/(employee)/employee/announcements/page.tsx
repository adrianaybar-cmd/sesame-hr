'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@clasing/ui/dialog'
import {
  MegaphoneIcon,
  CalendarIcon,
  UserIcon,
  EyeIcon,
} from '@phosphor-icons/react'
import { getPublishedAnnouncements } from '@/lib/mock/announcements'
import type { Announcement } from '@/lib/types/announcements'

// ─── Accent colors for cards ──────────────────────────────────────────────────

const CARD_COLORS = [
  'from-indigo-500/10 to-purple-500/10 border-indigo-200/40',
  'from-amber-500/10 to-orange-500/10 border-amber-200/40',
  'from-emerald-500/10 to-teal-500/10 border-emerald-200/40',
  'from-pink-500/10 to-rose-500/10 border-pink-200/40',
  'from-sky-500/10 to-blue-500/10 border-sky-200/40',
]

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

// ─── Announcement Card ────────────────────────────────────────────────────────

function AnnouncementCard({
  announcement,
  index,
  onClick,
}: {
  announcement: Announcement
  index: number
  onClick: () => void
}) {
  const snippet = stripHtml(announcement.content).slice(0, 120) + '...'
  const colorClass = CARD_COLORS[index % CARD_COLORS.length]

  return (
    <button
      className={`text-left w-full rounded-xl border bg-gradient-to-br ${colorClass} p-5 flex flex-col gap-3 hover:shadow-md transition-shadow`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="size-9 rounded-full bg-background/60 flex items-center justify-center shrink-0">
          <MegaphoneIcon className="size-4 text-foreground" />
        </div>
        {announcement.published_at && (
          <div className="flex items-center gap-1 text-muted-foreground shrink-0">
            <CalendarIcon className="size-3.5" />
            <span className="paragraph-xs">
              {new Date(announcement.published_at).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <h2 className="label-md font-semibold text-foreground leading-snug">{announcement.title}</h2>
        <p className="paragraph-sm text-muted-foreground line-clamp-3">{snippet}</p>
      </div>

      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-1 text-muted-foreground">
          <UserIcon className="size-3.5" />
          <span className="paragraph-xs">{announcement.author_name}</span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <EyeIcon className="size-3.5" />
          <span className="paragraph-xs">{announcement.views_count} vistas</span>
        </div>
      </div>
    </button>
  )
}

// ─── Announcement Detail Dialog ───────────────────────────────────────────────

function AnnouncementDetailDialog({
  announcement,
  onClose,
}: {
  announcement: Announcement | null
  onClose: () => void
}) {
  if (!announcement) return null

  return (
    <Dialog open={!!announcement} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-left leading-snug pr-6">{announcement.title}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <UserIcon className="size-4" />
              <span className="paragraph-sm">{announcement.author_name}</span>
            </div>
            {announcement.published_at && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <CalendarIcon className="size-4" />
                <span className="paragraph-sm">
                  {new Date(announcement.published_at).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}
          </div>

          <div className="border-t border-border" />

          {/* Render HTML content safely */}
          <div
            className="paragraph-sm text-foreground leading-relaxed prose-headings:font-semibold prose-strong:font-semibold prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5 [&_p]:mb-3 [&_ul]:mb-3 [&_ol]:mb-3 [&_li]:mb-1 [&_strong]:font-semibold"
            dangerouslySetInnerHTML={{ __html: announcement.content }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EmployeeAnnouncementsPage() {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)

  const announcements = getPublishedAnnouncements()

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="title-2xs font-semibold text-foreground">Comunicados</h1>
        <p className="paragraph-sm text-muted-foreground mt-1">
          Últimas noticias y comunicaciones de la empresa
        </p>
      </div>

      {/* Feed */}
      {announcements.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-20 text-center">
          <MegaphoneIcon className="size-12 text-muted-foreground" />
          <p className="paragraph-sm text-muted-foreground">No hay comunicados publicados</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {announcements.map((ann, i) => (
            <AnnouncementCard
              key={ann.id}
              announcement={ann}
              index={i}
              onClick={() => setSelectedAnnouncement(ann)}
            />
          ))}
        </div>
      )}

      <AnnouncementDetailDialog
        announcement={selectedAnnouncement}
        onClose={() => setSelectedAnnouncement(null)}
      />
    </div>
  )
}
