

## Problema

El `MainLayout` agrega `pb-14` (padding inferior) al área de contenido para dejar espacio para la barra de navegación inferior. Cuando las pantallas del Día 1 y Día 2 usan `h-full`, se dimensionan al espacio disponible, pero ese padding de 14 (56px) queda debajo del botón con el color del fondo del MainLayout (marrón/cálido), no el púrpura de la experiencia.

## Solución

Hacer que las páginas de DayExperience ignoren ese padding inferior, ocupando todo el espacio visual disponible incluyendo el área detrás de la barra de navegación.

## Cambios técnicos

### 1. `src/pages/DayExperience.tsx` y `src/pages/DayExperience2.tsx`

- Cambiar el contenedor principal de `h-full` a `min-h-[calc(100dvh-3rem)]` (descontando solo el header de 3rem/48px del MainLayout)
- Agregar `mb-[-3.5rem]` (margin-bottom negativo) para que el fondo púrpura se extienda sobre el padding inferior del layout
- Alternativamente, una solución más limpia: cambiar de `h-full` a usar `fixed inset-0` o hacer que el componente se posicione de forma absoluta cubriendo toda la pantalla, con un `pt` para compensar el header del MainLayout

### Enfoque preferido (más limpio)

Cambiar el contenedor principal en ambos archivos para que use posicionamiento fijo (`fixed inset-0`) con `z-20` para cubrir toda la pantalla incluyendo la barra de navegación inferior, ya que durante la experiencia del día no se necesita la navegación inferior. Esto elimina completamente el problema de colores diferentes.

- Contenedor: `fixed inset-0 z-20 flex flex-col overflow-hidden`
- Se mantiene el gradiente púrpura cubriendo toda la pantalla
- El header propio de la experiencia (con flecha atrás y progreso) se mantiene arriba
- El botón se mantiene abajo
- La barra de navegación inferior queda oculta detrás

