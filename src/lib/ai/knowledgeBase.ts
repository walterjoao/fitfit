export type KnowledgeEntry = {
  topic: string;
  keywords: string[];
  roles: ("athlete" | "trainer" | "nutritionist" | "gym" | "all")[];
  answer: string;
};

export const knowledgeBase: KnowledgeEntry[] = [
  {
    topic: "criar_treino",
    keywords: ["criar treino", "novo treino", "workout", "programa de treino"],
    roles: ["trainer", "all"],
    answer: "Para criar um treino: abre Criar (no cabeçalho) → Criar treino, escolhe o cliente e adiciona os exercícios. Também podes fazê-lo a partir de Membros → seleciona o cliente → Novo treino.",
  },
  {
    topic: "adicionar_cliente",
    keywords: ["adicionar cliente", "novo cliente", "novo membro"],
    roles: ["trainer", "nutritionist", "gym", "all"],
    answer: "Abre Criar → Adicionar cliente, ou vai a Membros → Adicionar. Preenche o nome, contacto e objetivo do cliente.",
  },
  {
    topic: "plano_alimentar",
    keywords: ["plano alimentar", "meal plan", "nutrição", "dieta"],
    roles: ["nutritionist", "all"],
    answer: "Para criar um plano alimentar: Criar → Criar plano alimentar, seleciona o cliente e define as refeições e macros.",
  },
  {
    topic: "progresso",
    keywords: ["progresso", "evolução", "resultados", "estatísticas"],
    roles: ["athlete", "all"],
    answer: "O teu progresso está no Dashboard, no gráfico de evolução e nos cartões de estatísticas. Consegues comparar com o mês anterior no topo da página.",
  },
  {
    topic: "eventos",
    keywords: ["evento", "corrida", "aula", "competição"],
    roles: ["all"],
    answer: "A secção Eventos mostra corridas, aulas e desafios da comunidade — podes filtrar por tipo e data, e clicar em Participar para te inscreveres.",
  },
  {
    topic: "loja",
    keywords: ["loja", "produto", "comprar", "suplemento"],
    roles: ["all"],
    answer: "Na Loja encontras suplementos e equipamento, com recomendações personalizadas baseadas no teu objetivo, no topo da página.",
  },
  {
    topic: "membros",
    keywords: ["membros", "clientes", "atletas"],
    roles: ["trainer", "nutritionist", "gym", "all"],
    answer: "Membros lista todos os teus clientes ativos, com o progresso e estado de cada um (Em dia, Em risco, Pausado).",
  },
  {
    topic: "receita",
    keywords: ["receita", "faturação", "pagamentos", "revenue"],
    roles: ["trainer", "gym", "all"],
    answer: "A receita mensal e a sua evolução aparecem no Dashboard, no cartão Receita e no gráfico de crescimento.",
  },
];

const STOPWORDS = new Set([
  "como", "o", "a", "os", "as", "um", "uma", "de", "do", "da", "em", "no", "na",
  "para", "e", "é", "crio", "criar", "faço", "fazer", "adiciono", "adicionar",
  "posso", "quero", "ver", "meu", "minha", "?",
]);

function significantWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[?.,!]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

export function searchKnowledgeBase(query: string, role: string): KnowledgeEntry[] {
  const q = query.toLowerCase();
  const qWords = new Set(significantWords(query));

  return knowledgeBase.filter((e) => {
    if (!(e.roles.includes("all") || e.roles.includes(role as never))) return false;
    return e.keywords.some((k) => {
      if (q.includes(k)) return true;
      const kWords = significantWords(k);
      return kWords.length > 0 && kWords.every((w) => qWords.has(w) || [...qWords].some((qw) => qw.startsWith(w.slice(0, 5))));
    });
  });
}
