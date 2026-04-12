'use client'

export const dynamic = 'force-dynamic'

import { useState, useRef } from 'react'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@clasing/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@clasing/ui/dialog'
import {
  FolderIcon,
  FilePdfIcon,
  FileDocIcon,
  MicrosoftExcelLogoIcon,
  ImageIcon,
  FileIcon,
  DownloadSimpleIcon,
  ShareNetworkIcon,
  TrashIcon,
  ArrowLeftIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  UserIcon,
} from '@phosphor-icons/react'
import { MOCK_EMPLOYEES as EMPLOYEES } from '@/lib/mock/employees'
import { MOCK_DOCUMENTS as DOCS } from '@/lib/mock/documents'
import type { Document, DocumentFolder } from '@/lib/types/documents'
import { cn } from '@/lib/utils'

// ─── Folder config ────────────────────────────────────────────────────────────

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

// ─── Drop Zone ────────────────────────────────────────────────────────────────

function DropZone({ folder }: { folder: DocumentFolder }) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploaded, setUploaded] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    const valid = files.filter((f) => f.size <= 25 * 1024 * 1024)
    setUploaded((prev) => [...prev, ...valid.map((f) => f.name)])
  }

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    const valid = files.filter((f) => f.size <= 25 * 1024 * 1024)
    setUploaded((prev) => [...prev, ...valid.map((f) => f.name)])
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className={cn(
          'border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-colors',
          isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-accent/30'
        )}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <CloudArrowUpIcon className="size-8 text-muted-foreground" />
        <div className="text-center">
          <p className="label-sm font-medium text-foreground">Arrastra archivos aquí o haz clic para seleccionar</p>
          <p className="paragraph-xs text-muted-foreground mt-1">PDF, DOCX, XLSX, JPG, PNG · Máximo 25 MB</p>
        </div>
        <input ref={inputRef} type="file" className="hidden" multiple accept=".pdf,.docx,.xlsx,.jpg,.png" onChange={handleFiles} />
      </div>
      {uploaded.length > 0 && (
        <div className="flex flex-col gap-1">
          {uploaded.map((name, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-md bg-success/10 border border-success/20">
              <CheckCircleIcon className="size-4 text-success shrink-0" />
              <span className="paragraph-xs text-foreground truncate">{name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminDocumentsPage() {
  const [selectedEmployee, setSelectedEmployee] = useState('all')
  const [selectedFolder, setSelectedFolder] = useState<DocumentFolder | null>(null)
  const [shareDocId, setShareDocId] = useState<string | null>(null)
  const [sharedIds, setSharedIds] = useState<Set<string>>(new Set())

  const activeEmployees = EMPLOYEES.filter((e) => e.status === 'active' || e.status === 'on_leave')

  const filteredDocs = DOCS.filter((d) => {
    const matchEmployee = selectedEmployee === 'all' || d.employee_id === selectedEmployee
    const matchFolder = !selectedFolder || d.folder === selectedFolder
    return matchEmployee && matchFolder
  })

  const folderCounts = FOLDERS.map(({ id, label }) => ({
    id,
    label,
    count: DOCS.filter((d) => {
      const matchEmp = selectedEmployee === 'all' || d.employee_id === selectedEmployee
      return d.folder === id && matchEmp
    }).length,
  }))

  const folderDocs = selectedFolder ? filteredDocs : []

  function handleShare(docId: string) {
    setSharedIds((prev) => new Set([...prev, docId]))
    setShareDocId(null)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="title-2xs font-semibold text-foreground">Gestor de Documentos</h1>
          <p className="paragraph-sm text-muted-foreground mt-1">
            {DOCS.length} documentos en total
          </p>
        </div>
      </div>

      {/* Employee selector */}
      <div className="flex items-center gap-3">
        <UserIcon className="size-4 text-muted-foreground shrink-0" />
        <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Filtrar por empleado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los empleados</SelectItem>
            {activeEmployees.map((e) => (
              <SelectItem key={e.id} value={e.id}>
                {e.first_name} {e.last_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedEmployee !== 'all' && (
          <p className="paragraph-sm text-muted-foreground">
            {filteredDocs.length} documento{filteredDocs.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Folder grid / document list */}
      {!selectedFolder ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {folderCounts.map(({ id, label, count }) => (
            <button
              key={id}
              className="text-left rounded-xl border border-border bg-card p-5 hover:shadow-sm hover:border-primary/30 transition-all flex flex-col gap-3"
              onClick={() => setSelectedFolder(id)}
            >
              <FolderIcon className="size-8 text-primary" weight="duotone" />
              <div>
                <p className="label-md font-semibold text-foreground">{label}</p>
                <p className="paragraph-xs text-muted-foreground mt-0.5">
                  {count} documento{count !== 1 ? 's' : ''}
                </p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {/* Back + folder title */}
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

          {/* Upload zone */}
          <DropZone folder={selectedFolder} />

          {/* Documents table */}
          {folderDocs.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-center">
              <FolderIcon className="size-12 text-muted-foreground" />
              <p className="paragraph-sm text-muted-foreground">No hay documentos en esta carpeta</p>
            </div>
          ) : (
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="divide-y divide-border">
                {folderDocs.map((doc) => {
                  const Icon = fileIcon(doc.file_type)
                  const isShared = doc.is_shared || sharedIds.has(doc.id)
                  return (
                    <div key={doc.id} className="flex items-center gap-4 px-5 py-4 bg-card hover:bg-accent/20 transition-colors">
                      <Icon className="size-5 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="label-sm font-medium text-foreground truncate">{doc.name}</p>
                        <p className="paragraph-xs text-muted-foreground">
                          {doc.employee_name} · {formatSize(doc.file_size_kb)} · {new Date(doc.uploaded_at).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {isShared && (
                          <Badge variant="success" size="sm">Compartido</Badge>
                        )}
                        {doc.requires_signature && !doc.signed_at && (
                          <Badge variant="warning" size="sm">Pendiente firma</Badge>
                        )}
                        <Button variant="ghost" size="xs" iconOnly tooltip="Descargar">
                          <DownloadSimpleIcon className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          iconOnly
                          tooltip="Compartir con empleado"
                          onClick={() => setShareDocId(doc.id)}
                        >
                          <ShareNetworkIcon className="size-4" />
                        </Button>
                        <Button variant="ghost" size="xs" iconOnly tooltip="Eliminar" className="text-destructive hover:text-destructive">
                          <TrashIcon className="size-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Share dialog */}
      <Dialog open={!!shareDocId} onOpenChange={() => setShareDocId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Compartir documento</DialogTitle>
          </DialogHeader>
          <p className="paragraph-sm text-muted-foreground py-2">
            ¿Confirmas que quieres compartir este documento con el empleado para que pueda verlo en su portal?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShareDocId(null)}>Cancelar</Button>
            <Button variant="primary" onClick={() => shareDocId && handleShare(shareDocId)}>
              <ShareNetworkIcon className="size-4" />
              Compartir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
