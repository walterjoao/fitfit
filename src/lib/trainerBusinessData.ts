import { portraitImages } from "./images";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export type TraineeStatus = "on" | "risk" | "paused" | "inactive";
export type Trainee = {
  id: string; profileId: string; name: string; email: string; avatar: string;
  goal: string; program: string; progress: number; lastActivity: string; status: TraineeStatus;
};

export const trainees: Trainee[] = [
  { id: "tr1", profileId: "tiago-kiala", name: "Tiago Kiala", email: "tiago.kiala@fitpro.com", avatar: portraitImages.athlete[0], goal: "Consistência", program: "Consistência · 6 sem.", progress: 90, lastActivity: "Há 2 horas", status: "on" },
  { id: "tr2", profileId: "carla-domingos", name: "Carla Domingos", email: "carla.domingos@fitpro.com", avatar: portraitImages.athlete[1], goal: "Transformação", program: "Transformação · 12 sem.", progress: 82, lastActivity: "Ontem", status: "on" },
  { id: "tr3", profileId: "rui-ferreira-athlete", name: "Rui Ferreira", email: "rui.ferreira@fitpro.com", avatar: portraitImages.athlete[0], goal: "Ganho de massa", program: "Ganho de massa · 8 sem.", progress: 64, lastActivity: "Há 3 dias", status: "risk" },
  { id: "tr4", profileId: "marta-neto", name: "Marta Neto", email: "marta.neto@fitpro.com", avatar: portraitImages.athlete[1], goal: "Perda de peso", program: "Perda de peso · 10 sem.", progress: 20, lastActivity: "Há 1 semana", status: "paused" },
  { id: "tr5", profileId: "nelson-sami-athlete", name: "Nelson Sami", email: "nelson.sami@fitpro.com", avatar: portraitImages.athlete[0], goal: "Performance", program: "Performance · 20 sem.", progress: 55, lastActivity: "Há 4 dias", status: "risk" },
  { id: "tr6", profileId: "beatriz-chiapa", name: "Beatriz Chiapa", email: "beatriz.chiapa@fitpro.com", avatar: portraitImages.athlete[1], goal: "Consistência", program: "Consistência · 4 sem.", progress: 30, lastActivity: "Hoje", status: "on" },
];

export type TraineeRequest = { id: string; name: string; avatar: string; goal: string; message: string };
export const traineeRequests: TraineeRequest[] = [
  { id: "req1", name: "André Katumba", avatar: portraitImages.athlete[0], goal: "Ganho de massa", message: "Olá! Gostava de treinar contigo, já sigo o teu trabalho há algum tempo." },
  { id: "req2", name: "Diana Sacramento", avatar: portraitImages.athlete[1], goal: "Performance", message: "Preciso de ajuda para preparar uma competição em 3 meses." },
];

export type TodaySession = { id: string; traineeName: string; time: string; type: "Presencial" | "Online"; status: "confirmada" | "concluída" | "pendente" };
export const todaySessions: TodaySession[] = [
  { id: "ts1", traineeName: "Tiago Kiala", time: "07:00", type: "Presencial", status: "confirmada" },
  { id: "ts2", traineeName: "Carla Domingos", time: "10:30", type: "Online", status: "confirmada" },
  { id: "ts3", traineeName: "Beatriz Chiapa", time: "17:30", type: "Presencial", status: "pendente" },
  { id: "ts4", traineeName: "Nelson Sami", time: "19:00", type: "Presencial", status: "concluída" },
];

export const earningsThisMonth = 284500;
export const earningsGrowthPct = 12.4;

export const monthlyEarnings = [
  { m: "Fev", kz: 180000 }, { m: "Mar", kz: 205000 }, { m: "Abr", kz: 221000 },
  { m: "Mai", kz: 248000 }, { m: "Jun", kz: 261000 }, { m: "Jul", kz: 284500 },
];

export const sessionsCompletedTrend = [
  { m: "Fev", v: 42 }, { m: "Mar", v: 48 }, { m: "Abr", v: 51 }, { m: "Mai", v: 58 }, { m: "Jun", v: 60 }, { m: "Jul", v: 64 },
];

export const clientGrowthTrend = [
  { m: "Fev", v: 34 }, { m: "Mar", v: 38 }, { m: "Abr", v: 41 }, { m: "Mai", v: 45 }, { m: "Jun", v: 49 }, { m: "Jul", v: 52 },
];

export type Payment = { id: string; from: string; service: string; amount: number; date: string; status: "recebido" | "pendente" };
export const payments: Payment[] = [
  { id: "p1", from: "Tiago Kiala", service: "Sessão PT — Presencial", amount: 8500, date: "20 Jul 2026", status: "recebido" },
  { id: "p2", from: "Carla Domingos", service: "Sessão PT — Online", amount: 7000, date: "19 Jul 2026", status: "recebido" },
  { id: "p3", from: "Beatriz Chiapa", service: "Pacote 4 sessões", amount: 30000, date: "15 Jul 2026", status: "recebido" },
  { id: "p4", from: "Nelson Sami", service: "Sessão PT — Presencial", amount: 9000, date: "25 Jul 2026", status: "pendente" },
];

