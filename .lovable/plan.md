

# Fix: Audio de Previsao Diaria -- Desactivar Autoplay + Cachear Audio

## Problemas Identificados

1. **Autoplay**: Cada vez que se monta `ForecastResult`, el `useEffect` (linea 40-90) llama a ElevenLabs y ejecuta `audio.play()` automaticamente.
2. **Doble voz**: Si el componente se monta dos veces (React StrictMode o re-render de AnimatePresence), se crean dos instancias de audio simultaneas.
3. **Creditos extra**: Cada visita a la pantalla genera una nueva llamada a ElevenLabs (no hay cache). Un usuario que refresca 5 veces gasta 5x creditos.

## Solucion

### 1. Desactivar autoplay (ForecastResult.tsx)

- Cambiar el estado inicial de `audioState` de `"loading"` a `"idle"` (nuevo estado).
- Eliminar el `useEffect` que llama automaticamente a `fetchAndPlay()`.
- Mostrar el texto completo desde el inicio (sin esperar audio).
- Agregar un boton "Ouvir previsao" que inicia la carga y reproduccion del audio solo cuando el usuario lo presiona.

### 2. Cachear audio en storage (daily-forecast-audio edge function)

- Modificar la funcion `daily-forecast-audio` para:
  - Recibir un `userId` y `forecastDate` adicionales (ademas de text/guide).
  - Antes de llamar a ElevenLabs, verificar si ya existe un archivo en el bucket `guided-readings-audio` con path `forecasts/{userId}/{date}.mp3`.
  - Si existe: devolver el archivo desde storage directamente.
  - Si no existe: generar el audio con ElevenLabs, subirlo a storage, y luego devolverlo.
- El frontend pasara el token de auth para extraer el userId en el backend.

### 3. Prevenir doble voz (ForecastResult.tsx)

- Al hacer el audio on-demand (con boton), se elimina la posibilidad de doble instancia por mount/remount.
- Adicionalmente, agregar una ref `isFetchingRef` para evitar llamadas duplicadas si el usuario hace doble click.

## Detalle Tecnico

### ForecastResult.tsx -- Cambios clave

```text
Estado inicial: "idle" (texto visible, sin audio)
                     |
       Usuario presiona "Ouvir previsao"
                     |
              Estado: "loading" (spinner en boton)
                     |
         Fetch audio desde edge function
         (que primero busca en cache/storage)
                     |
              Estado: "playing" (word highlight activo)
                     |
         Termina -> "ended" | Pausa -> "paused"
```

- Estado `"idle"`: muestra texto completo + boton de play. Sin llamada a ningun API.
- Estado `"loading"`: boton con spinner mientras se carga el audio.
- Estados `"playing"`, `"paused"`, `"ended"`: igual que ahora pero iniciados por el usuario.
- Estado `"error"`: texto visible, boton de reintentar.

### daily-forecast-audio/index.ts -- Cache en storage

- Usar `createClient` con `SUPABASE_SERVICE_ROLE_KEY` para acceder a storage.
- Path del cache: `forecasts/{userId}/{YYYY-MM-DD}.mp3`.
- Flujo:
  1. Verificar si existe en storage bucket `guided-readings-audio`.
  2. Si existe: descargar y devolver como `audio/mpeg`.
  3. Si no existe: llamar ElevenLabs, subir resultado a storage, devolver audio.
- Requiere recibir auth header para extraer userId, o recibirlo como parametro.

### Resultado

- El audio nunca suena automaticamente al entrar a la pantalla.
- El audio de cada previsao diaria se genera maximo UNA vez por usuario por dia.
- No hay posibilidad de doble voz porque la reproduccion es manual.
- Los creditos de ElevenLabs se consumen solo en la primera escucha del dia.

