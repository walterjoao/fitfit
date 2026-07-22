import type { AIProvider, ChatMessage, AIContext } from "../types";

const apiKey = process.env.OPENAI_API_KEY;

export const openaiProvider: AIProvider = {
  id: "openai",
  models: ["gpt-4.1", "gpt-4o", "gpt-5"],
  available: !!apiKey,
  async reply(messages: ChatMessage[], context: AIContext) {
    if (!apiKey) throw new Error("OPENAI_API_KEY not configured");

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o",
        messages: [
          {
            role: "system",
            content: `És o assistente FitPro para um utilizador ${context.userRole} chamado ${context.userName}. Responde em português, de forma curta e prática, apenas sobre a plataforma FitPro.`,
          },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
        ],
      }),
    });

    if (!res.ok) throw new Error(`OpenAI error: ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "";
  },
};
