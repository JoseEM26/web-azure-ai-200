# Azure Event Grid vs Azure Service Bus

## Qué es
Dos sistemas de mensajería con propósitos distintos.

## Para qué sirve
Desacoplar servicios.

## Cuándo usarlo (caso de uso típico de examen)
**Event Grid** = reactividad ("algo pasó", serverless, sin garantía de orden). **Service Bus** = procesamiento de mensajes de negocio ("ejecutá esto", con colas/topics, orden garantizado).

## Dato clave que suelen preguntar
**Service Bus** tiene **Dead-Letter Queue** (mensajes que fallaron N veces) y **Sessions** (orden FIFO estricto por `SessionId`).

## Cómo funciona (diagrama)
```mermaid
flowchart TD
    Q{¿Qué necesito?}
    Q -->|"Reaccionar a un evento\n(1 a muchos, sin orden garantizado)"| EG[Azure Event Grid]
    Q -->|"Procesar un mensaje de negocio\n(orden, reintentos, dead-letter)"| SB[Azure Service Bus]
    EG --> EG1["Ej: se subió un blob → disparar Function"]
    SB --> SB1["Ej: cola de pedidos con FIFO por SessionId\ny Dead-Letter Queue"]
```
**Event Grid** es para "algo pasó" (reactivo, serverless, alta escala, sin orden garantizado). **Service Bus** es para "ejecutá esta orden de negocio" (colas/topics, FIFO con Sessions, Dead-Letter Queue para mensajes que fallaron).
