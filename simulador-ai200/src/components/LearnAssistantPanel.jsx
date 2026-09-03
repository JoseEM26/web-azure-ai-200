import { X, BookOpen } from 'lucide-react'

const DOMAIN_SUMMARY = {
  'Cómputo, Serverless y Contenedores':
    'Azure Container Apps escala con KEDA (incluso a cero réplicas) y soporta Dapr para pub/sub y despliegues Canary/Blue-Green. Durable Functions orquesta flujos con estado usando patrones como Function Chaining, Fan-out/Fan-in, Async HTTP API y Human-in-the-loop. Azure Container Registry (ACR) automatiza builds con ACR Tasks y se integra sin contraseñas mediante Managed Identity + rol AcrPull.',
  'Modelos Fundacionales, Orquestación y Seguridad':
    'Microsoft Foundry centraliza el catálogo de modelos y Prompt Flow para orquestar pasos de IA. Azure OpenAI ofrece Standard (pago por token) y PTU (capacidad reservada); usá Structured Outputs para forzar un JSON Schema y backoff exponencial ante errores 429. Azure AI Content Safety filtra contenido dañino por categoría/severidad y Prompt Shield detecta inyecciones directas e indirectas.',
  'Bases de Datos Vectoriales y RAG':
    'Azure AI Search combina BM25 + vectores (HNSW) con Reciprocal Rank Fusion y Semantic Ranker para máxima relevancia. Cosmos DB integra índices vectoriales (HNSW/IVF) junto a los documentos JSON y expone Change Feed para reaccionar a cambios. Blob Storage organiza el ciclo de vida de archivos en niveles Hot/Cool/Archive.',
  'Mensajería y Eventos':
    'Event Grid es para reactividad de eventos discretos (esquema CloudEvents, sin orden garantizado); Service Bus es para mensajería empresarial con Sessions (FIFO), Dead-Letter Queues y transacciones; Event Hubs es para streaming de altísimo volumen con replay.',
  'Seguridad Zero Trust y Monitoreo':
    'Las Managed Identities (System o User-Assigned) eliminan credenciales estáticas; combinalas con roles RBAC mínimos y Private Endpoints para aislar la red. Key Vault gestiona y rota secretos. Application Insights aporta Distributed Tracing, KQL sobre `requests`/`dependencies` y Live Metrics para monitoreo en tiempo real.',
}

export default function LearnAssistantPanel({ open, onClose, question }) {
  return (
    <div
      className={`fixed inset-0 z-40 transition ${open ? '' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 transition-opacity ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        className={`absolute top-0 right-0 h-full w-full max-w-sm bg-panel border-l border-stroke shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-stroke">
          <span className="flex items-center gap-2 font-medium text-azure-bright">
            <BookOpen size={18} /> Asistente de Microsoft Learn
          </span>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-100">
            <X size={20} />
          </button>
        </div>

        {question && (
          <div className="p-5 overflow-y-auto h-[calc(100%-4rem)] space-y-4">
            <div>
              <p className="text-xs font-mono text-slate-500 uppercase mb-1">Tema activo</p>
              <p className="font-semibold text-slate-100">{question.topic}</p>
            </div>

            <div>
              <p className="text-xs font-mono text-slate-500 uppercase mb-1">Resumen del dominio</p>
              <p className="text-sm text-slate-300 leading-relaxed">
                {DOMAIN_SUMMARY[question.domain]}
              </p>
            </div>

            {question.docReference && (
              <a
                href={question.docReference}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-azure-bright hover:underline break-all"
              >
                {question.docReference}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
