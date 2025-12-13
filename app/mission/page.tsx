import { MissionLoader } from "@/components/MissionLoader";
import { QUESTIONS } from "@/data/questions";

export const metadata = {
  title: "Mission · Zero-Day Recruit",
  description: "Run the mission. Answer carefully. Survive the traps.",
};

export default function MissionPage() {
  return (
    <main className="min-h-screen">
      <MissionLoader questions={QUESTIONS} />
    </main>
  );
}
