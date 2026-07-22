"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import NutritionSubNav from "@/components/NutritionSubNav";
import { useRoleGuard } from "@/lib/session";
import { mealPlans } from "@/lib/nutritionData";

export default function MealPlansPage() {
  const { ready } = useRoleGuard("athlete");
  if (!ready) return null;

  return (
    <>
      <Sidebar role="athlete" active="nutrition" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Planos Alimentares</h1>
          <p>Planos criados pela tua nutricionista e planos que criaste para ti mesmo.</p>
        </div>

        <NutritionSubNav />

        <div className="rich-grid">
          {mealPlans.map((p) => (
            <Link href={`/dashboard/athlete/nutrition/plan/${p.id}`} key={p.id} className="rich-card" style={{ textDecoration: "none", color: "inherit" }}>
              <div className="rich-cover" style={{ background: p.cover }}>
                <span className="rich-badge">{p.createdByRole === "nutritionist" ? "Nutricionista" : "Meu Plano"}</span>
              </div>
              <div className="rich-body">
                <div className="rich-title">{p.name}</div>
                <div className="rich-meta-row"><span>🎯 {p.goal}</span></div>
                <div className="rich-meta-row">
                  <span>⏱ {p.duration}</span>
                  <span>Por {p.createdBy}</span>
                </div>
                <div className="rich-meta-row" style={{ justifyContent: "space-between" }}>
                  <span>Progresso</span>
                  <span className="tabular">{p.progress}%</span>
                </div>
                <div className="rich-progress"><div className="rich-progress-fill" style={{ width: `${p.progress}%` }} /></div>
                <div className="rich-actions">
                  <span className="btn btn-ghost btn-sm" style={{ flex: 1, textAlign: "center" }}>Abrir Plano</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
