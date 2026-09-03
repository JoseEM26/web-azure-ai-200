import { ShieldCheck, Clock, ListChecks, BookOpen } from 'lucide-react'

export default function StartScreen({ onStart, onBack }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-card/60 border border-stroke rounded-xl p-8 shadow-lg">
        {onBack && (
          <button
            onClick={onBack}
            className="text-xs text-slate-400 hover:text-azure-bright transition mb-4"
          >
            ← Volver al menú
          </button>
        )}
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="text-azure" size={28} />
          <h1 className="font-mono text-sm tracking-widest text-azure-bright uppercase">
            Microsoft AI-200
          </h1>
        </div>
        <h2 className="text-2xl font-semibold mb-4">Simulador de Certificación</h2>
        <p className="text-slate-400 mb-6 leading-relaxed">
          Azure AI Cloud Developer Associate. 50 preguntas aleatorias, 120 minutos, aprobación en
          700/1000 puntos — igual que el examen real.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Feature icon={<ListChecks size={20} />} label="50 preguntas" sub="elegidas al azar" />
          <Feature icon={<Clock size={20} />} label="120 minutos" sub="cronómetro regresivo" />
          <Feature icon={<BookOpen size={20} />} label="Explicación técnica" sub="por cada pregunta" />
        </div>

        <button
          onClick={onStart}
          className="w-full rounded-lg bg-azure hover:bg-azure-hover text-white py-3 font-medium shadow-[0_0_12px_rgba(56,189,248,0.35)] transition"
        >
          Comenzar examen
        </button>
      </div>
    </div>
  )
}

function Feature({ icon, label, sub }) {
  return (
    <div className="rounded-lg border border-stroke bg-panel px-4 py-3 flex flex-col items-center text-center gap-1">
      <span className="text-azure-bright">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
      <span className="text-xs text-slate-500">{sub}</span>
    </div>
  )
}
