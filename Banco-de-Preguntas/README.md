# Banco de preguntas de práctica — AI-200

Formato examen real: opción múltiple y casos de estudio cortos. Las respuestas y justificaciones están agrupadas al final del archivo — no las mires antes de responder.

1. Los usuarios reportan que el RAG a veces omite términos técnicos exactos y otras veces no capta preguntas abstractas. ¿Qué configuración en Azure AI Search mejora la precisión?
   A) Solo vectores con KNN exhaustivo B) Solo texto completo (BM25) C) Híbrida (vectores + texto) con Semantic Ranker D) Solo filtros OData

2. Un microservicio en Azure Container Apps consume Azure OpenAI en plan Standard y recibe `HTTP 429` en horas pico. ¿Qué debe implementar el código?
   A) Cambiar el 429 a 500 B) Reintentos con backoff exponencial + jitter C) Eliminar la validación de tokens D) Crear una instancia nueva por request

3. Necesitás evitar que un usuario manipule el system prompt del modelo con instrucciones maliciosas. ¿Qué servicio integrás?
   A) Azure Key Vault B) Azure AI Content Safety (Prompt Shield) C) Azure Front Door WAF D) Entra Application Proxy

4. Una app debe transcribir audios de hasta 45 minutos recibidos por HTTP. ¿Qué arquitectura evita que la llamada quede colgada?
   A) Azure App Service síncrono con timeout largo B) Durable Functions con patrón Async HTTP API C) Script en una VM D) Event Grid directo a OpenAI

5. Un contenedor en ACA necesita leer secretos de Key Vault sin guardar ninguna credencial en código ni variables de entorno. ¿Qué configurás?
   A) Usuario admin local con password en Base64 B) Managed Identity + rol RBAC en Key Vault C) SAS token de 10 años en el Dockerfile D) Abrir el firewall del Key Vault a todo el mundo

6. Querés que un worker que procesa mensajes de una cola escale a 0 réplicas cuando no hay tráfico y suba automáticamente cuando llegan mensajes. ¿Qué servicio y mecanismo usás?
   A) VM con autoscaling clásico B) Azure Container Apps con regla KEDA sobre la cola C) Azure Functions Consumption sin colas D) AKS con HPA por CPU únicamente

7. Necesitás encadenar 3 pasos de IA (transcribir → traducir → resumir) garantizando que si falla el paso 2 no se pierda el resultado del paso 1. ¿Qué patrón de Durable Functions aplica?
   A) Fan-out/Fan-in B) Function Chaining C) Human-in-the-loop D) Eternal Orchestrations

8. Tenés un PDF de 500 páginas y querés generar embeddings de cada sección en paralelo y después juntar los resultados. ¿Qué patrón usás?
   A) Function Chaining B) Fan-out/Fan-in C) Async HTTP API D) Singleton pattern

9. Un flujo de aprobación de crédito generado por un agente de IA debe pausarse hasta que un supervisor humano apruebe. ¿Qué patrón de Durable Functions es?
   A) Fan-out/Fan-in B) Function Chaining C) Human-in-the-loop (external events) D) Async HTTP API

10. Necesitás tráfico de inferencia con latencia predecible y sin compartir cuota con otros clientes de Azure OpenAI. ¿Qué plan de despliegue elegís?
    A) Standard (pay-as-you-go) B) Provisioned Throughput Units (PTU) C) Free tier D) Batch API únicamente

11. Querés forzar que la respuesta del modelo cumpla siempre un esquema JSON exacto sin parsear texto libre. ¿Qué característica de Azure OpenAI usás?
    A) Temperature = 0 B) Structured Outputs (json_schema) C) System message más largo D) Function calling sin schema

12. ¿Qué algoritmo de búsqueda vectorial en Azure AI Search es aproximado y más rápido en índices grandes?
    A) KNN exhaustivo B) HNSW C) BM25 D) OData filter

13. Necesitás guardar el historial de una conversación de chat con latencia mínima y disparar una Function cada vez que se agrega un mensaje. ¿Qué combinación usás?
    A) Blob Storage + Timer trigger B) Cosmos DB + Change Feed C) Key Vault + Event Grid D) AI Search + Indexer

14. Documentos de soporte que casi nadie consulta después de 4 meses, ¿en qué tier de Blob Storage deberían terminar?
    A) Hot B) Cool C) Archive D) Premium

15. Necesitás que varios servicios reaccionen quien-sabe-cuántos a "se subió un archivo nuevo" sin necesidad de garantizar orden. ¿Qué servicio de mensajería es el natural?
    A) Azure Service Bus Queue B) Azure Event Grid C) Azure Service Bus Topic con sesiones D) Azure Cosmos DB Change Feed únicamente

