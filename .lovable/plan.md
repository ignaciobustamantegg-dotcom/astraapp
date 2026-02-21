

## Plan: Corregir flash visual en /journey y agregar animacion de carga estetica

### Problema identificado

El componente `JourneyMap` tiene **dos queries** que cargan en paralelo:
1. `profileData` (display_name) - **no tiene control de loading**
2. `progressData` (current_day) - **solo este controla el skeleton**

Cuando `profileData` resuelve antes o despues que `progressData`, el componente renderiza parcialmente, causando un "destello" visual. Ademas, el skeleton actual (`JourneyMapSkeleton`) es muy basico (circulos grises pulsantes).

### Solucion

#### 1. Unificar estados de carga

Modificar `JourneyMap.tsx` para que el skeleton se muestre hasta que **ambas queries** hayan resuelto:

```
const isFullyLoaded = !isLoadingProfile && !isLoadingProgress;
if (!isFullyLoaded) return <JourneyMapSkeleton />;
```

#### 2. Redisenar JourneyMapSkeleton con animacion estetica

Reemplazar el skeleton actual por una animacion de carga elegante que incluya:
- Los orbes ambiéntales del tema (reutilizando el componente `Orbs`)
- Circulos concentricos giratorios (similar a `TransitionScreen`)
- Un texto sutil como "Preparando sua jornada..."
- Barra de progreso con gradiente purpura-turquesa
- Transicion suave (fade) al contenido real cuando los datos esten listos

#### 3. Agregar transicion suave al contenido

Envolver el contenido del mapa en un wrapper con `animate-fade-in` para que al desaparecer el skeleton, el mapa aparezca de forma suave sin saltos visuales.

### Archivos a modificar

- **`src/components/JourneyMap.tsx`**: Extraer `isLoading` de ambas queries y unificar la condicion de carga
- **`src/components/JourneyMapSkeleton.tsx`**: Redisenar con animacion de carga elegante (orbes + circulos giratorios + texto + barra de progreso)

### Detalles tecnicos

**JourneyMap.tsx** - cambios:
- Agregar `isLoading: isLoadingProfile` a la query de `profileData`
- Cambiar condicion: `if (isLoadingProfile || isLoadingProgress) return <JourneyMapSkeleton />`

**JourneyMapSkeleton.tsx** - rediseno completo:
- Importar y usar el componente `Orbs` existente para el fondo
- Animacion central: circulos concentricos con `animate-spin-slow` (ya definido en CSS)
- Punto central con `animate-breathe` (ya definido en CSS)
- Texto "Preparando sua jornada..." con `animate-fade-in-up`
- Barra de progreso animada con gradiente `hsl(270 50% 72%) -> hsl(200 60% 65%)`
- Altura minima para evitar saltos de layout: `min-h-[80vh]`

