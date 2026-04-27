(() => {
const routeSteps = [
  {
    id: "start",
    segment: "Castex",
    title: "Salida desde estacionamiento",
    kicker: "Punto de partida",
    description:
      "Salí desde Castex 3671 y avanzá por Castex hasta el primer cruce importante del circuito.",
    progressLabel: "Salida desde estacionamiento",
    prompt: "Salí por Castex y preparate para el primer giro del recorrido.",
    correctAction: "straight",
    speedHint: "10 km/h",
    address: "Castex 3671, C1425 CABA, Argentina",
    trigger: {
      lat: -34.57618,
      lng: -58.40746,
    },
    streetView: {
      lat: -34.57618,
      lng: -58.40746,
      heading: 28,
      pitch: -2,
      zoom: 1,
    },
    cue: {
      farTitle: "Segui por Castex",
      farText: "Avanzá por Castex hasta llegar a Av. Casares.",
      nearTitle: "Dobla a la derecha en Av. Casares",
      nearText: "Primer hito real del circuito. En esta esquina el recorrido gira a la derecha.",
    },
    alerts: [
      {
        type: "note",
        title: "Chequeo inicial",
        body: "Mirar espejos, verificar peatones, señalizar y salir suave.",
      },
    ],
    point: { x: 102, y: 290 },
    mapPoint: {
      lat: -34.57618,
      lng: -58.40746,
    },
  },
  {
    id: "turn-casares",
    segment: "Av. Casares",
    title: "Primer giro",
    kicker: "Hito 1",
    description:
      "Cuando llegás al cruce de Castex con Av. Casares, el recorrido pide doblar a la derecha.",
    progressLabel: "Castex -> Av. Casares",
    prompt: "En Castex y Av. Casares, doblá a la derecha.",
    correctAction: "right",
    speedHint: "20 km/h",
    address: "Castex y Avenida Casares, CABA, Argentina",
    trigger: {
      lat: -34.57559844243096,
      lng: -58.408456624395974,
    },
    streetView: {
      lat: -34.57191,
      lng: -58.41289,
      heading: 300,
      pitch: -1,
      zoom: 1,
    },
    cue: {
      farTitle: "Acercate a Av. Casares",
      farText: "Seguís por Castex. El próximo giro correcto es a la derecha.",
      nearTitle: "Dobla a la derecha en Av. Casares",
      nearText: "Tomá Av. Casares y seguí hasta la primera esquina.",
    },
    alerts: [
      {
        type: "traffic-light",
        title: "Cruce relevante",
        body: "Revisá semáforo, peatones y senda peatonal antes de girar.",
      },
    ],
    point: { x: 138, y: 234 },
    mapPoint: {
      lat: -34.57558,
      lng: -58.40848,
    },
  },
  {
    id: "turn-gelly",
    segment: "Gelly",
    title: "Segundo giro",
    kicker: "Hito 2",
    description:
      "Ya sobre Av. Casares, en la primera esquina el circuito gira a la derecha por Gelly.",
    progressLabel: "Av. Casares -> Gelly",
    prompt: "En la primera esquina de Av. Casares, doblá a la derecha por Gelly.",
    correctAction: "right",
    speedHint: "20 km/h",
    address: "Avenida Casares y Gelly, CABA, Argentina",
    trigger: {
      lat: -34.57501597057818,
      lng: -58.40794151343924,
    },
    streetView: {
      lat: -34.57123,
      lng: -58.41195,
      heading: 34,
      pitch: -1,
      zoom: 1,
    },
    cue: {
      farTitle: "Segui por Av. Casares",
      farText: "En la primera esquina vas a doblar a la derecha por Gelly.",
      nearTitle: "Dobla a la derecha por Gelly",
      nearText: "Este es el giro correcto. Entrá a Gelly.",
    },
    alerts: [
      {
        type: "priority",
        title: "Cruce de esquina",
        body: "Reducí velocidad y prepará la maniobra antes del giro.",
      },
    ],
    point: { x: 224, y: 174 },
  },
  {
    id: "turn-cavia",
    segment: "Cavia",
    title: "Tercer giro",
    kicker: "Hito 3",
    description:
      "Sobre Gelly, en la segunda esquina el circuito gira a la derecha por Cavia.",
    progressLabel: "Gelly -> Cavia",
    prompt: "En la segunda esquina de Gelly, doblá a la derecha por Cavia.",
    correctAction: "right",
    speedHint: "20 km/h",
    address: "Gelly y Cavia, CABA, Argentina",
    trigger: {
      lat: -34.576093251857294,
      lng: -58.40620386188927,
    },
    streetView: {
      lat: -34.57119,
      lng: -58.41065,
      heading: 120,
      pitch: -2,
      zoom: 1,
    },
    cue: {
      farTitle: "Segui por Gelly",
      farText: "En la segunda esquina tenés que doblar a la derecha por Cavia.",
      nearTitle: "Dobla a la derecha por Cavia",
      nearText: "Tomá Cavia para seguir el circuito.",
    },
    alerts: [
      {
        type: "traffic-light",
        title: "Intersección",
        body: "Leé el cruce con tiempo y no invadas la senda peatonal.",
      },
    ],
    point: { x: 300, y: 156 },
  },
  {
    id: "turn-castex",
    segment: "Castex",
    title: "Cuarto giro",
    kicker: "Hito 4",
    description:
      "Sobre Cavia, en la segunda esquina el circuito gira a la izquierda por Castex.",
    progressLabel: "Cavia -> Castex",
    prompt: "En la segunda esquina de Cavia, doblá a la izquierda por Castex.",
    correctAction: "left",
    speedHint: "20 km/h",
    address: "Cavia y Castex, CABA, Argentina",
    trigger: {
      lat: -34.577162058497215,
      lng: -58.40699026765607,
    },
    streetView: {
      lat: -34.57226,
      lng: -58.41142,
      heading: 210,
      pitch: -2,
      zoom: 1,
    },
    cue: {
      farTitle: "Segui por Cavia",
      farText: "En la segunda esquina vas a doblar a la izquierda por Castex.",
      nearTitle: "Dobla a la izquierda por Castex",
      nearText: "Entrá a Castex para seguir el circuito.",
    },
    alerts: [
      {
        type: "stop",
        title: "Control de maniobra",
        body: "Atención a prioridad de paso y trayectoria del giro.",
      },
    ],
    point: { x: 250, y: 238 },
  },
  {
    id: "turn-salguero",
    segment: "Jeronimo Salguero",
    title: "Quinto giro",
    kicker: "Hito 5",
    description:
      "Ya sobre Castex, en la primera esquina el circuito gira a la izquierda por Jerónimo Salguero.",
    progressLabel: "Castex -> Jeronimo Salguero",
    prompt: "En la primera esquina de Castex, doblá a la izquierda por Jerónimo Salguero.",
    correctAction: "left",
    speedHint: "30 km/h",
    address: "Castex y Jeronimo Salguero, CABA, Argentina",
    trigger: {
      lat: -34.57774169098946,
      lng: -58.40603558723971,
    },
    streetView: {
      lat: -34.57312,
      lng: -58.41207,
      heading: 116,
      pitch: -1,
      zoom: 1,
    },
    cue: {
      farTitle: "Segui por Castex",
      farText: "En la primera esquina vas a doblar a la izquierda por Jerónimo Salguero.",
      nearTitle: "Dobla a la izquierda por Jeronimo Salguero",
      nearText: "Tomá Salguero para continuar el recorrido.",
    },
    alerts: [
      {
        type: "traffic-light",
        title: "Cruce de mayor jerarquia",
        body: "Prepará el giro con tiempo y controlá el tránsito del cruce.",
      },
    ],
    point: { x: 205, y: 308 },
  },
  {
    id: "turn-alcorta",
    segment: "Av. Pres. F. Alcorta",
    title: "Sexto giro",
    kicker: "Hito 6",
    description:
      "Sobre Jerónimo Salguero, en la segunda esquina el circuito gira a la izquierda por Figueroa Alcorta.",
    progressLabel: "Jeronimo Salguero -> Figueroa Alcorta",
    prompt: "En la segunda esquina de Salguero, doblá a la izquierda por Figueroa Alcorta.",
    correctAction: "left",
    speedHint: "30 km/h",
    address: "Jeronimo Salguero y Avenida Presidente Figueroa Alcorta, CABA, Argentina",
    trigger: {
      lat: -34.57655129699906,
      lng: -58.40500881800576,
    },
    streetView: {
      lat: -34.57409,
      lng: -58.41332,
      heading: 205,
      pitch: -1,
      zoom: 1,
    },
    cue: {
      farTitle: "Segui por Jeronimo Salguero",
      farText: "En la segunda esquina vas a doblar a la izquierda por Figueroa Alcorta.",
      nearTitle: "Dobla a la izquierda por Figueroa Alcorta",
      nearText: "Entrá a la avenida y seguí hasta el próximo giro.",
    },
    alerts: [
      {
        type: "traffic-light",
        title: "Avenida importante",
        body: "Atención a semáforos, carril y flujo de la avenida.",
      },
    ],
    point: { x: 104, y: 346 },
  },
  {
    id: "turn-scalabrini",
    segment: "Scalabrini Ortiz",
    title: "Séptimo giro",
    kicker: "Hito 7",
    description:
      "Sobre Figueroa Alcorta, en la segunda esquina el circuito gira a la izquierda por Scalabrini Ortiz.",
    progressLabel: "Figueroa Alcorta -> Scalabrini Ortiz",
    prompt: "En la segunda esquina de Figueroa Alcorta, doblá a la izquierda por Scalabrini Ortiz.",
    correctAction: "left",
    speedHint: "30 km/h",
    address: "Avenida Presidente Figueroa Alcorta y Scalabrini Ortiz, CABA, Argentina",
    trigger: {
      lat: -34.57527610393976,
      lng: -58.40672929170721,
    },
    streetView: {
      lat: -34.57292,
      lng: -58.41411,
      heading: 130,
      pitch: -1,
      zoom: 1,
    },
    cue: {
      farTitle: "Segui por Figueroa Alcorta",
      farText: "En la segunda esquina vas a doblar a la izquierda por Scalabrini Ortiz.",
      nearTitle: "Dobla a la izquierda por Scalabrini Ortiz",
      nearText: "Tomá Scalabrini Ortiz para encarar el tramo final.",
    },
    alerts: [
      {
        type: "priority",
        title: "Giro en avenida",
        body: "Leé con anticipación el entorno antes de cruzar.",
      },
    ],
    point: { x: 86, y: 202 },
  },
  {
    id: "turn-final-castex",
    segment: "Castex",
    title: "Octavo giro",
    kicker: "Hito 8",
    description:
      "Sobre Scalabrini Ortiz, en la segunda esquina el circuito gira a la derecha por Castex para volver al final.",
    progressLabel: "Scalabrini Ortiz -> Castex",
    prompt: "En la segunda esquina de Scalabrini Ortiz, doblá a la derecha por Castex.",
    correctAction: "right",
    speedHint: "20 km/h",
    address: "Scalabrini Ortiz y Castex, CABA, Argentina",
    trigger: {
      lat: -34.57607346979566,
      lng: -58.40760840823365,
    },
    streetView: {
      lat: -34.57251,
      lng: -58.41335,
      heading: 265,
      pitch: -2,
      zoom: 1,
    },
    cue: {
      farTitle: "Segui por Scalabrini Ortiz",
      farText: "En la segunda esquina vas a doblar a la derecha por Castex.",
      nearTitle: "Dobla a la derecha por Castex",
      nearText: "Entrá a Castex y avanzá un poco hasta el punto final.",
    },
    alerts: [
      {
        type: "note",
        title: "Tramo final",
        body: "Después del giro, avanzá por Castex para completar el recorrido.",
      },
    ],
    point: { x: 102, y: 290 },
  },
  {
    id: "finish",
    segment: "Castex",
    title: "Punto final",
    kicker: "Final",
    description:
      "Avanzá un poco por Castex y estacioná en el punto final del circuito.",
    progressLabel: "Llegada y estacionamiento final",
    prompt: "Avanzá por Castex y estacioná para terminar el circuito.",
    correctAction: "straight",
    speedHint: "10 km/h",
    address: "Castex 3671, C1425 CABA, Argentina",
    trigger: {
      lat: -34.57618,
      lng: -58.40746,
    },
    streetView: {
      lat: -34.57618,
      lng: -58.40746,
      heading: 210,
      pitch: -2,
      zoom: 1,
    },
    cue: {
      farTitle: "Segui por Castex",
      farText: "Avanzá un poco más y preparate para estacionar en el punto final.",
      nearTitle: "Punto final",
      nearText: "Terminá el recorrido y estacioná.",
    },
    alerts: [
      {
        type: "note",
        title: "Fin de recorrido",
        body: "Completaste el circuito. Falta resolver la maniobra de estacionamiento final.",
      },
    ],
    point: { x: 102, y: 290 },
    mapPoint: {
      lat: -34.57618,
      lng: -58.40746,
    },
  },
];

const availableCircuits = [
  {
    id: "aca-libertador-a",
    title: "ACA Libertador · Recorrido A",
    subtitle: "Activo ahora. Base calibrada con Street View e hitos manuales.",
    active: true,
  },
  {
    id: "nunez",
    title: "Nunez",
    subtitle: "Listado para la siguiente tanda. Todavia sin calibracion completa.",
    active: false,
  },
  {
    id: "recoleta",
    title: "Recoleta",
    subtitle: "Listado para expansion cercana al eje Libertador / Comuna 2.",
    active: false,
  },
];

const contextualMessages = [
  {
    id: "ctx-01-casares-prioridad",
    stepId: "turn-casares",
    checkpoint: 1,
    category: "Prioridad de paso",
    title: "Castex hacia Av. Casares: prioridad en interseccion no semaforizada",
    subtitle: "Coordenada 1. Primer giro del circuito.",
    observation:
      "Venis por Castex y queres girar a la derecha para ingresar a Av. Casares en una interseccion sin semaforo.",
    takeaway:
      "La prioridad vehicular la tiene la arteria de mayor jerarquia. En este caso, los vehiculos que ya circulan por Av. Casares tienen prioridad sobre quien llega desde Castex.",
    source: {
      document: "Manual oficial de conduccion GCBA",
      section: "Pagina 56 · Intersecciones no semaforizadas",
      quote:
        "Cuando el cruce es entre arterias de distintas categorias, los vehiculos que circulan por la de mayor importancia son los que tienen prioridad: avenida, calle, pasaje.",
    },
  },
  {
    id: "ctx-02",
    stepId: "turn-gelly",
    checkpoint: 2,
    category: "Semaforo",
    title: "Frenar antes de la linea de detencion",
    subtitle: "Alerta 2. Aproximada desde PDF: tramo hacia Gelly.",
    observation:
      "En este tramo hay un semaforo y una linea de detencion visible antes del cruce.",
    takeaway:
      "Si el semaforo obliga a detenerse, no invadas la senda ni la linea de detencion. Frená antes de la marca.",
    source: {
      document: "Manual oficial de conduccion GCBA",
      section: "Intersecciones semaforizadas",
      quote:
        "Rojo: detenerse antes de la senda peatonal o de la linea de detencion.",
    },
  },
  {
    id: "ctx-03",
    stepId: "turn-gelly",
    checkpoint: 2,
    category: "Velocidad",
    title: "Velocidad recomendada en este tramo",
    subtitle: "Alerta 3. Aproximada desde PDF: Gelly.",
    observation:
      "El instructor recomendo practicar este tramo con referencia de velocidad maxima 30 km/h y minima 20 km/h.",
    takeaway:
      "Usá una velocidad controlada y compatible con el entorno urbano, sin circular innecesariamente lento ni exceder el limite recomendado.",
    source: {
      document: "Manual oficial de conduccion GCBA",
      section: "Velocidad precautoria y velocidades minimas",
      quote:
        "La velocidad precautoria es la adecuada a las circunstancias y permite mantener el total dominio del vehiculo.",
    },
  },
  {
    id: "ctx-04",
    stepId: "turn-cavia",
    checkpoint: 3,
    category: "Prioridad",
    title: "Interseccion sin semaforo: prioridad por derecha",
    subtitle: "Frame calibrado: Gelly hacia Cavia.",
    observation:
      "Llegas a una interseccion sin semaforo y tenes que resolver prioridad antes de avanzar.",
    takeaway:
      "Pará, papu: si las calles son de igual jerarquia y no hay señal que diga otra cosa, tenes prioridad si venis por la derecha. Igual mirá todo antes de mandarte.",
    source: {
      document: "Manual oficial de conduccion GCBA",
      section: "Intersecciones no semaforizadas",
      quote:
        "Cuando el cruce es entre arterias de igual jerarquia, los vehiculos que tienen prioridad son los que cruzan por la derecha, excepto que exista alguna excepcion.",
    },
  },
  {
    id: "ctx-05-follow-distance",
    stepId: "turn-castex",
    checkpoint: 4,
    category: "Distancia",
    title: "Distancia de seguridad con el auto de adelante",
    subtitle: "Alerta 5. Aproximada desde PDF: tramo por Cavia.",
    observation:
      "En la escena hay vehiculos por delante y conviene entrenar distancia de seguimiento.",
    takeaway:
      "No te pegues al auto de adelante. Dejá margen para reaccionar ante una frenada o maniobra repentina.",
    source: {
      document: "Manual oficial de conduccion GCBA",
      section: "Distancia de seguridad",
      quote:
        "La distancia de seguridad es la distancia prudencial minima que se debe dejar con el vehiculo que circula adelante.",
    },
  },
  {
    id: "ctx-06-speed-bump",
    stepId: "turn-salguero",
    checkpoint: 5,
    category: "Loma de burro",
    title: "Loma de burro mas adelante",
    subtitle: "Frame calibrado: Castex hacia Salguero.",
    observation:
      "Mas adelante aparece una loma de burro/reductor de velocidad.",
    takeaway:
      "Reducí antes de llegar, sostené control del vehiculo y evitá frenar bruscamente encima del reductor.",
    source: {
      document: "Manual oficial de conduccion GCBA",
      section: "Velocidad precautoria",
      quote:
        "Se debe circular siempre a una velocidad que tenga en cuenta el estado de la arteria, la calzada, el clima y la densidad del transito.",
    },
  },
  {
    id: "ctx-07-bike-overtake",
    stepId: "turn-salguero",
    checkpoint: 5,
    category: "Bicicleta",
    title: "Reglas para pasar una bicicleta",
    subtitle: "Frame calibrado: Castex hacia Salguero.",
    observation:
      "En la escena aparece una bicicleta circulando adelante/lateralmente.",
    takeaway:
      "Esperá espacio suficiente y sobrepasá dejando distancia lateral segura. Si no hay lugar, no fuerces la maniobra.",
    source: {
      document: "Manual oficial de conduccion GCBA",
      section: "Convivencia con ciclistas",
      quote:
        "Si se circula detras de una bici, se debe mantener una distancia prudencial y, al sobrepasarla, dejar una distancia lateral de 1,5 mts.",
    },
  },
  {
    id: "ctx-08-school-sign",
    stepId: "turn-salguero",
    checkpoint: 5,
    category: "Escolares",
    title: "Señal de escolares",
    subtitle: "Alerta 8. Aproximada desde PDF: Castex hacia Salguero.",
    observation:
      "A la izquierda de la imagen hay una señal amarilla que advierte presencia de escolares.",
    takeaway:
      "Bajá la velocidad, aumentá la atencion y preparate para peatones chicos o cruces imprevistos.",
    source: {
      document: "Manual oficial de conduccion GCBA",
      section: "Señales preventivas y prioridad peatonal",
      quote:
        "Las señales de transito advierten situaciones del trayecto y deben ser respetadas para reducir riesgos.",
    },
  },
  {
    id: "ctx-09-salguero-congestion",
    stepId: "turn-alcorta",
    checkpoint: 6,
    category: "Congestion",
    title: "Salguero suele venir cargada",
    subtitle: "Frame calibrado: tramo hacia Figueroa Alcorta.",
    observation:
      "En Salguero el flujo puede ponerse pesado y exigir paciencia, distancia y lectura del entorno.",
    takeaway:
      "Guarda en Salguero: suele ser un quilombo. Manejá con paciencia, sostené distancia y no te apures por cerrar huecos.",
    source: {
      document: "Manual oficial de conduccion GCBA",
      section: "Velocidad precautoria",
      quote:
        "Se debe circular siempre a una velocidad que tenga en cuenta el estado de la arteria, la calzada, el clima y la densidad del transito.",
    },
  },
  {
    id: "ctx-10-alcorta-turn",
    stepId: "turn-alcorta",
    checkpoint: 6,
    category: "Giro en avenida",
    title: "Ingreso a Figueroa Alcorta: atencion maxima",
    subtitle: "Frame calibrado: giro hacia avenida.",
    observation:
      "En el giro aparecen peatones, bicis o motos posibles, y cambia la logica de velocidad por estar entrando a una avenida.",
    takeaway:
      "Acá prestá mucha atención: cedé a peatones, cuidá la distancia con bicis y motos, y no te cierres contra obstáculos del carril.",
    source: {
      document: "Manual oficial de conduccion GCBA",
      section: "Giros, prioridad peatonal y velocidad precautoria",
      quote:
        "La velocidad precautoria es la adecuada a las circunstancias y permite mantener el total dominio del vehiculo.",
    },
  },
  {
    id: "ctx-09-car-leaving",
    stepId: "turn-scalabrini",
    checkpoint: 7,
    category: "Peatones",
    title: "Peaton cerca del cruce: no te hagas el vivo",
    subtitle: "Frame calibrado: giro hacia Scalabrini Ortiz.",
    observation:
      "En el giro aparece un peaton muy cerca de cruzar o con intencion de hacerlo.",
    takeaway:
      "No te hagas el vivo con el peaton. Bajá, leé la intención y dejalo pasar antes de completar el giro.",
    source: {
      document: "Manual oficial de conduccion GCBA",
      section: "Prioridad peatonal",
      quote:
        "En calles sin semaforo se debe ceder siempre el paso a peatones siempre que deseen cruzar.",
    },
  },
  {
    id: "ctx-10-crosswalk",
    stepId: "turn-final-castex",
    checkpoint: 8,
    category: "Peatones",
    title: "Paso peatonal: dejar pasar",
    subtitle: "Alerta 10. Aproximada desde PDF: Scalabrini Ortiz.",
    observation:
      "En este punto aparece una senda peatonal con peatones o posible cruce peatonal.",
    takeaway:
      "En el examen, si hay peatones cruzando o con intencion de cruzar, detenete y cedé el paso.",
    source: {
      document: "Manual oficial de conduccion GCBA",
      section: "Prioridad peatonal",
      quote:
        "En calles sin semaforo se debe ceder siempre el paso a peatones siempre que deseen cruzar.",
    },
  },
  {
    id: "ctx-11-right-priority",
    stepId: "turn-final-castex",
    checkpoint: 8,
    category: "Prioridad",
    title: "Dejar paso al que viene por la derecha",
    subtitle: "Alerta 11. Aproximada desde PDF: Scalabrini Ortiz.",
    observation:
      "La escena plantea una interseccion sin semaforo donde hay que mirar si aparece vehiculo por la derecha.",
    takeaway:
      "Si las arterias son de igual jerarquia y no hay señal que modifique la prioridad, dejá pasar al que viene por la derecha.",
    source: {
      document: "Manual oficial de conduccion GCBA",
      section: "Intersecciones no semaforizadas",
      quote:
        "Cuando el cruce es entre arterias de igual jerarquia, los vehiculos que tienen prioridad son los que cruzan por la derecha.",
    },
  },
  {
    id: "ctx-12-parking-hazards",
    stepId: "finish",
    checkpoint: 9,
    category: "Estacionamiento",
    title: "Ya casi estas: balizas y estacionamiento final",
    subtitle: "Frame calibrado: llegada sobre Castex.",
    observation:
      "El final del recorrido marca el punto donde te pueden pedir estacionar.",
    takeaway:
      "Ya casi estas, capo. Poné balizas, anticipá la maniobra y estacioná sin apurarte.",
    source: {
      document: "Manual oficial de conduccion GCBA",
      section: "Detencion y estacionamiento",
      quote:
        "La detencion o estacionamiento debe realizarse sin generar riesgos en la via y con la señalizacion correspondiente.",
    },
  },
];

const mapContextRules = [
  {
    id: "rule-casares-priority",
    stepId: "turn-casares",
    trigger: {
      lat: -34.57559844243096,
      lng: -58.408456624395974,
    },
    activationRadius: 34,
    label: "Alerta contextual · Hito 1",
    title: "Prioridad al ingresar de Castex a Av. Casares",
    text:
      "En esta esquina sin semáforo la prioridad la tienen los vehículos que ya circulan por la arteria de mayor jerarquía: Av. Casares. Llegando desde Castex, tenés que ceder el paso antes de entrar al giro.",
  },
  {
    id: "rule-stop-line",
    stepId: "turn-gelly",
    trigger: { lat: -34.57508, lng: -58.40802 },
    activationRadius: 46,
    label: "Alerta contextual · Semaforo",
    title: "Frená antes de la linea de detencion",
    text:
      "Si el semáforo exige detenerte, hacelo antes de la senda peatonal o de la línea de detención. No invadas el cruce.",
  },
  {
    id: "rule-speed-gelly",
    stepId: "turn-gelly",
    trigger: { lat: -34.57535, lng: -58.40745 },
    activationRadius: 70,
    label: "Alerta contextual · Velocidad",
    title: "Velocidad recomendada: max. 30 km/h · min. 20 km/h",
    text:
      "Usá una velocidad controlada y compatible con el entorno. La práctica del instructor marca este tramo como buen lugar para sostener dominio del vehículo.",
  },
  {
    id: "rule-cavia-right-priority",
    stepId: "turn-cavia",
    trigger: { lat: -34.575505, lng: -58.407166 },
    activationRadius: 28,
    pano: "C3yL18Rgr_vJ04MO_XIyMw",
    label: "Alerta contextual · Prioridad derecha",
    title: "Pará, papu: venís por la derecha",
    text:
      "Si es un cruce de calles de igual jerarquía y no hay señal que cambie la regla, tenés prioridad por venir desde la derecha. Igual, no te mandes sin mirar.",
  },
  {
    id: "rule-cavia-priority",
    stepId: "turn-cavia",
    trigger: { lat: -34.576022, lng: -58.406289 },
    activationRadius: 26,
    pano: "p1KwI6jDqqhvy31Qlydo-Q",
    label: "Alerta contextual · Prioridad",
    title: "Upa, ¿y ahora? Leé la señal y la mano",
    text:
      "En un cruce sin semáforo, primero manda la señalización. Si una calle se vuelve contramano o hay señal clara, no apliques la prioridad por derecha en automático: leé el entorno completo.",
  },
  {
    id: "rule-follow-distance",
    stepId: "turn-castex",
    trigger: { lat: -34.57672, lng: -58.40663 },
    activationRadius: 38,
    label: "Alerta contextual · Distancia",
    title: "No te pegues al auto de adelante",
    text:
      "Mantené distancia de seguridad para poder reaccionar ante una frenada repentina o maniobra inesperada.",
  },
  {
    id: "rule-speed-bump",
    stepIds: ["turn-castex", "turn-salguero"],
    trigger: { lat: -34.576516, lng: -58.40643 },
    activationRadius: 76,
    pano: "eFbBTk5ghQyTw6_DDCYEEg",
    label: "Alerta contextual · Reductor",
    title: "Loma de burro más adelante",
    text:
      "Reducí antes de llegar al reductor y mantené control del vehículo. Evitá frenar bruscamente encima de la loma.",
  },
  {
    id: "rule-bike",
    stepIds: ["turn-castex", "turn-salguero"],
    trigger: { lat: -34.576819, lng: -58.406694 },
    activationRadius: 76,
    pano: "7F8Q5SXs8b58mQSYY7wLfA",
    label: "Alerta contextual · Bicicleta",
    title: "Sobrepaso de bicicleta: 1,5 m lateral",
    text:
      "Si vas a pasar una bici, esperá espacio suficiente y dejá una distancia lateral segura de 1,5 metros.",
  },
  {
    id: "rule-school",
    stepId: "turn-salguero",
    trigger: { lat: -34.57774169098946, lng: -58.40603558723971 },
    activationRadius: 54,
    label: "Alerta contextual · Escolares",
    title: "Señal de escolares",
    text:
      "Ante una señal preventiva de escolares, bajá la velocidad y aumentá la atención sobre peatones chicos o cruces imprevistos.",
  },
  {
    id: "rule-salguero-congestion",
    stepId: "turn-alcorta",
    trigger: { lat: -34.577408, lng: -58.405715 },
    activationRadius: 34,
    pano: "D-yGA9Wp0wMRwaX03OAcjg",
    label: "Alerta contextual · Congestion",
    title: "Guarda en Salguero: suele ser un quilombo",
    text:
      "Manejá con paciencia, no te pegues al de adelante y mantené una velocidad que te permita reaccionar sin volantazos.",
  },
  {
    id: "rule-alcorta-turn",
    stepId: "turn-alcorta",
    trigger: { lat: -34.576675, lng: -58.405032 },
    activationRadius: 34,
    pano: "o2MvrAwYNDsmPRAllrvq0g",
    label: "Alerta contextual · Giro en avenida",
    title: "Atención máxima al entrar a Alcorta",
    text:
      "Cedé a peatones y cuidá la distancia con bicis y motos. Por lo general vas a encarar el carril izquierdo, pero no te cierres contra obstáculos.",
  },
  {
    id: "rule-car-leaving",
    stepId: "turn-scalabrini",
    trigger: { lat: -34.575294, lng: -58.406618 },
    activationRadius: 28,
    pano: "3j9oN2Ewja1bjgSKCkLhJw",
    label: "Alerta contextual · Peatones",
    title: "No te hagas el vivo con ese peatón",
    text:
      "Si el peatón está cerca de cruzar o muestra intención, bajá y dejalo pasar antes de completar el giro.",
  },
  {
    id: "rule-crosswalk",
    stepId: "turn-final-castex",
    trigger: { lat: -34.57607346979566, lng: -58.40760840823365 },
    activationRadius: 58,
    label: "Alerta contextual · Peatones",
    title: "Senda peatonal: dejá pasar",
    text:
      "Si hay peatones cruzando o con intención de cruzar, detenete y cedé el paso antes de completar la maniobra.",
  },
  {
    id: "rule-right-priority",
    stepId: "turn-final-castex",
    trigger: { lat: -34.57585, lng: -58.40738 },
    activationRadius: 54,
    label: "Alerta contextual · Prioridad derecha",
    title: "Atención al vehículo que viene por la derecha",
    text:
      "En cruces de igual jerarquía sin señalización que indique lo contrario, tiene prioridad quien cruza por la derecha.",
  },
  {
    id: "rule-parking-hazards",
    stepId: "finish",
    trigger: { lat: -34.575893, lng: -58.408029 },
    activationRadius: 46,
    pano: "MDdD-l2m4Clf8SKb0XYD4Q",
    label: "Alerta contextual · Estacionamiento",
    title: "Ya casi estás, capo: balizas",
    text:
      "Poné balizas, anticipá la maniobra y estacioná tranquilo. El cierre también cuenta.",
  },
];

const mapRoutePoints = [
  { lat: -34.57618, lng: -58.40746 },
  { lat: -34.57590, lng: -58.40795 },
  { lat: -34.57559844243096, lng: -58.408456624395974 },
  { lat: -34.57532, lng: -58.40820 },
  { lat: -34.57501597057818, lng: -58.40794151343924 },
  { lat: -34.57560, lng: -58.40705 },
  { lat: -34.576093251857294, lng: -58.40620386188927 },
  { lat: -34.57658, lng: -58.40656 },
  { lat: -34.577162058497215, lng: -58.40699026765607 },
  { lat: -34.57744, lng: -58.40654 },
  { lat: -34.57774169098946, lng: -58.40603558723971 },
  { lat: -34.57720, lng: -58.40558 },
  { lat: -34.57655129699906, lng: -58.40500881800576 },
  { lat: -34.57592, lng: -58.40586 },
  { lat: -34.57527610393976, lng: -58.40672929170721 },
  { lat: -34.57567, lng: -58.40718 },
  { lat: -34.57607346979566, lng: -58.40760840823365 },
  { lat: -34.57618, lng: -58.40746 },
];

const progressIndexByStep = {
  start: 1,
  "turn-casares": 3,
  "turn-gelly": 5,
  "turn-cavia": 7,
  "turn-castex": 9,
  "turn-salguero": 11,
  "turn-alcorta": 13,
  "turn-scalabrini": 15,
  "turn-final-castex": 17,
  finish: mapRoutePoints.length,
};

window.DRIVING_CIRCUITS = window.DRIVING_CIRCUITS ?? [];
window.DRIVING_CIRCUITS.push({
  id: "aca-libertador-a",
  title: "ACA Libertador · Recorrido A",
  subtitle: "Base calibrada con Street View e hitos manuales.",
  heroTitle: "ACA Libertador, convertido en circuito jugable",
  routeSummary:
    "Castex → Casares → Gelly → Cavia → Castex → Salguero → Figueroa Alcorta → Scalabrini → Castex",
  routeSteps,
  availableCircuits,
  contextualMessages,
  mapContextRules,
  mapRoutePoints,
  progressIndexByStep,
});
})();
