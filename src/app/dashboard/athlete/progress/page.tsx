"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ProgressSubNav from "@/components/ProgressSubNav";
import { useRoleGuard } from "@/lib/session";
import { seedWeightLog, workoutStats, aiProgressInsights, fitPoints, athleteLevel } from "@/lib/progressData";

function Sparkline({ values }: { values: number[] }) {
  const w = 100;
  const h = 28;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  return (
    <div className="mini-spark">
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <path d={`M${points.join(" L")}`} />
      </svg>
    </div>
  );
}

const quickLinks = [
  { href: "/dashboard/athlete/progress/charts", label: "Gráficos", icon: "📊" },
  { href: "/dashboard/athlete/progress/workouts", label: "Treinos", icon: "🏋️" },
  { href: "/dashboard/athlete/progress/body", label: "Corpo", icon: "📏" },
  { href: "/dashboard/athlete/progress/nutrition", label: "Nutrição", icon: "🍎" },
  { href: "/dashboard/athlete/progress/photos", label: "Fotos", icon: "📸" },
  { href: "/dashboard/athlete/achievements", label: "Conquistas", icon: "🏆" },
  { href: "/dashboard/athlete/progress/history", label: "Histórico", icon: "📅" },
];

export default function ProgressOverviewPage() {
  const { ready } = useRoleGuard("athlete");
  if (!ready) return null;

  const weights = seedWeightLog.map((w) => w.kg);
  const current = weights[weights.length - 1];
  const first = weights[0];
  const delta = current - first;

  return (
    <>
      <Sidebar role="athlete" active="progress" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Progresso</h1>
          <p>O teu centro de resultados — vê a tua evolução real e mantém-te motivado.</p>
        </div>

        <ProgressSubNav />

        <div className="level-card">
          <span className="level-badge">Nv{athleteLevel.level}</span>
          <div className="level-info">
            <div className="level-title">{athleteLevel.label}</div>
            <div className="level-sub">Progresso para o próximo nível</div>
            <div className="level-progress-track"><div className="level-progress-fill" style={{ width: `${athleteLevel.progress}%` }} /></div>
          </div>
          <div className="level-points tabular">🔥 {fitPoints.toLocaleString("pt-PT")}<br /><span style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,.65)" }}>FitPoints</span></div>
        </div>

        <div className="stat-grid">
          <div className="progress-stat">
            <div className="progress-stat-top"><span className="stat-label">Peso Atual</span></div>
            <div className="progress-stat-value tabular">{current} kg</div>
            <div className={`progress-stat-delta ${delta <= 0 ? "good" : "bad"}`}>{delta <= 0 ? "▼" : "▲"} {Math.abs(delta).toFixed(1)} kg</div>
            <Sparkline values={weights} />
          </div>
          <div className="progress-stat">
            <div className="progress-stat-top"><span className="stat-label">Treinos Esta Semana</span></div>
            <div className="progress-stat-value tabular">{workoutStats.workoutsThisWeek}</div>
            <div className="progress-stat-delta good">▲ +1 vs. semana passada</div>
          </div>
          <div className="progress-stat">
            <div className="progress-stat-top"><span className="stat-label">Consistência</span></div>
            <div className="progress-stat-value tabular">{workoutStats.consistencyPct}%</div>
            <div className="rich-progress" style={{ marginTop: 10 }}><div className="rich-progress-fill" style={{ width: `${workoutStats.consistencyPct}%` }} /></div>
          </div>
          <div className="progress-stat">
            <div className="progress-stat-top"><span className="stat-label">Calorias Médias</span></div>
            <div className="progress-stat-value tabular">{workoutStats.avgCalories.toLocaleString("pt-PT")}</div>
            <div className="progress-stat-delta good">kcal / dia</div>
          </div>
        </div>

        <div className="section-head"><h2>Explorar</h2></div>
        <div className="rich-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginBottom: 24 }}>
          {quickLinks.map((q) => (
            <Link href={q.href} key={q.href} className="dash-panel" style={{ padding: "18px 16px", textAlign: "center", textDecoration: "none", color: "inherit" }}>
              <div style={{ fontSize: 26, marginBottom: 6 }}>{q.icon}</div>
              <div style={{ fontSize: 12.5, fontWeight: 700 }}>{q.label}</div>
            </Link>
          ))}
        </div>

        <div className="section-head"><h2>Perceções da IA</h2></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {aiProgressInsights.map((text, i) => (
            <div key={i} className="ai-box" style={{ marginTop: 0 }}>
              <div className="ai-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3M12 18v3M5 5l2 2M17 17l2 2M3 12h3M18 12h3M5 19l2-2M17 7l2-2" /><circle cx="12" cy="12" r="3.2" /></svg>
              </div>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
