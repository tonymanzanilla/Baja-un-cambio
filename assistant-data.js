(function attachAssistantData(globalScope) {
  const data = {
    starterPrompts: [
      "Nunca use Street View en serio. Como practico un recorrido sin perderme?",
      "Que me conviene hacer apenas me siento en el auto del examen para arrancar prolijo?",
      "A cuanto espacio tengo que pasar de una bici para hacerlo de forma segura?",
      "Que suelen observarme en un giro durante el examen practico?",
    ],
    systemPrompt: [
      "Sos un acompanante virtual para el examen practico de manejo en CABA.",
      "Responde en espanol rioplatense, usando vos, con tono claro, humano, paciente y empatico.",
      "Tu trabajo es bajar ansiedad, explicar simple, acompanar a alguien que puede estar muy perdido y no inventar reglas.",
      "Podes explicar tanto reglas viales como la logica de la app, el uso de Street View y pequeños detalles practicos del examen.",
      "Si la persona suena novata, responde paso a paso, sin tecnicismos innecesarios y con calma.",
      "Tambien podes orientar sobre modales y preparacion del examen: saludar, sentarse tranquilo, ponerse el cinto, acomodarse, prender luces si corresponde y mostrar una actitud prolija sin sobreactuar.",
      "Usa solamente el contexto y las fuentes que te pasan en cada request.",
      "Si la informacion no alcanza para afirmar algo con seguridad, decilo explicitamente.",
      "No des numeros, multas o reglas exactas si no aparecen en las fuentes.",
      "Cuando la pregunta depende del lugar actual, podes usar el contexto del tramo.",
      "Responde corto pero util: 3 a 6 oraciones. Si sirve, inclui pasos breves o un mini consejo final.",
    ].join(" "),
    welcomeMessage:
      "Estoy para ayudarte a entender el recorrido, usar la app y llegar mas tranquilo al practico. Me podes preguntar desde una duda de prioridad hasta como usar Street View, que hacer apenas te sentas en el auto o detalles finos del examen.",
    knowledgeBase: [
      {
        id: "app-purpose",
        title: "Para que sirve la app",
        topic: "Uso de la app",
        keywords: ["app", "sirve", "para que", "juego", "simulador", "baja 2 cambios", "que hago aca"],
        content:
          "Baja 2 Cambios sirve para practicar circuitos reales del examen practico de manejo en CABA antes de rendir. La idea es entender el recorrido, reconocer giros y cruces importantes, bajar nervios y llegar mas orientado al examen.",
        source: "Guia de uso de la app",
        section: "Objetivo general",
      },
      {
        id: "street-view-basics",
        title: "Como usar Street View en la practica",
        topic: "Uso de Street View",
        keywords: ["street view", "como usar", "moverme", "avanzar", "girar", "mouse", "perderme", "usar la app"],
        content:
          "Para practicar con Street View, primero mira la instruccion del tramo actual. Despues orienta la vista con el mouse, hace click hacia adelante sobre la calle para avanzar y usa el mapa y los textos de apoyo para confirmar si vas por el recorrido correcto. Si te perdes, no pasa nada: volve a mirar el nombre de la calle, la instruccion visible y reubicate antes de seguir.",
        source: "Guia de uso de la app",
        section: "Practica con Street View",
      },
      {
        id: "study-vs-exam",
        title: "Diferencia entre modo estudio y modo examen",
        topic: "Uso de la app",
        keywords: ["modo estudio", "modo examen", "diferencia", "como funciona", "juego", "practica"],
        content:
          "El modo estudio esta pensado para practicar con mas ayudas y entender que te pide cada tramo. El modo examen saca parte de esas ayudas para que pruebes si realmente podes leer el entorno y decidir con mas autonomia.",
        source: "Guia de uso de la app",
        section: "Modos de practica",
      },
      {
        id: "first-minute-exam",
        title: "Primer minuto dentro del auto",
        topic: "Examen practico",
        keywords: ["me siento", "primer minuto", "cinto", "asiento", "espejos", "arrancar", "auto", "saludar"],
        content:
          "Apenas te sentas en el auto del examen, conviene saludar tranquilo, acomodar asiento y espejos, ponerte el cinturon sin que te lo recuerden y mostrar que estas ordenado antes de arrancar. La idea no es hacer teatro, sino transmitir que manejas con rutina y atencion desde el minuto cero.",
        source: "Guia de examen practico",
        section: "Inicio del examen",
      },
      {
        id: "good-student-acting",
        title: "Actitud prolija sin sobreactuar",
        topic: "Examen practico",
        keywords: ["acting", "buen estudiante", "nervios", "instructor", "saludar", "actitud", "prolijo"],
        content:
          "En el practico ayuda mucho una actitud calma, prolija y respetuosa. Saludar, escuchar la instruccion completa, no apurarte, ponerte el cinturon enseguida y mostrar chequeos basicos transmite seguridad. No hace falta sobreactuar ni hacer movimientos raros: alcanza con ser ordenado y visible en lo importante.",
        source: "Guia de examen practico",
        section: "Actitud durante la evaluacion",
      },
      {
        id: "lights-and-basics",
        title: "Luces y chequeos basicos",
        topic: "Examen practico",
        keywords: ["luces", "prender luces", "balizas", "chequeos", "arrancar", "auto", "basico"],
        content:
          "Si la situacion lo pide o el evaluador lo menciona, conviene resolver luces y controles basicos con naturalidad. No siempre hay que encender cosas porque si: primero escucha la consigna, ubicati y mostra que conoces lo basico del auto sin entrar en apuro.",
        source: "Guia de examen practico",
        section: "Controles basicos del vehiculo",
      },
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
      {
        id: "ask-any-detail",
        title: "Preguntas chicas tambien sirven",
        topic: "Uso del asistente",
        keywords: ["preguntar", "detalle", "cosita", "duda chica", "momento del practico", "que puedo preguntar"],
        content:
          "Este asistente tambien sirve para dudas chiquitas y muy concretas del practico: desde una prioridad puntual hasta como encarar el saludo, cuando ponerte el cinturon, como leer un cruce raro o como usar Street View para practicar sin perderte.",
        source: "Guia de uso del asistente",
        section: "Alcance",
      },
    ],
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = data;
  }

  globalScope.DRIVING_ASSISTANT_DATA = data;
})(typeof window !== "undefined" ? window : globalThis);
