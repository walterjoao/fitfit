"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import WorkoutsSubNav from "@/components/WorkoutsSubNav";
import { useRoleGuard } from "@/lib/session";
import { assignedWorkouts, personalWorkouts, weekDays } from "@/lib/workoutsData";

const weekPlan: Record<string, string[]> = {
  Segunda: ["Muscle Growth Program"],
  Terça: ["Condicionamento Físico"],
  Quarta: ["Muscle Growth Program"],
  Quinta: ["Condicionamento Físico"],
  Sexta: ["Muscle Growth Program", "Cardio Matinal"],
  Sábado: [],
  Domingo: ["Cardio Matinal"],
};

export default function MyWorkoutsPage() {
  const { ready } = useRoleGuard("athlete");
  const [view, setView] = useState<"daily" | "weekly">("daily");
  const today = "Segunda";

  if (!ready) return null;

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
            {assignedWorkouts.map((w) => (
              <Link href={`/dashboard/athlete/workouts/${w.id}`} key={w.id} className="workout-card" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
                <div className="workout-card-head">
                  <div>
                    <div className="workout-card-title">{w.name}</div>
                    <div className="workout-card-meta">Criado por {w.createdBy} · {w.exercises.length} exercícios</div>
                  </div>
                  <span className="badge on">Ativo</span>
                </div>
                <div className="workout-card-days">
                  {weekDays.map((d) => (
                    <span key={d} className={`day-chip ${w.days.includes(d) ? "on" : ""}`}>{d.slice(0, 3)}</span>
                  ))}
                </div>
              </Link>
            ))}

            <div className="section-head">
              <h2>Os Meus Treinos Pessoais</h2>
              <Link href="/dashboard/athlete/workouts/new" className="btn btn-primary btn-sm">+ Criar Treino</Link>
            </div>
            {personalWorkouts.map((w) => (
              <Link href={`/dashboard/athlete/workouts/${w.id}`} key={w.id} className="workout-card" style={{ display: "block", textDecoration: "none", color: "inherit" }}>
                <div className="workout-card-head">
                  <div>
                    <div className="workout-card-title">{w.name}</div>
                    <div className="workout-card-meta">Pessoal · {w.exercises.length} exercícios · até {new Date(w.endDate).toLocaleDateString("pt-PT")}</div>
                  </div>
                  <span className="badge paused">Pessoal</span>
                </div>
                <div className="workout-card-days">
                  {weekDays.map((d) => (
                    <span key={d} className={`day-chip ${w.days.includes(d) ? "on" : ""}`}>{d.slice(0, 3)}</span>
                  ))}
                </div>
              </Link>
            ))}
          </>
        ) : (
          <div className="week-grid">
            {weekDays.map((d) => (
              <div key={d} className="week-day" style={d === today ? { borderColor: "var(--accent)" } : undefined}>
                <div className="week-day-label">{d.slice(0, 3)}</div>
                {(weekPlan[d] || []).map((name) => (
                  <div key={name} className="week-day-item">{name}</div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
