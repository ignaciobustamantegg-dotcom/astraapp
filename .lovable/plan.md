

## Corregir contenido vacío y transiciones duplicadas

### Causa raíz

MainLayout envuelve cada ruta en un `motion.div` con `initial={{ opacity: 0 }}`. Pero dentro de las paginas, los elementos hijos tambien arrancan con `opacity: 0`:

- **JourneyMap**: el bloque "Welcome" tiene `initial={{ opacity: 0, y: 12 }}` y cada nodo tiene `initial={{ opacity: 0, scale: 0.8 }}` -- cuando el contenedor padre esta en opacity 0 y los hijos tambien, el contenido queda invisible el doble de tiempo
- **Profile**: tiene un `AnimatePresence mode="wait"` anidado dentro del `AnimatePresence mode="wait"` de MainLayout, causando conflictos de sincronizacion

### Cambios

**`src/components/JourneyMap.tsx`**
- Bloque "Welcome" (linea 96-106): cambiar `motion.div` a `div` simple, eliminar `initial/animate/transition`
- Nodos del mapa (linea 146-150): cambiar `motion.div` a `div` simple, eliminar `initial/animate/transition` con stagger
- Mantener el `motion.div` del skeleton con `exit` (lineas 83-90) -- pero este exit no funciona sin un AnimatePresence que lo envuelva, asi que simplificar a un `div` tambien
- Mantener las animaciones decorativas internas que NO son de entrada (pulse del nodo unlocked)

**`src/pages/Profile.tsx`**
- Eliminar el `AnimatePresence mode="wait"` envolvente (linea 31 y 98)
- Usar renderizado condicional simple: si `loading`, mostrar el spinner en un `div`; si no, mostrar el contenido en un `div`
- Eliminar todos los `motion.div` con `initial/animate/exit` -- la transicion de ruta ya la maneja MainLayout

### Lo que NO cambia
- MainLayout con su AnimatePresence (unica fuente de animacion de ruta)
- Animacion de pulse en el nodo desbloqueado (decorativa, no de entrada)
- Estilos, colores, layout, estructura visual
- BottomNavigation con press-scale

### Resultado esperado
- Al tocar un tab, el contenido aparece inmediatamente (una sola animacion de 0.2s desde MainLayout)
- Sin parpadeo doble ni contenido vacio temporal
- Transicion loader-contenido en Profile es instantanea (sin fade compuesto)
