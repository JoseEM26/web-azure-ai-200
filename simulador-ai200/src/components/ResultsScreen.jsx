import { useMemo, useState } from 'react'
import { CheckCircle2, XCircle, RotateCcw, Download, Printer } from 'lucide-react'
import Confetti from './Confetti'
import { ExplanationAccordion } from './QuestionCard'

const REVIEW_FILTERS = [
  { key: 'all', label: 'Todas' },
  { key: 'incorrect', label: 'Solo incorrectas' },
  { key: 'flagged', label: 'Marcadas' },
]

function formatTime(totalSeconds) {
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0')
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
  const s = String(totalSeconds % 60).padStart(2, '0')
  return `${h}:${m}:${s}`
}

export default function ResultsScreen({ state, onRetry, examId, totalQuestions, passScore = 700 }) {
  const { questions, answers, flagged, result } = state
  const [filter, setFilter] = useState('all')
  const [expandedId, setExpandedId] = useState(null)

  const visible = useMemo(
    () =>
      questions.filter((q) => {
        if (filter === 'incorrect') return answers[q.id] !== q.correctDisplayId
        if (filter === 'flagged') return flagged.includes(q.id)
        return true
      }),
    [questions, answers, flagged, filter],
  )

  const handleExport = () => {
    const summary = {
      puntaje: result.totalScore,
      aprobado: result.passed,
      correctas: result.correctCount,
      totalPreguntas: result.totalQuestions,
      tiempoUsadoSegundos: result.timeUsedSeconds,
      dominios: result.domainBreakdown,
    }
    const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `resultado-${examId}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen px-4 py-10">
      {result.passed && <Confetti />}

      <div className="max-w-3xl mx-auto">
        <div
          className={`rounded-xl border p-8 text-center mb-8 ${
            result.passed
              ? 'border-success/40 bg-success/10'
              : 'border-danger/40 bg-danger/10'
          }`}
        >
          {result.passed ? (
            <CheckCircle2 size={48} className="mx-auto text-success mb-3" />
          ) : (
            <XCircle size={48} className="mx-auto text-danger mb-3" />
          )}
          <h1 className={`text-3xl font-bold mb-1 ${result.passed ? 'text-success' : 'text-danger'}`}>
            {result.passed ? 'APROBADO' : 'NO APROBADO'}
          </h1>
          <p className="text-slate-300 font-mono text-lg mb-4">
            {result.totalScore} / 1000 puntos
          </p>
          {result.autoSubmitted && (
            <p className="text-xs text-warning font-mono mb-2">
              Enviado automáticamente al agotarse el tiempo
            </p>
          )}
          <div className="flex justify-center gap-8 text-sm text-slate-400">
            <span>
              Aciertos:{' '}
              <span className="text-slate-100 font-medium">
                {result.correctCount}/{result.totalQuestions}
              </span>
            </span>
            <span>
              Tiempo usado:{' '}
              <span className="text-slate-100 font-medium">{formatTime(result.timeUsedSeconds)}</span>
            </span>
            <span>
              Aprobación mínima: <span className="text-slate-100 font-medium">{passScore}</span>
            </span>
          </div>
        </div>

        <h2 className="font-semibold text-lg mb-3">Desglose por dominio</h2>
        <div className="space-y-3 mb-8">
          {Object.entries(result.domainBreakdown).map(([domain, stats]) => (
            <div key={domain}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">{domain}</span>
                <span className="font-mono text-slate-400">
                  {stats.correct}/{stats.total} ({stats.percent}%)
                </span>
              </div>
              <div className="h-2 rounded-full bg-card overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    stats.percent >= 70 ? 'bg-success' : stats.percent >= 40 ? 'bg-warning' : 'bg-danger'
                  }`}
                  style={{ width: `${stats.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-azure hover:bg-azure-hover text-white text-sm font-medium transition"
          >
            <RotateCcw size={16} /> Reintentar examen ({totalQuestions} nuevas preguntas)
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-stroke bg-panel text-slate-300 hover:border-azure/40 text-sm transition"
          >
            <Download size={16} /> Exportar resumen JSON
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-stroke bg-panel text-slate-300 hover:border-azure/40 text-sm transition"
          >
            <Printer size={16} /> Imprimir
          </button>
        </div>

        <h2 className="font-semibold text-lg mb-3">Revisión detallada</h2>
        <div className="flex flex-wrap gap-2 mb-5">
          {REVIEW_FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`text-xs px-3 py-1.5 rounded-full border font-mono transition ${
                filter === f.key
                  ? 'border-azure/40 bg-azure/15 text-azure-bright'
                  : 'border-stroke bg-panel text-slate-400 hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {visible.map((q) => {
            const chosen = answers[q.id]
            const wasCorrect = chosen === q.correctDisplayId
            const idx = questions.indexOf(q) + 1
            return (
              <div key={q.id} className="rounded-xl border border-stroke bg-panel p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="font-mono text-xs text-slate-500">Pregunta {idx}</span>
                  {wasCorrect ? (
                    <CheckCircle2 size={18} className="text-success shrink-0" />
                  ) : (
                    <XCircle size={18} className="text-danger shrink-0" />
                  )}
                </div>
                <p className="text-sm text-slate-200 font-medium mb-3">{q.question}</p>

                <div className="grid sm:grid-cols-2 gap-2 mb-2 text-sm">
                  <div className="rounded-md border border-stroke px-3 py-2">
                    <span className="block text-xs text-slate-500 mb-0.5">Tu respuesta</span>
                    <span className={wasCorrect ? 'text-success' : 'text-danger'}>
                      {chosen ?? '—'}.{' '}
                      {chosen ? q.options.find((o) => o.displayId === chosen)?.text : 'Sin responder'}
                    </span>
                  </div>
                  {!wasCorrect && (
                    <div className="rounded-md border border-success/40 px-3 py-2">
                      <span className="block text-xs text-slate-500 mb-0.5">Respuesta correcta</span>
                      <span className="text-success">
                        {q.correctDisplayId}.{' '}
                        {q.options.find((o) => o.displayId === q.correctDisplayId)?.text}
                      </span>
                    </div>
                  )}
                </div>

                <ExplanationAccordion
                  question={q}
                  selected={chosen}
                  expanded={expandedId === q.id}
                  setExpanded={(fn) =>
                    setExpandedId((prev) => {
                      const next = typeof fn === 'function' ? fn(prev === q.id) : fn
                      return next ? q.id : null
                    })
                  }
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
