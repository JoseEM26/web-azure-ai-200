import { useEffect, useMemo, useRef, useState } from 'react'
import mermaid from 'mermaid'
import { ArrowLeft, Search } from 'lucide-react'

mermaid.initialize({ startOnLoad: false, theme: 'dark' })

const normalize = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')

// Renderiza **negrita** y `código` inline sin depender de una librería de markdown.
function Rich({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="text-azure-bright font-semibold">
              {part.slice(2, -2)}
            </strong>
          )
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={i} className="bg-panel border border-stroke rounded px-1.5 py-0.5 text-xs font-mono text-azure-bright">
              {part.slice(1, -1)}
            </code>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </>
  )
}

function Diagram({ source, id }) {
  const containerRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    async function render() {
      try {
        const { svg } = await mermaid.render(`mermaid-${id}`, source)
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg
        }
      } catch (err) {
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = `<p class="text-danger text-sm">Error renderizando diagrama: ${err.message}</p>`
        }
      }
    }
    render()
    return () => {
      cancelled = true
    }
  }, [source, id])

  return <div ref={containerRef} className="overflow-x-auto flex justify-center py-2" />
}

const SECTIONS = [
  { key: 'queEs', label: 'Qué es' },
  { key: 'paraQueSirve', label: 'Para qué sirve' },
  { key: 'cuandoUsarlo', label: 'Cuándo usarlo' },
  { key: 'datoClave', label: 'Dato clave que suelen preguntar' },
]

export default function WikiView({ content, domainColors, title = 'Wiki de Estudio', introContent, onBack }) {
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(content[0].id)

  const domains = useMemo(() => {
    const map = new Map()
    for (const service of content) {
      if (!map.has(service.domain)) map.set(service.domain, [])
      map.get(service.domain).push(service)
    }
    return Array.from(map.entries())
  }, [content])

  const normalizedQuery = normalize(query.trim())
  const matches = (service) => {
    if (!normalizedQuery) return true
    const haystack = normalize(
      [service.title, service.queEs, service.paraQueSirve, service.cuandoUsarlo, service.datoClave].join(' ')
    )
    return haystack.includes(normalizedQuery)
  }

  const filteredDomains = domains
    .map(([domain, services]) => [domain, services.filter(matches)])
    .filter(([, services]) => services.length > 0)

  const selected = content.find((s) => s.id === selectedId) ?? content[0]

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <aside className="lg:w-80 shrink-0 border-b lg:border-b-0 lg:border-r border-stroke bg-panel/60 flex flex-col">
        <div className="p-4 border-b border-stroke">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-azure-bright transition mb-4"
          >
            <ArrowLeft size={16} /> Volver al menú
          </button>
          <h1 className="font-mono text-xs tracking-widest text-azure-bright uppercase mb-1">
            {title}
          </h1>
          <p className="text-lg font-semibold">Wiki de Estudio</p>

          <div className="relative mt-4">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar servicio o concepto..."
              className="w-full bg-card border border-stroke rounded-md pl-9 pr-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-azure/60"
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-4">
          {filteredDomains.length === 0 && (
            <p className="text-xs text-slate-500 px-2">Sin resultados para "{query}".</p>
          )}
          {filteredDomains.map(([domain, services]) => (
            <div key={domain}>
              <p
                className="text-[11px] font-bold uppercase tracking-wider mb-1.5 px-2"
                style={{ color: domainColors[domain] }}
              >
                {domain}
              </p>
              <div className="space-y-0.5">
                {services.map((service) => {
                  const isActive = service.id === selectedId
                  return (
                    <button
                      key={service.id}
                      onClick={() => setSelectedId(service.id)}
                      className="w-full text-left px-2.5 py-2 rounded-md text-sm transition border-l-2"
                      style={{
                        borderColor: isActive ? domainColors[domain] : 'transparent',
                        backgroundColor: isActive ? `${domainColors[domain]}22` : 'transparent',
                        color: isActive ? domainColors[domain] : '#cbd5e1',
                      }}
                    >
                      {service.title}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <p
            className="text-xs font-bold uppercase tracking-wider mb-2"
            style={{ color: domainColors[selected.domain] }}
          >
            {selected.domain}
          </p>
          <h2 className="text-2xl font-semibold mb-6">{selected.title}</h2>

          <div className="space-y-5">
            {SECTIONS.map(({ key, label }) => (
              <section key={key} className="bg-card/60 border border-stroke rounded-lg p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">{label}</h3>
                <p className="text-sm text-slate-200 leading-relaxed">
                  <Rich text={selected[key]} />
                </p>
              </section>
            ))}

            <section className="bg-card/60 border border-stroke rounded-lg p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Cómo funciona (diagrama)
              </h3>
              <Diagram key={selected.id} id={selected.id} source={selected.diagram} />
              <p className="text-sm text-slate-400 leading-relaxed border-t border-stroke pt-3 mt-3">
                <Rich text={selected.diagramExplicacion} />
              </p>
            </section>

            {Array.isArray(selected.faq) && selected.faq.length > 0 && (
              <section className="bg-card/60 border border-stroke rounded-lg p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Preguntas Frecuentes
                </h3>
                <div className="space-y-2">
                  {selected.faq.map((item, i) => (
                    <details
                      key={i}
                      className="group bg-panel/60 border border-stroke rounded-md px-3 py-2"
                    >
                      <summary className="cursor-pointer text-sm font-medium text-slate-200 marker:text-azure-bright">
                        {item.pregunta}
                      </summary>
                      <p className="text-sm text-slate-400 leading-relaxed mt-2 pt-2 border-t border-stroke">
                        <Rich text={item.respuesta} />
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            )}
          </div>

          {introContent && selected.id === content[0].id && (
            <section className="mt-8 bg-panel/40 border border-stroke rounded-lg p-4">
              <h3 className="text-sm font-semibold mb-2">{introContent.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-3">{introContent.lead}</p>
              <ul className="text-sm text-slate-300 grid sm:grid-cols-2 gap-1">
                {introContent.checklist.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-azure-bright" /> {item}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}
