// Contenido de la Wiki de Estudio AI-900, parseado 1:1 de los README de
// C:\Users\JOSE ANGEL\Documents\AI-900\0X-.../README.md — no resumido.

export const AI_FUNDAMENTALS_DOMAIN_COLORS = {
  'Cargas de Trabajo de IA y Consideraciones Responsables': '#e8935a', // naranja
  'Principios de Machine Learning en Azure': '#9ad14b', // verde lima
  'Visión por Computadora': '#4fd1e8', // celeste
  'Procesamiento de Lenguaje Natural (NLP)': '#d15fd8', // magenta
  'IA Generativa': '#e0c23e', // mostaza
}

export const aiFundamentalsIntroContent = {
  title: 'AI-900 — Material de estudio',
  lead:
    'Esta carpeta es material de estudio para el examen AI-900 (Microsoft Azure AI Fundamentals): el examen introductorio de IA de Microsoft, sin código ni arquitectura avanzada, enfocado en conceptos y terminología. Complementa a AI-200 (nivel Associate). Para estudiar, entrá a cada subcarpeta en orden o directo al tema que te falte repasar.',
  checklist: [
    'Principios de IA Responsable',
    'Fundamentos de Machine Learning',
    'Azure Machine Learning Studio y AutoML',
    'Azure AI Vision',
    'Azure AI Face',
    'Azure AI Document Intelligence',
    'Azure AI Language',
    'Azure AI Speech',
    'Azure AI Translator',
    'Conversational Language Understanding (CLU)',
    'Azure OpenAI y IA Generativa',
    'Prompt Engineering y Copilot',
  ],
}

