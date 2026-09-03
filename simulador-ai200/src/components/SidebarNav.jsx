import { useState } from 'react'
import { Flag } from 'lucide-react'

const FILTERS = [
  { key: 'all', label: 'Todas' },
  { key: 'unanswered', label: 'Sin responder' },
  { key: 'flagged', label: 'Marcadas' },
]

export default function SidebarNav({ questions, answers, flagged, currentIndex, onSelect }) {
  const [filter, setFilter] = useState('all')

  const visible = questions.filter((q, idx) => {
    if (filter === 'unanswered') return answers[q.id] === undefined
    if (filter === 'flagged') return flagged.includes(q.id)
    return true
  })

  return (
    <aside className="w-full lg:w-64 shrink-0 border-r border-stroke bg-panel/40 p-4 flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`text-xs px-2.5 py-1 rounded-full border font-mono transition ${
              filter === f.key
                ? 'border-azure/40 bg-azure/15 text-azure-bright'
                : 'border-stroke bg-panel text-slate-400 hover:text-slate-200'
            }`}
          >
            {f.key === 'all' ? `${f.label} (${questions.length})` : f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-2 overflow-y-auto">
        {visible.map((q) => {
          const idx = questions.indexOf(q)
          const answered = answers[q.id] !== undefined
          const isFlagged = flagged.includes(q.id)
          const active = idx === currentIndex
          return (
            <button
              key={q.id}
              onClick={() => onSelect(idx)}
              className={`relative aspect-square rounded-md text-xs font-mono flex items-center justify-center border transition
                ${active ? 'ring-2 ring-azure-bright ring-offset-1 ring-offset-canvas' : ''}
                ${
                  answered
                    ? 'bg-azure border-azure text-white'
                    : 'bg-panel border-stroke text-slate-400 hover:border-azure/40'
                }`}
            >
              {idx + 1}
              {isFlagged && (
                <Flag size={10} className="absolute -top-1 -right-1 text-warning fill-warning" />
              )}
            </button>
          )
        })}
      </div>
    </aside>
  )
}
