// Contenido de la Wiki de Azure DevOps Esenciales, parseado 1:1 de los README de
// C:\Users\JOSE ANGEL\Documents\Azure-DevOps-Esenciales\XX-.../README.md — no resumido.

export const DEVOPS_DOMAIN_COLORS = {
  'Cómputo y Aplicaciones': '#33c99e', // teal
  Redes: '#6fa9e0', // azul
  Datos: '#a993ec', // violeta
  'Identidad y Gobernanza': '#e4a244', // ámbar
  'DevOps y Operaciones': '#e07691', // rosa
}

export const devopsIntroContent = {
  title: 'Azure DevOps Esenciales — Material de estudio',
  lead:
    'Esta wiki cubre los 14 servicios core que un DevOps usa en el día a día: cómputo, redes, datos, identidad/gobernanza y las herramientas de DevOps y operaciones propiamente dichas. Cada servicio trae qué es, para qué sirve, cuándo usarlo, el dato clave, un diagrama de arquitectura y preguntas frecuentes.',
  checklist: [
    'Azure Virtual Machines y Scale Sets',
    'Azure App Service',
    'Azure Virtual Network (VNet) y NSG',
    'Azure Load Balancer y Application Gateway',
    'Azure Firewall, VPN Gateway y ExpressRoute',
    'Azure Storage Accounts',
    'Azure SQL Database',
    'Microsoft Entra ID y RBAC',
    'Azure DevOps: Pipelines, Repos y Boards',
    'ARM / Bicep — Infraestructura como Código',
    'Azure Monitor y Log Analytics',
    'Azure Policy y Management Groups',
    'Azure Backup y Site Recovery',
    'Azure Cost Management y Tags',
  ],
}

