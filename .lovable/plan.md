

# Eliminar bloque de texto duplicado en la Previsao Diaria

## Problema
Debajo del hero card con la imagen de fondo aparece un segundo bloque (lineas 200-215 de `ForecastResult.tsx`) que repite el texto completo de la previsao en un recuadro oscuro. Es redundante y rompe la estetica de la pantalla.

## Solucion
Eliminar ese bloque "Full text card" por completo del componente `ForecastResult.tsx`. El texto ya se muestra dentro del hero card (primeras 30 palabras con preview, y word-highlight cuando se reproduce el audio).

## Cambio tecnico

**Archivo:** `src/components/forecast/ForecastResult.tsx`

- Eliminar el bloque `motion.div` del "Full text card" (lineas 200-215).
- La seccion de "Leituras Guiadas" quedara inmediatamente despues del hero card, creando un flujo visual mas limpio.

Es un cambio de una sola eliminacion, sin efectos secundarios.

