"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import NutritionSubNav from "@/components/NutritionSubNav";
import { useRoleGuard } from "@/lib/session";
import { todayMeals as seedMeals, mealTypeIcon, mealTypeLabel } from "@/lib/nutritionData";

export default function MealsPage() {
  const { ready } = useRoleGuard("athlete");
  const [meals, setMeals] = useState(seedMeals);
  const [openId, setOpenId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  if (!ready) return null;

  function toggleConsumed(id: string) {
    setMeals((ms) => ms.map((m) => (m.id === id ? { ...m, consumed: !m.consumed } : m)));
  }

  return (
    <>
      <Sidebar role="athlete" active="nutrition" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Refeições</h1>
          <p>O plano de refeições criado pela tua nutricionista para hoje.</p>
        </div>

        <NutritionSubNav />

        <div className="rich-grid">
          {meals.map((m) => (
            <div className="rich-card" key={m.id}>
              <div className="rich-cover" style={{ background: m.image, height: 120 }}>
                <span className="rich-badge">{mealTypeIcon[m.type]} {mealTypeLabel[m.type]}</span>
              </div>
              <div className="rich-body">
                <div>
                  <div className="rich-title">{m.name}</div>
                  <div className="rich-meta-row" style={{ marginTop: 4 }}><span>🕐 {m.time}</span></div>
                </div>
                <div className="rich-meta-row">
                  <span>🔥 {m.calories} kcal</span>
                </div>
                <div className="rich-meta-row">
                  <span>P: {m.protein}g</span>
                  <span>C: {m.carbs}g</span>
                  <span>G: {m.fat}g</span>
                </div>
                {openId === m.id && (
                  <div style={{ fontSize: 12, color: "var(--text-dim)" }}>
                    <p style={{ fontWeight: 700, marginBottom: 4 }}>Ingredientes:</p>
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                      {m.ingredients.map((ing) => <li key={ing}>{ing}</li>)}
                    </ul>
                    <label className="field" style={{ marginTop: 10 }}>
                      <span className="field-label">Nota</span>
                      <input
                        className="field-input"
                        value={notes[m.id] || ""}
                        onChange={(e) => setNotes((n) => ({ ...n, [m.id]: e.target.value }))}
                        placeholder="Ex: substituí o arroz por batata doce"
                      />
                    </label>
                  </div>
                )}
                <div className="rich-actions">
                  <button className={`btn ${m.consumed ? "btn-ghost" : "btn-primary"} btn-sm`} onClick={() => toggleConsumed(m.id)}>
                    {m.consumed ? "✓ Consumida" : "Marcar Consumida"}
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setOpenId(openId === m.id ? null : m.id)}>
                    {openId === m.id ? "Ocultar" : "Ver Detalhes"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
