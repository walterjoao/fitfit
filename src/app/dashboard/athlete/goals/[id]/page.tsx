"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useRoleGuard } from "@/lib/session";
import { useLocalList } from "@/lib/progressStore";
import { seedGoals, goalProgress, goalStatusColor, daysRemaining, aiCoachFor, goalTypeLabel, type Goal } from "@/lib/goalsData";

function GoalChart({ history, unit }: { history: { date: string; value: number }[]; unit: string }) {
  const w = 560, h = 150, pad = 20;
  const values = history.map((p) => p.value);
  const min = Math.min(...values), max = Math.max(...values);
  const range = max - min || 1;
  const coords = history.map((p, i) => ({
    x: pad + (i / Math.max(history.length - 1, 1)) * (w - pad * 2),
    y: pad + (1 - (p.value - min) / range) * (h - pad * 2),
  }));
  const path = coords.map((c, i) => `${i === 0 ? "M" : "L"}${c.x},${c.y}`).join(" ");
  const area = `${path} L${coords[coords.length - 1].x},${h - pad} L${coords[0].x},${h - pad} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="line-chart-svg" preserveAspectRatio="none">
      <path d={area} className="line-chart-area" />
      <path d={path} className="line-chart-line" />
      {coords.map((c, i) => <circle key={i} cx={c.x} cy={c.y} r="3" className="line-chart-dot" />)}
    </svg>
  );
}

export default function GoalDetailPage() {
  const { ready } = useRoleGuard("athlete");
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const list = useLocalList<Goal>("fitpro_goals", seedGoals);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newValue, setNewValue] = useState("");
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editTarget, setEditTarget] = useState("");
  const [editDeadline, setEditDeadline] = useState("");

  useEffect(() => {
    setGoals(list.getAll());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ready) return null;

  const goal = goals.find((g) => g.id === params.id);
  if (!goal) {
    return (
      <>
        <Sidebar role="athlete" active="goals" />
        <Header />
        <div className="shell"><div className="page-head" style={{ paddingTop: 22 }}><h1>Objetivo não encontrado</h1></div></div>
      </>
    );
  }

  function addProgress() {
    if (!newValue || !goal) return;
    const value = Number(newValue);
    const history = [...goal.history, { date: new Date().toISOString().slice(0, 10), value }];
    const completed = goal.targetValue >= goal.startValue ? value >= goal.targetValue : value <= goal.targetValue;
    setGoals(list.update(goal.id, { currentValue: value, history, status: completed ? "completed" : "active", completedAt: completed ? new Date().toISOString().slice(0, 10) : undefined }));
    setNewValue("");
  }

  function startEdit() {
    setEditing(true);
    setEditName(goal!.name);
    setEditTarget(String(goal!.targetValue));
    setEditDeadline(goal!.deadline);
  }

  function saveEdit() {
    setGoals(list.update(goal!.id, { name: editName, targetValue: Number(editTarget), deadline: editDeadline }));
    setEditing(false);
  }

  function removeGoal() {
    list.remove(goal!.id);
    router.push("/dashboard/athlete/goals/active");
  }

  return (
    <>
      <Sidebar role="athlete" active="goals" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1>{goalTypeLabel[goal.type]} {goal.name}</h1>
            <p>{goal.description}</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-ghost btn-sm" onClick={startEdit}>Editar</button>
            <button className="icon-action" title="Remover objetivo" onClick={removeGoal}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /></svg>
            </button>
          </div>
        </div>

        {editing && (
          <div className="dash-panel" style={{ padding: 20, marginBottom: 20, maxWidth: 500 }}>
            <div className="form-grid" style={{ marginBottom: 14 }}>
              <label className="field"><span className="field-label">Nome</span><input className="field-input" value={editName} onChange={(e) => setEditName(e.target.value)} /></label>
              <label className="field"><span className="field-label">Valor Alvo</span><input className="field-input" type="number" value={editTarget} onChange={(e) => setEditTarget(e.target.value)} /></label>
              <label className="field"><span className="field-label">Prazo</span><input className="field-input" type="date" value={editDeadline} onChange={(e) => setEditDeadline(e.target.value)} /></label>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="auth-submit" style={{ maxWidth: 160 }} onClick={saveEdit}>Guardar</button>
              <button className="btn btn-ghost" onClick={() => setEditing(false)}>Cancelar</button>
            </div>
          </div>
        )}

        <div className="goal-hero">
          <div className="goal-hero-top">
            <span className="tabular" style={{ fontSize: 22, fontWeight: 700 }}>{goal.currentValue}{goal.unit} → {goal.targetValue}{goal.unit}</span>
            <span className={`status-dot ${goalStatusColor(goal)}`}>
              {goal.status === "completed" ? "✅ Concluído" : goalStatusColor(goal) === "good" ? "🟢 Em progresso" : goalStatusColor(goal) === "warn" ? "🟡 Atenção" : "🔴 Atrasado"}
            </span>
          </div>
          <div className="goal-progress-track"><div className={`goal-progress-fill ${goalStatusColor(goal)}`} style={{ width: `${goalProgress(goal)}%` }} /></div>
          <p style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 8 }}>{goalProgress(goal).toFixed(0)}% concluído · {daysRemaining(goal)} dias restantes · {goal.frequency}</p>
        </div>

        <div className="ai-box" style={{ marginBottom: 24 }}>
          <div className="ai-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3M12 18v3M5 5l2 2M17 17l2 2M3 12h3M18 12h3M5 19l2-2M17 7l2-2" /><circle cx="12" cy="12" r="3.2" /></svg>
          </div>
          <p>{aiCoachFor(goal)}</p>
        </div>

        <div className="dash-row">
          <div className="dash-panel">
            <div className="dash-panel-head"><h2>Evolução</h2></div>
            <div className="dash-panel-body" style={{ paddingTop: 10 }}>
              <GoalChart history={goal.history} unit={goal.unit} />
            </div>
          </div>

          <div className="dash-panel">
            <div className="dash-panel-head"><h2>Adicionar Progresso</h2></div>
            <div className="dash-panel-body" style={{ padding: "16px 20px" }}>
              <label className="field" style={{ marginBottom: 12 }}>
                <span className="field-label">Novo valor ({goal.unit})</span>
                <input className="field-input" type="number" value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder={String(goal.currentValue)} />
              </label>
              <button className="auth-submit" style={{ maxWidth: 200 }} onClick={addProgress} disabled={!newValue}>Guardar Progresso</button>

              <p className="field-label" style={{ marginTop: 20, marginBottom: 8 }}>Últimas Atualizações</p>
              {[...goal.history].reverse().slice(0, 5).map((h, i) => (
                <div className="schedule-item" key={i}>
                  <span className="schedule-dot" />
                  <div className="schedule-body"><p className="tabular">{h.value}{goal.unit}</p><span>{new Date(h.date).toLocaleDateString("pt-PT")}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
