"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import GoalsSubNav from "@/components/GoalsSubNav";
import { useRoleGuard } from "@/lib/session";
import { goalBadges, goalFitPoints } from "@/lib/goalsData";

export default function GoalsAchievementsPage() {
  const { ready } = useRoleGuard("athlete");
  if (!ready) return null;

  return (
    <>
      <Sidebar role="athlete" active="goals" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Conquistas de Objetivos</h1>
          <p>Pontos e badges ganhos ao completares os teus objetivos.</p>
        </div>

        <GoalsSubNav />

        <div className="level-card">
          <span className="level-badge">🎯</span>
          <div className="level-info">
            <div className="level-title">FitPoints de Objetivos</div>
            <div className="level-sub">Ganha pontos sempre que completares um objetivo</div>
          </div>
          <div className="level-points tabular">🔥 {goalFitPoints.toLocaleString("pt-PT")}<br /><span style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,.65)" }}>FitPoints</span></div>
        </div>

        <div className="section-head"><h2>Badges</h2><span>{goalBadges.length}</span></div>
        <div className="badge-grid">
          {goalBadges.map((b) => (
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
