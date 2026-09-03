// Contenido de la Wiki de Estudio AI-200, parseado 1:1 de los README de
// C:\Users\JOSE ANGEL\Documents\AI-200\0X-.../README.md — no resumido.

export const DOMAIN_COLORS = {
  'Cómputo & Contenedores': '#33c99e', // teal
  'Modelos e IA': '#a993ec', // violeta
  'RAG & Vectores': '#6fa9e0', // azul
  Mensajería: '#e4a244', // ámbar
  'Seguridad & Monitoreo': '#e07691', // rosa
}

export const introContent = {
  title: 'AI-200 — Material de estudio',
  lead:
    'Esta carpeta es material de estudio para el examen AI-200 (Azure AI Cloud Developer Associate): un resumen por servicio (qué es, para qué sirve, cuándo usarlo y el dato clave que suelen preguntar) más un banco de preguntas de práctica. Para estudiar, entrá a cada subcarpeta en orden o directo al servicio que te falte repasar, y usá el banco de preguntas para autoevaluarte al final.',
  checklist: [
    'Azure Container Apps (ACA)',
    'Azure Durable Functions',
    'Azure Container Registry (ACR)',
    'Microsoft Foundry / Azure AI Studio',
    'Azure OpenAI Service',
    'Azure AI Content Safety',
    'Azure AI Search',
    'Azure Cosmos DB',
    'Azure Blob Storage',
    'Azure Event Grid vs Azure Service Bus',
    'Managed Identities',
    'Azure Key Vault',
    'Application Insights / Azure Monitor',
  ],
}

