

# Fix: Vincular quiz submissions al usuario autenticado

## Problema raiz

Las respuestas del quiz se guardan en `quiz_submissions` con `session_id` pero sin `user_id`. La vinculacion solo se intenta en `CreateAccount.tsx`, pero:

1. La RLS policy de UPDATE tiene un `WITH CHECK (auth.uid() = user_id)` que rechaza el update porque el `user_id` actual es `NULL` y el nuevo valor es el uid del usuario -- Postgres evalua `auth.uid() = user_id` sobre la fila **resultante**, no la original, pero el `USING` clause solo verifica `session_id IS NOT NULL`, lo cual deberia pasar. Sin embargo, el update se ejecuta con `.then(() => {})` que traga cualquier error silenciosamente.
2. Si el usuario entra por Login en vez de CreateAccount, la vinculacion nunca ocurre.
3. Si el `session_id` en localStorage cambio entre el quiz y la creacion de cuenta, no hay match.

Resultado: `quiz_submissions` tiene `user_id = NULL` para todas las filas, y `useQuizProfile` (que filtra por `user_id`) siempre devuelve vacio, mostrando el fallback generico.

## Solucion

### 1. Agregar vinculacion en Login.tsx

Replicar la misma logica de vinculacion de `CreateAccount.tsx` en `Login.tsx`, para que tambien se intente vincular quiz submissions cuando un usuario existente inicia sesion.

### 2. Agregar vinculacion en AuthContext/PostCheckout

Agregar un efecto en el AuthContext (o un hook dedicado) que al detectar un usuario autenticado, intente vincular las quiz_submissions del `session_id` actual si no tienen `user_id`. Esto cubre todos los flujos de entrada.

### 3. Mejorar el manejo de errores

Cambiar los `.then(() => {})` por `.then(({ error }) => { if (error) console.warn(...) })` para diagnosticar fallos de vinculacion.

### 4. Fix manual: vincular los datos existentes

Ejecutar una query SQL para vincular las quiz submissions existentes al usuario actual. Esto arregla los datos ya en la base de datos para que la pantalla Home muestre el perfil correcto inmediatamente.

## Detalle tecnico

### AuthContext.tsx -- Hook de vinculacion automatica

Dentro del listener `onAuthStateChange`, cuando el evento sea `SIGNED_IN`, ejecutar:

```text
1. Obtener session_id de localStorage
2. Si existe session_id:
   - UPDATE quiz_submissions SET user_id = auth.uid()
     WHERE session_id = :sessionId AND user_id IS NULL
3. Log warning si falla
```

### Login.tsx -- Agregar vinculacion post-login

Despues del `signInWithPassword` exitoso, agregar la misma logica que ya existe en CreateAccount:

```text
const sessionId = getSessionId();
const { error } = await supabase
  .from("quiz_submissions")
  .update({ user_id: userId })
  .eq("session_id", sessionId)
  .is("user_id", null);
if (error) console.warn("Link quiz error:", error);
```

### Fix de datos existentes

Ejecutar via SQL para vincular las submissions huerfanas del usuario actual:

```text
UPDATE quiz_submissions
SET user_id = '015307e8-3085-414c-a2d2-fe082b9d70dc'
WHERE session_id = '5741c2dd-b6bc-4a42-a0f0-97672592dd54'
  AND user_id IS NULL;
```

### Resultado esperado

- Al iniciar sesion (login o crear cuenta), las quiz submissions se vinculan automaticamente al usuario.
- La pantalla Home muestra el perfil personalizado basado en las respuestas del quiz.
- Los datos existentes se corrigen para que funcione de inmediato.

