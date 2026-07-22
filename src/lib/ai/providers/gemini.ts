import type { AIProvider, ChatMessage, AIContext } from "../types";

const apiKey = process.env.GEMINI_API_KEY;

export const geminiProvider: AIProvider = {
  id: "gemini",
  models: ["gemini-pro", "gemini-flash"],
  available: !!apiKey,
  async reply(messages: ChatMessage[], context: AIContext) {
    if (!apiKey) throw new Error("GEMINI_API_KEY not configured");

    const model = process.env.GEMINI_MODEL || "gemini-flash";
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: messages.map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }],
          })),
          systemInstruction: {
            parts: [{ text: `És o assistente FitPro para um ${context.userRole} chamado ${context.userName}. Responde em português.` }],
          },
        }),
      }
    );

    if (!res.ok) throw new Error(`Gemini error: ${res.status}`);
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  },
};
