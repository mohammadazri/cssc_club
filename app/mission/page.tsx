import { QuizEngine } from "@/components/QuizEngine";
import { QUESTIONS } from "@/data/questions";
import Link from "next/link";

export const metadata = {
  title: "Mission · Zero-Day Recruit",
  description: "Run the mission. Answer carefully. Survive the traps.",
};

export default function MissionPage() {
  return (
    <main className="min-h-screen">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
            Mission
          </p>
          <h1 className="mt-1 text-lg font-semibold text-zinc-100">
            Infiltrate the Mainframe
          </h1>
        </div>
        <Link
          href="/"
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-200 hover:bg-white/10"
        >
          Abort
        </Link>
      </header>
      <QuizEngine questions={QUESTIONS} />
    </main>
  );
}
