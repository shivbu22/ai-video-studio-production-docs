# 09 - Remotion Motion Graphics Template Catalog

**Package:** `packages/remotion`  
**Engine:** Remotion 4.x (React 19)  
**Standard Framerate:** 30 fps  
**Resolution Presets:** 1920x1080 (16:9 Landscape) & 1080x1920 (9:16 Vertical Shorts)

---

## 1. Overview & Architecture

All motion graphics are rendered as code using Remotion. A motion graphic scene is defined as a clean JSON payload (title, data points, labels, and design tokens) passed directly into a React component. 

```
JSON Scene Data ──> [Remotion Component] ──(spring & interpolate)──> Smooth 30fps Video
```

---

## 2. The 6 MVP Templates (Phase 1)

### Template 1: Animated Bar Chart (`BarChart.tsx`)
- **Use Case:** Comparing quantities across categories (e.g., market share, revenue, performance).
- **Props:**
  ```typescript
  interface BarChartProps {
    title: string;
    items: Array<{ label: string; value: number; color?: string }>;
    maxValue?: number;
    unit?: string;
  }
  ```
- **Animation Behavior:** Bars grow upward using `spring({ damping: 12, stiffness: 100 })`. Value counters count up from 0 to target in sync with bar expansion.

### Template 2: Animated Line Chart (`LineChart.tsx`)
- **Use Case:** Trends over time (e.g., growth curves, historical data).
- **Props:**
  ```typescript
  interface LineChartProps {
    title: string;
    points: Array<{ x: string; y: number }>;
    yLabel?: string;
  }
  ```
- **Animation Behavior:** SVG line path draws from left to right using `strokeDashoffset` interpolation over 45 frames (1.5s). Data points ping upon reveal.

### Template 3: Comparison (A vs. B) (`Comparison.tsx`)
- **Use Case:** Direct head-to-head showdowns (e.g., Feature A vs. Feature B, Pros vs. Cons).
- **Props:**
  ```typescript
  interface ComparisonProps {
    title: string;
    sideA: { title: string; points: string[]; color: string };
    sideB: { title: string; points: string[]; color: string };
  }
  ```
- **Animation Behavior:** Screen splits with an animated divider line. Side A slides in from left; Side B slides in from right with a staggered 10-frame offset.

### Template 4: Tier List (`TierList.tsx`)
- **Use Case:** Ranking concepts, tools, or strategies into standard S, A, B, C, D tiers.
- **Props:**
  ```typescript
  interface TierListProps {
    tiers: Array<{ tier: 'S' | 'A' | 'B' | 'C' | 'D'; color: string; items: string[] }>;
  }
  ```
- **Animation Behavior:** Tier rows drop into place from top to bottom. Items within each tier pop in with subtle scale bounces.

### Template 5: Big Quote Card (`QuoteCard.tsx`)
- **Use Case:** Highlighting impactful statements, executive quotes, or customer testimonials.
- **Props:**
  ```typescript
  interface QuoteCardProps {
    quote: string;
    author: string;
    role?: string;
    avatarUrl?: string;
  }
  ```
- **Animation Behavior:** Giant quote mark dissolves in with blurred glow. Words fade in sequentially with a subtle smooth parallax zoom.

### Template 6: Stat Counter (`StatCounter.tsx`)
- **Use Case:** Dramatic numerical reveals (e.g., "$100M+ ARR", "99.9% Uptime", "10,000 Users").
- **Props:**
  ```typescript
  interface StatCounterProps {
    title: string;
    value: number;
    prefix?: string;
    suffix?: string;
    subtitle?: string;
  }
  ```
- **Animation Behavior:** Number rapidly rolls from 0 to target over 60 frames (2.0s) with spring deceleration.

---

## 3. The 6 v1 Templates (Phase 2)

7. **Pie / Donut Chart (`PieChart.tsx`):** Circular percentage shares with exploding slices on hover.
8. **Timeline Graphic (`TimelineGraphic.tsx`):** Horizontal or vertical milestones with a glowing marker traveling along the timeline.
9. **Map Highlight (`MapHighlight.tsx`):** World/country vector map zooming into specific highlighted regions or cities.
10. **Screenshot Callout (`ScreenshotCallout.tsx`):** Tilts UI screenshot into 3D isometric perspective with magnifying zoom on specific features.
11. **List Reveal (`ListReveal.tsx`):** Numbered countdown or key takeaways revealed sequentially in rhythm with voice narration.
12. **Chapter Title (`ChapterTitle.tsx`):** Bold typography screen divider marking major thematic transitions in long-form videos.
