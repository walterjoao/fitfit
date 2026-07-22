"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import type { Role } from "@/components/Sidebar";

const roleOptions: { value: Role; label: string }[] = [
  { value: "athlete", label: "Atleta" },
  { value: "trainer", label: "Personal Trainer" },
  { value: "nutritionist", label: "Nutricionista" },
  { value: "gym", label: "Ginásio" },
];

export default function ApplyShopPage() {
  const [role, setRole] = useState<Role>("athlete");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function submit() {
    setStatus("loading");
    try {
      const res = await fetch("/api/shop-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role, businessName, description }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <Sidebar role={role} active="apply-shop" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Candidatar-me a Lojista</h1>
          <p>Qualquer conta FitPro pode candidatar-se a vender na Loja, além do seu perfil atual.</p>
        </div>

        <div className="dash-panel" style={{ maxWidth: 460, padding: 24 }}>
          {status === "done" ? (
            <div>
              <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>Candidatura enviada.</p>
              <p style={{ fontSize: 12.5, color: "var(--text-dim)" }}>
                A nossa equipa vai rever o teu pedido. Assim que for aprovado, terás acesso ao Dashboard de Loja com a tua conta atual.
              </p>
            </div>
          ) : (
            <div className="auth-body">
              <label className="field">
                <span className="field-label">A tua conta atual é</span>
                <select className="field-input" value={role} onChange={(e) => setRole(e.target.value as Role)}>
                  {roleOptions.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span className="field-label">Nome</span>
                <input className="field-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="O teu nome" />
              </label>
              <label className="field">
                <span className="field-label">Email da conta</span>
                <input className="field-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" />
              </label>
              <label className="field">
                <span className="field-label">Nome do negócio</span>
                <input className="field-input" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Ex: SupleForte" />
              </label>
              <label className="field">
                <span className="field-label">Descrição</span>
                <input className="field-input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="O que vais vender na Loja?" />
              </label>
              {status === "error" && <p style={{ color: "var(--bad)", fontSize: 12.5, margin: 0 }}>Não foi possível enviar. Tenta novamente.</p>}
              <button className="auth-submit" onClick={submit} disabled={status === "loading" || !name || !email || !businessName}>
                {status === "loading" ? "A enviar…" : "Enviar candidatura"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
