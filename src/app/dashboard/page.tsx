"use client";

import { useState } from "react";
import Header from "@/components/Header";

const navGroups: { cap: string; items: { key: string; label: string; icon: JSX.Element }[] }[] = [
  {
    cap: "Visão geral",
    items: [
      { key: "overview", label: "Resumo", icon: <path d="M4 13h6V4H4v9ZM4 20h6v-4H4v4ZM14 20h6v-9h-6v9ZM14 4v4h6V4h-6Z" /> },
      { key: "clients", label: "Clientes", icon: <><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M17 8h4M19 6v4" /></> },
      { key: "schedule", label: "Agenda", icon: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></> },
    ],
  },
  {
    cap: "Negócio",
    items: [
      { key: "revenue", label: "Receita", icon: <path d="M12 3v3M12 18v3M6 8a3 3 0 0 1 3-3h4a3 3 0 1 1 0 6H9a3 3 0 1 0 0 6h6a3 3 0 0 0 3-3" /> },
      { key: "products", label: "Produtos", icon: <><path d="M3 9 12 4l9 5-9 5-9-5Z" /><path d="M3 9v6l9 5 9-5V9" /></> },
      { key: "settings", label: "Definições", icon: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.4 1Z" /></> },
    ],
  },
];

const stats = [
  { label: "Clientes ativos", value: "84", delta: "+6 este mês", dir: "up", bg: "var(--accent-soft)", fg: "var(--accent-strong)", icon: <><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M17 8h4M19 6v4" /></> },
  { label: "Receita mensal", value: "1.240.500 Kz", delta: "+12,4%", dir: "up", bg: "var(--gold-soft)", fg: "var(--gold-ink)", icon: <path d="M12 3v3M12 18v3M6 8a3 3 0 0 1 3-3h4a3 3 0 1 1 0 6H9a3 3 0 1 0 0 6h6a3 3 0 0 0 3-3" /> },
  { label: "Sessões esta semana", value: "37", delta: "+4 vs. semana passada", dir: "up", bg: "var(--good-soft)", fg: "var(--good)", icon: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></> },
  { label: "Taxa de risco", value: "5", delta: "clientes em risco", dir: "down", bg: "var(--bad-soft)", fg: "var(--bad)", icon: <path d="M12 9v4M12 17h.01M10.3 3.9 2.5 18a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /> },
];

const clients = [
  { name: "Carla Domingos", plan: "Transformação · 12 sem.", progress: 82, status: "on" as const },
  { name: "Rui Ferreira", plan: "Ganho de massa · 8 sem.", progress: 64, status: "on" as const },
  { name: "Inês Gonçalves", plan: "Recomposição · 16 sem.", progress: 41, status: "risk" as const },
  { name: "Tiago Kiala", plan: "Consistência · 6 sem.", progress: 90, status: "on" as const },
  { name: "Marta Neto", plan: "Perda de peso · 10 sem.", progress: 20, status: "paused" as const },
  { name: "Nelson Sami", plan: "Performance · 20 sem.", progress: 55, status: "risk" as const },
];

const statusLabel = { on: "Em dia", risk: "Em risco", paused: "Pausado" };

const weekBars = [
  { d: "Seg", v: 62 }, { d: "Ter", v: 88 }, { d: "Qua", v: 45 }, { d: "Qui", v: 95 },
  { d: "Sex", v: 70 }, { d: "Sáb", v: 100 }, { d: "Dom", v: 30 },
];

const schedule = [
  { time: "07:00", name: "Carla Domingos", note: "Treino de força · Sala 2" },
  { time: "09:30", name: "Tiago Kiala", note: "Avaliação mensal" },
  { time: "12:00", name: "Aula em grupo", note: "Funcional · 8 inscritos" },
  { time: "16:30", name: "Rui Ferreira", note: "Treino de hipertrofia" },
  { time: "18:00", name: "Nelson Sami", note: "Consulta nutricional" },
];

function initials(n: string) {
  return n.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function Dashboard() {
  const [active, setActive] = useState("overview");
  const maxBar = Math.max(...weekBars.map((b) => b.v));

  return (
    <>
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Painel · Ana Ferreira</h1>
          <p>Resumo do teu negócio de personal trainer esta semana.</p>
        </div>

        <div className="dash-layout">
          <nav className="dash-nav">
            {navGroups.map((g) => (
              <div key={g.cap}>
                <div className="dash-nav-cap">{g.cap}</div>
                {g.items.map((item) => (
                  <div
                    key={item.key}
                    className={`dash-nav-item ${active === item.key ? "active" : ""}`}
                    onClick={() => setActive(item.key)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      {item.icon}
                    </svg>
                    {item.label}
                  </div>
                ))}
              </div>
            ))}
          </nav>

          <div>
            <div className="stat-grid">
              {stats.map((s) => (
                <div className="stat-card" key={s.label}>
                  <div className="stat-top">
                    <span className="stat-label">{s.label}</span>
                    <span className="stat-icon" style={{ background: s.bg, color: s.fg }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {s.icon}
                      </svg>
                    </span>
                  </div>
                  <div className="stat-value tabular">{s.value}</div>
                  <div className={`stat-delta ${s.dir}`}>
                    {s.dir === "up" ? "▲" : "▼"} {s.delta}
                  </div>
                </div>
              ))}
            </div>

            <div className="dash-row">
              <div className="dash-panel">
                <div className="dash-panel-head">
                  <h2>Sessões esta semana</h2>
                  <span>37 no total</span>
                </div>
                <div className="chart-bars">
                  {weekBars.map((b) => (
                    <div key={b.d} className="chart-bar" style={{ height: `${(b.v / maxBar) * 100}%` }} />
                  ))}
                </div>
                <div className="chart-bar-label">
                  {weekBars.map((b) => (
                    <span key={b.d}>{b.d}</span>
                  ))}
                </div>
              </div>

              <div className="dash-panel">
                <div className="dash-panel-head">
                  <h2>Agenda de hoje</h2>
                  <span>5 marcações</span>
                </div>
                <div className="dash-panel-body">
                  {schedule.map((s) => (
                    <div className="schedule-item" key={s.time + s.name}>
                      <span className="schedule-time tabular">{s.time}</span>
                      <span className="schedule-dot" />
                      <div className="schedule-body">
                        <p>{s.name}</p>
                        <span>{s.note}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="dash-panel">
              <div className="dash-panel-head">
                <h2>Clientes</h2>
                <span>{clients.length} de 84</span>
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
          </div>
        </div>
      </div>
    </>
  );
}
