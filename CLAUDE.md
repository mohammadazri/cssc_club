# Zero Day Recruit — CLAUDE.md

## Project Overview
Cybersecurity quiz app for CSSC Club at UniKL MIIT. Players enter a username, pick a difficulty, and answer timed MCQ questions under psychological pressure (countdown timer, trap options, health system). Post-run: debrief page with rank, score, and QR code to join the club. Live dashboard at `/dashboard` for projector display at club events.

## Tech Stack
- **Framework**: Next.js 16 (App Router), React 19, TypeScript (strict)
- **Styling**: Tailwind CSS v4 (`@import "tailwindcss"` syntax — no config file)
- **Animations**: Framer Motion
- **Audio**: Howler.js
- **3D Scenes**: @splinetool/react-spline
- **Backend**: Supabase (Postgres + real-time subscriptions, anon key, no auth)
- **Icons**: Lucide React, clsx for class merging

## Key Architecture Decisions
1. **No auth** — identity is username + device UUID (localStorage `zdr:deviceId`) mapped to a Supabase `players` row
2. **Supabase writes are fire-and-forget** — never block game navigation; localStorage is always written first
3. **Real-time via `postgres_changes`** — dashboard subscribes to `runs` INSERT events
4. **Questions are static TypeScript arrays** — Supabase stores only runs/players, not questions
5. **Unlock progression is dual-layer** — localStorage cache (instant reads) + Supabase canonical (cross-device)
6. **Adaptive difficulty via multipliers** — point/timer multipliers change after streaks; no mid-run question pool swapping

## File Map

```
app/
  page.tsx                      # Landing page
  mission/page.tsx              # Shell → MissionPage (with UsernameGate)
  debrief/page.tsx              # Shell → DebriefClient
  dashboard/page.tsx            # Live event dashboard shell
  layout.tsx                    # Root layout (fonts)
  globals.css                   # Design tokens + Tailwind

src/
  types/
    quiz.ts                     # All game types (Question, RunSummary, PlayerSession, etc.)
    supabase.ts                 # Supabase Database interface (update via: npx supabase gen types)
  lib/
    session.ts                  # getOrCreateDeviceId, saveSession, loadSession, clearSession
    unlocks.ts                  # loadUnlocks, grantUnlock, checkUnlockEligibility
    adaptive.ts                 # computeNextAdaptiveState (pure function, no side effects)
    supabase/
      client.ts                 # getSupabaseClient() singleton
      queries.ts                # upsertPlayer, insertRun, getTopRuns, getActiveRuns, etc.
  hooks/
    useGameState.ts             # localStorage persistence + fire-and-forget Supabase write
    usePlayerSession.ts         # session state (creates/loads from localStorage)
    useUnlockProgress.ts        # unlock state (localStorage-primary, Supabase-canonical)
    useAdaptiveDifficulty.ts    # adaptive state machine hook
    useLiveDashboard.ts         # real-time leaderboard via Supabase subscription
    useSoundEffects.ts          # Howler.js audio
    useSplinePreloader.ts       # Cache API preloader for Spline scenes
  components/
    MissionPage.tsx             # UsernameGate → MissionEntry orchestrator
    MissionEntry.tsx            # Difficulty selector + config + unlock gates
    MissionLoader.tsx           # Spline preloader → QuizEngine
    QuizEngine.tsx              # Core game loop (timer, scoring, adaptive, traps)
    UsernameGate.tsx            # Full-screen username entry modal
    UnlockBadge.tsx             # Lock/unlock corner badge for difficulty buttons
    LiveLeaderboard.tsx         # Animated ranked list (used by dashboard)
    3d/
      SplineScene.tsx           # Reusable Spline wrapper with CSS fallbacks
      DifficultyScene.tsx       # Maps easy/medium/hard → background Spline scenes
      VaultScene.tsx            # In-quiz vault scene
      PhishingScene.tsx         # In-quiz phishing scene
      MainframeScene.tsx        # In-quiz mainframe scene
      TrapOverlay.tsx           # Wrong-answer modal
    ui/
      OptionButton.tsx          # Answer button (A/B/C/D)
      TerminalText.tsx          # Typewriter text effect
  dashboard/
    DashboardClient.tsx         # Big-screen live event dashboard
  debrief/
    DebriefClient.tsx           # Post-run results (rank, stats, QR, unlock toast)
  data/
    questions_easy.ts           # 30 ScriptKiddie questions
    questions_medium.ts         # 40 Hacker questions
    questions_hard.ts           # 40 Elite questions
```

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL           Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY      Supabase anon key (public, safe to expose)

