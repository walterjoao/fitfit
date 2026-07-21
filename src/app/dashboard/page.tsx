"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const kpis = [
  {
    label: "Total de Membros",
    value: "12.540",
    delta: "+8,2% este mês",
    dir: "up" as const,
    icon: (
      <>
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M17 8h4M19 6v4" />
      </>
    ),
  },
  {
    label: "Programas Ativos",
    value: "24",
    delta: "+3 este mês",
    dir: "up" as const,
    icon: <path d="M6.5 6.5 3 10l3.5 3.5M17.5 6.5 21 10l-3.5 3.5M14 4l-4 16" />,
  },
  {
    label: "Receita",
    value: "1.240.500 Kz",
    delta: "+12,4%",
    dir: "up" as const,
    icon: <path d="M12 3v3M12 18v3M6 8a3 3 0 0 1 3-3h4a3 3 0 1 1 0 6H9a3 3 0 1 0 0 6h6a3 3 0 0 0 3-3" />,
  },
  {
    label: "Taxa de Envolvimento",
    value: "87%",
    delta: "+2,1 pts",
    dir: "up" as const,
    icon: <path d="M3 17l6-6 4 4 8-8M21 7v6h-6" />,
  },
];

const growth = [
  { m: "Fev", v: 8200 },
  { m: "Mar", v: 8850 },
  { m: "Abr", v: 9400 },
  { m: "Mai", v: 10100 },
  { m: "Jun", v: 11300 },
  { m: "Jul", v: 12540 },
];

const activity = [
  { label: "Treinos concluídos", value: 82 },
  { label: "Planos alimentares seguidos", value: 68 },
  { label: "Check-ins diários", value: 91 },
  { label: "Novas inscrições", value: 45 },
];

const leaderboardPreview = [
  { rank: 1, name: "Sarah Chen", points: "9.820 pts", progress: 96 },
  { rank: 2, name: "Michael Lee", points: "8.450 pts", progress: 84 },
  { rank: 3, name: "David Smith", points: "7.900 pts", progress: 77 },
];

const recentActivity = [
  { text: "Novo membro juntou-se à plataforma", who: "Beatriz Chiapa", time: "há 12 min", icon: <><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M17 8h4M19 6v4" /></> },
  { text: "Programa concluído", who: "Ricardo Bumba · Consistência 8 sem.", time: "há 1 h", icon: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></> },
  { text: "Nova compra na loja", who: "Whey Protein Isolado 900g", time: "há 3 h", icon: <><path d="M3 9 12 4l9 5-9 5-9-5Z" /><path d="M3 9v6l9 5 9-5V9" /></> },
  { text: "Conquista desbloqueada", who: "Nelson Sami · 30 dias seguidos", time: "ontem", icon: <><path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4Z" /></> },
];

function LineChart({ data }: { data: { m: string; v: number }[] }) {
  const w = 560;
  const h = 160;
  const pad = 20;
  const max = Math.max(...data.map((d) => d.v));
  const min = Math.min(...data.map((d) => d.v));
  const range = max - min || 1;
  const points = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = pad + (1 - (d.v - min) / range) * (h - pad * 2);
    return { x, y };
  });
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${path} L${points[points.length - 1].x},${h - pad} L${points[0].x},${h - pad} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="line-chart-svg" preserveAspectRatio="none">
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={pad} x2={w - pad} y1={pad + f * (h - pad * 2)} y2={pad + f * (h - pad * 2)} className="line-chart-grid" />
      ))}
      <path d={areaPath} className="line-chart-area" />
      <path d={path} className="line-chart-line" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" className="line-chart-dot" />
      ))}
    </svg>
  );
}

export default function Dashboard() {
  return (
    <>
      <Sidebar active="dashboard" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Dashboard</h1>
          <p>Bem-vindo de volta, aqui está o que está a acontecer hoje.</p>
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
              <div className={`stat-delta ${k.dir}`}>▲ {k.delta}</div>
            </div>
          ))}
        </div>

        <div className="dash-row">
          <div className="dash-panel">
            <div className="dash-panel-head">
              <h2>Crescimento de Membros</h2>
              <span>últimos 6 meses</span>
            </div>
            <div className="dash-panel-body">
              <LineChart data={growth} />
              <div className="chart-bar-label" style={{ padding: "0 20px 16px" }}>
                {growth.map((g) => (
                  <span key={g.m}>{g.m}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="dash-panel">
            <div className="dash-panel-head">
              <h2>Visão Geral de Atividade</h2>
              <span>esta semana</span>
            </div>
            <div className="dash-panel-body" style={{ padding: "16px 20px" }}>
              {activity.map((a) => (
                <div key={a.label} className="activity-bar-row">
                  <div className="activity-bar-label">
                    <span>{a.label}</span>
                    <span className="tabular">{a.value}%</span>
                  </div>
                  <div className="activity-bar-track">
                    <div className="activity-bar-fill" style={{ width: `${a.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dash-row">
          <div className="dash-panel">
            <div className="dash-panel-head">
              <h2>Leaderboard</h2>
              <span>top 3</span>
            </div>
            <div className="dash-panel-body">
              {leaderboardPreview.map((p) => (
                <div className="client-row" key={p.rank}>
                  <span className="lb-pos tabular">{p.rank}</span>
                  <div className="client-info">
                    <span className="client-name">{p.name}</span>
                    <span className="client-plan">{p.points}</span>
                  </div>
                  <div className="client-progress">
                    <div className="client-progress-fill" style={{ width: `${p.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dash-panel">
            <div className="dash-panel-head">
              <h2>Atividade Recente</h2>
              <span>últimas 24h</span>
            </div>
            <div className="dash-panel-body">
              {recentActivity.map((a, i) => (
                <div className="schedule-item" key={i}>
                  <span className="activity-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      {a.icon}
                    </svg>
                  </span>
                  <div className="schedule-body">
                    <p>{a.text}</p>
                    <span>{a.who} · {a.time}</span>
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
