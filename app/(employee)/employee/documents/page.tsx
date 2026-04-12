'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@clasing/ui/dialog'
import {
  FolderIcon,
  FilePdfIcon,
  FileDocIcon,
  MicrosoftExcelLogoIcon,
  ImageIcon,
  FileIcon,
  DownloadSimpleIcon,
  EyeIcon,
  ArrowLeftIcon,
  PenIcon,
  CheckCircleIcon,
} from '@phosphor-icons/react'
import { MOCK_DOCUMENTS } from '@/lib/mock/documents'
import type { Document, DocumentFolder } from '@/lib/types/documents'
import { cn } from '@/lib/utils'

// ─── Constants ────────────────────────────────────────────────────────────────

// Demo: empleado emp-6 (Sofía Moreno)
const CURRENT_EMPLOYEE_ID = 'emp-6'

const FOLDERS: { id: DocumentFolder; label: string }[] = [
  { id: 'contracts', label: 'Contratos' },
  { id: 'payslips', label: 'Nóminas' },
  { id: 'training', label: 'Formación' },
  { id: 'evaluations', label: 'Evaluaciones' },
  { id: 'id_documents', label: 'Documentos de identidad' },
  { id: 'medical', label: 'Documentos médicos' },
  { id: 'certificates', label: 'Certificados' },
  { id: 'benefits', label: 'Beneficios' },
  { id: 'policies', label: 'Políticas de empresa' },
  { id: 'onboarding', label: 'Onboarding' },
  { id: 'offboarding', label: 'Offboarding' },
  { id: 'other', label: 'Otros' },
]

function fileIcon(type: Document['file_type']) {
  switch (type) {
    case 'pdf': return FilePdfIcon
    case 'docx': return FileDocIcon
    case 'xlsx': return MicrosoftExcelLogoIcon
    case 'jpg':
    case 'png': return ImageIcon
    default: return FileIcon
  }
}

function formatSize(kb: number): string {
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`
  return `${kb} KB`
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EmployeeDocumentsPage() {
  const [selectedFolder, setSelectedFolder] = useState<DocumentFolder | null>(null)
  const [signDoc, setSignDoc] = useState<Document | null>(null)
  const [signedIds, setSignedIds] = useState<Set<string>>(new Set())

  const myDocs = MOCK_DOCUMENTS.filter(
    (d) => d.employee_id === CURRENT_EMPLOYEE_ID && d.is_shared
  )

  const folderCounts = FOLDERS.map(({ id, label }) => ({
    id,
    label,
    count: myDocs.filter((d) => d.folder === id).length,
    pendingSignature: myDocs.filter(
      (d) => d.folder === id && d.requires_signature && !d.signed_at && !signedIds.has(d.id)
    ).length,
  }))

  const folderDocs = selectedFolder
    ? myDocs.filter((d) => d.folder === selectedFolder)
    : []

  function handleSign() {
    if (!signDoc) return
    setSignedIds((prev) => new Set([...prev, signDoc.id]))
    setSignDoc(null)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="title-2xs font-semibold text-foreground">Mis Documentos</h1>
        <p className="paragraph-sm text-muted-foreground mt-1">
          {myDocs.length} documentos disponibles
        </p>
      </div>

      {!selectedFolder ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {folderCounts.map(({ id, label, count, pendingSignature }) => {
            if (count === 0) return null
            return (
              <button
                key={id}
                className="text-left rounded-xl border border-border bg-card p-5 hover:shadow-sm hover:border-primary/30 transition-all flex flex-col gap-3"
                onClick={() => setSelectedFolder(id)}
              >
                <div className="flex items-start justify-between">
                  <FolderIcon className="size-8 text-primary" weight="duotone" />
                  {pendingSignature > 0 && (
                    <Badge variant="warning" size="sm">{pendingSignature} pendiente{pendingSignature !== 1 ? 's' : ''}</Badge>
                  )}
                </div>
                <div>
                  <p className="label-md font-semibold text-foreground">{label}</p>
                  <p className="paragraph-xs text-muted-foreground mt-0.5">
                    {count} documento{count !== 1 ? 's' : ''}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {/* Back navigation */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" iconOnly onClick={() => setSelectedFolder(null)}>
              <ArrowLeftIcon className="size-4" />
            </Button>
            <div className="flex items-center gap-2">
              <FolderIcon className="size-5 text-primary" weight="duotone" />
              <h2 className="label-md font-semibold text-foreground">
                {FOLDERS.find((f) => f.id === selectedFolder)?.label}
              </h2>
              <Badge variant="neutral" size="sm">{folderDocs.length}</Badge>
            </div>
          </div>

          {/* Documents */}
          {folderDocs.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <FolderIcon className="size-12 text-muted-foreground" />
              <p className="paragraph-sm text-muted-foreground">No hay documentos en esta carpeta</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {folderDocs.map((doc) => {
                const Icon = fileIcon(doc.file_type)
                const needsSign = doc.requires_signature && !doc.signed_at && !signedIds.has(doc.id)
                const isSigned = doc.signed_at || signedIds.has(doc.id)

                return (
                  <div
                    key={doc.id}
                    className="flex items-center gap-4 px-5 py-4 rounded-xl border border-border bg-card hover:bg-accent/20 transition-colors"
                  >
                    <Icon className="size-6 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="label-sm font-medium text-foreground truncate">{doc.name}</p>
                        {needsSign && (
                          <Badge variant="warning" size="sm">Pendiente firma</Badge>
                        )}
                        {isSigned && (
                          <Badge variant="success" size="sm">
                            <CheckCircleIcon className="size-3" />
                            Firmado
                          </Badge>
                        )}
                      </div>
                      <p className="paragraph-xs text-muted-foreground mt-0.5">
                        {formatSize(doc.file_size_kb)} · {new Date(doc.uploaded_at).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button variant="ghost" size="xs" iconOnly tooltip="Ver documento">
                        <EyeIcon className="size-4" />
                      </Button>
                      <Button variant="ghost" size="xs" iconOnly tooltip="Descargar">
                        <DownloadSimpleIcon className="size-4" />
                      </Button>
                      {needsSign && (
                        <Button variant="outline" size="xs" onClick={() => setSignDoc(doc)}>
                          <PenIcon className="size-4" />
                          Firmar
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Signature Dialog */}
      <Dialog open={!!signDoc} onOpenChange={() => setSignDoc(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Firmar documento</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <p className="paragraph-sm text-muted-foreground">
              Vas a firmar digitalmente el siguiente documento:
            </p>
            {signDoc && (
              <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
                <FilePdfIcon className="size-6 text-muted-foreground shrink-0" />
                <div>
                  <p className="label-sm font-medium text-foreground">{signDoc.name}</p>
                  <p className="paragraph-xs text-muted-foreground">{formatSize(signDoc.file_size_kb)}</p>
                </div>
              </div>
            )}
            <p className="paragraph-xs text-muted-foreground">
              Al confirmar, estás aceptando el contenido del documento con tu firma electrónica. Esta acción quedará registrada con fecha y hora actuales.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSignDoc(null)}>Cancelar</Button>
            <Button variant="primary" onClick={handleSign}>
              <PenIcon className="size-4" />
              Confirmar firma
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
