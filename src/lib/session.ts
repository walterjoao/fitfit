"use client";

import { useEffect, useState } from "react";

export type Session = { name: string; email: string; role: string };

const KEY = "fitpro_session";

export function setSession(session: Session) {
  try {
    localStorage.setItem(KEY, JSON.stringify(session));
  } catch {}
}

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}

export function useSession() {
  const [session, setSessionState] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    setSessionState(getSession());
  }, []);

  return session;
}

export const roleDashboardPath: Record<string, string> = {
  admin: "/dashboard/admin",
  trainer: "/dashboard",
  nutritionist: "/dashboard/nutritionist",
  gym: "/dashboard/gym",
  athlete: "/dashboard/athlete",
  shop: "/dashboard/shop",
};

export function useRoleGuard(expectedRole: string) {
  const session = useSession();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (session === undefined) return;
    if (!session) {
      window.location.href = "/";
      return;
    }
    if (session.role !== expectedRole && session.role !== "admin") {
      window.location.href = roleDashboardPath[session.role] || "/dashboard";
      return;
    }
    setReady(true);
  }, [session, expectedRole]);

  return { session, ready };
}