export type Availability = { day: string; enabled: boolean; from: string; to: string };
const AVAIL_KEY = "fitpro_trainer_availability";
export const defaultAvailability: Availability[] = [
  { day: "Segunda", enabled: true, from: "07:00", to: "19:00" },
  { day: "Terça", enabled: true, from: "07:00", to: "19:00" },
  { day: "Quarta", enabled: true, from: "07:00", to: "19:00" },
  { day: "Quinta", enabled: true, from: "07:00", to: "19:00" },
  { day: "Sexta", enabled: true, from: "07:00", to: "17:00" },
  { day: "Sábado", enabled: false, from: "08:00", to: "12:00" },
  { day: "Domingo", enabled: false, from: "08:00", to: "12:00" },
];
export function getAvailability(): Availability[] {
  return read(AVAIL_KEY, defaultAvailability);
}
export function saveAvailability(v: Availability[]) {
  write(AVAIL_KEY, v);
}

export type PricingPlan = { id: string; label: string; price: number; unit: string };
const PRICING_KEY = "fitpro_trainer_pricing";
export const defaultPricing: PricingPlan[] = [
  { id: "single", label: "Sessão Individual (Presencial)", price: 8500, unit: "/ sessão" },
  { id: "online", label: "Sessão Individual (Online)", price: 6500, unit: "/ sessão" },
  { id: "pack4", label: "Pacote 4 Sessões", price: 30000, unit: "/ mês" },
  { id: "pack8", label: "Pacote 8 Sessões", price: 56000, unit: "/ mês" },
];
export function getPricing(): PricingPlan[] {
  return read(PRICING_KEY, defaultPricing);
}
export function savePricing(v: PricingPlan[]) {
  write(PRICING_KEY, v);
}

export type ClassItem = { id: string; name: string; description: string; maxParticipants: number; enrolled: number; schedule: string };
const CLASSES_KEY = "fitpro_trainer_classes";
export const defaultClasses: ClassItem[] = [
  { id: "cl1", name: "Treino Funcional em Grupo", description: "Circuito funcional de alta intensidade.", maxParticipants: 18, enrolled: 16, schedule: "Seg/Qua/Sex · 17:30" },
  { id: "cl2", name: "HIIT Matinal", description: "Treino intervalado de alta intensidade.", maxParticipants: 15, enrolled: 9, schedule: "Ter/Qui · 06:30" },
];
export function getClasses(): ClassItem[] {
  return read(CLASSES_KEY, defaultClasses);
}
export function saveClasses(v: ClassItem[]) {
  write(CLASSES_KEY, v);
}

export type Assignment = { id: string; traineeId: string; traineeName: string; kind: "workout" | "class" | "note"; label: string; date: string; status: "active" | "completed" };
const ASSIGNMENTS_KEY = "fitpro_trainer_assignments";
export function getAssignments(): Assignment[] {
  return read<Assignment[]>(ASSIGNMENTS_KEY, []);
}
export function addAssignment(a: Omit<Assignment, "id" | "date" | "status">) {
  const next = [{ ...a, id: Math.random().toString(36).slice(2), date: new Date().toISOString().slice(0, 10), status: "active" as const }, ...getAssignments()];
  write(ASSIGNMENTS_KEY, next);
  return next;
}

export const aiTrainerInsights = [
  "3 atletas não completaram o treino esta semana: Marta Neto, Nelson Sami e Beatriz Chiapa.",
  "Tiago Kiala aumentou o supino reto em 15% no último mês.",
  "A tua taxa de retenção subiu 4 pontos — continua com o acompanhamento semanal.",
];

export const contentPerformance = {
  topWorkout: { name: "Upper Body Strength", id: "muscle-growth", completions: 128 },
  topExercise: { name: "Agachamento Livre", completions: 342 },
  topClass: { name: "Treino Funcional em Grupo", enrolled: 16 },
};

export type PrivateNote = { id: string; traineeId: string; text: string; date: string };
const NOTES_KEY = "fitpro_trainer_notes";
export function getNotes(traineeId: string): PrivateNote[] {
  return read<PrivateNote[]>(NOTES_KEY, []).filter((n) => n.traineeId === traineeId);
}
export function addNote(traineeId: string, text: string) {
  const all = read<PrivateNote[]>(NOTES_KEY, []);
  const next = [{ id: Math.random().toString(36).slice(2), traineeId, text, date: new Date().toISOString().slice(0, 10) }, ...all];
  write(NOTES_KEY, next);
  return next.filter((n) => n.traineeId === traineeId);
}
