

# Pre-generate Guided Reading Audio (Save ElevenLabs Credits)

## Problem
Every time any user opens a guided reading, the app calls the ElevenLabs API, generating a new audio file and consuming credits. Since the guided reading content is static (same text for everyone), this is wasteful.

## Solution
Store pre-generated audio files in Lovable Cloud storage and serve them directly to users. The ElevenLabs API is called only once per reading (during generation), not on every visit.

## How It Works

1. **Create a storage bucket** called `guided-readings-audio` to hold the MP3 files.
2. **Create a backend function** (`generate-reading-audio`) that:
   - Takes a reading ID
   - Checks if the audio already exists in storage
   - If not, calls ElevenLabs to generate it and uploads it to storage
   - Returns the public URL
3. **Update the guided reading page** to load audio directly from the storage URL instead of calling ElevenLabs every time.
4. **Trigger generation once** for each reading (you can do this manually or via a simple admin action).

## Technical Details

### 1. Database Migration
- Create a public storage bucket `guided-readings-audio` with a policy allowing public read access.

### 2. New Edge Function: `generate-reading-audio`
- Accepts `{ readingId: string }`
- Looks up reading content from `guidedReadings.ts` data (hardcoded in the function or passed as text)
- Checks if `guided-readings-audio/{readingId}.mp3` already exists in storage
- If missing: calls ElevenLabs, uploads the resulting MP3 to storage
- Returns the public URL of the audio file

### 3. Update `src/pages/GuidedReading.tsx`
- Instead of calling `daily-forecast-audio` with the full text, fetch the audio directly from the storage bucket URL: `{SUPABASE_URL}/storage/v1/object/public/guided-readings-audio/{id}.mp3`
- If the file doesn't exist yet (404), fall back to calling `generate-reading-audio` to create it on-the-fly, then play the result.
- After the first generation, all subsequent visits (by any user) use the cached file -- zero ElevenLabs credits consumed.

### 4. Data Flow

```text
User opens /reading/intuicao
  |
  v
Try loading audio from storage bucket
  |
  +-- Found? --> Play directly (no API call)
  |
  +-- Not found? --> Call generate-reading-audio
                       |
                       v
                   Call ElevenLabs (once)
                       |
                       v
                   Upload MP3 to storage
                       |
                       v
                   Return URL --> Play audio
```

### Result
- Each guided reading audio is generated exactly **once** across all users.
- All subsequent plays load a static MP3 file from storage -- instant, free, and fast.
- The daily forecast remains dynamic (generated per user per day) as intended.
