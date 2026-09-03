import { BookOpen, NotebookPen, Flag } from 'lucide-react'

function formatTime(totalSeconds) {
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0')
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
  const s = String(totalSeconds % 60).padStart(2, '0')
  return `${h}:${m}:${s}`
}

export default function ExamHeader({
  current,
  total,
  remainingSeconds,
  onOpenAssistant,
  onOpenNotepad,
  onToggleFlag,
  isFlagged,
  onFinish,
  examLabel,
}) {
  const urgent = remainingSeconds <= 15 * 60
  const critical = remainingSeconds <= 5 * 60

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-30 bg-canvas/85 backdrop-blur-md border-b border-stroke flex items-center px-4 gap-4">
      <span className="font-mono text-xs text-azure-bright uppercase tracking-widest hidden sm:block">
        {examLabel}
      </span>
      <span className="text-sm text-slate-400">
        Pregunta <span className="text-slate-100 font-medium">{current}</span> / {total}
      </span>

      <div
        className={`font-mono text-sm px-3 py-1 rounded-full border ml-auto ${
          critical
            ? 'border-danger/40 bg-danger/10 text-danger animate-pulse'
            : urgent
            ? 'border-warning/40 bg-warning/10 text-warning'
            : 'border-stroke bg-panel text-slate-200'
        }`}
      >
        {formatTime(remainingSeconds)}
      </div>

      <button
        onClick={onToggleFlag}
        title="Marcar para revisión"
        className={`p-2 rounded-md border transition ${
          isFlagged
            ? 'border-warning/40 bg-warning/10 text-warning'
            : 'border-stroke bg-panel/60 text-slate-400 hover:text-warning hover:border-warning/40'
        }`}
      >
        <Flag size={18} />
      </button>

      <button
        onClick={onOpenNotepad}
        title="Bloc de notas"
        className="p-2 rounded-md border border-stroke bg-panel/60 text-slate-400 hover:text-azure-bright hover:border-azure/40 transition"
      >
        <NotebookPen size={18} />
      </button>

      <button
        onClick={onOpenAssistant}
        title="Asistente de Microsoft Learn"
        className="p-2 rounded-md border border-stroke bg-panel/60 text-slate-400 hover:text-azure-bright hover:border-azure/40 transition flex items-center gap-2"
      >
        <BookOpen size={18} />
        <span className="hidden md:inline text-xs">Asistente Learn</span>
      </button>

      <button
        onClick={onFinish}
        className="rounded-md bg-danger/10 border border-danger/40 text-danger px-3 py-2 text-sm font-medium hover:bg-danger hover:text-white transition"
      >
        Finalizar Examen
      </button>
    </header>
  )
}
