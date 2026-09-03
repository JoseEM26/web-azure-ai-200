import { ShieldCheck, Clock, ListChecks, BookOpen, Layers, Network, Wrench } from 'lucide-react'

export default function HomeMenu({ onSelectExam, onSelectWikiAi200, onSelectWikiDevops }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full">
        <div className="flex items-center gap-3 mb-2 justify-center">
          <ShieldCheck className="text-azure" size={28} />
          <h1 className="font-mono text-sm tracking-widest text-azure-bright uppercase">
            Microsoft AI-200
          </h1>
        </div>
        <p className="text-center text-slate-400 mb-10">
          Azure AI Cloud Developer Associate — elegí cómo querés estudiar hoy.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            emoji="📝"
            title="Simulador de Examen"
            description="Azure AI Cloud Developer Associate. 50 preguntas aleatorias, 120 minutos, aprobación en 700/1000 puntos — igual que el examen real."
            features={[
              { icon: <ListChecks size={18} />, label: '50 preguntas', sub: 'elegidas al azar' },
              { icon: <Clock size={18} />, label: '120 minutos', sub: 'cronómetro regresivo' },
              { icon: <BookOpen size={18} />, label: 'Explicación técnica', sub: 'por cada pregunta' },
            ]}
            buttonLabel="Comenzar examen"
            onClick={onSelectExam}
          />

          <Card
            emoji="📖"
            title="Wiki AI-200"
            description="Los 13 servicios clave del temario, explicados con qué es / para qué sirve / cuándo usarlo, diagramas de arquitectura y el dato clave que suele caer en el examen."
            features={[
              { icon: <Layers size={18} />, label: '13 servicios', sub: 'en 5 dominios' },
              { icon: <Network size={18} />, label: 'Diagramas', sub: 'renderizados en vivo' },
              { icon: <BookOpen size={18} />, label: 'Banco de referencia', sub: 'qué / para qué / cuándo' },
            ]}
            buttonLabel="Ir a la wiki"
            onClick={onSelectWikiAi200}
          />

          <Card
            emoji="🛠️"
            title="Wiki Azure DevOps Esenciales"
            description="Los 14 servicios core que un DevOps usa en el día a día: cómputo, redes, datos, identidad/gobernanza y las herramientas de DevOps y operaciones."
            features={[
              { icon: <Layers size={18} />, label: '14 servicios', sub: 'en 5 dominios' },
              { icon: <Network size={18} />, label: 'Diagramas', sub: 'renderizados en vivo' },
              { icon: <Wrench size={18} />, label: 'Uso diario', sub: 'de un DevOps' },
            ]}
            buttonLabel="Ir a la wiki"
            onClick={onSelectWikiDevops}
          />
        </div>
      </div>
    </div>
  )
}

function Card({ emoji, title, description, features, buttonLabel, onClick }) {
  return (
    <div className="bg-card/60 border border-stroke rounded-xl p-6 flex flex-col shadow-lg">
      <h2 className="text-xl font-semibold mb-3">
        {emoji} {title}
      </h2>
      <p className="text-slate-400 text-sm mb-6 leading-relaxed flex-1">{description}</p>

      <div className="grid grid-cols-3 gap-2 mb-6">
        {features.map((f) => (
          <div
            key={f.label}
            className="rounded-lg border border-stroke bg-panel px-2 py-3 flex flex-col items-center text-center gap-1"
          >
            <span className="text-azure-bright">{f.icon}</span>
            <span className="text-xs font-medium">{f.label}</span>
            <span className="text-[10px] text-slate-500">{f.sub}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onClick}
        className="w-full rounded-lg bg-azure hover:bg-azure-hover text-white py-3 font-medium shadow-[0_0_12px_rgba(56,189,248,0.35)] transition"
      >
        {buttonLabel}
      </button>
    </div>
  )
}
