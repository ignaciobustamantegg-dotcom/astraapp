

## Eliminar animaciones de entrada duplicadas en las páginas

### Problema

Al agregar `AnimatePresence` en `MainLayout.tsx` para animar transiciones de ruta, las animaciones de entrada quedaron duplicadas:

- **Nivel 1 (MainLayout):** `opacity: 0 -> 1`, `y: 10 -> 0` en 0.2s
- **Nivel 2 (cada pagina):** `opacity: 0 -> 1`, `y: 12 -> 0` en 0.5s

Esto causa un "parpadeo doble" visible al cambiar de tab.

### Solucion

Dejar que **solo MainLayout** maneje la animacion de entrada/salida entre rutas. Eliminar las animaciones de entrada redundantes dentro de cada pagina.

### Cambios tecnicos

**`src/pages/Home.tsx`**
- Reemplazar `<motion.div initial/animate/transition>` por un `<div>` simple
- La animacion de entrada ya la maneja MainLayout

**`src/pages/Profile.tsx`**
- En el bloque de contenido (key="content"), quitar `initial={{ opacity: 0, y: 12 }}` y `animate`
- Cambiar `motion.div` a `motion.div` sin animacion de entrada (solo mantener el key para AnimatePresence del loader)
- Mantener el `AnimatePresence` interno que gestiona la transicion loader -> contenido, pero sin animar la entrada del contenido con opacity/y (solo con opacity para el crossfade con el loader)

**`src/components/JourneyMap.tsx`**
- Quitar el `motion.div` wrapper del contenido principal que tiene `initial={{ opacity: 0 }}` y `animate={{ opacity: 1 }}`
- Mantener el `motion.div` del skeleton con `exit={{ opacity: 0 }}` para la transicion loader -> contenido
- Mantener las animaciones internas de los nodos (staggered) ya que son decorativas, no de entrada de pagina

### Lo que NO cambia
- AnimatePresence en MainLayout (es la unica fuente de animacion de ruta)
- Animaciones internas decorativas (nodos del mapa, stagger)
- Transiciones loader -> contenido (solo fade del skeleton)
- Estilos, colores, layout

### Resultado esperado
Una sola animacion de 0.2s al cambiar de tab, sin parpadeo doble.
