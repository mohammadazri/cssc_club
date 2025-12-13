# Operation "Zero-Day Recruit"

A short, cinematic cybersecurity mission (landing → mission → debrief) designed to recruit curious students.

## Local dev

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Environment variables

Create `.env.local` (optional). If you don’t set these, the app still runs and shows a clean placeholder instead of the 3D scene.

```bash
# Spline scenes (paste the React-exported scene URLs)
NEXT_PUBLIC_SPLINE_VAULT_SCENE=
NEXT_PUBLIC_SPLINE_PHISHING_SCENE=
NEXT_PUBLIC_SPLINE_MAINFRAME_SCENE=

# Recruitment links
NEXT_PUBLIC_CLUB_JOIN_URL=
NEXT_PUBLIC_CLUB_JOIN_FORM_URL=
NEXT_PUBLIC_CLUB_DISCORD_URL=
```

## Production

```bash
npm run lint
npm run build
npm run start
```

## Notes

- Audio is optional. The UI includes an “Audio” toggle and safely ignores missing files.
- The leaderboard is local-only (stored in browser localStorage).
