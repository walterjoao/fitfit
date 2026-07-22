"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import type { Role } from "@/components/Sidebar";
import { useSession } from "@/lib/session";
import { evtLabel, events } from "@/lib/data";

export default function EventsPage() {
  const session = useSession();
  const [evtType, setEvtType] = useState<"all" | "run" | "class" | "workshop" | "competition">("all");
  const [evtWhen, setEvtWhen] = useState<"all" | "week" | "month">("all");
  const featured = events.find((e) => e.id === "hyrox")!;
  const filteredEvents = useMemo(
    () =>
      events.filter(
        (e) => e.id !== "hyrox" && (evtType === "all" || e.t === evtType) && (evtWhen === "all" || e.w === evtWhen)
      ),
    [evtType, evtWhen]
  );

  if (session === undefined) return null;
  if (!session) {
    if (typeof window !== "undefined") window.location.href = "/";
    return null;
  }

  return (
    <>
      <Sidebar role={session.role as Role} active="" />
      <Header />
      <div className="shell">
        <section className="panel active">
          <div className="page-head" style={{ paddingTop: 22 }}>
            <h1>Eventos</h1>
            <p>Corridas, aulas e desafios da comunidade perto de ti.</p>
          </div>

          <Link href={`/events/${featured.id}`} className="featured" style={{ textDecoration: "none", color: "inherit" }}>
            <div className="featured-art" style={{ background: featured.cover }}><span className="featured-badge">Em destaque</span></div>
            <div className="featured-body">
              <span className="featured-type">{evtLabel[featured.t]}</span>
              <h3>{featured.n}</h3>
              <div className="featured-meta">
                <span><svg width="13" height="13" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>{featured.when}</span>
                <span><svg width="13" height="13" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>{featured.where}</span>
                <span><svg width="13" height="13" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M17 8h4M19 6v4" /></svg>{featured.ppl} participantes</span>
                <span>⭐ {featured.rating.toFixed(1)} ({featured.reviews})</span>
              </div>
              <div className="featured-actions">
                <span className="btn btn-primary">Ver Detalhes</span>
              </div>
            </div>
          </Link>

          <div className="pill-row">
            {(["all", "run", "class", "workshop", "competition"] as const).map((t) => (
              <button key={t} className={`pill ${evtType === t ? "active" : ""}`} onClick={() => setEvtType(t)}>
                {t === "all" ? "Todos os tipos" : evtLabel[t]}
              </button>
            ))}
            <span className="pill-sep" />
            {(["all", "week", "month"] as const).map((w) => (
              <button key={w} className={`pill ${evtWhen === w ? "active" : ""}`} onClick={() => setEvtWhen(w)}>
                {w === "all" ? "Todas as datas" : w === "week" ? "Esta semana" : "Este mês"}
              </button>
            ))}
          </div>

          <div className="rich-grid">
            {filteredEvents.map((e) => (
              <Link href={`/events/${e.id}`} key={e.id} className="rich-card" style={{ textDecoration: "none", color: "inherit" }}>
                <div className="rich-cover" style={{ background: e.cover }}>
                  <span className="rich-badge">{evtLabel[e.t]}</span>
                  <span className="rich-cover-icon">🏆</span>
                </div>
                <div className="rich-body">
                  <div className="rich-title">{e.n}</div>
                  <div className="rich-meta-row"><span>Organizado por {e.organizer}</span></div>
                  <div className="rich-meta-row">
                    <span>📅 {e.when}</span>
                  </div>
                  <div className="rich-meta-row">
                    <span>📍 {e.where}</span>
                  </div>
                  <div className="rich-meta-row" style={{ justifyContent: "space-between" }}>
                    <span>⭐ {e.rating.toFixed(1)} ({e.reviews})</span>
                    <span>{e.ppl} inscritos</span>
                  </div>
                  <div className="rich-actions">
                    <span className="btn btn-primary btn-sm">Ver Detalhes</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
