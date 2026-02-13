

## Forzar formato movil en escritorio

Se aplicara un contenedor con `max-width` y centrado en todas las paginas para que la app siempre luzca como un telefono, incluso en pantallas grandes.

### Cambios

1. **`index.html`** - Agregar estilos globales al `body` y al `#root` para centrar y limitar el ancho maximo.

2. **`src/index.css`** - Agregar reglas CSS al `#root`:
   - `max-width: 430px` (ancho tipico de telefono grande)
   - `margin: 0 auto` para centrar horizontalmente
   - `min-height: 100dvh`
   - Sombra lateral sutil en escritorio para darle aspecto de dispositivo
   - Background oscuro en el `body` para que el area fuera del "telefono" se vea separada

3. **`src/App.css`** - Eliminar el `max-width: 1280px` y `padding: 2rem` existentes que interfieren con el nuevo layout.

### Resultado visual

```text
+------ Escritorio ------+
|                         |
|   +--- 430px max ---+   |
|   |                 |   |
|   |   Contenido     |   |
|   |   de la app     |   |
|   |                 |   |
|   +-----------------+   |
|                         |
+-------------------------+
```

### Detalles tecnicos

- El `body` tendra un fondo mas oscuro (`hsl(225, 30%, 4%)`) para contraste
- El `#root` actuara como el "telefono virtual" con el fondo normal de la app
- Se agrega `overflow-x: hidden` al root para evitar scroll horizontal
- No se modifica ninguna pagina individual, el cambio es global

