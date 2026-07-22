import type { AIProvider, AIContext, ChatMessage } from "../types";
import { searchKnowledgeBase } from "../knowledgeBase";

const roleLabel: Record<AIContext["userRole"], string> = {
  athlete: "atleta",
  trainer: "personal trainer",
  nutritionist: "nutricionista",
  gym: "ginásio",
  shop: "lojista",
};

export const mockProvider: AIProvider = {
  id: "mock",
  models: ["fitpro-assistant-local"],
  available: true,
  async reply(messages: ChatMessage[], context: AIContext) {
    const last = messages[messages.length - 1]?.content ?? "";
    const hits = searchKnowledgeBase(last, context.userRole);

    if (hits.length > 0) {
      return hits[0].answer;
    }

    if (/^(ol[aá]|oi|hey|hello)/i.test(last.trim())) {
      return `Olá ${context.userName}! Sou o assistente FitPro. Como ${roleLabel[context.userRole]}, posso ajudar-te a navegar na plataforma, explicar funcionalidades ou dar recomendações. O que precisas?`;
    }

    return "Ainda não tenho uma resposta configurada para isso — mas posso ajudar-te com: criar treinos, adicionar clientes, planos alimentares, progresso, eventos, loja, membros e receita. Podes reformular a pergunta?";
  },
};
