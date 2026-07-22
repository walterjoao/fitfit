"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import NutritionSubNav from "@/components/NutritionSubNav";
import { useRoleGuard } from "@/lib/session";
import { nutritionGoal, nutritionGoalLabel, type NutritionGoalType } from "@/lib/nutritionData";

const goals: NutritionGoalType[] = ["lose_weight", "build_muscle", "maintain", "performance"];

export default function NutritionGoalsPage() {
  const { ready } = useRoleGuard("athlete");
  const [goal, setGoal] = useState<NutritionGoalType>(nutritionGoal.type);
  if (!ready) return null;

  const total = nutritionGoal.targetWeightKg - nutritionGoal.startWeightKg;
  const progressed = nutritionGoal.currentWeightKg - nutritionGoal.startWeightKg;
  const pct = total !== 0 ? Math.min(Math.max((progressed / total) * 100, 0), 100) : 0;

  return (
    <>
      <Sidebar role="athlete" active="nutrition" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Metas Nutricionais</h1>
          <p>Define o teu objetivo atual e acompanha o progresso de peso.</p>
        </div>

        <NutritionSubNav />

        <div className="section-head"><h2>Objetivo atual</h2></div>
        <div className="pill-row" style={{ marginBottom: 24 }}>
          {goals.map((g) => (
            <button key={g} className={`pill ${goal === g ? "active" : ""}`} onClick={() => setGoal(g)}>
              {nutritionGoalLabel[g]}
            </button>
          ))}
        </div>

        <div className="dash-panel" style={{ padding: 24, maxWidth: 520 }}>
          <div className="stat-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)", marginBottom: 20 }}>
            <div className="stat-card">
              <div className="stat-top"><span className="stat-label">Peso Atual</span></div>
              <div className="stat-value tabular">{nutritionGoal.currentWeightKg} kg</div>
            </div>
            <div className="stat-card">
              <div className="stat-top"><span className="stat-label">Peso Objetivo</span></div>
              <div className="stat-value tabular">{nutritionGoal.targetWeightKg} kg</div>
            </div>
          </div>
          <div className="rich-meta-row" style={{ justifyContent: "space-between", marginBottom: 6 }}>
            <span>Progresso</span>
            <span className="tabular">{pct.toFixed(0)}%</span>
          </div>
          <div className="rich-progress"><div className="rich-progress-fill" style={{ width: `${pct}%` }} /></div>
        </div>
      </div>
    </>
  );
}
