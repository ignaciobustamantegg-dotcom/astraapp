

## Problema

Actualmente, toda la pantalla del Día 1 y Día 2 se puede hacer scroll porque el contenedor principal en `MainLayout` permite scroll libre (`overflow-y-auto`). Esto causa que el header (con la barra de progreso), el botón inferior y el fondo se muevan juntos, dejando ver un espacio de color diferente debajo.

## Solución

Cambiar la estructura para que:
- El **header** (flecha, título, barra de progreso) quede **fijo arriba**
- El **botón** quede **fijo abajo**
- Solo el **área de texto** en el medio haga scroll cuando el contenido no quepa en pantalla

## Cambios técnicos

### 1. `src/pages/DayExperience.tsx` y `src/pages/DayExperience2.tsx`

- Cambiar el contenedor principal de `min-h-full` a `h-full` con `overflow-hidden` para que ocupe exactamente el espacio disponible sin crecer más
- Mantener el header y el botón como secciones fijas (sin scroll)
- Agregar `overflow-y-auto` y la clase `no-scrollbar` solo al área de contenido central (el `div` con `flex-1`) para que únicamente esa zona haga scroll cuando el texto lo necesite
- Cambiar `justify-center` por `justify-start` en el área de contenido para que el texto fluya desde arriba cuando hay scroll

Esto aplica el mismo cambio en ambos archivos (Día 1 y Día 2) para mantener consistencia.

