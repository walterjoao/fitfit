"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import NutritionSubNav from "@/components/NutritionSubNav";
import { useRoleGuard } from "@/lib/session";
import { todayMeals, dailyTarget, todayTotals, mealTypeIcon, mealTypeLabel, aiNutritionInsights, planAdherence } from "@/lib/nutritionData";

function Ring({ pct, color }: { pct: number; color: string }) {
  const clamped = Math.min(Math.max(pct, 0), 100);
  return (
    <div className="nut-ring" style={{ background: `conic-gradient(${color} ${clamped * 3.6}deg, var(--surface-2) 0deg)` }}>
      <div className="nut-ring-inner">
        <span className="nut-ring-value tabular">{Math.round(clamped)}%</span>
      </div>
    </div>
  );
}

export default function NutritionDashboardPage() {
  const { ready } = useRoleGuard("athlete");
  if (!ready) return null;

  const totals = todayTotals();
  const remaining = Math.max(dailyTarget.calories - totals.calories, 0);
  const waterL = 2;

  const rings = [
    { key: "calories", icon: "🔥", label: "Calorias", value: totals.calories, target: dailyTarget.calories, unit: "kcal", color: "var(--accent)" },
    { key: "protein", icon: "🥩", label: "Proteína", value: totals.protein, target: dailyTarget.protein, unit: "g", color: "var(--good)" },
    { key: "carbs", icon: "🌾", label: "Carboidratos", value: totals.carbs, target: dailyTarget.carbs, unit: "g", color: "var(--gold)" },
    { key: "fat", icon: "🥑", label: "Gordura", value: totals.fat, target: dailyTarget.fat, unit: "g", color: "#A85AA8" },
    { key: "water", icon: "💧", label: "Água", value: waterL, target: dailyTarget.waterL, unit: "L", color: "#3AA0D6" },
  ];

  return (
    <>
      <Sidebar role="athlete" active="nutrition" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>A Minha Nutrição</h1>
          <p>O teu ecossistema nutricional completo, ligado ao teu treino e ao teu nutricionista.</p>
        </div>

        <NutritionSubNav />

        <div className="section-head"><h2>Resumo Nutricional de Hoje</h2><span>atualizado agora</span></div>
        <div className="nut-ring-grid" style={{ marginBottom: 24 }}>
          {rings.map((r) => (
            <div className="nut-ring-card" key={r.key}>
              <Ring pct={(r.value / r.target) * 100} color={r.color} />
              <span className="nut-ring-label">{r.icon} {r.label}</span>
              <span className="nut-ring-target tabular">{r.value} / {r.target}{r.unit}</span>
            </div>
          ))}
        </div>

        <div className="dash-panel" style={{ padding: 20, marginBottom: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-faint)", marginBottom: 6 }}>FALTAM PARA A META DIÁRIA</p>
          <p className="tabular" style={{ fontSize: 24, fontWeight: 700 }}>🔥 {remaining.toLocaleString("pt-PT")} kcal</p>
          <div className="rich-progress" style={{ marginTop: 10 }}>
            <div className="rich-progress-fill" style={{ width: `${Math.min((totals.calories / dailyTarget.calories) * 100, 100)}%` }} />
          </div>
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
            <div style={{ padding: "12px 20px" }}>
              <Link href="/dashboard/athlete/nutrition/meals" className="btn btn-ghost btn-sm">Ver Todas as Refeições</Link>
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
