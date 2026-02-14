
# Integrar Quiz como nueva pantalla

## Resumen
Se integrara el quiz completo del proyecto "love-pattern-break" como una nueva pantalla dentro de la app Astra, accesible desde una nueva ruta `/quiz`.

## Archivos a copiar desde el ZIP

### Componentes del Quiz (17 archivos)
Se copiaran todos los archivos de `src/components/quiz/` al proyecto:
- AudioPlayer.tsx
- BeforeAfter.tsx
- BeforeAfterImages.tsx
- BlurredContent.tsx
- EmailScreen.tsx
- MiniRelato.tsx
- Orbs.tsx
- OrderBump.tsx
- QuestionScreen.tsx
- ResultsScreen.tsx
- SocialProofAvatars.tsx
- SocialProofPopup.tsx
- StartScreen.tsx
- ThermometerGauge.tsx
- TransitionScreen.tsx
- UpsellBanner.tsx
- UrgencyTimer.tsx

### Datos del Quiz (2 archivos)
- `src/data/encouragements.ts`
- `src/data/quizQuestions.ts`

### Hooks (1 archivo)
- `src/hooks/useQuizSounds.ts`

## Nueva pagina
Se creara `src/pages/Quiz.tsx` basado en la pagina Index/Dashboard del proyecto original, que orquesta todos los componentes del quiz.

## Cambios en archivos existentes

### `src/App.tsx`
- Importar la nueva pagina Quiz
- Agregar la ruta `/quiz` (fuera de las rutas protegidas, similar a `/plans`)

## Detalles tecnicos

1. **Extraccion del ZIP**: Se extraeran los archivos del zip y se copiaran a las carpetas correspondientes del proyecto
2. **Ajuste de imports**: Se verificaran y ajustaran los imports para que sean compatibles con la estructura del proyecto actual (usando alias `@/`)
3. **Dependencias**: El proyecto ya cuenta con todas las dependencias necesarias (framer-motion, lucide-react, radix-ui, etc.)
4. **Sin cambios en base de datos**: Esta integracion es puramente frontend, no requiere cambios en el backend
5. **Ruta publica**: El quiz se agregara como ruta publica (`/quiz`) ya que tipicamente es un punto de entrada para nuevos usuarios
