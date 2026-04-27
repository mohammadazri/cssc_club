import { Suspense } from "react";
import { DashboardClient } from "@/dashboard/DashboardClient";

export const metadata = {
  title: "Live Ops · Zero Day Recruit",
  description: "Real-time club event leaderboard.",
};

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
      <DashboardClient />
    </Suspense>
  );
}
