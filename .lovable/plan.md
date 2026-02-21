

## Plan: Rediseno de /home con resultados dinamicos del quiz

### Situacion actual

- Las respuestas del quiz **ya se guardan** en la tabla `quiz_submissions` con el formato `{0: 2, 1: 1, 2: 0, ...}` donde la clave es el indice de la pregunta y el valor es el indice de la respuesta seleccionada.
- Estan vinculadas a un `session_id` (generado en localStorage), pero **no hay vinculo** entre `session_id` y `user_id`.
- La pagina `/home` actual es estatica: muestra un texto fijo sin usar las respuestas del quiz.

### Cambios necesarios

#### 1. Vincular quiz con usuario (migracion de BD)

Agregar columna `user_id` (uuid, nullable) a la tabla `quiz_submissions` para poder consultar las respuestas del quiz desde la cuenta autenticada.

#### 2. Vincular session al crear cuenta

En `CreateAccount.tsx`, despues del signup exitoso, hacer un UPDATE en `quiz_submissions` para asignar el `user_id` a las submissions que pertenezcan al `session_id` actual (que esta en localStorage).

#### 3. Sistema de etiquetado + texto dinamico (combinacion de opciones 2 y 3)

Crear un archivo `src/data/quizProfile.ts` que:

- Define etiquetas para cada respuesta de cada pregunta (ej: pregunta 5, opcion 0 = "frio_indisponivel")
- Tiene una funcion `buildProfile(answers)` que:
  - Recorre las respuestas
  - Acumula etiquetas
  - Determina un "perfil dominante" basado en las mas frecuentes
  - Genera textos dinamicos usando las palabras exactas del quiz
- Define plantillas de texto que usan variables como `{status_amoroso}`, `{patron_dominante}`, `{mayor_miedo}`, etc.

#### 4. Redisenar `/home` (CreateAccount -> Home)

La nueva pagina `/home` sera:

```
Seccion 1: Titulo personalizado
"Seu Perfil: [Nombre del arquetipo generado]"
Subtitulo con frase de impacto basada en respuestas

Seccion 2: Resumo personalizado
Parrafo que combina las respuestas elegidas usando las mismas palabras del quiz.
Ejemplo: "Voce se identifica como [status_amoroso]. Seu padrao dominante
e atrair [perfil_homem]. Voce relatou que [como_termina]."

Seccion 3: Pontos marcados
Bloque visual con los puntos principales detectados:
- "Padrao de repeticao: [respuesta pregunta 12]"
- "Medo principal: [respuesta pregunta 11]"
- "Intuicao: [respuesta pregunta 13]"
- "Bloqueio energetico: [respuesta pregunta 14]"

Seccion 4: CTA
Boton "Comecar minha jornada de desbloqueio" -> /journey
```

#### 5. Hook personalizado `useQuizProfile`

Crear `src/hooks/useQuizProfile.ts` que:
- Consulta `quiz_submissions` filtrado por `user_id` del usuario autenticado
- Usa `buildProfile()` para procesar las respuestas
- Retorna el perfil procesado (titulo, textos, etiquetas, puntos clave)

### Seccion tecnica

**Migracion de BD:**
- `ALTER TABLE quiz_submissions ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;`
- `CREATE INDEX idx_quiz_submissions_user_id ON quiz_submissions(user_id);`
- Agregar politica RLS para que usuarios autenticados puedan leer sus propias submissions

**Archivos a crear:**
- `src/data/quizProfile.ts` - logica de etiquetado, perfiles y generacion de texto dinamico
- `src/hooks/useQuizProfile.ts` - hook para obtener y procesar las respuestas del quiz

**Archivos a modificar:**
- `src/pages/Home.tsx` - rediseno completo con resultados dinamicos
- `src/pages/CreateAccount.tsx` - agregar vinculacion de session_id -> user_id en quiz_submissions tras signup

**Mapa de etiquetas por pregunta (ejemplos clave):**

| Pregunta | Respuesta | Etiqueta |
|----------|-----------|----------|
| P2 (status amoroso) | "Solteira e exausta" | `solteira_exausta` |
| P2 | "Presa em uma situacao" | `situacao_enrolada` |
| P5 (perfil homem) | "O Frio/Indisponivel" | `frio_indisponivel` |
| P5 | "O Promessa" | `promessa` |
| P6 (como termina) | "Ghosting" | `ghosting` |
| P11 (mayor miedo) | "Medo de ser abandonada" | `medo_abandono` |
| P14 (bloqueio) | "Sinto que minha energia esta travada" | `energia_travada` |

**Generacion de texto:**
Se usaran las palabras exactas de las opciones del quiz para construir frases como:
- "Voce relatou que se sente *solteira e exausta de tentar*"
- "Seu padrao e atrair o perfil *Frio/Indisponivel: nunca demonstra o que sente*"
- "Voce identificou que *sempre ve os sinais, mas finge que nao viu*"

Esto crea el efecto de reconocimiento inmediato ("es exactamente asi!").

