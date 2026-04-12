'use client'

import { useState } from 'react'
import { Button } from '@clasing/ui/button'
import { Badge } from '@clasing/ui/badge'
import {
  StarIcon,
  UploadSimpleIcon,
  CheckCircleIcon,
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import type { Questionnaire, Answer, Question } from '@/lib/types/questionnaire'

// ─── Individual question renderers ────────────────────────────────────────

function TextQuestion({
  question,
  value,
  onChange,
}: {
  question: Question
  value: string
  onChange: (v: string) => void
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={question.placeholder ?? 'Escribe tu respuesta...'}
      rows={3}
      className="w-full rounded-md border border-border bg-background px-3 py-2 paragraph-sm text-foreground placeholder:text-muted-foreground resize-y focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
    />
  )
}

function RatingQuestion({
  question,
  value,
  onChange,
}: {
  question: Question
  value: number | null
  onChange: (v: number) => void
}) {
  const scale = question.scale ?? { min: 1, max: 5 }
  const values = Array.from({ length: scale.max - scale.min + 1 }, (_, i) => i + scale.min)
  const isStars = scale.max <= 5

  if (isStars) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          {values.map((v) => (
            <button
              key={v}
              onClick={() => onChange(v)}
              className="p-0.5 transition-transform hover:scale-110"
              title={`${v}`}
            >
              <StarIcon
                className={cn('size-7 transition-colors', value !== null && v <= value ? 'text-warning' : 'text-muted')}
                weight={value !== null && v <= value ? 'fill' : 'regular'}
              />
            </button>
          ))}
        </div>
        <div className="flex justify-between">
          {scale.min_label && <span className="paragraph-xs text-muted-foreground">{scale.min_label}</span>}
          {scale.max_label && <span className="paragraph-xs text-muted-foreground">{scale.max_label}</span>}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1 flex-wrap">
        {values.map((v) => (
          <button
            key={v}
            onClick={() => onChange(v)}
            className={cn(
              'size-9 rounded-lg border label-sm font-medium transition-colors',
              value === v
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
            )}
          >
            {v}
          </button>
        ))}
      </div>
      <div className="flex justify-between">
        {scale.min_label && <span className="paragraph-xs text-muted-foreground">{scale.min_label}</span>}
        {scale.max_label && <span className="paragraph-xs text-muted-foreground">{scale.max_label}</span>}
      </div>
    </div>
  )
}

function MultipleChoiceQuestion({
  question,
  value,
  onChange,
}: {
  question: Question
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      {question.options?.map((opt) => (
        <label key={opt} className="flex items-center gap-3 cursor-pointer group">
          <div
            className={cn(
              'size-4 rounded-full border-2 flex items-center justify-center transition-colors shrink-0',
              value === opt ? 'border-primary bg-primary' : 'border-border group-hover:border-primary/50',
            )}
            onClick={() => onChange(opt)}
          >
            {value === opt && <div className="size-1.5 rounded-full bg-white" />}
          </div>
          <span className="paragraph-sm text-foreground group-hover:text-foreground">{opt}</span>
        </label>
      ))}
    </div>
  )
}

function CheckboxQuestion({
  question,
  value,
  onChange,
}: {
  question: Question
  value: string[]
  onChange: (v: string[]) => void
}) {
  function toggle(opt: string) {
    onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt])
  }

  return (
    <div className="flex flex-col gap-2">
      {question.options?.map((opt) => (
        <label key={opt} className="flex items-center gap-3 cursor-pointer group">
          <div
            className={cn(
              'size-4 rounded border-2 flex items-center justify-center transition-colors shrink-0',
              value.includes(opt) ? 'border-primary bg-primary' : 'border-border group-hover:border-primary/50',
            )}
            onClick={() => toggle(opt)}
          >
            {value.includes(opt) && (
              <svg className="size-2.5 text-white" fill="none" viewBox="0 0 10 8">
                <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span className="paragraph-sm text-foreground">{opt}</span>
        </label>
      ))}
    </div>
  )
}

function YesNoQuestion({
  value,
  onChange,
}: {
  value: boolean | null
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(true)}
        className={cn(
          'px-5 py-2 rounded-lg border label-md font-medium transition-colors',
          value === true ? 'bg-success text-white border-success' : 'border-border text-foreground hover:bg-accent',
        )}
      >
        Sí
      </button>
      <button
        onClick={() => onChange(false)}
        className={cn(
          'px-5 py-2 rounded-lg border label-md font-medium transition-colors',
          value === false ? 'bg-error text-white border-error' : 'border-border text-foreground hover:bg-accent',
        )}
      >
        No
      </button>
    </div>
  )
}

