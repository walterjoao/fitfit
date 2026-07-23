"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useRoleGuard } from "@/lib/session";
import { assignedWorkouts } from "@/lib/workoutsData";
import { notifyAndEmail } from "@/lib/notifications";
import {
  trainees, getClasses, saveClasses, getAssignments, addAssignment, removeAssignment,
  getCustomWorkouts, addCustomWorkout, removeCustomWorkout,
  getCustomExercises, addCustomExercise,
  aiTrainerInsights,
  type ClassItem, type Assignment, type CustomWorkout, type CustomExercise, type LibraryExercise,
} from "@/lib/trainerBusinessData";

type Tab = "workouts" | "library" | "create" | "classes" | "assign";

const categories = ["Força", "Hipertrofia", "Perda de Peso", "Condicionamento", "Mobilidade", "Recuperação"];
const muscleGroups = ["Peito", "Costas", "Pernas", "Ombros", "Braços", "Core", "Cardio", "Corpo Inteiro"];

function initials(n: string) {
  return n.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function ProgramsPage() {
  const { ready } = useRoleGuard("trainer");
  const [tab, setTab] = useState<Tab>("workouts");
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [customWorkouts, setCustomWorkouts] = useState<CustomWorkout[]>([]);
  const [customExercises, setCustomExercises] = useState<LibraryExercise[]>([]);
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null);
  const [expandedClass, setExpandedClass] = useState<string | null>(null);
  const [editingClass, setEditingClass] = useState<string | null>(null);
  const [showNewClass, setShowNewClass] = useState(false);
  const [classForm, setClassForm] = useState({ name: "", schedule: "", maxParticipants: 15 });
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);

  // Library filters
  const [libSearch, setLibSearch] = useState("");
  const [libMuscle, setLibMuscle] = useState("all");
  const [showNewExercise, setShowNewExercise] = useState(false);
  const [newExercise, setNewExercise] = useState({ name: "", muscles: "Peito", equipment: "", difficulty: "Intermédio", instructions: "" });

  // Create-program wizard
  const [createStep, setCreateStep] = useState(1);
  const [newWorkout, setNewWorkout] = useState({ name: "", description: "", goal: "", difficulty: "Intermédio", durationMin: 45, category: categories[0] });
  const [wizardExercises, setWizardExercises] = useState<CustomExercise[]>([]);
  const [exSearch, setExSearch] = useState("");
  const [savedWorkout, setSavedWorkout] = useState(false);

  // Assign wizard
  const [assignStep, setAssignStep] = useState(1);
  const [selectedTrainees, setSelectedTrainees] = useState<string[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState("");
  const [assignDuration, setAssignDuration] = useState<"1" | "4" | "8" | "12" | "custom">("4");
  const [trainingDays, setTrainingDays] = useState<string[]>(["Segunda", "Quarta", "Sexta"]);
  const [assignNotes, setAssignNotes] = useState("");
  const [assigned, setAssigned] = useState(false);
  const [filterTrainee, setFilterTrainee] = useState("all");

  useEffect(() => {
    setClasses(getClasses());
    setAssignments(getAssignments());
    setCustomWorkouts(getCustomWorkouts());
    setCustomExercises(getCustomExercises());
    const preselect = new URLSearchParams(window.location.search).get("athlete");
    if (preselect) {
      setTab("assign");
      setSelectedTrainees([preselect]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const myWorkouts = assignedWorkouts.filter((w) => w.trainerId === "ana-ferreira");
  const allWorkoutsForAssign = useMemo(
    () => [
      ...myWorkouts.map((w) => ({ id: w.id, name: w.name, difficulty: w.difficulty, durationMin: w.durationMin, cover: w.cover, goal: w.type, custom: false })),
      ...customWorkouts.map((w) => ({ id: w.id, name: w.name, difficulty: w.difficulty, durationMin: w.durationMin, cover: w.cover, goal: w.goal, custom: true })),
    ],
    [customWorkouts]
  );

  const exerciseLibrary: LibraryExercise[] = useMemo(() => {
    const seen = new Set<string>();
    const flat: LibraryExercise[] = [];
    [...assignedWorkouts].forEach((w) => {
      w.exercises.forEach((e) => {
        if (seen.has(e.name)) return;
        seen.add(e.name);
        flat.push({ id: e.id, name: e.name, muscles: e.muscles, equipment: "Peso livre", difficulty: "Intermédio", instructions: e.instructions, gifUrl: e.gifUrl });
      });
    });
    return [...customExercises, ...flat];
  }, [customExercises]);

  const filteredLibrary = exerciseLibrary.filter((e) => {
    const matchesSearch = !libSearch || e.name.toLowerCase().includes(libSearch.toLowerCase());
    const matchesMuscle = libMuscle === "all" || e.muscles.includes(libMuscle);
    return matchesSearch && matchesMuscle;
  });

  const wizardExerciseResults = exerciseLibrary.filter((e) => !exSearch || e.name.toLowerCase().includes(exSearch.toLowerCase()));

  if (!ready) return null;

  function cancelClass(id: string) {
    const next = classes.filter((c) => c.id !== id);
    setClasses(next);
    saveClasses(next);
  }

  function saveClassEdit(id: string) {
    const next = classes.map((c) => (c.id === id ? { ...c, name: classForm.name, schedule: classForm.schedule, maxParticipants: classForm.maxParticipants } : c));
    setClasses(next);
    saveClasses(next);
    setEditingClass(null);
  }

  function createNewClass() {
    if (!classForm.name) return;
    const newClass = {
      id: Math.random().toString(36).slice(2), name: classForm.name, description: "Nova aula de grupo criada por ti.",
      maxParticipants: classForm.maxParticipants, enrolled: 0, schedule: classForm.schedule || "A definir",
      image: classes[0]?.image || "", instructor: "Ana Ferreira", rating: 5,
    };
    const next = [...classes, newClass];
    setClasses(next);
    saveClasses(next);
    setShowNewClass(false);
  }

  function submitNewExercise() {
    if (!newExercise.name) return;
    setCustomExercises(addCustomExercise({ name: newExercise.name, muscles: [newExercise.muscles], equipment: newExercise.equipment || "Nenhum", difficulty: newExercise.difficulty, instructions: newExercise.instructions }));
    setNewExercise({ name: "", muscles: "Peito", equipment: "", difficulty: "Intermédio", instructions: "" });
    setShowNewExercise(false);
  }

  function addExerciseToWizard(e: LibraryExercise) {
    setWizardExercises((list) => [...list, { id: `${e.id}-${Math.random().toString(36).slice(2, 6)}`, name: e.name, muscles: e.muscles, instructions: e.instructions, sets: 4, reps: 10, restSeconds: 90, gifUrl: e.gifUrl }]);
  }
  function updateWizardExercise(id: string, patch: Partial<CustomExercise>) {
    setWizardExercises((list) => list.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }
  function removeWizardExercise(id: string) {
    setWizardExercises((list) => list.filter((x) => x.id !== id));
  }
  function moveWizardExercise(id: string, dir: -1 | 1) {
    setWizardExercises((list) => {
      const i = list.findIndex((x) => x.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= list.length) return list;
      const next = [...list];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  function saveNewWorkout() {
    if (!newWorkout.name || wizardExercises.length === 0) return;
    setCustomWorkouts(addCustomWorkout({
      name: newWorkout.name, description: newWorkout.description, goal: newWorkout.goal || newWorkout.category,
      difficulty: newWorkout.difficulty, durationMin: newWorkout.durationMin, category: newWorkout.category,
      exercises: wizardExercises, cover: "linear-gradient(155deg,#123B33,#1E7A63)",
    }));
    setSavedWorkout(true);
    setNewWorkout({ name: "", description: "", goal: "", difficulty: "Intermédio", durationMin: 45, category: categories[0] });
    setWizardExercises([]);
    setCreateStep(1);
    setTimeout(() => setSavedWorkout(false), 2500);
    setTab("workouts");
  }

  function toggleTrainee(id: string) {
    setSelectedTrainees((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }
  function toggleDay(d: string) {
    setTrainingDays((list) => (list.includes(d) ? list.filter((x) => x !== d) : [...list, d]));
  }

  function assign() {
    const workout = allWorkoutsForAssign.find((w) => w.id === selectedWorkout);
    if (!workout) return;
    const weeks = assignDuration === "custom" ? 4 : Number(assignDuration);
    let next = assignments;
    selectedTrainees.forEach((id) => {
      const trainee = trainees.find((t) => t.id === id);
      if (!trainee) return;
      next = addAssignment({
        traineeId: id, traineeName: trainee.name, kind: "workout",
        label: `${workout.name} (${weeks} sem.)${assignNotes ? " — " + assignNotes : ""}`,
        workoutId: workout.id, workoutName: workout.name, progress: 0,
      });
      notifyAndEmail(trainee.name, "A tua PT atribuiu-te um novo programa de treino.", "good", "training", `/dashboard/athlete/workouts/${workout.id}`);
    });
    setAssignments(next);
    setAssigned(true);
    setSelectedTrainees([]);
    setAssignNotes("");
    setAssignStep(1);
    setTimeout(() => setAssigned(false), 3000);
  }

  const visibleAssignments = assignments.filter((a) => filterTrainee === "all" || a.traineeId === filterTrainee);
  const programCounts: Record<string, number> = {};
  assignments.forEach((a) => { if (a.workoutName) programCounts[a.workoutName] = (programCounts[a.workoutName] || 0) + 1; });
  const mostAssigned = Object.entries(programCounts).sort((a, b) => b[1] - a[1])[0];
  const completedCount = assignments.filter((a) => a.status === "completed").length;
  const completionRate = assignments.length ? Math.round((completedCount / assignments.length) * 100) : 0;

  return (
    <>
      <Sidebar role="trainer" active="programs" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Programas de Treino</h1>
          <p>Cria treinos profissionais, gere a tua biblioteca de exercícios e atribui programas aos teus atletas.</p>
        </div>

        <div className="toggle-row" style={{ flexWrap: "wrap" }}>
          <button className={`toggle-btn ${tab === "workouts" ? "active" : ""}`} onClick={() => setTab("workouts")}>Meus Treinos</button>
          <button className={`toggle-btn ${tab === "library" ? "active" : ""}`} onClick={() => setTab("library")}>Biblioteca de Exercícios</button>
          <button className={`toggle-btn ${tab === "create" ? "active" : ""}`} onClick={() => setTab("create")}>Criar Programa</button>
          <button className={`toggle-btn ${tab === "classes" ? "active" : ""}`} onClick={() => setTab("classes")}>Aulas de Grupo</button>
          <button className={`toggle-btn ${tab === "assign" ? "active" : ""}`} onClick={() => setTab("assign")}>Programas Atribuídos</button>
        </div>

        {/* ---------- MEUS TREINOS ---------- */}
        {tab === "workouts" && (
          <>
            <div className="ai-box" style={{ marginBottom: 20 }}>
              <div className="ai-icon">🤖</div>
              <p>{aiTrainerInsights[0]}</p>
            </div>
            <div className="rich-grid">
              {myWorkouts.map((w) => {
                const assignedCount = assignments.filter((a) => a.workoutId === w.id).length;
                return (
                  <div className="rich-card" key={w.id}>
                    <div className="rich-cover" style={{ background: w.cover, cursor: "pointer" }} onClick={() => setExpandedWorkout(expandedWorkout === w.id ? null : w.id)}>
                      <span className="rich-badge">{w.difficulty}</span>
                    </div>
                    <div className="rich-body">
                      <div className="rich-title">{w.name}</div>
                      <div className="rich-meta-row"><span>🎯 {w.type}</span></div>
                      <div className="rich-meta-row"><span>⏱ {w.durationMin} min</span><span>{w.exercises.length} exercícios</span></div>
                      <div className="rich-meta-row"><span>👥 {assignedCount} atletas atribuídos</span></div>
                      {expandedWorkout === w.id && (
                        <div style={{ borderTop: "1px solid var(--line)", paddingTop: 10, marginTop: 4 }}>
                          {w.exercises.map((ex) => (
                            <div key={ex.id} className="wk-exercise-card" style={{ marginBottom: 8 }}>
                              <div className="wk-exercise-top">
                                {ex.gifUrl && <div className="wk-exercise-media"><img src={ex.gifUrl} alt={ex.name} /></div>}
                                <div className="wk-exercise-head">
                                  <div className="wk-exercise-name" style={{ fontSize: 12.5 }}>{ex.name}</div>
                                  <div className="wk-exercise-muscles">{ex.muscles.slice(0, 2).map((m) => <span className="wk-muscle-chip" key={m}>{m}</span>)}</div>
                                  <div className="wk-exercise-stats">{ex.sets} × {ex.reps} · {ex.restSeconds}s descanso</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="rich-actions" style={{ flexWrap: "wrap" }}>
                        <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => setExpandedWorkout(expandedWorkout === w.id ? null : w.id)}>{expandedWorkout === w.id ? "Fechar" : "Ver"}</button>
                        <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => { setTab("assign"); setSelectedWorkout(w.id); setAssignStep(1); }}>Atribuir</button>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ flex: 1 }}
                          onClick={() =>
                            setCustomWorkouts(
                              addCustomWorkout({
                                name: `${w.name} (Cópia)`, description: w.description, goal: w.type, difficulty: w.difficulty, durationMin: w.durationMin, category: w.type, cover: w.cover,
                                exercises: w.exercises.map((ex) => ({ id: `${ex.id}-${Math.random().toString(36).slice(2, 6)}`, name: ex.name, muscles: ex.muscles, instructions: ex.instructions, sets: ex.sets, reps: ex.reps, restSeconds: ex.restSeconds, gifUrl: ex.gifUrl })),
                              })
                            )
                          }
                        >
                          Duplicar
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {customWorkouts.map((w) => {
                const assignedCount = assignments.filter((a) => a.workoutId === w.id).length;
                return (
                  <div className="rich-card" key={w.id}>
                    <div className="rich-cover" style={{ background: w.cover, cursor: "pointer" }} onClick={() => setExpandedWorkout(expandedWorkout === w.id ? null : w.id)}>
                      <span className="rich-badge">{w.difficulty}</span>
                      <span className="rich-badge" style={{ position: "absolute", top: 14, right: 14 }}>Meu</span>
                    </div>
                    <div className="rich-body">
                      <div className="rich-title">{w.name}</div>
                      <div className="rich-meta-row"><span>🎯 {w.goal}</span></div>
                      <div className="rich-meta-row"><span>⏱ {w.durationMin} min</span><span>{w.exercises.length} exercícios</span></div>
                      <div className="rich-meta-row"><span>👥 {assignedCount} atletas · criado {w.createdDate}</span></div>
                      {expandedWorkout === w.id && (
                        <div style={{ borderTop: "1px solid var(--line)", paddingTop: 10, marginTop: 4 }}>
                          {w.exercises.map((ex) => (
                            <div key={ex.id} className="rich-meta-row" style={{ marginBottom: 4 }}><span>{ex.name} — {ex.sets}×{ex.reps}</span></div>
                          ))}
                        </div>
                      )}
                      <div className="rich-actions" style={{ flexWrap: "wrap" }}>
                        <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => setExpandedWorkout(expandedWorkout === w.id ? null : w.id)}>{expandedWorkout === w.id ? "Fechar" : "Ver"}</button>
                        <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => { setTab("assign"); setSelectedWorkout(w.id); }}>Atribuir</button>
                        <button className="icon-action" title="Eliminar" onClick={() => setCustomWorkouts(removeCustomWorkout(w.id))}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="rich-card" style={{ alignItems: "center", justifyContent: "center", display: "flex", minHeight: 200, cursor: "pointer" }} onClick={() => setTab("create")}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-faint)" }}>+ Criar Novo Treino</span>
              </div>
            </div>
          </>
        )}

        {/* ---------- BIBLIOTECA DE EXERCÍCIOS ---------- */}
        {tab === "library" && (
          <>
            <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
              <div className="search" style={{ maxWidth: 300 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
                <input value={libSearch} onChange={(e) => setLibSearch(e.target.value)} placeholder="Procurar exercícios…" />
              </div>
              <select className="field-input" style={{ maxWidth: 200 }} value={libMuscle} onChange={(e) => setLibMuscle(e.target.value)}>
                <option value="all">Todos os grupos musculares</option>
                {muscleGroups.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
              <button className="btn btn-primary btn-sm" onClick={() => setShowNewExercise((v) => !v)}>+ Criar Exercício</button>
            </div>

            {showNewExercise && (
              <div className="dash-panel" style={{ padding: 18, marginBottom: 20, maxWidth: 560 }}>
                <div className="form-grid" style={{ marginBottom: 12 }}>
                  <label className="field" style={{ gridColumn: "1 / -1" }}><span className="field-label">Nome</span><input className="field-input" value={newExercise.name} onChange={(e) => setNewExercise((f) => ({ ...f, name: e.target.value }))} /></label>
                  <label className="field"><span className="field-label">Grupo Muscular</span>
                    <select className="field-input" value={newExercise.muscles} onChange={(e) => setNewExercise((f) => ({ ...f, muscles: e.target.value }))}>
                      {muscleGroups.map((m) => <option key={m}>{m}</option>)}
                    </select>
                  </label>
                  <label className="field"><span className="field-label">Equipamento</span><input className="field-input" value={newExercise.equipment} onChange={(e) => setNewExercise((f) => ({ ...f, equipment: e.target.value }))} placeholder="Ex: Halteres" /></label>
                  <label className="field" style={{ gridColumn: "1 / -1" }}><span className="field-label">Instruções</span><input className="field-input" value={newExercise.instructions} onChange={(e) => setNewExercise((f) => ({ ...f, instructions: e.target.value }))} /></label>
                </div>
                <label className="media-drop" style={{ display: "block", marginBottom: 12 }}>Carregar Imagem / GIF / Vídeo<input type="file" accept="image/*,video/*" style={{ display: "none" }} /></label>
                <button className="btn btn-primary btn-sm" disabled={!newExercise.name} onClick={submitNewExercise}>Guardar Exercício</button>
              </div>
            )}

            <div className="rich-grid">
              {filteredLibrary.map((e) => (
                <div className="rich-card" key={e.id}>
                  <div className="rich-cover" style={{ background: e.gifUrl ? `url(${e.gifUrl}) center/cover no-repeat` : "var(--surface-2)", height: 130, cursor: "pointer" }} onClick={() => setExpandedExercise(expandedExercise === e.id ? null : e.id)}>
                    {e.custom && <span className="rich-badge">Meu</span>}
                  </div>
                  <div className="rich-body">
                    <div className="rich-title">{e.name}</div>
                    <div className="rich-meta-row">{e.muscles.map((m) => <span key={m} className="wk-muscle-chip">{m}</span>)}</div>
                    <div className="rich-meta-row"><span>🏋️ {e.equipment}</span></div>
                    {expandedExercise === e.id && <p style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.5 }}>{e.instructions}</p>}
                    <button className="btn btn-ghost btn-sm" onClick={() => setExpandedExercise(expandedExercise === e.id ? null : e.id)}>{expandedExercise === e.id ? "Ocultar detalhes" : "Ver detalhes"}</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ---------- CRIAR PROGRAMA ---------- */}
        {tab === "create" && (
          <div style={{ maxWidth: 720 }}>
            <div className="book-steps" style={{ marginBottom: 20 }}>
              {[1, 2, 3].map((i) => <div key={i} className={`book-step ${createStep > i ? "done" : createStep === i ? "active" : ""}`} />)}
            </div>

            {createStep === 1 && (
              <div className="dash-panel" style={{ padding: 22 }}>
                <div className="settings-section-head"><h2>1. Informação Básica</h2></div>
                <div className="form-grid" style={{ marginBottom: 16 }}>
                  <label className="field" style={{ gridColumn: "1 / -1" }}><span className="field-label">Nome do treino</span><input className="field-input" value={newWorkout.name} onChange={(e) => setNewWorkout((f) => ({ ...f, name: e.target.value }))} /></label>
                  <label className="field" style={{ gridColumn: "1 / -1" }}><span className="field-label">Descrição</span><input className="field-input" value={newWorkout.description} onChange={(e) => setNewWorkout((f) => ({ ...f, description: e.target.value }))} /></label>
                  <label className="field"><span className="field-label">Objetivo</span><input className="field-input" value={newWorkout.goal} onChange={(e) => setNewWorkout((f) => ({ ...f, goal: e.target.value }))} placeholder="Ex: Ganho de força" /></label>
                  <label className="field"><span className="field-label">Categoria</span>
                    <select className="field-input" value={newWorkout.category} onChange={(e) => setNewWorkout((f) => ({ ...f, category: e.target.value }))}>
                      {categories.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </label>
                  <label className="field"><span className="field-label">Dificuldade</span>
                    <select className="field-input" value={newWorkout.difficulty} onChange={(e) => setNewWorkout((f) => ({ ...f, difficulty: e.target.value }))}>
                      <option>Iniciante</option><option>Intermédio</option><option>Avançado</option>
                    </select>
                  </label>
                  <label className="field"><span className="field-label">Duração (min)</span><input className="field-input" type="number" value={newWorkout.durationMin} onChange={(e) => setNewWorkout((f) => ({ ...f, durationMin: Number(e.target.value) }))} /></label>
                </div>
                <button className="auth-submit" style={{ maxWidth: 200 }} disabled={!newWorkout.name} onClick={() => setCreateStep(2)}>Seguinte</button>
              </div>
            )}

            {createStep === 2 && (
              <div className="dash-panel" style={{ padding: 22 }}>
                <div className="settings-section-head"><h2>2. Adicionar Exercícios</h2></div>
                <div className="search" style={{ maxWidth: 320, marginBottom: 14 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
                  <input value={exSearch} onChange={(e) => setExSearch(e.target.value)} placeholder="Procurar exercícios…" />
                </div>
                <div className="rich-grid" style={{ marginBottom: 20 }}>
                  {wizardExerciseResults.map((e) => (
                    <div className="rich-card" key={e.id}>
                      <div className="rich-cover" style={{ background: e.gifUrl ? `url(${e.gifUrl}) center/cover no-repeat` : "var(--surface-2)", height: 90 }} />
                      <div className="rich-body">
                        <div className="rich-title" style={{ fontSize: 13 }}>{e.name}</div>
                        <div className="rich-meta-row">{e.muscles.slice(0, 2).map((m) => <span key={m}>{m}</span>)}</div>
                        <button className="btn btn-primary btn-sm" onClick={() => addExerciseToWizard(e)}>+ Adicionar</button>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn btn-ghost btn-sm" style={{ marginBottom: 10 }} onClick={() => setCreateStep(1)}>← Voltar</button>
                <button className="auth-submit" style={{ maxWidth: 200 }} disabled={wizardExercises.length === 0} onClick={() => setCreateStep(3)}>Seguinte ({wizardExercises.length} exercícios)</button>
              </div>
            )}

            {createStep === 3 && (
              <div className="dash-panel" style={{ padding: 22 }}>
                <div className="settings-section-head"><h2>3. Estrutura do Treino</h2><p>Define séries, repetições e descanso. Usa ↑↓ para reordenar.</p></div>
                {wizardExercises.map((e, i) => (
                  <div key={e.id} className="dash-panel" style={{ padding: 14, marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <b style={{ fontSize: 13 }}>{i + 1}. {e.name}</b>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button className="icon-action" onClick={() => moveWizardExercise(e.id, -1)}>↑</button>
                        <button className="icon-action" onClick={() => moveWizardExercise(e.id, 1)}>↓</button>
                        <button className="icon-action" onClick={() => removeWizardExercise(e.id)}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                        </button>
                      </div>
                    </div>
                    <div className="form-grid">
                      <label className="field"><span className="field-label">Séries</span><input className="field-input" type="number" value={e.sets} onChange={(ev) => updateWizardExercise(e.id, { sets: Number(ev.target.value) })} /></label>
                      <label className="field"><span className="field-label">Reps</span><input className="field-input" type="number" value={e.reps} onChange={(ev) => updateWizardExercise(e.id, { reps: Number(ev.target.value) })} /></label>
                      <label className="field"><span className="field-label">Descanso (s)</span><input className="field-input" type="number" value={e.restSeconds} onChange={(ev) => updateWizardExercise(e.id, { restSeconds: Number(ev.target.value) })} /></label>
                      <label className="field"><span className="field-label">Notas</span><input className="field-input" placeholder="opcional" onChange={(ev) => updateWizardExercise(e.id, { instructions: ev.target.value })} /></label>
                    </div>
                  </div>
                ))}
                {savedWorkout && <p style={{ color: "var(--good)", fontSize: 12.5, marginBottom: 10 }}>✓ Treino guardado com sucesso.</p>}
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-ghost" onClick={() => setCreateStep(2)}>← Voltar</button>
                  <button className="auth-submit" style={{ maxWidth: 200 }} onClick={saveNewWorkout}>Guardar Treino</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ---------- AULAS DE GRUPO ---------- */}
        {tab === "classes" && (
          <div className="rich-grid">
            {classes.map((c) => (
              <div className="rich-card" key={c.id}>
                <div className="rich-cover" style={{ background: `url(${c.image}) center/cover no-repeat` }}>
                  <span className="rich-badge">⭐ {c.rating.toFixed(1)}</span>
                </div>
                <div className="rich-body">
                  {editingClass === c.id ? (
                    <>
                      <input className="field-input" style={{ marginBottom: 8 }} value={classForm.name} onChange={(e) => setClassForm((f) => ({ ...f, name: e.target.value }))} />
                      <input className="field-input" style={{ marginBottom: 8 }} value={classForm.schedule} onChange={(e) => setClassForm((f) => ({ ...f, schedule: e.target.value }))} placeholder="Horário" />
                      <input className="field-input" style={{ marginBottom: 8 }} type="number" value={classForm.maxParticipants} onChange={(e) => setClassForm((f) => ({ ...f, maxParticipants: Number(e.target.value) }))} placeholder="Máx. participantes" />
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="btn btn-primary btn-sm" onClick={() => saveClassEdit(c.id)}>Guardar</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => setEditingClass(null)}>Cancelar</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="rich-title">{c.name}</div>
                      <p className="rich-desc">{c.description}</p>
                      <div className="rich-meta-row"><span>👤 {c.instructor}</span></div>
                      <div className="rich-meta-row"><span>📅 {c.schedule}</span></div>
                      <div className="rich-meta-row"><span>{c.enrolled}/{c.maxParticipants} inscritos</span></div>
                      <div className="rich-progress"><div className="rich-progress-fill" style={{ width: `${(c.enrolled / c.maxParticipants) * 100}%` }} /></div>
                      {expandedClass === c.id && (
                        <div style={{ fontSize: 12, color: "var(--text-dim)", borderTop: "1px solid var(--line)", paddingTop: 8 }}>
                          {trainees.slice(0, Math.min(c.enrolled, trainees.length)).map((t) => <div key={t.id}>{t.name}</div>)}
                        </div>
                      )}
                      <div className="rich-actions">
                        <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => setExpandedClass(expandedClass === c.id ? null : c.id)}>{expandedClass === c.id ? "Ocultar" : "Ver Inscritos"}</button>
                        <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => { setEditingClass(c.id); setClassForm({ name: c.name, schedule: c.schedule, maxParticipants: c.maxParticipants }); }}>Editar</button>
                        <button className="icon-action" title="Cancelar aula" onClick={() => cancelClass(c.id)}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
            {showNewClass ? (
              <div className="rich-card" style={{ padding: 16 }}>
                <div className="rich-body" style={{ padding: 0 }}>
                  <input className="field-input" style={{ marginBottom: 8 }} value={classForm.name} onChange={(e) => setClassForm((f) => ({ ...f, name: e.target.value }))} placeholder="Nome da aula" />
                  <input className="field-input" style={{ marginBottom: 8 }} value={classForm.schedule} onChange={(e) => setClassForm((f) => ({ ...f, schedule: e.target.value }))} placeholder="Horário (ex: Seg/Qua · 18:00)" />
                  <input className="field-input" style={{ marginBottom: 8 }} type="number" value={classForm.maxParticipants} onChange={(e) => setClassForm((f) => ({ ...f, maxParticipants: Number(e.target.value) }))} placeholder="Máx. participantes" />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-primary btn-sm" disabled={!classForm.name} onClick={createNewClass}>Criar</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setShowNewClass(false)}>Cancelar</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rich-card" style={{ alignItems: "center", justifyContent: "center", display: "flex", minHeight: 200, cursor: "pointer" }} onClick={() => { setShowNewClass(true); setClassForm({ name: "", schedule: "", maxParticipants: 15 }); }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-faint)" }}>+ Criar Nova Aula</span>
              </div>
            )}
          </div>
        )}

        {/* ---------- PROGRAMAS ATRIBUÍDOS ---------- */}
        {tab === "assign" && (
          <>
            <div className="book-steps" style={{ maxWidth: 640, marginBottom: 20 }}>
              {[1, 2, 3, 4].map((i) => <div key={i} className={`book-step ${assignStep > i ? "done" : assignStep === i ? "active" : ""}`} />)}
            </div>

            <div className="dash-panel" style={{ padding: 22, maxWidth: 640, marginBottom: 28 }}>
              {assignStep === 1 && (
                <>
                  <div className="settings-section-head"><h2>1. Seleciona os Atletas</h2></div>
                  <div className="rich-grid" style={{ marginBottom: 16 }}>
                    {trainees.map((t) => (
                      <div key={t.id} className="rich-card" style={{ cursor: "pointer", border: selectedTrainees.includes(t.id) ? "2px solid var(--accent)" : undefined }} onClick={() => toggleTrainee(t.id)}>
                        <div className="rich-cover" style={{ background: `url(${t.avatar}) center/cover no-repeat`, height: 90 }}>
                          {selectedTrainees.includes(t.id) && <span className="rich-badge">✓ Selecionado</span>}
                        </div>
                        <div className="rich-body" style={{ padding: 12 }}>
                          <div className="rich-title" style={{ fontSize: 13 }}>{t.name}</div>
                          <div className="rich-meta-row"><span>🎯 {t.goal}</span></div>
                          <div className="rich-meta-row"><span>{t.program}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="auth-submit" style={{ maxWidth: 200 }} disabled={selectedTrainees.length === 0} onClick={() => setAssignStep(2)}>Seguinte</button>
                </>
              )}

              {assignStep === 2 && (
                <>
                  <div className="settings-section-head"><h2>2. Seleciona o Programa</h2></div>
                  <div className="rich-grid" style={{ marginBottom: 16 }}>
                    {allWorkoutsForAssign.map((w) => (
                      <div key={w.id} className="rich-card" style={{ cursor: "pointer", border: selectedWorkout === w.id ? "2px solid var(--accent)" : undefined }} onClick={() => setSelectedWorkout(w.id)}>
                        <div className="rich-cover" style={{ background: w.cover, height: 90 }}><span className="rich-badge">{w.difficulty}</span></div>
                        <div className="rich-body" style={{ padding: 12 }}>
                          <div className="rich-title" style={{ fontSize: 13 }}>{w.name}</div>
                          <div className="rich-meta-row"><span>⏱ {w.durationMin} min</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="btn btn-ghost" onClick={() => setAssignStep(1)}>← Voltar</button>{" "}
                  <button className="auth-submit" style={{ maxWidth: 200, display: "inline-block" }} disabled={!selectedWorkout} onClick={() => setAssignStep(3)}>Seguinte</button>
                </>
              )}

              {assignStep === 3 && (
                <>
                  <div className="settings-section-head"><h2>3. Configurar Atribuição</h2></div>
                  <p className="field-label" style={{ marginBottom: 10 }}>Duração</p>
                  <div className="pill-row" style={{ marginBottom: 16 }}>
                    {(["1", "4", "8", "12", "custom"] as const).map((d) => (
                      <button key={d} className={`pill ${assignDuration === d ? "active" : ""}`} onClick={() => setAssignDuration(d)}>{d === "custom" ? "Personalizado" : `${d} semana${d === "1" ? "" : "s"}`}</button>
                    ))}
                  </div>
                  <p className="field-label" style={{ marginBottom: 10 }}>Dias de treino</p>
                  <div className="day-picker" style={{ marginBottom: 20 }}>
                    {["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"].map((d) => (
                      <button key={d} className={`day-toggle ${trainingDays.includes(d) ? "on" : ""}`} onClick={() => toggleDay(d)}>{d.slice(0, 3)}</button>
                    ))}
                  </div>
                  <button className="btn btn-ghost" onClick={() => setAssignStep(2)}>← Voltar</button>{" "}
                  <button className="auth-submit" style={{ maxWidth: 200, display: "inline-block" }} onClick={() => setAssignStep(4)}>Seguinte</button>
                </>
              )}

              {assignStep === 4 && (
                <>
                  <div className="settings-section-head"><h2>4. Notas</h2></div>
                  <input className="field-input" style={{ marginBottom: 18 }} value={assignNotes} onChange={(e) => setAssignNotes(e.target.value)} placeholder="Ex: foco em progressão de carga" />
                  {assigned && <p style={{ color: "var(--good)", fontSize: 12.5, marginBottom: 10 }}>✓ Programa atribuído com sucesso. O atleta foi notificado.</p>}
                  <button className="btn btn-ghost" onClick={() => setAssignStep(3)}>← Voltar</button>{" "}
                  <button className="auth-submit" style={{ maxWidth: 260, display: "inline-block" }} onClick={assign}>
                    Atribuir a {selectedTrainees.length} Atleta{selectedTrainees.length === 1 ? "" : "s"}
                  </button>
                </>
              )}
            </div>

            <div className="dash-row" style={{ marginBottom: 24 }}>
              <div className="dash-panel">
                <div className="dash-panel-head"><h2>📊 Analítica de Programas</h2></div>
                <div className="dash-panel-body" style={{ padding: "16px 20px" }}>
                  <p style={{ fontSize: 12.5, color: "var(--text-dim)", marginBottom: 8 }}>Programa mais atribuído: <b>{mostAssigned ? mostAssigned[0] : "—"}</b> {mostAssigned && `(${mostAssigned[1]}x)`}</p>
                  <p style={{ fontSize: 12.5, color: "var(--text-dim)" }}>Taxa de conclusão: <b className="tabular">{completionRate}%</b></p>
                </div>
              </div>
              <div className="dash-panel">
                <div className="dash-panel-head"><h2>🤖 Assistente de IA</h2></div>
                <div className="dash-panel-body" style={{ padding: "16px 20px" }}>
                  {aiTrainerInsights.slice(1).map((t, i) => <p key={i} style={{ fontSize: 12.5, color: "var(--text-dim)", marginBottom: 8 }}>{t}</p>)}
                </div>
              </div>
            </div>

            <div className="section-head"><h2>Atribuições Ativas</h2></div>
            <select className="field-input" style={{ maxWidth: 220, marginBottom: 14 }} value={filterTrainee} onChange={(e) => setFilterTrainee(e.target.value)}>
              <option value="all">Todos os atletas</option>
              {trainees.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <div className="rich-grid">
              {visibleAssignments.length === 0 && <p style={{ fontSize: 12.5, color: "var(--text-faint)" }}>Ainda sem atribuições.</p>}
              {visibleAssignments.map((a) => {
                const trainee = trainees.find((t) => t.id === a.traineeId);
                return (
                  <div className="rich-card" key={a.id}>
                    <div className="rich-body">
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {trainee && <span className="lb-av">{initials(trainee.name)}</span>}
                        <div className="rich-title" style={{ fontSize: 13.5 }}>{a.traineeName}</div>
                      </div>
                      <div className="rich-meta-row"><span>{a.workoutName || a.label}</span></div>
                      <div className="rich-meta-row" style={{ justifyContent: "space-between" }}>
                        <span className={`badge-status ${a.status === "active" ? "confirmada" : "concluída"}`}>{a.status === "active" ? "Ativo" : "Concluído"}</span>
                        <span className="tabular">{a.progress ?? 0}%</span>
                      </div>
                      <div className="rich-progress"><div className="rich-progress-fill" style={{ width: `${a.progress ?? 0}%` }} /></div>
                      <div className="rich-actions">
                        {trainee && <Link href={`/profile/${trainee.profileId}`} className="btn btn-ghost btn-sm" style={{ flex: 1, textAlign: "center" }}>Ver Progresso</Link>}
                        <button className="icon-action" title="Remover" onClick={() => setAssignments(removeAssignment(a.id))}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
}
