import { ShieldCheck, Layers } from 'lucide-react'

export default function HomeMenu({
  onSelectExamAi200,
  onSelectWikiAi200,
  onSelectExamAi900,
  onSelectWikiAi900,
  onSelectWikiDevops,
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full">
        <div className="flex items-center gap-3 mb-2 justify-center">
          <ShieldCheck className="text-azure" size={28} />
          <h1 className="font-mono text-sm tracking-widest text-azure-bright uppercase">
            Simulador de Certificaciones Microsoft Azure AI
          </h1>
        </div>
        <p className="text-center text-slate-400 mb-10">
          Elegí la certificación y cómo querés estudiar hoy.
        </p>

        <div className="space-y-6">
          <CertBlock
            emoji="📝"
            title="Microsoft AI-200"
            subtitle="Azure AI Cloud Developer Associate"
            description="50 preguntas aleatorias, 120 minutos, aprobación en 700/1000 puntos, más una wiki de los 13 servicios clave del temario."
            examButtonLabel="Tomar examen"
            onExam={onSelectExamAi200}
            wikiButtonLabel="Ver wiki"
            onWiki={onSelectWikiAi200}
          />

          <CertBlock
            emoji="🧠"
            title="Microsoft AI-900"
            subtitle="Azure AI Fundamentals"
            description="45 preguntas aleatorias, 60 minutos, aprobación en 700/1000 puntos, más una wiki de los 12 temas del examen introductorio de IA."
            examButtonLabel="Tomar examen"
            onExam={onSelectExamAi900}
            wikiButtonLabel="Ver wiki"
            onWiki={onSelectWikiAi900}
          />

          <CertBlock
            emoji="🛠️"
            title="Azure DevOps Esenciales"
            subtitle="Sin examen — solo material de referencia"
            description="Los 14 servicios core que un DevOps usa en el día a día: cómputo, redes, datos, identidad/gobernanza y las herramientas de DevOps y operaciones."
            wikiButtonLabel="Ver wiki"
            onWiki={onSelectWikiDevops}
          />
        </div>
      </div>
    </div>
  )
}

function CertBlock({ emoji, title, subtitle, description, examButtonLabel, onExam, wikiButtonLabel, onWiki }) {
  return (
    <div className="bg-card/60 border border-stroke rounded-xl p-6 flex flex-col sm:flex-row sm:items-center gap-6 shadow-lg">
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-1">
          {emoji} {title}
        </h2>
        <p className="text-xs font-mono uppercase tracking-wider text-azure-bright mb-2">{subtitle}</p>
        <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
      </div>

      <div className="flex sm:flex-col gap-3 shrink-0 sm:w-56">
        {onExam && (
          <button
            onClick={onExam}
            className="flex-1 rounded-lg bg-azure hover:bg-azure-hover text-white py-3 font-medium shadow-[0_0_12px_rgba(56,189,248,0.35)] transition text-sm"
          >
            {examButtonLabel}
          </button>
        )}
        <button
          onClick={onWiki}
          className="flex-1 rounded-lg border border-stroke bg-panel hover:border-azure/40 text-slate-200 py-3 font-medium transition text-sm flex items-center justify-center gap-2"
        >
          <Layers size={16} className="text-azure-bright" /> {wikiButtonLabel}
        </button>
      </div>
    </div>
  )
}
