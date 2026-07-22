"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import NutritionSubNav from "@/components/NutritionSubNav";
import { useRoleGuard } from "@/lib/session";
import { todayMeals, dailyTarget, todayTotals, mealTypeIcon, mealTypeLabel, aiNutritionInsights, planAdherence } from "@/lib/nutritionData";

export default function NutritionDashboardPage() {
  const { ready } = useRoleGuard("athlete");
  if (!ready) return null;

  const totals = todayTotals();
  const remaining = Math.max(dailyTarget.calories - totals.calories, 0);
  const waterL = 2;

  const macros = [
    { label: "Proteína", value: totals.protein, target: dailyTarget.protein, unit: "g" },
    { label: "Carboidratos", value: totals.carbs, target: dailyTarget.carbs, unit: "g" },
    { label: "Gordura", value: totals.fat, target: dailyTarget.fat, unit: "g" },
    { label: "Água", value: waterL, target: dailyTarget.waterL, unit: "L" },
  ];

  return (
    <>
      <Sidebar role="athlete" active="nutrition" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>A Minha Nutrição</h1>
          <p>O teu acompanhamento nutricional completo, ligado ao teu treino e ao teu nutricionista.</p>
        </div>

        <NutritionSubNav />

        <div className="dash-panel" style={{ padding: 24, marginBottom: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-faint)", marginBottom: 6 }}>NUTRIÇÃO DE HOJE</p>
          <p className="tabular" style={{ fontSize: 28, fontWeight: 700 }}>
            🔥 {totals.calories.toLocaleString("pt-PT")} <span style={{ fontSize: 16, color: "var(--text-faint)", fontWeight: 600 }}>/ {dailyTarget.calories.toLocaleString("pt-PT")} kcal</span>
          </p>
          <div className="rich-progress" style={{ marginTop: 10, marginBottom: 4 }}>
            <div className="rich-progress-fill" style={{ width: `${Math.min((totals.calories / dailyTarget.calories) * 100, 100)}%` }} />
          </div>
          <p style={{ fontSize: 12, color: "var(--text-faint)" }}>Faltam {remaining} kcal para atingires a tua meta diária.</p>
        </div>

        <div className="stat-grid">
          {macros.map((m) => (
            <div className="stat-card" key={m.label}>
              <div className="stat-top"><span className="stat-label">{m.label}</span></div>
              <div className="stat-value tabular">{m.value}{m.unit} / {m.target}{m.unit}</div>
              <div className="rich-progress" style={{ marginTop: 8 }}>
                <div className="rich-progress-fill" style={{ width: `${Math.min((m.value / m.target) * 100, 100)}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="dash-row">
          <div className="dash-panel">
            <div className="dash-panel-head">
              <h2>Refeições de Hoje</h2>
              <span>{todayMeals.filter((m) => m.consumed).length}/{todayMeals.length} consumidas</span>
            </div>
            <div className="dash-panel-body">
              {todayMeals.map((m) => (
                <div className="schedule-item" key={m.id}>
                  <span className="schedule-dot" style={{ background: m.consumed ? "var(--good)" : "var(--text-faint)" }} />
                  <div className="schedule-body">
                    <p>{mealTypeIcon[m.type]} {m.name}</p>
                    <span>{mealTypeLabel[m.type]} · {m.time} · {m.calories} kcal</span>
                  </div>
                  {m.consumed && <span className="badge on" style={{ marginLeft: "auto" }}>Consumida</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="dash-panel">
            <div className="dash-panel-head"><h2>Consistência</h2></div>
            <div className="dash-panel-body" style={{ padding: "16px 20px" }}>
              <p style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 10 }}>
                Cumpriste <b className="tabular">{planAdherence}%</b> do plano alimentar esta semana.
              </p>
              <div className="rich-progress"><div className="rich-progress-fill" style={{ width: `${planAdherence}%` }} /></div>
            </div>
          </div>
        </div>

        <div className="section-head"><h2>Perceções da IA</h2><span>nutrição</span></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {aiNutritionInsights.map((text, i) => (
            <div key={i} className="ai-box" style={{ marginTop: 0 }}>
              <div className="ai-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3c-3 2-5 5-5 9a5 5 0 0 0 10 0c0-4-2-7-5-9Z" /></svg>
              </div>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
