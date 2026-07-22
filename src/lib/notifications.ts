"use client";

export type NotifCategory = "training" | "booking" | "events" | "messages" | "payments";

export type Notification = {
  id: string;
  recipient: string;
  message: string;
  time: string;
  tone: "good" | "accent" | "bad";
  category: NotifCategory;
  read: boolean;
  href?: string;
};

const KEY = "fitpro_notifications";
const SEEDED_KEY = "fitpro_notifications_seeded";

const seedNotifications: Omit<Notification, "id">[] = [
  { recipient: "tu", message: "Pedro juntou-se ao teu evento Sunrise Run Club.", time: "há 12 min", tone: "good", category: "events", read: false, href: "/events/ev1" },
  { recipient: "tu", message: "A tua Personal Trainer atualizou o teu treino Muscle Growth Program.", time: "há 2 h", tone: "accent", category: "training", read: false, href: "/dashboard/athlete/workouts/muscle-growth" },
  { recipient: "tu", message: "Subiste para #8 no leaderboard de Consistência.", time: "há 2 h", tone: "accent", category: "training", read: true, href: "/leaderboard" },
  { recipient: "tu", message: "Pagamento da subscrição de Julho processado com sucesso.", time: "ontem", tone: "good", category: "payments", read: true, href: "/dashboard/athlete/billing" },
  { recipient: "tu", message: "Nova mensagem de Ana Ferreira.", time: "ontem", tone: "accent", category: "messages", read: true, href: "/messages" },
  { recipient: "tu", message: "A tua marcação com Inês Gonçalves foi confirmada.", time: "há 2 dias", tone: "good", category: "booking", read: true, href: "/dashboard/athlete/book" },
];

function seedIfNeeded() {
  try {
    if (localStorage.getItem(SEEDED_KEY)) return;
    const list = seedNotifications.map((n) => ({ ...n, id: Math.random().toString(36).slice(2) }));
    localStorage.setItem(KEY, JSON.stringify(list));
    localStorage.setItem(SEEDED_KEY, "1");
  } catch {}
}

export function pushNotification(n: Omit<Notification, "id" | "time" | "read"> & { read?: boolean }) {
  try {
    seedIfNeeded();
    const list = getNotifications();
    list.unshift({ ...n, read: n.read ?? false, id: Math.random().toString(36).slice(2), time: "agora" });
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, 50)));
    window.dispatchEvent(new Event("fitpro:notifications"));
  } catch {}
}

export function getNotifications(): Notification[] {
  try {
    seedIfNeeded();
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function markRead(id: string) {
  try {
    const list = getNotifications().map((n) => (n.id === id ? { ...n, read: true } : n));
    localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("fitpro:notifications"));
  } catch {}
}

export function removeNotification(id: string) {
  try {
    const list = getNotifications().filter((n) => n.id !== id);
    localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("fitpro:notifications"));
  } catch {}
}

export function notifyAndEmail(recipient: string, message: string, tone: Notification["tone"] = "accent", category: NotifCategory = "training", href?: string) {
  pushNotification({ recipient, message, tone, category, href });
  return { inApp: true, email: true };
}
