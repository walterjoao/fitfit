"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import type { Role } from "@/components/Sidebar";
import { useRoleGuard } from "@/lib/session";
import { plansByRole, type RoleKey } from "@/lib/accountData";

function planKey(role: RoleKey) {
  return `fitpro_billing_plan_${role}`;
}

export default function RoleBilling({ role, sidebarActive }: { role: RoleKey; sidebarActive: string }) {
  const { ready } = useRoleGuard(role);
  const plans = plansByRole[role];
  const [currentId, setCurrentId] = useState(() => {
    try {
      return localStorage.getItem(planKey(role)) || plans[0].id;
    } catch {
      return plans[0].id;
    }
  });
  const [switched, setSwitched] = useState(false);

  if (!ready) return null;

  const current = plans.find((p) => p.id === currentId) || plans[0];

  function switchPlan(id: string) {
    setCurrentId(id);
    try {
      localStorage.setItem(planKey(role), id);
    } catch {}
    setSwitched(true);
    setTimeout(() => setSwitched(false), 2000);
  }

  return (
    <>
      <Sidebar role={role as Role} active={sidebarActive} />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Faturação</h1>
          <p>Gere a tua subscrição, plano e histórico de pagamentos.</p>
        </div>

        <div className="dash-panel" style={{ padding: 20, marginBottom: 24, maxWidth: 520 }}>
          <p style={{ fontSize: 12, color: "var(--text-faint)", fontWeight: 600, marginBottom: 4 }}>PLANO ATUAL</p>
          <p style={{ fontSize: 18, fontWeight: 700 }}>{current.name}</p>
          <p style={{ fontSize: 12.5, color: "var(--text-dim)", marginTop: 4 }}>Estado: <span style={{ color: "var(--good)", fontWeight: 700 }}>Ativo</span> · Renova a 1 Ago 2026</p>
          {switched && <p style={{ fontSize: 12, color: "var(--good)", marginTop: 6 }}>✓ Plano alterado com sucesso.</p>}
        </div>

        <div className="section-head">
          <h2>Planos Disponíveis</h2>
          <span>{plans.length} planos</span>
        </div>
        <div className="plan-grid">
          {plans.map((p) => (
            <div key={p.id} className={`plan-card ${p.id === current.id ? "current" : ""} ${p.highlighted ? "highlighted" : ""}`}>
              {p.highlighted && <span className="plan-badge">Popular</span>}
              <div className="plan-name">{p.name}</div>
              <div className="plan-price">{p.price}</div>
              <ul className="plan-features">
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <button className={`btn ${p.id === current.id ? "btn-ghost" : "btn-primary"} btn-sm`} disabled={p.id === current.id} onClick={() => switchPlan(p.id)}>
                {p.id === current.id ? "Plano Atual" : "Mudar para este plano"}
              </button>
            </div>
          ))}
        </div>

        <div className="dash-panel">
          <div className="dash-panel-head">
            <h2>Histórico de Pagamentos</h2>
            <span>últimos 3 meses</span>
          </div>
          <div className="dash-panel-body">
            <div className="tx-row">
              <div className="tx-info"><div className="tx-label">Subscrição — Julho 2026</div><div className="tx-sub">Cartão ·· 4821</div></div>
              <span className="tx-amount out">{current.price}</span>
            </div>
            <div className="tx-row">
              <div className="tx-info"><div className="tx-label">Subscrição — Junho 2026</div><div className="tx-sub">Cartão ·· 4821</div></div>
              <span className="tx-amount out">{current.price}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
