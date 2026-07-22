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

export type AssignedWorkout = {
  id: string;
  name: string;
  createdBy: string;
  days: string[];
  exercises: Exercise[];
};

export const weekDays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export const assignedWorkouts: AssignedWorkout[] = [
  {
    id: "muscle-growth",
    name: "Muscle Growth Program",
    createdBy: "Ana Ferreira",
    days: ["Segunda", "Quarta", "Sexta"],
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
    createdBy: "Ana Ferreira",
    days: ["Terça", "Quinta"],
    exercises: [
      { id: "e5", name: "Corrida Intervalada", weightKg: 0, sets: 6, reps: 1, restSeconds: 60, instructions: "1 min a ritmo forte, 1 min recuperação." },
      { id: "e6", name: "Burpees", weightKg: 0, sets: 4, reps: 15, restSeconds: 45, instructions: "Movimento explosivo, mantém o ritmo constante." },
    ],
  },
];

export type PersonalWorkout = {
  id: string;
  name: string;
  assignTo: "myself" | "trainee" | "class";
  startDate: string;
  endDate: string;
  notes: string;
  days: string[];
  exercises: Exercise[];
};

export const personalWorkouts: PersonalWorkout[] = [
  {
    id: "my-cardio",
    name: "Cardio Matinal",
    assignTo: "myself",
    startDate: "2026-07-01",
    endDate: "2026-08-31",
    notes: "Antes do pequeno-almoço, ritmo moderado.",
    days: ["Segunda", "Quarta", "Sexta", "Domingo"],
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
};

export const availableClasses: FitClass[] = [
  { id: "c1", name: "CrossFit", trainer: "Nelson Sami", gym: "FitPro Talatona", date: "24 Jul", time: "07:00", seats: 20, seatsTaken: 14, rating: 4.8 },
  { id: "c2", name: "Yoga", trainer: "Diana Sacramento", gym: "FitPro Talatona", date: "25 Jul", time: "18:00", seats: 15, seatsTaken: 9, rating: 4.9 },
  { id: "c3", name: "Boxe", trainer: "Ricardo Bumba", gym: "Corpo Ativo Fitness Club", date: "26 Jul", time: "19:00", seats: 12, seatsTaken: 11, rating: 4.6 },
  { id: "c4", name: "Pilates", trainer: "Marta Neto", gym: "FitPro Talatona", date: "27 Jul", time: "09:00", seats: 10, seatsTaken: 4, rating: 4.7 },
  { id: "c5", name: "Treino Funcional", trainer: "Ana Ferreira", gym: "FitPro Talatona", date: "28 Jul", time: "17:30", seats: 18, seatsTaken: 16, rating: 4.8 },
];

export const myClasses = {
  upcoming: [
    { id: "c1", name: "CrossFit", date: "24 Jul", time: "07:00", trainer: "Nelson Sami", location: "FitPro Talatona" },
    { id: "c4", name: "Pilates", date: "27 Jul", time: "09:00", trainer: "Marta Neto", location: "FitPro Talatona" },
  ],
  past: [
    { id: "c2", name: "Yoga", date: "18 Jul", time: "18:00", trainer: "Diana Sacramento", location: "FitPro Talatona" },
  ],
};

export type BookableTrainer = { id: string; name: string; specialty: string; rating: number; price: string; availability: string[] };
export const bookableTrainers: BookableTrainer[] = [
  { id: "t1", name: "Ana Ferreira", specialty: "Força e hipertrofia", rating: 4.9, price: "8.500 Kz / sessão", availability: ["Hoje 18:00", "Amanhã 07:00", "Amanhã 18:00"] },
  { id: "t2", name: "Rui Ferreira", specialty: "Hipertrofia", rating: 4.7, price: "7.000 Kz / sessão", availability: ["Amanhã 09:00", "Qui 17:00"] },
  { id: "t3", name: "Nelson Sami", specialty: "Performance e CrossFit", rating: 4.8, price: "9.000 Kz / sessão", availability: ["Hoje 20:00", "Sex 07:00"] },
];

export type BookableGym = { id: string; name: string; location: string; price: string; availability: string[] };
export const bookableGyms: BookableGym[] = [
  { id: "g1", name: "FitPro Talatona", location: "Talatona, Luanda", price: "1.500 Kz / visita", availability: ["Hoje 06:00–22:00", "Amanhã 06:00–22:00"] },
  { id: "g2", name: "Corpo Ativo Fitness Club", location: "Viana, Luanda", price: "1.200 Kz / visita", availability: ["Hoje 07:00–21:00"] },
];

export type BookableNutritionist = { id: string; name: string; specialty: string; rating: number; price: string; availability: string[] };
export const bookableNutritionists: BookableNutritionist[] = [
  { id: "n1", name: "Inês Gonçalves", specialty: "Nutrição desportiva", rating: 4.9, price: "6.500 Kz / consulta", availability: ["Qui 14:00", "Sex 10:00"] },
  { id: "n2", name: "Diana Sacramento", specialty: "Perda de peso", rating: 4.6, price: "5.500 Kz / consulta", availability: ["Amanhã 15:00"] },
];
