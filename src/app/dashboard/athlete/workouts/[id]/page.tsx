"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useRoleGuard } from "@/lib/session";
import { notifyAndEmail } from "@/lib/notifications";
import { assignedWorkouts, personalWorkouts, type Exercise } from "@/lib/workoutsData";

type ExerciseState = {
  done: boolean;
  actualWeight: string;
  notes: string;
  mediaPreview?: string;
  mediaKind?: "image" | "video";
};

export default function WorkoutDetailPage() {
  const { session, ready } = useRoleGuard("athlete");
  const params = useParams<{ id: string }>();

  const workout = useMemo(
    () => assignedWorkouts.find((w) => w.id === params.id) || personalWorkouts.find((w) => w.id === params.id),
    [params.id]
  );

  const [tracking, setTracking] = useState(false);
  const [current, setCurrent] = useState(0);
  const [openExercise, setOpenExercise] = useState<string | null>(null);
  const [state, setState] = useState<Record<string, ExerciseState>>({});
  const [finished, setFinished] = useState(false);

  if (!ready) return null;
  if (!workout) {
    return (
      <>
        <Sidebar role="athlete" active="workouts" />
        <Header />
        <div className="shell">
          <div className="page-head" style={{ paddingTop: 22 }}>
            <h1>Treino não encontrado</h1>
          </div>
        </div>
      </>
    );
  }

  function exState(ex: Exercise): ExerciseState {
    return state[ex.id] || { done: false, actualWeight: String(ex.weightKg), notes: "" };
  }

  function update(id: string, patch: Partial<ExerciseState>) {
    setState((s) => ({ ...s, [id]: { ...exState(workout!.exercises.find((e) => e.id === id)!), ...s[id], ...patch } }));
  }

  function onMediaChange(id: string, file: File | null) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    update(id, { mediaPreview: url, mediaKind: file.type.startsWith("video") ? "video" : "image" });
  }

  const doneCount = workout.exercises.filter((e) => exState(e).done).length;

  if (finished) {
    return (
      <>
        <Sidebar role="athlete" active="workouts" />
        <Header />
        <div className="shell">
          <div className="page-head" style={{ paddingTop: 22 }}>
            <h1>Treino Concluído 🎉</h1>
            <p>{workout.name} · {doneCount}/{workout.exercises.length} exercícios concluídos</p>
          </div>
          <div className="dash-panel" style={{ padding: 24 }}>
            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Resumo guardado</p>
            <p style={{ fontSize: 12.5, color: "var(--text-dim)" }}>
              Data: {new Date().toLocaleDateString("pt-PT")} · Concluído às {new Date().toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}
            </p>
            <div style={{ marginTop: 14 }}>
              {workout.exercises.map((e) => (
                <div key={e.id} className="exercise-row">
                  <span className="exercise-num">{exState(e).done ? "✓" : "–"}</span>
                  <div className="exercise-info">
                    <div className="exercise-name">{e.name}</div>
                    <div className="exercise-stats">
                      <span>Peso usado: {exState(e).actualWeight || e.weightKg} kg</span>
                      {exState(e).notes && <span>· {exState(e).notes}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (tracking) {
    const ex = workout.exercises[current];
    const es = exState(ex);
    return (
      <>
        <Sidebar role="athlete" active="workouts" />
        <Header />
        <div className="shell">
          <div className="page-head" style={{ paddingTop: 22 }}>
            <h1>{workout.name}</h1>
            <p>Exercício {current + 1}/{workout.exercises.length}</p>
          </div>

          <div className="dash-panel" style={{ padding: 24, maxWidth: 560 }}>
            {es.mediaPreview ? (
              <div className="media-preview" style={{ marginBottom: 16 }}>
                {es.mediaKind === "video" ? <video src={es.mediaPreview} controls /> : <img src={es.mediaPreview} alt={ex.name} />}
              </div>
            ) : (
              <label className="media-drop" style={{ display: "block", marginBottom: 16 }}>
                Carregar vídeo, GIF ou imagem de demonstração
                <input type="file" accept="image/*,video/*" style={{ display: "none" }} onChange={(e) => onMediaChange(ex.id, e.target.files?.[0] || null)} />
              </label>
            )}

            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{ex.name}</h2>
            <p style={{ fontSize: 12.5, color: "var(--text-dim)", marginBottom: 14 }}>{ex.instructions}</p>

            <div className="form-grid" style={{ marginBottom: 14 }}>
              <label className="field">
                <span className="field-label">Séries × Reps</span>
                <input className="field-input" disabled value={`${ex.sets} × ${ex.reps}`} />
              </label>
              <label className="field">
                <span className="field-label">Descanso</span>
                <input className="field-input" disabled value={`${ex.restSeconds}s`} />
              </label>
              <label className="field">
                <span className="field-label">Peso usado (kg)</span>
                <input className="field-input" type="number" value={es.actualWeight} onChange={(e) => update(ex.id, { actualWeight: e.target.value })} />
              </label>
              <label className="field">
                <span className="field-label">Notas</span>
                <input className="field-input" value={es.notes} onChange={(e) => update(ex.id, { notes: e.target.value })} placeholder="Como te sentiste?" />
              </label>
            </div>

            <button className="btn btn-primary" style={{ marginRight: 8 }} onClick={() => update(ex.id, { done: true })}>
              {es.done ? "✓ Concluído" : "Marcar Concluído"}
            </button>

            <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
              <button className="btn btn-ghost" disabled={current === 0} onClick={() => setCurrent((c) => c - 1)}>Anterior</button>
              {current < workout.exercises.length - 1 ? (
                <button className="btn btn-primary" onClick={() => setCurrent((c) => c + 1)}>Próximo Exercício</button>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setFinished(true);
                    if ("createdBy" in workout) {
                      notifyAndEmail(
                        workout.createdBy,
                        `${session?.name || "O atleta"} concluiu e adicionou notas ao treino "${workout.name}".`,
                        "good"
                      );
                    }
                  }}
                >
                  Terminar Treino
                </button>
              )}
            </div>
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
          <h1>{workout.name}</h1>
          <p>{"createdBy" in workout ? `Criado por ${workout.createdBy}` : "Treino pessoal"} · {workout.exercises.length} exercícios</p>
        </div>

        <button className="btn btn-primary" style={{ marginBottom: 20 }} onClick={() => setTracking(true)}>Começar Treino</button>

        <div className="dash-panel">
          <div className="dash-panel-head">
            <h2>Exercícios</h2>
            <span>{workout.exercises.length}</span>
          </div>
          <div className="dash-panel-body">
            {workout.exercises.map((ex, i) => (
              <div key={ex.id}>
                <div className={`exercise-row ${exState(ex).done ? "done" : ""}`} onClick={() => setOpenExercise(openExercise === ex.id ? null : ex.id)} style={{ cursor: "pointer" }}>
                  <span className="exercise-num">{exState(ex).done ? "✓" : i + 1}</span>
                  <div className="exercise-info">
                    <div className="exercise-name">{ex.name}</div>
                    <div className="exercise-stats">
                      <span>{ex.weightKg > 0 ? `${ex.weightKg} kg` : "Peso corporal"}</span>
                      <span>{ex.sets} séries</span>
                      <span>{ex.reps} reps</span>
                      <span>{ex.restSeconds}s descanso</span>
                    </div>
                  </div>
                </div>
                {openExercise === ex.id && (
                  <div style={{ padding: "0 18px 16px" }}>
                    <p style={{ fontSize: 12.5, color: "var(--text-dim)", marginBottom: 10 }}>{ex.instructions}</p>
                    {exState(ex).mediaPreview ? (
                      <div className="media-preview">
                        {exState(ex).mediaKind === "video" ? <video src={exState(ex).mediaPreview} controls /> : <img src={exState(ex).mediaPreview} alt={ex.name} />}
                      </div>
                    ) : (
                      <label className="media-drop" style={{ display: "block" }}>
                        Carregar vídeo, GIF ou imagem de demonstração
                        <input type="file" accept="image/*,video/*" style={{ display: "none" }} onChange={(e) => onMediaChange(ex.id, e.target.files?.[0] || null)} />
                      </label>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