const aiFundamentalsWikiContent = [
  {
    id: 'responsible-ai-principles',
    domain: 'Cargas de Trabajo de IA y Consideraciones Responsables',
    title: 'Principios de IA Responsable',
    queEs:
      'El conjunto de 6 principios que Microsoft exige aplicar a cualquier solución de IA: **Equidad** (Fairness), **Confiabilidad y Seguridad** (Reliability & Safety), **Privacidad y Seguridad** (Privacy & Security), **Inclusión** (Inclusiveness), **Transparencia** (Transparency) y **Responsabilidad** (Accountability).',
    paraQueSirve:
      'Evitar que un modelo discrimine, falle de forma insegura, exponga datos sensibles o tome decisiones que nadie puede explicar ni auditar.',
    cuandoUsarlo:
      'El examen da un escenario (ej. un modelo de contratación que rechaza más CVs de un género) y pide identificar qué principio se está violando.',
    datoClave:
      '**Equidad** = el modelo no discrimina entre grupos demográficos. **Transparencia** = el usuario sabe que está interactuando con IA y entiende cómo se generó el resultado. **Responsabilidad** = siempre hay una persona/equipo humano que responde por el sistema, la IA no es "responsable" por sí sola.',
    diagram: `flowchart TD
    A[Diseño de la solución de IA] --> B{Se aplican los 6 principios}
    B --> C[Equidad]
    B --> D[Confiabilidad y Seguridad]
    B --> E[Privacidad y Seguridad]
    B --> F[Inclusión]
    B --> G[Transparencia]
    B --> H[Responsabilidad]
    C & D & E & F & G & H --> I[Solución de IA lista para producción]`,
    diagramExplicacion:
      'Los 6 principios no son un checklist opcional al final: se evalúan durante todo el ciclo de vida (diseño, datos, entrenamiento, despliegue y monitoreo) de la solución de IA.',
    faq: [
      {
        pregunta: '¿Cuál es la diferencia entre Confiabilidad y Seguridad, y Privacidad y Seguridad?',
        respuesta:
          'Confiabilidad y Seguridad se refiere a que el sistema funcione de forma consistente y no cause daño físico o de negocio; Privacidad y Seguridad se refiere a proteger los datos personales usados por el modelo.',
      },
      {
        pregunta: '¿Qué principio cubre que un sistema de reconocimiento facial funcione peor con ciertos tonos de piel?',
        respuesta:
          'Equidad (Fairness): el modelo debe tratar a todos los grupos de forma equitativa, sin sesgos en su desempeño.',
      },
      {
        pregunta: '¿Qué significa Inclusión en IA responsable?',
        respuesta:
          'Que la solución esté diseñada para empoderar e incluir a personas de todas las capacidades, por ejemplo dando soporte a lectores de pantalla o reconocimiento de voz con distintos acentos.',
      },
      {
        pregunta: '¿Transparencia obliga a mostrar el código del modelo?',
        respuesta:
          'No necesariamente el código fuente, sino que las personas entiendan que interactúan con IA, cómo se toman las decisiones y cuáles son las limitaciones del sistema.',
      },
      {
        pregunta: '¿Quién es responsable si un modelo de IA comete un error grave?',
        respuesta:
          'Siempre un humano o una organización, nunca la IA misma; ese es justamente el principio de Responsabilidad (Accountability).',
      },
      {
        pregunta: '¿Estos 6 principios aplican solo a Azure AI o a cualquier proyecto de IA?',
        respuesta:
          'Son un marco general de Microsoft para cualquier proyecto de IA, no están atados técnicamente a un servicio de Azure en particular.',
      },
    ],
  },
  {
    id: 'ml-fundamentals',
    domain: 'Principios de Machine Learning en Azure',
    title: 'Fundamentos de Machine Learning',
    queEs:
      'La disciplina donde un algoritmo aprende patrones a partir de datos históricos (en vez de reglas escritas a mano) para hacer predicciones sobre datos nuevos.',
    paraQueSirve:
      'Predecir un valor numérico (regresión), clasificar en categorías (clasificación) o agrupar datos sin etiquetas por similitud (clustering).',
    cuandoUsarlo:
      'El examen te da un escenario y pide identificar el tipo de ML: "predecir el precio de una casa" = regresión, "predecir si un mail es spam" = clasificación, "agrupar clientes por comportamiento de compra sin categorías previas" = clustering.',
    datoClave:
      'Un modelo se entrena con un **dataset de entrenamiento** (training data) y se evalúa con un **dataset de validación/prueba** (validation/test data) que el modelo nunca vio, para medir si generaliza bien o si memorizó los datos (**overfitting**).',
    diagram: `flowchart LR
    A[Datos históricos etiquetados] --> B[División: entrenamiento / validación]
    B --> C[Algoritmo de ML]
    C --> D[Modelo entrenado]
    D --> E{Evaluación con datos de validación}
    E -->|métricas OK| F[Modelo listo para predecir]
    E -->|métricas malas| C`,
    diagramExplicacion:
      'Los datos se dividen para que el modelo aprenda con una porción y se mida con otra que nunca vio; si el modelo funciona mucho mejor con los datos de entrenamiento que con los de validación, hay overfitting.',
    faq: [
      {
        pregunta: '¿Cuál es la diferencia entre regresión y clasificación?',
        respuesta:
          'Regresión predice un número continuo (precio, temperatura); clasificación predice una categoría discreta (spam/no spam, tipo de fruta).',
      },
      {
        pregunta: '¿Qué es clustering y en qué se diferencia de la clasificación?',
        respuesta:
          'Clustering agrupa datos sin etiquetas previas, descubriendo grupos por similitud; clasificación necesita datos ya etiquetados para aprender las categorías.',
      },
      {
        pregunta: '¿Qué es una "feature" (característica) en Machine Learning?',
        respuesta:
          'Es cada columna de entrada que el modelo usa para predecir, por ejemplo metros cuadrados y ubicación para predecir el precio de una casa.',
      },
      {
        pregunta: '¿Qué es una "label" (etiqueta)?',
        respuesta:
          'Es el valor que el modelo intenta predecir, el que ya conocemos en los datos de entrenamiento (por ejemplo, el precio real de la casa).',
      },
      {
        pregunta: '¿Qué es overfitting?',
        respuesta:
          'Cuando el modelo memoriza los datos de entrenamiento en vez de aprender el patrón general, y por eso funciona mal con datos nuevos que no vio antes.',
      },
      {
        pregunta: '¿Machine Learning necesita siempre datos etiquetados?',
        respuesta:
          'No: el aprendizaje supervisado (regresión, clasificación) sí los necesita, pero el aprendizaje no supervisado (clustering) trabaja con datos sin etiquetar.',
      },
    ],
  },
  {
    id: 'azure-ml-studio-automl',
    domain: 'Principios de Machine Learning en Azure',
    title: 'Azure Machine Learning Studio y AutoML',
    queEs:
      'El servicio de Azure para crear, entrenar y publicar modelos de Machine Learning, con una interfaz visual (Studio) y una función que prueba modelos automáticamente (AutoML).',
    paraQueSirve:
      'Entrenar modelos sin necesidad de escribir código (con Designer o AutoML) o con notebooks para quien sí sabe programar, y luego publicarlos como un endpoint consumible.',
    cuandoUsarlo:
      'Cuando el escenario pide entrenar un modelo "sin escribir código" (AutoML o Designer) o pide identificar qué compute usar para entrenar vs para desplegar.',
    datoClave:
      '**AutoML** prueba automáticamente varios algoritmos y selecciona el de mejor métrica; **Designer** es un lienzo drag-and-drop para armar el pipeline a mano; los modelos se entrenan en un **Compute Cluster** (escalable, para cargas pesadas) y se publican en un **Compute Instance** o **endpoint** para consumo en tiempo real.',
    diagram: `flowchart LR
    A[Dataset subido a Azure ML] --> B{Cómo entrenar}
    B -->|sin código, automático| C[AutoML]
    B -->|sin código, visual| D[Designer]
    B -->|con código| E[Notebooks]
    C & D & E --> F[Modelo entrenado]
    F --> G[Endpoint publicado]
    G --> H[App consume predicciones]`,
    diagramExplicacion:
      'Las tres formas de entrenar terminan en lo mismo: un modelo entrenado que se publica como endpoint, listo para que una aplicación le mande datos nuevos y reciba una predicción.',
    faq: [
      {
        pregunta: '¿Qué diferencia hay entre AutoML y Designer?',
        respuesta:
          'AutoML prueba automáticamente múltiples algoritmos y selecciona el mejor según una métrica; Designer es un lienzo visual donde vos armás el pipeline de pasos manualmente (arrastrando bloques).',
      },
      {
        pregunta: '¿Qué es un Compute Cluster y en qué se diferencia de un Compute Instance?',
        respuesta:
          'El Compute Cluster escala automáticamente (agrega/quita nodos) y se usa para entrenar cargas pesadas; el Compute Instance es una máquina fija pensada para desarrollo, notebooks o inferencia liviana.',
      },
      {
        pregunta: '¿AutoML sirve para cualquier tipo de problema?',
        respuesta:
          'Cubre los escenarios más comunes: clasificación, regresión y forecasting de series de tiempo; no reemplaza soluciones altamente personalizadas de deep learning.',
      },
      {
        pregunta: '¿Qué métrica usa AutoML para elegir el "mejor" modelo?',
        respuesta:
          'Depende del tipo de problema (accuracy, AUC, R², RMSE, etc.); vos podés indicar cuál priorizar o dejar que Azure ML elija la métrica primaria por defecto.',
      },
      {
        pregunta: '¿Qué es un endpoint en Azure Machine Learning?',
        respuesta:
          'Es la URL publicada donde una aplicación externa envía datos y recibe la predicción del modelo en tiempo real (inferencia).',
      },
      {
        pregunta: '¿Necesito saber programar para usar Azure Machine Learning Studio?',
        respuesta:
          'No, Designer y AutoML permiten entrenar y publicar modelos sin escribir código; los Notebooks son la opción para quien prefiere control total con Python.',
      },
    ],
  },
  {
    id: 'ai-vision',
    domain: 'Visión por Computadora',
    title: 'Azure AI Vision',
    queEs:
      'El servicio de Azure para analizar imágenes: describirlas, clasificarlas, detectar objetos, leer texto (OCR) y moderar contenido visual.',
    paraQueSirve:
      'Extraer información automática de una imagen sin entrenar nada, usando modelos pre-entrenados por Microsoft (o modelos propios con Custom Vision).',
    cuandoUsarlo:
      'Cuando el escenario pide "generar una descripción de una imagen", "detectar dónde está un objeto dentro de la foto" o "leer el texto de una imagen escaneada".',
    datoClave:
      '**Image Classification** dice QUÉ hay en la imagen (una etiqueta general); **Object Detection** dice QUÉ y DÓNDE (con un bounding box/cuadro por cada objeto); **OCR** extrae el texto legible de la imagen. Con **Custom Vision** entrenás tus propias categorías cuando las etiquetas genéricas de Azure AI Vision no alcanzan.',
    diagram: `flowchart LR
    A[Imagen de entrada] --> B[Azure AI Vision]
    B --> C[Clasificación de imagen]
    B --> D[Detección de objetos]
    B --> E[OCR: lectura de texto]
    B --> F[Etiquetas y descripción]
    C & D & E & F --> G[Resultado estructurado JSON]`,
    diagramExplicacion:
      'La imagen se manda una sola vez al servicio y, según la operación elegida, devuelve etiquetas, cuadros de detección, texto extraído o una descripción en lenguaje natural, todo en formato JSON.',
    faq: [
      {
        pregunta: '¿Cuál es la diferencia entre Image Classification y Object Detection?',
        respuesta:
          'Classification asigna una o más etiquetas a la imagen completa; Object Detection además indica la ubicación exacta (bounding box) de cada objeto detectado dentro de la imagen.',
      },
      {
        pregunta: '¿Cuándo conviene usar Custom Vision en vez de Azure AI Vision?',
        respuesta:
          'Cuando las categorías genéricas de Microsoft no cubren tu caso (por ejemplo, distinguir entre modelos específicos de un producto propio); ahí entrenás un modelo con tus propias imágenes etiquetadas.',
      },
      {
        pregunta: '¿Qué hace el servicio de OCR dentro de Azure AI Vision?',
        respuesta:
          'Extrae texto impreso o manuscrito de imágenes o documentos escaneados y devuelve tanto el texto como su posición dentro de la imagen.',
      },
      {
        pregunta: '¿Azure AI Vision puede generar una descripción en lenguaje natural de una foto?',
        respuesta:
          'Sí, la función de "Image Analysis" puede devolver una caption (frase descriptiva) además de etiquetas individuales.',
      },
      {
        pregunta: '¿Custom Vision necesita muchas imágenes para entrenar un modelo?',
        respuesta:
          'No tantas como un modelo desde cero: al reutilizar transfer learning sobre modelos pre-entrenados, alcanza con un número relativamente chico de imágenes por categoría (decenas, no miles).',
      },
      {
        pregunta: '¿Azure AI Vision reemplaza a Azure AI Face para reconocer personas?',
        respuesta:
          'No, Azure AI Vision analiza objetos y escenas en general; el análisis específico de rostros (detección, atributos, verificación) es responsabilidad de Azure AI Face.',
      },
    ],
  },
  {
    id: 'ai-face',
    domain: 'Visión por Computadora',
    title: 'Azure AI Face',
    queEs: 'El servicio de Azure especializado en detectar, analizar y comparar rostros humanos en imágenes.',
    paraQueSirve:
      'Detectar si hay una cara en una imagen, extraer atributos (edad aproximada, emoción), verificar si dos fotos son la misma persona, o identificar a una persona dentro de un grupo conocido.',
    cuandoUsarlo:
      'Cuando el escenario menciona específicamente rostros: control de acceso por reconocimiento facial, verificación de identidad, o conteo de personas en una foto.',
    datoClave:
      '**Detección** encuentra caras y devuelve su ubicación; **Verificación** compara dos caras y dice si son la misma persona (1 a 1); **Identificación** busca una cara dentro de un grupo de personas conocidas (1 a N). Por políticas de IA responsable, Microsoft restringió el acceso a identificación facial: requiere aprobación especial (Limited Access) para casos de uso sensibles.',
    diagram: `flowchart LR
    A[Imagen con rostro] --> B[Azure AI Face]
    B --> C[Detección: ubicación de la cara]
    B --> D[Atributos: edad, emoción, pose]
    B --> E[Verificación: 1 a 1]
    B --> F[Identificación: 1 a N]
    C & D & E & F --> G[Resultado con nivel de confianza]`,
    diagramExplicacion:
      'Toda operación empieza detectando la cara dentro de la imagen; a partir de ahí se puede comparar contra otra foto (verificación) o buscarla en una base de personas conocidas (identificación), siempre con un puntaje de confianza asociado.',
    faq: [
      {
        pregunta: '¿Qué diferencia hay entre Verificación e Identificación facial?',
        respuesta:
          'Verificación compara dos rostros puntuales (¿es la misma persona?, 1 a 1); Identificación busca a quién pertenece un rostro dentro de un grupo ya registrado (1 a N).',
      },
      {
        pregunta: '¿Por qué Azure AI Face tiene acceso restringido (Limited Access)?',
        respuesta:
          'Por principios de IA responsable: el reconocimiento facial puede usarse para vigilancia o discriminación, así que Microsoft exige registrar el caso de uso antes de habilitar ciertas capacidades como identificación.',
      },
      {
        pregunta: '¿Azure AI Face puede detectar la emoción de una persona con certeza?',
        respuesta:
          'No con certeza absoluta: devuelve una probabilidad estimada por expresión facial, que puede no reflejar el estado emocional real de la persona.',
      },
      {
        pregunta: '¿Se necesita entrenar un modelo para usar Azure AI Face?',
        respuesta:
          'No para detección y atributos básicos; para identificación sí hay que crear un "grupo de personas" (Person Group) con fotos de referencia de cada individuo a reconocer.',
      },
      {
        pregunta: '¿Qué es un bounding box en el contexto de Azure AI Face?',
        respuesta:
          'Es el rectángulo que delimita la posición exacta de la cara detectada dentro de la imagen, junto con su tamaño.',
      },
      {
        pregunta: '¿Azure AI Face y Azure AI Vision son el mismo servicio?',
        respuesta:
          'No, son servicios distintos dentro de Azure AI Services: Vision analiza imágenes en general, Face se especializa exclusivamente en rostros humanos.',
      },
    ],
  },
  {
    id: 'document-intelligence',
    domain: 'Visión por Computadora',
    title: 'Azure AI Document Intelligence',
    queEs:
      'El servicio de Azure (antes llamado Form Recognizer) para extraer texto, tablas y pares clave-valor de documentos como formularios, facturas y recibos.',
    paraQueSirve:
      'Automatizar la digitalización de documentos: en vez de que una persona tipee a mano los datos de una factura, el servicio los extrae estructurados y listos para usar.',
    cuandoUsarlo:
      'Cuando el escenario pide procesar facturas, recibos, tarjetas de presentación o formularios en papel/PDF y convertirlos en datos estructurados.',
    datoClave:
      'Hay **modelos prebuilt** (ya entrenados por Microsoft para facturas, recibos, tarjetas de presentación, identificaciones) y **modelos custom** (entrenados con tus propios formularios cuando el diseño no coincide con ninguno prebuilt). El modelo de **Layout** extrae texto y estructura de tablas sin entender el significado de los campos.',
    diagram: `flowchart LR
    A[Documento escaneado o PDF] --> B{Tipo de modelo}
    B -->|formulario estándar| C[Modelo prebuilt]
    B -->|formulario propio| D[Modelo custom entrenado]
    B -->|solo estructura| E[Modelo Layout]
    C & D & E --> F[Datos extraídos: campos + tablas]
    F --> G[Sistema de la empresa: ERP, CRM]`,
    diagramExplicacion:
      'El documento se envía una sola vez y, según el modelo elegido, el servicio devuelve los campos clave-valor y tablas ya estructurados en JSON, listos para cargarse en otro sistema sin intervención manual.',
    faq: [
      {
        pregunta: '¿Cuál es la diferencia entre un modelo prebuilt y uno custom?',
        respuesta:
          'El prebuilt ya viene entrenado por Microsoft para formatos comunes (facturas, recibos); el custom lo entrenás vos mismo con ejemplos de tus propios formularios cuando el diseño es específico de tu empresa.',
      },
      {
        pregunta: '¿Qué hace el modelo Layout?',
        respuesta:
          'Extrae texto, líneas, tablas y su estructura posicional del documento, pero sin interpretar el significado de cada campo (no sabe que "Total" es un monto de factura).',
      },
      {
        pregunta: '¿Cuántos documentos de ejemplo necesito para entrenar un modelo custom?',
        respuesta:
          'Con un puñado de documentos de ejemplo (generalmente 5 o más por tipo de formulario) ya se puede entrenar un modelo custom razonable.',
      },
      {
        pregunta: '¿Document Intelligence puede leer manuscritos?',
        respuesta:
          'Sí, dentro de sus capacidades de OCR puede reconocer texto manuscrito además de impreso, aunque con menor precisión que el texto impreso.',
      },
      {
        pregunta: '¿Qué modelo prebuilt usarías para procesar recibos de compra?',
        respuesta:
          'El modelo prebuilt de "Receipt", que ya viene entrenado para reconocer comercio, fecha, ítems y total en tickets de compra.',
      },
      {
        pregunta: '¿Document Intelligence reemplaza a Azure AI Vision para leer texto?',
        respuesta:
          'Para documentos estructurados (formularios, facturas) conviene Document Intelligence porque además entiende campos y tablas; para OCR simple de una imagen cualquiera alcanza con Azure AI Vision.',
      },
    ],
  },
  {
    id: 'ai-language',
    domain: 'Procesamiento de Lenguaje Natural (NLP)',
    title: 'Azure AI Language',
    queEs:
      'El servicio de Azure para procesar texto en lenguaje natural: sentimiento, frases clave, entidades, idioma y resumen automático.',
    paraQueSirve:
      'Extraer información y significado de texto sin estructura (reseñas, tickets de soporte, correos) de forma automática.',
    cuandoUsarlo:
      'Cuando el escenario pide analizar el sentimiento de reseñas de clientes, detectar el idioma de un texto, extraer nombres/lugares/fechas de un documento, o resumir un texto largo.',
    datoClave:
      '**Sentiment Analysis** da un puntaje positivo/negativo/neutral por oración; **Key Phrase Extraction** saca las ideas principales; **Named Entity Recognition (NER)** identifica personas, lugares, organizaciones, fechas; **PII Detection** detecta y puede enmascarar datos personales (DNI, tarjetas, teléfonos).',
    diagram: `flowchart LR
    A[Texto de entrada] --> B[Azure AI Language]
    B --> C[Detección de idioma]
    B --> D[Análisis de sentimiento]
    B --> E[Extracción de frases clave]
    B --> F[Reconocimiento de entidades NER]
    B --> G[Detección de PII]
    C & D & E & F & G --> H[Resultado estructurado por operación]`,
    diagramExplicacion:
      'El mismo texto se puede analizar con distintas operaciones en paralelo (no son excluyentes); cada una devuelve un resultado independiente enfocado en un aspecto distinto del texto.',
    faq: [
      {
        pregunta: '¿Qué devuelve exactamente el análisis de sentimiento?',
        respuesta:
          'Un puntaje de positivo, negativo y neutral por oración y por documento completo, entre 0 y 1 para cada categoría.',
      },
      {
        pregunta: '¿Qué diferencia hay entre Key Phrase Extraction y NER?',
        respuesta:
          'Key Phrase Extraction saca los conceptos/temas principales del texto; NER identifica entidades específicas y categorizadas como personas, lugares, organizaciones o fechas.',
      },
      {
        pregunta: '¿Para qué sirve la detección de PII (Personally Identifiable Information)?',
        respuesta:
          'Para detectar automáticamente datos sensibles como números de documento, tarjetas de crédito o teléfonos dentro de un texto, y poder enmascararlos antes de guardarlo o compartirlo.',
      },
      {
        pregunta: '¿Azure AI Language puede resumir un documento largo?',
        respuesta:
          'Sí, tiene una función de resumen automático (extractive/abstractive summarization) que devuelve las oraciones o ideas más relevantes del texto.',
      },
      {
        pregunta: '¿Se necesita entrenar un modelo para usar sentiment analysis?',
        respuesta:
          'No, es un modelo pre-entrenado por Microsoft, listo para usar directamente sobre cualquier texto sin necesidad de entrenamiento previo.',
      },
      {
        pregunta: '¿Qué pasa si el texto está en varios idiomas dentro del mismo documento?',
        respuesta:
          'Azure AI Language detecta el idioma predominante o puede procesar por segmento; para mejor precisión conviene enviar textos en un solo idioma por vez.',
      },
    ],
  },
  {
    id: 'ai-speech',
    domain: 'Procesamiento de Lenguaje Natural (NLP)',
    title: 'Azure AI Speech',
    queEs:
      'El servicio de Azure para convertir voz en texto (Speech to Text), texto en voz (Text to Speech), traducir habla en tiempo real y reconocer quién habla.',
    paraQueSirve:
      'Habilitar interacción por voz en aplicaciones: transcribir reuniones, generar audio a partir de texto, subtitular en vivo o traducir una conversación hablada a otro idioma.',
    cuandoUsarlo:
      'Cuando el escenario menciona transcribir audio a texto, generar un asistente de voz, subtitulado en tiempo real, o traducir una conversación hablada.',
    datoClave:
      '**Speech to Text** transcribe audio a texto; **Text to Speech** genera audio a partir de texto (con voces neuronales que suenan naturales); **Speech Translation** combina ambas para traducir habla en tiempo real; **Speaker Recognition** identifica o verifica quién es la persona que habla (no qué dijo).',
    diagram: `flowchart LR
    A[Audio de entrada] --> B[Azure AI Speech]
    B --> C[Speech to Text: transcripción]
    B --> D[Speech Translation: traducción hablada]
    E[Texto de entrada] --> B
    B --> F[Text to Speech: voz neuronal]
    C & D & F --> G[Salida: texto, audio o subtítulos]`,
    diagramExplicacion:
      'El servicio acepta audio o texto según la operación: si entra audio, puede transcribirlo o traducirlo; si entra texto, lo convierte en voz con una de las voces neuronales disponibles.',
    faq: [
      {
        pregunta: '¿Qué diferencia hay entre Speech to Text y Speech Translation?',
        respuesta:
          'Speech to Text transcribe el audio al mismo idioma en que se habló; Speech Translation además traduce ese contenido a otro idioma, en texto o en voz.',
      },
      {
        pregunta: '¿Qué es una voz neuronal en Text to Speech?',
        respuesta:
          'Es un modelo de síntesis de voz entrenado con deep learning que suena mucho más natural que las voces sintéticas tradicionales, con entonación y ritmo más humanos.',
      },
      {
        pregunta: '¿Para qué sirve el reconocimiento de hablante (Speaker Recognition)?',
        respuesta:
          'Para identificar o verificar quién está hablando (autenticación por voz), no para saber qué dijo; es el equivalente en audio a la verificación/identificación facial.',
      },
      {
        pregunta: '¿Azure AI Speech puede transcribir en tiempo real?',
        respuesta:
          'Sí, soporta transcripción continua en streaming además del modo por archivo de audio completo (batch).',
      },
      {
        pregunta: '¿Se puede crear una voz personalizada (custom) con Text to Speech?',
        respuesta:
          'Sí, con Custom Neural Voice se puede entrenar una voz sintética propia a partir de grabaciones de una persona real, aunque requiere aprobación por uso responsable.',
      },
      {
        pregunta: '¿Qué formato de entrada necesita Speech to Text?',
        respuesta:
          'Un archivo de audio (por ejemplo WAV) o un stream de audio en vivo; no requiere que el audio venga pre-procesado o limpio de ruido, aunque la calidad afecta la precisión.',
      },
    ],
  },
  {
    id: 'ai-translator',
    domain: 'Procesamiento de Lenguaje Natural (NLP)',
    title: 'Azure AI Translator',
    queEs: 'El servicio de Azure para traducir texto (y documentos completos) entre más de 100 idiomas de forma automática.',
    paraQueSirve:
      'Traducir contenido escrito sin intervención humana: interfaces de usuario, chats, documentos o contenido generado por usuarios.',
    cuandoUsarlo:
      'Cuando el escenario pide traducir texto entre idiomas (no voz, eso es Azure AI Speech) o traducir documentos completos conservando su formato.',
    datoClave:
      'Traducción **literal** traduce palabra por palabra respetando la gramática; traducción **dinámica/contextual** (por default) ajusta la traducción según el contexto de la oración completa. El **Custom Translator** permite entrenar un modelo propio con terminología específica de una industria (ej. términos médicos o legales) cuando la traducción genérica no alcanza.',
    diagram: `flowchart LR
    A[Texto o documento en idioma origen] --> B[Azure AI Translator]
    B --> C[Traducción estándar multi-idioma]
    B --> D[Custom Translator con diccionario propio]
    C & D --> E[Texto/documento traducido]
    E --> F[App o usuario final]`,
    diagramExplicacion:
      'El texto entra en un idioma y sale traducido al idioma destino elegido; si la terminología del negocio es muy específica, un modelo Custom Translator entrenado con glosarios propios mejora la precisión sobre la traducción genérica.',
    faq: [
      {
        pregunta: '¿Qué diferencia hay entre traducción literal y dinámica?',
        respuesta:
          'La literal traduce palabra por palabra siguiendo la gramática exacta; la dinámica (default) considera el contexto completo de la oración para dar una traducción más natural.',
      },
      {
        pregunta: '¿Para qué sirve un diccionario dinámico (dynamic dictionary) en Translator?',
        respuesta:
          'Para forzar que un término específico (por ejemplo un nombre de producto o marca) se traduzca siempre de una forma exacta, sin dejarlo a criterio del modelo genérico.',
      },
      {
        pregunta: '¿Cuándo conviene usar Custom Translator en vez de la traducción estándar?',
        respuesta:
          'Cuando el dominio tiene terminología muy específica (médica, legal, técnica) que la traducción genérica no maneja bien, y se cuenta con documentos bilingües de referencia para entrenar.',
      },
      {
        pregunta: '¿Azure AI Translator puede traducir documentos completos manteniendo el formato?',
        respuesta:
          'Sí, tiene una función de traducción de documentos que procesa archivos completos (Word, PDF, etc.) preservando el layout original.',
      },
      {
        pregunta: '¿Cuántos idiomas soporta Azure AI Translator?',
        respuesta:
          'Más de 100 idiomas y dialectos para texto, aunque la disponibilidad exacta de pares de idiomas puede variar según la función específica.',
      },
      {
        pregunta: '¿Translator y Azure AI Speech son el mismo servicio?',
        respuesta:
          'No, Translator trabaja con texto escrito; la traducción de voz hablada en tiempo real es una capacidad de Azure AI Speech (Speech Translation).',
      },
    ],
  },
  {
    id: 'clu',
    domain: 'Procesamiento de Lenguaje Natural (NLP)',
    title: 'Conversational Language Understanding (CLU)',
    queEs:
      'El servicio de Azure AI Language para entender la intención detrás de una frase escrita por un usuario, sucesor de LUIS (Language Understanding).',
    paraQueSirve:
      'Que un bot o asistente entienda QUÉ quiere hacer el usuario (intent) y qué datos relevantes mencionó (entities), a partir de una frase en lenguaje natural.',
    cuandoUsarlo:
      'Cuando el escenario describe un chatbot que debe interpretar frases como "reservame un vuelo a Madrid para el viernes" y actuar en consecuencia.',
    datoClave:
      '**Intent** es la intención/acción que quiere el usuario (ej. `ReservarVuelo`); **Entity** es el dato específico dentro de la frase (ej. `Madrid`, `viernes`); **Utterance** es cada frase de ejemplo que se usa para entrenar el modelo a reconocer un intent. CLU reemplazó a LUIS como servicio recomendado dentro de Azure AI Language.',
    diagram: `flowchart LR
    A[Frase del usuario] --> B[Modelo CLU entrenado]
    B --> C[Intent detectado]
    B --> D[Entities extraídas]
    C & D --> E[Bot/aplicación ejecuta la acción]`,
    diagramExplicacion:
      'El modelo se entrena previamente con ejemplos de frases (utterances) etiquetadas por intent; en producción, cada frase nueva del usuario se clasifica en el intent más probable y se extraen sus entidades relevantes.',
    faq: [
      {
        pregunta: '¿Qué es un intent en CLU?',
        respuesta:
          'Es la intención o acción que el usuario quiere realizar, por ejemplo `ConsultarClima` o `CancelarPedido`, y es la categoría que el modelo predice para cada frase.',
      },
      {
        pregunta: '¿Qué es una entity y en qué se diferencia de un intent?',
        respuesta:
          'La entity es un dato específico dentro de la frase (una ciudad, una fecha, un número); el intent es la acción general, la entity es el detalle que necesita esa acción para ejecutarse.',
      },
      {
        pregunta: '¿Qué es una utterance?',
        respuesta:
          'Es cada frase de ejemplo, escrita en lenguaje natural, que se usa para entrenar al modelo a reconocer un intent determinado (mientras más variadas, mejor generaliza el modelo).',
      },
      {
        pregunta: '¿CLU reemplaza completamente a LUIS?',
        respuesta:
          'Sí, Microsoft recomienda migrar a CLU (dentro de Azure AI Language) porque LUIS está en proceso de retiro y CLU ofrece mejor precisión con modelos más modernos.',
      },
      {
        pregunta: '¿Se necesita un intent especial para frases que el modelo no entiende?',
        respuesta:
          'Sí, se recomienda un intent `None` para capturar frases fuera de alcance y evitar que el modelo fuerce una clasificación incorrecta.',
      },
      {
        pregunta: '¿CLU puede usarse sin conectarlo a un bot?',
        respuesta:
          'Sí, es un servicio independiente que devuelve el intent y las entities vía API; conectarlo a un Bot Framework o canal de chat es una decisión de arquitectura aparte.',
      },
    ],
  },
  {
    id: 'azure-openai-genai',
    domain: 'IA Generativa',
    title: 'Azure OpenAI y IA Generativa',
    queEs:
      'El servicio de Azure que da acceso a los modelos de OpenAI (GPT para texto/chat, DALL-E para imágenes, embeddings) con la seguridad y el cumplimiento de Azure.',
    paraQueSirve:
      'Generar contenido nuevo (texto, imágenes, código) a partir de una instrucción en lenguaje natural (prompt), en vez de solo clasificar o predecir sobre datos existentes.',
    cuandoUsarlo:
      'Cuando el escenario pide generar texto, resumir, redactar código, crear imágenes a partir de una descripción, o construir un asistente conversacional tipo ChatGPT.',
    datoClave:
      'Un **token** es la unidad mínima de texto que procesa el modelo (aprox. 4 caracteres en inglés); el costo y los límites de contexto se miden en tokens, no en palabras. **Azure OpenAI Studio** es la interfaz para probar prompts, ajustar parámetros y desplegar modelos. **Embeddings** convierten texto en vectores numéricos usados para búsqueda semántica.',
    diagram: `flowchart LR
    A[Prompt del usuario] --> B[Azure OpenAI Service]
    B --> C[Modelo GPT: texto/chat]
    B --> D[DALL-E: generación de imágenes]
    B --> E[Embeddings: vectores semánticos]
    C & D & E --> F[Contenido generado]
    F --> G[Aplicación del usuario]`,
    diagramExplicacion:
      'El usuario escribe una instrucción en lenguaje natural (prompt) y el modelo elegido genera contenido nuevo como respuesta, ya sea texto, una imagen o un vector numérico para búsqueda semántica.',
    faq: [
      {
        pregunta: '¿Qué es un token y por qué importa?',
        respuesta:
          'Es la unidad mínima de texto que procesa el modelo (fragmento de palabra); tanto el costo del servicio como el límite de contexto de cada modelo se calculan en tokens, no en caracteres o palabras.',
      },
      {
        pregunta: '¿Qué diferencia hay entre Azure OpenAI y usar OpenAI directamente?',
        respuesta:
          'Azure OpenAI ofrece los mismos modelos pero con la seguridad, cumplimiento normativo, redes privadas y SLA de Azure, algo clave para empresas con requisitos regulatorios.',
      },
      {
        pregunta: '¿Qué es un embedding?',
        respuesta:
          'Es la representación numérica (vector) del significado de un texto; se usa para medir similitud semántica entre textos, por ejemplo en búsquedas o sistemas de recomendación.',
      },
      {
        pregunta: '¿Qué es DALL-E dentro de Azure OpenAI?',
        respuesta:
          'El modelo generador de imágenes a partir de una descripción de texto (prompt), parte del catálogo de modelos disponibles en Azure OpenAI Service.',
      },
      {
        pregunta: '¿Qué es Azure OpenAI Studio?',
        respuesta:
          'La interfaz web para probar prompts, ajustar parámetros (temperatura, tokens máximos), comparar modelos y desplegarlos, sin necesidad de escribir código para experimentar.',
      },
      {
        pregunta: '¿Un modelo de IA generativa "sabe" siempre la verdad?',
        respuesta:
          'No, puede generar respuestas incorrectas con total seguridad (alucinaciones); por eso conviene fundamentar sus respuestas con datos propios y validar la información crítica.',
      },
    ],
  },
  {
    id: 'prompt-engineering-copilot',
    domain: 'IA Generativa',
    title: 'Prompt Engineering y Copilot',
    queEs:
      'La técnica de diseñar la instrucción (prompt) que se le da a un modelo de IA generativa para obtener la mejor respuesta posible, y Copilot, la familia de asistentes de Microsoft construidos sobre esta idea.',
    paraQueSirve:
      'Mejorar la calidad, precisión y formato de las respuestas de un modelo sin necesidad de reentrenarlo, solo cambiando cómo se le pide la tarea.',
    cuandoUsarlo:
      'Cuando el escenario pide identificar buenas prácticas de prompting (dar ejemplos, dar contexto, definir un rol) o explicar qué es un system message en un asistente conversacional.',
    datoClave:
      'El **system message** define el rol y las reglas del asistente antes de la conversación (ej. "sos un asistente de soporte técnico, responde solo sobre nuestros productos"); el **grounding** es darle al modelo datos propios como contexto para que no invente información (reduce alucinaciones); **few-shot prompting** es incluir ejemplos dentro del prompt para guiar el formato de la respuesta.',
    diagram: `flowchart LR
    A[System message: rol y reglas] --> D[Modelo de IA generativa]
    B[Prompt del usuario] --> D
    C[Datos de grounding: contexto propio] --> D
    D --> E[Respuesta generada]`,
    diagramExplicacion:
      'El system message fija el comportamiento general del asistente, el prompt del usuario es la pregunta puntual, y el grounding aporta datos propios de contexto; el modelo combina las tres entradas para generar la respuesta final.',
    faq: [
      {
        pregunta: '¿Qué es un system message?',
        respuesta:
          'Es la instrucción inicial que define el rol, tono y límites del asistente antes de que empiece la conversación con el usuario, y no cambia entre turnos.',
      },
      {
        pregunta: '¿Qué es grounding y para qué sirve?',
        respuesta:
          'Es proveer al modelo datos propios y verificados como contexto (por ejemplo, con Azure AI Search) para que responda basado en esa información en vez de inventar (alucinar) una respuesta.',
      },
      {
        pregunta: '¿Qué es few-shot prompting?',
        respuesta:
          'Es incluir uno o más ejemplos de pregunta-respuesta dentro del mismo prompt para que el modelo copie el formato o estilo esperado en su respuesta.',
      },
      {
        pregunta: '¿Qué es zero-shot prompting?',
        respuesta:
          'Es pedirle al modelo que resuelva una tarea sin darle ningún ejemplo previo, confiando solo en su conocimiento pre-entrenado.',
      },
      {
        pregunta: '¿Qué es Microsoft Copilot?',
        respuesta:
          'La familia de asistentes de IA generativa de Microsoft integrados en productos como Word, Excel o Windows, que usan prompt engineering y grounding sobre los datos del usuario para asistir en tareas cotidianas.',
      },
      {
        pregunta: '¿Cambiar el prompt reentrena al modelo?',
        respuesta:
          'No, el prompt engineering no modifica los parámetros del modelo; solo cambia la instrucción de entrada para obtener mejores resultados con el mismo modelo ya entrenado.',
      },
    ],
  },
]

export default aiFundamentalsWikiContent
