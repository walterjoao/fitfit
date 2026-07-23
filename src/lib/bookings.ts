"use client";

import { notifyAndEmail } from "@/lib/notifications";

export type BookingKind = "pt" | "class" | "nutrition" | "gym" | "event";
export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled" | "no-show";

export type BookingNote = { author: string; text: string; time: string };

export type Booking = {
  id: string;
  athleteName: string;
  professionalId: string;
  professionalName: string;
  professionalRole: string;
  professionalPhoto: string;
  kind: BookingKind;
  title: string;
  tag: string;
  date: string;
  time: string;
  durationMin: number;
  location: string;
  price: string;
  status: BookingStatus;
  paymentStatus: "paid" | "pending";
  description: string;
  preparation: string[];
  notes: BookingNote[];
  createdAt: string;
};

const KEY = "fitpro_bookings";
const SEEDED_KEY = "fitpro_bookings_seeded";

const seedBookings: Omit<Booking, "id" | "createdAt">[] = [
  {
    athleteName: "Tiago Kiala",
    professionalId: "t1",
    professionalName: "Ana Ferreira",
    professionalRole: "Personal Trainer",
    professionalPhoto: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
    kind: "pt",
    title: "Sessão Personal Training",
    tag: "🏋️ Força e Hipertrofia",
    date: "25 Julho 2026",
    time: "18:00 - 19:00",
    durationMin: 60,
    location: "FitPro Gym Luanda",
    price: "8.500 Kz",
    status: "confirmed",
    paymentStatus: "paid",
    description: "Treino focado em força e progressão de carga.",
    preparation: ["Roupa de treino confortável", "Ténis fechados", "Garrafa de água", "Toalha"],
    notes: [],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    athleteName: "Tiago Kiala",
    professionalId: "n1",
    professionalName: "Inês Gonçalves",
    professionalRole: "Nutricionista",
    professionalPhoto: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=300&fit=crop",
    kind: "nutrition",
    title: "Consulta de Nutrição Desportiva",
    tag: "🥗 Nutrição Desportiva",
    date: "28 Julho 2026",
    time: "14:00 - 14:40",
    durationMin: 40,
    location: "Online (Zoom)",
    price: "6.500 Kz",
    status: "pending",
    paymentStatus: "pending",
    description: "Revisão do plano alimentar e ajuste de macros para a fase de ganho de massa.",
    preparation: ["Registo alimentar dos últimos 3 dias", "Balança atualizada", "Ligação à internet estável"],
    notes: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    athleteName: "Tiago Kiala",
    professionalId: "g1",
    professionalName: "FitPro Talatona",
    professionalRole: "Ginásio",
    professionalPhoto: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=300&fit=crop",
    kind: "gym",
    title: "Acesso ao Ginásio",
    tag: "🏢 Musculação e Cardio",
    date: "18 Julho 2026",
    time: "07:00 - 08:30",
    durationMin: 90,
    location: "Talatona, Luanda",
    price: "1.500 Kz",
    status: "completed",
    paymentStatus: "paid",
    description: "Acesso completo à sala de musculação, cardio e balneários.",
    preparation: ["Cartão de membro", "Roupa e calçado próprios"],
    notes: [],
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    athleteName: "Tiago Kiala",
    professionalId: "t3",
    professionalName: "Nelson Sami",
    professionalRole: "Personal Trainer",
    professionalPhoto: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=300&h=300&fit=crop",
    kind: "class",
    title: "CrossFit Beginner",
    tag: "⚡ Performance e CrossFit",
    date: "10 Julho 2026",
    time: "07:00 - 07:50",
    durationMin: 50,
    location: "Power Gym Talatona",
    price: "9.000 Kz",
    status: "cancelled",
    paymentStatus: "pending",
    description: "Aula de introdução ao CrossFit para iniciantes.",
    preparation: ["Roupa de treino", "Ténis fechados"],
    notes: [],
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
  },
];

function seedIfNeeded() {
  try {
    if (localStorage.getItem(SEEDED_KEY)) return;
    const list: Booking[] = seedBookings.map((b) => ({
      ...b,
      id: Math.random().toString(36).slice(2),
      createdAt: b.createdAt || new Date().toISOString(),
    }));
    localStorage.setItem(KEY, JSON.stringify(list));
    localStorage.setItem(SEEDED_KEY, "1");
  } catch {}
}

export function getBookings(): Booking[] {
  try {
    seedIfNeeded();
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getBookingsFor(athleteName: string | undefined): Booking[] {
  if (!athleteName) return [];
  return getBookings().filter((b) => b.athleteName === athleteName);
}

export function getBookingsWithProfessional(professionalName: string | undefined): Booking[] {
  if (!professionalName) return [];
  return getBookings().filter((b) => b.professionalName === professionalName);
}

export function getBookingById(id: string): Booking | undefined {
  return getBookings().find((b) => b.id === id);
}

function save(list: Booking[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("fitpro:bookings"));
  } catch {}
}

export function addBooking(b: Omit<Booking, "id" | "createdAt">): Booking {
  const list = getBookings();
  const booking: Booking = { ...b, id: Math.random().toString(36).slice(2), createdAt: new Date().toISOString() };
  list.unshift(booking);
  save(list);
  notifyAndEmail(booking.athleteName, `A tua marcação com ${booking.professionalName} foi criada.`, "good", "booking", "/dashboard/athlete/bookings");
  notifyAndEmail(booking.professionalName, `Nova marcação de ${booking.athleteName}.`, "accent", "booking", "/dashboard/athlete/bookings");
  return booking;
}

export function updateBookingStatus(id: string, status: BookingStatus, actor?: string) {
  const list = getBookings();
  const idx = list.findIndex((b) => b.id === id);
  if (idx === -1) return;
  list[idx] = { ...list[idx], status, paymentStatus: status === "cancelled" ? list[idx].paymentStatus : list[idx].paymentStatus };
  save(list);
  const b = list[idx];
  const label: Record<BookingStatus, string> = {
    pending: "está pendente",
    confirmed: "foi confirmada",
    completed: "foi concluída",
    cancelled: "foi cancelada",
    "no-show": "foi marcada como falta",
  };
  notifyAndEmail(b.athleteName, `A tua marcação com ${b.professionalName} ${label[status]}.`, status === "cancelled" ? "bad" : "good", "booking", "/dashboard/athlete/bookings");
  notifyAndEmail(b.professionalName, `A marcação com ${b.athleteName} ${label[status]}.`, status === "cancelled" ? "bad" : "good", "booking", "/dashboard/athlete/bookings");
}

export function addBookingNote(id: string, note: BookingNote) {
  const list = getBookings();
  const idx = list.findIndex((b) => b.id === id);
  if (idx === -1) return;
  list[idx] = { ...list[idx], notes: [...list[idx].notes, note] };
  save(list);
}

export const kindLabel: Record<BookingKind, string> = {
  pt: "Sessão PT",
  class: "Aula",
  nutrition: "Nutrição",
  gym: "Ginásio",
  event: "Evento",
};

export const statusMeta: Record<BookingStatus, { label: string; dot: string; tone: string }> = {
  pending: { label: "Pendente", dot: "🟡", tone: "review" },
  confirmed: { label: "Confirmada", dot: "🟢", tone: "active" },
  completed: { label: "Concluída", dot: "🔵", tone: "active" },
  cancelled: { label: "Cancelada", dot: "🔴", tone: "inactive" },
  "no-show": { label: "Falta", dot: "⚫", tone: "inactive" },
};
