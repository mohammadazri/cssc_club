import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

let _client: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseClient() {
  if (!url || !anon) return null;

  if (typeof window === "undefined") {
    return createClient<Database>(url, anon);
  }

  if (!_client) {
    _client = createClient<Database>(url, anon, {
      realtime: { params: { eventsPerSecond: 10 } },
    });
  }

  return _client;
}
