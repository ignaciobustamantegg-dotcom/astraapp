

# Auditoria Completa del Proyecto Astra

## 1. BUGS Y ERRORES ACTIVOS

### 1.1 Trigger `handle_new_user` no existe en la base de datos
La funcion `handle_new_user` existe como definicion SQL, pero no hay ningun trigger asociado en la base de datos (la consulta `pg_trigger` retorno vacia). Esto significa que cuando un nuevo usuario se registra, NO se crean automaticamente los registros en `profiles` ni en `audit_progress`. El usuario queda sin progreso y sin perfil, lo que causa errores en las pantallas protegidas.

**Correccion:** Crear el trigger que conecte `auth.users` con la funcion.

### 1.2 Console Warning: DayLoadingScreen no acepta refs
El componente `DayLoadingScreen` no usa `React.forwardRef()` pero `DayExperience` intenta pasarle un ref. Genera warnings en consola.

**Correccion:** Envolver `DayLoadingScreen` con `forwardRef` o eliminar el ref innecesario.

### 1.3 Archivo `Checkout.tsx` muerto
`src/pages/Checkout.tsx` todavia existe pero su ruta `/checkout` redirige a `/quiz`. Es codigo muerto.

**Correccion:** Eliminar el archivo y su import residual.

---

## 2. INCONSISTENCIAS DE LOGICA

### 2.1 Pagina Plans con URLs de checkout placeholder
`src/pages/Plans.tsx` tiene URLs de checkout hardcodeadas apuntando a `cartpanda.com/checkout/weekly`, `annual`, `lifetime` (placeholders). El boton "Continuar" redirige a URLs que no existen. Esta pagina es accesible desde la landing.

**Correccion:** O conectar con URLs reales o remover la pagina Plans si el flujo real es solo via quiz.

### 2.2 Tabla `subscriptions` sin uso real
Existe la tabla `subscriptions` con RLS policies, pero ningun codigo del frontend ni de las Edge Functions la usa. Parece un remanente del plan inicial de suscripciones.

**Correccion:** Evaluar si se usara; si no, considerar eliminarla para mantener limpio el esquema.

### 2.3 Dia 7 no protege regresion de progreso
Los Dias 1-6 fueron corregidos para no regresar `current_day`, pero `DayExperience7.tsx` no tiene esa misma proteccion. Si un usuario completa el dia 7 multiples veces, no causa regresion (ya es el ultimo), pero la inconsistencia de codigo es un riesgo de mantenimiento.

**Correccion:** Aplicar el mismo patron defensivo en Dia 7 por consistencia.

### 2.4 Journal se guarda solo en localStorage
Los textos de reflexion del diario de cada dia se guardan unicamente en `localStorage`. Si el usuario cambia de dispositivo o limpia el navegador, pierde todo lo que escribio.

**Correccion:** Persistir las entradas del diario en la base de datos (crear tabla `journal_entries` o agregar columnas JSONB a `audit_progress`).

### 2.5 Rating de estrellas no se persiste
Cuando el usuario completa un dia y da una calificacion (1-5 estrellas), esa calificacion solo existe en estado local y se pierde al navegar.

**Correccion:** Guardar el rating en `audit_progress` (agregar columna `day_X_rating`).

---

## 3. SEGURIDAD

### 3.1 Leaked Password Protection deshabilitada
El linter de Supabase advierte que la proteccion contra contrasenas filtradas esta desactivada. Usuarios pueden registrarse con contrasenas previamente comprometidas.

**Correccion:** Habilitar leaked password protection en la configuracion de autenticacion.

### 3.2 Boton "Esqueceu a senha?" no funciona
En `Login.tsx` linea 116, el boton "Esqueceu a senha?" no tiene `onClick` handler. Es un boton decorativo sin funcionalidad.

**Correccion:** Implementar flujo de recuperacion de contrasena con `supabase.auth.resetPasswordForEmail()`.

