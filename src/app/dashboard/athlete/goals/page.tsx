"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import GoalsSubNav from "@/components/GoalsSubNav";
import { useRoleGuard } from "@/lib/session";
import { useLocalList } from "@/lib/progressStore";
import { seedGoals, goalProgress, goalStatusColor, daysRemaining, aiCoachFor, goalTypeLabel, type Goal } from "@/lib/goalsData";

export default function GoalsOverviewPage() {
  const { ready } = useRoleGuard("athlete");
  const list = useLocalList<Goal>("fitpro_goals", seedGoals);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    setGoals(list.getAll());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ready) return null;

  const active = goals.filter((g) => g.status === "active");
  const main = active[0];
  const urgent = active.filter((g) => daysRemaining(g) <= 7);

  return (
    <>
      <Sidebar role="athlete" active="goals" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Objetivos</h1>
          <p>Define e acompanha os teus objetivos de fitness.</p>
        </div>

        <GoalsSubNav />

        {urgent.map((g) => (
          <div key={g.id} className="alert-banner">
            🔔 Faltam <b>{daysRemaining(g)} dias</b> para atingires &ldquo;{g.name}&rdquo;.
          </div>
        ))}

        {main && (
          <div className="goal-hero">
            <div className="goal-hero-top">
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-faint)", textTransform: "uppercase" }}>Objetivo Principal</span>
                <div className="goal-hero-title">{goalTypeLabel[main.type]} {main.name}</div>
                <div className="goal-hero-sub">{main.description}</div>
              </div>
              <span className={`status-dot ${goalStatusColor(main)}`}>
                {goalStatusColor(main) === "good" ? "🟢 Em progresso" : goalStatusColor(main) === "warn" ? "🟡 Atenção" : "🔴 Atrasado"}
              </span>
            </div>
            <div className="rich-meta-row" style={{ justifyContent: "space-between", marginBottom: 8 }}>
              <span className="tabular">{main.currentValue}{main.unit} → {main.targetValue}{main.unit}</span>
              <span className="tabular">{goalProgress(main).toFixed(0)}% · {daysRemaining(main)} dias restantes</span>
            </div>
            <div className="goal-progress-track"><div className={`goal-progress-fill ${goalStatusColor(main)}`} style={{ width: `${goalProgress(main)}%` }} /></div>
            <div className="ai-box" style={{ marginTop: 16 }}>
              <div className="ai-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3M12 18v3M5 5l2 2M17 17l2 2M3 12h3M18 12h3M5 19l2-2M17 7l2-2" /><circle cx="12" cy="12" r="3.2" /></svg>
              </div>
              <p>{aiCoachFor(main)}</p>
            </div>
          </div>
        )}

        <div className="section-head"><h2>Todos os Objetivos Ativos</h2><span>{active.length}</span></div>
        <div className="rich-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginBottom: 24 }}>
          {active.map((g) => (
            <Link href={`/dashboard/athlete/goals/${g.id}`} key={g.id} className="goal-card" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
              <div className="goal-card-head">
                <span style={{ fontSize: 11, color: "var(--text-faint)" }}>{goalTypeLabel[g.type]}</span>
                <span className={`status-dot ${goalStatusColor(g)}`} style={{ padding: "2px 8px", fontSize: 10 }}>
                  {goalStatusColor(g) === "good" ? "🟢" : goalStatusColor(g) === "warn" ? "🟡" : "🔴"}
                </span>
              </div>
              <div className="goal-card-title">{g.name}</div>
              <div className="goal-card-values"><span className="cur">{g.currentValue}{g.unit}</span><span className="arrow">→</span><span className="tgt">{g.targetValue}{g.unit}</span></div>
              <div className="goal-progress-track"><div className={`goal-progress-fill ${goalStatusColor(g)}`} style={{ width: `${goalProgress(g)}%` }} /></div>
              <p style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 8 }}>{daysRemaining(g)} dias restantes · {goalProgress(g).toFixed(0)}%</p>
            </Link>
          ))}
          <Link href="/dashboard/athlete/goals/new" className="goal-card" style={{ display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", color: "var(--text-dim)", flexDirection: "column", gap: 8 }}>
            <span style={{ fontSize: 26 }}>+</span>
            <span style={{ fontSize: 12.5, fontWeight: 700 }}>Novo Objetivo</span>
          </Link>
        </div>
      </div>
    </>
  );
}
