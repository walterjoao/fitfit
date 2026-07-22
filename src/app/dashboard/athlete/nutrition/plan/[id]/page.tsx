"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import NutritionSubNav from "@/components/NutritionSubNav";
import { useRoleGuard } from "@/lib/session";
import { mealPlans, todayMeals, mealTypeIcon, mealTypeLabel } from "@/lib/nutritionData";

export default function MealPlanDetailPage() {
  const { ready } = useRoleGuard("athlete");
  const params = useParams<{ id: string }>();
  const plan = useMemo(() => mealPlans.find((p) => p.id === params.id), [params.id]);
  const [view, setView] = useState<"daily" | "weekly">("weekly");

  if (!ready) return null;
  if (!plan) {
    return (
      <>
        <Sidebar role="athlete" active="nutrition" />
        <Header />
        <div className="shell"><div className="page-head" style={{ paddingTop: 22 }}><h1>Plano não encontrado</h1></div></div>
      </>
    );
  }

  return (
    <>
      <Sidebar role="athlete" active="nutrition" />
      <Header />
      <div className="shell">
        <div className="featured" style={{ marginBottom: 24 }}>
          <div className="featured-art" style={{ background: plan.cover }}>
            <span className="featured-badge">{plan.createdByRole === "nutritionist" ? "Nutricionista" : "Meu Plano"}</span>
          </div>
          <div className="featured-body">
            <span className="featured-type">{plan.goal}</span>
            <h3>{plan.name}</h3>
            <div className="featured-meta">
              <span>⏱ {plan.duration}</span>
              <span>Criado por {plan.createdBy}</span>
              <span>Progresso: {plan.progress}%</span>
            </div>
            <div className="rich-progress" style={{ marginTop: 4 }}><div className="rich-progress-fill" style={{ width: `${plan.progress}%` }} /></div>
          </div>
        </div>

        <NutritionSubNav />

        <div className="toggle-row">
          <button className={`toggle-btn ${view === "daily" ? "active" : ""}`} onClick={() => setView("daily")}>Diário</button>
          <button className={`toggle-btn ${view === "weekly" ? "active" : ""}`} onClick={() => setView("weekly")}>Semanal</button>
        </div>

        {view === "daily" ? (
          <div className="dash-panel">
            <div className="dash-panel-head"><h2>Segunda-feira</h2><span>{todayMeals.length} refeições</span></div>
            <div className="dash-panel-body">
              {todayMeals.map((m) => (
                <div className="schedule-item" key={m.id}>
                  <span className="schedule-dot" />
                  <div className="schedule-body">
                    <p>{mealTypeIcon[m.type]} {mealTypeLabel[m.type]} · {m.name}</p>
                    <span>{m.time} · {m.calories} kcal · P{m.protein}g C{m.carbs}g G{m.fat}g</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="week-grid">
            {plan.days.map((d) => (
              <div key={d.day} className="week-day-rich">
                <div className="week-day-rich-head">
                  <span className="week-day-rich-label">{d.day.slice(0, 3)}</span>
                </div>
                <div className="week-day-rich-body">
                  <div className="week-day-rich-cover" style={{ background: "var(--accent-soft)" }}>
                    <span className="week-day-rich-name" style={{ color: "var(--accent-ink)" }}>{d.focus}</span>
                  </div>
                  <div className="week-day-rich-meta">
                    {d.meals.map((mt) => (
                      <span key={mt}>{mealTypeIcon[mt]}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
