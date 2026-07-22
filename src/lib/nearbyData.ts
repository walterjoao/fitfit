import { unsplashImages, portraitImages, bgImage } from "./images";

export type NearbyType = "athlete" | "trainer" | "gym" | "nutritionist";

export type NearbyEntry = {
  id: string;
  type: NearbyType;
  name: string;
  cover: string;
  distanceKm: number;
  rating?: number;
  reviews?: number;
  price?: string;
  goal?: string;
  level?: string;
  followers?: number;
  specialty?: string;
  location?: string;
  services?: string[];
};

export const nearbyEntries: NearbyEntry[] = [
  { id: "ana-ferreira", type: "trainer", name: "Ana Ferreira", cover: bgImage(portraitImages.trainer[0]), distanceKm: 1.2, rating: 4.9, reviews: 84, price: "8.500 Kz", specialty: "Força e hipertrofia" },
  { id: "rui-ferreira", type: "trainer", name: "Rui Ferreira", cover: bgImage(portraitImages.trainer[1]), distanceKm: 2.4, rating: 4.7, reviews: 52, price: "7.000 Kz", specialty: "Hipertrofia" },
  { id: "nelson-sami", type: "trainer", name: "Nelson Sami", cover: bgImage(portraitImages.trainer[2]), distanceKm: 3.8, rating: 4.8, reviews: 41, price: "9.000 Kz", specialty: "Performance e CrossFit" },
  { id: "fitpro-talatona", type: "gym", name: "FitPro Talatona", cover: bgImage(unsplashImages.gym[0]), distanceKm: 0.9, rating: 4.7, reviews: 312, location: "Talatona, Luanda", services: ["Musculação", "Cardio", "Aulas de grupo"] },
  { id: "corpo-ativo", type: "gym", name: "Corpo Ativo Fitness Club", cover: bgImage(unsplashImages.gym[1]), distanceKm: 3.1, rating: 4.5, reviews: 128, location: "Viana, Luanda", services: ["Musculação", "Boxe", "Funcional"] },
  { id: "ines-goncalves", type: "nutritionist", name: "Inês Gonçalves", cover: bgImage(portraitImages.nutritionist[0]), distanceKm: 1.7, rating: 4.9, reviews: 46, price: "6.500 Kz", specialty: "Nutrição desportiva" },
  { id: "diana-sacramento", type: "nutritionist", name: "Diana Sacramento", cover: bgImage(portraitImages.nutritionist[1]), distanceKm: 4.2, rating: 4.6, reviews: 30, price: "5.500 Kz", specialty: "Perda de peso" },
  { id: "tiago-kiala", type: "athlete", name: "Tiago Kiala", cover: bgImage(portraitImages.athlete[0]), distanceKm: 0.5, goal: "Consistência", level: "Intermédio", followers: 210 },
  { id: "beatriz-chiapa", type: "athlete", name: "Beatriz Chiapa", cover: bgImage(portraitImages.athlete[1]), distanceKm: 2.9, goal: "Transformação", level: "Iniciante", followers: 96 },
  { id: "ricardo-bumba", type: "athlete", name: "Ricardo Bumba", cover: bgImage(portraitImages.trainer[0]), distanceKm: 3.4, goal: "Ganho de massa", level: "Avançado", followers: 154 },
];

export const nearbyTypeLabel: Record<NearbyType, string> = {
  athlete: "👤 Atleta",
  trainer: "🧑‍🏫 Personal Trainer",
  gym: "🏋️ Ginásio",
  nutritionist: "🥗 Nutricionista",
};

export const nearbyTypeColor: Record<NearbyType, string> = {
  athlete: "var(--accent)",
  trainer: "var(--gold)",
  gym: "var(--bad)",
  nutritionist: "var(--good)",
};

// Deterministic pseudo-map coordinates (percent) for the stylized map panel.
export function pinPosition(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 10000;
  const x = 10 + (h % 80);
  const y = 15 + ((h * 7) % 70);
  return { x, y };
}
