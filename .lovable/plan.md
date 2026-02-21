

# Agregar script de Cartpanda en la pagina de resultados

## Que se hara

Se cargara dinamicamente el script de tracking de Cartpanda (`cpsales.js`) unicamente en el componente `ResultsScreen`, que es la pagina de ventas donde estan los botones de checkout.

## Detalle tecnico

### Archivo: `src/components/quiz/ResultsScreen.tsx`

Se agregara un `useEffect` que:

1. Crea un elemento `<script>` con `src="https://assets.mycartpanda.com/cartx-ecomm-ui-assets/js/cpsales.js"`
2. Lo agrega al `document.body`
3. Lo remueve al desmontar el componente (cleanup) para evitar duplicados

```text
useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://assets.mycartpanda.com/cartx-ecomm-ui-assets/js/cpsales.js";
  script.type = "text/javascript";
  script.async = true;
  document.body.appendChild(script);
  return () => {
    document.body.removeChild(script);
  };
}, []);
```

No se requieren cambios en otros archivos ni dependencias adicionales.

