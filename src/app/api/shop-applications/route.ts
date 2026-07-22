import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const role = typeof body?.role === "string" ? body.role : "";
  const businessName = typeof body?.businessName === "string" ? body.businessName.trim() : "";
  const description = typeof body?.description === "string" ? body.description.trim() : "";

  if (!name || !email || !businessName) {
    return NextResponse.json({ error: "Nome, email e nome do negócio são obrigatórios." }, { status: 400 });
  }

  try {
    const pool = getPool();
    await pool.query(
      `INSERT INTO shop_applications (applicant_name, applicant_email, applicant_role, business_name, description)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, role, businessName, description]
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erro a submeter a candidatura." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT id, applicant_name, applicant_email, applicant_role, business_name, description, status, created_at FROM shop_applications ORDER BY created_at DESC"
    );
    return NextResponse.json({ applications: rows });
  } catch {
    return NextResponse.json({ error: "Erro a carregar candidaturas." }, { status: 500 });
  }
}
