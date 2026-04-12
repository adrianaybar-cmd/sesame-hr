'use client'

import { useState, useCallback } from 'react'
import { Button } from '@clasing/ui/button'
import { Input } from '@clasing/ui/input'
import { Badge } from '@clasing/ui/badge'
import {
  TextTIcon,
  StarIcon,
  ListBulletsIcon,
  CheckSquareIcon,
  ToggleLeftIcon,
  UploadSimpleIcon,
  CalendarIcon,
  PlusIcon,
  TrashIcon,
  CopyIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  PencilSimpleIcon,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import type { Question, QuestionType, Questionnaire } from '@/lib/types/questionnaire'
import { QuestionnaireRenderer } from './questionnaire-renderer'

// ─── Question type catalog ─────────────────────────────────────────────────

const QUESTION_TYPES: { type: QuestionType; label: string; icon: React.ElementType; description: string }[] = [
  { type: 'text', label: 'Texto libre', icon: TextTIcon, description: 'El respondente escribe su respuesta' },
  { type: 'rating', label: 'Valoración', icon: StarIcon, description: 'Escala numérica (1-5 o 1-10)' },
  { type: 'multiple_choice', label: 'Opción única', icon: ListBulletsIcon, description: 'Selección de una opción' },
  { type: 'checkbox', label: 'Selección múltiple', icon: CheckSquareIcon, description: 'Varias opciones posibles' },
  { type: 'yes_no', label: 'Sí / No', icon: ToggleLeftIcon, description: 'Respuesta binaria' },
  { type: 'file_upload', label: 'Subir archivo', icon: UploadSimpleIcon, description: 'Adjuntar documento' },
  { type: 'date', label: 'Fecha', icon: CalendarIcon, description: 'Selector de fecha' },
]

function generateId() {
  return `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function createQuestion(type: QuestionType, order: number): Question {
  const base: Question = {
    id: generateId(),
    type,
    text: '',
    required: false,
    order,
  }
  if (type === 'multiple_choice' || type === 'checkbox') {
    base.options = ['Opción 1', 'Opción 2']
  }
  if (type === 'rating') {
    base.scale = { min: 1, max: 5, min_label: 'Muy bajo', max_label: 'Muy alto' }
  }
  return base
}

// ─── Single question editor ────────────────────────────────────────────────

function QuestionEditor({
  question,
  index,
  total,
  onChange,
  onDelete,
  onDuplicate,
  onMove,
}: {
  question: Question
  index: number
  total: number
  onChange: (q: Question) => void
  onDelete: () => void
  onDuplicate: () => void
  onMove: (dir: 'up' | 'down') => void
}) {
  const typeInfo = QUESTION_TYPES.find((t) => t.type === question.type)!
  const Icon = typeInfo.icon

  function updateOptions(idx: number, val: string) {
    const opts = [...(question.options ?? [])]
    opts[idx] = val
    onChange({ ...question, options: opts })
  }
  function addOption() {
    onChange({ ...question, options: [...(question.options ?? []), `Opción ${(question.options?.length ?? 0) + 1}`] })
  }
  function removeOption(idx: number) {
    const opts = (question.options ?? []).filter((_, i) => i !== idx)
    onChange({ ...question, options: opts })
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <Icon className="size-4 text-muted-foreground shrink-0" />
          <span className="label-xs font-medium text-muted-foreground">{typeInfo.label}</span>
          <span className="label-xs text-muted-foreground">·</span>
          <span className="label-xs text-muted-foreground">Pregunta {index + 1}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onMove('up')}
            disabled={index === 0}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Subir"
          >
            <ArrowUpIcon className="size-3.5" />
          </button>
          <button
            onClick={() => onMove('down')}
            disabled={index === total - 1}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Bajar"
          >
            <ArrowDownIcon className="size-3.5" />
          </button>
          <button
            onClick={onDuplicate}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            title="Duplicar"
          >
            <CopyIcon className="size-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 rounded text-muted-foreground hover:text-error hover:bg-error/10 transition-colors"
            title="Eliminar"
          >
            <TrashIcon className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Question text */}
      <Input
        value={question.text}
        onChange={(e) => onChange({ ...question, text: e.target.value })}
        placeholder="Escribe el texto de la pregunta..."
      />

      {/* Type-specific config */}
      {(question.type === 'multiple_choice' || question.type === 'checkbox') && (
        <div className="flex flex-col gap-2">
          <span className="label-xs font-medium text-muted-foreground">Opciones</span>
          {question.options?.map((opt, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div
                className={cn(
                  'size-3.5 border border-border shrink-0',
                  question.type === 'multiple_choice' ? 'rounded-full' : 'rounded-sm',
                )}
              />
              <Input
                value={opt}
                onChange={(e) => updateOptions(idx, e.target.value)}
                placeholder={`Opción ${idx + 1}`}
                className="flex-1"
              />
              <button
                onClick={() => removeOption(idx)}
                className="p-1 rounded text-muted-foreground hover:text-error transition-colors"
              >
                <TrashIcon className="size-3.5" />
              </button>
            </div>
          ))}
          <Button variant="ghost" size="xs" onClick={addOption} className="self-start">
            <PlusIcon className="size-3.5" />
            Añadir opción
          </Button>
        </div>
      )}

      {question.type === 'rating' && question.scale && (
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="label-xs text-muted-foreground">Mín:</span>
            <Input
              type="number"
              value={question.scale.min}
              onChange={(e) => onChange({ ...question, scale: { ...question.scale!, min: Number(e.target.value) } })}
              className="w-16"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="label-xs text-muted-foreground">Máx:</span>
            <Input
              type="number"
              value={question.scale.max}
              onChange={(e) => onChange({ ...question, scale: { ...question.scale!, max: Number(e.target.value) } })}
              className="w-16"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="label-xs text-muted-foreground">Etiq. mín:</span>
            <Input
              value={question.scale.min_label ?? ''}
              onChange={(e) => onChange({ ...question, scale: { ...question.scale!, min_label: e.target.value } })}
              placeholder="Ej: Muy malo"
              className="w-28"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="label-xs text-muted-foreground">Etiq. máx:</span>
            <Input
              value={question.scale.max_label ?? ''}
              onChange={(e) => onChange({ ...question, scale: { ...question.scale!, max_label: e.target.value } })}
              placeholder="Ej: Excelente"
              className="w-28"
            />
          </div>
        </div>
      )}

      {/* Required toggle */}
      <div className="flex items-center gap-2">
        <button
          role="switch"
          aria-checked={question.required}
          onClick={() => onChange({ ...question, required: !question.required })}
          className={cn(
            'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors',
            question.required ? 'bg-primary' : 'bg-muted',
          )}
        >
          <span
            className={cn(
              'pointer-events-none inline-block size-4 rounded-full bg-white shadow-sm transition-transform',
              question.required ? 'translate-x-4' : 'translate-x-0',
            )}
          />
        </button>
        <span className="label-xs text-muted-foreground">Obligatoria</span>
        {question.required && (
          <Badge variant="warning" size="sm">
            Requerida
          </Badge>
        )}
      </div>
    </div>
  )
}

// ─── Main builder ──────────────────────────────────────────────────────────

interface QuestionnaireBuilderProps {
  initial?: Partial<Questionnaire>
  onSave?: (q: Questionnaire) => void
}

export function QuestionnaireBuilder({ initial, onSave }: QuestionnaireBuilderProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [questions, setQuestions] = useState<Question[]>(initial?.questions ?? [])
  const [mode, setMode] = useState<'edit' | 'preview'>('edit')
  const [dragOver, setDragOver] = useState<string | null>(null)

  const addQuestion = useCallback((type: QuestionType) => {
    setQuestions((prev) => [...prev, createQuestion(type, prev.length + 1)])
  }, [])

  const updateQuestion = useCallback((id: string, q: Question) => {
    setQuestions((prev) => prev.map((item) => (item.id === id ? q : item)))
  }, [])

  const deleteQuestion = useCallback((id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id).map((q, i) => ({ ...q, order: i + 1 })))
  }, [])

  const duplicateQuestion = useCallback((id: string) => {
    setQuestions((prev) => {
      const idx = prev.findIndex((q) => q.id === id)
      if (idx === -1) return prev
      const copy = { ...prev[idx], id: generateId() }
      const next = [...prev]
      next.splice(idx + 1, 0, copy)
      return next.map((q, i) => ({ ...q, order: i + 1 }))
    })
  }, [])

  const moveQuestion = useCallback((id: string, dir: 'up' | 'down') => {
    setQuestions((prev) => {
      const idx = prev.findIndex((q) => q.id === id)
      if (idx === -1) return prev
      const newIdx = dir === 'up' ? idx - 1 : idx + 1
      if (newIdx < 0 || newIdx >= prev.length) return prev
      const next = [...prev]
      ;[next[idx], next[newIdx]] = [next[newIdx], next[idx]]
      return next.map((q, i) => ({ ...q, order: i + 1 }))
    })
  }, [])

  function handleSave() {
    if (!title.trim()) return
    const questionnaire: Questionnaire = {
      id: initial?.id ?? generateId(),
      title: title.trim(),
      description: description.trim() || undefined,
      questions,
      usage: initial?.usage ?? ['evaluation'],
      is_active: initial?.is_active ?? true,
      created_at: initial?.created_at ?? new Date().toISOString(),
    }
    onSave?.(questionnaire)
  }

  const previewQuestionnaire: Questionnaire = {
    id: 'preview',
    title,
    description,
    questions,
    usage: ['evaluation'],
    is_active: true,
    created_at: new Date().toISOString(),
  }

  return (
    <div className="flex flex-col gap-6 min-h-0">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('edit')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md label-sm font-medium transition-colors',
              mode === 'edit'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent',
            )}
          >
            <PencilSimpleIcon className="size-4" />
            Editor
          </button>
          <button
            onClick={() => setMode('preview')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md label-sm font-medium transition-colors',
              mode === 'preview'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent',
            )}
          >
            <EyeIcon className="size-4" />
            Previsualizar
          </button>
        </div>
        <Button variant="primary" size="md" onClick={handleSave} disabled={!title.trim()}>
          Guardar cuestionario
        </Button>
      </div>

      {mode === 'preview' ? (
        <QuestionnaireRenderer questionnaire={previewQuestionnaire} onSubmit={() => setMode('edit')} />
      ) : (
        <div className="grid grid-cols-[280px_1fr] gap-6 min-h-0">
          {/* Left panel — question types */}
          <div className="flex flex-col gap-3">
            <p className="label-sm font-semibold text-foreground">Tipos de pregunta</p>
            <p className="paragraph-xs text-muted-foreground">Haz clic para añadir al cuestionario</p>
            <div className="flex flex-col gap-1.5">
              {QUESTION_TYPES.map(({ type, label, icon: Icon, description }) => (
                <button
                  key={type}
                  onClick={() => addQuestion(type)}
                  onDragStart={(e) => {
                    e.dataTransfer.setData('questionType', type)
                  }}
                  draggable
                  className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:bg-accent hover:border-primary/30 transition-colors text-left group"
                >
                  <Icon className="size-4 text-muted-foreground group-hover:text-primary shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="label-sm font-medium text-foreground">{label}</p>
                    <p className="paragraph-xs text-muted-foreground">{description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right panel — canvas */}
          <div className="flex flex-col gap-4">
            {/* Meta */}
            <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título del cuestionario..."
                className="text-lg font-semibold"
              />
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripción opcional..."
              />
            </div>

            {/* Drop zone / question list */}
            <div
              className={cn(
                'flex flex-col gap-3 min-h-[200px] rounded-lg border-2 border-dashed p-4 transition-colors',
                dragOver ? 'border-primary bg-primary/5' : 'border-border',
                questions.length === 0 ? 'items-center justify-center' : '',
              )}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver('canvas')
              }}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => {
                e.preventDefault()
                setDragOver(null)
                const type = e.dataTransfer.getData('questionType') as QuestionType
                if (type) addQuestion(type)
              }}
            >
              {questions.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8">
                  <PlusIcon className="size-8 text-muted-foreground" />
                  <p className="label-md font-medium text-muted-foreground">
                    Arrastra preguntas aquí o haz clic en un tipo
                  </p>
                  <p className="paragraph-sm text-muted-foreground">
                    El cuestionario aparecerá aquí según añadas preguntas
                  </p>
                </div>
              ) : (
                questions.map((q, idx) => (
                  <QuestionEditor
                    key={q.id}
                    question={q}
                    index={idx}
                    total={questions.length}
                    onChange={(updated) => updateQuestion(q.id, updated)}
                    onDelete={() => deleteQuestion(q.id)}
                    onDuplicate={() => duplicateQuestion(q.id)}
                    onMove={(dir) => moveQuestion(q.id, dir)}
                  />
                ))
              )}
            </div>

            {questions.length > 0 && (
              <p className="paragraph-xs text-muted-foreground text-center">
                {questions.length} pregunta{questions.length !== 1 ? 's' : ''} ·{' '}
                {questions.filter((q) => q.required).length} obligatoria
                {questions.filter((q) => q.required).length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
