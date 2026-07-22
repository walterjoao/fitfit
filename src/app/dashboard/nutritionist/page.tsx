"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useRoleGuard } from "@/lib/session";

const kpis = [
  { label: "Clientes ativos", value: "46", delta: "+3 este mês", icon: <><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M17 8h4M19 6v4" /></> },
  { label: "Planos ativos", value: "38", delta: "+5 este mês", icon: <path d="M12 3c-3 2-5 5-5 9a5 5 0 0 0 10 0c0-4-2-7-5-9Z" /> },
  { label: "Consultas hoje", value: "6", delta: "próxima às 14:00", icon: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></> },
  { label: "Taxa de adesão", value: "82%", delta: "+4 pts este mês", icon: <path d="M3 17l6-6 4 4 8-8M21 7v6h-6" /> },
];

const clients = [
  { name: "Inês Gonçalves", plan: "Recomposição corporal", progress: 74, status: "on" as const },
  { name: "Marta Neto", plan: "Perda de peso", progress: 38, status: "risk" as const },
  { name: "Tiago Kiala", plan: "Ganho de massa", progress: 90, status: "on" as const },
  { name: "Diana Sacramento", plan: "Manutenção", progress: 55, status: "paused" as const },
];

const appointments = [
  { time: "09:00", name: "Marta Neto", note: "Revisão de plano" },
  { time: "11:30", name: "Tiago Kiala", note: "Consulta de acompanhamento" },
  { time: "14:00", name: "Nova cliente", note: "Primeira consulta" },
  { time: "16:30", name: "Diana Sacramento", note: "Ajuste de macros" },
];

const statusLabel = { on: "Em dia", risk: "Em risco", paused: "Pausado" };

function initials(n: string) {
  return n.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function NutritionistDashboard() {
  const { ready } = useRoleGuard("nutritionist");
  if (!ready) return null;

  return (
    <>
      <Sidebar role="nutritionist" active="dashboard" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Dashboard</h1>
          <p>Bem-vindo de volta, aqui está a atividade nutricional dos teus clientes.</p>
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
              <h2>Clientes</h2>
              <span>{clients.length} de 46</span>
            </div>
            <div className="dash-panel-body">
              {clients.map((c) => (
                <div className="client-row" key={c.name}>
                  <span className="lb-av">{initials(c.name)}</span>
                  <div className="client-info">
                    <span className="client-name">{c.name}</span>
                    <span className="client-plan">{c.plan}</span>
                  </div>
                  <div className="client-progress">
                    <div className="client-progress-fill" style={{ width: `${c.progress}%` }} />
                  </div>
                  <span className={`badge ${c.status}`}>{statusLabel[c.status]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="dash-panel">
            <div className="dash-panel-head">
              <h2>Consultas de Hoje</h2>
              <span>{appointments.length} marcações</span>
            </div>
            <div className="dash-panel-body">
              {appointments.map((a) => (
                <div className="schedule-item" key={a.time}>
                  <span className="schedule-time tabular">{a.time}</span>
                  <span className="schedule-dot" />
                  <div className="schedule-body">
                    <p>{a.name}</p>
                    <span>{a.note}</span>
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
