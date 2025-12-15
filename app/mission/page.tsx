import { MissionEntry } from "@/components/MissionEntry";

export const metadata = {
  title: "Mission · CSSC Club",
  description: "Run the mission. Answer carefully. Survive the traps.",
};

export default function MissionPage() {
  return (
    <main className="min-h-screen">
      <MissionEntry />
    </main>
  );
}
