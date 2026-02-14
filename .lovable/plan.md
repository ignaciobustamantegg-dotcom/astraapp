
## Cambiar el estilo del boton "Ja tenho uma conta"

Se reemplazara el boton outline actual por el estilo con gradiente purpura del boton "Continuar" del Dia 1.

### Cambio en `src/pages/Index.tsx`

El boton "Ja tenho uma conta" actualmente usa el componente `Button` con `variant="outline"` y clases de borde/texto. Se cambiara a un `button` nativo (o se ajustaran las clases) con el mismo gradiente y estilo:

- Fondo: `linear-gradient(135deg, hsl(270, 60%, 65%), hsl(270, 60%, 70%), hsl(275, 55%, 75%))`
- Clases: `w-full h-[52px] rounded-full text-[0.9rem] font-semibold tracking-wide press-scale transition-all duration-300 text-primary-foreground`
- Se mantiene `rounded-full` para consistencia con el boton superior de la misma pantalla

### Detalle tecnico

Se reemplazara el `<Button variant="outline">` envuelto en `<Link>` por un `<Link>` con un `<button>` estilizado inline, manteniendo la navegacion a `/login`.
