import { unsplashImages, portraitImages, bgImage } from "./images";

export type DirRole = "athlete" | "trainer" | "nutritionist" | "gym" | "shop";

export type DirProfile = {
  id: string;
  name: string;
  role: DirRole;
  location: string;
  bio: string;
  cover: string;
  followers: number;
  following: number;
  rating: number;
  reviews: number;
  whatsapp?: string;
  specialties?: string[];
  certifications?: string[];
  facilities?: string[];
  reviewsList: { author: string; text: string; rating: number }[];
};

export const directory: Record<string, DirProfile> = {
  "ana-ferreira": {
    id: "ana-ferreira", name: "Ana Ferreira", role: "trainer", location: "Talatona, Luanda",
    bio: "Personal Trainer certificada especializada em força e hipertrofia. 8 anos de experiência a ajudar atletas a atingir o seu potencial máximo.",
    cover: bgImage(portraitImages.trainer[0]), followers: 1240, following: 86, rating: 4.9, reviews: 84, whatsapp: "+244 923 000 001",
    specialties: ["Força e hipertrofia", "Recomposição corporal", "Treino funcional"],
    certifications: ["Personal Trainer Certificado (IFBB)", "Especialista em Nutrição Desportiva"],
    reviewsList: [
      { author: "Carla Domingos", text: "A Ana mudou completamente a minha relação com o treino. Recomendo!", rating: 5 },
      { author: "Rui Ferreira", text: "Profissional excelente, muito atenta à técnica.", rating: 5 },
    ],
  },
  "ines-goncalves": {
    id: "ines-goncalves", name: "Inês Gonçalves", role: "nutritionist", location: "Talatona, Luanda",
    bio: "Nutricionista desportiva focada em planos alimentares personalizados para atletas de alto rendimento.",
    cover: bgImage(portraitImages.nutritionist[0]), followers: 640, following: 40, rating: 4.9, reviews: 46, whatsapp: "+244 923 000 002",
    specialties: ["Nutrição desportiva", "Perda de peso", "Ganho de massa muscular"],
    certifications: ["Ordem dos Nutricionistas de Angola", "Pós-graduação em Nutrição Clínica"],
    reviewsList: [
      { author: "Marta Neto", text: "Plano alimentar fácil de seguir e resultados reais.", rating: 5 },
    ],
  },
  "fitpro-talatona": {
    id: "fitpro-talatona", name: "FitPro Talatona", role: "gym", location: "Talatona, Luanda",
    bio: "O ginásio mais completo de Talatona: sala de musculação, cardio, aulas de grupo e piscina.",
    cover: bgImage(unsplashImages.gym[2]), followers: 3400, following: 12, rating: 4.7, reviews: 312,
    facilities: ["Sala de musculação", "Zona de cardio", "Aulas de grupo", "Balneários", "Estacionamento"],
    reviewsList: [
      { author: "Tiago Kiala", text: "Ótimas instalações e staff simpático.", rating: 5 },
    ],
  },
  "nutrimax-luanda": {
    id: "nutrimax-luanda", name: "NutriMax Luanda", role: "shop", location: "Luanda",
    bio: "Loja parceira FitPro especializada em suplementação desportiva de alta qualidade.",
    cover: bgImage(unsplashImages.nutrition[0]), followers: 890, following: 5, rating: 4.6, reviews: 120,
    reviewsList: [
      { author: "Ricardo Bumba", text: "Entrega rápida e produtos originais.", rating: 5 },
    ],
  },
  "tiago-kiala": {
    id: "tiago-kiala", name: "Tiago Kiala", role: "athlete", location: "Viana, Luanda",
    bio: "Atleta focado em consistência — 42 sessões seguidas e a contar.",
    cover: bgImage(portraitImages.athlete[0]), followers: 210, following: 64, rating: 4.8, reviews: 12,
    reviewsList: [],
  },
};

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function directoryByName(name: string): DirProfile | undefined {
  return Object.values(directory).find((p) => p.name === name);
}

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
}

const genericBios: Record<DirRole, string> = {
  athlete: "Membro ativo da comunidade FitPro, sempre a treinar e a evoluir.",
  trainer: "Personal Trainer na comunidade FitPro.",
  nutritionist: "Nutricionista na comunidade FitPro.",
  gym: "Ginásio parceiro FitPro.",
  shop: "Loja parceira FitPro.",
};

export function getProfile(idOrName: string): DirProfile | undefined {
  if (directory[idOrName]) return directory[idOrName];
  const byName = directoryByName(idOrName.replace(/-/g, " "));
  if (byName) return byName;

  // Generic profile for any athlete/community name not in the curated directory
  const name = idOrName
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  if (!name) return undefined;
  const h = hashCode(name);
  return {
    id: slugify(name),
    name,
    role: "athlete",
    location: "Luanda",
    bio: genericBios.athlete,
    cover: bgImage(portraitImages.athlete[h % portraitImages.athlete.length]),
    followers: 40 + (h % 300),
    following: 10 + (h % 120),
    rating: 4.3 + (h % 6) / 10,
    reviews: h % 30,
    reviewsList: [],
  };
}

const FOLLOW_KEY = "fitpro_following";

export function isFollowing(id: string): boolean {
  try {
    const list: string[] = JSON.parse(localStorage.getItem(FOLLOW_KEY) || "[]");
    return list.includes(id);
  } catch {
    return false;
  }
}

export function toggleFollow(id: string): boolean {
  try {
    const list: string[] = JSON.parse(localStorage.getItem(FOLLOW_KEY) || "[]");
    const now = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
    localStorage.setItem(FOLLOW_KEY, JSON.stringify(now));
    return now.includes(id);
  } catch {
    return false;
  }
}
