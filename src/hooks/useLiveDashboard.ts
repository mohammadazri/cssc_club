"use client";

import { useState, useEffect } from "react";
import type { Difficulty } from "@/types/quiz";
import type { LeaderboardRow } from "@/lib/supabase/queries";
import { getTopRuns, getActiveRuns } from "@/lib/supabase/queries";
import { getSupabaseClient } from "@/lib/supabase/client";

export function useLiveDashboard(limit = 20, difficulty?: Difficulty) {
  const [entries, setEntries] = useState<LeaderboardRow[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      const [rows, active] = await Promise.all([
        getTopRuns(limit, difficulty),
        getActiveRuns(15),
      ]);
      if (!mounted) return;
      setEntries(rows);
      setActiveCount(active);
      setLoading(false);
    }

    fetchData();

    const client = getSupabaseClient();
    if (!client) return;

    const channel = client
      .channel("dashboard-runs")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "runs" },
        () => {
          fetchData();
        },
      )
      .subscribe();

    // Refresh active count every 60s even without new events
    const interval = setInterval(() => {
      getActiveRuns(15).then((n) => {
        if (mounted) setActiveCount(n);
      });
    }, 60_000);

    return () => {
      mounted = false;
      client.removeChannel(channel);
      clearInterval(interval);
    };
  }, [limit, difficulty]);

  return { entries, activeCount, loading };
}
