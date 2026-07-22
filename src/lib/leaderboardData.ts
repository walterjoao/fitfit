import { portraitImages, unsplashImages, bgImage } from "./images";

export type AthleteRank = {
  id: string;
  name: string;
  cover: string;
  level: number;
  points: number;
  streak: number;
  badges: number;
};

export const athleteLeaderboard: AthleteRank[] = [
  { id: "joao-silva", name: "João Silva", cover: bgImage(portraitImages.athlete[0]), level: 15, points: 12500, streak: 45, badges: 12 },
  { id: "carla-domingos", name: "Carla Domingos", cover: bgImage(portraitImages.athlete[1]), level: 14, points: 11840, streak: 38, badges: 11 },
  { id: "tiago-kiala", name: "Tiago Kiala", cover: bgImage(portraitImages.athlete[0]), level: 13, points: 10980, streak: 42, badges: 9 },
  { id: "beatriz-chiapa", name: "Beatriz Chiapa", cover: bgImage(portraitImages.athlete[1]), level: 12, points: 9870, streak: 21, badges: 8 },
  { id: "ricardo-bumba", name: "Ricardo Bumba", cover: bgImage(portraitImages.trainer[0]), level: 11, points: 8905, streak: 14, badges: 7 },
  { id: "andre-katumba", name: "André Katumba", cover: bgImage(portraitImages.trainer[1]), level: 10, points: 7960, streak: 30, badges: 6 },
];

export type TrainerRank = {
  id: string;
  name: string;
  cover: string;
  specialty: string;
  rating: number;
  clients: number;
  sessions: number;
};

export const trainerLeaderboard: TrainerRank[] = [
  { id: "ana-ferreira", name: "Ana Ferreira", cover: bgImage(portraitImages.trainer[0]), specialty: "Força e hipertrofia", rating: 4.9, clients: 84, sessions: 1240 },
  { id: "nelson-sami", name: "Nelson Sami", cover: bgImage(portraitImages.trainer[2]), specialty: "Performance e CrossFit", rating: 4.8, clients: 41, sessions: 860 },
  { id: "rui-ferreira", name: "Rui Ferreira", cover: bgImage(portraitImages.trainer[1]), specialty: "Hipertrofia", rating: 4.7, clients: 52, sessions: 910 },
];

export type GymRank = {
  id: string;
  name: string;
  cover: string;
  location: string;
  rating: number;
  members: number;
  classes: number;
};

export const gymLeaderboard: GymRank[] = [
  { id: "fitpro-talatona", name: "FitPro Talatona", cover: bgImage(unsplashImages.gym[0]), location: "Talatona, Luanda", rating: 4.7, members: 1240, classes: 18 },
  { id: "corpo-ativo-fitness-club", name: "Corpo Ativo Fitness Club", cover: bgImage(unsplashImages.gym[1]), location: "Viana, Luanda", rating: 4.5, members: 640, classes: 11 },
];

export type NutritionistRank = {
  id: string;
  name: string;
  cover: string;
  specialty: string;
  rating: number;
  clients: number;
  results: string;
};

export const nutritionistLeaderboard: NutritionistRank[] = [
  { id: "ines-goncalves", name: "Inês Gonçalves", cover: bgImage(portraitImages.nutritionist[0]), specialty: "Nutrição desportiva", rating: 4.9, clients: 46, results: "92% atingiram o objetivo" },
  { id: "diana-sacramento", name: "Diana Sacramento", cover: bgImage(portraitImages.nutritionist[1]), specialty: "Perda de peso", rating: 4.6, clients: 30, results: "84% atingiram o objetivo" },
];

export type ShopRank = {
  id: string;
  name: string;
  cover: string;
  owner: string;
  rating: number;
  products: number;
  sales: number;
};

export const shopLeaderboard: ShopRank[] = [
  { id: "nutrimax-luanda", name: "NutriMax Luanda", cover: bgImage(unsplashImages.nutrition[0]), owner: "NutriMax Luanda", rating: 4.6, products: 42, sales: 1840 },
  { id: "supleforte", name: "SupleForte", cover: bgImage(unsplashImages.nutrition[1]), owner: "SupleForte", rating: 4.5, products: 28, sales: 1120 },
  { id: "corpo-ativo-shop", name: "Corpo Ativo Shop", cover: bgImage(unsplashImages.nutrition[2]), owner: "Corpo Ativo Shop", rating: 4.4, products: 19, sales: 640 },
];

export const medal = (i: number) => (i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`);
