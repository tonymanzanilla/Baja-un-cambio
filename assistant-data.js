(function attachAssistantData(globalScope) {
  const data = {
    starterPrompts: [
      "A cuanto espacio tengo que pasar de una bici para hacerlo de forma segura?",
      "En un cruce sin semaforo, quien tiene prioridad de paso si llegamos al mismo tiempo?",
      "Si veo una senal de PARE, tengo que frenar por completo o solo bajar la velocidad?",
      "Que suelen observarme en un giro durante el examen practico?",
    ],
    systemPrompt: [
      "Sos un instructor virtual para el examen practico de manejo en CABA.",
      "Responde en espanol rioplatense, usando vos, con tono claro, tranquilo y cero canchereo sobrador.",
      "Tu trabajo es bajar ansiedad, explicar simple y no inventar reglas.",
      "Usa solamente el contexto y las fuentes que te pasan en cada request.",
      "Si la informacion no alcanza para afirmar algo con seguridad, decilo explicitamente.",
      "No des numeros, multas o reglas exactas si no aparecen en las fuentes.",
      "Cuando la pregunta depende del lugar actual, podes usar el contexto del tramo.",
      "Responde corto: 2 a 5 oraciones. Nada de introducciones largas.",
    ].join(" "),
    welcomeMessage:
      "Estoy para dudas concretas del examen y del recorrido. Respondo solo con el material cargado y el contexto actual.",
    knowledgeBase: [
      {
        id: "priority-avenue",
        title: "Prioridad entre avenida y calle",
        topic: "Prioridad de paso",
        keywords: ["prioridad", "avenida", "calle", "cruce", "interseccion"],
        content:
          "En cruces no semaforizados entre arterias de distinta jerarquia, tiene prioridad la de mayor importancia. Si el cruce es entre una avenida y una calle, en general la prioridad la tiene quien circula por la avenida.",
        source: "Manual oficial GCBA",
        section: "Intersecciones no semaforizadas",
      },
      {
        id: "priority-right",
        title: "Prioridad por la derecha",
        topic: "Prioridad de paso",
        keywords: ["prioridad", "derecha", "izquierda", "cruce", "interseccion"],
        content:
          "Entre arterias de igual jerarquia, la regla general es la prioridad de quien cruza por la derecha, salvo las excepciones expresas del manual o la senalizacion del lugar.",
        source: "Manual oficial GCBA",
        section: "Intersecciones no semaforizadas",
      },
      {
        id: "stop-rule",
        title: "Senal de PARE",
        topic: "Senales",
        keywords: ["pare", "frenar", "detenerse", "senda", "peatonal"],
        content:
          "Frente a una senal de PARE hay obligacion de detenerse por completo antes de la senda peatonal o de la linea de detencion. No alcanza con solo bajar un poco la velocidad.",
        source: "Manual oficial GCBA",
        section: "Intersecciones no semaforizadas",
      },
      {
        id: "yield-rule",
        title: "Senal de ceda el paso",
        topic: "Senales",
        keywords: ["ceda", "paso", "prioridad", "detenerse", "cruce"],
        content:
          "La senal CEDA EL PASO hace perder la prioridad. La detencion total no siempre es obligatoria, pero si hace falta frenar para facilitar el paso de quien tiene preferencia, hay que hacerlo.",
        source: "Manual oficial GCBA",
        section: "Intersecciones no semaforizadas",
      },
      {
        id: "traffic-green",
        title: "Luz verde",
        topic: "Semaforos",
        keywords: ["verde", "semaforo", "cruce", "bocacalle", "obstruir"],
        content:
          "La luz verde habilita a avanzar, pero no corresponde iniciar el cruce si del otro lado no hay espacio suficiente para salir sin obstruir la circulacion transversal.",
        source: "Manual oficial GCBA",
        section: "Intersecciones semaforizadas",
      },
      {
        id: "traffic-yellow",
        title: "Luz amarilla",
        topic: "Semaforos",
        keywords: ["amarilla", "amarillo", "semaforo", "frenar", "detenerse"],
        content:
          "Con luz amarilla fija corresponde detenerse si todavia no se inicio el cruce. No es una invitacion a acelerar para pasar rapido.",
        source: "Manual oficial GCBA",
        section: "Intersecciones semaforizadas",
      },
      {
        id: "traffic-red",
        title: "Luz roja",
        topic: "Semaforos",
        keywords: ["roja", "rojo", "semaforo", "detenerse", "senda"],
        content:
          "La luz roja exige detenerse antes de la senda peatonal o de la linea de detencion. La prioridad del cruce no se recupera tocando bocina ni avanzando despacio.",
        source: "Manual oficial GCBA",
        section: "Intersecciones semaforizadas",
      },
      {
        id: "roundabout-priority",
        title: "Rotonda",
        topic: "Prioridad de paso",
        keywords: ["rotonda", "prioridad", "ingresar", "circula", "cruce"],
        content:
          "En la rotonda tiene prioridad quien ya esta circulando dentro de la calzada circular. Quien quiere ingresar tiene que ceder el paso.",
        source: "Manual oficial GCBA",
        section: "Intersecciones no semaforizadas",
      },
      {
        id: "pedestrians",
        title: "Senda peatonal y peatones",
        topic: "Peatones",
        keywords: ["peaton", "peatones", "senda", "peatonal", "cruce", "vereda"],
        content:
          "Antes de avanzar o girar, hay que leer la senda peatonal y verificar si hay peatones con intencion de cruce. El giro correcto no sirve si invadis la senda o apuras a quien cruza.",
        source: "Guia de examen practico",
        section: "Lectura del entorno",
      },
      {
        id: "contramano",
        title: "Sentido de circulacion",
        topic: "Orientacion",
        keywords: ["contramano", "sentido", "circulacion", "doblar", "derecha", "izquierda"],
        content:
          "Si una opcion te deja entrando en sentido contrario, esa maniobra no corresponde. En cruces confusos, primero se respeta el sentido habilitado de circulacion y despues se resuelve el giro.",
        source: "Guia de examen practico",
        section: "Lectura del entorno",
      },
      {
        id: "bike-overtake",
        title: "Paso junto a bicicletas",
        topic: "Convivencia vial",
        keywords: ["bici", "bicicleta", "ciclista", "distancia", "pasar", "sobrepaso"],
        content:
          "Con bicicletas y ciclistas, la regla general es pasar con distancia lateral segura, sin encerrar ni apurar. En esta base local no tengo cargada una medida oficial exacta para esa situacion puntual, asi que corresponde responder con prudencia y no inventar un numero.",
        source: "Guia de examen practico",
        section: "Convivencia vial",
      },
      {
        id: "exam-observation",
        title: "Que suelen observar",
        topic: "Examen practico",
        keywords: ["observan", "toman", "examen", "errores", "nervios", "maniobra"],
        content:
          "En el examen practico suelen mirar lectura del entorno, prioridad de paso, senalizacion, control del auto, suavidad en los giros y respeto por peatones y sendas. La idea no es solo doblar bien, sino mostrar criterio y calma.",
        source: "Guia de examen practico",
        section: "Criterios de evaluacion",
      },
    ],
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = data;
  }

  globalScope.DRIVING_ASSISTANT_DATA = data;
})(typeof window !== "undefined" ? window : globalThis);
