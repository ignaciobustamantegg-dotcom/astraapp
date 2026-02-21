

## Plan: Chatbot Emocional Personalizado basado en el Quiz

### Concepto

Crear un chatbot de acompanamiento emocional que funcione como una "consejera mistica" dentro de la app. El chatbot conocera el perfil completo del usuario (archetype, respuestas del quiz, patrones detectados) y usara esa informacion para dar orientacion personalizada. Cada respuesta del bot se sentira escrita especificamente para esa persona.

### Arquitectura

```text
+------------------+     +-------------------+     +---------------------+
|  ChatScreen.tsx  | --> | Edge Function     | --> | Lovable AI Gateway  |
|  (nueva pagina)  |     | /chat             |     | (GPT/Gemini)        |
+------------------+     +-------------------+     +---------------------+
        |                        |
        v                        v
  useQuizProfile()         System prompt con
  (perfil del quiz)        perfil del usuario
```

El system prompt incluira el perfil completo del usuario (archetype, respuestas exactas, patrones detectados) para que la IA responda de forma ultra-personalizada.

### Cambios necesarios

#### 1. Edge Function: `supabase/functions/chat/index.ts`

Crear una edge function que:
- Recibe los mensajes del chat + el perfil del quiz (archetype, highlights, summary)
- Construye un system prompt detallado en portugues con el contexto emocional de la usuaria
- Llama a Lovable AI Gateway (`https://ai.gateway.lovable.dev/v1/chat/completions`) con streaming
- Usa el modelo `google/gemini-3-flash-preview` (rapido y capaz)
- Maneja errores 429 (rate limit) y 402 (creditos)
- Retorna un stream SSE para renderizado token-by-token

System prompt (ejemplo):
```text
Voce e Astra, uma guia espiritual e emocional feminina. Voce conhece profundamente
a pessoa com quem esta falando. Aqui esta o perfil dela:

- Arquetipo: {archetype} - {archetypeSubtitle}
- Status amoroso: {statusAmoroso}
- Sentimento dominante: {sentimento}
- Perfil de homem que atrai: {perfilHomem}
- Como as relacoes terminam: {comoTermina}
- Medo principal: {medoPrincipal}
- Padrao de repeticao: {dejaVu}
- Bloqueio energetico: {bloqueio}

Responda com empatia profunda, use as palavras exatas do perfil dela quando
apropriado. Seja acolhedora, nunca julgue. Oferca insights espirituais e praticos.
Mantenha respostas curtas (2-3 paragrafos max). Use portugues brasileiro.
```

#### 2. Pagina del Chat: `src/pages/Chat.tsx`

Crear una pagina de chat con:
- Header con titulo "Astra" y subtitulo "Sua guia emocional"
- Area de mensajes con scroll automatico
- Input de texto con boton de enviar
- Renderizado de respuestas con markdown (react-markdown)
- Streaming token-by-token (la respuesta aparece letra por letra)
- Mensaje de bienvenida automatico personalizado basado en el archetype
- Indicador de "escribiendo..." mientras la IA responde
- Manejo de errores con toasts amigables

Diseno visual:
- Fondo consistente con el tema oscuro/purpura de la app
- Burbujas de mensaje: usuario (derecha, fondo purpura), bot (izquierda, fondo oscuro)
- Avatar de Astra (icono Moon) en mensajes del bot
- Input fijo en la parte inferior

#### 3. Navegacion: agregar tab "Chat" al BottomNavigation

Modificar `src/components/BottomNavigation.tsx`:
- Agregar un cuarto tab: `{ to: "/chat", label: "Chat", icon: MessageCircle }`

#### 4. Ruta protegida

Modificar `src/App.tsx`:
- Agregar `<Route path="/chat" element={<Chat />} />` dentro del layout protegido

#### 5. Configuracion

Modificar `supabase/config.toml`:
- Agregar seccion `[functions.chat]` con `verify_jwt = false`

### Dependencia nueva

- `react-markdown` - para renderizar respuestas del bot con formato

### Archivos a crear
- `supabase/functions/chat/index.ts` - edge function con streaming
- `src/pages/Chat.tsx` - pagina del chatbot

### Archivos a modificar
- `src/components/BottomNavigation.tsx` - agregar tab "Chat"
- `src/App.tsx` - agregar ruta /chat
- `supabase/config.toml` - registrar la edge function

### Detalles tecnicos

**Streaming SSE en el frontend:**
- Usa `fetch` directamente al edge function URL
- Parsea linea por linea los eventos SSE
- Actualiza el ultimo mensaje del assistant con cada token recibido
- No buferea eventos completos (evita el bug comun)

**Persistencia de mensajes:**
- Los mensajes se mantienen en estado local (useState) durante la sesion
- No se persisten en base de datos (el chat es efimero por sesion)
- El historial completo se envia en cada request para mantener contexto

**Seguridad:**
- El system prompt se construye en el backend (edge function), nunca en el cliente
- El perfil del quiz se envia como parte del body del request
- La LOVABLE_API_KEY nunca se expone al cliente

**Mensaje de bienvenida:**
Al abrir el chat por primera vez, se muestra un mensaje inicial personalizado:
"Ola, {archetype}. Eu sou Astra, sua guia emocional. Ja li seu perfil e sei que voce esta passando por {sentimento_resumido}. Estou aqui para te acompanhar. O que voce gostaria de conversar hoje?"