# In-quiz Spline scenes (mapped by sceneId: vault/phishing/mainframe)
NEXT_PUBLIC_SPLINE_VAULT_SCENE
NEXT_PUBLIC_SPLINE_PHISHING_SCENE
NEXT_PUBLIC_SPLINE_MAINFRAME_SCENE

# V3: Background scenes (optional — CSS fallbacks render if blank)
NEXT_PUBLIC_SPLINE_EASY_BG_SCENE
NEXT_PUBLIC_SPLINE_MEDIUM_BG_SCENE
NEXT_PUBLIC_SPLINE_HARD_BG_SCENE
NEXT_PUBLIC_SPLINE_DASHBOARD_SCENE

# Social links for debrief QR code
NEXT_PUBLIC_WHATSAPP_URL
NEXT_PUBLIC_INSTAGRAM_URL
NEXT_PUBLIC_LINKEDIN_URL
```

## localStorage Keys
| Key | Type | Description |
|---|---|---|
| `zdr:deviceId` | string (UUID) | Generated once per browser, permanent identity anchor |
| `zdr:session` | PlayerSession JSON | playerId, username, deviceId, createdAt |
| `zdr:unlocks` | UnlockState JSON | `{hackerUnlocked, eliteUnlocked}` — localStorage cache |
| `zdr:lastRun` | RunSummary JSON | Last completed run (for debrief page) |
| `zdr:leaderboard` | LeaderboardEntry[] | Top 10 local backup |
| `cssc_audio_on` | "0" or "1" | Audio toggle preference |

## Supabase Tables
- **players** — one row per username session (device_id + username + id)
- **runs** — one row per completed quiz run (FK to players)
- **unlock_progress** — which difficulties a player has unlocked (FK to players)

All tables use public RLS (anon key can read + insert). No updates or deletes from client.

## Adding New Questions
- File: `src/data/questions_easy.ts` (ScriptKiddie), `_medium.ts` (Hacker), `_hard.ts` (Elite)
- ID convention: `easy-q31`, `medium-q41`, `hard-q41` (continue from last)
- `sceneId` values: `"vault"`, `"phishing"`, `"mainframe"` — distribute evenly per difficulty
- `isTrap: true` = wrong answer, `isTrap: false` = correct answer (exactly one per question)
- Difficulty guidelines:
  - **Easy**: Consumer context, single-factor recognition, common sense. No jargon beyond phishing/2FA/HTTPS.
  - **Medium**: Applied knowledge — WHY things are wrong. TOTP vs SMS, session hijacking, code-level issues.
  - **Hard**: Adversarial/technical reasoning. Supply chain, crypto protocol selection, incident response priority, CVE-class thinking.

## Unlock Criteria
- ScriptKiddie → Hacker: `outcome === "success"` AND `score >= 400` AND `accuracy >= 60%`
- Hacker → Elite: `outcome === "success"` AND `score >= 800` AND `accuracy >= 60%`

## Adaptive Difficulty Algorithm
After each answer, `computeNextAdaptiveState()` in `src/lib/adaptive.ts` updates multipliers:
- 3 correct in a row → `pointMultiplier += 0.25` (max 1.5x), `timerMultiplier -= 0.25` (min 0.75x, less time)
- 2 wrong in a row → `pointMultiplier -= 0.25` (min 0.75x), `timerMultiplier += 0.25` (max 1.25x, more time)
- HUD shows "FLOW +" (green) when harder, "ASSIST" (amber) when easier

## Supabase Setup (for new environments)
1. Create project at supabase.com
2. Run SQL from the plan file: `C:\Users\moham\.claude\plans\glowing-beaming-noodle.md` (Phase 0 SQL schema)
3. Enable Replication on `runs` and `players` tables (Dashboard → Database → Replication)
4. Copy `.env.local.example` to `.env.local` and fill in Supabase URL + anon key

## Design Tokens (globals.css)
```
--cyber-green:    #00ff88    Primary CTA, success states
--alert-red:      #ff2244    Error, danger, trap states
--warning-amber:  #ffaa00    Countdown urgency, warnings
--surface:        #111827    Dark panel backgrounds
--void-black:     #0a0f1a    Darkest background
```
