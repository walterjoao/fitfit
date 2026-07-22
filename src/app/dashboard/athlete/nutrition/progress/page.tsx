"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import NutritionSubNav from "@/components/NutritionSubNav";
import { useRoleGuard } from "@/lib/session";
import { weeklyCaloriesHistory, weightHistory, planAdherence, dailyTarget, todayTotals } from "@/lib/nutritionData";

export default function NutritionProgressPage() {
  const { ready } = useRoleGuard("athlete");
  if (!ready) return null;

  const maxKcal = Math.max(...weeklyCaloriesHistory.map((d) => d.kcal));
  const minW = Math.min(...weightHistory.map((w) => w.kg));
  const maxW = Math.max(...weightHistory.map((w) => w.kg));
  const totals = todayTotals();

  const macroBars = [
    { label: "Proteína", value: totals.protein, target: dailyTarget.protein },
    { label: "Carboidratos", value: totals.carbs, target: dailyTarget.carbs },
    { label: "Gordura", value: totals.fat, target: dailyTarget.fat },
  ];

  return (
    <>
      <Sidebar role="athlete" active="nutrition" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Progresso Nutricional</h1>
          <p>Cumpriste <b className="tabular">{planAdherence}%</b> do plano esta semana.</p>
        </div>

        <NutritionSubNav />

        <div className="dash-row">
          <div className="dash-panel">
            <div className="dash-panel-head"><h2>Calorias Semanais</h2><span>últimos 7 dias</span></div>
            <div className="chart-bars">
              {weeklyCaloriesHistory.map((d) => (
                <div key={d.day} className="chart-bar" style={{ height: `${(d.kcal / maxKcal) * 100}%` }} />
              ))}
            </div>
            <div className="chart-bar-label">
              {weeklyCaloriesHistory.map((d) => <span key={d.day}>{d.day}</span>)}
            </div>
          </div>

          <div className="dash-panel">
            <div className="dash-panel-head"><h2>Peso</h2><span>últimas 6 semanas</span></div>
            <div className="chart-bars">
              {weightHistory.map((w) => (
                <div key={w.week} className="chart-bar" style={{ height: `${((w.kg - minW + 1) / (maxW - minW + 1)) * 100}%` }} />
              ))}
            </div>
            <div className="chart-bar-label">
              {weightHistory.map((w) => <span key={w.week}>{w.week}</span>)}
            </div>
          </div>
        </div>

        <div className="dash-panel">
          <div className="dash-panel-head"><h2>Macros de Hoje</h2></div>
          <div className="dash-panel-body" style={{ padding: "16px 20px" }}>
            {macroBars.map((m) => (
              <div key={m.label} className="activity-bar-row">
                <div className="activity-bar-label">
                  <span>{m.label}</span>
                  <span className="tabular">{m.value}g / {m.target}g</span>
                </div>
                <div className="activity-bar-track">
                  <div className="activity-bar-fill" style={{ width: `${Math.min((m.value / m.target) * 100, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
