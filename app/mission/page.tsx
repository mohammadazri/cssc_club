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

      <QuizEngine questions={QUESTIONS} />
    </main>
  );
}
