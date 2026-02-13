

## Problem

The DayExperience pages (Day 1 and Day 2) define their own purple gradient background, but they sit inside the `MainLayout` which has a different gradient ending in a warm brownish tone (`hsl(30, 20%, 15%)`). When you scroll past the bottom button, the MainLayout background becomes visible, creating an unwanted color strip below the purple content.

## Root Cause

- `MainLayout` gradient ends at `hsl(30, 20%, 15%)` (warm/brown)
- `DayExperience` uses `min-h-[calc(100dvh-6.5rem)]` -- this sizes to the viewport but doesn't extend to fill all scrollable space
- The `main` element in MainLayout scrolls, and below the DayExperience content the layout's own background shows through

## Solution

Change the `min-h` on the main container div in both `DayExperience.tsx` and `DayExperience2.tsx` to use `min-h-full` (or a large enough value) so the background always covers the full scrollable area. Alternatively, a simpler and more robust fix is to remove `min-h-[calc(100dvh-6.5rem)]` and replace it with `min-h-full` while also ensuring the background color extends by adding a matching background to the bottom padding area.

### Changes

**1. `src/pages/DayExperience.tsx`**
- Change the outer container from `min-h-[calc(100dvh-6.5rem)]` to `min-h-full` so it fills the entire scrollable `main` area, not just the viewport minus header

**2. `src/pages/DayExperience2.tsx`**
- Apply the same fix: change `min-h-[calc(100dvh-6.5rem)]` to `min-h-full`

This ensures the purple gradient background covers the entire scrollable content area with no gap at the bottom.

