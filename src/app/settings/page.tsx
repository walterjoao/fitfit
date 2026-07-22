"use client";

import { useSession } from "@/lib/session";
import { settingsPath } from "@/lib/accountData";

export default function SettingsRedirect() {
  const session = useSession();

  if (session === undefined) return null;

  if (typeof window !== "undefined") {
    window.location.href = session ? settingsPath(session.role) : "/";
  }

  return null;
}
