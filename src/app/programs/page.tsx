"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useRoleGuard } from "@/lib/session";
import { assignedWorkouts } from "@/lib/workoutsData";
import { notifyAndEmail } from "@/lib/notifications";
import { trainees, getClasses, saveClasses, getAssignments, addAssignment, type ClassItem, type Assignment } from "@/lib/trainerBusinessData";

type Tab = "workouts" | "classes" | "assign";

export default function ProgramsPage() {
  const { ready } = useRoleGuard("trainer");
  const [tab, setTab] = useState<Tab>("workouts");
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedTrainees, setSelectedTrainees] = useState<string[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState(assignedWorkouts[0]?.id || "");
  const [duration, setDuration] = useState(4);
  const [notes, setNotes] = useState("");
  const [assigned, setAssigned] = useState(false);
  const [filterTrainee, setFilterTrainee] = useState("all");

  useEffect(() => {
    setClasses(getClasses());
    setAssignments(getAssignments());
    const preselect = new URLSearchParams(window.location.search).get("athlete");
    if (preselect) {
      setTab("assign");
      setSelectedTrainees([preselect]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ready) return null;

  const myWorkouts = assignedWorkouts.filter((w) => w.trainerId === "ana-ferreira");

  function toggleTrainee(id: string) {
    setSelectedTrainees((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  function assign() {
    const workout = myWorkouts.find((w) => w.id === selectedWorkout);
    if (!workout) return;
    let next = assignments;
    selectedTrainees.forEach((id) => {
      const trainee = trainees.find((t) => t.id === id);
      if (!trainee) return;
      next = addAssignment({ traineeId: id, traineeName: trainee.name, kind: "workout", label: `${workout.name} (${duration} sem.)${notes ? " — " + notes : ""}` });
      notifyAndEmail(trainee.name, "A tua PT atribuiu-te um novo treino.", "good", "training", `/dashboard/athlete/workouts/${workout.id}`);
    });
    setAssignments(next);
    setAssigned(true);
    setSelectedTrainees([]);
    setNotes("");
    setTimeout(() => setAssigned(false), 2500);
  }

  const visibleAssignments = assignments.filter((a) => filterTrainee === "all" || a.traineeId === filterTrainee);

  function cancelClass(id: string) {
    const next = classes.filter((c) => c.id !== id);
    setClasses(next);
    saveClasses(next);
  }

  return (
    <>
      <Sidebar role="trainer" active="programs" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Treino</h1>
          <p>Cria treinos, gere aulas de grupo e atribui programas aos teus clientes.</p>
        </div>

        <div className="toggle-row">
          <button className={`toggle-btn ${tab === "workouts" ? "active" : ""}`} onClick={() => setTab("workouts")}>Treinos</button>
          <button className={`toggle-btn ${tab === "classes" ? "active" : ""}`} onClick={() => setTab("classes")}>Aulas</button>
          <button className={`toggle-btn ${tab === "assign" ? "active" : ""}`} onClick={() => setTab("assign")}>Atribuir Programas</button>
        </div>

        {tab === "workouts" && (
          <div className="rich-grid">
            {myWorkouts.map((w) => (
              <div className="rich-card" key={w.id}>
                <div className="rich-cover" style={{ background: w.cover }}>
                  <span className="rich-badge">{w.difficulty}</span>
                </div>
                <div className="rich-body">
                  <div className="rich-title">{w.name}</div>
                  <div className="rich-meta-row"><span>{w.type}</span><span>⏱ {w.durationMin} min</span></div>
                  <div className="rich-meta-row"><span>{w.exercises.length} exercícios</span></div>
                  <div className="rich-actions">
                    <button className="btn btn-ghost btn-sm" style={{ flex: 1 }}>Editar</button>
                    <button className="btn btn-ghost btn-sm" style={{ flex: 1 }}>Eliminar</button>
                  </div>
                </div>
              </div>
            ))}
            <div className="rich-card" style={{ alignItems: "center", justifyContent: "center", display: "flex", minHeight: 200, cursor: "pointer" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-faint)" }}>+ Criar Novo Treino</span>
            </div>
          </div>
        )}

        {tab === "classes" && (
          <div className="rich-grid">
            {classes.map((c) => (
              <div className="rich-card" key={c.id}>
                <div className="rich-body">
                  <div className="rich-title">{c.name}</div>
                  <p className="rich-desc">{c.description}</p>
                  <div className="rich-meta-row"><span>📅 {c.schedule}</span></div>
                  <div className="rich-meta-row"><span>{c.enrolled}/{c.maxParticipants} inscritos</span></div>
                  <div className="rich-progress"><div className="rich-progress-fill" style={{ width: `${(c.enrolled / c.maxParticipants) * 100}%` }} /></div>
                  <div className="rich-actions">
                    <button className="btn btn-ghost btn-sm" style={{ flex: 1 }}>Ver Inscritos</button>
                    <button className="btn btn-ghost btn-sm" style={{ flex: 1 }}>Editar</button>
                    <button className="icon-action" title="Cancelar aula" onClick={() => cancelClass(c.id)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="rich-card" style={{ alignItems: "center", justifyContent: "center", display: "flex", minHeight: 160, cursor: "pointer" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-faint)" }}>+ Criar Nova Aula</span>
            </div>
          </div>
        )}

        {tab === "assign" && (
          <div className="dash-panel" style={{ padding: 22, maxWidth: 640 }}>
            <p className="field-label" style={{ marginBottom: 10 }}>1. Seleciona os clientes</p>
            <div className="pill-row" style={{ marginBottom: 16 }}>
              {trainees.map((t) => (
                <button key={t.id} className={`pill ${selectedTrainees.includes(t.id) ? "active" : ""}`} onClick={() => toggleTrainee(t.id)}>{t.name}</button>
              ))}
            </div>

            <p className="field-label" style={{ marginBottom: 10 }}>2. Seleciona o treino</p>
            <select className="field-input" style={{ marginBottom: 16 }} value={selectedWorkout} onChange={(e) => setSelectedWorkout(e.target.value)}>
              {myWorkouts.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>

            <p className="field-label" style={{ marginBottom: 10 }}>3. Duração (semanas)</p>
            <input className="field-input" type="number" style={{ maxWidth: 140, marginBottom: 16 }} value={duration} onChange={(e) => setDuration(Number(e.target.value))} />

            <p className="field-label" style={{ marginBottom: 10 }}>4. Notas (opcional)</p>
            <input className="field-input" style={{ marginBottom: 18 }} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ex: foco em progressão de carga" />

            {assigned && <p style={{ color: "var(--good)", fontSize: 12.5, marginBottom: 10 }}>✓ Programa atribuído com sucesso. O atleta foi notificado.</p>}
            <button className="auth-submit" style={{ maxWidth: 240 }} disabled={selectedTrainees.length === 0} onClick={assign}>
              Atribuir a {selectedTrainees.length || ""} Cliente{selectedTrainees.length === 1 ? "" : "s"}
            </button>
          </div>
        )}

        {tab === "assign" && (
          <div style={{ maxWidth: 640, marginTop: 24 }}>
            <div className="section-head"><h2>Atribuições</h2></div>
            <select className="field-input" style={{ maxWidth: 220, marginBottom: 14 }} value={filterTrainee} onChange={(e) => setFilterTrainee(e.target.value)}>
              <option value="all">Todos os clientes</option>
              {trainees.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <div className="dash-panel">
              <div className="dash-panel-body">
                {visibleAssignments.length === 0 && <p style={{ padding: 20, fontSize: 12.5, color: "var(--text-faint)" }}>Ainda sem atribuições.</p>}
                {visibleAssignments.map((a) => (
                  <div className="schedule-item" key={a.id}>
                    <span className="schedule-dot" style={{ background: a.status === "active" ? "var(--good)" : "var(--text-faint)" }} />
                    <div className="schedule-body">
                      <p>{a.traineeName} · {a.label}</p>
                      <span>{a.date} · {a.status === "active" ? "Ativo" : "Concluído"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
