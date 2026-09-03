import { useState } from 'react'
import { ChevronDown, ExternalLink, CheckCircle2, XCircle } from 'lucide-react'

export default function QuestionCard({ question, selected, onAnswer, studyMode }) {
  const [expanded, setExpanded] = useState(false)
  const showExplanation = studyMode && selected !== undefined

  return (
    <div className="max-w-3xl mx-auto">
      <span className="inline-block font-mono text-xs px-2.5 py-1 rounded-full border border-azure/40 bg-azure/15 text-azure-bright mb-3">
        {question.domain}
      </span>

      <div className="rounded-xl border border-stroke bg-panel p-5 mb-4">
        <p className="text-slate-300 leading-relaxed mb-3">{question.scenario}</p>
        <p className="font-semibold text-slate-50">{question.question}</p>
      </div>

      <div className="flex flex-col gap-3">
        {question.options.map((opt) => {
          const isSelected = selected === opt.displayId
          return (
            <button
              key={opt.displayId}
              onClick={() => onAnswer(opt.displayId)}
              className={`text-left rounded-lg border px-4 py-3 transition flex gap-3 ${
                isSelected
                  ? 'border-azure-bright bg-azure/15'
                  : 'border-stroke bg-card hover:border-azure/40'
              }`}
            >
              <span className="font-mono text-azure-bright shrink-0">{opt.displayId}</span>
              <span className="text-sm text-slate-200">{opt.text}</span>
            </button>
          )
        })}
      </div>

      {showExplanation && (
        <ExplanationAccordion question={question} selected={selected} expanded={expanded} setExpanded={setExpanded} />
      )}
    </div>
  )
}

export function ExplanationAccordion({ question, selected, expanded, setExpanded }) {
  const wasCorrect = selected === question.correctDisplayId
  return (
    <div className="mt-4 rounded-xl border border-stroke overflow-hidden">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between px-4 py-3 bg-panel hover:bg-card transition text-left"
      >
        <span className="text-sm font-medium flex items-center gap-2">
          💡 Explicación Técnica y Análisis de Opciones
          {wasCorrect ? (
            <CheckCircle2 size={16} className="text-success" />
          ) : (
            <XCircle size={16} className="text-danger" />
          )}
        </span>
        <ChevronDown size={18} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <div className="p-4 bg-card space-y-4 text-sm">
          <div>
            <p className="text-success font-medium mb-1">
              ✅ Por qué {question.correctDisplayId} es la opción correcta
            </p>
            <p className="text-slate-300 leading-relaxed">{question.explanation.whyCorrect}</p>
          </div>

          <div>
            <p className="text-slate-200 font-medium mb-2">Desglose de opciones incorrectas</p>
            <div className="space-y-2">
              {question.options
                .filter((o) => o.originalId !== question.correctAnswer)
                .map((o) => (
                  <p key={o.displayId} className="text-slate-400 leading-relaxed">
                    <span className="font-mono text-danger">{o.displayId}.</span>{' '}
                    {question.explanation.whyIncorrect[o.originalId]}
                  </p>
                ))}
            </div>
          </div>

          {question.docReference && (
            <a
              href={question.docReference}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-azure-bright hover:underline text-xs font-mono"
            >
              <ExternalLink size={14} />
              Documentación oficial de Microsoft Learn
            </a>
          )}
        </div>
      )}
    </div>
  )
}
