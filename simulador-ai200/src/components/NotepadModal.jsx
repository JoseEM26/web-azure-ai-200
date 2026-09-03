import { useEffect, useState } from 'react'
import { X, NotebookPen } from 'lucide-react'

export default function NotepadModal({ open, onClose, questionNumber, value, onSave }) {
  const [text, setText] = useState(value ?? '')

  useEffect(() => {
    setText(value ?? '')
  }, [value, open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-panel border border-stroke rounded-xl shadow-2xl">
        <div className="flex items-center justify-between px-4 h-14 border-b border-stroke">
          <span className="flex items-center gap-2 font-medium">
            <NotebookPen size={18} className="text-azure-bright" />
            Apuntes — pregunta {questionNumber}
          </span>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-100">
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          <textarea
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            placeholder="Escribí tus apuntes sobre esta pregunta..."
            className="w-full rounded-lg bg-card border border-stroke p-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-azure-bright resize-none"
          />
        </div>
        <div className="flex justify-end gap-2 px-4 pb-4">
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-md text-sm text-slate-400 hover:text-slate-100 transition"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onSave(text)
              onClose()
            }}
            className="px-4 py-2 rounded-md bg-azure hover:bg-azure-hover text-white text-sm font-medium transition"
          >
            Guardar apunte
          </button>
        </div>
      </div>
    </div>
  )
}
