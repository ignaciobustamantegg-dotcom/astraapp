

## Centrar el mapa desplazando todas las posiciones a la izquierda

### Diagnostico

Dia 1 esta en posicion 50 (que deberia ser el centro exacto) pero aparece visualmente desplazado a la derecha. Esto indica un offset sistematico que afecta a todos los nodos por igual, probablemente causado por la interaccion entre el padding del contenedor (`px-3`) y el posicionamiento absoluto.

### Solucion

Restar 5 puntos a cada posicion horizontal para compensar el offset visual. Dia 1 pasa de 50 a 45, que deberia quedar en el centro visual real.

Posiciones actuales: `[50, 28, 72, 38, 68, 32, 50]`
Posiciones nuevas:  `[45, 23, 67, 33, 63, 27, 45]`

La amplitud del zigzag se mantiene identica (diferencia de ~40 entre extremos).

### Cambios tecnicos

**`src/components/JourneyMap.tsx`** (linea 19)
- Cambiar `NODE_POSITIONS` de `[50, 28, 72, 38, 68, 32, 50]` a `[45, 23, 67, 33, 63, 27, 45]`

**`src/components/JourneyMapSkeleton.tsx`** (linea 3)
- Mismo cambio para mantener consistencia entre skeleton y mapa real

### Lo que NO cambia
- Amplitud y forma del zigzag
- Espaciado vertical, estilos, colores, animaciones
- Logica de estados ni ningun otro archivo

