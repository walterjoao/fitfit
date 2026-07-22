"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ProgressSubNav from "@/components/ProgressSubNav";
import { useRoleGuard } from "@/lib/session";
import { badges, fitPoints, athleteLevel } from "@/lib/progressData";

export default function AthleteAchievementsPage() {
  const { ready } = useRoleGuard("athlete");
  if (!ready) return null;

  return (
    <>
      <Sidebar role="athlete" active="achievements" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Conquistas</h1>
          <p>Streaks, badges e recordes pessoais — o teu sistema motivacional.</p>
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

        <div className="section-head"><h2>Badges Conquistados</h2><span>{badges.length}</span></div>
        <div className="badge-grid">
          {badges.map((b) => (
            <div className="badge-card" key={b.id}>
              <div className="badge-card-icon">{b.icon}</div>
              <div className="badge-card-label">{b.label}</div>
              <div className="badge-card-date">{new Date(b.date).toLocaleDateString("pt-PT")}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
