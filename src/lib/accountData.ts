export type RoleKey = "athlete" | "trainer" | "nutritionist" | "gym" | "shop" | "admin";

export const roleBasePath: Record<RoleKey, string> = {
  athlete: "/dashboard/athlete",
  trainer: "/dashboard",
  nutritionist: "/dashboard/nutritionist",
  gym: "/dashboard/gym",
  shop: "/dashboard/shop",
  admin: "/dashboard/admin",
};

export function settingsPath(role: string) {
  const base = roleBasePath[role as RoleKey] || "/dashboard";
  return `${base}/settings`;
}
export function billingPath(role: string) {
  const base = roleBasePath[role as RoleKey] || "/dashboard";
  return `${base}/billing`;
}
export function financePath(role: string) {
  const base = roleBasePath[role as RoleKey] || "/dashboard";
  return `${base}/finance`;
}

export type SettingsSection = { title: string; description: string };

export const settingsSections: Record<RoleKey, SettingsSection[]> = {
  athlete: [
    { title: "Perfil", description: "Foto, nome e informação pública." },
    { title: "Informação Pessoal", description: "Idade, altura, contacto e localização." },
    { title: "Objetivos de Fitness", description: "O teu objetivo atual e nível de experiência." },
    { title: "Medidas", description: "Peso, medidas corporais e histórico." },
    { title: "Preferências", description: "Idioma, unidades e tema." },
    { title: "Notificações", description: "Como e quando és notificado." },
    { title: "Privacidade", description: "Quem pode ver o teu perfil e progresso." },
    { title: "Contas Ligadas", description: "Google, Apple Health e outras integrações." },
  ],
  trainer: [
    { title: "Perfil", description: "Foto, nome e biografia profissional." },
    { title: "Certificações", description: "Certificados e qualificações profissionais." },
    { title: "Serviços", description: "Os tipos de treino e planos que ofereces." },
    { title: "Disponibilidade", description: "Horários em que aceitas sessões." },
    { title: "Preços", description: "Valores dos teus serviços." },
    { title: "Notificações", description: "Como e quando és notificado." },
  ],
  nutritionist: [
    { title: "Perfil", description: "Foto, nome e biografia profissional." },
    { title: "Certificações", description: "Certificados e ordem profissional." },
    { title: "Serviços", description: "Planos alimentares e consultas que ofereces." },
    { title: "Disponibilidade", description: "Horários para consultas." },
    { title: "Preços", description: "Valores das tuas consultas e planos." },
  ],
  gym: [
    { title: "Perfil do Negócio", description: "Nome, logótipo e descrição do ginásio." },
    { title: "Localização", description: "Morada e horário de funcionamento." },
    { title: "Equipa", description: "Treinadores e funcionários." },
    { title: "Planos de Subscrição", description: "Os planos que o ginásio oferece." },
    { title: "Pagamentos", description: "Métodos de pagamento aceites." },
    { title: "Notificações", description: "Como e quando és notificado." },
  ],
  shop: [
    { title: "Perfil da Loja", description: "Nome, logótipo e categoria da loja." },
    { title: "Produtos", description: "Definições gerais do catálogo." },
    { title: "Envio", description: "Zonas e métodos de entrega." },
    { title: "Pagamentos", description: "Métodos de pagamento aceites." },
    { title: "Notificações", description: "Como e quando és notificado." },
  ],
  admin: [
    { title: "Perfil", description: "Informação da conta de administrador." },
    { title: "Equipa", description: "Outros administradores da plataforma." },
    { title: "Segurança", description: "Autenticação e permissões." },
    { title: "Notificações", description: "Como e quando és notificado." },
  ],
};

export type Plan = { id: string; name: string; price: string; features: string[]; highlighted?: boolean };

export const plansByRole: Record<RoleKey, Plan[]> = {
  athlete: [
    { id: "free", name: "Free", price: "0 Kz / mês", features: ["Treinos pessoais", "Leaderboard", "Loja"] },
    { id: "premium", name: "Premium Athlete", price: "2.500 Kz / mês", features: ["Tudo do Free", "IA avançada", "Sem anúncios", "Prioridade em marcações"], highlighted: true },
  ],
  trainer: [
    { id: "starter", name: "Starter", price: "0 Kz / mês", features: ["Até 10 clientes", "Programas ilimitados"] },
    { id: "professional", name: "Professional", price: "9.900 Kz / mês", features: ["Até 60 clientes", "Analítica avançada", "Marketplace"], highlighted: true },
    { id: "business", name: "Business", price: "24.900 Kz / mês", features: ["Clientes ilimitados", "Marca própria", "Suporte prioritário"] },
  ],
  nutritionist: [
    { id: "professional", name: "Professional", price: "9.900 Kz / mês", features: ["Clientes ilimitados", "Planos alimentares ilimitados", "Analítica"], highlighted: true },
  ],
  gym: [
    { id: "business", name: "Business", price: "49.900 Kz / mês", features: ["Até 500 membros", "Até 10 treinadores", "Analítica de negócio"], highlighted: true },
    { id: "enterprise", name: "Enterprise", price: "Personalizado", features: ["Membros ilimitados", "Múltiplas localizações", "Gestor de conta dedicado"] },
  ],
  shop: [
    { id: "starter", name: "Starter", price: "0 Kz / mês", features: ["Até 20 produtos", "Comissão 8%"] },
    { id: "growth", name: "Growth", price: "6.900 Kz / mês", features: ["Produtos ilimitados", "Comissão 4%", "Destaque na Loja"], highlighted: true },
  ],
  admin: [{ id: "internal", name: "Interno", price: "—", features: ["Acesso total à plataforma"] }],
};

