import { unsplashImages } from "./images";

export type NutriService = { id: string; name: string; icon: string; description: string; durationMin: number; price: string; mode: "Online" | "Presencial" };
export type NutriPlan = { id: string; name: string; description: string; duration: string; price: string; image: string };
export type Recipe = { id: string; name: string; image: string; calories: number; protein: number; benefit: string };
export type ResultStory = { id: string; client: string; text: string; before: string; after: string };
export type Post = { id: string; title: string; excerpt: string; date: string };

export type NutritionistBusiness = {
  id: string;
  philosophy: string;
  approach: string;
  languages: string[];
  education: string[];
  licenseNumber: string;
  clients: number;
  consultations: number;
  services: NutriService[];
  plans: NutriPlan[];
  recipes: Recipe[];
  results: ResultStory[];
  posts: Post[];
  phone: string;
  email: string;
};

export const nutritionistBusiness: Record<string, NutritionistBusiness> = {
  n1: {
    id: "n1",
    philosophy: "Ajudo atletas a melhorar a performance através de planos nutricionais personalizados, baseados em ciência e adaptados à rotina real de cada pessoa.",
    approach: "Avaliação inicial completa, plano à medida do objetivo, acompanhamento semanal com ajustes contínuos e educação alimentar a longo prazo.",
    languages: ["Português", "Inglês"],
    education: ["Licenciatura em Nutrição — Universidade Agostinho Neto", "Pós-graduação em Nutrição Desportiva"],
    licenseNumber: "NUT-AO-4521",
    clients: 120,
    consultations: 500,
    services: [
      { id: "s1", name: "Consulta Inicial de Nutrição", icon: "🥗", description: "Avaliação completa do estado nutricional, hábitos e objetivos.", durationMin: 60, price: "6.500 Kz", mode: "Presencial" },
      { id: "s2", name: "Plano de Performance para Atletas", icon: "🏋️", description: "Plano alimentar de 30 dias focado em rendimento desportivo.", durationMin: 30, price: "18.000 Kz", mode: "Online" },
      { id: "s3", name: "Consulta de Seguimento", icon: "📊", description: "Revisão de progresso e ajustes ao plano nutricional.", durationMin: 30, price: "4.000 Kz", mode: "Online" },
    ],
    plans: [
      { id: "p1", name: "Plano Ganho de Massa Magra", description: "Estratégia alimentar para aumentar massa muscular com qualidade.", duration: "30 dias", price: "15.000 Kz", image: unsplashImages.meals[0] },
      { id: "p2", name: "Plano Performance para Atletas", description: "Nutrição periodizada para épocas de treino intenso e competição.", duration: "30 dias", price: "18.000 Kz", image: unsplashImages.meals[1] },
      { id: "p3", name: "Plano Alimentar Personalizado", description: "Plano 100% adaptado aos teus objetivos e preferências alimentares.", duration: "Contínuo", price: "6.500 Kz / mês", image: unsplashImages.meals[2] },
    ],
    recipes: [
      { id: "r1", name: "Bowl de Frango e Quinoa", image: unsplashImages.meals[0], calories: 480, protein: 42, benefit: "Alto teor proteico para recuperação muscular." },
      { id: "r2", name: "Omelete de Claras com Espinafres", image: unsplashImages.meals[1], calories: 260, protein: 30, benefit: "Ótimo pequeno-almoço rico em proteína magra." },
      { id: "r3", name: "Salada de Atum e Grão", image: unsplashImages.meals[2], calories: 390, protein: 34, benefit: "Boa fonte de fibra e ómega-3." },
    ],
    results: [
      { id: "res1", client: "Tiago Kiala", text: "Em 3 meses melhorei a composição corporal e a energia nos treinos.", before: unsplashImages.strength[0], after: unsplashImages.strength[1] },
      { id: "res2", client: "Beatriz Chiapa", text: "Plano fácil de seguir e resultados visíveis em poucas semanas.", before: unsplashImages.running[0], after: unsplashImages.running[1] },
    ],
    posts: [
      { id: "post1", title: "5 alimentos para aumentar a ingestão de proteína", excerpt: "Descobre fontes de proteína acessíveis para incluir na tua dieta diária.", date: "10 Jul" },
      { id: "post2", title: "Hidratação e performance desportiva", excerpt: "Porque é que a hidratação correta faz toda a diferença no treino.", date: "2 Jul" },
    ],
    phone: "+244 923 000 111",
    email: "ines.goncalves@fitpro.com",
  },
  n2: {
    id: "n2",
    philosophy: "Acompanho pessoas numa jornada sustentável de perda de peso, sem dietas restritivas nem sofrimento.",
    approach: "Plano gradual com reeducação alimentar, check-ins semanais e foco em hábitos duradouros.",
    languages: ["Português"],
    education: ["Licenciatura em Nutrição Clínica"],
    licenseNumber: "NUT-AO-3390",
    clients: 74,
    consultations: 260,
    services: [
      { id: "s1", name: "Consulta Inicial", icon: "🥗", description: "Avaliação de hábitos alimentares e definição de objetivos.", durationMin: 40, price: "5.500 Kz", mode: "Online" },
      { id: "s2", name: "Plano de Perda de Peso", icon: "⚖️", description: "Plano alimentar de 30 dias para perda de peso sustentável.", durationMin: 30, price: "14.000 Kz", mode: "Online" },
    ],
    plans: [
      { id: "p1", name: "Plano Perda de Peso", description: "Estratégia alimentar equilibrada para perda de peso gradual.", duration: "30 dias", price: "14.000 Kz", image: unsplashImages.meals[3] },
      { id: "p2", name: "Plano de Reeducação Alimentar", description: "Foco em hábitos alimentares saudáveis a longo prazo.", duration: "Contínuo", price: "5.500 Kz / mês", image: unsplashImages.meals[0] },
    ],
    recipes: [
      { id: "r1", name: "Sopa de Legumes com Frango", image: unsplashImages.meals[3], calories: 220, protein: 20, benefit: "Baixa caloria, alta saciedade." },
      { id: "r2", name: "Iogurte com Fruta e Aveia", image: unsplashImages.meals[0], calories: 240, protein: 12, benefit: "Ótima opção de lanche equilibrado." },
    ],
    results: [
      { id: "res1", client: "Marta Neto", text: "Perdi peso sem passar fome, com um plano muito realista.", before: unsplashImages.yoga[0], after: unsplashImages.yoga[1] },
    ],
    posts: [
      { id: "post1", title: "Porque as dietas restritivas não funcionam", excerpt: "Entende porque a reeducação alimentar tem melhores resultados a longo prazo.", date: "5 Jul" },
    ],
    phone: "+244 923 000 222",
    email: "diana.sacramento@fitpro.com",
  },
};
