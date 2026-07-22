import type { AIContext, ChatMessage } from "./types";
import { mockProvider } from "./providers/mock";
import { openaiProvider } from "./providers/openai";
import { geminiProvider } from "./providers/gemini";
import { claudeProvider } from "./providers/claude";

const providers = [openaiProvider, geminiProvider, claudeProvider, mockProvider];

function pickProvider() {
  const preferred = process.env.AI_PROVIDER;
  if (preferred) {
    const found = providers.find((p) => p.id === preferred && p.available);
    if (found) return found;
  }
  return providers.find((p) => p.available) ?? mockProvider;
}

export async function askAI(messages: ChatMessage[], context: AIContext) {
  const provider = pickProvider();
  try {
    const content = await provider.reply(messages, context);
    return { content, provider: provider.id };
  } catch {
    if (provider.id !== "mock") {
      const content = await mockProvider.reply(messages, context);
      return { content, provider: "mock" };
    }
    throw new Error("AI provider unavailable");
  }
}
