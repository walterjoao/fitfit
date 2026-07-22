import { unsplashImages, bgImage } from "./images";

export type MealType = "breakfast" | "lunch" | "snack" | "dinner";

export const mealTypeLabel: Record<MealType, string> = {
  breakfast: "Pequeno-almoço",
  lunch: "Almoço",
  snack: "Lanche",
  dinner: "Jantar",
};

export const mealTypeIcon: Record<MealType, string> = {
  breakfast: "☀️",
  lunch: "🥗",
  snack: "🍎",
  dinner: "🌙",
};

export type Meal = {
  id: string;
  type: MealType;
  name: string;
  time: string;
  image: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  consumed: boolean;
};

export const todayMeals: Meal[] = [
  {
    id: "m1", type: "breakfast", name: "Aveia com Ovos", time: "08:00",
    image: bgImage(unsplashImages.meals[0]),
    calories: 520, protein: 35, carbs: 55, fat: 18,
    ingredients: ["60g de aveia", "2 ovos", "1 banana", "Canela"],
    consumed: true,
  },
  {
    id: "m2", type: "lunch", name: "Salada de Frango Grelhado", time: "13:00",
    image: bgImage(unsplashImages.meals[1]),
    calories: 610, protein: 48, carbs: 40, fat: 22,
    ingredients: ["200g de peito de frango", "Alface e tomate", "Arroz integral", "Azeite"],
    consumed: true,
  },
  {
    id: "m3", type: "snack", name: "Smoothie de Proteína", time: "16:30",
    image: bgImage(unsplashImages.meals[3]),
    calories: 280, protein: 25, carbs: 30, fat: 6,
    ingredients: ["Whey Protein", "Leite", "Banana", "Manteiga de amendoim"],
    consumed: false,
  },
  {
    id: "m4", type: "dinner", name: "Salmão com Legumes", time: "20:00",
    image: bgImage(unsplashImages.meals[2]),
    calories: 440, protein: 38, carbs: 25, fat: 20,
    ingredients: ["180g de salmão", "Brócolos", "Batata doce", "Limão"],
    consumed: false,
  },
];

export const dailyTarget = { calories: 2400, protein: 160, carbs: 280, fat: 70, waterL: 3 };

