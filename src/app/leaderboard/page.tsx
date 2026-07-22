"use client";

import { useSession } from "@/lib/session";
import { leaderboardPath } from "@/lib/accountData";

export default function LeaderboardRedirect() {
  const session = useSession();

  if (session === undefined) return null;

  if (typeof window !== "undefined") {
    window.location.href = session ? leaderboardPath(session.role) : "/";
  }

  return null;
}
