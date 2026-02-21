

## Plan: Limitar la Previsao Diaria a una por dia por usuario

### Concepto

Agregar persistencia y validacion para que cada usuario solo pueda generar **una prevision por dia**. Si ya hizo una hoy, se le muestra la prevision guardada en lugar del flujo de seleccion.

### Cambios necesarios

#### 1. Nueva tabla: `daily_forecasts`

Crear una tabla para almacenar las previsiones generadas:

```text
daily_forecasts
- id (uuid, PK)
- user_id (uuid, NOT NULL) 
- forecast_date (date, NOT NULL, default: CURRENT_DATE)
- emotion (text)
- energy (text)
- intention (text)
- guide (text)
- forecast_text (text)
- created_at (timestamptz)
- UNIQUE(user_id, forecast_date)  <-- impide duplicados
```

RLS policies:
- SELECT: `auth.uid() = user_id`
- INSERT: `auth.uid() = user_id`
- No UPDATE ni DELETE

#### 2. Edge function `daily-forecast` — validacion backend

Antes de generar la prevision, la edge function:
1. Recibe el JWT del usuario (Authorization header)
2. Consulta `daily_forecasts` para ver si ya existe un registro para ese `user_id` + fecha de hoy
3. Si ya existe, retorna `{ already_exists: true, text: "..." }` con la prevision guardada
4. Si no existe, genera la prevision con IA, la guarda en la tabla y retorna el texto

#### 3. Frontend `DailyForecast.tsx` — logica de verificacion

Al cargar la pagina:
1. Consultar `daily_forecasts` filtrando por `user_id` y `forecast_date = hoy`
2. Si hay resultado, saltar directamente al Step 6 (resultado) mostrando la prevision guardada
3. Si no hay resultado, mostrar el flujo normal desde Step 0

Mostrar un mensaje sutil tipo "Sua previsao de hoje ja foi revelada" cuando se muestra una prevision guardada, con indicacion de cuando estara disponible la proxima (manana).

#### 4. Archivos afectados

**Migracion SQL:**
- Crear tabla `daily_forecasts` con constraint UNIQUE y politicas RLS

**Archivos a crear (como parte de la implementacion principal):**
- `src/pages/DailyForecast.tsx` — incluira la logica de verificacion al montar
- `supabase/functions/daily-forecast/index.ts` — incluira validacion de duplicado + guardado

**Archivos a modificar:**
- `src/App.tsx` — agregar ruta (ya estaba en el plan original)
- `src/components/BottomNavigation.tsx` — agregar tab (ya estaba en el plan original)
- `supabase/config.toml` — registrar functions (ya estaba en el plan original)

### Nota

Este plan se incorpora al plan original de Previsao Diaria que ya fue aprobado. Ambos se implementaran juntos: el flujo completo + la restriccion de una prevision por dia.

