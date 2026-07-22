import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const id = Number(body?.id);
  if (!id) {
    return NextResponse.json({ error: "id é obrigatório." }, { status: 400 });
  }

  try {
    const pool = getPool();
    const [rows] = await pool.query("SELECT applicant_email FROM shop_applications WHERE id = ? LIMIT 1", [id]);
    const app = (rows as any[])[0];
    if (!app) {
      return NextResponse.json({ error: "Candidatura não encontrada." }, { status: 404 });
    }

    await pool.query("UPDATE shop_applications SET status = 'approved' WHERE id = ?", [id]);
    await pool.query("UPDATE users SET is_shop_owner = TRUE WHERE email = ?", [app.applicant_email]);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erro a aprovar a candidatura." }, { status: 500 });
  }
}
