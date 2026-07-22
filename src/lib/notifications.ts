"use client";

export type Notification = {
  id: string;
  recipient: string;
  message: string;
  time: string;
  tone: "good" | "accent" | "bad";
};

const KEY = "fitpro_notifications";

export function pushNotification(n: Omit<Notification, "id" | "time">) {
  try {
    const list = getNotifications();
    list.unshift({ ...n, id: Math.random().toString(36).slice(2), time: "agora" });
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, 20)));
    window.dispatchEvent(new Event("fitpro:notifications"));
  } catch {}
}

export function getNotifications(): Notification[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function notifyAndEmail(recipient: string, message: string, tone: Notification["tone"] = "accent") {
  pushNotification({ recipient, message, tone });
  return { inApp: true, email: true };
}
