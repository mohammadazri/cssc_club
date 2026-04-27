import { MissionPage } from "@/components/MissionPage";

export const metadata = {
  title: "Mission · CSSC Club",
  description: "Run the mission. Answer carefully. Survive the traps.",
};

export default function Page() {
  return (
    <main className="min-h-screen">
      <MissionPage />
    </main>
  );
}
