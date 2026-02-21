

## Plan: Creación de cuenta post-checkout con email pre-rellenado

### Contexto actual
- El usuario completa el quiz, ingresa su email (que ya se guarda en la tabla `leads`), ve los resultados, y es redirigido al checkout de Cartpanda.
- Tras el pago, llega a `/post-checkout?order_id=X`, que hace polling hasta confirmar el pago y actualmente redirige a `/app?token=...` (una pagina con token temporal).
- Las rutas protegidas (`/home`, `/journey`, `/profile`) requieren una cuenta Supabase Auth real.
- **Estos dos flujos estan desconectados.** El comprador no tiene cuenta.

### Leads
Los emails del quiz **ya se guardan** en la tabla `leads` vinculados al `session_id`. No hace falta cambiar nada para eso.

### Nuevo flujo propuesto

```text
Quiz -> Email (guardado en leads) -> Resultados -> Cartpanda
  -> /post-checkout?order_id=X (polling)
  -> Pago confirmado
  -> /create-account?email=X&order_id=Y (NUEVA PAGINA)
  -> Usuario crea contrasena (email pre-rellenado, no editable)
  -> Cuenta creada automaticamente
  -> Redirigido a /home
```

### Cambios necesarios

#### 1. Modificar la edge function `verify-order`
- Ademas de devolver `{ ok: true, token }`, tambien devolver el `customer_email` de la orden.
- Esto permite que el frontend sepa que email usar para pre-rellenar.

#### 2. Modificar `PostCheckout.tsx`
- Cuando el pago es confirmado, en vez de redirigir a `/app?token=...`, redirigir a `/create-account?email=EMAIL&token=TOKEN`.
- El email viene de la respuesta de `verify-order`.

#### 3. Crear nueva pagina `/create-account` (`src/pages/CreateAccount.tsx`)
- Pagina con el mismo estilo visual del resto de la app (fondo oscuro, Orbs, etc.).
- Muestra un mensaje de felicitaciones por la compra.
- Campo de email pre-rellenado y deshabilitado (solo lectura), tomado del query param.
- Campo de contrasena (con toggle mostrar/ocultar).
- Campo de nombre (display_name).
- Boton "Criar minha conta".
- Al hacer submit:
  - Llama a `supabase.auth.signUp({ email, password, options: { data: { display_name } } })`.
  - Si el registro es exitoso, vincula la orden con el `user_id` (opcional, via edge function).
  - Redirige a `/home`.

#### 4. Configurar auto-confirm para emails
- Como el usuario ya verifico su email al ingresarlo en el quiz y acaba de pagar, tiene sentido activar auto-confirm para que no tenga que verificar el email de nuevo y pueda acceder inmediatamente.
- Se configurara via la herramienta de auth de Lovable Cloud.

#### 5. Agregar ruta en `App.tsx`
- Agregar `<Route path="/create-account" element={<CreateAccount />} />` como ruta publica.

#### 6. Vincular orden con usuario (opcional pero recomendado)
- Agregar columna `user_id` a la tabla `orders` para vincular la compra con la cuenta creada.
- Crear una edge function `link-order` o hacerlo directamente tras el signup exitoso.

### Seccion tecnica

**Archivos a modificar:**
- `supabase/functions/verify-order/index.ts` - agregar `customer_email` a la respuesta
- `src/pages/PostCheckout.tsx` - cambiar redireccion de `/app?token=` a `/create-account?email=&token=`
- `src/App.tsx` - agregar ruta `/create-account`

**Archivos a crear:**
- `src/pages/CreateAccount.tsx` - nueva pagina de creacion de cuenta

**Migracion de base de datos:**
- Agregar columna `user_id` (uuid, nullable) a la tabla `orders` con foreign key a `auth.users(id)`

**Configuracion:**
- Activar auto-confirm de emails en el sistema de autenticacion

