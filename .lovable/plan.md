

## Centrar el zigzag del mapa sin perder el movimiento

### Problema
Los nodos del mapa tienen posiciones horizontales `[50, 30, 70, 40, 65, 35, 50]` que generan el zigzag deseado, pero el conjunto completo esta desplazado ligeramente a la derecha. Esto ocurre porque:
- Las posiciones no estan balanceadas respecto al centro (el rango va de 30 a 70, con mas peso hacia la derecha)
- El calculo `(x / 100) * 380` dentro de un viewBox de 400 introduce un offset de 10px hacia la izquierda

### Solucion

Rebalancear las posiciones horizontales para que el zigzag este visualmente centrado, manteniendo la misma amplitud y movimiento organico.

### Cambios tecnicos

**Archivo: `src/components/JourneyMap.tsx`**
- Ajustar `NODE_POSITIONS` a valores centrados: `[50, 28, 72, 38, 68, 32, 50]` -- misma amplitud de zigzag pero simetricamente distribuidos alrededor de 50
- Cambiar el calculo de X de `(x / 100) * 380` a `(x / 100) * 400` para usar el viewBox completo y eliminar el offset lateral

**Archivo: `src/components/JourneyMapSkeleton.tsx`**
- Aplicar los mismos cambios a las constantes y calculo de posiciones para que el skeleton coincida con el mapa real

### Lo que NO cambia
- La sensacion de zigzag y movimiento organico
- El espaciado vertical entre nodos
- Los estilos, colores, animaciones
- La logica de estados (locked/unlocked/completed)
- Ningun otro archivo

