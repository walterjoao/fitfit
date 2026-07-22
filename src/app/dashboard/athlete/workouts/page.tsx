"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import WorkoutsSubNav from "@/components/WorkoutsSubNav";
import { useRoleGuard } from "@/lib/session";
import { notifyAndEmail } from "@/lib/notifications";
import { assignedWorkouts, personalWorkouts, weekDays, type AssignedWorkout, type PersonalWorkout } from "@/lib/workoutsData";

const weekPlan: Record<string, { workout: AssignedWorkout | PersonalWorkout; trainer: string }[]> = {
  Segunda: [{ workout: assignedWorkouts[0], trainer: "Ana Ferreira" }],
  Terça: [{ workout: assignedWorkouts[1], trainer: "Ana Ferreira" }],
  Quarta: [{ workout: assignedWorkouts[0], trainer: "Ana Ferreira" }],
  Quinta: [{ workout: assignedWorkouts[1], trainer: "Ana Ferreira" }],
  Sexta: [{ workout: assignedWorkouts[0], trainer: "Ana Ferreira" }, { workout: personalWorkouts[0], trainer: "Pessoal" }],
  Sábado: [],
  Domingo: [{ workout: personalWorkouts[0], trainer: "Pessoal" }],
};

function DifficultyBadge({ level }: { level: string }) {
  return <span className="rich-badge">{level}</span>;
}

function WorkoutCard({ w, createdBy, onDelete }: { w: AssignedWorkout | PersonalWorkout; createdBy: string; onDelete?: () => void }) {
  return (
    <div className="rich-card">
      <div className="rich-cover" style={{ background: w.cover }}>
        <div className="rich-badge-row">
          <DifficultyBadge level={w.difficulty} />
        </div>
        <span className="rich-cover-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 6.5 3 10l3.5 3.5M17.5 6.5 21 10l-3.5 3.5M14 4l-4 16" /></svg>
        </span>
      </div>
      <div className="rich-body">
        <div>
          <div className="rich-title">{w.name}</div>
          <div className="rich-meta-row" style={{ marginTop: 4 }}>
            <span>Criado por {createdBy}</span>
          </div>
        </div>
        <div className="rich-meta-row">
          <span>⏱ {w.durationMin} min</span>
          <span>💪 {w.exercises.length} exercícios</span>
          <span>🔥 ~{w.durationMin * 7} kcal</span>
        </div>
        <p className="rich-desc">&ldquo;{w.description}&rdquo;</p>
        <div>
          <div className="rich-meta-row" style={{ justifyContent: "space-between", marginBottom: 4 }}>
            <span>Progresso</span>
            <span className="tabular">{w.progress}%</span>
          </div>
          <div className="rich-progress"><div className="rich-progress-fill" style={{ width: `${w.progress}%` }} /></div>
        </div>
        <div className="rich-actions">
          <Link href={`/dashboard/athlete/workouts/${w.id}`} className="btn btn-primary btn-sm">Começar Treino</Link>
          <Link href={`/dashboard/athlete/workouts/${w.id}`} className="btn btn-ghost btn-sm">Ver Detalhes</Link>
          {onDelete && (
            <button className="icon-action" title="Remover" onClick={onDelete}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /></svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MyWorkoutsPage() {
  const { session, ready } = useRoleGuard("athlete");
  const [view, setView] = useState<"daily" | "weekly">("daily");
  const [removed, setRemoved] = useState<string[]>([]);
  const today = "Segunda";

  if (!ready) return null;

  const visiblePersonal = personalWorkouts.filter((w) => !removed.includes(w.id));

  function removePersonal(w: PersonalWorkout) {
    setRemoved((r) => [...r, w.id]);
    notifyAndEmail("Sistema FitPro", `${session?.name || "O atleta"} removeu o treino pessoal "${w.name}".`, "bad");
  }

  return (
    <>
      <Sidebar role="athlete" active="workouts" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Os Meus Treinos</h1>
          <p>Treinos atribuídos pelo teu treinador e os teus treinos pessoais.</p>
        </div>

        <WorkoutsSubNav />

        <div className="toggle-row">
          <button className={`toggle-btn ${view === "daily" ? "active" : ""}`} onClick={() => setView("daily")}>Diário</button>
          <button className={`toggle-btn ${view === "weekly" ? "active" : ""}`} onClick={() => setView("weekly")}>Semanal</button>
        </div>

        {view === "daily" ? (
          <>
            <div className="section-head">
              <h2>Treinos Atribuídos</h2>
              <span>por Personal Trainers</span>
            </div>
            <div className="rich-grid" style={{ marginBottom: 30 }}>
              {assignedWorkouts.map((w) => (
                <WorkoutCard key={w.id} w={w} createdBy={w.createdBy} />
              ))}
            </div>

            <div className="section-head">
              <h2>Os Meus Treinos Pessoais</h2>
              <Link href="/dashboard/athlete/workouts/new" className="btn btn-primary btn-sm">+ Criar Treino</Link>
            </div>
            <div className="rich-grid">
              {visiblePersonal.map((w) => (
                <WorkoutCard key={w.id} w={w} createdBy="ti mesmo" onDelete={() => removePersonal(w)} />
              ))}
              {visiblePersonal.length === 0 && (
                <p style={{ fontSize: 12.5, color: "var(--text-faint)" }}>Sem treinos pessoais. Cria um novo acima.</p>
              )}
            </div>
          </>
        ) : (
          <div className="week-grid">
            {weekDays.map((d) => {
              const items = weekPlan[d] || [];
              return (
                <div key={d} className="week-day-rich" style={d === today ? { borderColor: "var(--accent)" } : undefined}>
                  <div className="week-day-rich-head">
                    <span className="week-day-rich-label">{d.slice(0, 3)}</span>
                    {d === today && <span className="badge on" style={{ fontSize: 9 }}>Hoje</span>}
                  </div>
                  <div className="week-day-rich-body">
                    {items.length === 0 && <div className="week-day-empty">Descanso</div>}
                    {items.map(({ workout, trainer }, i) => (
                      <Link href={`/dashboard/athlete/workouts/${workout.id}`} key={workout.id + i} style={{ textDecoration: "none" }}>
                        <div className="week-day-rich-cover" style={{ background: workout.cover }}>
                          <span className="week-day-rich-name">{workout.name}</span>
                        </div>
                        <div className="week-day-rich-meta">
                          <span>{workout.durationMin}min</span>
                          <span>{workout.exercises.length} ex.</span>
                          <span>{workout.progress}%</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
