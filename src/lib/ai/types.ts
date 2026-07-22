export type Role = "athlete" | "trainer" | "nutritionist" | "gym" | "shop";

export type ChatMessage = { role: "user" | "assistant"; content: string };

export type AIContext = {
  userRole: Role;
  userName: string;
};

export type AIProvider = {
  id: string;
  models: string[];
  available: boolean;
  reply(messages: ChatMessage[], context: AIContext): Promise<string>;
};
