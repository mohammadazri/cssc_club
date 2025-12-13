import { DebriefClient } from "@/debrief/DebriefClient";

export const metadata = {
  title: "Debrief · CSSC Club",
  description: "Review your results and join the cyber security club.",
};

export default function DebriefPage() {
  return (
    <main className="min-h-screen">
      <DebriefClient />
    </main>
  );
}