function FileUploadQuestion({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex flex-col items-center gap-3 p-6 rounded-lg border-2 border-dashed border-border hover:border-primary/40 cursor-pointer transition-colors">
        <UploadSimpleIcon className="size-8 text-muted-foreground" />
        <div className="text-center">
          <p className="label-sm font-medium text-foreground">Haz clic para subir o arrastra el archivo</p>
          <p className="paragraph-xs text-muted-foreground">PDF, DOC, ZIP hasta 10 MB</p>
        </div>
        <input
          type="file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onChange(file.name)
          }}
        />
      </label>
      {value && (
        <p className="paragraph-xs text-success flex items-center gap-1">
          <CheckCircleIcon className="size-3.5" weight="fill" />
          {value}
        </p>
      )}
    </div>
  )
}

function DateQuestion({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border border-border bg-background px-3 py-2 paragraph-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
    />
  )
}

// ─── Main renderer ─────────────────────────────────────────────────────────

interface QuestionnaireRendererProps {
  questionnaire: Questionnaire
  onSubmit?: (answers: Answer[]) => void
  submitLabel?: string
}

export function QuestionnaireRenderer({ questionnaire, onSubmit, submitLabel = 'Enviar respuestas' }: QuestionnaireRendererProps) {
  const [answers, setAnswers] = useState<Record<string, Answer['value']>>({})
  const [submitted, setSubmitted] = useState(false)

  function getValue(qId: string): Answer['value'] {
    return answers[qId] ?? null
  }

  function setValue(qId: string, value: Answer['value']) {
    setAnswers((prev) => ({ ...prev, [qId]: value }))
  }

  function isAnswered(q: Question): boolean {
    const v = getValue(q.id)
    if (v === null || v === undefined) return false
    if (typeof v === 'string') return v.trim().length > 0
    if (Array.isArray(v)) return v.length > 0
    return true
  }

  const unansweredRequired = questionnaire.questions.filter((q) => q.required && !isAnswered(q))

  function handleSubmit() {
    if (unansweredRequired.length > 0) return
    const answersArr: Answer[] = questionnaire.questions.map((q) => ({
      question_id: q.id,
      value: getValue(q.id),
    }))
    setSubmitted(true)
    onSubmit?.(answersArr)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <CheckCircleIcon className="size-16 text-success" weight="fill" />
        <h2 className="title-2xs font-semibold text-foreground">¡Respuestas enviadas!</h2>
        <p className="paragraph-sm text-muted-foreground max-w-sm">
          Gracias por completar el cuestionario. Tus respuestas han sido registradas correctamente.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="title-2xs font-semibold text-foreground">{questionnaire.title}</h2>
        {questionnaire.description && (
          <p className="paragraph-sm text-muted-foreground">{questionnaire.description}</p>
        )}
        <p className="paragraph-xs text-muted-foreground">
          {questionnaire.questions.length} preguntas ·{' '}
          {questionnaire.questions.filter((q) => q.required).length} obligatorias
        </p>
      </div>

      {/* Questions */}
      <div className="flex flex-col gap-5">
        {questionnaire.questions.map((q, idx) => (
          <div key={q.id} className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
            <div className="flex items-start gap-2">
              <span className="label-xs font-semibold text-muted-foreground shrink-0 mt-0.5">{idx + 1}.</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <p className="label-md font-medium text-foreground">{q.text || <em className="text-muted-foreground">Sin texto</em>}</p>
                  {q.required && (
                    <Badge variant="error" size="sm">
                      Obligatoria
                    </Badge>
                  )}
                </div>

                {q.type === 'text' && (
                  <TextQuestion question={q} value={(getValue(q.id) as string) ?? ''} onChange={(v) => setValue(q.id, v)} />
                )}
                {q.type === 'rating' && (
                  <RatingQuestion question={q} value={getValue(q.id) as number | null} onChange={(v) => setValue(q.id, v)} />
                )}
                {q.type === 'multiple_choice' && (
                  <MultipleChoiceQuestion question={q} value={(getValue(q.id) as string) ?? ''} onChange={(v) => setValue(q.id, v)} />
                )}
                {q.type === 'checkbox' && (
                  <CheckboxQuestion question={q} value={(getValue(q.id) as string[]) ?? []} onChange={(v) => setValue(q.id, v)} />
                )}
                {q.type === 'yes_no' && (
                  <YesNoQuestion value={getValue(q.id) as boolean | null} onChange={(v) => setValue(q.id, v)} />
                )}
                {q.type === 'file_upload' && (
                  <FileUploadQuestion value={(getValue(q.id) as string) ?? ''} onChange={(v) => setValue(q.id, v)} />
                )}
                {q.type === 'date' && (
                  <DateQuestion value={(getValue(q.id) as string) ?? ''} onChange={(v) => setValue(q.id, v)} />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between pt-2">
        {unansweredRequired.length > 0 && (
          <p className="paragraph-xs text-muted-foreground">
            {unansweredRequired.length} pregunta{unansweredRequired.length !== 1 ? 's' : ''} obligatoria
            {unansweredRequired.length !== 1 ? 's' : ''} pendiente
            {unansweredRequired.length !== 1 ? 's' : ''}
          </p>
        )}
        <Button
          variant="primary"
          size="md"
          onClick={handleSubmit}
          disabled={unansweredRequired.length > 0}
          className="ml-auto"
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  )
}
