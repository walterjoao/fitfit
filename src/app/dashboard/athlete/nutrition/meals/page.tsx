"use client";

import { useState } from "react";
import Link from "next/link";
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

  function removeMeal(id: string) {
    setMeals((ms) => ms.filter((m) => m.id !== id));
  }

  return (
    <>
      <Sidebar role="athlete" active="nutrition" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1>As Minhas Refeições</h1>
            <p>Gere tudo o que comes, com detalhe nutricional completo.</p>
          </div>
          <Link href="/dashboard/athlete/nutrition/log" className="btn btn-primary">+ Adicionar Refeição</Link>
        </div>

        <NutritionSubNav />

        {meals.length === 0 && (
          <div className="ai-box"><div className="ai-icon">🍽️</div><p>Ainda não tens refeições registadas hoje. Adiciona a tua primeira refeição para começares a acompanhar a tua nutrição.</p></div>
        )}

        <div className="rich-grid">
          {meals.map((m) => (
            <div className="rich-card" key={m.id}>
              <div className="rich-cover" style={{ background: m.image, height: 120 }}>
                <span className="rich-badge">{mealTypeIcon[m.type]} {mealTypeLabel[m.type]}</span>
                {m.consumed && <span className="rich-cover-icon" title="Consumida" style={{ background: "var(--good)" }}>✓</span>}
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
                  <button className="icon-action" title="Remover refeição" onClick={() => removeMeal(m.id)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
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
