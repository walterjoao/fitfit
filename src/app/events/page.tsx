"use client";

import { useMemo, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { evtArt, evtLabel, events } from "@/lib/data";

export default function EventsPage() {
  const [evtType, setEvtType] = useState<"all" | "run" | "class" | "workshop" | "competition">("all");
  const [evtWhen, setEvtWhen] = useState<"all" | "week" | "month">("all");
  const filteredEvents = useMemo(
    () =>
      events.filter(
        (e) => (evtType === "all" || e.t === evtType) && (evtWhen === "all" || e.w === evtWhen)
      ),
    [evtType, evtWhen]
  );

  return (
    <>
      <Sidebar active="events" />
      <Header />
      <div className="shell">
        <section className="panel active">
          <div className="page-head" style={{ paddingTop: 22 }}>
            <h1>Eventos</h1>
            <p>Corridas, aulas e desafios da comunidade perto de ti.</p>
          </div>

          <div className="featured">
            <div className="featured-art"><span className="featured-badge">Em destaque</span></div>
            <div className="featured-body">
              <span className="featured-type">Competição</span>
              <h3>HYROX Luanda 2026</h3>
              <div className="featured-meta">
                <span><svg width="13" height="13" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>15 Ago · 07:00</span>
                <span><svg width="13" height="13" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>Talatona, Luanda</span>
                <span><svg width="13" height="13" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M17 8h4M19 6v4" /></svg>240 participantes</span>
              </div>
              <div className="featured-actions">
                <button className="btn btn-primary">Participar</button>
                <button className="btn btn-ghost">Ver detalhes</button>
              </div>
            </div>
          </div>

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

          <div className="grid">
            {filteredEvents.map((e) => (
              <div className="event-card" key={e.n}>
                <div className="event-art" style={{ background: evtArt[e.t] }}>
                  <span className="event-type-tag">{evtLabel[e.t]}</span>
                </div>
                <div className="event-body">
                  <div className="event-title">{e.n}</div>
                  <div className="event-meta">
                    <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>{e.when}</span>
                    <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>{e.where}</span>
                  </div>
                  <div className="event-foot">
                    <div className="avatars-stack"><span className="lb-av">{e.ppl}</span></div>
                    <button className="btn btn-primary btn-sm">Participar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
