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

export type EventItem = {
  n: string;
  t: EventType;
  when: string;
  where: string;
  ppl: string;
  w: "week" | "month";
};

export const events: EventItem[] = [
  { n: "Sunrise Run Club", t: "run", when: "Todos os Sábados · 06:30", where: "Marginal de Luanda", ppl: "58", w: "week" },
  { n: "Workshop de Mobilidade", t: "workshop", when: "2 Ago · 18:00", where: "Kilamba, Luanda", ppl: "32", w: "month" },
  { n: "Aula Aberta de Yoga", t: "class", when: "9 Ago · 08:00", where: "Ingombota, Luanda", ppl: "24", w: "month" },
  { n: "Desafio 30 Dias de Consistência", t: "competition", when: "1 Set · 00:00", where: "Online", ppl: "410", w: "month" },
  { n: "Corrida Noturna 10K", t: "run", when: "22 Ago · 20:00", where: "Talatona, Luanda", ppl: "96", w: "month" },
  { n: "Aula de Funcional em Grupo", t: "class", when: "Todas as Terças · 07:00", where: "Viana, Luanda", ppl: "19", w: "week" },
];

export const initials = (n: string) =>
  n.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

export const trendGlyph = (t: Trend) => (t === "up" ? "▲" : t === "down" ? "▼" : "—");
