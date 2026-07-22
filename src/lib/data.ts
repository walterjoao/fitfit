import { unsplashImages, bgImage } from "./images";

export type Trend = "up" | "down" | "flat";

export type LeaderboardCategory = {
  podium: { n: string; sub: string; xp: string }[];
  list: [string, string, Trend][];
};

export const lbData: Record<"transformation" | "consistency" | "nutrition" | "community", LeaderboardCategory> = {
  transformation: {
    podium: [
      { n: "Carla Domingos", sub: "Perdeu 8kg em 12 semanas", xp: "12.480" },
      { n: "Rui Ferreira", sub: "Ganhou 4kg de massa magra", xp: "11.920" },
      { n: "Inês Gonçalves", sub: "Recomposição corporal", xp: "11.540" },
    ],
    list: [
      ["Tiago Kiala", "10.980", "up"],
      ["Marta Neto", "10.410", "up"],
      ["Nelson Sami", "9.870", "flat"],
      ["Beatriz Chiapa", "9.340", "down"],
      ["Ricardo Bumba", "8.905", "up"],
      ["Diana Sacramento", "8.412", "down"],
      ["André Katumba", "7.960", "flat"],
    ],
  },
  consistency: {
    podium: [
      { n: "André Katumba", sub: "42 sessões seguidas", xp: "13.150" },
      { n: "Diana Sacramento", sub: "38 sessões seguidas", xp: "12.640" },
      { n: "Ricardo Bumba", sub: "35 sessões seguidas", xp: "12.010" },
    ],
    list: [
      ["Beatriz Chiapa", "11.500", "up"],
      ["Nelson Sami", "11.080", "flat"],
      ["Marta Neto", "10.640", "up"],
      ["Tiago Kiala", "10.120", "down"],
      ["Inês Gonçalves", "9.580", "up"],
      ["Rui Ferreira", "9.040", "flat"],
      ["Carla Domingos", "8.600", "down"],
    ],
  },
  nutrition: {
    podium: [
      { n: "Inês Gonçalves", sub: "90 dias de plano seguido", xp: "11.720" },
      { n: "Marta Neto", sub: "84 dias de plano seguido", xp: "11.260" },
      { n: "Nelson Sami", sub: "79 dias de plano seguido", xp: "10.890" },
    ],
    list: [
      ["Carla Domingos", "10.310", "flat"],
      ["André Katumba", "9.870", "up"],
      ["Tiago Kiala", "9.420", "up"],
      ["Diana Sacramento", "8.960", "down"],
      ["Ricardo Bumba", "8.510", "flat"],
      ["Rui Ferreira", "8.040", "up"],
      ["Beatriz Chiapa", "7.600", "down"],
    ],
  },
  community: {
    podium: [
      { n: "Nelson Sami", sub: "Convidou 14 amigos ativos", xp: "9.980" },
      { n: "Beatriz Chiapa", sub: "Convidou 11 amigos ativos", xp: "9.540" },
      { n: "Tiago Kiala", sub: "Convidou 9 amigos ativos", xp: "9.120" },
    ],
    list: [
      ["Ricardo Bumba", "8.760", "up"],
      ["Carla Domingos", "8.310", "down"],
      ["Rui Ferreira", "7.940", "flat"],
      ["André Katumba", "7.500", "up"],
      ["Inês Gonçalves", "7.080", "flat"],
      ["Marta Neto", "6.640", "down"],
      ["Diana Sacramento", "6.220", "up"],
    ],
  },
};

export type ProductCat =
  | "proteinas"
  | "ganho_massa"
  | "energia_pre_treino"
  | "perda_peso"
  | "vitaminas_minerais"
  | "alimentacao_saudavel"
  | "equipamentos"
  | "roupa_fitness"
  | "acessorios";

export const catIcon: Record<ProductCat, string> = {
  proteinas: "🥤",
  ganho_massa: "💪",
  energia_pre_treino: "⚡",
  perda_peso: "🔥",
  vitaminas_minerais: "🧬",
  alimentacao_saudavel: "🥗",
  equipamentos: "🏋️",
  roupa_fitness: "👕",
  acessorios: "🧘",
};

