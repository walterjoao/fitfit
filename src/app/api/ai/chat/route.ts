import { NextResponse } from "next/server";
import { askAI } from "@/lib/ai/manager";
import type { ChatMessage, Role } from "@/lib/ai/types";

const validRoles: Role[] = ["athlete", "trainer", "nutritionist", "gym", "shop"];

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body || !Array.isArray(body.messages)) {
    return NextResponse.json({ error: "messages array required" }, { status: 400 });
  }

  const messages: ChatMessage[] = body.messages.slice(-10);
  const role: Role = validRoles.includes(body.role) ? body.role : "athlete";
  const userName: string = typeof body.userName === "string" ? body.userName : "utilizador";

  const result = await askAI(messages, { userRole: role, userName });
  return NextResponse.json(result);
}