const devopsWikiContent = [
  {
    id: 'virtual-machines-scale-sets',
    domain: 'Cómputo y Aplicaciones',
    title: 'Azure Virtual Machines y Scale Sets',
    queEs: 'Máquinas virtuales IaaS en Azure, y su versión que escala automáticamente (VMSS).',
    paraQueSirve:
      'Correr cargas que necesitan control total del SO (servidores legacy, apps que no son cloud-native, agentes de build propios).',
    cuandoUsarlo:
      'Tenés un pool de agentes de build o un backend que recibe picos de tráfico predecibles (horario laboral) y necesitás que la cantidad de VMs suba y baje sola sin que nadie la toque a mano.',
    datoClave:
      'Un **Scale Set** define reglas de autoescalado por métrica (CPU, memoria, cola) o por horario; las VMs nuevas se crean desde una **imagen** (Marketplace, custom o Shared Image Gallery) y arrancan con un **script de extensión** (Custom Script Extension / cloud-init) para configurarse solas.',
    diagram: `flowchart LR
    M[Azure Monitor\\nmétrica de CPU] --> R[Regla de autoescalado]
    R -->|CPU alta| VMSS[Virtual Machine\\nScale Set]
    R -->|CPU baja| VMSS
    IMG[(Imagen base\\nMarketplace / Custom)] --> VMSS
    VMSS --> VM1[VM 1]
    VMSS --> VM2[VM 2]
    VMSS --> VMN[VM N]
    LB[Load Balancer] --> VM1
    LB --> VM2
    LB --> VMN`,
    diagramExplicacion:
      'Azure Monitor mide la métrica configurada (por ejemplo CPU) y dispara la regla de autoescalado, que le dice al Scale Set cuántas instancias levantar o bajar. Cada VM nueva nace de la misma imagen base y queda detrás del Load Balancer repartiendo tráfico.',
    faq: [
      {
        pregunta:
          '¿Qué pasa con las conexiones activas de una VM cuando el Scale Set hace scale-in y la elimina?',
        respuesta:
          'Se cortan. Hay que configurar **connection draining** en el Load Balancer para que deje de mandarle tráfico nuevo a esa instancia antes de eliminarla, dándole tiempo a terminar las requests en curso.',
      },
      {
        pregunta: '¿Las VMs de un Scale Set guardan estado o son descartables?',
        respuesta:
          'Se asumen descartables (stateless). Si necesitás persistir datos, van en un disco separado, una base de datos o un storage externo, nunca en el disco local de la instancia porque puede desaparecer en cualquier scale-in.',
      },
      {
        pregunta: '¿Puedo mezclar tamaños o usar Spot VMs dentro del mismo Scale Set para ahorrar costo?',
        respuesta:
          'Sí, con **mixed instance policies** podés combinar SKUs y usar instancias Spot para parte de la capacidad, aceptando que Azure puede desalojarlas si necesita esa capacidad para VMs a precio normal.',
      },
      {
        pregunta: '¿Cómo actualizo el software de todas las instancias sin tumbar el servicio?',
        respuesta:
          'Con una **rolling upgrade**: el Scale Set actualiza un subconjunto de instancias por vez (upgrade batch), las saca del Load Balancer, las actualiza y las vuelve a meter, repitiendo hasta cubrir todas.',
      },
      {
        pregunta: '¿Qué pasa si el script de arranque (cloud-init o Custom Script Extension) falla en una instancia nueva?',
        respuesta:
          'La instancia queda marcada como no saludable (o directamente falla el provisioning) y el Scale Set la puede reemplazar automáticamente si tenés configurado **health monitoring** con auto-repair.',
      },
      {
        pregunta: '¿Cuándo conviene un Scale Set y cuándo directamente contenedores (AKS o Container Apps)?',
        respuesta:
          'Si necesitás control total del SO, drivers específicos o software legacy que no corre en contenedor, VMSS. Si la app ya es cloud-native y solo necesitás escalar réplicas de un mismo artefacto, un contenedor suele ser más rápido de escalar y más barato de operar.',
      },
      {
        pregunta: '¿El autoescalado por horario y por métrica se pueden combinar?',
        respuesta:
          'Sí, un Scale Set puede tener varios perfiles de autoescalado: uno por horario (por ejemplo, mínimo más alto en horario laboral) y reglas por métrica encima que reaccionan a picos dentro de esa ventana.',
      },
    ],
  },
  {
    id: 'app-service',
    domain: 'Cómputo y Aplicaciones',
    title: 'Azure App Service',
    queEs: 'Plataforma PaaS administrada para alojar aplicaciones web, APIs y backends sin gestionar servidores.',
    paraQueSirve: 'Desplegar una app (código o contenedor) y que Azure se encargue del sistema operativo, parches y balanceo.',
    cuandoUsarlo:
      'Necesitás publicar una nueva versión de una API en producción sin downtime, y además querés un ambiente de staging para validar antes de pasar a producción.',
    datoClave:
      'Los **deployment slots** permiten publicar en un slot de staging y hacer **swap** (intercambio de URLs) con producción de forma casi instantánea y reversible; el **App Service Plan** define el tamaño/SKU (y si soporta autoescalado) y es compartido por varias apps.',
    diagram: `flowchart LR
    DEV[Pipeline CI/CD] -->|deploy| S[Slot: staging]
    S -->|swap| P[Slot: production]
    P --> U[Usuarios]
    PLAN[App Service Plan\\nSKU / instancias] --> S
    PLAN --> P
    AI[Application Insights] -.->|telemetría| P`,
    diagramExplicacion:
      'El pipeline despliega la nueva versión al slot de staging, se valida ahí, y recién después se hace swap con producción sin que el usuario final note downtime. El App Service Plan es el recurso de cómputo subyacente que sostiene ambos slots.',
    faq: [
      {
        pregunta: '¿El swap entre slots es realmente instantáneo o hay algo que se puede romper?',
        respuesta:
          'Es casi instantáneo porque intercambia la configuración de enrutamiento, pero antes ejecuta un "warm-up" de la app en el slot destino. Si la app tarda en arrancar o tiene una migración de datos pendiente, ese warm-up puede fallar o tardar más de lo esperado.',
      },
      {
        pregunta: '¿Los application settings y connection strings viajan con el swap?',
        respuesta:
          'Depende de cómo estén marcados. Si un setting está marcado como "slot-specific", se queda fijo en su slot (útil para que staging apunte a una base de datos de prueba); si no, viaja con el swap.',
      },
      {
        pregunta: '¿Cuántos deployment slots puedo tener y tienen costo aparte?',
        respuesta:
          'La cantidad depende del SKU del App Service Plan (los tiers gratuitos/básicos no tienen slots, Standard para arriba sí con límites crecientes por tier). Los slots no son un recurso separado que se cobre aparte, comparten el mismo plan.',
      },
      {
        pregunta: '¿Puedo escalar un slot de staging independiente de producción?',
        respuesta:
          'No en instancias: todos los slots de un mismo App Service Plan comparten las mismas instancias de cómputo. Si necesitás aislar recursos entre staging y producción, hace falta un plan separado.',
      },
      {
        pregunta: '¿App Service sirve para contenedores o solo para código?',
        respuesta:
          'Sirve para ambos: podés desplegar código directo (runtime administrado) o una imagen de contenedor (Linux o Windows containers), incluso con Docker Compose para multi-contenedor.',
      },
      {
        pregunta: '¿Cómo escala automáticamente App Service ante picos de tráfico?',
        respuesta:
          'Con reglas de autoescalado sobre el App Service Plan (por CPU, memoria, cola, o programadas por horario), similar a un Scale Set pero administrando instancias de la plataforma, no VMs propias.',
      },
      {
        pregunta: '¿Qué pasa si el swap falla a mitad de camino?',
        respuesta:
          'Azure lo trata como una operación que se puede revertir: si algo sale mal, se puede hacer swap de nuevo para volver al estado anterior, siempre que no se hayan tocado los slot-specific settings de forma irreversible.',
      },
    ],
  },
  {
    id: 'vnet-nsg',
    domain: 'Redes',
    title: 'Azure Virtual Network (VNet) y Network Security Groups (NSG)',
    queEs: 'La red privada aislada dentro de Azure (VNet) y las reglas de firewall a nivel de subnet/NIC (NSG).',
    paraQueSirve: 'Segmentar recursos en subredes y controlar qué tráfico entra y sale de cada una.',
    cuandoUsarlo:
      'Necesitás que la subnet de base de datos solo reciba tráfico desde la subnet de la aplicación, y bloquear cualquier acceso directo desde internet.',
    datoClave:
      'Las reglas de NSG se evalúan por **prioridad numérica** (menor número = mayor prioridad) y la primera regla que matchea gana; siempre hay reglas por defecto implícitas (permitir VNet interna, denegar todo lo demás de internet) que se pueden sobrescribir con una regla explícita de mayor prioridad.',
    diagram: `flowchart LR
    I[Internet] -->|tráfico entrante| NSGA[NSG subnet App\\nregla: permitir 443]
    NSGA --> APP[Subnet App]
    APP -->|solo puerto SQL| NSGD[NSG subnet DB\\nregla: permitir desde subnet App]
    NSGD --> DB[Subnet Base de Datos]
    I -.->|bloqueado por NSG| DB`,
    diagramExplicacion:
      'El NSG de la subnet de aplicación deja pasar HTTPS desde internet, pero el NSG de la subnet de base de datos solo permite tráfico que venga de la subnet de aplicación por el puerto de la base de datos, bloqueando cualquier acceso directo desde afuera.',
    faq: [
      {
        pregunta: '¿Un NSG se asocia a la subnet o a la NIC de la VM, y cambia algo si aplico ambos?',
        respuesta:
          'Se puede asociar a cualquiera de los dos. Si hay un NSG en la subnet y otro en la NIC, el tráfico tiene que pasar las reglas de ambos: para entrar se evalúa primero el de la subnet y después el de la NIC, y para salir al revés.',
      },
      {
        pregunta: '¿Cómo conecto dos VNets distintas para que sus recursos se hablen entre sí?',
        respuesta:
          'Con **VNet Peering**, que conecta el tráfico a nivel de red privada de Azure sin pasar por internet. No es transitivo por defecto: si A está peereada con B y B con C, A no le habla a C salvo que se peeree explícitamente o se use un hub central.',
      },
      {
        pregunta: '¿Qué pasa si dos reglas de NSG tienen la misma prioridad?',
        respuesta:
          'No puede pasar: Azure no permite crear dos reglas con el mismo número de prioridad en el mismo NSG, cada una tiene que tener un número único.',
      },
      {
        pregunta: '¿Puedo bloquear tráfico de salida (outbound) a internet con NSG, o necesito Azure Firewall?',
        respuesta:
          'NSG sí puede bloquear salida por IP/puerto con una regla explícita de deny, pero es a nivel red/subnet y no entiende dominios (FQDN) ni inspecciona contenido. Para filtrar por dominio o hacer inspección más fina, se necesita Azure Firewall.',
      },
      {
        pregunta: '¿Las reglas por defecto implícitas de un NSG se pueden borrar?',
        respuesta:
          'No se pueden eliminar, pero se pueden sobrescribir agregando una regla explícita con número de prioridad menor (mayor prioridad) que haga lo contrario.',
      },
      {
        pregunta: '¿Cómo diagnostico por qué un paquete no llega si sospecho que es el NSG?',
        respuesta:
          'Con **Network Watcher**, específicamente la herramienta "IP flow verify" o "NSG diagnostics", que dice exactamente qué regla (y de qué NSG) está permitiendo o bloqueando un flujo puntual.',
      },
      {
        pregunta: '¿Una subnet puede quedar sin ningún NSG asociado?',
        respuesta:
          'Sí, es válido, pero entonces solo aplican las reglas implícitas de Azure (permitir VNet interna y Load Balancer, denegar el resto de internet), sin ningún control adicional propio.',
      },
    ],
  },
  {
    id: 'load-balancer-application-gateway',
    domain: 'Redes',
    title: 'Azure Load Balancer y Application Gateway',
    queEs: 'Dos balanceadores de carga: Load Balancer (capa 4, TCP/UDP) y Application Gateway (capa 7, HTTP/HTTPS con WAF).',
    paraQueSirve:
      'Repartir tráfico entre varias instancias y, en el caso de Application Gateway, aplicar reglas basadas en el contenido HTTP y proteger contra ataques web.',
    cuandoUsarlo:
      'Exponer una app web al público con protección contra SQL injection/XSS y enrutamiento por path (`/api` a un backend, `/app` a otro).',
    datoClave:
      'El **Load Balancer** no entiende HTTP (solo IP/puerto), es más barato y rápido; el **Application Gateway** sí entiende HTTP, soporta **path-based routing**, SSL offloading y trae el módulo **WAF (Web Application Firewall)** basado en reglas OWASP.',
    diagram: `flowchart LR
    U[Usuarios] --> AG[Application Gateway\\n+ WAF]
    AG -->|/api/*| B1[Backend Pool: API]
    AG -->|/app/*| B2[Backend Pool: Web App]
    AG -.->|bloquea| ATK[Tráfico malicioso\\nSQLi / XSS]
    B1 --> LB[Load Balancer interno]
    LB --> V1[VM 1]
    LB --> V2[VM 2]`,
    diagramExplicacion:
      'El Application Gateway recibe todo el tráfico HTTP/HTTPS, filtra ataques conocidos con el WAF y enruta según el path de la URL a distintos backend pools. Dentro de uno de esos pools, un Load Balancer interno de capa 4 reparte la carga entre las VMs.',
    faq: [
      {
        pregunta: '¿Application Gateway hace terminación TLS?',
        respuesta:
          'Sí, puede terminar TLS en el gateway (SSL offloading) y hablar sin cifrar hacia el backend, o volver a cifrar hacia el backend (end-to-end TLS) si el cumplimiento lo exige.',
      },
      {
        pregunta: '¿Puedo tener WAF sin usar Application Gateway completo?',
        respuesta:
          'Sí, existe **Azure Front Door con WAF** para escenarios globales/CDN, y también un WAF standalone en algunos casos. Pero si ya necesitás Application Gateway por el path-based routing, el WAF viene como un modo/SKU sobre el mismo recurso.',
      },
      {
        pregunta: '¿Puedo poner un Load Balancer delante de un Application Gateway, o solo al revés?',
        respuesta:
          'Lo normal es Application Gateway (capa 7) al frente y Load Balancer interno (capa 4) detrás, como en el diagrama. Ponerlo al revés no tiene sentido porque el Load Balancer no entiende HTTP para decidir a qué Application Gateway mandar según el contenido.',
      },
      {
        pregunta:
          '¿Qué pasa si necesito balancear tráfico que no es HTTP/HTTPS, como una base de datos o un protocolo custom?',
        respuesta:
          'Ahí Application Gateway no sirve porque solo entiende HTTP/HTTPS; se usa Load Balancer, que balancea cualquier tráfico TCP/UDP sin mirar el contenido.',
      },
      {
        pregunta: '¿El Application Gateway agrega latencia notable por el WAF?',
        respuesta:
          'Agrega algo de latencia porque inspecciona el request antes de reenviarlo, pero en la práctica es marginal comparado con el tiempo de procesamiento del backend, salvo con reglas WAF muy pesadas o volumen extremo.',
      },
      {
        pregunta: '¿Cómo redirijo HTTP a HTTPS automáticamente?',
        respuesta:
          'Con una **regla de redirección** en el listener HTTP del Application Gateway apuntando al listener HTTPS; es la forma nativa, no requiere lógica en el backend.',
      },
      {
        pregunta: '¿Load Balancer público y Load Balancer interno son el mismo recurso con distinta config?',
        respuesta:
          'Sí, es el mismo tipo de recurso; la diferencia es si la IP frontend es pública (recibe tráfico de internet) o privada (solo accesible dentro de la VNet, como en el diagrama detrás del Application Gateway).',
      },
    ],
  },
  {
    id: 'firewall-vpn-expressroute',
    domain: 'Redes',
    title: 'Azure Firewall, VPN Gateway y ExpressRoute',
    queEs:
      'Tres servicios de conectividad y seguridad perimetral: Firewall (filtrado centralizado saliente/entrante), VPN Gateway (túnel cifrado sobre internet) y ExpressRoute (conexión privada dedicada).',
    paraQueSirve:
      'Conectar de forma segura la red on-premises con Azure, y controlar/filtrar el tráfico que sale o entra de la red virtual.',
    cuandoUsarlo:
      'La empresa tiene un datacenter on-premises y necesita que sus servidores hablen con recursos en Azure como si fuera una sola red, además de bloquear que las VMs salgan a internet salvo a dominios autorizados.',
    datoClave:
      '**VPN Gateway** es más barato pero viaja por internet (cifrado, ancho de banda limitado); **ExpressRoute** es una línea privada dedicada del proveedor (más cara, más estable, sin pasar por internet público); **Azure Firewall** es un firewall centralizado a nivel de red (no por VM) que filtra por FQDN, IP y reglas de red.',
    diagram: `flowchart LR
    ON[Red on-premises] -->|túnel cifrado| VPN[VPN Gateway]
    ON -.->|línea privada dedicada| ER[ExpressRoute]
    VPN --> HUB[VNet Hub]
    ER --> HUB
    HUB --> FW[Azure Firewall\\nreglas FQDN / IP]
    FW -->|tráfico permitido| SPOKE[VNet Spoke\\nrecursos internos]
    FW -.->|bloquea| OUT[Internet no autorizado]`,
    diagramExplicacion:
      'El tráfico desde on-premises llega a Azure por VPN Gateway o ExpressRoute hacia una VNet Hub central. Desde ahí, todo pasa por Azure Firewall antes de llegar a las VNets Spoke con los recursos reales, filtrando lo que no está explícitamente permitido.',
    faq: [
      {
        pregunta: '¿Puedo usar VPN Gateway y ExpressRoute al mismo tiempo?',
        respuesta:
          'Sí, es un patrón común usar ExpressRoute como conexión principal y VPN Gateway como respaldo (failover) si la línea privada tiene un problema, ya que viajan por caminos físicos distintos.',
      },
      {
        pregunta: '¿Azure Firewall reemplaza al NSG o los uso juntos?',
        respuesta:
          'Se usan juntos: NSG filtra a nivel subnet/NIC dentro de una VNet (más granular, más barato), Azure Firewall centraliza el filtrado por FQDN/IP/reglas de red para todo el tráfico que cruza el Hub, típicamente hacia y desde internet u otras VNets.',
      },
      {
        pregunta: '¿Qué diferencia hay entre Azure Firewall y un NVA (Network Virtual Appliance) de terceros?',
        respuesta:
          'Azure Firewall es un servicio PaaS administrado por Azure (sin parchear, con autoescalado); un NVA (como un firewall de Palo Alto o Fortinet) es una VM que vos administrás, con más funciones avanzadas pero también más operación propia.',
      },
      {
        pregunta: '¿ExpressRoute viaja cifrado?',
        respuesta:
          'No por defecto: al ser una línea privada dedicada, no pasa por internet público, pero el tráfico en sí no está cifrado salvo que se agregue cifrado a nivel aplicación o una capa de MACsec/IPsec adicional.',
      },
      {
        pregunta: '¿Qué es la topología hub-spoke y por qué se usa acá?',
        respuesta:
          'Es un diseño donde una VNet Hub central concentra la conectividad (VPN/ExpressRoute) y la seguridad (Firewall), y varias VNets Spoke con los recursos reales se conectan al Hub por peering, evitando que cada Spoke tenga su propia salida a internet sin control.',
      },
      {
        pregunta: '¿Cuánto tarda en levantar un VPN Gateway y puedo cambiarlo después?',
        respuesta:
          'Provisionar un VPN Gateway nuevo tarda entre 30 y 45 minutos porque Azure aprovisiona la infraestructura subyacente. El SKU se puede cambiar después (escalar) sin recrear el túnel, pero implica una breve interrupción.',
      },
      {
        pregunta: '¿Necesito Azure Firewall si ya tengo Application Gateway con WAF?',
        respuesta:
          'Cubren capas distintas: WAF protege tráfico HTTP/HTTPS de aplicación (SQLi, XSS), Azure Firewall filtra a nivel de red/FQDN todo tipo de tráfico saliente y entrante del Hub. En una arquitectura completa suelen convivir los dos.',
      },
    ],
  },
  {
    id: 'storage-accounts',
    domain: 'Datos',
    title: 'Azure Storage Accounts',
    queEs: 'El recurso que agrupa los distintos servicios de almacenamiento de Azure: Blob, Files, Queue y Table.',
    paraQueSirve:
      'Guardar archivos, logs de pipelines, artefactos de build, backups y datos no estructurados con distintos niveles de costo y acceso.',
    cuandoUsarlo:
      'Guardar los artefactos generados por un pipeline de CI, o archivos que se acceden poco pero deben conservarse por compliance, moviéndolos automáticamente a un tier más barato con el tiempo.',
    datoClave:
      'Los **access tiers** de Blob son **Hot** (acceso frecuente, caro por GB/barato por transacción), **Cool** (acceso ocasional) y **Archive** (casi nunca se accede, rehidratar tarda horas); una **lifecycle policy** mueve o borra blobs automáticamente según su antigüedad.',
    diagram: `flowchart LR
    P[Pipeline CI/CD] -->|sube artefacto| H[Blob: Hot tier]
    H -->|regla: 30 días sin acceso| C[Blob: Cool tier]
    C -->|regla: 90 días sin acceso| A[Blob: Archive tier]
    A -->|rehidratación\\nhoras| C
    LC[Lifecycle Management Policy] -.->|mueve automáticamente| H
    LC -.-> C`,
    diagramExplicacion:
      'Un blob nace en el tier Hot cuando se sube. Una lifecycle policy revisa la fecha de último acceso y lo va moviendo solo a Cool y luego a Archive para ahorrar costos, sin que nadie mueva archivos manualmente.',
    faq: [
      {
        pregunta: '¿Cuánto tarda en rehidratarse un blob que está en Archive?',
        respuesta:
          'Depende de la prioridad elegida: **Standard** puede tardar hasta 15 horas, **High priority** promete menos de una hora pero cuesta más. Mientras está en Archive, el blob no se puede leer directamente, hay que rehidratarlo primero.',
      },
      {
        pregunta: '¿Storage Account sirve para guardar archivos que la app lee constantemente, tipo assets de un sitio web?',
        respuesta:
          'Sí, para eso está el tier Hot combinado con un CDN o Azure Front Door delante para cachear cerca del usuario y no pegarle a Storage en cada request.',
      },
      {
        pregunta: '¿Qué diferencia hay entre Blob, Files, Queue y Table dentro de la misma Storage Account?',
        respuesta:
          'Blob es para objetos no estructurados (archivos, imágenes, backups); Files expone un share tipo SMB montable como disco de red; Queue es mensajería simple para desacoplar procesos; Table es una base de datos NoSQL clave-valor básica. Todos comparten la misma cuenta pero son servicios distintos.',
      },
      {
        pregunta: '¿Cómo protejo una Storage Account de acceso público accidental?',
        respuesta:
          'Desactivando el acceso público a nivel de cuenta (o de contenedor) y usando **Private Endpoints** o reglas de firewall de red para que solo ciertas VNets/IPs puedan acceder, en vez de depender de que cada blob esté bien configurado.',
      },
      {
        pregunta: '¿Qué redundancia elijo: LRS, ZRS o GRS?',
        respuesta:
          'LRS replica dentro del mismo datacenter (más barato, sin protección ante caída de zona/región); ZRS replica entre zonas de disponibilidad de la misma región; GRS replica a una región secundaria completa. La elección depende de qué nivel de desastre tenés que tolerar.',
      },
      {
        pregunta: '¿Los artefactos de un pipeline de CI deben ir a Hot o Cool?',
        respuesta:
          'Normalmente Hot mientras el pipeline los usa activamente (build reciente, deploy en curso), y una lifecycle policy los baja a Cool o Archive después de unos días si nadie los descarga, sin intervención manual.',
      },
      {
        pregunta: '¿Puedo revertir una lifecycle policy si moví algo a Archive por error?',
        respuesta:
          'Sí, se puede rehidratar manualmente de vuelta a Hot o Cool, pero hay que pagar el costo y el tiempo de rehidratación; no es instantáneo ni gratis deshacerlo.',
      },
    ],
  },
  {
    id: 'sql-database',
    domain: 'Datos',
    title: 'Azure SQL Database',
    queEs: 'Base de datos relacional PaaS totalmente administrada (motor SQL Server sin gestionar el servidor).',
    paraQueSirve: 'Alojar la base de datos de una app sin encargarte de parches, backups ni alta disponibilidad del motor.',
    cuandoUsarlo:
      'Necesitás garantizar que ante una caída de un datacenter la base de datos siga disponible en otra región, y que los backups se restauren a un punto exacto en el tiempo sin configurar nada manual.',
    datoClave:
      'El **Point-in-Time Restore (PITR)** permite restaurar la base a cualquier momento dentro del período de retención (por defecto 7 días) sin backups manuales; **Auto-failover groups** replican a una región secundaria y hacen failover automático si la primaria cae, cambiando el DNS de forma transparente para la app.',
    diagram: `flowchart LR
    APP[Aplicación] -->|listener DNS| PRI[SQL Database\\nPrimaria - Región A]
    PRI -->|replicación continua| SEC[SQL Database\\nSecundaria - Región B]
    PRI -.->|backup automático| BK[(Backups\\nretención 7-35 días)]
    PRI -->|caída detectada| FO[Auto-failover Group]
    FO -->|promueve| SEC
    SEC -->|nuevo listener| APP`,
    diagramExplicacion:
      'La app siempre apunta a un endpoint lógico (listener) que el Auto-failover Group redirige a la base primaria activa. Si la región primaria cae, el failover group promueve la secundaria automáticamente y redirige el tráfico sin que la app cambie su connection string.',
    faq: [
      {
        pregunta: '¿Un Auto-failover Group reemplaza la necesidad de tener backups?',
        respuesta:
          'No, son cosas distintas: el failover group te da disponibilidad si cae la región (RPO/RTO bajos), pero no te protege de un `DELETE` o `DROP TABLE` accidental replicado a la secundaria en segundos. Para eso está el PITR.',
      },
      {
        pregunta: '¿Puedo restaurar solo una tabla con Point-in-Time Restore, o siempre es la base completa?',
        respuesta:
          'El PITR siempre restaura la base completa a un momento dado, y encima como una base **nueva** (no sobrescribe la original). Si solo necesitás una tabla, hay que restaurar aparte y copiar los datos puntuales desde ahí.',
      },
      {
        pregunta: '¿Azure SQL Database es lo mismo que SQL Server en una VM?',
        respuesta:
          'No. Azure SQL Database es PaaS: Microsoft administra parches, HA y backups del motor. SQL Server en VM es IaaS: vos administrás el sistema operativo y el motor completo, con más control pero más trabajo operativo.',
      },
      {
        pregunta: '¿Qué pasa con las conexiones activas durante un failover?',
        respuesta:
          'Se cortan y la aplicación tiene que reconectar; por eso el driver/cliente debe tener lógica de retry con backoff, porque el cambio de DNS del listener no es instantáneo para todos los clientes.',
      },
      {
        pregunta: '¿El tier sin servidor (Serverless) sirve para producción?',
        respuesta:
          'Sirve para cargas con tráfico intermitente o impredecible, porque pausa la base y cobra por uso cuando no hay actividad. Para producción con tráfico constante, un tier provisionado (vCore) suele ser más previsible en costo y performance.',
      },
      {
        pregunta: '¿Cómo escalo Azure SQL Database ante más carga sin downtime?',
        respuesta:
          'Cambiando el tier de servicio (DTU o vCore) hacia arriba; es una operación online en la mayoría de los casos, aunque implica una breve reconexión al final del proceso.',
      },
      {
        pregunta: '¿La retención de backups se puede extender más allá de los 7-35 días por defecto?',
        respuesta:
          'Sí, con **Long-Term Retention (LTR)** se pueden guardar backups semanales/mensuales/anuales por hasta 10 años, útil para requisitos de compliance que superan la retención estándar.',
      },
    ],
  },
  {
    id: 'entra-id-rbac',
    domain: 'Identidad y Gobernanza',
    title: 'Microsoft Entra ID y RBAC',
    queEs: 'El servicio de identidad de Azure (antes Azure AD) y el modelo de control de acceso basado en roles (RBAC).',
    paraQueSirve: 'Autenticar usuarios/servicios y definir con precisión qué puede hacer cada uno sobre qué recurso.',
    cuandoUsarlo:
      'Un pipeline de CI/CD necesita desplegar recursos en una suscripción sin usar credenciales de usuario ni secretos hardcodeados, y con el mínimo permiso necesario.',
    datoClave:
      'Una **Managed Identity** le da identidad en Entra ID a un recurso (VM, App Service, pipeline) sin manejar contraseñas ni secretos; el **RBAC** se asigna en un scope (Management Group, Subscription, Resource Group o Resource) y siempre se debe aplicar el **principio de menor privilegio** en el scope más chico posible.',
    diagram: `flowchart LR
    PIPE[Pipeline / Service Principal] -->|se autentica sin secreto| MI[Managed Identity]
    MI -->|solicita token| ENTRA[Microsoft Entra ID]
    ENTRA -->|emite token| MI
    MI -->|token + rol asignado| RBAC[Asignación RBAC\\nscope: Resource Group]
    RBAC -->|permiso: Contributor| RG[Resource Group\\nrecursos a desplegar]`,
    diagramExplicacion:
      'El pipeline usa una Managed Identity para autenticarse contra Entra ID sin guardar ninguna contraseña. Entra ID emite un token, y ese token solo sirve para hacer lo que la asignación RBAC le permite en el scope exacto donde fue asignada (por ejemplo, solo ese Resource Group).',
    faq: [
      {
        pregunta:
          '¿Cuál es la diferencia entre una Managed Identity asignada por el sistema (system-assigned) y una asignada por el usuario (user-assigned)?',
        respuesta:
          'La system-assigned nace y muere con el recurso (si borrás la VM, se borra la identidad); la user-assigned es un recurso independiente que se puede asignar a varios recursos a la vez y sobrevive aunque borres uno de ellos.',
      },
      {
        pregunta: '¿RBAC y Azure Policy hacen lo mismo?',
        respuesta:
          'No. RBAC controla **quién puede hacer qué** (permisos de acciones); Azure Policy controla **qué configuraciones son válidas** en los recursos, independientemente de quién los cree. Son complementarios, no sustitutos.',
      },
      {
        pregunta:
          '¿Un rol asignado en el Resource Group también aplica a los recursos que ya existen dentro, o solo a los nuevos?',
        respuesta:
          'Aplica a todos, existentes y nuevos, porque el scope es jerárquico: el permiso se hereda hacia abajo desde el momento en que se asigna, sin importar cuándo se creó el recurso.',
      },
      {
        pregunta: '¿Puedo crear un rol custom si los roles integrados (Owner, Contributor, Reader) son demasiado amplios?',
        respuesta:
          'Sí, con un **custom role** definís exactamente qué acciones (`Microsoft.Compute/virtualMachines/start/action`, por ejemplo) permitir, aplicando principio de menor privilegio con precisión quirúrgica.',
      },
      {
        pregunta: '¿Qué pasa si asigno el mismo rol en dos scopes distintos, por ejemplo Subscription y Resource Group?',
        respuesta:
          'Los permisos son acumulativos: RBAC en Azure no tiene "deny" explícito por defecto (salvo Deny Assignments, un mecanismo aparte), así que el usuario termina con la unión de todo lo asignado en cualquier nivel de la jerarquía.',
      },
      {
        pregunta: '¿Una Managed Identity sirve para autenticar hacia servicios fuera de Azure, como una API externa?',
        respuesta:
          'No directamente. La Managed Identity obtiene tokens de Entra ID válidos para recursos de Azure (o apps registradas en Entra ID); si el servicio externo no valida tokens de Entra ID, hace falta otro mecanismo de autenticación.',
      },
      {
        pregunta: '¿Cómo audito quién tiene acceso Owner en una suscripción completa?',
        respuesta:
          'Con **Access Reviews** de Entra ID o consultando las asignaciones RBAC vía Azure Resource Graph/CLI, filtrando por rol y scope; es buena práctica revisar esto periódicamente, no solo al asignarlo.',
      },
    ],
  },
  {
    id: 'devops-pipelines-repos-boards',
    domain: 'DevOps y Operaciones',
    title: 'Azure DevOps: Pipelines, Repos y Boards',
    queEs:
      'La suite de Microsoft para gestionar el ciclo completo de desarrollo: repositorios Git (Repos), CI/CD (Pipelines) y gestión de trabajo (Boards).',
    paraQueSirve: 'Automatizar el build, test y despliegue de una aplicación, y trackear el trabajo del equipo en un solo lugar.',
    cuandoUsarlo:
      'Cada vez que alguien hace push a `main`, se necesita compilar, correr tests, y desplegar automáticamente a un ambiente de staging, con aprobación manual antes de pasar a producción.',
    datoClave:
      'Un **YAML pipeline** define stages/jobs/steps versionados junto al código; los **environments** con **approval gates** frenan el pipeline antes de pasar a un ambiente crítico hasta que alguien apruebe manualmente; los **service connections** son la forma segura de darle al pipeline acceso a Azure/otros servicios.',
    diagram: `flowchart LR
    DEV[Push a main] --> CI[Stage: Build + Test]
    CI -->|artefacto| CD1[Stage: Deploy Staging]
    CD1 --> G{Approval Gate}
    G -->|aprobado| CD2[Stage: Deploy Production]
    G -->|rechazado| STOP[Pipeline detenido]
    SC[Service Connection] -.->|credenciales| CD1
    SC -.-> CD2`,
    diagramExplicacion:
      'El push dispara el build y los tests; si pasan, se despliega a staging. Antes de tocar producción, el pipeline se detiene en un approval gate esperando que una persona autorizada apruebe manualmente el paso siguiente.',
    faq: [
      {
        pregunta: '¿Azure Pipelines es lo mismo que GitHub Actions?',
        respuesta:
          'Son competidores con conceptos parecidos (stages/jobs/steps vs. workflows/jobs/steps), pero no son intercambiables directamente. Azure Pipelines suele elegirse cuando ya se usa Azure DevOps para Repos/Boards o hay integración fuerte con Azure.',
      },
      {
        pregunta: '¿Un service connection guarda la contraseña en el pipeline YAML?',
        respuesta:
          'No, el secreto vive cifrado dentro del service connection en Azure DevOps, y el YAML solo referencia su nombre. Nadie con acceso de lectura al repo ve la credencial real.',
      },
      {
        pregunta: '¿Puedo usar el mismo pipeline YAML para varios ambientes (dev/staging/prod)?',
        respuesta:
          'Sí, con **templates** y **variables/variable groups** parametrizados por ambiente, evitando duplicar el YAML; el approval gate se configura a nivel del `environment`, no del pipeline en sí.',
      },
      {
        pregunta: '¿Qué pasa si dos personas hacen push casi al mismo tiempo, se corren dos pipelines en paralelo?',
        respuesta:
          'Depende de la configuración de `trigger` y de los límites de concurrencia (parallel jobs) de la organización; por defecto pueden correr en paralelo, pero se puede forzar con `resources.repositories` o política de branch para serializar.',
      },
      {
        pregunta: '¿Los Boards de Azure DevOps reemplazan a Jira?',
        respuesta:
          'Cubre lo mismo a grandes rasgos (work items, sprints, tableros Kanban), y muchos equipos lo eligen justamente para tener todo (código, CI/CD y gestión de trabajo) en una sola herramienta en vez de integrar Jira por separado.',
      },
      {
        pregunta: '¿Cómo evito que alguien mergee a `main` sin pasar por pull request?',
        respuesta:
          'Con una **branch policy** en Repos que exija pull request, un mínimo de reviewers y que el build de CI pase en verde antes de habilitar el botón de completar el merge.',
      },
      {
        pregunta: '¿El approval gate puede ser automático en vez de manual?',
        respuesta:
          'El approval clásico es manual, pero se pueden combinar **checks** automáticos (por ejemplo, una query de Azure Monitor que valide que no hay errores en staging) además o en lugar de la aprobación humana, según el nivel de confianza que se necesite.',
      },
    ],
  },
  {
    id: 'arm-bicep',
    domain: 'DevOps y Operaciones',
    title: 'ARM / Bicep — Infraestructura como Código',
    queEs:
      'Los lenguajes declarativos para definir infraestructura de Azure como archivos versionables: ARM (JSON) y Bicep (sintaxis simplificada que compila a ARM).',
    paraQueSirve: 'Crear y actualizar recursos de Azure de forma reproducible y auditable, en vez de clickear en el portal.',
    cuandoUsarlo:
      'Necesitás que el mismo entorno (VNet, App Service, base de datos) se pueda recrear idéntico en dev, staging y producción, y que cualquier cambio de infraestructura pase por code review como el código de la app.',
    datoClave:
      'Los despliegues son **idempotentes**: aplicar el mismo template dos veces no duplica recursos, solo actualiza lo que cambió. El modo **incremental** (default) solo toca lo que está en el template; el modo **complete** borra del Resource Group todo lo que no esté declarado en el template — hay que usarlo con mucho cuidado.',
    diagram: `flowchart LR
    DEV[Archivo .bicep\\nen el repo] -->|git push| PR[Pull Request\\ncode review]
    PR -->|merge| PIPE[Pipeline CI/CD]
    PIPE -->|az deployment| ARM[ARM: valida y compila]
    ARM -->|modo incremental| RG[Resource Group]
    RG --> R1[Recurso: VNet]
    RG --> R2[Recurso: App Service]
    RG --> R3[Recurso: SQL DB]`,
    diagramExplicacion:
      'El archivo Bicep vive en el repo y pasa por code review como cualquier código. El pipeline lo despliega vía ARM, que compara el template contra el estado actual del Resource Group y solo crea o actualiza lo necesario, sin tocar lo que no cambió.',
    faq: [
      {
        pregunta: '¿Bicep y Terraform hacen lo mismo, cuándo elegir uno u otro?',
        respuesta:
          'Ambos son IaC declarativo. Bicep es específico de Azure y sin estado propio (ARM resuelve el estado consultando los recursos reales); Terraform es multi-cloud y mantiene un archivo de estado propio que hay que gestionar. Si todo es Azure, Bicep evita esa complejidad extra del state file.',
      },
      {
        pregunta: '¿Qué pasa si alguien cambia un recurso a mano desde el portal después de desplegarlo con Bicep?',
        respuesta:
          'El siguiente despliegue en modo incremental no revierte el cambio automáticamente salvo que la propiedad modificada esté explícitamente declarada en el template, en cuyo caso el próximo `deployment` la vuelve a fijar como dice el archivo. Esto se llama **configuration drift**.',
      },
      {
        pregunta: '¿Cómo prueba un DevOps un cambio de Bicep antes de aplicarlo en producción?',
        respuesta:
          'Con `az deployment what-if`, que simula el despliegue y muestra qué recursos se crearían, modificarían o (en modo complete) borrarían, sin ejecutar el cambio real.',
      },
      {
        pregunta: '¿El modo complete borra recursos aunque no tenga nada que ver con lo que estoy desplegando?',
        respuesta:
          'Sí, y es el error más común: borra **todo lo que no está declarado en el template dentro de ese Resource Group**, aunque sea un recurso creado a mano sin relación con el despliegue actual. Por eso se recomienda un Resource Group dedicado por template si se usa modo complete.',
      },
      {
        pregunta: '¿Puedo reutilizar código Bicep entre distintos proyectos o ambientes?',
        respuesta:
          'Sí, con **módulos** Bicep (archivos `.bicep` separados que se referencian desde el template principal) y archivos de parámetros distintos por ambiente (`dev.bicepparam`, `prod.bicepparam`).',
      },
      {
        pregunta: '¿Bicep necesita que instale algo especial en el pipeline?',
        respuesta:
          'La CLI de Azure (`az`) ya trae el compilador de Bicep integrado desde hace tiempo, así que no hace falta instalar una herramienta aparte en la mayoría de los pipelines.',
      },
      {
        pregunta: '¿Qué pasa si el template de Bicep tiene un error de sintaxis en producción a mitad de despliegue?',
        respuesta:
          'ARM valida el template antes de ejecutar ningún cambio (fase de validación previa), así que un error de sintaxis normalmente frena el despliegue completo antes de tocar ningún recurso, no lo deja a mitad de camino.',
      },
    ],
  },
  {
    id: 'monitor-log-analytics',
    domain: 'DevOps y Operaciones',
    title: 'Azure Monitor y Log Analytics',
    queEs: 'La plataforma central de observabilidad de Azure: métricas, logs y alertas de todos los recursos.',
    paraQueSirve: 'Saber en tiempo real si algo está fallando y recibir un aviso antes de que el usuario final lo note.',
    cuandoUsarlo:
      'Necesitás que el equipo reciba una notificación (mail, Teams, SMS) apenas la tasa de errores 5xx de una API supere un umbral, sin tener que estar mirando dashboards todo el día.',
    datoClave:
      'Los datos van a un **Log Analytics Workspace** y se consultan con **KQL (Kusto Query Language)**; una **alert rule** define una condición sobre una métrica o una query de logs, y un **action group** define qué hacer cuando se dispara (email, webhook, Teams, Azure Function).',
    diagram: `flowchart LR
    R[Recursos: VMs, App Service, SQL] -->|logs y métricas| LAW[(Log Analytics\\nWorkspace)]
    LAW -->|consulta KQL| ALERT[Alert Rule\\ncondición: 5xx > umbral]
    ALERT -->|se dispara| AG[Action Group]
    AG --> MAIL[Email / SMS]
    AG --> TEAMS[Teams / Webhook]
    AG --> FUNC[Azure Function\\nremediación automática]`,
    diagramExplicacion:
      'Todos los recursos mandan sus logs y métricas al Log Analytics Workspace. Una alert rule consulta ese workspace en base a una condición; si se cumple, dispara un action group que notifica al equipo o incluso ejecuta una remediación automática.',
    faq: [
      {
        pregunta: '¿Cuál es la diferencia entre una alerta basada en métrica y una basada en log/KQL?',
        respuesta:
          'La de métrica evalúa un valor numérico casi en tiempo real (baja latencia, ideal para CPU/memoria); la basada en log corre una query KQL sobre el Log Analytics Workspace cada cierto intervalo, más flexible pero con más latencia (minutos).',
      },
      {
        pregunta: '¿Cuánto cuesta mandar todos los logs a Log Analytics?',
        respuesta:
          'Se cobra por GB ingerido y por retención más allá del período gratuito (normalmente 31 días). Por eso conviene filtrar qué se manda (no todos los logs de diagnóstico al máximo detalle) y ajustar la retención según necesidad real, no dejarlo en default sin pensar.',
      },
      {
        pregunta: '¿Application Insights es lo mismo que Azure Monitor?',
        respuesta:
          'Application Insights es una parte de Azure Monitor especializada en **APM** (Application Performance Monitoring): trazas distribuidas, dependencias, tiempos de respuesta a nivel de código. Azure Monitor es el paraguas completo que incluye métricas de infraestructura, logs y alertas.',
      },
      {
        pregunta: '¿Puedo usar Azure Monitor para hacer auto-remediación sin que una persona intervenga?',
        respuesta:
          'Sí, un action group puede disparar una Azure Function, un Logic App o un webhook que ejecute una acción correctiva (por ejemplo, reiniciar un servicio o escalar recursos) sin esperar a que alguien lea el mail.',
      },
      {
        pregunta: '¿Qué retención de logs necesito para cumplir una auditoría de compliance?',
        respuesta:
          'Depende del requisito específico, pero cuando se necesita más que la retención estándar del workspace, se exportan los logs a una Storage Account con una lifecycle policy propia para guardarlos más tiempo a menor costo.',
      },
      {
        pregunta: '¿Cómo evito que una alerta se dispare en bucle por el mismo incidente?',
        respuesta:
          'Configurando el período de evaluación y el "mute period" (o usando **alert processing rules**) para suprimir notificaciones repetidas del mismo problema mientras ya está siendo atendido.',
      },
      {
        pregunta: '¿KQL es parecido a SQL?',
        respuesta:
          'Es parecido en el sentido de que filtra y agrupa datos, pero la sintaxis es de pipeline (`| where`, `| summarize`, `| project`) en vez de `SELECT ... FROM ... WHERE`, así que no es intercambiable directamente para alguien que solo sabe SQL.',
      },
    ],
  },
  {
    id: 'policy-management-groups',
    domain: 'Identidad y Gobernanza',
    title: 'Azure Policy y Management Groups',
    queEs:
      'Azure Policy aplica reglas de cumplimiento sobre los recursos; los Management Groups agrupan suscripciones en una jerarquía para gobernar varias a la vez.',
    paraQueSirve:
      'Forzar estándares de la organización (regiones permitidas, SKUs permitidos, tags obligatorios) sin depender de que cada persona los recuerde.',
    cuandoUsarlo:
      'La empresa exige que ningún recurso se cree fuera de dos regiones autorizadas, y que todo recurso tenga un tag de `costCenter`, aplicado automáticamente a todas las suscripciones del área.',
    datoClave:
      'Las policies tienen efectos como **Deny** (bloquea la creación), **Audit** (permite pero marca como no cumplido) y **Append/Modify** (agrega o corrige un valor, como un tag, automáticamente); se asignan en un scope y se heredan hacia abajo en la jerarquía de Management Group → Subscription → Resource Group.',
    diagram: `flowchart LR
    MG[Management Group\\nEmpresa] -->|asigna policy| SUB1[Subscription Dev]
    MG -->|asigna policy| SUB2[Subscription Prod]
    POL[Policy: regiones permitidas\\n+ tag obligatorio] -.->|efecto Deny| SUB1
    POL -.->|efecto Deny| SUB2
    SUB1 -->|intento fuera de región| BLOQ[Creación bloqueada]
    SUB2 -->|recurso sin tag| APPEND[Tag agregado automáticamente]`,
    diagramExplicacion:
      'La policy se asigna una sola vez en el Management Group y se hereda a todas las suscripciones debajo. Si alguien intenta crear un recurso en una región no permitida, Azure Policy lo bloquea (Deny); si falta un tag, lo puede agregar solo (Append).',
    faq: [
      {
        pregunta: '¿Qué pasa con los recursos que ya existían antes de asignar la policy?',
        respuesta:
          'No se bloquean retroactivamente (Deny solo actúa en creación/actualización), pero quedan marcados como **non-compliant** en el reporte de cumplimiento. Para corregirlos se necesita una **remediation task**, que aplica el efecto (por ejemplo Append) sobre lo ya existente.',
      },
      {
        pregunta:
          '¿Puedo excluir una suscripción o Resource Group puntual de una policy asignada más arriba en la jerarquía?',
        respuesta:
          'Sí, con un **exclusion** en el scope de la asignación, o creando una asignación de excepción en un nivel más específico que la excluya explícitamente, aunque hay que documentar bien por qué para no generar drift de gobernanza.',
      },
      {
        pregunta: '¿Cuál es la diferencia entre una Policy y una Initiative (Policy Set)?',
        respuesta:
          'Una Policy es una regla individual; una **Initiative** agrupa varias policies relacionadas (por ejemplo, todo el set de controles de un estándar como CIS o NIST) para asignarlas juntas como una sola unidad de cumplimiento.',
      },
      {
        pregunta: '¿Azure Policy me puede impedir borrar un recurso, no solo crearlo?',
        respuesta:
          'Sí, con el efecto **Deny** también se puede bloquear la eliminación si la condición de la policy lo contempla, aunque el uso más común es prevenir creación fuera de estándar.',
      },
      {
        pregunta: '¿Qué pasa si dos policies en distintos niveles de Management Group se contradicen?',
        respuesta:
          'Gana la más restrictiva: si cualquier policy en la jerarquía dice Deny, el recurso se bloquea, sin importar que otra en un nivel distinto lo permita. No hay forma de que un nivel más bajo "desautorice" un Deny heredado de arriba salvo exclusión explícita.',
      },
      {
        pregunta: '¿Cómo pruebo una policy nueva sin arriesgarme a bloquear despliegues en producción?',
        respuesta:
          'Asignándola primero en efecto **Audit** (o **DeployIfNotExists** en modo de prueba) para ver qué recursos matchearían, y recién después de validar el impacto cambiarla a **Deny**.',
      },
      {
        pregunta: '¿Management Groups sirve solo para Policy o también para RBAC?',
        respuesta:
          'Sirve para ambos: es un scope válido para asignar tanto Azure Policy como roles RBAC, por eso es el nivel más alto de gobernanza cuando hay varias suscripciones que administrar de forma centralizada.',
      },
    ],
  },
  {
    id: 'backup-site-recovery',
    domain: 'DevOps y Operaciones',
    title: 'Azure Backup y Site Recovery',
    queEs:
      'Azure Backup respalda datos/VMs; Azure Site Recovery (ASR) replica cargas completas a otra región para recuperación ante desastres (DR).',
    paraQueSirve:
      'Poder restaurar datos borrados/corruptos (Backup) o levantar toda una carga de trabajo en otra región si la región primaria cae por completo (Site Recovery).',
    cuandoUsarlo:
      'La empresa exige un plan de recuperación ante desastres: si la región primaria se cae completamente, las VMs críticas deben poder arrancar en otra región en minutos, no días.',
    datoClave:
      'Azure Backup trabaja con **Recovery Services Vault** y políticas de retención (diaria/semanal/mensual); Site Recovery replica continuamente el disco de la VM a la región secundaria y define un **RPO** (cuánta data se puede perder) y un **RTO** (cuánto tarda en levantar) medidos en el plan de DR — no son lo mismo que un backup.',
    diagram: `flowchart LR
    VM[VM en Región A] -->|snapshot programado| RSV[(Recovery Services Vault)]
    VM -->|replicación continua| ASR[Site Recovery]
    ASR --> VMR[VM réplica\\nRegión B - apagada]
    RSV -->|restaurar punto en el tiempo| VM
    D{Región A caída} -->|failover| ASR
    ASR -->|enciende| VMR`,
    diagramExplicacion:
      'El Recovery Services Vault guarda snapshots periódicos para restaurar archivos o discos puntuales. En paralelo, Site Recovery replica continuamente el disco entero a una VM apagada en la región secundaria; si la región primaria cae, un failover la enciende con los datos casi al día.',
    faq: [
      {
        pregunta: '¿Necesito Site Recovery si ya tengo Backup configurado?',
        respuesta:
          'Depende del objetivo: Backup te recupera datos borrados o corruptos, pero si cae la región entera tenés que restaurar y provisionar VMs desde cero, lo cual tarda horas o días. Site Recovery ya tiene la réplica lista para encender en minutos. Para RTO bajo, se necesitan los dos.',
      },
      {
        pregunta: '¿Cuánta diferencia hay entre RPO y RTO en términos prácticos?',
        respuesta:
          'RPO es cuántos datos perdés (por ejemplo, "5 minutos de replicación" significa que en el peor caso perdés los últimos 5 minutos de escritura); RTO es cuánto tarda el sistema en volver a estar arriba después del desastre. Son dos números distintos que hay que definir por separado según el negocio.',
      },
      {
        pregunta: '¿Site Recovery replica en tiempo real o hay demora?',
        respuesta:
          'Replica de forma casi continua pero no es sincrónica: hay un pequeño delay entre el disco primario y la réplica, que es justamente lo que determina el RPO real alcanzable.',
      },
      {
        pregunta: '¿Puedo probar un failover sin afectar la carga de producción?',
        respuesta:
          'Sí, con un **Test Failover**, que levanta la VM réplica en una red aislada para validar que todo funciona, sin tocar la VM primaria ni el tráfico real.',
      },
      {
        pregunta: '¿El Recovery Services Vault puede estar en otra región distinta a la VM que protege?',
        respuesta:
          'El vault debe estar en la misma región que los recursos que respalda para Backup; para Site Recovery, en cambio, la configuración necesariamente involucra dos regiones (origen y destino) porque el objetivo es justamente la redundancia geográfica.',
      },
      {
        pregunta: '¿Qué pasa con el costo de tener una VM réplica apagada todo el tiempo?',
        respuesta:
          'Se paga por el almacenamiento replicado y algo de cómputo mínimo, pero no el costo pleno de una VM corriendo, ya que la réplica está apagada hasta que se dispara un failover real o de prueba.',
      },
      {
        pregunta: '¿Cómo restauro un solo archivo sin levantar la VM completa?',
        respuesta:
          'Con **file-level recovery** desde un punto de restauración de Azure Backup, que monta el disco del snapshot y permite copiar archivos puntuales sin restaurar la VM entera.',
      },
    ],
  },
  {
    id: 'cost-management-tags',
    domain: 'Identidad y Gobernanza',
    title: 'Azure Cost Management y Tags',
    queEs:
      'El conjunto de herramientas para monitorear, presupuestar y atribuir el gasto en Azure, usando etiquetas (tags) como metadata de los recursos.',
    paraQueSirve: 'Saber cuánto gasta cada equipo/proyecto y recibir una alerta antes de que el gasto se salga de presupuesto.',
    cuandoUsarlo:
      'Finanzas pide saber cuánto cuesta cada proyecto por separado dentro de la misma suscripción, y quiere un aviso automático si el gasto mensual supera el presupuesto asignado.',
    datoClave:
      'Los **tags** (como `costCenter` o `project`) permiten filtrar el gasto en Cost Analysis por equipo/proyecto sin necesidad de una suscripción separada por cada uno; un **Budget** dispara alertas por umbral de porcentaje gastado y puede combinarse con una Azure Policy que fuerce el tag como obligatorio.',
    diagram: `flowchart LR
    R1[Recurso: VM\\ntag project=A] --> CA[Cost Analysis]
    R2[Recurso: SQL DB\\ntag project=B] --> CA
    CA -->|agrupa por tag| REP[Reporte por proyecto]
    BUD[Budget mensual] -->|80% gastado| ALERT[Alerta automática]
    POL[Azure Policy: tag obligatorio] -.->|fuerza| R1
    POL -.-> R2`,
    diagramExplicacion:
      'Cada recurso lleva un tag de proyecto (forzado por Azure Policy). Cost Analysis agrupa el gasto real por ese tag para saber cuánto consume cada proyecto, y un Budget configurado sobre esa suscripción dispara una alerta automática al superar un porcentaje del monto asignado.',
    faq: [
      {
        pregunta: '¿Un Budget bloquea el gasto automáticamente al llegar al 100%, o solo avisa?',
        respuesta:
          'Por defecto solo notifica (no detiene nada); si se necesita frenar el gasto de verdad, hay que combinarlo con una automatización propia (por ejemplo, una Azure Function disparada por la alerta que apague recursos o revoque permisos de creación).',
      },
      {
        pregunta: '¿Qué pasa si un recurso no soporta tags?',
        respuesta:
          'Algunos recursos o subrecursos no permiten tags (o los heredan de su padre en vez de tener los propios), así que el costo de esos casos puede quedar sin atribuir correctamente por proyecto; hay que revisarlo caso por caso en Cost Analysis.',
      },
      {
        pregunta: '¿Cómo obligo a que nadie cree un recurso sin el tag `costCenter`?',
        respuesta:
          'Con una Azure Policy en efecto **Deny** (bloquea la creación si falta el tag) o **Append/Modify** (lo agrega automáticamente con un valor default), asignada a nivel Management Group para que aplique a todas las suscripciones.',
      },
      {
        pregunta: '¿Los tags tienen algún costo o límite?',
        respuesta:
          'No tienen costo propio, pero sí límites: hasta 50 tags por recurso y restricciones de longitud en nombre/valor, así que conviene definir una convención de nomenclatura chica y consistente en vez de usar tags libremente.',
      },
      {
        pregunta: '¿Cost Management sirve para comparar el gasto entre distintas suscripciones o solo dentro de una?',
        respuesta:
          'Sirve para ambos casos si las suscripciones están bajo el mismo Management Group o Enterprise Agreement/tenant, agregando el gasto de todas en una sola vista con **scopes** más amplios.',
      },
      {
        pregunta: '¿Puedo ver cuánto va a costar un recurso antes de crearlo?',
        respuesta:
          'Sí, con la **Pricing Calculator** de Azure se puede estimar el costo antes del despliegue; una vez creado, Cost Analysis muestra el gasto real, que puede diferir de la estimación según uso real.',
      },
      {
        pregunta: '¿Qué diferencia hay entre un Budget y una Reservation o Savings Plan?',
        respuesta:
          'El Budget solo alerta sobre el gasto, no lo reduce. Las **Reservations** y **Savings Plans** son compromisos de uso a 1-3 años que bajan el costo por unidad a cambio de comprometerse con un volumen mínimo; son estrategias de ahorro, no de monitoreo.',
      },
    ],
  },
]

export default devopsWikiContent
