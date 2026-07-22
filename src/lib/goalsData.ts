export type GoalType = "fitness" | "body" | "performance" | "nutrition";

export const goalTypeLabel: Record<GoalType, string> = {
  fitness: "🏋️ Fitness",
  body: "⚖️ Corpo",
  performance: "🏃 Performance",
  nutrition: "🍎 Nutrição",
};

export type ProgressPoint = { date: string; value: number };

export type Goal = {
  id: string;
  type: GoalType;
  name: string;
  description: string;
  unit: string;
  startValue: number;
  currentValue: number;
  targetValue: number;
  deadline: string;
  frequency: "diário" | "semanal";
  status: "active" | "completed";
  createdAt: string;
  completedAt?: string;
  history: ProgressPoint[];
};

const today = new Date("2026-07-22");

function daysFromToday(n: number) {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export const seedGoals: Goal[] = [
  {
    id: "g1",
    type: "fitness",
    name: "Ganhar Massa Muscular",
    description: "Aumentar massa muscular mantendo a definição atual.",
    unit: "kg",
    startValue: 74,
    currentValue: 78,
    targetValue: 82,
    deadline: daysFromToday(42),
    frequency: "semanal",
    status: "active",
    createdAt: "2026-06-01",
    history: [
      { date: "2026-06-01", value: 74 },
      { date: "2026-06-15", value: 75.5 },
      { date: "2026-07-01", value: 76.8 },
      { date: "2026-07-15", value: 78 },
    ],
  },
  {
    id: "g2",
    type: "body",
    name: "Perder Peso",
    description: "Reduzir peso corporal com défice calórico controlado.",
    unit: "kg",
    startValue: 80,
    currentValue: 77.5,
    targetValue: 72,
    deadline: daysFromToday(30),
    frequency: "semanal",
    status: "active",
    createdAt: "2026-06-10",
    history: [
      { date: "2026-06-10", value: 80 },
      { date: "2026-06-24", value: 78.5 },
      { date: "2026-07-08", value: 77.8 },
      { date: "2026-07-22", value: 77.5 },
    ],
  },
  {
    id: "g3",
    type: "performance",
    name: "Correr 5km",
    description: "Melhorar o tempo de corrida de 5km.",
    unit: "min",
    startValue: 32,
    currentValue: 27,
    targetValue: 24,
    deadline: daysFromToday(21),
    frequency: "semanal",
    status: "active",
    createdAt: "2026-06-15",
    history: [
      { date: "2026-06-15", value: 32 },
      { date: "2026-07-01", value: 29 },
      { date: "2026-07-15", value: 27 },
    ],
  },
  {
    id: "g4",
    type: "nutrition",
    name: "Atingir Proteína Diária",
    description: "Consumir 160g de proteína por dia de forma consistente.",
    unit: "g",
    startValue: 110,
    currentValue: 145,
    targetValue: 160,
    deadline: daysFromToday(14),
    frequency: "diário",
    status: "active",
    createdAt: "2026-07-01",
    history: [
      { date: "2026-07-01", value: 110 },
      { date: "2026-07-10", value: 128 },
      { date: "2026-07-22", value: 145 },
    ],
  },
  {
    id: "g5",
    type: "performance",
    name: "Supino Reto 70kg",
    description: "Atingir 70kg no supino reto com boa técnica.",
    unit: "kg",
    startValue: 60,
    currentValue: 70,
    targetValue: 70,
    deadline: "2026-07-10",
    frequency: "semanal",
    status: "completed",
    createdAt: "2026-05-01",
    completedAt: "2026-07-08",
    history: [
      { date: "2026-05-01", value: 60 },
      { date: "2026-06-01", value: 65 },
      { date: "2026-07-08", value: 70 },
    ],
  },
];

export function goalProgress(g: Goal) {
  const total = g.targetValue - g.startValue;
  const done = g.currentValue - g.startValue;
  const pct = total !== 0 ? (done / total) * 100 : 100;
  return Math.min(Math.max(pct, 0), 100);
}

export function goalStatusColor(g: Goal): "good" | "warn" | "bad" {
  if (g.status === "completed") return "good";
  const totalDays = (new Date(g.deadline).getTime() - new Date(g.createdAt).getTime()) / 86400000;
  const elapsedDays = (today.getTime() - new Date(g.createdAt).getTime()) / 86400000;
  const expectedPct = totalDays > 0 ? Math.min((elapsedDays / totalDays) * 100, 100) : 100;
  const actualPct = goalProgress(g);
  const diff = actualPct - expectedPct;
  if (diff >= -10) return "good";
  if (diff >= -25) return "warn";
  return "bad";
}

export function daysRemaining(g: Goal) {
  return Math.max(Math.ceil((new Date(g.deadline).getTime() - today.getTime()) / 86400000), 0);
}

export type GoalBadge = { id: string; icon: string; label: string; date: string };
export const goalBadges: GoalBadge[] = [
  { id: "gb1", icon: "🏅", label: "Primeiro objetivo completado", date: "2026-07-08" },
  { id: "gb2", icon: "🔥", label: "Consistência 30 dias", date: "2026-07-15" },
];

export const goalFitPoints = 640;

export function aiCoachFor(g: Goal): string {
  const pct = goalProgress(g);
  const color = goalStatusColor(g);
  const remaining = daysRemaining(g);
  if (g.status === "completed") return `Objetivo concluído! Parabéns por atingires ${g.targetValue}${g.unit}. 🎉`;
  if (color === "bad") return `Estás bastante atrás do esperado (${pct.toFixed(0)}%). Considera ajustar o plano de treino/nutrição ou o prazo.`;
  if (color === "warn") return `Estás um pouco atrás do esperado. Faltam ${remaining} dias — aumenta a consistência esta semana.`;
  return `Estás no caminho certo 🔥 — ${pct.toFixed(0)}% concluído, faltam ${remaining} dias.`;
}
