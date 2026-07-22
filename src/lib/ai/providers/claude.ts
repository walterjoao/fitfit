import type { AIProvider, ChatMessage, AIContext } from "../types";

const apiKey = process.env.ANTHROPIC_API_KEY;

export const claudeProvider: AIProvider = {
  id: "claude",
  models: ["claude-sonnet", "claude-opus"],
  available: !!apiKey,
  async reply(messages: ChatMessage[], context: AIContext) {
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured");

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5",
        max_tokens: 500,
        system: `És o assistente FitPro para um ${context.userRole} chamado ${context.userName}. Responde em português, curto e prático.`,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    if (!res.ok) throw new Error(`Claude error: ${res.status}`);
    const data = await res.json();
    return data.content?.[0]?.text ?? "";
  },
};