export const catBg: Record<ProductCat, string> = {
  proteinas: "linear-gradient(135deg,#DCEFEA,#C7E4DC)",
  ganho_massa: "linear-gradient(135deg,#EFE6D8,#E4D5BC)",
  energia_pre_treino: "linear-gradient(135deg,#FBE9DD,#F5D4BC)",
  perda_peso: "linear-gradient(135deg,#FBE3E0,#F4C7C2)",
  vitaminas_minerais: "linear-gradient(135deg,#E4E9FB,#CBD4F2)",
  alimentacao_saudavel: "linear-gradient(135deg,#E6F2DE,#CFE6BE)",
  equipamentos: "linear-gradient(135deg,#E9E9EC,#D3D5DA)",
  roupa_fitness: "linear-gradient(135deg,#E5EEF7,#C9DCEF)",
  acessorios: "linear-gradient(135deg,#F1E7F5,#DFC9EA)",
};

export type Stock = "in" | "low" | "out";

export type Product = {
  n: string;
  c: ProductCat;
  r: number;
  p: string;
  s: Stock;
  rec?: boolean;
};

export const products: Product[] = [
  { n: "Whey Protein Isolado 900g", c: "proteinas", r: 4.8, p: "18.500 Kz", s: "in", rec: true },
  { n: "Creatina Monohidratada 300g", c: "ganho_massa", r: 4.7, p: "9.900 Kz", s: "in", rec: true },
  { n: "Pré-treino Ignite 300g", c: "energia_pre_treino", r: 4.6, p: "12.400 Kz", s: "low" },
  { n: "Multivitamínico Diário", c: "vitaminas_minerais", r: 4.9, p: "7.200 Kz", s: "in", rec: true },
  { n: "Barra Proteica (caixa 12un)", c: "alimentacao_saudavel", r: 4.5, p: "6.800 Kz", s: "in" },
  { n: "Bandas de Resistência (kit)", c: "equipamentos", r: 4.8, p: "8.900 Kz", s: "in" },
  { n: "T-shirt Dry-Fit FitPro", c: "roupa_fitness", r: 4.4, p: "5.400 Kz", s: "out" },
  { n: "Shaker FitPro 700ml", c: "acessorios", r: 4.9, p: "3.200 Kz", s: "in" },
  { n: "Queimador L-Carnitina", c: "perda_peso", r: 4.3, p: "11.200 Kz", s: "low" },
];

export const stockLabel: Record<Stock, string> = { in: "Em stock", low: "Últimas unidades", out: "Esgotado" };

export type ShopProductReview = { author: string; rating: number; text: string; date: string };

export type ShopProduct = {
  id: string;
  name: string;
  category: ProductCat;
  storeId: string;
  storeName: string;
  price: number;
  discountPct?: number;
  rating: number;
  reviews: number;
  stock: Stock;
  description: string;
  benefits: string[];
  specs: { label: string; value: string }[];
  images: string[];
  reviewList: ShopProductReview[];
  bestseller?: boolean;
  isNew?: boolean;
};

function kz(n: number) {
  return `${n.toLocaleString("pt-PT")} Kz`;
}

