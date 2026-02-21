

# Ocultar elementos de Cartpanda que no tienen selectores identificables

## Problema
El script de Cartpanda inyecta dos `div` directamente en `<body>` **sin clases ni IDs**. Los selectores CSS actuales (`[id*="cartpanda"]`, `[class*="cartx"]`, etc.) no los detectan porque estos elementos no tienen esos atributos.

Los elementos inyectados son:
- `body > div:nth-child(2)` -- el logo de Cartpanda con "SECURE ORDER" y el candado
- `body > div:nth-child(3)` -- la barra blanca con texto de copyright

## Solucion

### Archivo: `src/index.css`

Reemplazar el bloque CSS actual (lineas 272-280) con selectores mas agresivos que capturen cualquier `div` hijo directo de `body` que **no sea** `#root`:

```css
/* Ocultar badge visual de Cartpanda */
#cartx-secure-badge,
.cartx-secure-badge,
[id*="cartpanda"],
[class*="cartpanda"],
[id*="cartx"],
[class*="cartx"],
body > div:not(#root) {
  display: none !important;
}
```

El selector `body > div:not(#root)` oculta cualquier `div` inyectado directamente en `body` que no sea el contenedor principal de la app. Esto cubre los elementos de Cartpanda sin importar si tienen clases/IDs o no.

## Riesgo
Si algun otro script (analytics, chat widget, etc.) inyecta `div` directamente en `body`, tambien quedaria oculto. Actualmente el unico script externo es el de Cartpanda, asi que no hay conflicto.

