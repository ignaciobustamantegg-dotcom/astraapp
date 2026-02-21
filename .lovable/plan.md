
# Fix: Guided Reading Text Layout During Audio Playback

## Problem
During audio playback, each word is rendered as a separate `<span>` with `mr-1` margin, creating uneven spacing and awkward line breaks. After playback, words are joined as plain text with natural browser spacing, which looks clean.

## Solution
Replace the current word-by-word `<span>` approach with a method that preserves natural text flow while still highlighting the current word.

## Changes

### File: `src/pages/GuidedReading.tsx`

1. **Remove `mr-1` margin from word spans** and use a simple space character between words instead, so spacing matches natural text flow.

2. **Add a trailing space as a text node** after each word span (` `) rather than using CSS margin. This ensures the browser treats spacing identically to plain text.

3. **Use the same rendering path for both states** -- always render word spans, but change only opacity/color classes. This eliminates the layout shift between "highlighting mode" and "finished mode."

### Technical Detail

Current (broken):
```tsx
// During playback - individual spans with margin
<span className="inline mr-1 ...">word</span>

// After playback - plain text
para.words.join(" ")
```

Fixed approach:
```tsx
// Both states use the same structure
<span className="transition-opacity duration-200 ...">word</span>{" "}
```

Key changes:
- Replace `className="inline mr-1"` with just the opacity/color classes
- Add `{" "}` after each span instead of `mr-1` for natural word spacing
- In the "ended" state, render the same spans but all at full opacity instead of switching to `join(" ")`, preventing any layout shift
- Keep all animation and glow effects intact

This is a minimal fix -- only the rendering logic inside `paragraphsWithOffsets.map()` changes. No structural, routing, or audio logic is modified.
