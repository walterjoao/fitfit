"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import WorkoutsSubNav from "@/components/WorkoutsSubNav";
import { useRoleGuard } from "@/lib/session";
import { availableClasses, myClasses } from "@/lib/workoutsData";

export default function ClassesPage() {
  const { ready } = useRoleGuard("athlete");
  const [tab, setTab] = useState<"available" | "mine">("available");
  const [joined, setJoined] = useState<string[]>(myClasses.upcoming.map((c) => c.id));

  if (!ready) return null;

  function seatState(seats: number, taken: number) {
    const free = seats - taken;
    if (free <= 0) return "full";
    if (free <= 3) return "low";
    return "ok";
  }

  return (
    <>
      <Sidebar role="athlete" active="workouts" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Aulas</h1>
          <p>Descobre e junta-te a aulas de fitness perto de ti.</p>
        </div>

        <WorkoutsSubNav />

        <div className="toggle-row">
          <button className={`toggle-btn ${tab === "available" ? "active" : ""}`} onClick={() => setTab("available")}>Disponíveis</button>
          <button className={`toggle-btn ${tab === "mine" ? "active" : ""}`} onClick={() => setTab("mine")}>As Minhas Aulas</button>
        </div>

        {tab === "available" ? (
          <div className="grid">
            {availableClasses.map((c) => {
              const state = seatState(c.seats, c.seatsTaken);
              const isJoined = joined.includes(c.id);
              return (
                <div className="class-card" key={c.id}>
                  <div className="class-card-head"><h3>{c.name}</h3></div>
                  <div className="class-card-body">
                    <div className="class-meta">
                      <span>{c.trainer} · {c.gym}</span>
                      <span>{c.date} · {c.time}</span>
                      <span><span className="stars">★</span> {c.rating.toFixed(1)}</span>
                    </div>
                    <div className="product-foot">
                      <span className={`class-seats ${state}`}>{c.seats - c.seatsTaken} vagas</span>
                      <button
                        className={`btn ${isJoined ? "btn-ghost" : "btn-primary"} btn-sm`}
                        disabled={state === "full" && !isJoined}
                        onClick={() => setJoined((j) => (isJoined ? j.filter((x) => x !== c.id) : [...j, c.id]))}
                      >
                        {isJoined ? "Inscrito ✓" : "Juntar-me"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <>
            <div className="section-head">
              <h2>Próximas Aulas</h2>
              <span>{myClasses.upcoming.length}</span>
            </div>
            <div className="dash-panel" style={{ marginBottom: 24 }}>
              <div className="dash-panel-body">
                {myClasses.upcoming.map((c) => (
                  <div className="schedule-item" key={c.id}>
                    <span className="schedule-dot" />
                    <div className="schedule-body">
                      <p>{c.name}</p>
                      <span>{c.date} · {c.time} · {c.trainer} · {c.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-head">
              <h2>Aulas Passadas</h2>
              <span>{myClasses.past.length}</span>
            </div>
            <div className="dash-panel">
              <div className="dash-panel-body">
                {myClasses.past.map((c) => (
                  <div className="schedule-item" key={c.id}>
                    <span className="schedule-dot" style={{ background: "var(--text-faint)" }} />
                    <div className="schedule-body">
                      <p>{c.name}</p>
                      <span>{c.date} · {c.time} · {c.trainer} · {c.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
