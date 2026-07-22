"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import NutritionSubNav from "@/components/NutritionSubNav";
import { useRoleGuard } from "@/lib/session";
import { directory } from "@/lib/directory";
import { mealPlans } from "@/lib/nutritionData";

export default function AthleteNutritionistPage() {
  const { ready } = useRoleGuard("athlete");
  if (!ready) return null;

  const nutritionist = directory["ines-goncalves"];
  const currentPlan = mealPlans.find((p) => p.createdByRole === "nutritionist");

  return (
    <>
      <Sidebar role="athlete" active="nutrition" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Nutricionista</h1>
          <p>A profissional que acompanha o teu plano nutricional.</p>
        </div>

        <NutritionSubNav />

        <div className="provider-card-rich" style={{ cursor: "default", maxWidth: 560 }}>
          <div className="provider-cover" style={{ background: nutritionist.cover }} />
          <div className="provider-body-rich">
            <div className="provider-head-row">
              <div>
                <div className="provider-name-rich">{nutritionist.name}</div>
                <div className="provider-specialty">{nutritionist.specialties?.[0]}</div>
              </div>
            </div>
            <p className="provider-desc">{nutritionist.bio}</p>
            <div className="provider-meta-row">
              <span>⭐ {nutritionist.rating.toFixed(1)} ({nutritionist.reviews})</span>
            </div>
          </div>
        </div>

        {currentPlan && (
          <Link href={`/dashboard/athlete/nutrition/plan/${currentPlan.id}`} className="dash-panel" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", marginTop: 16, maxWidth: 560, textDecoration: "none", color: "inherit" }}>
            <div>
              <p style={{ fontSize: 11, color: "var(--text-faint)", fontWeight: 700, textTransform: "uppercase" }}>Plano Atual</p>
              <p style={{ fontSize: 13.5, fontWeight: 700 }}>{currentPlan.name}</p>
            </div>
            <span className="btn btn-ghost btn-sm">Ver Plano →</span>
          </Link>
        )}

        <div className="rich-actions" style={{ maxWidth: 560, marginTop: 16 }}>
          <Link href="/dashboard/athlete/messages" className="btn btn-primary">Enviar Mensagem</Link>
          <Link href="/dashboard/athlete/nutrition/log" className="btn btn-ghost">Pedir Alteração</Link>
          <Link href="/dashboard/athlete/book/n1" className="btn btn-ghost">Marcar Consulta</Link>
          <Link href={`/profile/${nutritionist.id}`} className="btn btn-ghost">Ver Perfil</Link>
        </div>
      </div>
    </>
  );
}
