import { LandingClient } from "@/components/LandingClient";

export default function Home() {
  const joinUrl = process.env.NEXT_PUBLIC_CLUB_JOIN_URL || "#";

  return (
    <main className="min-h-screen">
      <LandingClient />
    </main>
  );
}

