"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import WorkoutsSubNav from "@/components/WorkoutsSubNav";
import { useRoleGuard } from "@/lib/session";
import { notifyAndEmail } from "@/lib/notifications";
import { availableClasses, myClasses } from "@/lib/workoutsData";

type SortKey = "rating" | "price" | "soon";

export default function ClassesPage() {
  const { session, ready } = useRoleGuard("athlete");
  const [tab, setTab] = useState<"available" | "mine">("available");
  const [joined, setJoined] = useState<string[]>(myClasses.upcoming.map((c) => c.id));
  const [cancelled, setCancelled] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("soon");

  if (!ready) return null;

  function seatState(seats: number, taken: number) {
    const free = seats - taken;
    if (free <= 0) return "full";
    if (free <= 3) return "low";
    return "ok";
  }

  const visibleClasses = availableClasses
    .filter((c) => {
      const q = query.toLowerCase();
      return !q || c.name.toLowerCase().includes(q) || c.trainer.toLowerCase().includes(q) || c.gym.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "price") return parseInt(a.price) - parseInt(b.price);
      return 0;
    });

  function cancelClass(name: string, gym: string) {
    setCancelled((c) => [...c, name]);
    notifyAndEmail(gym, `${session?.name || "O atleta"} cancelou a participação na aula "${name}".`, "bad");
  }

  const upcomingVisible = myClasses.upcoming.filter((c) => !cancelled.includes(c.name));

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

        {tab === "available" && (
          <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
            <div className="search" style={{ maxWidth: 320 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Procurar por nome, treinador ou ginásio…" />
            </div>
            <select className="field-input" style={{ maxWidth: 220 }} value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
              <option value="soon">Ordenar: Em breve</option>
              <option value="rating">Ordenar: Melhor avaliadas</option>
              <option value="price">Ordenar: Mais baratas</option>
            </select>
          </div>
        )}

        {tab === "available" ? (
          <div className="rich-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
            {visibleClasses.length === 0 && (
              <p style={{ fontSize: 12.5, color: "var(--text-faint)" }}>Sem aulas para &ldquo;{query}&rdquo;.</p>
            )}
            {visibleClasses.map((c) => {
              const state = seatState(c.seats, c.seatsTaken);
              const isJoined = joined.includes(c.id);
              return (
                <Link href={`/dashboard/athlete/classes/${c.id}`} key={c.id} className="rich-card" style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="rich-cover" style={{ background: c.cover }}>
                    <span className="rich-badge">{c.difficulty}</span>
                    <span className="rich-cover-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3v18l15-9L5 3Z" /></svg>
                    </span>
                  </div>
                  <div className="rich-body">
                    <div className="rich-title">{c.name}</div>
                    <div className="rich-meta-row">
                      <span>{c.gym}</span>
                    </div>
                    <div className="rich-meta-row">
                      <span>⭐ {c.rating.toFixed(1)} ({c.reviews})</span>
                      <span>⏱ {c.durationMin} min</span>
                    </div>
                    <div className="rich-meta-row" style={{ justifyContent: "space-between" }}>
                      <span className={`class-seats ${state}`}>{c.seatsTaken}/{c.seats} atletas</span>
                      <span className="product-price tabular">{c.price}</span>
                    </div>
                    <div className="rich-actions">
                      <button
                        type="button"
                        className={`btn ${isJoined ? "btn-ghost" : "btn-primary"} btn-sm`}
                        disabled={state === "full" && !isJoined}
                        onClick={(e) => {
                          e.preventDefault();
                          setJoined((j) => (isJoined ? j.filter((x) => x !== c.id) : [...j, c.id]));
                        }}
                      >
                        {isJoined ? "Inscrito ✓" : "Juntar-me"}
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <>
            <div className="section-head">
              <h2>Próximas Aulas</h2>
              <span>{upcomingVisible.length}</span>
            </div>
            <div className="rich-grid" style={{ marginBottom: 30 }}>
              {upcomingVisible.map((c) => {
                const full = availableClasses.find((a) => a.name === c.name);
                return (
                  <div className="rich-card" key={c.id}>
                    <div className="rich-cover" style={{ background: full?.cover || "var(--ink)" }}>
                      <span className={`badge-status ${c.status}`}>{c.status}</span>
                    </div>
                    <div className="rich-body">
                      <div className="rich-title">{c.name}</div>
                      <div className="rich-meta-row">
                        <span>{c.trainer}</span>
                        <span>{c.location}</span>
                      </div>
                      <div className="rich-meta-row">
                        <span>📅 {c.date}</span>
                        <span>🕐 {c.time}</span>
                      </div>
                      <div className="rich-actions">
                        <Link href={`/dashboard/athlete/classes/${c.id}`} className="btn btn-ghost btn-sm">Abrir</Link>
                        <button className="icon-action" title="Cancelar" onClick={() => cancelClass(c.name, c.location)}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="section-head">
              <h2>Aulas Passadas</h2>
              <span>{myClasses.past.length}</span>
            </div>
            <div className="rich-grid">
              {myClasses.past.map((c) => {
                const full = availableClasses.find((a) => a.name === c.name);
                return (
                  <div className="rich-card" key={c.id} style={{ opacity: 0.7 }}>
                    <div className="rich-cover" style={{ background: full?.cover || "var(--ink)" }}>
                      <span className={`badge-status ${c.status}`}>{c.status}</span>
                    </div>
                    <div className="rich-body">
                      <div className="rich-title">{c.name}</div>
                      <div className="rich-meta-row">
                        <span>{c.trainer}</span>
                        <span>{c.location}</span>
                      </div>
                      <div className="rich-meta-row">
                        <span>📅 {c.date}</span>
                        <span>🕐 {c.time}</span>
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
