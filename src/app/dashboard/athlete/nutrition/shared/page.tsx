"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import NutritionSubNav from "@/components/NutritionSubNav";
import { useRoleGuard } from "@/lib/session";
import { sharedMeals } from "@/lib/nutritionData";

const roleLabel: Record<string, string> = {
  nutritionist: "Nutricionista",
  trainer: "Personal Trainer",
  gym: "Ginásio",
  athlete: "Atleta",
};

function initials(n: string) {
  return n.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function SharedMealsPage() {
  const { ready } = useRoleGuard("athlete");
  const [saved, setSaved] = useState<string[]>([]);

  if (!ready) return null;

  function toggleSave(id: string) {
    setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  return (
    <>
      <Sidebar role="athlete" active="nutrition" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Refeições Partilhadas</h1>
          <p>Descobre refeições partilhadas pela tua nutricionista, treinador, ginásio e outros atletas.</p>
        </div>

        <NutritionSubNav />

        <div style={{ maxWidth: 640 }}>
          {sharedMeals.map((m) => (
            <div className="shared-meal-card" key={m.id}>
              <div className="shared-meal-head">
                <span className="avatar">{initials(m.creator)}</span>
                <div>
                  <div className="shared-meal-creator">{m.creator}</div>
                  <div className="shared-meal-role">{roleLabel[m.creatorRole]} · {m.date}</div>
                </div>
              </div>
              <div className="shared-meal-img" style={{ backgroundImage: `url(${m.image})` }} />
              <div className="shared-meal-body">
                <p style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.55, marginBottom: 10 }}>{m.description}</p>
                <div className="rich-meta-row" style={{ marginBottom: 12 }}>
                  <span>🔥 {m.calories} kcal</span>
                  <span>P: {m.protein}g</span>
                  <span>C: {m.carbs}g</span>
                  <span>G: {m.fat}g</span>
                </div>
                <div className="rich-actions">
                  <button className={`btn ${saved.includes(m.id) ? "btn-ghost" : "btn-primary"} btn-sm`} onClick={() => toggleSave(m.id)}>
                    {saved.includes(m.id) ? "✓ Guardada" : "Guardar"}
                  </button>
                  <Link href="/dashboard/athlete/nutrition/log" className="btn btn-ghost btn-sm">Adicionar às Minhas</Link>
                  <Link href="/dashboard/athlete/messages" className="btn btn-ghost btn-sm">Mensagem</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