export const shopProducts: ShopProduct[] = [
  {
    id: "sp1", name: "Whey Protein Isolado 900g", category: "proteinas", storeId: "supleforte", storeName: "SupleForte",
    price: 18500, discountPct: 10, rating: 4.8, reviews: 96, stock: "in", bestseller: true,
    description: "Proteína isolada de alta absorção, ideal para recuperação muscular pós-treino e ganho de massa magra.",
    benefits: ["🥤 Absorção rápida", "💪 25g de proteína por dose", "🔥 Baixo teor de açúcar", "✅ Sem glúten"],
    specs: [{ label: "Peso", value: "900g" }, { label: "Sabor", value: "Chocolate" }, { label: "Doses", value: "30" }, { label: "Proteína/dose", value: "25g" }],
    images: [unsplashImages.strength[0], unsplashImages.strength[1], unsplashImages.gym[0]],
    reviewList: [{ author: "Tiago Kiala", rating: 5, text: "Dissolve bem e o sabor é ótimo. Recomendo.", date: "10 Jul" }, { author: "Ricardo Bumba", rating: 4.5, text: "Boa relação qualidade-preço.", date: "2 Jul" }],
  },
  {
    id: "sp2", name: "Creatina Monohidratada 300g", category: "ganho_massa", storeId: "supleforte", storeName: "SupleForte",
    price: 9900, rating: 4.7, reviews: 71, stock: "in", bestseller: true,
    description: "Creatina monohidratada pura, micronizada para melhor absorção — aumenta força e potência muscular.",
    benefits: ["⚡ Mais força e potência", "💪 Aumento de massa magra", "🔬 100% micronizada", "✅ Testada em laboratório"],
    specs: [{ label: "Peso", value: "300g" }, { label: "Doses", value: "60" }, { label: "Pureza", value: "99.9%" }],
    images: [unsplashImages.weightlifting[0], unsplashImages.strength[2]],
    reviewList: [{ author: "Nelson Sami", rating: 5, text: "Sinto diferença na força desde a segunda semana.", date: "5 Jul" }],
  },
  {
    id: "sp3", name: "Pré-treino Ignite 300g", category: "energia_pre_treino", storeId: "nutrimax-luanda", storeName: "NutriMax Luanda",
    price: 12400, discountPct: 15, rating: 4.6, reviews: 38, stock: "low",
    description: "Fórmula energética com cafeína e beta-alanina para máxima performance nos treinos mais intensos.",
    benefits: ["⚡ Energia imediata", "🔥 Maior foco e resistência", "💥 Fórmula com beta-alanina"],
    specs: [{ label: "Peso", value: "300g" }, { label: "Cafeína/dose", value: "200mg" }, { label: "Doses", value: "30" }],
    images: [unsplashImages.crossfit[1], unsplashImages.functional[0]],
    reviewList: [{ author: "André Katumba", rating: 4.5, text: "Dá boa energia sem deixar nervoso.", date: "1 Jul" }],
  },
  {
    id: "sp4", name: "Multivitamínico Diário", category: "vitaminas_minerais", storeId: "nutrimax-luanda", storeName: "NutriMax Luanda",
    price: 7200, rating: 4.9, reviews: 54, stock: "in", isNew: true,
    description: "Complexo vitamínico completo para suportar o sistema imunitário e a recuperação diária do atleta.",
    benefits: ["🧬 13 vitaminas essenciais", "🛡️ Reforça o sistema imunitário", "☀️ Toma única diária"],
    specs: [{ label: "Cápsulas", value: "60" }, { label: "Duração", value: "2 meses" }],
    images: [unsplashImages.nutrition[0], unsplashImages.meals[0]],
    reviewList: [{ author: "Marta Neto", rating: 5, text: "Sinto-me com mais energia no dia a dia.", date: "28 Jun" }],
  },
  {
    id: "sp5", name: "Barra Proteica (caixa 12un)", category: "alimentacao_saudavel", storeId: "nutrimax-luanda", storeName: "NutriMax Luanda",
    price: 6800, rating: 4.5, reviews: 29, stock: "in",
    description: "Barras proteicas práticas para levar para qualquer lugar, ideais como lanche pós-treino.",
    benefits: ["🍫 Sabor chocolate e amendoim", "🥜 15g de proteína por barra", "🎒 Prático para levar contigo"],
    specs: [{ label: "Unidades", value: "12" }, { label: "Proteína/barra", value: "15g" }],
    images: [unsplashImages.meals[1], unsplashImages.meals[2]],
    reviewList: [],
  },
  {
    id: "sp6", name: "Bandas de Resistência (kit)", category: "equipamentos", storeId: "corpo-ativo-shop", storeName: "Corpo Ativo Shop",
    price: 8900, rating: 4.8, reviews: 44, stock: "in", isNew: true,
    description: "Kit com 5 bandas de resistência de diferentes intensidades, ideais para treino funcional e reabilitação.",
    benefits: ["🏋️ 5 níveis de resistência", "🎒 Leve e portátil", "💪 Ideal para treino em casa"],
    specs: [{ label: "Bandas incluídas", value: "5" }, { label: "Material", value: "Látex resistente" }],
    images: [unsplashImages.functional[0], unsplashImages.gym[1]],
    reviewList: [{ author: "Beatriz Chiapa", rating: 5, text: "Excelente qualidade e muito versátil.", date: "20 Jun" }],
  },
  {
    id: "sp7", name: "T-shirt Dry-Fit FitPro", category: "roupa_fitness", storeId: "corpo-ativo-shop", storeName: "Corpo Ativo Shop",
    price: 5400, rating: 4.4, reviews: 22, stock: "out",
    description: "T-shirt técnica de secagem rápida, tecido leve e respirável para treinos de alta intensidade.",
    benefits: ["💨 Secagem rápida", "🌬️ Tecido respirável", "👕 Corte anatómico"],
    specs: [{ label: "Material", value: "Poliéster técnico" }, { label: "Tamanhos", value: "S a XXL" }],
    images: [unsplashImages.crossfit[2], unsplashImages.gym[2]],
    reviewList: [],
  },
  {
    id: "sp8", name: "Shaker FitPro 700ml", category: "acessorios", storeId: "supleforte", storeName: "SupleForte",
    price: 3200, rating: 4.9, reviews: 61, stock: "in", bestseller: true,
    description: "Shaker com misturador em aço inoxidável para uma mistura perfeita, sem grumos.",
    benefits: ["🥤 700ml de capacidade", "⚙️ Misturador em aço inox", "✅ Sem BPA"],
    specs: [{ label: "Capacidade", value: "700ml" }, { label: "Material", value: "Tritan sem BPA" }],
    images: [unsplashImages.nutrition[1]],
    reviewList: [{ author: "Diana Sacramento", rating: 5, text: "Nunca mais tive grumos no shake.", date: "15 Jun" }],
  },
  {
    id: "sp9", name: "Queimador L-Carnitina", category: "perda_peso", storeId: "nutrimax-luanda", storeName: "NutriMax Luanda",
    price: 11200, discountPct: 20, rating: 4.3, reviews: 33, stock: "low",
    description: "Suplemento de L-Carnitina para apoiar o metabolismo de gordura durante o treino cardiovascular.",
    benefits: ["🔥 Apoia queima de gordura", "⚡ Mais energia no cardio", "💧 Fórmula líquida de fácil absorção"],
    specs: [{ label: "Volume", value: "500ml" }, { label: "L-Carnitina/dose", value: "1500mg" }],
    images: [unsplashImages.running[0], unsplashImages.running[2]],
    reviewList: [],
  },
];

