import { LandingClient } from "@/components/LandingClient";

export default function Home() {
  const joinUrl = process.env.NEXT_PUBLIC_CLUB_JOIN_URL || "#";

  return (
    <main className="min-h-screen">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6">
        <div className="flex items-baseline gap-3">
          <span className="text-sm font-semibold text-zinc-100">
            CSSC · Recruitment
          </span>
          <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Zero‑Day
          </span>
        </div>
        <a
          href={joinUrl}
          className="text-xs text-zinc-400 hover:text-zinc-200"
          aria-label="Club link"
        >
          Join
        </a>
      </header>
      <LandingClient />
      <footer className="mx-auto w-full max-w-6xl px-4 pb-10 text-xs text-zinc-500">
        This experience is educational. Do not use techniques to harm others.
      </footer>
    </main>
  );
}

