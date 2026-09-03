# Application Insights / Azure Monitor

## Qué es
Telemetría y monitoreo distribuido.

## Para qué sirve
Ver latencia, consumo de tokens, tasa de error 429 y trazas entre microservicios.

## Cuándo usarlo (caso de uso típico de examen)
Cualquier solución en producción necesita esto desde el día 1.

## Dato clave que suelen preguntar
**Distributed Tracing** usa el header estándar **W3C Trace Context**; las consultas se hacen en **KQL** sobre tablas `requests`, `exceptions`, `dependencies`.

## Cómo funciona (diagrama)
```mermaid
flowchart LR
    S1[Microservicio A] -->|traza W3C Trace Context| AI[(Application Insights)]
    S2[Microservicio B] -->|traza W3C Trace Context| AI
    S3[Azure OpenAI] -->|tokens, latencia, 429| AI
    AI -->|tablas requests / exceptions / dependencies| KQL[Consultas KQL]
    KQL --> Dash[Dashboard / Alertas]
```
Cada microservicio propaga el header W3C Trace Context para que Application Insights pueda unir los spans de una misma request distribuida. Con KQL se consultan las tablas de requests, excepciones y dependencias para armar dashboards y alertas.
