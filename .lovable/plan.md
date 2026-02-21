

## Animacion de revelacion y audio sincronizado con highlight de palabras

### Que se va a hacer

1. **Animacion de revelacion mejorada (Step 5)**: Reemplazar la animacion actual de transicion por una mas elaborada con particulas de luz que convergen, pulsos de energia expandiendose, y texto mistico que cambia. Durara ~3.5 segundos antes de revelar el resultado.

2. **Auto-play del audio al aparecer la lectura**: Cuando se muestra el resultado (Step 6), automaticamente se solicita y reproduce el audio sin que el usuario tenga que presionar un boton.

3. **Highlight palabra por palabra sincronizado con el audio**: El texto de la prevision se renderiza palabra por palabra. A medida que el audio avanza, la palabra actual se resalta con un efecto de brillo/glow mientras las ya leidas se muestran normales y las pendientes aparecen con opacidad reducida.

### Detalles tecnicos

**Archivo: `src/pages/DailyForecast.tsx`**

- Agregar estados: `currentWordIndex`, `words[]`, `audioReady`, `revealPhase`
- Reemplazar el Step 5 (transicion) con una animacion mas elaborada usando framer-motion: circulos concentricos que pulsan, particulas flotantes con `motion.div`, texto que cambia entre frases misticas
- En Step 6:
  - Al montar, llamar automaticamente a `playAudio()` 
  - Parsear `forecastText` (sin markdown) en un array de palabras
  - Usar el evento `timeupdate` del `<audio>` para calcular `currentWordIndex = Math.floor((currentTime / duration) * words.length)`
  - Renderizar cada palabra como un `<span>` con clases dinamicas:
    - Palabras ya dichas: opacidad completa, color normal
    - Palabra actual: brillo/glow con `text-primary` y una sutil animacion de escala
    - Palabras pendientes: `opacity-40`
  - Mantener el boton de pausa/play manual como control secundario
  - Si el audio falla, mostrar todo el texto normalmente sin highlight

**Archivo: `src/pages/DailyForecast.tsx` - Animacion de revelacion**

- Fase 1 (0-1.5s): Orbe central crece con pulsos de luz concentricos
- Fase 2 (1.5-3s): Particulas convergen hacia el centro, texto "Sua previsao esta pronta..."
- Fase 3 (3-3.5s): Flash de luz y transicion al resultado

No se requieren cambios en el backend ni en la edge function de audio.

