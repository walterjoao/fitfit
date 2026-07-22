"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import NutritionSubNav from "@/components/NutritionSubNav";
import { useRoleGuard } from "@/lib/session";
import { todayMeals, weeklyPlan, mealTypeIcon, mealTypeLabel } from "@/lib/nutritionData";

export default function NutritionPlanPage() {
  const { ready } = useRoleGuard("athlete");
  const [view, setView] = useState<"daily" | "weekly">("daily");
  if (!ready) return null;

  return (
    <>
      <Sidebar role="athlete" active="nutrition" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Plano Alimentar</h1>
          <p>Criado pela tua nutricionista Inês Gonçalves.</p>
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
                    <span>{m.time} · {m.calories} kcal</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="week-grid">
            {weeklyPlan.map((d) => (
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
