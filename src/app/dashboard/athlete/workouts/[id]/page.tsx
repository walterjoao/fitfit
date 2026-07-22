"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useRoleGuard } from "@/lib/session";
import { messagesPath } from "@/lib/accountData";
import { notifyAndEmail } from "@/lib/notifications";
import {
  assignedWorkouts,
  personalWorkouts,
  bookableTrainers,
  getExerciseHistory,
  logExercisePerformance,
  type Exercise,
} from "@/lib/workoutsData";

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
  const [restRemaining, setRestRemaining] = useState<number | null>(null);
  const restRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (restRef.current) clearInterval(restRef.current);
    };
  }, []);

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

  function startRest(seconds: number) {
    if (restRef.current) clearInterval(restRef.current);
    setRestRemaining(seconds);
    restRef.current = setInterval(() => {
      setRestRemaining((r) => {
        if (r === null || r <= 1) {
          if (restRef.current) clearInterval(restRef.current);
          return null;
        }
        return r - 1;
      });
    }, 1000);
  }

  function completeExercise(ex: Exercise) {
    const es = exState(ex);
    const weight = Number(es.actualWeight) || ex.weightKg;
    update(ex.id, { done: true });
    logExercisePerformance(ex.id, weight);
  }

  const doneCount = workout.exercises.filter((e) => exState(e).done).length;
  const trainer = "createdBy" in workout ? bookableTrainers.find((t) => t.name === workout.createdBy) : undefined;

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
              {workout.exercises.map((e) => {
                const history = getExerciseHistory(e.id);
                const prev = history.length >= 2 ? history[history.length - 2] : null;
                const latest = history[history.length - 1];
                const diff = prev && latest ? latest.weightKg - prev.weightKg : 0;
                return (
                  <div key={e.id} className="exercise-row">
                    <span className="exercise-num">{exState(e).done ? "✓" : "–"}</span>
                    <div className="exercise-info">
                      <div className="exercise-name">{e.name}</div>
                      <div className="exercise-stats">
                        <span>Peso usado: {exState(e).actualWeight || e.weightKg} kg</span>
                        {exState(e).notes && <span>· {exState(e).notes}</span>}
                      </div>
                      {prev && diff !== 0 && (
                        <div className="wk-perf-compare" style={{ marginTop: 8 }}>
                          <span>Última vez: <b>{prev.weightKg}kg</b></span>
                          <span>Hoje: <b>{latest.weightKg}kg</b></span>
                          <span>{diff > 0 ? `+${diff}kg melhoria 🔥` : `${diff}kg`}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (tracking) {
    const ex = workout.exercises[current];
    const es = exState(ex);
    const pct = Math.round((doneCount / workout.exercises.length) * 100);
    return (
      <>
        <Sidebar role="athlete" active="workouts" />
        <Header />
        <div className="shell">
          <div className="page-head" style={{ paddingTop: 22 }}>
            <h1>{workout.name}</h1>
            <p>Exercício {current + 1}/{workout.exercises.length} · {doneCount}/{workout.exercises.length} concluídos</p>
          </div>

          <div className="wk-training-progress">
            <div className="wk-training-progress-fill" style={{ width: `${pct}%` }} />
          </div>

          <div className="dash-panel" style={{ padding: 24, maxWidth: 620 }}>
            {es.mediaPreview ? (
              <div className="media-preview" style={{ marginBottom: 16 }}>
                {es.mediaKind === "video" ? <video src={es.mediaPreview} controls /> : <img src={es.mediaPreview} alt={ex.name} />}
              </div>
            ) : ex.gifUrl ? (
              <div className="media-preview" style={{ marginBottom: 16 }}>
                <img src={ex.gifUrl} alt={ex.name} />
              </div>
            ) : (
              <label className="media-drop" style={{ display: "block", marginBottom: 16 }}>
                Carregar vídeo, GIF ou imagem de demonstração
                <input type="file" accept="image/*,video/*" style={{ display: "none" }} onChange={(e) => onMediaChange(ex.id, e.target.files?.[0] || null)} />
              </label>
            )}

            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{ex.name}</h2>
            <div className="wk-exercise-muscles" style={{ marginBottom: 10 }}>
              {ex.muscles.map((m) => <span className="wk-muscle-chip" key={m}>{m}</span>)}
            </div>
            <p style={{ fontSize: 12.5, color: "var(--text-dim)", marginBottom: 14 }}>{ex.instructions}</p>

            {restRemaining !== null && (
              <div className="wk-rest-timer">{restRemaining}s</div>
            )}

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
                <span className="field-label">Notas / Como te sentiste</span>
                <input className="field-input" value={es.notes} onChange={(e) => update(ex.id, { notes: e.target.value })} placeholder="Ex: senti a técnica mais fácil hoje" />
              </label>
            </div>

            <div className="wk-exercise-actions">
              <button className="btn btn-ghost" onClick={() => startRest(ex.restSeconds)}>⏱ Iniciar Descanso</button>
              <button className="btn btn-primary" onClick={() => completeExercise(ex)}>
                {es.done ? "✓ Concluído" : "Marcar Concluído"}
              </button>
            </div>

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

  const insight = (() => {
    for (const e of workout.exercises) {
      const history = getExerciseHistory(e.id);
      if (history.length >= 2) {
        const diff = history[history.length - 1].weightKg - history[history.length - 2].weightKg;
        if (diff > 0) return `Aumentaste ${e.name} em ${diff}kg desde a última sessão. Continua assim! 🔥`;
        if (diff < 0) return `Reduziste a carga em ${e.name} — foca-te na técnica antes de voltar a subir o peso.`;
      }
    }
    return `A tua consistência está a melhorar. Considera aumentar ligeiramente a carga na próxima sessão de ${workout.name}.`;
  })();

  return (
    <>
      <Sidebar role="athlete" active="workouts" />
      <Header />
      <div className="shell">
        <div className="wk-hero" style={{ background: workout.cover }}>
          <div className="wk-hero-inner">
            <div className="wk-hero-cat">{workout.type}</div>
            <h1 className="wk-hero-title">{workout.name}</h1>
            <div className="wk-hero-by">
              {"createdBy" in workout ? <>Criado por <b>{workout.createdBy}</b></> : "Treino pessoal"}
            </div>
            <div className="wk-hero-meta">
              <span className="wk-hero-chip">⏱ {workout.durationMin} minutos</span>
              <span className="wk-hero-chip">📊 {workout.difficulty}</span>
              <span className="wk-hero-chip">🔥 ~{workout.caloriesEstimate} kcal</span>
              <span className="wk-hero-chip">{workout.exercises.length} exercícios</span>
            </div>
            <div className="wk-hero-targets">
              {workout.muscleTargets.map((m) => <span key={m.muscle}>{m.muscle}</span>)}
            </div>
          </div>
        </div>

        <button className="btn btn-primary" style={{ marginBottom: 24 }} onClick={() => setTracking(true)}>▶ Começar Treino</button>

        <div className="wk-section">
          <div className="wk-desc-grid">
            <div className="wk-desc-card">
              <h4>Objetivo</h4>
              <p>{workout.objective}</p>
            </div>
            <div className="wk-desc-card">
              <h4>Para quem é</h4>
              <p>{workout.audience}</p>
            </div>
            <div className="wk-desc-card">
              <h4>Resultados esperados</h4>
              <p>{workout.results}</p>
            </div>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.6, marginTop: 14 }}>{workout.description}</p>
        </div>

        <div className="wk-section">
          <div className="wk-section-title">Benefícios</div>
          <div className="wk-benefits">
            {workout.benefits.map((b) => <div className="wk-benefit" key={b}>{b}</div>)}
          </div>
        </div>

        <div className="wk-section">
          <div className="wk-section-title">Grupos Musculares Trabalhados</div>
          <div className="wk-muscle-bars">
            {workout.muscleTargets.map((m) => (
              <div className="wk-muscle-row" key={m.muscle}>
                <span className="wk-muscle-name">{m.muscle}</span>
                <div className="wk-muscle-track"><div className="wk-muscle-fill" style={{ width: `${m.pct}%` }} /></div>
                <span className="wk-muscle-pct">{m.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="wk-section">
          <div className="ai-box">
            <div className="ai-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3M12 18v3M5 5l2 2M17 17l2 2M3 12h3M18 12h3M5 19l2-2M17 7l2-2" /><circle cx="12" cy="12" r="3.2" /></svg>
            </div>
            <p>{insight}</p>
          </div>
        </div>

        {trainer && (
          <div className="wk-section">
            <div className="wk-section-title">Criado por</div>
            <div className="wk-trainer-card">
              <div className="wk-trainer-cover" style={{ background: trainer.cover }} />
              <div className="wk-trainer-info">
                <div className="wk-trainer-name">{trainer.name}</div>
                <div className="wk-trainer-meta">⭐ {trainer.rating.toFixed(1)} ({trainer.reviews} avaliações) · {trainer.specialty}</div>
              </div>
              <div className="wk-trainer-actions">
                <Link href={session ? messagesPath(session.role) : "/dashboard/athlete/messages"} className="btn btn-ghost">Mensagem</Link>
                <Link href={`/profile/${("trainerId" in workout && workout.trainerId) || ""}`} className="btn btn-primary">Ver Perfil</Link>
              </div>
            </div>
          </div>
        )}

        <div className="wk-section">
          <div className="wk-section-title">Exercícios</div>
          {workout.exercises.map((ex, i) => {
            const es = exState(ex);
            const open = openExercise === ex.id;
            return (
              <div className={`wk-exercise-card ${es.done ? "done" : ""}`} key={ex.id}>
                <div className="wk-exercise-top" onClick={() => setOpenExercise(open ? null : ex.id)}>
                  <div className="wk-exercise-media">
                    {es.mediaPreview ? (
                      es.mediaKind === "video" ? <video src={es.mediaPreview} /> : <img src={es.mediaPreview} alt={ex.name} />
                    ) : ex.gifUrl ? (
                      <img src={ex.gifUrl} alt={ex.name} />
                    ) : null}
                    {es.done && <span className="wk-done-badge">✓</span>}
                  </div>
                  <div className="wk-exercise-head">
                    <div className="wk-exercise-name">{i + 1}. {ex.name}</div>
                    <div className="wk-exercise-muscles">
                      {ex.muscles.map((m) => <span className="wk-muscle-chip" key={m}>{m}</span>)}
                    </div>
                    <div className="wk-exercise-stats">
                      <span>{ex.weightKg > 0 ? `${ex.weightKg} kg` : "Peso corporal"}</span>
                      <span>{ex.sets} séries</span>
                      <span>{ex.reps} reps</span>
                      <span>{ex.restSeconds}s descanso</span>
                    </div>
                  </div>
                </div>
                {open && (
                  <div className="wk-exercise-body">
                    <p className="wk-exercise-instructions">{ex.instructions}</p>
                    <div className="form-grid" style={{ marginBottom: 10 }}>
                      <label className="field">
                        <span className="field-label">Peso (kg)</span>
                        <input className="field-input" type="number" value={es.actualWeight} onChange={(e) => update(ex.id, { actualWeight: e.target.value })} />
                      </label>
                      <label className="field">
                        <span className="field-label">Notas</span>
                        <input className="field-input" value={es.notes} onChange={(e) => update(ex.id, { notes: e.target.value })} placeholder="Como te sentiste?" />
                      </label>
                    </div>
                    <div className="wk-exercise-actions">
                      <button className="btn btn-primary" onClick={() => { setTracking(true); setCurrent(i); }}>▶ Iniciar Exercício</button>
                      <button className="btn btn-ghost" onClick={() => completeExercise(ex)}>{es.done ? "✓ Concluído" : "Marcar Concluído"}</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
