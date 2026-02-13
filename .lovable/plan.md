

## Problem

There's too much space between the purple "Continuar" button and the bottom navigation bar. This happens because of stacked spacing:

1. `MainLayout`'s `<main>` has `pb-14` (56px) bottom padding
2. The button container has `pt-4` (16px) top padding and `pb-2` (8px) bottom padding

These combine to push the button far from the navigation bar.

## Solution

Two changes needed:

### 1. Remove bottom padding from MainLayout's main element (line 40)
- Change `pb-14` to `pb-0` on the `<main>` tag, since the Day Experience pages manage their own bottom spacing with the fixed button

### 2. Reduce button container padding in both Day files
- In `src/pages/DayExperience.tsx` (line 432): change `px-8 pb-2 pt-4` to `px-8 pb-1 pt-2`
- In `src/pages/DayExperience2.tsx` (same line): apply the identical change

This positions the button snugly above the bottom navigation bar, matching the reference screenshot.