const wikiContent = [
  {
    id: 'container-apps',
    domain: 'Cómputo & Contenedores',
    title: 'Azure Container Apps (ACA)',
    queEs: 'Entorno serverless administrado sobre Kubernetes para microservicios y APIs de inferencia.',
    paraQueSirve: 'Correr contenedores sin gestionar el clúster de K8s vos mismo.',
    cuandoUsarlo:
      'Worker que procesa mensajes de una cola (transcripción, embeddings) y debe escalar a 0 cuando no hay trabajo.',
    datoClave:
      'Escala con **KEDA** según métricas externas (longitud de cola, HTTP, CPU); soporta **scale-to-zero** y despliegues **Canary/Blue-Green** por revisiones.',
    diagram: `flowchart LR
    Q[(Cola de mensajes)] -->|longitud de cola| K[KEDA scaler]
    K -->|escala 0 a N réplicas| CA[Azure Container App\\nworker]
    CA -->|procesa mensaje| Q
    CA -->|sin trabajo pendiente| Z[Scale to zero]
    ACR[(Azure Container Registry)] -->|imagen del contenedor| CA`,
    diagramExplicacion:
      'KEDA observa la longitud de la cola y decide cuántas réplicas del Container App levantar, incluyendo bajar a cero cuando no hay mensajes. La imagen que corre sale de Azure Container Registry.',
    faq: [
      {
        pregunta: '¿Container Apps reemplaza a AKS?',
        respuesta:
          'No. ACA abstrae el control plane de Kubernetes para escenarios de microservicios/APIs comunes; si necesitás CRDs custom, operators o control total del clúster, seguís necesitando AKS.',
      },
      {
        pregunta: '¿Puedo usar GPU en Container Apps?',
        respuesta:
          'Sí, hay perfiles de workload con GPU para cargas de inferencia, pero no todas las regiones los ofrecen y tienen costo fijo (no escalan a cero como el resto).',
      },
      {
        pregunta: '¿Qué pasa si mi contenedor tarda mucho en arrancar y el health probe falla?',
        respuesta:
          'La revisión nunca queda "Ready" y el tráfico no se enruta a esa réplica; hay que configurar un `startupProbe` con timeout más generoso en vez de forzar el `readinessProbe`.',
      },
      {
        pregunta: '¿Cómo hace ACA el despliegue Canary o Blue-Green?',
        respuesta:
          'Cada cambio genera una revisión nueva; vos controlás qué porcentaje de tráfico va a cada revisión activa, permitiendo mover el 100% de golpe (blue-green) o de a poco (canary).',
      },
      {
        pregunta: '¿Un Container App puede tener múltiples contenedores (sidecar)?',
        respuesta:
          'Sí, dentro de una misma revisión podés correr un contenedor principal más sidecars (logging, proxy) que comparten ciclo de vida y red.',
      },
      {
        pregunta: '¿Escala a cero corta las conexiones en curso?',
        respuesta:
          'No de golpe: KEDA espera que no haya actividad (cola vacía, sin requests) antes de bajar réplicas; una request en curso no se corta a mitad de camino.',
      },
    ],
  },
  {
    id: 'durable-functions',
    domain: 'Cómputo & Contenedores',
    title: 'Azure Durable Functions',
    queEs: 'Extensión de Azure Functions para orquestar flujos con estado.',
    paraQueSirve: 'Encadenar pasos de IA (transcribir → traducir → resumir) sin perder el progreso si algo falla.',
    cuandoUsarlo:
      'Una tarea de IA tarda minutos (ej. transcribir un audio de 45 min) y la llamada HTTP no puede quedar colgada.',
    datoClave:
      'Patrón **Async HTTP API** devuelve `202 Accepted` + URL de polling; **Fan-out/Fan-in** procesa fragmentos en paralelo y consolida; **Human-in-the-loop** pausa el flujo esperando aprobación humana.',
    diagram: `sequenceDiagram
    participant Cliente
    participant HTTP as Trigger HTTP
    participant Orq as Orchestrator
    Cliente->>HTTP: POST /transcribir (audio largo)
    HTTP->>Orq: inicia orquestación
    HTTP-->>Cliente: 202 Accepted + URL de status
    loop Polling
        Cliente->>HTTP: GET /status
        HTTP-->>Cliente: "Running"
    end
    Orq->>Orq: transcribe → traduce → resume (Function Chaining)
    Cliente->>HTTP: GET /status
    HTTP-->>Cliente: 200 OK + resultado final`,
    diagramExplicacion:
      'La llamada HTTP nunca queda colgada esperando: responde al instante con un `202` y una URL de consulta. El cliente pregunta ("polling") hasta que el flujo largo termina. Ideal para tareas de IA que tardan minutos.',
    faq: [
      {
        pregunta: '¿Qué pasa si el host se reinicia a mitad de la orquestación?',
        respuesta:
          'El framework hace "replay" del historial de eventos guardado y reconstruye el estado exacto donde quedó, sin repetir efectos secundarios ya ejecutados (siempre que el código de la orchestrator function sea determinístico).',
      },
      {
        pregunta: '¿Por qué la orchestrator function no puede hacer una llamada HTTP directa?',
        respuesta:
          'Porque se re-ejecuta (replay) muchas veces para reconstruir estado, y una llamada HTTP directa rompería el determinismo; ese trabajo tiene que ir en una Activity Function.',
      },
      {
        pregunta: '¿Cuánto puede esperar un patrón Human-in-the-loop antes de expirar?',
        respuesta:
          'Se define con un timeout explícito en el código (por ejemplo, `CreateTimer`); si nadie aprueba antes de ese plazo, la orquestación sigue por la rama de "timeout" en vez de quedar colgada indefinidamente.',
      },
      {
        pregunta: '¿Fan-out/Fan-in es lo mismo que Function Chaining?',
        respuesta:
          'No: Chaining encadena pasos secuenciales (A→B→C), mientras que Fan-out/Fan-in dispara N Activities en paralelo y espera a que todas terminen antes de consolidar el resultado.',
      },
      {
        pregunta: '¿Dónde persiste Durable Functions el estado de la orquestación?',
        respuesta:
          'En Azure Storage (tablas y colas) o Netherite/MSSQL según el backend configurado; de ahí sale el historial que permite el replay.',
      },
      {
        pregunta: '¿Se puede cancelar una orquestación que ya arrancó?',
        respuesta:
          'Sí, con la API de gestión (`Terminate`), aunque no revierte efectos ya aplicados por las Activities completadas.',
      },
    ],
  },
  {
    id: 'container-registry',
    domain: 'Cómputo & Contenedores',
    title: 'Azure Container Registry (ACR)',
    queEs: 'Registro privado de imágenes Docker/OCI.',
    paraQueSirve: 'Guardar y versionar las imágenes que corren en ACA/AKS.',
    cuandoUsarlo: 'Necesitás compilar la imagen automáticamente al hacer commit.',
    datoClave:
      '**ACR Tasks** compila en Azure sin Docker local; autenticación sin contraseña vía Managed Identity.',
    diagram: `flowchart LR
    Dev[Commit del equipo] --> Task[ACR Tasks]
    Task -->|compila la imagen en Azure| Img[(Imagen versionada en ACR)]
    MI[Managed Identity] -->|autenticación sin password| Img
    Img -->|pull de la imagen| CA[Azure Container App / AKS]`,
    diagramExplicacion:
      'El commit dispara ACR Tasks, que compila la imagen dentro de Azure (sin Docker local) y la deja versionada en el registro. El contenedor que la consume se autentica con Managed Identity, sin contraseñas.',
    faq: [
      {
        pregunta: '¿ACR Tasks reemplaza un pipeline de CI/CD (Azure DevOps/GitHub Actions)?',
        respuesta:
          'No, cubre solo la parte de build de la imagen; el pipeline sigue orquestando tests, aprobaciones y el despliegue del resto de la solución.',
      },
      {
        pregunta: '¿Cómo escaneo vulnerabilidades en las imágenes de ACR?',
        respuesta:
          'Con Microsoft Defender for Cloud integrado al registro, que analiza capas del sistema operativo y librerías al hacer push.',
      },
      {
        pregunta: '¿Qué SKU necesito si tengo apps en varias regiones?',
        respuesta:
          'El tier **Premium**, que habilita geo-replicación: la misma imagen queda disponible localmente en cada región sin depender de un solo endpoint.',
      },
      {
        pregunta: '¿Puedo usar Docker Hub en vez de ACR?',
        respuesta:
          'Se puede, pero perdés integración nativa con Managed Identity, geo-replicación y ACR Tasks; en escenarios empresariales de Azure, ACR es la opción por defecto.',
      },
      {
        pregunta: '¿El "admin user" de ACR es necesario?',
        respuesta:
          'No, y se recomienda dejarlo deshabilitado: es autenticación por contraseña compartida, mientras que Managed Identity + RBAC es el mecanismo seguro para pull/push.',
      },
      {
        pregunta: '¿ACR versiona automáticamente las imágenes?',
        respuesta:
          'No versiona solo: cada build de ACR Tasks te deja etiquetar (tag) la imagen, y la disciplina de versionado (semver, `:latest`, hash del commit) la define el pipeline.',
      },
    ],
  },
  {
    id: 'foundry',
    domain: 'Modelos e IA',
    title: 'Microsoft Foundry / Azure AI Studio',
    queEs: 'Plataforma unificada para construir, desplegar y orquestar modelos y agentes de IA.',
    paraQueSirve: 'Catálogo de modelos (OpenAI, Llama, Phi, Mistral), evaluación y orquestación multi-agente.',
    cuandoUsarlo: 'Necesitás comparar/cambiar de modelo sin reescribir la app, o encadenar varios agentes.',
    datoClave:
      'Métricas de evaluación: **Groundedness** (¿se basa en el contexto real?), **Relevance** (¿responde la pregunta?), **Coherence** (¿fluye bien el texto?).',
    diagram: `flowchart LR
    U[Usuario] --> E[App / Agente]
    E -->|pregunta| D[(Azure AI Search)]
    D -->|fragmentos de contexto| E
    E -->|prompt + contexto| MF{Microsoft Foundry\\nModel Catalog}
    MF -->|enruta a| M1[Azure OpenAI]
    MF -->|o a| M2[Llama / Phi / Mistral]
    M1 --> Ev[Evaluación:\\nGroundedness / Relevance / Coherence]
    M2 --> Ev
    Ev --> E
    E --> U`,
    diagramExplicacion:
      'Foundry es la capa que decide a qué modelo del catálogo enrutar el prompt (sin reescribir la app si cambiás de modelo) y después evalúa la respuesta con métricas de Groundedness, Relevance y Coherence antes de devolverla.',
    faq: [
      {
        pregunta: '¿Foundry reemplaza a Azure OpenAI Service?',
        respuesta:
          'No, lo engloba: Azure OpenAI sigue siendo uno de los proveedores dentro del Model Catalog de Foundry, que además suma modelos open source y capas de evaluación/orquestación.',
      },
      {
        pregunta: '¿Qué pasa si un modelo evaluado tiene baja Groundedness?',
        respuesta:
          'Indica que la respuesta se aleja del contexto recuperado (posible alucinación); en el examen esto se resuelve mejorando el retrieval (AI Search), no cambiando el modelo.',
      },
      {
        pregunta: '¿Puedo cambiar de Azure OpenAI a Llama/Phi sin tocar el código de la app?',
        respuesta:
          'Ese es justamente el punto del Model Catalog: la app llama a un endpoint de Foundry, y el modelo detrás se cambia por configuración.',
      },
      {
        pregunta: '¿Foundry orquesta agentes multi-step de forma nativa?',
        respuesta:
          'Sí, mediante agentes que pueden invocarse entre sí y usar herramientas (function calling, RAG), sin necesitar un framework externo aparte.',
      },
      {
        pregunta: '¿Para qué sirve la evaluación automática si ya probé el prompt manualmente?',
        respuesta:
          'Para detectar regresiones cuando cambiás de modelo o de prompt a escala, corriendo las mismas métricas (Groundedness, Relevance, Coherence) sobre un dataset de test, no solo casos sueltos.',
      },
      {
        pregunta: '¿Necesito una AI Search separada si uso Foundry?',
        respuesta:
          'Sí, Foundry no reemplaza el motor de retrieval; sigue delegando la búsqueda de contexto a Azure AI Search u otro origen de datos configurado.',
      },
    ],
  },
  {
    id: 'openai-service',
    domain: 'Modelos e IA',
    title: 'Azure OpenAI Service',
    queEs: 'Los modelos de OpenAI desplegados dentro de Azure.',
    paraQueSirve: 'Inferencia de LLMs con la seguridad y red de Azure.',
    cuandoUsarlo:
      'Tráfico variable → **Standard** (pago por token); tráfico crítico con latencia predecible → **PTU** (Provisioned Throughput Units, capacidad reservada).',
    datoClave:
      'Ante `HTTP 429` (rate limit) la solución de código es **reintentos con backoff exponencial + jitter**; para forzar formato exacto usar **Structured Outputs** (`json_schema`).',
    diagram: `flowchart LR
    A[Documento fuente] --> B[Skillset: OCR + split + embeddings]
    B --> C[Indexer]
    C --> D[(Azure AI Search)]
    U[Usuario] --> E[App / API]
    E -->|pregunta| D
    D -->|fragmentos relevantes| E
    E -->|contexto + pregunta| F{Azure OpenAI}
    F -->|tráfico variable| S[Standard\\npago por token]
    F -->|tráfico crítico/predecible| P[PTU\\ncapacidad reservada]
    F -->|respuesta fundamentada| E
    E --> U`,
    diagramExplicacion:
      'Azure OpenAI recibe el contexto recuperado por AI Search más la pregunta del usuario y genera la respuesta. La elección entre Standard y PTU depende del patrón de tráfico; un `429` en Standard se maneja con reintentos y backoff exponencial, no cambiando de plan automáticamente.',
    faq: [
      {
        pregunta: '¿Qué diferencia hay entre el rate limit por RPM y por TPM?',
        respuesta:
          'RPM limita cantidad de requests por minuto y TPM limita tokens procesados por minuto; podés recibir un `429` por superar cualquiera de los dos aunque el otro esté bien.',
      },
      {
        pregunta: '¿Cuándo conviene PTU en vez de Standard si ya tengo cuota suficiente?',
        respuesta:
          'Cuando necesitás latencia predecible garantizada; Standard comparte capacidad con otros tenants y puede variar, mientras que PTU reserva throughput dedicado.',
      },
      {
        pregunta: '¿Azure OpenAI usa mis datos para entrenar sus modelos?',
        respuesta:
          'No, por diseño del servicio los datos de prompts/completions del cliente no se usan para reentrenar los modelos base, a diferencia de la API pública de OpenAI en su tier gratuito.',
      },
      {
        pregunta: '¿Structured Outputs reemplaza a function calling?',
        respuesta:
          'No, son complementarios: Structured Outputs (`json_schema`) garantiza que la respuesta cumpla un esquema exacto, mientras que function calling define qué herramientas puede invocar el modelo.',
      },
      {
        pregunta: '¿Puedo desplegar el mismo modelo en varias regiones para más cuota?',
        respuesta:
          'Sí, es la estrategia habitual para escalar horizontalmente cuando una sola región no alcanza el TPM necesario, distribuyendo tráfico entre deployments regionales.',
      },
      {
        pregunta: '¿Reintentar con backoff exponencial soluciona un 429 constante?',
        respuesta:
          'Solo si el 429 es esporádico; si es sostenido, el problema real es cuota insuficiente y hay que pedir más TPM o migrar a PTU.',
      },
    ],
  },
  {
    id: 'content-safety',
    domain: 'Modelos e IA',
    title: 'Azure AI Content Safety',
    queEs: 'Servicio de moderación y protección de prompts.',
    paraQueSirve: 'Filtrar contenido dañino y bloquear ataques al modelo.',
    cuandoUsarlo: 'Un chat expuesto a usuarios externos que podría recibir inyección de prompts.',
    datoClave:
      '**Prompt Shield** cubre **User Prompt Attacks** (inyección directa) y **Document Attacks** (instrucciones maliciosas ocultas en un PDF que el RAG procesa).',
    diagram: `flowchart LR
    U[Usuario] -->|prompt| PS{Prompt Shield}
    Doc[Documento del RAG] -->|contenido a procesar| PS
    PS -->|User Prompt Attack detectado| Block1[Bloquear]
    PS -->|Document Attack detectado| Block2[Bloquear]
    PS -->|contenido limpio| LLM[Azure OpenAI]
    LLM --> U`,
    diagramExplicacion:
      'Prompt Shield inspecciona tanto lo que escribe el usuario (User Prompt Attack) como el contenido de documentos que el RAG le pasa al modelo (Document Attack, inyección indirecta). Si detecta un ataque, bloquea antes de que llegue al LLM.',
    faq: [
      {
        pregunta: '¿Content Safety reemplaza la moderación humana?',
        respuesta:
          'No, filtra automáticamente el volumen masivo de contenido dañino evidente; casos límite (borderline) suelen seguir necesitando revisión humana.',
      },
      {
        pregunta: '¿Qué categorías de daño cubre además de Prompt Shield?',
        respuesta:
          'Detecta contenido de odio, sexual, violencia y autolesión, cada una con niveles de severidad configurables (0 a 7) para decidir el umbral de bloqueo.',
      },
      {
        pregunta: '¿Puedo ajustar la sensibilidad del filtro por categoría?',
        respuesta:
          'Sí, cada categoría de daño tiene su propio umbral de severidad, así que podés ser más estricto con violencia y más permisivo con otra según el caso de uso.',
      },
      {
        pregunta: '¿Content Safety agrega latencia notable al pipeline del chat?',
        respuesta:
          'Es una llamada API adicional antes (input) y opcionalmente después (output) del LLM; suma latencia pero es baja comparada con la generación del modelo.',
      },
      {
        pregunta: '¿Document Attack detecta instrucciones ocultas en metadatos o solo en el texto visible?',
        respuesta:
          'Analiza el contenido que el pipeline de RAG efectivamente extrae y le pasa al modelo, incluyendo texto oculto en el documento si el proceso de extracción lo captura.',
      },
      {
        pregunta: '¿Groundedness Detection es lo mismo que Prompt Shield?',
        respuesta:
          'No, son features distintas de Content Safety: Prompt Shield bloquea ataques de inyección, mientras que Groundedness Detection identifica si la respuesta del modelo se aleja del contexto dado (alucinación).',
      },
    ],
  },
  {
    id: 'ai-search',
    domain: 'RAG & Vectores',
    title: 'Azure AI Search',
    queEs: 'El motor de búsqueda que arma la "R" de RAG (Retrieval).',
    paraQueSirve: 'Encontrar los fragmentos de texto más relevantes para pasarle al LLM como contexto.',
    cuandoUsarlo: 'Siempre que el LLM necesite responder con datos propios de la empresa.',
    datoClave:
      '**Hybrid Search** (vectores + BM25) + **Semantic Ranker** da la mejor precisión; vectores usan **HNSW** (aproximado, rápido) o KNN exhaustivo (exacto, más lento).',
    diagram: `flowchart LR
    A[Documento fuente\\nPDF / Blob Storage] --> B[Skillset: OCR + split + embeddings]
    B --> C[Indexer]
    C --> D[(Azure AI Search\\nHybrid + Semantic Ranker)]
    U[Usuario] --> E[App / API]
    E -->|pregunta| D
    D -->|fragmentos relevantes| E
    E -->|contexto + pregunta| F[Azure OpenAI\\nLLM]
    F -->|respuesta fundamentada| E
    E --> U`,
    diagramExplicacion:
      'El documento se trocea, se convierte en vectores y se indexa una sola vez (ingesta). En cada pregunta del usuario, la app busca los fragmentos más relevantes en AI Search (combinando vectores + BM25 y reordenando con Semantic Ranker) y se los pasa al LLM como contexto — eso es lo que evita que el modelo "invente" (alucine).',
    faq: [
      {
        pregunta: '¿Por qué usar Hybrid Search si ya tengo búsqueda vectorial?',
        respuesta:
          'Porque los vectores fallan con términos exactos (códigos, nombres propios, siglas); BM25 los captura por keyword y el Semantic Ranker combina ambas señales para reordenar el resultado final.',
      },
      {
        pregunta: '¿Qué pasa si el chunk (fragmento) es demasiado grande?',
        respuesta:
          'Diluye la relevancia del embedding (mezcla varios temas en un solo vector) y desperdicia contexto del LLM; chunks demasiado chicos, en cambio, pierden contexto semántico completo.',
      },
      {
        pregunta: '¿HNSW puede devolver resultados incorrectos?',
        respuesta:
          'Es una búsqueda aproximada por diseño: prioriza velocidad sobre exactitud, así que puede omitir el vecino más cercano real a cambio de responder mucho más rápido que un KNN exhaustivo.',
      },
      {
        pregunta: '¿Semantic Ranker reemplaza a los embeddings?',
        respuesta:
          'No, actúa después: reordena (re-rank) los primeros resultados que ya trajeron BM25 y la búsqueda vectorial, no genera el conjunto de candidatos por sí solo.',
      },
      {
        pregunta: '¿Cómo se actualiza el índice cuando cambia el documento fuente?',
        respuesta:
          'El Indexer vuelve a correr sobre el Blob Storage (por schedule o manualmente) y reprocesa el Skillset; no hay sincronización automática en tiempo real salvo que se configure change detection.',
      },
      {
        pregunta: '¿AI Search necesita Azure OpenAI para generar los embeddings?',
        respuesta:
          'No es obligatorio: podés usar el modelo de embeddings de OpenAI u otro compatible; AI Search solo indexa y busca los vectores, no los genera.',
      },
    ],
  },
  {
    id: 'cosmos-db',
    domain: 'RAG & Vectores',
    title: 'Azure Cosmos DB',
    queEs: 'Base NoSQL de baja latencia con soporte de vectores integrado.',
    paraQueSirve: 'Guardar el historial de conversación (memoria) y metadatos de usuario.',
    cuandoUsarlo: 'Necesitás persistir sesiones de chat con latencia mínima.',
    datoClave: '**Change Feed** dispara una Azure Function cada vez que se inserta/modifica un documento.',
    diagram: `flowchart LR
    U[Usuario] -->|mensaje de chat| App[App]
    App -->|guarda el turno| CDB[(Cosmos DB)]
    CDB -->|Change Feed| Fn[Azure Function]
    Fn -->|procesa el evento\\nej. genera resumen| CDB
    App -->|lee historial| CDB`,
    diagramExplicacion:
      'Cada mensaje del chat se persiste en Cosmos DB con latencia mínima. El Change Feed detecta la inserción y dispara automáticamente una Function (por ejemplo, para generar un resumen o actualizar métricas), sin que la app tenga que sondear la base.',
    faq: [
      {
        pregunta: '¿Cosmos DB reemplaza a Azure AI Search para hacer RAG?',
        respuesta:
          'No, su búsqueda vectorial (Vector Search integrado) es una opción para casos más simples, pero AI Search sigue siendo la elección para hybrid search y Semantic Ranker sobre grandes catálogos de documentos.',
      },
      {
        pregunta: '¿Qué nivel de consistencia conviene para historial de chat?',
        respuesta:
          'Session consistency suele alcanzar: garantiza que el propio usuario siempre vea sus últimos mensajes sin pagar el costo de Strong, que es el más caro en latencia.',
      },
      {
        pregunta: '¿Qué pasa si el Change Feed procesa eventos fuera de orden?',
        respuesta:
          'Dentro de una misma partition key el orden se preserva; entre distintas particiones no hay garantía global de orden, algo a tener en cuenta si el resumen depende de secuencia exacta.',
      },
      {
        pregunta: '¿Cómo afecta la partition key elegida al rendimiento?',
        respuesta:
          'Una mala elección (ej. una key con pocos valores distintos) concentra las solicitudes en pocas particiones físicas y genera throttling aunque el RU/s total contratado alcance.',
      },
      {
        pregunta: '¿Qué pasa si se agota el RU/s provisionado?',
        respuesta:
          'Cosmos DB devuelve `429` (Request rate too large); se maneja con reintentos con backoff o pasando a modo autoscale/serverless según el patrón de tráfico.',
      },
      {
        pregunta: '¿Change Feed garantiza que la Function se ejecute exactamente una vez?',
        respuesta:
          'No, garantiza al-menos-una-vez: la Function debe ser idempotente porque un mismo cambio puede reprocesarse ante reintentos.',
      },
    ],
  },
  {
    id: 'blob-storage',
    domain: 'RAG & Vectores',
    title: 'Azure Blob Storage',
    queEs: 'Almacenamiento de objetos (archivos, PDFs, imágenes).',
    paraQueSirve: 'Guardar los documentos fuente antes de indexarlos.',
    cuandoUsarlo: 'Archivos que se consultan poco después de un tiempo deberían bajar de tier.',
    datoClave:
      'Tiers **Hot → Cool (30+ días) → Cold (90+ días) → Archive** (offline, rehidratación en horas); **Lifecycle Management** los mueve solo.',
    diagram: `flowchart LR
    Up[Documento subido] --> Hot[Tier Hot]
    Hot -->|30+ días sin acceso| Cool[Tier Cool]
    Cool -->|90+ días sin acceso| Cold[Tier Cold]
    Cold -->|Lifecycle Management| Archive[Tier Archive\\noffline]
    Archive -->|rehidratación en horas| Hot`,
    diagramExplicacion:
      'Lifecycle Management mueve automáticamente el blob entre tiers según hace cuánto no se accede a él, bajando el costo de almacenamiento. Archive es el más barato pero requiere horas de rehidratación antes de poder leerlo de nuevo.',
    faq: [
      {
        pregunta: '¿Puedo leer un blob directamente estando en tier Archive?',
        respuesta:
          'No, primero hay que rehidratarlo (moverlo a Hot o Cool), lo que tarda horas; si necesitás acceso urgente e impredecible, Archive no es el tier correcto para ese archivo.',
      },
      {
        pregunta: '¿Lifecycle Management borra los blobs viejos o solo los mueve de tier?',
        respuesta:
          'Puede hacer ambas cosas: las reglas se configuran para mover entre tiers por antigüedad de acceso, o directamente eliminar el blob después de cierto tiempo, según la política definida.',
      },
      {
        pregunta: '¿El indexer de AI Search puede leer un blob en tier Cool o Cold?',
        respuesta:
          'Sí, la indexación funciona igual en Hot/Cool/Cold; solo Archive queda inaccesible hasta rehidratar, lo que rompería un job de indexación programado.',
      },
      {
        pregunta: '¿Cómo protejo documentos sensibles en Blob Storage?',
        respuesta:
          'Con SAS tokens de vida corta o Managed Identity + RBAC en vez de exponer la connection string, más cifrado en reposo (que está habilitado por defecto).',
      },
      {
        pregunta: '¿Qué diferencia hay entre Cool y Cold?',
        respuesta:
          'Cool está pensado para datos de acceso infrecuente por ~30 días, con costo de storage menor y costo de acceso mayor; Cold es un escalón más barato para datos de +90 días con acceso aún más raro.',
      },
      {
        pregunta: '¿Blob Storage puede disparar eventos automáticamente al subir un archivo?',
        respuesta:
          'Sí, vía integración con Event Grid, que emite el evento `BlobCreated` y puede disparar una Function o arrancar el pipeline de indexación.',
      },
    ],
  },
  {
    id: 'event-grid-service-bus',
    domain: 'Mensajería',
    title: 'Azure Event Grid vs Azure Service Bus',
    queEs: 'Dos sistemas de mensajería con propósitos distintos.',
    paraQueSirve: 'Desacoplar servicios.',
    cuandoUsarlo:
      '**Event Grid** = reactividad ("algo pasó", serverless, sin garantía de orden). **Service Bus** = procesamiento de mensajes de negocio ("ejecutá esto", con colas/topics, orden garantizado).',
    datoClave:
      '**Service Bus** tiene **Dead-Letter Queue** (mensajes que fallaron N veces) y **Sessions** (orden FIFO estricto por `SessionId`).',
    diagram: `flowchart TD
    Q{¿Qué necesito?}
    Q -->|"Reaccionar a un evento\\n(1 a muchos, sin orden garantizado)"| EG[Azure Event Grid]
    Q -->|"Procesar un mensaje de negocio\\n(orden, reintentos, dead-letter)"| SB[Azure Service Bus]
    EG --> EG1["Ej: se subió un blob → disparar Function"]
    SB --> SB1["Ej: cola de pedidos con FIFO por SessionId\\ny Dead-Letter Queue"]`,
    diagramExplicacion:
      '**Event Grid** es para "algo pasó" (reactivo, serverless, alta escala, sin orden garantizado). **Service Bus** es para "ejecutá esta orden de negocio" (colas/topics, FIFO con Sessions, Dead-Letter Queue para mensajes que fallaron).',
    faq: [
      {
        pregunta: '¿Puedo usar Event Grid y Service Bus juntos en la misma arquitectura?',
        respuesta:
          'Sí, es un patrón común: Event Grid notifica "se subió un blob" y esa notificación encola un mensaje de negocio en Service Bus para procesarlo con reintentos y orden garantizado.',
      },
      {
        pregunta: '¿Event Grid garantiza entrega exactly-once?',
        respuesta:
          'No, garantiza at-least-once: el mismo evento puede llegar duplicado, así que el consumidor tiene que ser idempotente.',
      },
      {
        pregunta: '¿Qué pasa si un consumer de Service Bus falla repetidamente al procesar un mensaje?',
        respuesta:
          'Después de agotar el número configurado de reintentos (`MaxDeliveryCount`), el mensaje pasa automáticamente a la Dead-Letter Queue en vez de perderse o reintentarse infinito.',
      },
      {
        pregunta: '¿Service Bus soporta publish/subscribe como Event Grid?',
        respuesta:
          'Sí, con Topics y Subscriptions: un mismo mensaje puede llegar a múltiples suscriptores, cada uno con su propio filtro y cursor de lectura.',
      },
      {
        pregunta: '¿Cuál tiene menor latencia end-to-end?',
        respuesta:
          'Event Grid está optimizado para reactividad casi instantánea a gran escala; Service Bus prioriza garantías de entrega y orden por sobre latencia mínima.',
      },
      {
        pregunta: '¿Sessions en Service Bus sirve para algo más que orden FIFO?',
        respuesta:
          'También permite agrupar mensajes relacionados bajo el mismo `SessionId` para que un mismo consumer procese toda la secuencia sin que otro consumer la interrumpa.',
      },
    ],
  },
  {
    id: 'managed-identities',
    domain: 'Seguridad & Monitoreo',
    title: 'Managed Identities',
    queEs: 'Identidad que Azure le da a un recurso para autenticarse sin contraseñas.',
    paraQueSirve: 'Que un Container App llame a Key Vault o AI Search sin guardar ningún secreto.',
    cuandoUsarlo: 'Siempre que la política de seguridad prohíba credenciales hardcodeadas.',
    datoClave: '**System-Assigned** muere con el recurso; **User-Assigned** es independiente y se reutiliza entre varios recursos.',
    diagram: `flowchart LR
    CA[Container App] -->|solicita token| Entra[Entra ID]
    Entra -->|token temporal| CA
    CA -->|token + rol RBAC| KV[(Key Vault)]
    CA -->|token + rol RBAC| Search[(Azure AI Search)]`,
    diagramExplicacion:
      'El recurso pide un token temporal a Entra ID usando su Managed Identity y lo usa para autenticarse contra Key Vault o AI Search según el rol RBAC asignado — sin que ninguna contraseña o secreto quede guardado en el código.',
    faq: [
      {
        pregunta: '¿Qué pasa con la identidad si borro el recurso que la tiene asignada?',
        respuesta:
          'Si es System-Assigned, se borra junto con el recurso automáticamente; si es User-Assigned, sigue existiendo como recurso independiente y hay que borrarla aparte.',
      },
      {
        pregunta: '¿Puedo compartir una misma identidad entre varios Container Apps?',
        respuesta:
          'Sí, pero solo con User-Assigned: es justo el caso de uso para el que existe, ya que System-Assigned está atada 1 a 1 con un único recurso.',
      },
      {
        pregunta: '¿Managed Identity funciona para autenticarme fuera de Azure?',
        respuesta:
          'No directamente: es un mecanismo pensado para recursos que corren dentro de Azure y hablan con Entra ID; para on-premise se necesita otro flujo (service principal con certificado, por ejemplo).',
      },
      {
        pregunta: '¿Alcanza con asignar la Managed Identity o también hay que dar el rol RBAC?',
        respuesta:
          'Hacen falta ambas cosas: la identidad autentica ("quién sos"), pero sin un rol RBAC asignado sobre el recurso destino (Key Vault, AI Search) la autorización falla igual.',
      },
      {
        pregunta: '¿Qué pasa si el token expira en medio de una operación larga?',
        respuesta:
          'El SDK de Azure Identity lo renueva automáticamente de forma transparente; el desarrollador no gestiona manualmente el refresh del token.',
      },
      {
        pregunta: '¿RBAC en Managed Identity es lo mismo que Access Policies de Key Vault?',
        respuesta:
          'No, son dos modelos distintos: RBAC es el mecanismo recomendado hoy (roles a nivel de management plane), mientras que Access Policies es el modelo legacy específico de Key Vault.',
      },
    ],
  },
  {
    id: 'key-vault',
    domain: 'Seguridad & Monitoreo',
    title: 'Azure Key Vault',
    queEs: 'Bóveda segura de secretos y llaves.',
    paraQueSirve: 'Guardar API keys externas con rotación.',
    cuandoUsarlo: 'Cualquier secreto que no sea una identidad administrada directa.',
    datoClave: 'El acceso se da vía rol RBAC (ej. `Key Vault Secrets User`), no por contraseña maestra.',
    diagram: `flowchart LR
    App[Aplicación] -->|Managed Identity| Entra[Entra ID]
    Entra -->|valida rol RBAC\\nej. Key Vault Secrets User| KV[(Azure Key Vault)]
    KV -->|entrega el secreto / API key| App
    Admin[Admin] -->|rota credenciales| KV`,
    diagramExplicacion:
      'La app nunca tiene el secreto embebido: pide un token vía Managed Identity, Entra ID valida que tenga el rol RBAC correcto (`Key Vault Secrets User`) y recién ahí Key Vault entrega el valor. La rotación la maneja el admin sin tocar el código de la app.',
    faq: [
      {
        pregunta: '¿Key Vault rota automáticamente los secretos?',
        respuesta:
          'No por sí solo: podés configurar una política de rotación (con una Function o Event Grid disparado por expiración cercana) para automatizarlo, pero no es un comportamiento por defecto.',
      },
      {
        pregunta: '¿Qué diferencia hay entre RBAC y Access Policies en Key Vault?',
        respuesta:
          'RBAC asigna permisos a nivel de management plane (mismo modelo que el resto de Azure) y es lo recomendado; Access Policies es el modelo legacy propio de Key Vault, más granular pero no unificado con el resto de RBAC de Azure.',
      },
      {
        pregunta: '¿Key Vault guarda solo secretos tipo texto?',
        respuesta:
          'No, también almacena llaves criptográficas (keys) y certificados, cada uno con su propio modelo de permisos y operaciones.',
      },
      {
        pregunta: '¿Qué pasa si borro un secreto por error?',
        respuesta:
          'Con **soft-delete** habilitado (default) queda recuperable por un período configurable; **purge protection** evita que alguien lo elimine definitivamente antes de ese período, ni siquiera un admin.',
      },
      {
        pregunta: '¿Key Vault agrega latencia notable a cada request de la app?',
        respuesta:
          'Sí que agrega una llamada de red extra, por eso la práctica recomendada es cachear el secreto en memoria de la app y refrescarlo solo periódicamente, no pedirlo en cada request.',
      },
      {
        pregunta: '¿Cómo se audita quién accedió a un secreto?',
        respuesta:
          'Vía diagnostic logs enviados a Log Analytics/Application Insights, que registran cada operación de lectura con la identidad que la hizo.',
      },
    ],
  },
  {
    id: 'app-insights',
    domain: 'Seguridad & Monitoreo',
    title: 'Application Insights / Azure Monitor',
    queEs: 'Telemetría y monitoreo distribuido.',
    paraQueSirve: 'Ver latencia, consumo de tokens, tasa de error 429 y trazas entre microservicios.',
    cuandoUsarlo: 'Cualquier solución en producción necesita esto desde el día 1.',
    datoClave:
      '**Distributed Tracing** usa el header estándar **W3C Trace Context**; las consultas se hacen en **KQL** sobre tablas `requests`, `exceptions`, `dependencies`.',
    diagram: `flowchart LR
    S1[Microservicio A] -->|traza W3C Trace Context| AI[(Application Insights)]
    S2[Microservicio B] -->|traza W3C Trace Context| AI
    S3[Azure OpenAI] -->|tokens, latencia, 429| AI
    AI -->|tablas requests / exceptions / dependencies| KQL[Consultas KQL]
    KQL --> Dash[Dashboard / Alertas]`,
    diagramExplicacion:
      'Cada microservicio propaga el header W3C Trace Context para que Application Insights pueda unir los spans de una misma request distribuida. Con KQL se consultan las tablas de requests, excepciones y dependencias para armar dashboards y alertas.',
    faq: [
      {
        pregunta: '¿Application Insights es lo mismo que Azure Monitor?',
        respuesta:
          'No, Application Insights es el componente de APM (Application Performance Monitoring) que corre sobre Azure Monitor, que es la plataforma más amplia de telemetría (incluye métricas de infraestructura, logs de plataforma, etc.).',
      },
      {
        pregunta: '¿Hace falta instrumentar manualmente cada microservicio para propagar el trace?',
        respuesta:
          'No siempre: el Auto-Instrumentation Agent inyecta la propagación del header W3C automáticamente en muchos stacks (.NET, Java, Node), sin tocar el código de la app.',
      },
      {
        pregunta: '¿Qué es el sampling y cómo afecta un análisis de errores raros?',
        respuesta:
          'Es la reducción del volumen de telemetría enviada para bajar costo; con sampling agresivo, un error que ocurre poco puede no quedar capturado, así que hay que calibrarlo según qué tan crítico es no perder eventos.',
      },
      {
        pregunta: '¿Application Insights agrega overhead notable de performance?',
        respuesta:
          'Es bajo pero no cero: el SDK agrega la telemetría de forma asíncrona en background, y el sampling existe justamente para mantener ese costo controlado a escala.',
      },
      {
        pregunta: '¿Necesito saber KQL para el examen o solo usar el portal?',
        respuesta:
          'El examen espera que entiendas al menos consultas básicas sobre `requests`, `exceptions` y `dependencies`, porque muchos escenarios de troubleshooting se resuelven mostrando una query KQL concreta.',
      },
      {
        pregunta: '¿Cómo configuro una alerta sobre la tasa de 429 de Azure OpenAI?',
        respuesta:
          'Con una alert rule sobre una consulta KQL programada (o una métrica) que cuenta respuestas 429 en la tabla `dependencies`/`requests` dentro de una ventana de tiempo, disparando notificación al superar el umbral.',
      },
    ],
  },
]

export default wikiContent
