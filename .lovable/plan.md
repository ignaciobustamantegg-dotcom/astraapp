

## Fix: Error "getClaims is not a function" en daily-forecast

### Problema
La edge function `daily-forecast` usa `supabase.auth.getClaims(token)` que no existe en `@supabase/supabase-js@2.49.1`. Esto causa un error 500 cada vez que se intenta generar una prevision.

### Solucion
Reemplazar `getClaims()` por `supabase.auth.getUser()` en `supabase/functions/daily-forecast/index.ts`.

### Cambio tecnico

**Archivo:** `supabase/functions/daily-forecast/index.ts`

Reemplazar las lineas 34-40 (bloque getClaims) por:

```typescript
const { data: { user }, error: userError } = await supabase.auth.getUser();
if (userError || !user) {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
const userId = user.id;
```

Esto valida el token JWT correctamente usando el metodo estandar de la libreria y obtiene el `user.id` para las consultas posteriores.

No se requieren cambios en ningun otro archivo.

