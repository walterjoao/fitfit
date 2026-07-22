"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import GoalsSubNav from "@/components/GoalsSubNav";
import { useRoleGuard } from "@/lib/session";
import { useLocalList } from "@/lib/progressStore";
import { seedGoals, goalTypeLabel, type Goal, type GoalType } from "@/lib/goalsData";

const types: GoalType[] = ["fitness", "body", "performance", "nutrition"];

export default function NewGoalPage() {
  const { ready } = useRoleGuard("athlete");
  const router = useRouter();
  const list = useLocalList<Goal>("fitpro_goals", seedGoals);

  const [type, setType] = useState<GoalType>("fitness");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [unit, setUnit] = useState("kg");
  const [currentValue, setCurrentValue] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [deadline, setDeadline] = useState("");
  const [frequency, setFrequency] = useState<"diário" | "semanal">("semanal");

  if (!ready) return null;

  function save() {
    if (!name || !currentValue || !targetValue || !deadline) return;
    const today = new Date().toISOString().slice(0, 10);
    const goal: Goal = {
      id: Math.random().toString(36).slice(2),
      type, name, description, unit,
      startValue: Number(currentValue),
      currentValue: Number(currentValue),
      targetValue: Number(targetValue),
      deadline,
      frequency,
      status: "active",
      createdAt: today,
      history: [{ date: today, value: Number(currentValue) }],
    };
    list.add(goal);
    router.push(`/dashboard/athlete/goals/${goal.id}`);
  }

  return (
    <>
      <Sidebar role="athlete" active="goals" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Criar Objetivo</h1>
          <p>Define um novo objetivo e começa a acompanhar o teu progresso.</p>
        </div>

        <GoalsSubNav />

        <div className="dash-panel" style={{ padding: 24, maxWidth: 560 }}>
          <div className="field-label" style={{ marginBottom: 8 }}>Tipo de Objetivo</div>
          <div className="pill-row" style={{ marginBottom: 16 }}>
            {types.map((t) => (
              <button key={t} className={`pill ${type === t ? "active" : ""}`} onClick={() => setType(t)}>{goalTypeLabel[t]}</button>
            ))}
          </div>

          <label className="field" style={{ marginBottom: 14 }}>
            <span className="field-label">Nome</span>
            <input className="field-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Perder Peso" />
          </label>

          <label className="field" style={{ marginBottom: 14 }}>
            <span className="field-label">Descrição</span>
            <input className="field-input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex: Reduzir peso corporal com défice calórico controlado" />
          </label>

          <div className="form-grid" style={{ marginBottom: 14 }}>
            <label className="field">
              <span className="field-label">Valor Atual</span>
              <input className="field-input" type="number" value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} placeholder="80" />
            </label>
            <label className="field">
              <span className="field-label">Valor Alvo</span>
              <input className="field-input" type="number" value={targetValue} onChange={(e) => setTargetValue(e.target.value)} placeholder="72" />
            </label>
            <label className="field">
              <span className="field-label">Unidade</span>
              <input className="field-input" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="kg" />
            </label>
            <label className="field">
              <span className="field-label">Data Limite</span>
              <input className="field-input" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </label>
          </div>

          <label className="field" style={{ marginBottom: 20 }}>
            <span className="field-label">Frequência de acompanhamento</span>
            <select className="field-input" value={frequency} onChange={(e) => setFrequency(e.target.value as typeof frequency)}>
              <option value="diário">Diário</option>
              <option value="semanal">Semanal</option>
            </select>
          </label>

          <button className="auth-submit" style={{ maxWidth: 220 }} onClick={save} disabled={!name || !currentValue || !targetValue || !deadline}>
            Criar Objetivo
          </button>
        </div>
      </div>
    </>
  );
}
