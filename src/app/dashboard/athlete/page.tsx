"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const kpis = [
  { label: "Treinos esta semana", value: "4", delta: "+1 vs. semana passada", icon: <><path d="M6.5 6.5 3 10l3.5 3.5M17.5 6.5 21 10l-3.5 3.5M14 4l-4 16" /></> },
  { label: "Calorias hoje", value: "1.840", delta: "meta: 2.200", icon: <path d="M12 3c-3 2-5 5-5 9a5 5 0 0 0 10 0c0-4-2-7-5-9Z" /> },
  { label: "Progresso do objetivo", value: "68%", delta: "+5% este mês", icon: <path d="M3 17l6-6 4 4 8-8M21 7v6h-6" /> },
  { label: "Conquistas", value: "12", delta: "+2 este mês", icon: <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4Z" /> },
];

const workouts = [
  { name: "Treino de Força · Superior", when: "Hoje · 18:00", status: "on" as const },
  { name: "Cardio HIIT", when: "Amanhã · 07:00", status: "paused" as const },
  { name: "Treino de Pernas", when: "Qui · 18:00", status: "on" as const },
];

const nutrition = [
  { label: "Proteína", value: 78 },
  { label: "Hidratos de carbono", value: 62 },
  { label: "Gordura", value: 54 },
  { label: "Água (litros)", value: 85 },
];

const statusLabel = { on: "Agendado", risk: "Em risco", paused: "Adiado" };

export default function AthleteDashboard() {
  return (
    <>
      <Sidebar active="dashboard" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Dashboard</h1>
          <p>Bem-vindo de volta, aqui está o teu progresso.</p>
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
              <h2>Próximos Treinos</h2>
              <span>{workouts.length} agendados</span>
            </div>
            <div className="dash-panel-body">
              {workouts.map((w) => (
                <div className="schedule-item" key={w.name}>
                  <span className="schedule-dot" />
                  <div className="schedule-body">
                    <p>{w.name}</p>
                    <span>{w.when}</span>
                  </div>
                  <span className={`badge ${w.status}`} style={{ marginLeft: "auto" }}>{statusLabel[w.status]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="dash-panel">
            <div className="dash-panel-head">
              <h2>Nutrição de Hoje</h2>
              <span>metas diárias</span>
            </div>
            <div className="dash-panel-body" style={{ padding: "16px 20px" }}>
              {nutrition.map((n) => (
                <div key={n.label} className="activity-bar-row">
                  <div className="activity-bar-label">
                    <span>{n.label}</span>
                    <span className="tabular">{n.value}%</span>
                  </div>
                  <div className="activity-bar-track">
                    <div className="activity-bar-fill" style={{ width: `${n.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="ai-box">
          <div className="ai-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3M12 18v3M5 5l2 2M17 17l2 2M3 12h3M18 12h3M5 19l2-2M17 7l2-2" /><circle cx="12" cy="12" r="3.2" /></svg>
          </div>
          <p>Recomendação da IA: <b>aumenta a ingestão de proteína</b> em 15g nos dias de treino de força para acelerar a recuperação.</p>
        </div>
      </div>
    </>
  );
}