export function productDiscountPrice(p: ShopProduct) {
  return p.discountPct ? Math.round(p.price * (1 - p.discountPct / 100)) : p.price;
}

export const shopProductPriceLabel = (p: ShopProduct) => kz(productDiscountPrice(p));
export const shopProductOriginalPriceLabel = (p: ShopProduct) => kz(p.price);

export const shopCategoryLabel: Record<ProductCat, string> = {
  proteinas: "Proteína",
  ganho_massa: "Suplementos",
  energia_pre_treino: "Recuperação",
  perda_peso: "Nutrição",
  vitaminas_minerais: "Nutrição",
  alimentacao_saudavel: "Nutrição",
  equipamentos: "Equipamento",
  roupa_fitness: "Roupa Fitness",
  acessorios: "Acessórios",
};

export type EventType = "run" | "class" | "workshop" | "competition";

export const evtArt: Record<EventType, string> = {
  run: "linear-gradient(155deg,#123B33,#1E7A63)",
  class: "linear-gradient(155deg,#2A2E3A,#4A5AA8)",
  workshop: "linear-gradient(155deg,#3A2A1E,#A8724A)",
  competition: "linear-gradient(155deg,#14171A,#0E7C6B)",
};

export const evtLabel: Record<EventType, string> = {
  run: "Corrida",
  class: "Aula",
  workshop: "Workshop",
  competition: "Competição",
};

export type EventDifficulty = "Fácil" | "Médio" | "Difícil" | "Extremo";

export type EventItem = {
  id: string;
  n: string;
  t: EventType;
  when: string;
  where: string;
  ppl: string;
  w: "week" | "month";
  organizer: string;
  durationMin: number;
  rating: number;
  reviews: number;
  difficulty: EventDifficulty;
  energy: "Baixa" | "Média" | "Alta";
  points: number;
  badge: string;
  description: string;
  food: boolean;
  water: boolean;
  equipment: string;
  parking: boolean;
  going: string[];
  cover: string;
};

