"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useRoleGuard } from "@/lib/session";
import { weekDays } from "@/lib/workoutsData";

type Row = { name: string; weight: string; sets: string; reps: string; rest: string };

const emptyRow: Row = { name: "", weight: "", sets: "", reps: "", rest: "" };

export default function NewWorkoutPage() {
  const { ready } = useRoleGuard("athlete");
  const [name, setName] = useState("");
  const [assignTo, setAssignTo] = useState<"myself" | "trainee" | "class">("myself");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [days, setDays] = useState<string[]>([]);
  const [rows, setRows] = useState<Row[]>([{ ...emptyRow }]);
  const [saved, setSaved] = useState(false);

  if (!ready) return null;

  function toggleDay(d: string) {
    setDays((ds) => (ds.includes(d) ? ds.filter((x) => x !== d) : [...ds, d]));
  }

  function updateRow(i: number, patch: Partial<Row>) {
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  if (saved) {
    return (
      <>
        <Sidebar role="athlete" active="workouts" />
        <Header />
        <div className="shell">
          <div className="page-head" style={{ paddingTop: 22 }}>
            <h1>Treino Criado</h1>
            <p>&ldquo;{name}&rdquo; foi adicionado aos teus treinos pessoais.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Sidebar role="athlete" active="workouts" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Criar Treino</h1>
          <p>Cria um treino pessoal para ti, para um trainee ou para uma aula.</p>
        </div>

        <div className="dash-panel" style={{ padding: 24, maxWidth: 720, marginBottom: 20 }}>
          <div className="form-grid" style={{ marginBottom: 14 }}>
            <label className="field">
              <span className="field-label">Nome do Treino</span>
              <input className="field-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Treino de Força" />
            </label>
            <label className="field">
              <span className="field-label">Atribuir a</span>
              <select className="field-input" value={assignTo} onChange={(e) => setAssignTo(e.target.value as typeof assignTo)}>
                <option value="myself">Mim mesmo</option>
                <option value="trainee">Trainee</option>
                <option value="class">Aula</option>
              </select>
            </label>
            <label className="field">
              <span className="field-label">Data de Início</span>
              <input className="field-input" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </label>
            <label className="field">
              <span className="field-label">Data de Fim</span>
              <input className="field-input" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </label>
          </div>

          <label className="field" style={{ marginBottom: 14 }}>
            <span className="field-label">Notas</span>
            <input className="field-input" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notas gerais sobre o treino" />
          </label>

          <div className="field" style={{ marginBottom: 4 }}>
            <span className="field-label">Dias</span>
          </div>
          <div className="day-picker" style={{ marginBottom: 20 }}>
            {weekDays.map((d) => (
              <button key={d} type="button" className={`day-toggle ${days.includes(d) ? "on" : ""}`} onClick={() => toggleDay(d)}>
                {d}
              </button>
            ))}
          </div>

          <div className="field-label" style={{ marginBottom: 8 }}>Exercícios</div>
          <div style={{ overflowX: "auto" }}>
            <table className="exercise-table">
              <thead>
                <tr>
                  <th>Atividade</th>
                  <th>Peso (Kg)</th>
                  <th>Séries</th>
                  <th>Reps</th>
                  <th>Descanso (min)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td><input value={r.name} onChange={(e) => updateRow(i, { name: e.target.value })} placeholder="Ex: Supino" /></td>
                    <td><input value={r.weight} onChange={(e) => updateRow(i, { weight: e.target.value })} type="number" /></td>
                    <td><input value={r.sets} onChange={(e) => updateRow(i, { sets: e.target.value })} type="number" /></td>
                    <td><input value={r.reps} onChange={(e) => updateRow(i, { reps: e.target.value })} type="number" /></td>
                    <td><input value={r.rest} onChange={(e) => updateRow(i, { rest: e.target.value })} type="number" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" className="btn btn-ghost btn-sm" style={{ marginTop: 10 }} onClick={() => setRows((rs) => [...rs, { ...emptyRow }])}>
            + Adicionar exercício
          </button>

          <div style={{ marginTop: 20 }}>
            <span className="field-label" style={{ display: "block", marginBottom: 8 }}>Média (vídeo, GIF ou imagem)</span>
            <label className="media-drop" style={{ display: "block" }}>
              Carregar ficheiro de demonstração para os exercícios
              <input type="file" accept="image/*,video/*" style={{ display: "none" }} />
            </label>
          </div>
        </div>

        <button className="auth-submit" style={{ maxWidth: 200 }} disabled={!name || days.length === 0} onClick={() => setSaved(true)}>
          Guardar Treino
        </button>
      </div>
    </>
  );
}