export type FinanceKpi = { label: string; value: string; delta: string };
export type FinanceTx = { label: string; sub: string; amount: string; dir: "in" | "out" };

export const financeByRole: Record<RoleKey, { kpis: FinanceKpi[]; transactions: FinanceTx[] }> = {
  athlete: {
    kpis: [
      { label: "Gasto este mês", value: "18.400 Kz", delta: "+12% vs. mês passado" },
      { label: "Sessões de PT compradas", value: "4", delta: "este mês" },
      { label: "Consultas de nutrição", value: "1", delta: "este mês" },
      { label: "Compras na Loja", value: "6.800 Kz", delta: "2 encomendas" },
    ],
    transactions: [
      { label: "Sessão com Ana Ferreira", sub: "Personal Trainer", amount: "-8.500 Kz", dir: "out" },
      { label: "Whey Protein Isolado 900g", sub: "Loja", amount: "-18.500 Kz", dir: "out" },
      { label: "Consulta com Inês Gonçalves", sub: "Nutricionista", amount: "-6.500 Kz", dir: "out" },
      { label: "Mensalidade FitPro Talatona", sub: "Ginásio", amount: "-12.000 Kz", dir: "out" },
    ],
  },
  trainer: {
    kpis: [
      { label: "Receita este mês", value: "1.240.500 Kz", delta: "+12,4%" },
      { label: "Sessões vendidas", value: "37", delta: "+4 este mês" },
      { label: "Ganhos no Marketplace", value: "84.000 Kz", delta: "+6%" },
      { label: "Levantamentos pendentes", value: "220.000 Kz", delta: "disponível" },
    ],
    transactions: [
      { label: "Carla Domingos", sub: "Pacote de 8 sessões", amount: "+68.000 Kz", dir: "in" },
      { label: "Rui Ferreira", sub: "Sessão avulsa", amount: "+8.500 Kz", dir: "in" },
      { label: "Levantamento", sub: "Conta bancária ·· 4821", amount: "-150.000 Kz", dir: "out" },
    ],
  },
  nutritionist: {
    kpis: [
      { label: "Receita de consultas", value: "420.000 Kz", delta: "+8%" },
      { label: "Vendas de planos", value: "180.000 Kz", delta: "+15%" },
      { label: "Ganhos no Marketplace", value: "32.000 Kz", delta: "+3%" },
      { label: "Levantamentos pendentes", value: "96.000 Kz", delta: "disponível" },
    ],
    transactions: [
      { label: "Marta Neto", sub: "Consulta de acompanhamento", amount: "+6.500 Kz", dir: "in" },
      { label: "Plano Alimentar Premium", sub: "Tiago Kiala", amount: "+9.000 Kz", dir: "in" },
      { label: "Levantamento", sub: "Conta bancária ·· 4821", amount: "-80.000 Kz", dir: "out" },
    ],
  },
  gym: {
    kpis: [
      { label: "Receita de subscrições", value: "8.420.000 Kz", delta: "+9,6%" },
      { label: "Pagamentos a treinadores", value: "-2.100.000 Kz", delta: "18 treinadores" },
      { label: "Receita de aulas", value: "640.000 Kz", delta: "+4%" },
      { label: "Receita líquida", value: "6.960.000 Kz", delta: "+7,2%" },
    ],
    transactions: [
      { label: "Subscrições Premium", sub: "412 membros", amount: "+4.120.000 Kz", dir: "in" },
      { label: "Pagamento a treinadores", sub: "Julho 2026", amount: "-2.100.000 Kz", dir: "out" },
      { label: "Manutenção de equipamento", sub: "Despesa operacional", amount: "-340.000 Kz", dir: "out" },
    ],
  },
  shop: {
    kpis: [
      { label: "Receita mensal", value: "620.400 Kz", delta: "+8,1%" },
      { label: "Encomendas", value: "142", delta: "+14 este mês" },
      { label: "Comissão FitPro", value: "-24.800 Kz", delta: "4% das vendas" },
      { label: "Receita líquida", value: "595.600 Kz", delta: "+7,6%" },
    ],
    transactions: [
      { label: "Encomenda #1042", sub: "Whey Protein Isolado 900g ×3", amount: "+55.500 Kz", dir: "in" },
      { label: "Comissão FitPro", sub: "Julho 2026", amount: "-24.800 Kz", dir: "out" },
      { label: "Levantamento", sub: "Conta bancária ·· 4821", amount: "-300.000 Kz", dir: "out" },
    ],
  },
  admin: {
    kpis: [
      { label: "Receita total da plataforma", value: "12.480.000 Kz", delta: "+11%" },
      { label: "Comissões cobradas", value: "890.000 Kz", delta: "+9%" },
      { label: "Utilizadores pagantes", value: "612", delta: "+34 este mês" },
      { label: "Custos operacionais", value: "-1.240.000 Kz", delta: "este mês" },
    ],
    transactions: [
      { label: "Comissões de Lojas", sub: "Julho 2026", amount: "+240.000 Kz", dir: "in" },
      { label: "Subscrições SaaS (Trainers/Gyms)", sub: "Julho 2026", amount: "+650.000 Kz", dir: "in" },
      { label: "Infraestrutura (Render, DB)", sub: "Despesa operacional", amount: "-38.000 Kz", dir: "out" },
    ],
  },
};
