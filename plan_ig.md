# Instagram Achievement Share — Implementation Plan

## What we're building
A "Share Achievement" button on the debrief page (`/debrief`) that generates a
standalone achievement card image and lets users share it directly to Instagram
(or download it). The card has **no CSSC club header** — only the player's
achievement data, making it feel personal and shareable.

---

## How Instagram sharing works from a web app

Instagram has **no direct web API** for posting. The real path on mobile is:

```
Generate PNG → Web Share API → native share sheet → user picks Instagram
```

On Android Chrome and iOS Safari, `navigator.share({ files: [imageFile] })`
opens the system share sheet, which includes Instagram Stories. The user taps
Instagram and the image is pre-loaded in Stories camera.

On desktop (no Web Share API support), we fall back to a clean download so the
user can post manually.

---

## Technical approach: Pure Canvas 2D API

**No new npm packages.** We draw the card programmatically with the browser's
built-in Canvas API. This is more reliable than `html2canvas` (which struggles
with Tailwind classes, custom fonts, and complex CSS) and simpler than
`@vercel/og` (which adds a server route).

```
Browser Canvas 2D  →  PNG Blob  →  Web Share API (mobile) / download (desktop)
```

---

## Card design (1080×1080 — Instagram square)

```
┌──────────────────────────────────────────────────────────────┐  ← corner accents
│                                                              │
│  ZERO DAY RECRUIT                         (small, top-left) │
│  ────────────────────────────────────────────────────────── │
│                                                              │
│             [ ACCESS GRANTED ]  or  [ ACCESS DENIED ]       │
│                                                              │
│                    @username                                 │  ← large, white
│                                                              │
│                    1,250                                     │  ← massive, neon green
│                    POINTS                                    │  ← small label
│                                                              │
│                  CYBER SENTINEL                              │  ← rank name
│                                                              │
│        94% ACCURACY          ELITE DIFFICULTY               │
│                                                              │
│  ────────────────────────────────────────────────────────── │
│  CSSC CLUB · UNIKL MIIT                   (tiny, bottom)    │
└──────────────────────────────────────────────────────────────┘  ← corner accents
```

Style:
- **Background**: `#0a0f1a` (void-black)
- **Grid overlay**: subtle `rgba(0,255,136,0.05)` lines at 40px intervals
- **Radial glow**: centered green/red gradient behind the score (based on outcome)
- **Score**: largest text, `#00ff88` with canvas shadow glow `shadowBlur: 30`
- **Corner accents**: matching the app's cyber bracket style, `rgba(0,255,136,0.5)`
- **Top accent line**: gradient `transparent → #00ff88 → transparent`
- Fonts: system monospace (no font loading required — renders reliably on all devices)

No CSSC club logo or header at the top. The club name appears only as a tiny
watermark at the very bottom (`rgba(0,255,136,0.35)` — subtle, not dominant).

---

## Files to create / modify

### New: `src/lib/generateAchievementCard.ts`
Pure function — takes achievement data, returns a `Promise<Blob>`:

```ts
export interface AchievementShareData {
  username: string;
  score: number;
  rank: string;
  accuracy: number;
  outcome: "success" | "failed";
  difficulty?: "ScriptKiddie" | "Hacker" | "Elite";
}

export async function generateAchievementCard(data: AchievementShareData): Promise<Blob>
```

Draws everything via Canvas 2D. No side effects.

### New: `src/components/ShareAchievementButton.tsx`
Client component with the share button + share logic:

```ts
// State machine: idle → generating → sharing | downloaded | error
type ShareState = "idle" | "generating" | "sharing" | "downloaded" | "error";
```

Share flow:
1. Click → `generating` state (shows spinner in button)
2. Call `generateAchievementCard(data)`
3. Build `File` object from blob
4. Check `navigator.canShare?.({ files: [file] })`
   - **Yes (mobile)** → `navigator.share(...)` → native share sheet
   - **No (desktop)** → create `<a download>` link → click it → `downloaded` state
5. Show feedback toast:
   - Mobile: "Opening share sheet…"  
   - Desktop: "Image saved! Open Instagram and post it."

### Modified: `src/debrief/DebriefClient.tsx`
Add `<ShareAchievementButton>` to the action buttons grid. It sits in the left
column alongside "Retry Mission", "Return Home", and "Live Dashboard". Suggested
placement: replace the `col-span-2` dashboard button row with a 2-column grid
where one is Dashboard and one is Share:

```
[ Retry Mission ]   [ Return Home  ]
[ Live Dashboard ]  [ Share on IG  ]   ← new row
```

Or add it as a `col-span-2` row below the existing three buttons:

```
[ Retry Mission ]   [ Return Home  ]
       [ Live Dashboard ]
       [ Share Achievement ]   ← new, col-span-2, pink/instagram style
```

---

## Share button visual

Instagram-branded style to make the action obvious:

```tsx
// Idle state
<button className="instagram-gradient ...">
  <InstagramIcon />
  Share Achievement
</button>

// Generating state
<button disabled>
  <Spinner />
  Generating card…
</button>

// Downloaded state (desktop fallback)
<button className="success-green ...">
  <Check />
  Saved! Post to Instagram
</button>
```

Tailwind gradient for Instagram look:
```
bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500
```

---

## Edge cases to handle

| Scenario | Handling |
|---|---|
| User cancels Web Share sheet | Catch `AbortError`, silently return (no error shown) |
| `canvas.toBlob()` returns null | Show error toast, offer retry |
| Username missing (no session) | Show card with "Anonymous" |
| Score is 0 / run is null | Button hidden or disabled |
| Browser blocks canvas (privacy mode) | Catch error, show fallback download |

---

## What we deliberately skip

- **Posting directly to Instagram feed** — not possible without OAuth + Meta API
- **Auto-tagging CSSC account** — requires Meta Business API
- **Sharing to Stories with sticker overlays** — requires Instagram-specific deeplink
  params that are undocumented and unreliable on web
- **Server-side image generation** — overkill here, adds a route + Satori dep

---

## Implementation order

1. `src/lib/generateAchievementCard.ts` — draw the card, test with a `<canvas>` preview
2. `src/components/ShareAchievementButton.tsx` — button + share logic
3. `src/debrief/DebriefClient.tsx` — wire in the button, pass `lastRun` data

Estimated: ~3 focused files, no new dependencies.
