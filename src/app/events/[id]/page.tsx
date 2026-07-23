"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import type { Role } from "@/components/Sidebar";
import { useSession } from "@/lib/session";
import { notifyAndEmail } from "@/lib/notifications";
import { events, evtLabel } from "@/lib/data";

const notGoing = ["Nelson Sami", "Carla Domingos"];

function initials(n: string) {
  return n.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

const difficultyColor: Record<string, string> = {
  "Fácil": "good",
  "Médio": "gold",
  "Difícil": "bad",
  "Extremo": "bad",
};

export default function EventDetailPage() {
  const session = useSession();
  const params = useParams<{ id: string }>();
  const event = useMemo(() => events.find((e) => e.id === params.id), [params.id]);
  const [going, setGoing] = useState(false);
  const [earned, setEarned] = useState(false);
  const [invited, setInvited] = useState(false);

  if (session === undefined) return null;
  if (!session) {
    if (typeof window !== "undefined") window.location.href = "/";
    return null;
  }
  if (!event) {
    return (
      <>
        <Sidebar role={session.role as Role} active="" />
        <Header />
        <div className="shell"><div className="page-head" style={{ paddingTop: 22 }}><h1>Evento não encontrado</h1></div></div>
      </>
    );
  }

  function toggleGoing() {
    setGoing((g) => !g);
    if (going) {
      notifyAndEmail(event!.organizer, `${session!.name} cancelou a participação em "${event!.n}".`, "bad");
    } else {
      notifyAndEmail(event!.organizer, `${session!.name} vai participar em "${event!.n}".`, "good");
      setEarned(true);
    }
  }

  return (
    <>
      <Sidebar role={session.role as Role} active="" />
      <Header />
      <div className="shell">
        <div className="featured" style={{ marginBottom: 24 }}>
          <div className="featured-art" style={{ background: event.cover }}>
            <span className="featured-badge">{evtLabel[event.t]}</span>
          </div>
          <div className="featured-body">
            <span className="featured-type">Organizado por {event.organizer}</span>
            <h3>{event.n}</h3>
            <div className="featured-meta">
              <span>📅 {event.when}</span>
              <span>📍 {event.where}</span>
              <span>⭐ {event.rating.toFixed(1)} ({event.reviews})</span>
            </div>
            <div className="featured-meta">
              <span className={`badge ${difficultyColor[event.difficulty] === "good" ? "on" : difficultyColor[event.difficulty] === "gold" ? "paused" : "risk"}`}>{event.difficulty}</span>
              <span>⚡ Energia {event.energy}</span>
              <span>{event.ppl} inscritos</span>
            </div>
            <div className="featured-actions">
              <button className={`btn ${going ? "btn-ghost" : "btn-primary"}`} onClick={toggleGoing}>
                {going ? "Cancelar Participação" : "Participar"}
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  navigator.clipboard?.writeText(`${window.location.origin}/events/${event.id}`);
                  setInvited(true);
                  setTimeout(() => setInvited(false), 2000);
                }}
              >
                {invited ? "✓ Link copiado" : "Convidar Amigos"}
              </button>
            </div>
          </div>
        </div>

        {earned && (
          <div className="ai-box" style={{ background: "var(--gold-soft)", marginBottom: 20 }}>
            <div className="ai-icon" style={{ color: "var(--gold-ink)" }}>🏆</div>
            <p style={{ color: "var(--gold-ink)" }}>
              <b>+{event.points} FitPoints</b> ganhos! Conquista desbloqueada: <b>&ldquo;{event.badge}&rdquo;</b>
            </p>
          </div>
        )}

        <div className="dash-row">
          <div className="dash-panel">
            <div className="dash-panel-head"><h2>Sobre o Evento</h2></div>
            <div className="dash-panel-body" style={{ padding: "16px 20px" }}>
              <p style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.6, marginBottom: 14 }}>{event.description}</p>
              <div className="rich-meta-row" style={{ marginBottom: 6 }}><span>⏱ Duração: {event.durationMin > 0 ? `${event.durationMin} min` : "Todo o dia"}</span></div>
              <div className="rich-meta-row" style={{ marginBottom: 6 }}><span>🎒 Equipamento: {event.equipment}</span></div>
              <div className="rich-meta-row" style={{ marginBottom: 6 }}><span>{event.food ? "✓" : "✕"} Comida disponível</span></div>
              <div className="rich-meta-row" style={{ marginBottom: 6 }}><span>{event.water ? "✓" : "✕"} Postos de água</span></div>
              <div className="rich-meta-row"><span>{event.parking ? "✓" : "✕"} Estacionamento</span></div>
            </div>
          </div>

          <div className="dash-panel">
            <div className="dash-panel-head"><h2>Recompensas</h2></div>
            <div className="dash-panel-body" style={{ padding: "16px 20px" }}>
              <div className="rich-meta-row" style={{ marginBottom: 10 }}><span>🎯 <b>+{event.points} FitPoints</b> ao completar</span></div>
              <div className="rich-meta-row" style={{ marginBottom: 10 }}><span>🏅 Badge: <b>{event.badge}</b></span></div>
              <div className="rich-meta-row"><span>📈 Sobes no leaderboard da categoria Comunidade</span></div>
            </div>
          </div>
        </div>

        <div className="dash-row">
          <div className="dash-panel">
            <div className="dash-panel-head">
              <h2>Vão</h2>
              <span>{event.going.length + (going ? 1 : 0)}</span>
            </div>
            <div className="dash-panel-body">
              {going && (
                <div className="client-row" style={{ gridTemplateColumns: "auto 1fr" }}>
                  <span className="lb-av">{initials(session.name)}</span>
                  <div className="client-info"><span className="client-name">{session.name} (tu)</span></div>
                </div>
              )}
              {event.going.map((n) => (
                <div className="client-row" key={n} style={{ gridTemplateColumns: "auto 1fr" }}>
                  <span className="lb-av">{initials(n)}</span>
                  <div className="client-info"><span className="client-name">{n}</span></div>
                </div>
              ))}
            </div>
          </div>

          <div className="dash-panel">
            <div className="dash-panel-head">
              <h2>Não vão</h2>
              <span>{notGoing.length}</span>
            </div>
            <div className="dash-panel-body">
              {notGoing.map((n) => (
                <div className="client-row" key={n} style={{ gridTemplateColumns: "auto 1fr" }}>
                  <span className="lb-av" style={{ opacity: 0.5 }}>{initials(n)}</span>
                  <div className="client-info"><span className="client-name" style={{ color: "var(--text-faint)" }}>{n}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
