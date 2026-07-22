import { unsplashImages, portraitImages, bgImage } from "./images";

export type Exercise = {
  id: string;
  name: string;
  weightKg: number;
  sets: number;
  reps: number;
  restSeconds: number;
  instructions: string;
  mediaUrl?: string;
  mediaType?: "image" | "gif" | "video";
};

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
  days: string[];
  durationMin: number;
  difficulty: Difficulty;
  description: string;
  cover: string;
  progress: number;
  exercises: Exercise[];
};

export const weekDays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export const assignedWorkouts: AssignedWorkout[] = [
  {
    id: "muscle-growth",
    name: "Muscle Growth Program",
    type: "Força · Superior",
    createdBy: "Ana Ferreira",
    days: ["Segunda", "Quarta", "Sexta"],
    durationMin: 45,
    difficulty: "Intermédio",
    description: "Foco em peito, ombros e braços com progressão de carga semanal.",
    cover: bgImage(unsplashImages.strength[0]),
    progress: 62,
    exercises: [
      { id: "e1", name: "Supino Reto", weightKg: 60, sets: 4, reps: 10, restSeconds: 90, instructions: "Desce a barra controlada até ao peito, empurra de forma explosiva." },
      { id: "e2", name: "Remada Curvada", weightKg: 50, sets: 4, reps: 10, restSeconds: 90, instructions: "Mantém as costas retas, puxa a barra até ao abdómen." },
      { id: "e3", name: "Agachamento Livre", weightKg: 70, sets: 4, reps: 8, restSeconds: 120, instructions: "Desce até 90°, joelhos alinhados com os pés." },
      { id: "e4", name: "Desenvolvimento Militar", weightKg: 30, sets: 3, reps: 12, restSeconds: 60, instructions: "Empurra a barra acima da cabeça sem arquear as costas." },
    ],
  },
  {
    id: "conditioning",
    name: "Condicionamento Físico",
    type: "Cardio · Intervalado",
    createdBy: "Ana Ferreira",
    days: ["Terça", "Quinta"],
    durationMin: 30,
    difficulty: "Avançado",
    description: "Treino intervalado de alta intensidade para melhorar a resistência.",
    cover: bgImage(unsplashImages.functional[0]),
    progress: 30,
    exercises: [
      { id: "e5", name: "Corrida Intervalada", weightKg: 0, sets: 6, reps: 1, restSeconds: 60, instructions: "1 min a ritmo forte, 1 min recuperação." },
      { id: "e6", name: "Burpees", weightKg: 0, sets: 4, reps: 15, restSeconds: 45, instructions: "Movimento explosivo, mantém o ritmo constante." },
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
    description: "Corrida leve para acordar o corpo e manter a consistência.",
    cover: bgImage(unsplashImages.running[0]),
    progress: 45,
    exercises: [
      { id: "p1", name: "Corrida", weightKg: 0, sets: 1, reps: 1, restSeconds: 0, instructions: "30 minutos a ritmo constante." },
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
