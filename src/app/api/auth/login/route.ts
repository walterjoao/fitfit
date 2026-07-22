import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getPool } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ error: "Email e palavra-passe são obrigatórios." }, { status: 400 });
  }

  try {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT id, name, email, password_hash, role FROM users WHERE email = ? LIMIT 1",
      [email]
    );
    const user = (rows as any[])[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return NextResponse.json({ error: "Credenciais inválidas." }, { status: 401 });
    }

    return NextResponse.json({ name: user.name, email: user.email, role: user.role });
  } catch {
    return NextResponse.json({ error: "Erro a contactar a base de dados." }, { status: 500 });
  }
}
