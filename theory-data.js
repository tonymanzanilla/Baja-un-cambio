window.buildTheoryQuestionBank = function buildTheoryQuestionBank() {
  const facts = [
    {
      id: "priority-avenue",
      topic: "Prioridad de paso",
      source: { page: 63, section: "Intersecciones no semaforizadas" },
      explanation:
        "En cruces no semaforizados entre arterias de distinta categoria, tiene prioridad la de mayor jerarquia: avenida, calle, pasaje.",
      variants: [
        {
          prompt:
            "En una interseccion no semaforizada entre una avenida y una calle, quien tiene prioridad de paso?",
          options: [
            "Los vehiculos que circulan por la avenida",
            "Los vehiculos que llegan primero",
            "Los vehiculos que circulan por la calle",
            "Los vehiculos que vienen por la izquierda",
          ],
          correctIndex: 0,
        },
        {
          prompt:
            "Segun la jerarquia del manual para cruces no semaforizados, cual es el orden correcto de prioridad entre arterias?",
          options: [
            "Avenida, calle, pasaje",
            "Calle, avenida, pasaje",
            "Pasaje, calle, avenida",
            "Avenida, pasaje, calle",
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "priority-right",
      topic: "Prioridad de paso",
      source: { page: 63, section: "Intersecciones no semaforizadas" },
      explanation:
        "Entre arterias de igual jerarquia, la prioridad es de quien cruza por la derecha, salvo excepciones expresas del manual.",
      variants: [
        {
          prompt:
            "En una interseccion no semaforizada entre dos calles de igual jerarquia, quien tiene prioridad en general?",
          options: [
            "El vehiculo que cruza por la derecha",
            "El vehiculo que cruza por la izquierda",
            "El vehiculo mas grande",
            "El vehiculo que toca bocina",
          ],
          correctIndex: 0,
        },
        {
          prompt:
            "Si dos vehiculos llegan a un cruce sin semaforo entre arterias de igual jerarquia, cual es la regla general del manual?",
          options: [
            "Tiene prioridad el que viene por la derecha",
            "Tiene prioridad el que acelera primero",
            "Tiene prioridad el que circula mas rapido",
            "Tiene prioridad el que esta mas cerca del cordon",
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "pare-rule",
      topic: "Senales",
      source: { page: 63, section: "Intersecciones no semaforizadas" },
      explanation:
        "Frente a una senal de PARE se pierde la prioridad y existe obligacion de reducir la velocidad y frenar a cero antes de la senda peatonal.",
      variants: [
        {
          prompt:
            "Que exige la senal de PARE en una bocacalle sin semaforo?",
          options: [
            "Frenar a cero antes de la senda peatonal",
            "Reducir un poco y seguir si no viene nadie",
            "Detenerse solo si viene un peaton",
            "Tocar bocina y pasar",
          ],
          correctIndex: 0,
        },
        {
          prompt:
            "Cual es la principal diferencia del PARE respecto de CEDA EL PASO segun el manual?",
          options: [
            "En PARE hay detencion total obligatoria",
            "En PARE solo se reduce la velocidad",
            "En PARE tiene prioridad el que viene por la izquierda",
            "En PARE no se pierde la prioridad",
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "yield-rule",
      topic: "Senales",
      source: { page: 63, section: "Intersecciones no semaforizadas" },
      explanation:
        "La senal CEDA EL PASO hace perder la prioridad, pero la detencion total no es obligatoria salvo cuando sea necesaria para facilitar el paso de quien tiene preferencia.",
      variants: [
        {
          prompt:
            "Que indica la senal CEDA EL PASO en una interseccion sin semaforo?",
          options: [
            "Que se pierde la prioridad de paso",
            "Que se conserva la prioridad si se toca bocina",
            "Que hay que detenerse siempre en forma total",
            "Que solo hay que frenar si es de noche",
          ],
          correctIndex: 0,
        },
        {
          prompt:
            "Segun el manual, cuando es obligatoria la detencion total frente a CEDA EL PASO?",
          options: [
            "Solo cuando facilita la circulacion de quien tiene preferencia",
            "Siempre, antes de la senda peatonal",
            "Nunca, porque basta con mirar",
            "Solo si hay semaforo en rojo",
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "roundabout-priority",
      topic: "Prioridad de paso",
      source: { page: 63, section: "Intersecciones no semaforizadas" },
      explanation:
        "En la rotonda la prioridad la tiene quien ya esta dentro de la calzada circular.",
      variants: [
        {
          prompt:
            "En una rotonda, quien tiene prioridad de paso segun el manual?",
          options: [
            "El vehiculo que ya circula dentro de la rotonda",
            "El vehiculo que intenta ingresar",
            "El vehiculo mas grande",
            "El que viene por la izquierda",
          ],
          correctIndex: 0,
        },
        {
          prompt:
            "Si un vehiculo quiere entrar a una rotonda y otro ya esta dentro, quien tiene prioridad?",
          options: [
            "El que ya esta circulando en la rotonda",
            "El que pretende ingresar",
            "El que llega primero a la linea",
            "Ambos tienen la misma prioridad",
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "semaphore-green",
      topic: "Semaforos",
      source: { page: 62, section: "Intersecciones semaforizadas" },
      explanation:
        "La luz verde habilita a avanzar, pero no se debe iniciar el cruce si no hay espacio suficiente del otro lado para no obstruir la circulacion transversal.",
      variants: [
        {
          prompt:
            "Con luz verde al frente, que precaucion marca el manual antes de iniciar el cruce?",
          options: [
            "Verificar que haya espacio suficiente del otro lado de la bocacalle",
            "Acelerar para aprovechar el paso",
            "Cruzar aunque se obstruya la via transversal",
            "Pasar solo si no hay peatones en la vereda",
          ],
          correctIndex: 0,
        },
        {
          prompt:
            "La luz verde permite avanzar, pero segun el manual no debe iniciarse el cruce cuando...",
          options: [
            "No hay espacio suficiente para quedar del otro lado sin obstruir",
            "Hay otros autos detenidos en tu carril",
            "Se trata de una avenida",
            "El cruce es recto",
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "semaphore-yellow",
      topic: "Semaforos",
      source: { page: 62, section: "Intersecciones semaforizadas" },
      explanation:
        "Amarillo: detenerse si aun no se ha iniciado el cruce.",
      variants: [
        {
          prompt:
            "Que indica la luz amarilla fija segun el manual?",
          options: [
            "Detenerse si aun no se inicio el cruce",
            "Acelerar para cruzar rapido",
            "Cruzar con prioridad",
            "Girar con precaucion sin detenerse nunca",
          ],
          correctIndex: 0,
        },
        {
          prompt:
            "Si la luz del semaforo cambia a amarilla y todavia no iniciaste el cruce, que corresponde?",
          options: [
            "Detenerse",
            "Mantener velocidad y cruzar",
            "Encender balizas y avanzar",
            "Tocar bocina y pasar",
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "semaphore-yellow-flashing",
      topic: "Semaforos",
      source: { page: 62, section: "Intersecciones semaforizadas" },
      explanation:
        "Amarillo intermitente: efectuar el cruce con precaucion.",
      variants: [
        {
          prompt:
            "Que indica la luz amarilla intermitente?",
          options: [
            "Efectuar el cruce con precaucion",
            "Detenerse siempre por completo",
            "Que la prioridad la tiene quien viene por la izquierda",
            "Que el cruce esta cerrado",
          ],
          correctIndex: 0,
        },
        {
          prompt:
            "Ante un semaforo con luz amarilla intermitente, la conducta correcta es:",
          options: [
            "Cruzar con precaucion",
            "Avanzar sin disminuir",
            "Detenerse y apagar el motor",
            "Retroceder antes de la linea",
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "semaphore-red",
      topic: "Semaforos",
      source: { page: 62, section: "Intersecciones semaforizadas" },
      explanation:
        "Rojo: detenerse antes de la senda peatonal o de la linea de detencion.",
      variants: [
        {
          prompt: "Que exige la luz roja del semaforo?",
          options: [
            "Detenerse antes de la senda peatonal o linea de detencion",
            "Reducir y pasar si no vienen autos",
            "Detenerse despues de la senda peatonal",
            "Girar siempre a la derecha",
          ],
          correctIndex: 0,
        },
        {
          prompt:
            "Segun el manual, ante luz roja el vehiculo debe detenerse:",
          options: [
            "Antes de la senda peatonal o de la linea de detencion",
            "En medio de la bocacalle",
            "Despues del cruce para liberar la via",
            "Solo si hay peatones visibles",
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "semaphore-red-flashing",
      topic: "Semaforos",
      source: { page: 62, section: "Intersecciones semaforizadas" },
      explanation:
        "Rojo intermitente: detener la marcha antes de la encrucijada y reiniciarla solo cuando exista certeza de que no hay riesgo.",
      variants: [
        {
          prompt:
            "Que indica una luz roja intermitente?",
          options: [
            "Detener la marcha antes de la encrucijada y reiniciar solo sin riesgo",
            "Cruzar con precaucion sin detenerse",
            "Que el semaforo esta averiado y no rige ninguna prioridad",
            "Avanzar con balizas",
          ],
          correctIndex: 0,
        },
        {
          prompt:
            "Con rojo intermitente, cuando puede reiniciarse la marcha?",
          options: [
            "Cuando se tiene certeza de que no existe riesgo de efectuar el cruce",
            "Apenas baja la velocidad de los otros vehiculos",
            "Solo si no hay peatones",
            "Cuando el conductor de atras toca bocina",
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "reaction-time",
      topic: "Velocidad y distancia",
      source: { page: 69, section: "Distancia de detencion" },
      explanation:
        "El tiempo de reaccion es el intervalo entre percibir un estimulo y realizar una accion como respuesta; el manual indica un promedio aproximado de 1 segundo.",
      variants: [
        {
          prompt:
            "Que tiempo de reaccion promedio menciona el manual para quien conduce?",
          options: [
            "Aproximadamente 1 segundo",
            "Aproximadamente 3 segundos",
            "Medio segundo fijo para todas las personas",
            "Depende solo del vehiculo y no de la persona",
          ],
          correctIndex: 0,
        },
        {
          prompt:
            "El tiempo de reaccion se define como:",
          options: [
            "El intervalo entre percibir un estimulo y realizar una accion",
            "El tiempo que tarda el vehiculo en frenar completamente",
            "La distancia que hay con el auto de adelante",
            "El lapso que pasa entre dos semaforos",
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "stopping-distance",
      topic: "Velocidad y distancia",
      source: { page: 70, section: "Distancia de detencion" },
      explanation:
        "La distancia de detencion es la suma de la distancia de reaccion y la distancia de frenado.",
      variants: [
        {
          prompt:
            "Como define el manual la distancia de detencion?",
          options: [
            "La suma de la distancia de reaccion y la distancia de frenado",
            "Solo la distancia recorrida al frenar",
            "La mitad de la distancia de seguridad",
            "La distancia recorrida en un segundo",
          ],
          correctIndex: 0,
        },
        {
          prompt:
            "Si queres calcular la distancia de detencion de un vehiculo, que componentes tenes que sumar?",
          options: [
            "Distancia de reaccion mas distancia de frenado",
            "Distancia de seguridad mas tiempo de reaccion",
            "Velocidad maxima mas distancia lateral",
            "Tiempo de reaccion mas peso del vehiculo",
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "safety-distance",
      topic: "Velocidad y distancia",
      source: { page: 70, section: "Distancia de seguridad" },
      explanation:
        "En terminos generales, la distancia minima de seguridad entre vehiculos debe ser de dos segundos, ajustandola segun clima, calzada y transito.",
      variants: [
        {
          prompt:
            "En terminos generales, cual es la distancia minima de seguridad entre vehiculos segun la ley citada por el manual?",
          options: [
            "Dos segundos",
            "Cinco metros exactos",
            "Medio segundo",
            "Un segundo",
          ],
          correctIndex: 0,
        },
        {
          prompt:
            "El manual indica que la distancia minima de seguridad entre vehiculos, en general, debe medirse como:",
          options: [
            "Dos segundos",
            "Dos metros",
            "Cuatro metros",
            "Diez segundos",
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "minimum-speed",
      topic: "Velocidad",
      source: { page: 72, section: "Velocidades minimas" },
      explanation:
        "Los limites minimos se establecen a la mitad de los limites maximos fijados para cada tipo de arteria.",
      variants: [
        {
          prompt:
            "Como se determinan en general las velocidades minimas segun el manual?",
          options: [
            "A la mitad de los limites maximos fijados para cada arteria",
            "En el mismo valor que la maxima",
            "A criterio de cada conductor",
            "En un tercio de la velocidad maxima",
          ],
          correctIndex: 0,
        },
        {
          prompt:
            "Circular por debajo del limite minimo tambien puede provocar un incidente vial. Ese limite minimo suele ser:",
          options: [
            "La mitad del limite maximo de la arteria",
            "El doble del limite maximo",
            "Siempre 20 km/h",
            "Siempre 10 km/h",
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "precautionary-speed",
      topic: "Velocidad",
      source: { page: 72, section: "Velocidad precautoria" },
      explanation:
        "La velocidad precautoria es la adecuada a las circunstancias y debe permitir mantener el dominio total del vehiculo y detenerlo antes de una colision.",
      variants: [
        {
          prompt:
            "Que caracteriza a la velocidad precautoria?",
          options: [
            "Es la adecuada a las circunstancias y permite detener el vehiculo antes de una colision",
            "Es siempre igual al limite maximo",
            "Es la minima velocidad permitida",
            "Es la usada solamente en autopistas",
          ],
          correctIndex: 0,
        },
        {
          prompt:
            "Segun el manual, incluso por debajo del limite maximo puede existir riesgo si la velocidad:",
          options: [
            "Es inadecuada para las condiciones reales de circulacion",
            "No supera los 30 km/h",
            "Se mantiene constante",
            "Es la misma que la del resto del transito",
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "lights-purpose",
      topic: "Luces",
      source: { page: 66, section: "Uso de luces" },
      explanation:
        "Las luces no solo sirven para iluminar sino tambien para brindar informacion y comunicar de forma eficiente entre vehiculos y peatones.",
      variants: [
        {
          prompt:
            "Segun el manual, cual es una finalidad de las luces del vehiculo ademas de iluminar?",
          options: [
            "Brindar informacion para una comunicacion eficiente con vehiculos y peatones",
            "Aumentar la potencia del motor",
            "Reducir la distancia de frenado",
            "Reemplazar el uso de senales de giro",
          ],
          correctIndex: 0,
        },
        {
          prompt:
            "El manual destaca que las luces del vehiculo sirven para:",
          options: [
            "Iluminar y comunicar",
            "Iluminar y frenar",
            "Señalizar y aumentar la velocidad",
            "Reducir el consumo de combustible",
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "lights-modification",
      topic: "Luces",
      source: { page: 66, section: "Uso de luces" },
      explanation:
        "Esta prohibido modificar tipo y potencia de luces originales o agregar faros no previstos, porque podria transformar un elemento de seguridad en un factor de riesgo.",
      variants: [
        {
          prompt:
            "Que dice el manual sobre modificar el tipo o la potencia de las luces originales?",
          options: [
            "Esta prohibido",
            "Se permite si mejora la vision del conductor",
            "Se permite solo de noche",
            "Se recomienda en avenidas",
          ],
          correctIndex: 0,
        },
        {
          prompt:
            "Por que el manual desaconseja agregar luces no previstas originalmente?",
          options: [
            "Porque puede convertir un elemento de seguridad en un factor de riesgo",
            "Porque consume mas combustible unicamente",
            "Porque hace mas lento al vehiculo",
            "Porque impide usar balizas",
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "pedestrian-no-light",
      topic: "Peatones",
      source: { page: 24, section: "Prioridad peatonal" },
      explanation:
        "En calles sin semaforo se debe ceder siempre el paso a peatones siempre que deseen cruzar.",
      variants: [
        {
          prompt:
            "Que corresponde hacer en calles sin semaforo cuando peatones desean cruzar?",
          options: [
            "Cederles siempre el paso",
            "Pasar primero si no estan sobre la senda",
            "Tocar bocina para advertir",
            "Acelerar para despejar la bocacalle",
          ],
          correctIndex: 0,
        },
        {
          prompt:
            "En una calle sin semaforo, la prioridad peatonal implica:",
          options: [
            "Ceder siempre el paso a peatones que deseen cruzar",
            "Ceder solo si estan a mitad de calzada",
            "Ceder solo de dia",
            "Ceder solo en avenidas",
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "turn-with-pedestrians",
      topic: "Peatones",
      source: { page: 24, section: "Prioridad peatonal" },
      explanation:
        "Si un vehiculo tiene luz verde y va a girar para ingresar a otra via, debe frenar y ceder el paso cuando haya peatones cruzando.",
      variants: [
        {
          prompt:
            "Si tenes luz verde y vas a girar para ingresar a otra via, que corresponde si hay peatones cruzando?",
          options: [
            "Frenar y cederles el paso",
            "Completar el giro antes que ellos",
            "Seguir si el peatón no esta sobre la senda",
            "Tocar bocina y pasar",
          ],
          correctIndex: 0,
        },
        {
          prompt:
            "La luz verde habilita el giro, pero segun el manual si hay peatones cruzando debes:",
          options: [
            "Frenar y cederles el paso",
            "Pasar si no vienen autos",
            "Solo disminuir velocidad",
            "Continuar porque la prioridad es del vehiculo",
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "bike-overtake",
      topic: "Convivencia con ciclistas",
      source: { page: 33, section: "Sobrepaso y recomendaciones" },
      explanation:
        "Para sobrepasar una bicicleta se debe hacerlo por la izquierda y dejar una distancia lateral de 1,5 metros.",
      variants: [
        {
          prompt:
            "Como debe realizarse el sobrepaso de una bicicleta segun el manual?",
          options: [
            "Por la izquierda y dejando 1,5 metros de distancia lateral",
            "Por la derecha y dejando medio metro",
            "Por cualquier lado si no viene nadie",
            "Solo tocando bocina",
          ],
          correctIndex: 0,
        },
        {
          prompt:
            "Que distancia lateral debe dejarse al sobrepasar una bicicleta?",
          options: [
            "1,5 metros",
            "50 centimetros",
            "25 centimetros",
            "No hay distancia minima recomendada",
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "parked-cars-distance",
      topic: "Convivencia con ciclistas",
      source: { page: 32, section: "Distancia de seguridad" },
      explanation:
        "Se recomienda mantener 1,5 metros de los vehiculos estacionados como precaucion ante la posible apertura de puertas.",
      variants: [
        {
          prompt:
            "Que distancia recomienda el manual respecto de los vehiculos estacionados?",
          options: [
            "1,5 metros",
            "30 centimetros",
            "La minima posible",
            "No importa si la calle es ancha",
          ],
          correctIndex: 0,
        },
        {
          prompt:
            "Por que se recomienda mantener 1,5 metros respecto de vehiculos estacionados?",
          options: [
            "Por la posible apertura de puertas",
            "Para ahorrar combustible",
            "Para estacionar mas rapido",
            "Porque lo exige solo en autopistas",
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "alcohol-limit",
      topic: "Alcohol y conduccion",
      source: { page: 90, section: "Limites de alcohol en sangre para conducir" },
      explanation:
        "El manual indica que esta prohibido conducir cualquier tipo de vehiculo con mas de 0,5 gramos de alcohol por litro de sangre en la Ciudad de Buenos Aires, sin perjuicio de otras restricciones segun el caso.",
      variants: [
        {
          prompt:
            "Cual es la regla general de alcohol en sangre que menciona el manual para conducir en CABA?",
          options: [
            "Esta prohibido conducir con mas de 0,5 gramos por litro de sangre",
            "Se permite hasta 1 gramo por litro de sangre",
            "Solo rige para motos",
            "No existe limite general",
          ],
          correctIndex: 0,
        },
        {
          prompt:
            "Segun el manual, conducir cualquier tipo de vehiculo con mas de 0,5 gramos de alcohol por litro de sangre esta:",
          options: [
            "Prohibido",
            "Permitido si el trayecto es corto",
            "Permitido de noche",
            "Permitido solo en avenidas",
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "alcohol-refusal",
      topic: "Alcohol y conduccion",
      source: { page: 91, section: "Negativa a realizar una prueba de alcoholemia" },
      explanation:
        "Ante la negativa a realizar la prueba, la autoridad debe prohibir continuar conduciendo y ordenar la remocion del vehiculo porque se presume estado positivo.",
      variants: [
        {
          prompt:
            "Que ocurre si una persona se niega a realizar una prueba de alcoholemia?",
          options: [
            "Se presume alcoholemia positiva y se ordena la remocion del vehiculo",
            "Puede seguir conduciendo hasta su domicilio",
            "Solo recibe una advertencia verbal",
            "Se toma como resultado negativo",
          ],
          correctIndex: 0,
        },
        {
          prompt:
            "Frente a la negativa a someterse al control de alcoholemia, la autoridad debe:",
          options: [
            "Prohibir continuar conduciendo y remover el vehiculo",
            "Permitir seguir si el conductor firma un acta",
            "Retener solo la documentacion",
            "Dejar pasar si no hay sintomas visibles",
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "seatbelts-all",
      topic: "Seguridad pasiva",
      source: { page: 110, section: "Cinturones de seguridad" },
      explanation:
        "Es obligatorio poseer y utilizar cinturones normalizados; todas las personas deben usarlo en asientos delanteros y traseros.",
      variants: [
        {
          prompt:
            "Quienes deben usar el cinturon de seguridad en un automovil?",
          options: [
            "Todas las personas, adelante y atras",
            "Solo quien conduce y acompaña adelante",
            "Solo menores de edad",
            "Solo en rutas",
          ],
          correctIndex: 0,
        },
        {
          prompt:
            "Segun el manual, el uso del cinturon de seguridad es obligatorio:",
          options: [
            "Para todos los ocupantes del vehiculo",
            "Solo para quienes viajan adelante",
            "Solo a mas de 40 km/h",
            "Solo en trayectos largos",
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "seatbelts-capacity",
      topic: "Seguridad pasiva",
      source: { page: 110, section: "Cinturones de seguridad" },
      explanation:
        "En un auto pueden viajar tantas personas como plazas con cinturones de seguridad existan.",
      variants: [
        {
          prompt:
            "Cuantas personas pueden viajar en un auto segun el manual?",
          options: [
            "Tantas como plazas con cinturon de seguridad existan",
            "Hasta cinco, siempre",
            "Las que entren sentadas",
            "Una mas que la cantidad de cinturones",
          ],
          correctIndex: 0,
        },
        {
          prompt:
            "La capacidad de ocupantes de un automovil, segun el manual, se vincula con:",
          options: [
            "La cantidad de plazas con cinturon de seguridad",
            "El tamaño del baul",
            "La cantidad de puertas",
            "La cilindrada del motor",
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "seatbelts-always",
      topic: "Seguridad pasiva",
      source: { page: 110, section: "Cinturones de seguridad" },
      explanation:
        "El cinturon debe usarse siempre, incluso en trayectos cortos o a baja velocidad.",
      variants: [
        {
          prompt:
            "En que situaciones debe usarse el cinturon de seguridad?",
          options: [
            "Siempre, incluso en trayectos cortos o a baja velocidad",
            "Solo en autopistas y rutas",
            "Solo de noche",
            "Solo cuando hay lluvia",
          ],
          correctIndex: 0,
        },
        {
          prompt:
            "Segun el manual, usar el cinturon en trayectos cortos o a baja velocidad es:",
          options: [
            "Obligatorio",
            "Optativo",
            "Recomendable pero no obligatorio",
            "Necesario solo si viajan menores",
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "fog-inverted-v-one",
      topic: "Conduccion con niebla",
      source: { page: 78, section: "Conduccion en situaciones adversas · Niebla" },
      visual: {
        type: "fog-v",
        count: 1,
        alt: "Demarcacion de niebla con una V invertida visible",
      },
      explanation:
        "Las marcas especiales para niebla usan V invertidas como referencia visual: si solo se distingue una V invertida, la velocidad maxima es de 40 km/h.",
      variants: [
        {
          prompt:
            "En niebla, si desde el vehiculo en marcha solo se distingue una V invertida, cual es la velocidad maxima?",
          options: [
            "40 km/h",
            "60 km/h",
            "La maxima permitida en la via",
            "80 km/h",
          ],
          correctIndex: 0,
        },
        {
          prompt:
            "Que indica una sola V invertida visible en una demarcacion para niebla?",
          options: [
            "Velocidad maxima de 40 km/h",
            "Velocidad minima de 40 km/h",
            "Prohibicion de sobrepaso por 40 metros",
            "Distancia de seguridad de 40 metros",
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "fog-inverted-v-two",
      topic: "Conduccion con niebla",
      source: { page: 78, section: "Conduccion en situaciones adversas · Niebla" },
      visual: {
        type: "fog-v",
        count: 2,
        alt: "Demarcacion de niebla con dos V invertidas visibles",
      },
      explanation:
        "Si se distinguen dos V invertidas en niebla, la velocidad maxima es de 60 km/h.",
      variants: [
        {
          prompt:
            "En niebla, si se distinguen dos V invertidas, cual es la velocidad maxima?",
          options: [
            "60 km/h",
            "40 km/h",
            "La maxima de la via",
            "20 km/h",
          ],
          correctIndex: 0,
        },
        {
          prompt:
            "Segun la demarcacion de V invertidas para niebla, dos V visibles indican:",
          options: [
            "Velocidad maxima de 60 km/h",
            "Velocidad maxima de 40 km/h",
            "Que hay que detenerse completamente",
            "Que se puede circular a la maxima de la via",
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "fog-inverted-v-three",
      topic: "Conduccion con niebla",
      source: { page: 78, section: "Conduccion en situaciones adversas · Niebla" },
      visual: {
        type: "fog-v",
        count: 3,
        alt: "Demarcacion de niebla con tres V invertidas visibles",
      },
      explanation:
        "Si se distinguen tres V invertidas, la velocidad maxima es la permitida en la via.",
      variants: [
        {
          prompt:
            "En niebla, si desde el vehiculo se distinguen tres V invertidas, que velocidad maxima corresponde?",
          options: [
            "La maxima permitida en la via",
            "60 km/h",
            "40 km/h",
            "20 km/h",
          ],
          correctIndex: 0,
        },
        {
          prompt:
            "Tres V invertidas visibles en una zona con niebla significan que:",
          options: [
            "Se puede circular hasta la maxima permitida en la via",
            "Se debe circular como maximo a 40 km/h",
            "La velocidad maxima es 60 km/h",
            "La velocidad minima es la de la autopista",
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "tire-groove-depth",
      topic: "Neumaticos",
      source: { page: 107, section: "Neumaticos" },
      visual: {
        type: "tire-depth",
        alt: "Dibujo de neumatico con referencia de profundidad minima de 1,6 mm",
      },
      explanation:
        "Si el dibujo del neumatico tiene una profundidad menor a 1,6 mm, debe reemplazarse.",
      variants: [
        {
          prompt:
            "Cual es la profundidad minima del dibujo del neumatico indicada para no reemplazarlo?",
          options: [
            "1,6 mm",
            "2,5 mm",
            "3 mm",
            "5 mm",
          ],
          correctIndex: 0,
        },
        {
          prompt:
            "Si el dibujo del neumatico tiene una profundidad menor a 1,6 mm, que corresponde hacer?",
          options: [
            "Reemplazar el neumatico",
            "Inflarlo con mas presion",
            "Usarlo solo en ciudad",
            "Rotarlo al eje trasero",
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "tires-aquaplaning",
      topic: "Neumaticos",
      source: { page: 107, section: "Neumaticos" },
      visual: {
        type: "tire-depth",
        alt: "Dibujo de neumatico que muestra surcos para evacuar agua",
      },
      explanation:
        "Los dibujos del neumatico evacuan el agua de la zona de contacto cuando el pavimento esta mojado, evitando el hidroplaneo o aquaplaning.",
      variants: [
        {
          prompt:
            "Para que sirven los dibujos de los neumaticos cuando el pavimento esta mojado?",
          options: [
            "Para evacuar agua y evitar hidroplaneo o aquaplaning",
            "Para aumentar la velocidad maxima",
            "Para reducir el uso del freno de mano",
            "Para mejorar solo la estetica del vehiculo",
          ],
          correctIndex: 0,
        },
        {
          prompt:
            "Que riesgo aumenta si los neumaticos no evacuan correctamente el agua?",
          options: [
            "Hidroplaneo o aquaplaning",
            "Falla del cinturon de seguridad",
            "Encandilamiento",
            "Bloqueo de la direccion al estacionar",
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "tire-age",
      topic: "Neumaticos",
      source: { page: 107, section: "Neumaticos" },
      explanation:
        "El manual no recomienda usar neumaticos con mas de 5 anos desde su fecha de fabricacion, aunque no parezcan gastados.",
      variants: [
        {
          prompt:
            "Segun el manual, no es recomendable utilizar neumaticos con mas de cuantos anos desde la fecha de fabricacion?",
          options: [
            "5 anos",
            "3 anos",
            "8 anos",
            "10 anos",
          ],
          correctIndex: 0,
        },
        {
          prompt:
            "Por que no se recomiendan neumaticos con mas de 5 anos desde la fecha de fabricacion?",
          options: [
            "Porque pierden flexibilidad y adherencia",
            "Porque aumentan la potencia del motor",
            "Porque dejan de indicar la presion",
            "Porque solo sirven en autopistas",
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "incident-not-accident",
      topic: "Incidentes viales",
      source: { page: 15, section: "Accidente o incidente de transito" },
      explanation:
        "El manual evita llamar accidente a un hecho prevenible: si se puede evitar, no es un accidente.",
      variants: [
        {
          prompt:
            "Por que el manual prefiere hablar de incidentes de transito y no de accidentes?",
          options: [
            "Porque la mayoria son prevenibles y se vinculan con conductas humanas",
            "Porque accidente e incidente son terminos legales identicos",
            "Porque solo aplica a siniestros sin lesiones",
            "Porque incidente significa que no hubo danos",
          ],
          correctIndex: 0,
        },
        {
          prompt:
            "Segun el manual, si un hecho vial se puede evitar, entonces:",
          options: [
            "No es un accidente",
            "No es un incidente",
            "No requiere analisis de causas",
            "No tiene relacion con la conducta",
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "human-risk-factor",
      topic: "Factores de riesgo",
      source: { page: 15, section: "Accidente o incidente de transito" },
      explanation:
        "El manual remarca que la inmensa mayoria de los mal llamados accidentes se produce por errores que cometen las personas.",
      variants: [
        {
          prompt:
            "Cual es el factor de riesgo central que explica la mayoria de los incidentes viales segun el enfoque del manual?",
          options: [
            "El factor humano",
            "El color del vehiculo",
            "La marca del vehiculo",
            "La existencia de carteles informativos",
          ],
          correctIndex: 0,
        },
        {
          prompt:
            "Cuando el manual explica por que los hechos viales son prevenibles, pone el foco principalmente en:",
          options: [
            "Los errores y conductas de las personas",
            "La antiguedad del registro",
            "El tamano de la patente",
            "La cantidad de pasajeros permitidos",
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "vulnerable-users",
      topic: "Usuarios vulnerables",
      source: { page: 144, section: "Usuarios/as vulnerables" },
      explanation:
        "El manual identifica como usuarios mas expuestos a peatones, ciclistas y motociclistas, porque no estan protegidos por carroceria, cinturones o airbags.",
      variants: [
        {
          prompt:
            "Quienes son los usuarios/as mas vulnerables que menciona el manual?",
          options: [
            "Peatones, ciclistas y motociclistas",
            "Autos, camionetas y camiones",
            "Solo peatones",
            "Solo conductores profesionales",
          ],
          correctIndex: 0,
        },
        {
          prompt:
            "Por que peatones, ciclistas y motociclistas son considerados mas vulnerables?",
          options: [
            "Porque no cuentan con carroceria, cinturones o airbags",
            "Porque siempre tienen prioridad normativa absoluta",
            "Porque circulan a mayor velocidad que los autos",
            "Porque no participan del transito",
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "normative-priority-order",
      topic: "Prioridad normativa",
      source: { page: 57, section: "Prioridad normativa" },
      explanation:
        "Ante contradiccion entre normas, primero se respetan las senales u ordenes de la autoridad de control; luego las senales transitorias, semaforos, demarcacion horizontal y senalizacion vertical segun el orden del manual.",
      variants: [
        {
          prompt:
            "Si una norma general permite circular a 100 km/h, pero una senal del tramo indica 80 km/h, que debe respetarse?",
          options: [
            "La senal del tramo, por prioridad normativa",
            "Siempre la velocidad mas alta permitida por ley",
            "La velocidad que el conductor considere segura",
            "La velocidad del vehiculo de adelante",
          ],
          correctIndex: 0,
        },
        {
          prompt:
            "Que significa prioridad normativa?",
          options: [
            "Que ante contradicciones se respeta la norma o senal de mayor prioridad",
            "Que siempre se respeta la regla mas antigua",
            "Que todas las normas valen lo mismo",
            "Que la opinion del conductor decide la prioridad",
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "authority-control",
      topic: "Prioridad normativa",
      source: { page: 57, section: "Prioridad normativa" },
      explanation:
        "El manual incluye a Agentes de Transito, Policia de la Ciudad, personal autorizado de obra y personal autorizado ferroviario como autoridades cuyas indicaciones deben obedecerse.",
      variants: [
        {
          prompt:
            "Ademas de Agentes de Transito y Policia, a que personal autorizado debe obedecer quien conduce?",
          options: [
            "Personal autorizado de obra y ferroviario en la zona correspondiente",
            "Personal de comercios cercanos",
            "Cualquier peatón que indique detenerse",
            "Solo inspectores de estacionamiento",
          ],
          correctIndex: 0,
        },
        {
          prompt:
            "Segun el manual, las indicaciones del personal autorizado ferroviario en su zona:",
          options: [
            "Deben obedecerse como orden de autoridad de control",
            "Son solo recomendaciones",
            "Valen menos que una senal vertical",
            "Solo aplican a trenes, no a conductores",
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "transient-signs",
      topic: "Senales viales",
      source: { page: 58, section: "Senales transitorias" },
      explanation:
        "Las senales transitorias indican trabajos o situaciones temporales, tienen prioridad sobre la senalizacion habitual y su color predominante es naranja.",
      variants: [
        {
          prompt:
            "Que color predomina en las senales transitorias?",
          options: [
            "Naranja",
            "Azul",
            "Verde",
            "Blanco",
          ],
          correctIndex: 0,
        },
        {
          prompt:
            "Las senales transitorias por obras o mantenimiento:",
          options: [
            "Tienen prioridad sobre la senalizacion habitual de la via",
            "Son solo informativas y no modifican la conducta",
            "Valen menos que las marcas de carril",
            "Solo se aplican de noche",
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "special-road-marks",
      topic: "Senales viales",
      source: { page: 58, section: "Demarcacion horizontal y marcas especiales" },
      explanation:
        "Las marcas especiales incluyen flechas, ceda el paso, cruce ferroviario, carril exclusivo y de emergencia, pare y marcas para niebla.",
      variants: [
        {
          prompt:
            "Las marcas para niebla se clasifican dentro de que tipo de demarcacion?",
          options: [
            "Marcas especiales",
            "Marcas longitudinales",
            "Semaforos intermitentes",
            "Senales informativas turisticas",
          ],
          correctIndex: 0,
        },
        {
          prompt:
            "Cual de estos ejemplos aparece como marca especial en el manual?",
          options: [
            "Pare",
            "Cartel de hotel",
            "Nombre de barrio",
            "Numero de linea de colectivo",
          ],
          correctIndex: 0,
        },
      ],
    },
    {
      id: "acceleration-lane",
      topic: "Autopistas",
      source: { page: 77, section: "Conduccion en autopistas y otras vias rapidas" },
      explanation:
        "El carril que permite incorporarse a una autopista o via rapida se conoce como carril de aceleracion.",
      variants: [
        {
          prompt:
            "Como se llama el carril que se utiliza para incorporarse a una autopista?",
          options: [
            "Carril de aceleracion",
            "Carril de detencion",
            "Carril de emergencia",
            "Carril exclusivo",
          ],
          correctIndex: 0,
        },
        {
          prompt:
            "Para ingresar a una autopista y adaptar la velocidad al flujo, se usa el:",
          options: [
            "Carril de aceleracion",
            "Carril de frenado",
            "Carril de estacionamiento",
            "Carril reversible",
          ],
          correctIndex: 0,
        },
      ],
    },
  ];

  return facts.flatMap((fact) =>
    fact.variants.map((variant, index) => ({
      id: `${fact.id}-${index + 1}`,
      topic: fact.topic,
      prompt: variant.prompt,
      options: variant.options,
      correctIndex: variant.correctIndex,
      explanation: fact.explanation,
      source: fact.source,
      factId: fact.id,
      visual: variant.visual ?? fact.visual ?? null,
    }))
  );
};
