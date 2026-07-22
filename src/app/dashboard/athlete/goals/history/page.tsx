"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import GoalsSubNav from "@/components/GoalsSubNav";
import { useRoleGuard } from "@/lib/session";
import { useLocalList } from "@/lib/progressStore";
import { seedGoals, goalTypeLabel, type Goal } from "@/lib/goalsData";

export default function GoalsHistoryPage() {
  const { ready } = useRoleGuard("athlete");
  const list = useLocalList<Goal>("fitpro_goals", seedGoals);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    setGoals(list.getAll());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ready) return null;

  const completed = goals.filter((g) => g.status === "completed").sort((a, b) => (b.completedAt || "").localeCompare(a.completedAt || ""));

  return (
    <>
      <Sidebar role="athlete" active="goals" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Histórico de Objetivos</h1>
          <p>Todos os objetivos que já concluíste.</p>
        </div>

        <GoalsSubNav />

        <div className="dash-panel">
          <div className="dash-panel-head"><h2>Objetivos Concluídos</h2><span>{completed.length}</span></div>
          <div className="dash-panel-body">
            {completed.length === 0 && <p style={{ padding: "20px", fontSize: 12.5, color: "var(--text-faint)" }}>Ainda não concluíste nenhum objetivo.</p>}
            {completed.map((g) => (
              <div className="schedule-item" key={g.id}>
                <span className="schedule-dot" style={{ background: "var(--good)" }} />
                <div className="schedule-body">
                  <p>✅ {goalTypeLabel[g.type]} {g.name}</p>
                  <span>{g.startValue}{g.unit} → {g.targetValue}{g.unit} · concluído em {g.completedAt ? new Date(g.completedAt).toLocaleDateString("pt-PT") : "—"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
