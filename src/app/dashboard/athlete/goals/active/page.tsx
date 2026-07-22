"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import GoalsSubNav from "@/components/GoalsSubNav";
import { useRoleGuard } from "@/lib/session";
import { useLocalList } from "@/lib/progressStore";
import { seedGoals, goalProgress, goalStatusColor, daysRemaining, goalTypeLabel, type Goal, type GoalType } from "@/lib/goalsData";

const typeFilters: { key: GoalType | "all"; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "fitness", label: "🏋️ Fitness" },
  { key: "body", label: "⚖️ Corpo" },
  { key: "performance", label: "🏃 Performance" },
  { key: "nutrition", label: "🍎 Nutrição" },
];

export default function ActiveGoalsPage() {
  const { ready } = useRoleGuard("athlete");
  const list = useLocalList<Goal>("fitpro_goals", seedGoals);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [filter, setFilter] = useState<GoalType | "all">("all");

  useEffect(() => {
    setGoals(list.getAll());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ready) return null;

  const active = goals.filter((g) => g.status === "active" && (filter === "all" || g.type === filter));

  return (
    <>
      <Sidebar role="athlete" active="goals" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Objetivos Ativos</h1>
          <p>Todos os objetivos que estás a acompanhar neste momento.</p>
        </div>

        <GoalsSubNav />

        <div className="pill-row">
          {typeFilters.map((f) => (
            <button key={f.key} className={`pill ${filter === f.key ? "active" : ""}`} onClick={() => setFilter(f.key)}>{f.label}</button>
          ))}
        </div>

        <div className="rich-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {active.length === 0 && <p style={{ fontSize: 12.5, color: "var(--text-faint)" }}>Sem objetivos nesta categoria.</p>}
          {active.map((g) => (
            <Link href={`/dashboard/athlete/goals/${g.id}`} key={g.id} className="goal-card" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
              <div className="goal-card-head">
                <span style={{ fontSize: 11, color: "var(--text-faint)" }}>{goalTypeLabel[g.type]}</span>
                <span className={`status-dot ${goalStatusColor(g)}`} style={{ padding: "2px 8px", fontSize: 10 }}>
                  {goalStatusColor(g) === "good" ? "🟢" : goalStatusColor(g) === "warn" ? "🟡" : "🔴"}
                </span>
              </div>
              <div className="goal-card-title">{g.name}</div>
              <p style={{ fontSize: 12, color: "var(--text-dim)", margin: "6px 0" }}>{g.description}</p>
              <div className="goal-card-values"><span className="cur">{g.currentValue}{g.unit}</span><span className="arrow">→</span><span className="tgt">{g.targetValue}{g.unit}</span></div>
              <div className="goal-progress-track"><div className={`goal-progress-fill ${goalStatusColor(g)}`} style={{ width: `${goalProgress(g)}%` }} /></div>
              <p style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 8 }}>{g.frequency} · {daysRemaining(g)} dias restantes</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
