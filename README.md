# Circuito ACA Libertador

Demo web base para transformar el recorrido oficial del examen practico de manejo de `ACA Libertador` en una experiencia jugable.

## Que ya deja resuelto

- Un recorrido base cargado con los tramos oficiales de Comuna 14.
- Un modulo `Practico` con Street View, hitos, minimapa y alertas contextuales.
- Un modulo `Teorico` con generacion de examenes de 40 preguntas desde hechos normalizados del manual oficial.
- Dos modos de uso: `estudio` y `examen`.
- Checkpoints, scoring y decisiones por tramo.
- Una capa de alertas viales desacoplada del visor.
- Minimapa interactivo con Google Maps para seguir progreso, posicion y proximo hito.
- `StreetViewPanorama` integrado, con fallback automatico al visor demo si no hay API key o no existe cobertura.
- Una base de `learningMoments` para cruzar escenas exactas del circuito con observacion, conducta esperada y fuente oficial.

## Modulo teorico

La parte teorica vive en archivos separados para no romper el practico:

- [theory-data.js](/Users/nicolasbernaudo/Documents/Playground/circuito-aca-libertador/theory-data.js): hechos del manual y banco base derivado.
- [theory.js](/Users/nicolasbernaudo/Documents/Playground/circuito-aca-libertador/theory.js): generador de examen, UI y scoring.

La idea no es generar preguntas libres en vivo, sino:

1. normalizar hechos del manual;
2. derivar preguntas trazables desde esos hechos;
3. armar un examen distinto de 40 preguntas en cada intento.

## Circuitos configurables

El practico ya esta preparado para que cada recorrido viva como datos separados del motor:

- [circuits/aca-libertador.js](/Users/nicolasbernaudo/Documents/Playground/circuito-aca-libertador/circuits/aca-libertador.js): circuito ACA Libertador actual.
- [circuits/template.js](/Users/nicolasbernaudo/Documents/Playground/circuito-aca-libertador/circuits/template.js): plantilla para crear nuevos recorridos.

Para sumar otro circuito:

1. Copiar `circuits/template.js` con otro nombre.
2. Completar `routeSteps`, `mapRoutePoints`, `contextualMessages` y `mapContextRules`.
3. Agregar el nuevo `<script src="./circuits/nuevo-circuito.js"></script>` en [index.html](/Users/nicolasbernaudo/Documents/Playground/circuito-aca-libertador/index.html), antes de [script.js](/Users/nicolasbernaudo/Documents/Playground/circuito-aca-libertador/script.js).
4. Usar la herramienta de calibracion para capturar `lat`, `lng`, `heading`, `pitch`, `zoom` y `pano`.
5. Probar radios de activacion y copies.

## Como verlo localmente

- Abrir [index.html](/Users/nicolasbernaudo/Documents/Playground/circuito-aca-libertador/index.html)
- O servir la carpeta con cualquier server estatico simple si despues agregamos APIs o assets externos
- Para habilitar Street View, completar `googleMapsApiKey` en [app-config.js](/Users/nicolasbernaudo/Documents/Playground/circuito-aca-libertador/app-config.js)

## Importante

La ruta usada es oficial, pero las alertas puntuales de senales, semaforos, escuelas y prioridades son una **capa preliminar de entrenamiento**. Antes de publicar para usuarios reales hay que validar cada hito con:

1. relevamiento visual del circuito;
2. datos abiertos de CABA;
3. control manual sobre Street View o inspeccion en calle.

## Como enchufarle Street View real

La idea es no rehacer el producto, sino reemplazar el visor abstracto del `index.html` por un contenedor de Google Street View.

### API sugerida

- `Google Maps JavaScript API`
- `StreetViewPanorama`
- `StreetViewService`

### Integracion minima

1. Crear un contenedor `div` para el panorama.
2. Cargar Google Maps JavaScript API con una API key valida.
3. Inicializar `new google.maps.StreetViewPanorama(...)`.
4. Usar `StreetViewService.getPanorama(...)` para buscar una vista cercana a cada hito.
5. Asociar cada `routeStep` a coordenadas, heading y pitch.
6. Disparar overlays propios con la logica actual de `alerts`, `score` y `prompt`.

## Modelo de datos recomendado para produccion

```js
{
  id: "gelly-turn",
  lat: -34.57,
  lng: -58.41,
  panoId: "opcional",
  heading: 120,
  pitch: 0,
  stepType: "turn",
  correctAction: "left",
  alerts: [
    { type: "traffic-light", source: "gcba-dataset", confidence: 0.92 },
    { type: "school", source: "manual-validation", confidence: 0.87 }
  ]
}
```

## Framework educativo

La capa nueva de aprendizaje queda mejor separada del mero checkpoint de giro:

```js
{
  id: "bike-clearance-1",
  stepId: "turn-gelly",
  trigger: { lat: -34.57501, lng: -58.40794 },
  category: "Convivencia",
  title: "Bicicletas y margen lateral",
  observation: "En esta escena aparece una bicicleta sobre el lateral.",
  takeaway: "Reduci, espera espacio y evita pasar pegado.",
  source: {
    document: "Manual oficial de conduccion GCBA",
    section: "Convivencia con ciclistas y sobrepasos",
    quote: "Cita textual oficial a validar para este punto."
  }
}
```

Con esto podemos cargar despues:

1. escenas exactas de Street View;
2. una observacion visual concreta;
3. la regla que queres entrenar;
4. la referencia oficial que la respalda.

## Siguientes pasos recomendados

1. Validar y ajustar las coordenadas y headings de cada hito con Street View real.
2. Levantar un relevamiento exacto del circuito `ACA Libertador`.
3. Reemplazar alertas preliminares por datos validados.
4. Agregar condicion de avance: no pasar de hito hasta responder bien.
5. Agregar reporte final por intento.
6. Duplicar el formato para `Nunez` y `Recoleta`.

## Fuentes tecnicas

- [Street View Service](https://developers.google.com/maps/documentation/javascript/streetview)
- [StreetViewPanorama reference](https://developers.google.com/maps/documentation/javascript/reference/street-view)
- [Street View Containers example](https://developers.google.com/maps/documentation/javascript/examples/streetview-embed)
- [Street View events example](https://developers.google.com/maps/documentation/javascript/examples/streetview-events)
