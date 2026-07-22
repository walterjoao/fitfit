"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useRoleGuard } from "@/lib/session";
import { notifyAndEmail } from "@/lib/notifications";
import { mealPlans, getNutritionAssignments, addNutritionAssignment, type NutritionAssignment } from "@/lib/nutritionData";

const clients = ["Tiago Kiala", "Marta Neto", "Diana Sacramento", "André Katumba"];

export default function MealPlansPage() {
  const { ready } = useRoleGuard("nutritionist");
  const [selectedClient, setSelectedClient] = useState(clients[0]);
  const [selectedPlan, setSelectedPlan] = useState(mealPlans[0]?.id || "");
  const [assignments, setAssignments] = useState<NutritionAssignment[]>([]);
  const [assigned, setAssigned] = useState(false);

  useEffect(() => {
    setAssignments(getNutritionAssignments());
  }, []);

  if (!ready) return null;

  function assign() {
    const plan = mealPlans.find((p) => p.id === selectedPlan);
    if (!plan) return;
    setAssignments(addNutritionAssignment(selectedClient, plan.name));
    notifyAndEmail(selectedClient, "A tua Nutricionista atualizou o teu plano alimentar.", "good", "training", "/dashboard/athlete/nutrition/plan");
    setAssigned(true);
    setTimeout(() => setAssigned(false), 2500);
  }

  return (
    <>
      <Sidebar role="nutritionist" active="meal_plans" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Planos Alimentares</h1>
          <p>Cria e atribui planos alimentares aos teus clientes.</p>
        </div>

        <div className="rich-grid" style={{ marginBottom: 28 }}>
          {mealPlans.map((p) => (
            <div className="rich-card" key={p.id}>
              <div className="rich-cover" style={{ background: p.cover }} />
              <div className="rich-body">
                <div className="rich-title">{p.name}</div>
                <div className="rich-meta-row"><span>🎯 {p.goal}</span></div>
                <div className="rich-meta-row"><span>⏱ {p.duration}</span></div>
              </div>
            </div>
          ))}
        </div>

        <div className="section-head"><h2>Atribuir Plano</h2></div>
        <div className="dash-panel" style={{ padding: 22, maxWidth: 560, marginBottom: 28 }}>
          <p className="field-label" style={{ marginBottom: 10 }}>1. Seleciona o cliente</p>
          <select className="field-input" style={{ marginBottom: 16 }} value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}>
            {clients.map((c) => <option key={c}>{c}</option>)}
          </select>

          <p className="field-label" style={{ marginBottom: 10 }}>2. Seleciona o plano</p>
          <select className="field-input" style={{ marginBottom: 18 }} value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)}>
            {mealPlans.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>

          {assigned && <p style={{ color: "var(--good)", fontSize: 12.5, marginBottom: 10 }}>✓ Plano atribuído. O cliente foi notificado.</p>}
          <button className="auth-submit" style={{ maxWidth: 220 }} onClick={assign}>Atribuir Plano</button>
        </div>

        <div className="section-head"><h2>Atribuições</h2></div>
        <div className="dash-panel">
          <div className="dash-panel-body">
            {assignments.length === 0 && <p style={{ padding: 20, fontSize: 12.5, color: "var(--text-faint)" }}>Ainda sem atribuições.</p>}
            {assignments.map((a) => (
              <div className="schedule-item" key={a.id}>
                <span className="schedule-dot" style={{ background: "var(--good)" }} />
                <div className="schedule-body"><p>{a.clientName} · {a.planName}</p><span>{a.date}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
