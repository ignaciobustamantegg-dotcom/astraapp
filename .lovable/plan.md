

## Eliminar flash de carga en la pantalla Viaje

### Problema
Cada vez que el usuario navega a `/journey`, el componente `JourneyMap` se monta desde cero. El estado `loading` inicia en `true`, mostrando brevemente el icono de luna pulsante antes de que lleguen los datos de Supabase (milisegundos).

### Solución propuesta

Reemplazar el spinner de luna por un **skeleton/placeholder** que tenga la misma estructura visual que el mapa final. Esto elimina el "flash" perceptible y da una transición mucho más suave.

Alternativas disponibles:

1. **Skeleton del mapa (recomendada):** Mostrar círculos grises y una línea punteada tenue en las mismas posiciones que los nodos, para que cuando carguen los datos reales la transición sea casi imperceptible.

2. **Cache con React Query:** Usar `useQuery` de TanStack (ya instalado) para cachear los datos de `audit_progress` y `profiles`. Tras la primera carga, las navegaciones siguientes mostrarían datos cacheados instantáneamente sin loading.

3. **Combinación de ambas:** Skeleton para la primera visita + cache para las siguientes.

### Cambios técnicos

#### Opcion recomendada: Cache + skeleton ligero

**Archivo: `src/components/JourneyMap.tsx`**
- Reemplazar las llamadas directas a Supabase con `useQuery` de `@tanstack/react-query`
- Usar `staleTime` para evitar re-fetches innecesarios al cambiar de tab
- Cambiar el bloque `if (loading)` por un skeleton sutil: 7 circulos grises con opacidad baja en las posiciones del mapa, en lugar del icono de luna centrado
- La estructura del skeleton reutiliza las mismas constantes `NODE_POSITIONS` y `generatePath()` que ya existen

### Lo que NO cambia
- Diseño visual del mapa final
- Lógica de estados (locked/unlocked/completed)
- Animaciones de los nodos
- AuthContext, ProtectedRoute, MainLayout
- Rutas ni navegacion inferior

