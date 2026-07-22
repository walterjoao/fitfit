"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ProgressSubNav from "@/components/ProgressSubNav";
import { useRoleGuard } from "@/lib/session";
import { planAdherence, dailyTarget, todayTotals, weeklyCaloriesHistory } from "@/lib/nutritionData";

export default function ProgressNutritionPage() {
  const { ready } = useRoleGuard("athlete");
  if (!ready) return null;

  const totals = todayTotals();
  const daysFollowed = Math.round((planAdherence / 100) * 7);
  const maxKcal = Math.max(...weeklyCaloriesHistory.map((d) => d.kcal));

  const macros = [
    { label: "Proteína", value: totals.protein, target: dailyTarget.protein },
    { label: "Carboidratos", value: totals.carbs, target: dailyTarget.carbs },
    { label: "Gordura", value: totals.fat, target: dailyTarget.fat },
  ];

  return (
    <>
      <Sidebar role="athlete" active="progress" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Progresso Nutricional</h1>
          <p>Plano seguido: <b className="tabular">{planAdherence}%</b> esta semana.</p>
        </div>

        <ProgressSubNav />

        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-top"><span className="stat-label">Consistência da Dieta</span></div>
            <div className="stat-value tabular">{planAdherence}%</div>
            <div className="rich-progress" style={{ marginTop: 8 }}><div className="rich-progress-fill" style={{ width: `${planAdherence}%` }} /></div>
          </div>
          <div className="stat-card">
            <div className="stat-top"><span className="stat-label">Dias Cumpridos</span></div>
            <div className="stat-value tabular">{daysFollowed}/7</div>
          </div>
          <div className="stat-card">
            <div className="stat-top"><span className="stat-label">Média de Calorias</span></div>
            <div className="stat-value tabular">{Math.round(weeklyCaloriesHistory.reduce((a, d) => a + d.kcal, 0) / 7).toLocaleString("pt-PT")}</div>
          </div>
        </div>

        <div className="dash-row">
          <div className="dash-panel">
            <div className="dash-panel-head"><h2>Calorias Semanais</h2></div>
            <div className="chart-bars">
              {weeklyCaloriesHistory.map((d) => <div key={d.day} className="chart-bar" style={{ height: `${(d.kcal / maxKcal) * 100}%` }} />)}
            </div>
            <div className="chart-bar-label">{weeklyCaloriesHistory.map((d) => <span key={d.day}>{d.day}</span>)}</div>
          </div>

          <div className="dash-panel">
            <div className="dash-panel-head"><h2>Média de Macros (Hoje)</h2></div>
            <div className="dash-panel-body" style={{ padding: "16px 20px" }}>
              {macros.map((m) => (
                <div key={m.label} className="activity-bar-row">
                  <div className="activity-bar-label"><span>{m.label}</span><span className="tabular">{m.value}g / {m.target}g</span></div>
                  <div className="activity-bar-track"><div className="activity-bar-fill" style={{ width: `${Math.min((m.value / m.target) * 100, 100)}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Link href="/dashboard/athlete/nutrition" className="btn btn-ghost">Ir para o módulo de Nutrição completo</Link>
      </div>
    </>
  );
}
