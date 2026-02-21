

# Mover script de Cartpanda al index.html

## Problema
Cartpanda escanea el HTML de la pagina `https://astraapp.lovable.app/quiz` buscando su script de tracking, pero como se carga dinamicamente con JavaScript (via `useEffect`), no lo encuentra en el codigo fuente inicial.

## Solucion
Mover el script del componente `ResultsScreen.tsx` al archivo `index.html` para que este presente en el HTML desde el primer momento.

## Cambios

### 1. `index.html`
- Agregar `<script type="text/javascript" src="https://assets.mycartpanda.com/cartx-ecomm-ui-assets/js/cpsales.js"></script>` antes del cierre de `</body>`

### 2. `src/components/quiz/ResultsScreen.tsx`
- Eliminar el `useEffect` que carga el script dinamicamente, ya que no sera necesario

