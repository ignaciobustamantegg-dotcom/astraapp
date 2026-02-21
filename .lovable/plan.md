
# Ocultar el badge de Cartpanda y restaurar el layout mobile

## Problema
El script `cpsales.js` cargado en `index.html` inyecta un badge visual de "Cartpanda - Secure Order" en la esquina inferior izquierda de **todas** las paginas. Esto rompe el diseno mobile-first de la app.

## Solucion

### 1. `index.html` - Mantener el script (necesario para que Cartpanda lo detecte)
No se toca. El script se queda para que la verificacion de Cartpanda funcione.

### 2. `src/index.css` - Ocultar el badge inyectado por Cartpanda
Agregar una regla CSS que oculte el elemento visual que el script inyecta. Cartpanda suele inyectar un `div` o `iframe` con clases/IDs especificos. Se agregara una regla como:

```css
/* Ocultar badge visual de Cartpanda */
#cartx-secure-badge,
.cartx-secure-badge,
[id*="cartpanda"],
[class*="cartpanda"],
[id*="cartx"],
[class*="cartx"] {
  display: none !important;
}
```

Esto oculta el badge sin afectar el tracking (el script sigue ejecutandose y rastreando eventos de venta normalmente, solo se oculta el elemento visual).

## Notas
- El tracking de Cartpanda seguira funcionando normalmente, solo se oculta el badge visual
- Si Cartpanda usa selectores diferentes, se podra ajustar inspeccionando el elemento inyectado en produccion