### 3.3 SignUp: campo `displayName` no es required
En `SignUp.tsx`, el campo "Nome de usuario" no tiene atributo `required`. Un usuario puede registrarse sin nombre.

**Correccion:** Agregar `required` al input.

### 3.4 Links "Termos de uso" y "Politica de privacidade" en SignUp
En `SignUp.tsx` lineas 126-127, los links a terminos y politica de privacidad son solo `<span>` sin navegacion real. El link de politica de privacidad no lleva a ninguna pagina.

**Correccion:** Convertir en links funcionales a `/terms` y crear pagina de politica de privacidad.

---

## 4. CODIGO DUPLICADO Y MANTENIBILIDAD

### 4.1 Siete archivos DayExperience casi identicos
`DayExperience.tsx` hasta `DayExperience7.tsx` contienen ~90% de codigo identico (la logica de pantallas, el header, el progress bar, el completion screen, el journal). Solo cambian el contenido de `SCREENS` y el numero de dia.

**Correccion:** Extraer un componente generico `DayExperience` que reciba `dayNumber`, `screens[]` y un flag de "ultimo dia". Reducir 7 archivos de ~460 lineas a 1 componente + 7 archivos de datos (~50 lineas cada uno).

### 4.2 Estilos inline repetidos
Los gradientes, sombras y estilos del boton "Continuar" estan copiados identicamente en Login, DayExperience1-7, y JourneyMap. Cualquier cambio visual requiere editar 10+ archivos.

**Correccion:** Extraer estilos a clases CSS reutilizables o un componente `GlowButton`.

---

## 5. UX Y FUNCIONALIDAD FALTANTE

### 5.1 No hay flujo de "Forgot Password"
El boton existe pero no hace nada.

### 5.2 No hay pagina de Politica de Privacidad
Solo existe `/terms`, no hay `/privacy`.

### 5.3 SignUp no redirige despues del registro
Despues del registro exitoso, solo muestra un toast. No redirige al login ni indica claramente los proximos pasos.

### 5.4 La pantalla Home tiene contenido hardcodeado
`Home.tsx` muestra un texto fijo de "resultado" que no se basa en las respuestas del quiz ni en el progreso real del usuario. Es un placeholder.

---

## 6. PLAN DE ACCION RECOMENDADO (por prioridad)

### Prioridad CRITICA
1. Crear el trigger `handle_new_user` en `auth.users` (sin esto el registro de usuarios esta roto)
2. Arreglar o remover la pagina Plans con URLs placeholder

### Prioridad ALTA
3. Implementar flujo "Esqueceu a senha?"
4. Eliminar `Checkout.tsx` (codigo muerto)
5. Fix del warning de forwardRef en DayLoadingScreen
6. Habilitar leaked password protection

### Prioridad MEDIA
7. Persistir journal entries y ratings en la base de datos
8. Agregar `required` al campo displayName en SignUp
9. Hacer funcionales los links de terminos/privacidad en SignUp
10. Crear pagina de Politica de Privacidad

### Prioridad BAJA (Deuda tecnica)
11. Refactorizar DayExperience1-7 en un componente generico
12. Extraer estilos repetidos a componentes/clases reutilizables
13. Eliminar tabla `subscriptions` si no se usara
14. Aplicar patron defensivo de progreso en Dia 7

---

## Detalles tecnicos de implementacion

### Trigger handle_new_user
```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

### Componente GlowButton reutilizable
Extraer a `src/components/ui/glow-button.tsx` con props para texto, onClick, disabled, y variantes.

### Refactor DayExperience
Crear `src/components/DayExperienceShell.tsx` con la logica comun y `src/data/dayScreens.ts` con el contenido de cada dia.

### Journal persistence
Agregar tabla `journal_entries(id, user_id, day_number, content, created_at, updated_at)` con RLS policy `auth.uid() = user_id`.

### Rating persistence
Agregar columnas `day_1_rating` ... `day_7_rating` (smallint) a `audit_progress`.