export const events: EventItem[] = [
  { id: "hyrox", n: "HYROX Luanda 2026", t: "competition", when: "15 Ago · 07:00", where: "Talatona, Luanda", ppl: "240", w: "month", organizer: "FitPro Community", durationMin: 120, rating: 4.9, reviews: 88, difficulty: "Extremo", energy: "Alta", points: 800, badge: "Guerreiro HYROX", description: "A competição de fitness funcional mais desafiante de Luanda: 8 estações, 8km de corrida.", food: true, water: true, equipment: "Ténis de treino funcional", parking: true, going: ["Nelson Sami", "Ricardo Bumba", "Tiago Kiala", "André Katumba"], cover: bgImage(unsplashImages.crossfit[1]) },
  { id: "ev1", n: "Sunrise Run Club", t: "run", when: "Todos os Sábados · 06:30", where: "Marginal de Luanda", ppl: "58", w: "week", organizer: "FitPro Community", durationMin: 60, rating: 4.8, reviews: 42, difficulty: "Fácil", energy: "Média", points: 120, badge: "Madrugador", description: "Corrida em grupo ao nascer do sol pela marginal de Luanda, ritmo confortável para todos os níveis.", food: false, water: true, equipment: "Ténis de corrida", parking: true, going: ["Tiago Kiala", "Beatriz Chiapa", "Ricardo Bumba"], cover: bgImage(unsplashImages.running[1]) },
  { id: "ev2", n: "Workshop de Mobilidade", t: "workshop", when: "2 Ago · 18:00", where: "Kilamba, Luanda", ppl: "32", w: "month", organizer: "Ana Ferreira", durationMin: 90, rating: 4.7, reviews: 18, difficulty: "Fácil", energy: "Baixa", points: 80, badge: "Flexível", description: "Workshop prático sobre mobilidade articular e prevenção de lesões.", food: false, water: true, equipment: "Tapete de yoga", parking: true, going: ["Marta Neto", "Diana Sacramento"], cover: bgImage(unsplashImages.yoga[1]) },
  { id: "ev3", n: "Aula Aberta de Yoga", t: "class", when: "9 Ago · 08:00", where: "Ingombota, Luanda", ppl: "24", w: "month", organizer: "Diana Sacramento", durationMin: 60, rating: 4.9, reviews: 27, difficulty: "Fácil", energy: "Baixa", points: 80, badge: "Zen", description: "Sessão de yoga ao ar livre aberta a toda a comunidade FitPro.", food: false, water: true, equipment: "Tapete de yoga", parking: false, going: ["Inês Gonçalves"], cover: bgImage(unsplashImages.yoga[2]) },
  { id: "ev4", n: "Desafio 30 Dias de Consistência", t: "competition", when: "1 Set · 00:00", where: "Online", ppl: "410", w: "month", organizer: "FitPro Community", durationMin: 0, rating: 4.9, reviews: 156, difficulty: "Médio", energy: "Alta", points: 500, badge: "Imparável", description: "Desafio de 30 dias consecutivos de treino, com leaderboard e prémios semanais.", food: false, water: false, equipment: "Nenhum", parking: false, going: ["Tiago Kiala", "André Katumba", "Nelson Sami", "Rui Ferreira"], cover: bgImage(unsplashImages.weightlifting[0]) },
  { id: "ev5", n: "Corrida Noturna 10K", t: "run", when: "22 Ago · 20:00", where: "Talatona, Luanda", ppl: "96", w: "month", organizer: "FitPro Community", durationMin: 75, rating: 4.6, reviews: 61, difficulty: "Difícil", energy: "Alta", points: 250, badge: "Corredor Noturno", description: "Corrida de 10km iluminada pela cidade, com hidratação a cada 2,5km.", food: true, water: true, equipment: "Ténis de corrida, colete refletor", parking: true, going: ["Ricardo Bumba", "Beatriz Chiapa"], cover: bgImage(unsplashImages.running[2]) },
  { id: "ev6", n: "Aula de Funcional em Grupo", t: "class", when: "Todas as Terças · 07:00", where: "Viana, Luanda", ppl: "19", w: "week", organizer: "Nelson Sami", durationMin: 45, rating: 4.8, reviews: 33, difficulty: "Médio", energy: "Alta", points: 100, badge: "Funcional", description: "Circuito funcional de alta intensidade em grupo, adaptável a qualquer nível.", food: false, water: true, equipment: "Nenhum", parking: true, going: ["Diana Sacramento", "Marta Neto", "Carla Domingos"], cover: bgImage(unsplashImages.functional[0]) },
];

const WISHLIST_KEY = "fitpro_wishlist";

export function isWishlisted(id: string): boolean {
  try {
    const list: string[] = JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
    return list.includes(id);
  } catch {
    return false;
  }
}

export function toggleWishlist(id: string): boolean {
  try {
    const list: string[] = JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
    const now = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(now));
    return now.includes(id);
  } catch {
    return false;
  }
}

const CART_KEY = "fitpro_cart";

export function cartCount(): number {
  try {
    const list: string[] = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return list.length;
  } catch {
    return 0;
  }
}

export function addToCart(id: string) {
  try {
    const list: string[] = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    localStorage.setItem(CART_KEY, JSON.stringify([...list, id]));
  } catch {}
}

export const initials = (n: string) =>
  n.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

export const trendGlyph = (t: Trend) => (t === "up" ? "▲" : t === "down" ? "▼" : "—");
