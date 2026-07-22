export type WeightEntry = { id: string; date: string; kg: number; note?: string };

export const seedWeightLog: WeightEntry[] = [
  { id: "w1", date: "2026-06-10", kg: 80 },
  { id: "w2", date: "2026-06-17", kg: 79.4 },
  { id: "w3", date: "2026-06-24", kg: 79.1 },
  { id: "w4", date: "2026-07-01", kg: 78.8 },
  { id: "w5", date: "2026-07-08", kg: 78.5 },
  { id: "w6", date: "2026-07-15", kg: 78.2 },
  { id: "w7", date: "2026-07-22", kg: 78.0 },
];

export type MeasurementEntry = { id: string; date: string; chest: number; waist: number; arm: number; leg: number };

export const seedMeasurements: MeasurementEntry[] = [
  { id: "b1", date: "2026-06-10", chest: 98, waist: 86, arm: 33, leg: 56 },
  { id: "b2", date: "2026-07-01", chest: 99, waist: 84, arm: 34, leg: 57 },
  { id: "b3", date: "2026-07-22", chest: 101, waist: 82, arm: 35.5, leg: 58 },
];

export type ExercisePR = { exercise: string; before: number; after: number; date: string };

export const exercisePRs: ExercisePR[] = [
  { exercise: "Supino Reto", before: 60, after: 80, date: "2026-07-15" },
  { exercise: "Agachamento Livre", before: 70, after: 95, date: "2026-07-10" },
  { exercise: "Remada Curvada", before: 50, after: 65, date: "2026-06-28" },
];

export const performanceHistory = [
  { date: "10 Jun", kg: 60 }, { date: "24 Jun", kg: 65 }, { date: "8 Jul", kg: 72 }, { date: "15 Jul", kg: 80 },
];

export const workoutStats = {
  mostPerformed: "Supino Reto",
  mostPerformedCount: 18,
  avgDurationMin: 47,
  workoutsThisWeek: 5,
  consistencyPct: 85,
  avgCalories: 2100,
};

export type Badge = { id: string; icon: string; label: string; date: string };
export const badges: Badge[] = [
  { id: "b1", icon: "🔥", label: "7 dias seguidos", date: "2026-07-10" },
  { id: "b2", icon: "🏅", label: "Primeiro PR", date: "2026-06-28" },
  { id: "b3", icon: "💯", label: "10 treinos completos", date: "2026-07-15" },
  { id: "b4", icon: "🌅", label: "Madrugador", date: "2026-07-05" },
];

export const fitPoints = 2140;
export const athleteLevel = { level: 6, label: "Atleta Dedicado", progress: 64 };

export type TransformationPhoto = { id: string; date: string; url: string; label: "before" | "after" };
export const seedPhotos: TransformationPhoto[] = [];

export type BodyGalleryEntry = { id: string; date: string; front?: string; side?: string; back?: string; weightKg?: number; notes?: string };
export const seedBodyGallery: BodyGalleryEntry[] = [];

export type HistoryEvent = { id: string; date: string; text: string; type: "peso" | "treino" | "nutrição" | "corpo" };
export const historyEvents: HistoryEvent[] = [
  { id: "h1", date: "10 Jul", text: "Treino completo: Muscle Growth Program", type: "treino" },
  { id: "h2", date: "12 Jul", text: "+0,3kg de massa registados", type: "peso" },
  { id: "h3", date: "15 Jul", text: "Novo recorde: Supino Reto 80kg", type: "treino" },
  { id: "h4", date: "18 Jul", text: "Medidas atualizadas: cintura -2cm", type: "corpo" },
  { id: "h5", date: "20 Jul", text: "Cumpriste 85% do plano alimentar da semana", type: "nutrição" },
];

export const aiProgressInsights = [
  "Estás a ganhar massa muscular de forma consistente — mantém o ritmo atual.",
  "A tua consistência caiu 10% nos últimos 7 dias. Que tal agendar mais uma sessão?",
  "Recomenda-se aumentar a ingestão de proteína para acelerar a recuperação pós-treino.",
];
