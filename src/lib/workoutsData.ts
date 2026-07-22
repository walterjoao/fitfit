import { unsplashImages, portraitImages, bgImage } from "./images";

export type Exercise = {
  id: string;
  name: string;
  weightKg: number;
  sets: number;
  reps: number;
  restSeconds: number;
  instructions: string;
  muscles: string[];
  gifUrl?: string;
  mediaUrl?: string;
  mediaType?: "image" | "gif" | "video";
};

export type MuscleTarget = { muscle: string; pct: number };

// Deterministic per-exercise history stored locally (no real backend for performance logs).
export function historyKey(exerciseId: string) {
  return `fitpro_exercise_history_${exerciseId}`;
}

export type ExerciseLog = { date: string; weightKg: number };

export function getExerciseHistory(exerciseId: string): ExerciseLog[] {
  try {
    const raw = localStorage.getItem(historyKey(exerciseId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function logExercisePerformance(exerciseId: string, weightKg: number) {
  try {
    const list = getExerciseHistory(exerciseId);
    const next = [...list, { date: new Date().toISOString(), weightKg }].slice(-20);
    localStorage.setItem(historyKey(exerciseId), JSON.stringify(next));
    return next;
  } catch {
    return [];
  }
}

export type Difficulty = "Iniciante" | "Intermédio" | "Avançado";

export const coverGradients = [
  "linear-gradient(155deg,#123B33,#1E7A63)",
  "linear-gradient(155deg,#2A2E3A,#4A5AA8)",
  "linear-gradient(155deg,#3A2A1E,#A8724A)",
  "linear-gradient(155deg,#14171A,#0E7C6B)",
  "linear-gradient(155deg,#3A1E2E,#A84A72)",
  "linear-gradient(155deg,#1E2E3A,#4A8AA8)",
];

export type AssignedWorkout = {
  id: string;
  name: string;
  type: string;
  createdBy: string;
  trainerId?: string;
  days: string[];
  durationMin: number;
  difficulty: Difficulty;
  description: string;
  objective: string;
  audience: string;
  results: string;
  benefits: string[];
  caloriesEstimate: number;
  muscleTargets: MuscleTarget[];
  cover: string;
  progress: number;
  exercises: Exercise[];
};

export const weekDays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export const assignedWorkouts: AssignedWorkout[] = [
  {
    id: "muscle-growth",
    name: "Upper Body Strength",
    type: "Força · Superior",
    createdBy: "Ana Ferreira",
    trainerId: "ana-ferreira",
    days: ["Segunda", "Quarta", "Sexta"],
    durationMin: 45,
    difficulty: "Intermédio",
    description: "Este treino foi criado para desenvolver força na parte superior do corpo, aumentando a massa muscular e melhorando a resistência.",
    objective: "Desenvolver força e volume muscular no peito, ombros, costas e braços.",
    audience: "Atletas em nível intermédio que já dominam a técnica base dos grandes movimentos compostos.",
    results: "Aumento de força visível em 4-6 semanas, com progressão de carga controlada por sessão.",
    benefits: ["💪 Aumento de força", "🔥 Melhor definição muscular", "⚡ Mais resistência", "🏋️ Melhor performance"],
    caloriesEstimate: 380,
    muscleTargets: [
      { muscle: "Peito", pct: 80 },
      { muscle: "Ombros", pct: 60 },
      { muscle: "Tríceps", pct: 50 },
      { muscle: "Costas", pct: 40 },
    ],
    cover: bgImage(unsplashImages.strength[0]),
    progress: 62,
    exercises: [
      { id: "e1", name: "Supino Reto", weightKg: 60, sets: 4, reps: 10, restSeconds: 90, instructions: "Mantém as costas apoiadas, desce a barra controlada até ao peito e empurra de forma explosiva e controlada.", muscles: ["Peito", "Ombros", "Tríceps"], gifUrl: "https://media2.giphy.com/media/v1.Y2lkPThiMjViN2I0aXB0bHhlczk5YWIxaG9neW9lMzVkaXN5MTJobjk0bnYyNG9yeWowMiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/7jTs1C1JiDchQmoRMr/giphy.gif" },
      { id: "e2", name: "Remada Curvada", weightKg: 50, sets: 4, reps: 10, restSeconds: 90, instructions: "Mantém as costas retas, puxa a barra até ao abdómen sem balançar o tronco.", muscles: ["Costas", "Bíceps"], gifUrl: "https://media2.giphy.com/media/v1.Y2lkPThiMjViN2I0ejdiYTRlMHRqcm9lZzEweXppaml5aGkzdTBzZzVrNjY0dHZxNmUwNCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/kt2eEd8IYvV4CMopmK/giphy.gif" },
      { id: "e3", name: "Agachamento Livre", weightKg: 70, sets: 4, reps: 8, restSeconds: 120, instructions: "Desce até 90°, joelhos alinhados com os pés, mantém o peito erguido.", muscles: ["Quadríceps", "Glúteos", "Isquiotibiais"], gifUrl: "https://media2.giphy.com/media/v1.Y2lkPThiMjViN2I0YWp0YWs2YmsyaWlvYjJ5Nmp4MW9hbzkwZjFkOWxqZjBwcW4xZTVmMSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Jlgar7LD1TLWIsHQW7/giphy.gif" },
      { id: "e4", name: "Desenvolvimento Militar", weightKg: 30, sets: 3, reps: 12, restSeconds: 60, instructions: "Empurra a barra acima da cabeça sem arquear as costas, controla a descida.", muscles: ["Ombros", "Tríceps"], gifUrl: "https://media4.giphy.com/media/v1.Y2lkPThiMjViN2I0NXo1cGJhbHRrYjF6NHZuaW5ibXRhMXFiZG4wdHVvNXFsaWthNW16aiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/1qrNKzsgcZtGMkI4pn/giphy.gif" },
    ],
  },
  {
    id: "conditioning",
    name: "Condicionamento Físico",
    type: "Cardio · Intervalado",
    createdBy: "Ana Ferreira",
    trainerId: "ana-ferreira",
    days: ["Terça", "Quinta"],
    durationMin: 30,
    difficulty: "Avançado",
    description: "Treino intervalado de alta intensidade para melhorar a resistência cardiovascular e acelerar o metabolismo.",
    objective: "Melhorar a capacidade cardiovascular e a queima calórica através de intervalos de alta intensidade.",
    audience: "Atletas avançados com boa base cardiovascular à procura de mais intensidade.",
    results: "Melhoria da resistência e recuperação entre esforços em 3-4 semanas.",
    benefits: ["🔥 Alta queima calórica", "❤️ Melhor capacidade cardiovascular", "⚡ Mais explosão", "🏃 Melhor recuperação"],
    caloriesEstimate: 420,
    muscleTargets: [
      { muscle: "Cardio", pct: 90 },
      { muscle: "Pernas", pct: 60 },
      { muscle: "Core", pct: 40 },
    ],
    cover: bgImage(unsplashImages.functional[0]),
    progress: 30,
    exercises: [
      { id: "e5", name: "Corrida Intervalada", weightKg: 0, sets: 6, reps: 1, restSeconds: 60, instructions: "1 minuto a ritmo forte, 1 minuto de recuperação ativa.", muscles: ["Cardio", "Pernas"], gifUrl: "https://media0.giphy.com/media/v1.Y2lkPThiMjViN2I0eWJoaTBvaHdhYnM4NTZyc3pyMTF0ZWNudXJ3bGU3NXR1OTd4dnQ0byZlcD12MV9naWZzX3NlYXJjaCZjdD1n/OCrOhx5y2vZmpsylho/giphy.gif" },
      { id: "e6", name: "Burpees", weightKg: 0, sets: 4, reps: 15, restSeconds: 45, instructions: "Movimento explosivo e completo, mantém o ritmo constante do início ao fim.", muscles: ["Corpo Inteiro"], gifUrl: "https://media1.giphy.com/media/v1.Y2lkPThiMjViN2I0bDR5eXh1bTYxOGxydHRjZ2k2enptZzEyazRjNGwxN3E0cmhjdGVuYiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/fqVQcdzMgwSXIvNaL4/giphy.gif" },
    ],
  },
];

export type PersonalWorkout = {
  id: string;
  name: string;
  type: string;
  assignTo: "myself" | "trainee" | "class";
  startDate: string;
  endDate: string;
  notes: string;
  days: string[];
  durationMin: number;
  difficulty: Difficulty;
  description: string;
  objective: string;
  audience: string;
  results: string;
  benefits: string[];
  caloriesEstimate: number;
  muscleTargets: MuscleTarget[];
  cover: string;
  progress: number;
  exercises: Exercise[];
};

export const personalWorkouts: PersonalWorkout[] = [
  {
    id: "my-cardio",
    name: "Cardio Matinal",
    type: "Cardio · Resistência",
    assignTo: "myself",
    startDate: "2026-07-01",
    endDate: "2026-08-31",
    notes: "Antes do pequeno-almoço, ritmo moderado.",
    days: ["Segunda", "Quarta", "Sexta", "Domingo"],
    durationMin: 30,
    difficulty: "Iniciante",
    description: "Corrida leve para acordar o corpo, melhorar a resistência e manter a consistência diária.",
    objective: "Criar o hábito de treino matinal e desenvolver uma base cardiovascular sólida.",
    audience: "Atletas iniciantes que querem construir consistência antes de aumentar a intensidade.",
    results: "Mais energia ao longo do dia e melhoria gradual do ritmo de corrida em 2-3 semanas.",
    benefits: ["❤️ Melhor saúde cardiovascular", "⚡ Mais energia", "😌 Redução de stress", "📈 Consistência diária"],
    caloriesEstimate: 260,
    muscleTargets: [
      { muscle: "Cardio", pct: 85 },
      { muscle: "Pernas", pct: 50 },
    ],
    cover: bgImage(unsplashImages.running[0]),
    progress: 45,
    exercises: [
      { id: "p1", name: "Corrida", weightKg: 0, sets: 1, reps: 1, restSeconds: 0, instructions: "30 minutos a ritmo constante, respiração controlada.", muscles: ["Cardio", "Pernas"], gifUrl: "https://media0.giphy.com/media/v1.Y2lkPThiMjViN2I0eWJoaTBvaHdhYnM4NTZyc3pyMTF0ZWNudXJ3bGU3NXR1OTd4dnQ0byZlcD12MV9naWZzX3NlYXJjaCZjdD1n/OCrOhx5y2vZmpsylho/giphy.gif" },
    ],
  },
];

export type FitClass = {
  id: string;
  name: string;
  trainer: string;
  gym: string;
  date: string;
  time: string;
  seats: number;
  seatsTaken: number;
  rating: number;
  reviews: number;
  durationMin: number;
  difficulty: Difficulty;
  description: string;
  cover: string;
  price: string;
  location: string;
};

export const availableClasses: FitClass[] = [
  { id: "c1", name: "CrossFit Beginner", trainer: "Nelson Sami", gym: "Power Gym Talatona", date: "24 Jul", time: "07:00", seats: 20, seatsTaken: 18, rating: 4.9, reviews: 62, durationMin: 50, difficulty: "Iniciante", description: "Introdução ao CrossFit com foco em técnica e condicionamento geral.", cover: bgImage(unsplashImages.crossfit[0]), price: "1.500 Kz", location: "Talatona, Luanda" },
  { id: "c2", name: "Yoga Flow", trainer: "Diana Sacramento", gym: "FitPro Talatona", date: "25 Jul", time: "18:00", seats: 15, seatsTaken: 9, rating: 4.9, reviews: 48, durationMin: 60, difficulty: "Iniciante", description: "Sequência fluida de yoga para flexibilidade e redução de stress.", cover: bgImage(unsplashImages.yoga[0]), price: "1.200 Kz", location: "Talatona, Luanda" },
  { id: "c3", name: "Boxe Técnico", trainer: "Ricardo Bumba", gym: "Corpo Ativo Fitness Club", date: "26 Jul", time: "19:00", seats: 12, seatsTaken: 11, rating: 4.6, reviews: 30, durationMin: 55, difficulty: "Intermédio", description: "Fundamentos de boxe: postura, jogo de pernas e combinações.", cover: bgImage(unsplashImages.boxing[0]), price: "1.800 Kz", location: "Viana, Luanda" },
  { id: "c4", name: "Pilates Reformer", trainer: "Marta Neto", gym: "FitPro Talatona", date: "27 Jul", time: "09:00", seats: 10, seatsTaken: 4, rating: 4.7, reviews: 21, durationMin: 45, difficulty: "Iniciante", description: "Fortalecimento do core com equipamento reformer.", cover: bgImage(unsplashImages.pilates[0]), price: "2.000 Kz", location: "Talatona, Luanda" },
  { id: "c5", name: "Treino Funcional", trainer: "Ana Ferreira", gym: "FitPro Talatona", date: "28 Jul", time: "17:30", seats: 18, seatsTaken: 16, rating: 4.8, reviews: 54, durationMin: 45, difficulty: "Intermédio", description: "Movimentos funcionais de alta intensidade em circuito.", cover: bgImage(unsplashImages.functional[0]), price: "1.500 Kz", location: "Talatona, Luanda" },
];

export const myClasses = {
  upcoming: [
    { id: "c1", name: "CrossFit Beginner", date: "24 Jul", time: "07:00", trainer: "Nelson Sami", location: "Power Gym Talatona", status: "confirmada" as const },
    { id: "c4", name: "Pilates Reformer", date: "27 Jul", time: "09:00", trainer: "Marta Neto", location: "FitPro Talatona", status: "confirmada" as const },
  ],
  past: [
    { id: "c2", name: "Yoga Flow", date: "18 Jul", time: "18:00", trainer: "Diana Sacramento", location: "FitPro Talatona", status: "concluída" as const },
  ],
};

export type BookableTrainer = { id: string; name: string; specialty: string; rating: number; reviews: number; price: string; durationMin: number; description: string; availability: string[]; cover: string };
export const bookableTrainers: BookableTrainer[] = [
  { id: "t1", name: "Ana Ferreira", specialty: "Força e hipertrofia", rating: 4.9, reviews: 84, price: "8.500 Kz", durationMin: 60, description: "Treino privado focado em ganho de massa muscular e técnica.", availability: ["Hoje 18:00", "Amanhã 07:00", "Amanhã 18:00"], cover: bgImage(portraitImages.trainer[0]) },
  { id: "t2", name: "Rui Ferreira", specialty: "Hipertrofia", rating: 4.7, reviews: 52, price: "7.000 Kz", durationMin: 60, description: "Sessões individuais com planos de progressão personalizados.", availability: ["Amanhã 09:00", "Qui 17:00"], cover: bgImage(portraitImages.trainer[1]) },
  { id: "t3", name: "Nelson Sami", specialty: "Performance e CrossFit", rating: 4.8, reviews: 41, price: "9.000 Kz", durationMin: 50, description: "Treino de alta performance para atletas de CrossFit.", availability: ["Hoje 20:00", "Sex 07:00"], cover: bgImage(portraitImages.trainer[2]) },
];

export type BookableGym = { id: string; name: string; location: string; price: string; durationMin: number; description: string; availability: string[]; cover: string };
export const bookableGyms: BookableGym[] = [
  { id: "g1", name: "FitPro Talatona", location: "Talatona, Luanda", price: "1.500 Kz", durationMin: 90, description: "Acesso completo ao ginásio: sala de musculação, cardio e balneários.", availability: ["Hoje 06:00–22:00", "Amanhã 06:00–22:00"], cover: bgImage(unsplashImages.gym[0]) },
  { id: "g2", name: "Corpo Ativo Fitness Club", location: "Viana, Luanda", price: "1.200 Kz", durationMin: 90, description: "Ginásio completo com aulas de grupo incluídas.", availability: ["Hoje 07:00–21:00"], cover: bgImage(unsplashImages.gym[1]) },
];

export type BookableNutritionist = { id: string; name: string; specialty: string; rating: number; reviews: number; price: string; durationMin: number; description: string; availability: string[]; cover: string };
export const bookableNutritionists: BookableNutritionist[] = [
  { id: "n1", name: "Inês Gonçalves", specialty: "Nutrição desportiva", rating: 4.9, reviews: 46, price: "6.500 Kz", durationMin: 40, description: "Planos nutricionais personalizados para atletas e alto rendimento.", availability: ["Qui 14:00", "Sex 10:00"], cover: bgImage(portraitImages.nutritionist[0]) },
  { id: "n2", name: "Diana Sacramento", specialty: "Perda de peso", rating: 4.6, reviews: 30, price: "5.500 Kz", durationMin: 40, description: "Acompanhamento nutricional focado em perda de peso sustentável.", availability: ["Amanhã 15:00"], cover: bgImage(portraitImages.nutritionist[1]) },
];