export function todayTotals() {
  return todayMeals
    .filter((m) => m.consumed)
    .reduce(
      (acc, m) => ({
        calories: acc.calories + m.calories,
        protein: acc.protein + m.protein,
        carbs: acc.carbs + m.carbs,
        fat: acc.fat + m.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
}

export type WeeklyPlanDay = { day: string; focus: string; meals: MealType[] };
export const weeklyPlan: WeeklyPlanDay[] = [
  { day: "Segunda", focus: "Alto teor proteico", meals: ["breakfast", "lunch", "snack", "dinner"] },
  { day: "Terça", focus: "Baixo carboidrato", meals: ["breakfast", "lunch", "dinner"] },
  { day: "Quarta", focus: "Equilibrado", meals: ["breakfast", "lunch", "snack", "dinner"] },
  { day: "Quinta", focus: "Alto teor proteico", meals: ["breakfast", "lunch", "snack", "dinner"] },
  { day: "Sexta", focus: "Refeição livre", meals: ["breakfast", "lunch", "dinner"] },
  { day: "Sábado", focus: "Equilibrado", meals: ["breakfast", "lunch", "snack", "dinner"] },
  { day: "Domingo", focus: "Recuperação", meals: ["breakfast", "lunch", "dinner"] },
];

export type LoggedMeal = { id: string; name: string; time: string; calories: number; protein: number; carbs: number; fat: number; note?: string };
export const athleteLog: LoggedMeal[] = [
  { id: "l1", name: "Iogurte grego com frutos vermelhos", time: "Ontem · 10:30", calories: 210, protein: 18, carbs: 22, fat: 5 },
];

export type NutritionGoalType = "lose_weight" | "build_muscle" | "maintain" | "performance";
export const nutritionGoalLabel: Record<NutritionGoalType, string> = {
  lose_weight: "Perder peso",
  build_muscle: "Ganhar massa",
  maintain: "Manter peso",
  performance: "Performance",
};

export const nutritionGoal = {
  type: "build_muscle" as NutritionGoalType,
  currentWeightKg: 78.4,
  targetWeightKg: 82,
  startWeightKg: 74,
};

export const weeklyCaloriesHistory = [
  { day: "Seg", kcal: 2380 }, { day: "Ter", kcal: 2210 }, { day: "Qua", kcal: 2450 },
  { day: "Qui", kcal: 2300 }, { day: "Sex", kcal: 2600 }, { day: "Sáb", kcal: 2100 }, { day: "Dom", kcal: 1980 },
];

export const weightHistory = [
  { week: "S1", kg: 74.0 }, { week: "S2", kg: 75.1 }, { week: "S3", kg: 75.8 },
  { week: "S4", kg: 76.6 }, { week: "S5", kg: 77.5 }, { week: "S6", kg: 78.4 },
];

export const planAdherence = 85;

export type NutritionAssignment = { id: string; clientName: string; planName: string; date: string; status: "active" | "completed" };
const NUTRI_ASSIGN_KEY = "fitpro_nutritionist_assignments";
function readList<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function writeList<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}
export function getNutritionAssignments(): NutritionAssignment[] {
  return readList(NUTRI_ASSIGN_KEY, []);
}
export function addNutritionAssignment(clientName: string, planName: string) {
  const next: NutritionAssignment[] = [{ id: Math.random().toString(36).slice(2), clientName, planName, date: new Date().toISOString().slice(0, 10), status: "active" }, ...getNutritionAssignments()];
  writeList(NUTRI_ASSIGN_KEY, next);
  return next;
}

export const aiNutritionInsights = [
  "Hoje faltam 40g de proteína para atingires a tua meta diária.",
  "Baseado no teu treino de amanhã (Força · Superior), recomenda-se aumentar os carboidratos no jantar de hoje.",
  "Bebeste apenas 1.2L de água hoje — tenta chegar aos 3L até ao final do dia.",
];

export type MealPlan = {
  id: string;
  name: string;
  goal: string;
  duration: string;
  createdBy: string;
  createdByRole: "nutritionist" | "self";
  progress: number;
  cover: string;
  days: WeeklyPlanDay[];
};

export const mealPlans: MealPlan[] = [
  {
    id: "plan-muscle-gain", name: "Plano Ganho de Massa Magra", goal: "Ganhar massa muscular", duration: "30 dias",
    createdBy: "Inês Gonçalves", createdByRole: "nutritionist", progress: 62,
    cover: bgImage(unsplashImages.meals[0]),
    days: weeklyPlan,
  },
  {
    id: "plan-performance", name: "Plano Performance", goal: "Melhorar rendimento desportivo", duration: "30 dias",
    createdBy: "Inês Gonçalves", createdByRole: "nutritionist", progress: 40,
    cover: bgImage(unsplashImages.meals[1]),
    days: weeklyPlan,
  },
  {
    id: "plan-my-cut", name: "O Meu Plano de Definição", goal: "Perder gordura mantendo massa", duration: "Contínuo",
    createdBy: "Tiago Kiala", createdByRole: "self", progress: 25,
    cover: bgImage(unsplashImages.meals[2]),
    days: weeklyPlan,
  },
];

export type SharedMeal = {
  id: string;
  creator: string;
  creatorRole: "nutritionist" | "trainer" | "gym" | "athlete";
  image: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
};

export const sharedMeals: SharedMeal[] = [
  { id: "sh1", creator: "Inês Gonçalves", creatorRole: "nutritionist", image: unsplashImages.meals[0], description: "Bowl de frango, quinoa e vegetais grelhados — ótimo para dias de treino intenso.", calories: 480, protein: 42, carbs: 45, fat: 14, date: "Há 2 dias" },
  { id: "sh2", creator: "Ana Ferreira", creatorRole: "trainer", image: unsplashImages.meals[1], description: "Omelete de claras com espinafres, ideal para o pequeno-almoço pré-treino.", calories: 260, protein: 30, carbs: 8, fat: 10, date: "Há 3 dias" },
  { id: "sh3", creator: "Beatriz Chiapa", creatorRole: "athlete", image: unsplashImages.meals[2], description: "A minha salada de atum e grão pós-treino — simples e rica em proteína.", calories: 390, protein: 34, carbs: 30, fat: 12, date: "Há 5 dias" },
  { id: "sh4", creator: "FitPro Talatona", creatorRole: "gym", image: unsplashImages.meals[3], description: "Smoothie de proteína recomendado para recuperação depois de aulas de CrossFit.", calories: 280, protein: 25, carbs: 30, fat: 6, date: "Há 1 semana" },
];
