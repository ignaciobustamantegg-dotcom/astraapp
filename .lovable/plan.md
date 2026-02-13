

## Fix: Purple progress line not passing through all completed day nodes

### Problem
The current approach uses `pathLength={6}` to normalize the entire bezier path into 6 equal abstract segments, then uses `strokeDasharray` to show `currentDay - 1` segments. However, the bezier curves between nodes have **different actual lengths** because nodes zigzag at different horizontal positions. A curve from x=15 to x=59 is much longer than one from x=37 to x=15. So equal abstract segments don't map to equal visual segments — the line falls short of or overshoots the actual node positions.

### Solution
Instead of one path with dasharray tricks, build **separate sub-paths** for each completed segment (day 1 to day 2, day 2 to day 3, etc.) and render only the completed ones as solid purple lines. This guarantees each segment exactly connects two consecutive nodes.

### Technical Details

**File: `src/components/JourneyMap.tsx`**

1. Add a helper function `generateSegmentPath(from, to)` that creates the bezier curve string between two consecutive points (using the same control point math already in `generatePath`).

2. Replace the single progress `<path>` element with a loop that renders one `<path>` per completed segment:
   - For each `i` from `0` to `currentDay - 2`, render a path from `points[i]` to `points[i+1]` using the same cubic bezier formula.
   - Each segment path uses the purple stroke styling (`hsl(270, 60%, 65%)`, strokeWidth 2.5, opacity 0.6).
   - No `pathLength` or `strokeDasharray` needed — each segment is fully drawn.

3. Remove the `pathLength` and `strokeDasharray` attributes from the progress path since they are no longer needed.

This approach is simpler, reliable regardless of curve lengths, and visually identical to the intended design.
