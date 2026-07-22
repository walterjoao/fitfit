"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useRoleGuard } from "@/lib/session";

const kpis = [
  { label: "Membros", value: "1.240", delta: "+34 este mês", icon: <><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M17 8h4M19 6v4" /></> },
  { label: "Treinadores", value: "18", delta: "+2 este mês", icon: <><path d="M6.5 6.5 3 10l3.5 3.5M17.5 6.5 21 10l-3.5 3.5M14 4l-4 16" /></> },
  { label: "Receita mensal", value: "8.420.000 Kz", delta: "+9,6%", icon: <path d="M12 3v3M12 18v3M6 8a3 3 0 0 1 3-3h4a3 3 0 1 1 0 6H9a3 3 0 1 0 0 6h6a3 3 0 0 0 3-3" /> },
  { label: "Taxa de ocupação", value: "76%", delta: "+3 pts este mês", icon: <path d="M3 17l6-6 4 4 8-8M21 7v6h-6" /> },
];

const staff = [
  { name: "Ana Ferreira", role: "Personal Trainer · 84 clientes", status: "on" as const },
  { name: "Rui Ferreira", role: "Personal Trainer · 52 clientes", status: "on" as const },
  { name: "Inês Gonçalves", role: "Nutricionista · 46 clientes", status: "on" as const },
  { name: "Nelson Sami", role: "Personal Trainer · 12 clientes", status: "risk" as const },
];

const subscriptions = [
  { label: "Plano Premium", value: 62 },
  { label: "Plano Standard", value: 88 },
  { label: "Plano Básico", value: 45 },
  { label: "Renovações este mês", value: 71 },
];

const statusLabel = { on: "Ativo", risk: "Baixa atividade", paused: "Inativo" };

function initials(n: string) {
  return n.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function GymDashboard() {
  const { ready } = useRoleGuard("gym");
  if (!ready) return null;

  return (
    <>
      <Sidebar role="gym" active="dashboard" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Dashboard</h1>
          <p>Bem-vindo de volta, aqui está a operação do teu ginásio.</p>
        </div>

        <div className="stat-grid">
          {kpis.map((k) => (
            <div className="stat-card" key={k.label}>
              <div className="stat-top">
                <span className="stat-label">{k.label}</span>
                <span className="stat-icon" style={{ background: "var(--accent-soft)", color: "var(--accent-strong)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {k.icon}
                  </svg>
                </span>
              </div>
              <div className="stat-value tabular">{k.value}</div>
              <div className="stat-delta up">▲ {k.delta}</div>
            </div>
          ))}
        </div>

        <div className="dash-row">
          <div className="dash-panel">
            <div className="dash-panel-head">
              <h2>Equipa</h2>
              <span>{staff.length} de 18</span>
            </div>
            <div className="dash-panel-body">
              {staff.map((s) => (
                <div className="client-row" key={s.name}>
                  <span className="lb-av">{initials(s.name)}</span>
                  <div className="client-info">
                    <span className="client-name">{s.name}</span>
                    <span className="client-plan">{s.role}</span>
                  </div>
                  <span className={`badge ${s.status}`}>{statusLabel[s.status]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="dash-panel">
            <div className="dash-panel-head">
              <h2>Subscrições</h2>
              <span>este mês</span>
            </div>
            <div className="dash-panel-body" style={{ padding: "16px 20px" }}>
              {subscriptions.map((s) => (
                <div key={s.label} className="activity-bar-row">
                  <div className="activity-bar-label">
                    <span>{s.label}</span>
                    <span className="tabular">{s.value}%</span>
                  </div>
                  <div className="activity-bar-track">
                    <div className="activity-bar-fill" style={{ width: `${s.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