16. Necesitás procesar órdenes de pago en estricto orden FIFO por cliente, con reintentos y aislamiento de mensajes fallidos. ¿Qué servicio y característica?
    A) Event Grid con reintentos B) Service Bus con Sessions + Dead-Letter Queue C) Blob Storage con Lifecycle Management D) Cosmos DB con TTL

17. Un pipeline RAG necesita detectar instrucciones maliciosas escondidas dentro de un PDF que el modelo va a leer (no escritas por el usuario en el chat). ¿Qué protección aplica?
    A) Prompt Shield — User Prompt Attacks B) Prompt Shield — Document Attacks (indirect injection) C) Azure Key Vault D) RBAC en AI Search

18. Cinco Azure Functions distintas necesitan compartir exactamente los mismos permisos hacia Key Vault y AI Search. ¿Qué tipo de Managed Identity conviene?
    A) System-Assigned en cada una B) User-Assigned compartida entre las 5 C) Contraseña compartida en variables de entorno D) Service Principal con secreto manual

19. Querés medir si la respuesta del RAG se basa realmente en los documentos recuperados y no está alucinando. ¿Qué métrica de evaluación de Microsoft Foundry usás?
    A) Coherence B) Relevance C) Groundedness D) Latency

20. Necesitás rastrear una request que atraviesa 4 microservicios distintos para ver dónde se generó la latencia. ¿Qué usás?
    A) Azure Key Vault logs B) Application Insights con Distributed Tracing (W3C Trace Context) C) Blob Storage access logs D) Event Grid delivery logs

21. Un equipo necesita compilar automáticamente la imagen de un contenedor cada vez que hacen commit, sin usar Docker local ni guardar contraseñas de registro. ¿Qué usás?
    A) Docker Hub manual B) ACR Tasks + Managed Identity C) Subir el .tar por FTP D) Azure Blob Storage como registro

---

## Respuestas

1. **C** — Híbrida + Semantic Ranker combina precisión léxica (BM25) con contexto semántico (vectores), y el ranker reordena por relevancia real.
2. **B** — El 429 es límite de cuota (TPM/RPM); el patrón estándar es backoff exponencial con jitter para no saturar el endpoint.
3. **B** — Prompt Shield está diseñado específicamente para detectar inyección de prompts directa e indirecta.
4. **B** — Durable Functions con Async HTTP API responde `202` al instante y deja que el cliente haga polling mientras el flujo largo corre en background.
5. **B** — Managed Identity + RBAC elimina toda credencial hardcodeada; el contenedor pide un token temporal a Entra ID.
6. **B** — KEDA escala Container Apps según la longitud de la cola, incluyendo scale-to-zero.
7. **B** — Function Chaining ejecuta pasos secuenciales guardando el estado de cada uno.
8. **B** — Fan-out/Fan-in paraleliza el trabajo y después consolida los resultados.
9. **C** — Human-in-the-loop pausa la orquestación esperando un evento externo (aprobación humana).
10. **B** — PTU da capacidad reservada y dedicada, con latencia predecible; Standard comparte cuota con otros clientes.
11. **B** — Structured Outputs con `json_schema` garantiza el formato exacto sin depender de que el modelo "se porte bien".
12. **B** — HNSW es aproximado (ANN) y escala mejor que el KNN exhaustivo en índices grandes.
13. **B** — Cosmos DB tiene indexación de vectores integrada y Change Feed dispara eventos ante cambios.
14. **B** — Cool es para acceso infrecuente pero aún accesible (>30 días); Archive requiere horas de rehidratación, demasiado para "casi nadie consulta".
15. **B** — Event Grid es el modelo reactivo 1-a-muchos sin garantía de orden, ideal para "algo pasó".
16. **B** — Sessions garantiza FIFO por `SessionId` y Dead-Letter Queue aísla los mensajes que fallaron tras N reintentos.
17. **B** — Document Attacks cubre instrucciones maliciosas ocultas en contenido que el modelo procesa (no escritas directamente por el usuario).
18. **B** — User-Assigned Managed Identity es un recurso independiente reutilizable entre varios servicios.
19. **C** — Groundedness mide si la respuesta se sostiene en el contexto recuperado (evita alucinaciones); Relevance mide si responde la pregunta, Coherence mide fluidez.
20. **B** — Distributed Tracing con el header W3C Trace Context conecta los spans entre microservicios en Application Insights.
21. **B** — ACR Tasks compila la imagen dentro de Azure disparado por el commit, sin Docker local; la autenticación es sin contraseña vía Managed Identity.
