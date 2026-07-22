"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useRoleGuard } from "@/lib/session";
import { notifyAndEmail } from "@/lib/notifications";
import { availableClasses } from "@/lib/workoutsData";

const attendees = ["Tiago Kiala", "Beatriz Chiapa", "Ricardo Bumba", "André Katumba", "Marta Neto"];

function initials(n: string) {
  return n.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function ClassDetailPage() {
  const { session, ready } = useRoleGuard("athlete");
  const params = useParams<{ id: string }>();
  const fitClass = useMemo(() => availableClasses.find((c) => c.id === params.id), [params.id]);
  const [joined, setJoined] = useState(false);

  if (!ready) return null;
  if (!fitClass) {
    return (
      <>
        <Sidebar role="athlete" active="workouts" />
        <Header />
        <div className="shell">
          <div className="page-head" style={{ paddingTop: 22 }}><h1>Aula não encontrada</h1></div>
        </div>
      </>
    );
  }

  function toggleJoin() {
    setJoined((j) => !j);
    if (joined) {
      notifyAndEmail(fitClass!.gym, `${session?.name || "O atleta"} cancelou a participação na aula "${fitClass!.name}".`, "bad");
    } else {
      notifyAndEmail(fitClass!.gym, `${session?.name || "O atleta"} inscreveu-se na aula "${fitClass!.name}".`, "good");
    }
  }

  return (
    <>
      <Sidebar role="athlete" active="workouts" />
      <Header />
      <div className="shell">
        <div className="featured" style={{ marginBottom: 24 }}>
          <div className="featured-art" style={{ background: fitClass.cover }}>
            <span className="featured-badge">{fitClass.difficulty}</span>
          </div>
          <div className="featured-body">
            <span className="featured-type">{fitClass.gym}</span>
            <h3>{fitClass.name}</h3>
            <div className="featured-meta">
              <span>⭐ {fitClass.rating.toFixed(1)} ({fitClass.reviews} avaliações)</span>
              <span>⏱ {fitClass.durationMin} min</span>
              <span>📍 {fitClass.location}</span>
            </div>
            <div className="featured-meta">
              <span>📅 {fitClass.date} · {fitClass.time}</span>
              <span>{fitClass.seatsTaken}/{fitClass.seats} atletas inscritos</span>
              <span className="product-price tabular">{fitClass.price}</span>
            </div>
            <div className="featured-actions">
              <button className={`btn ${joined ? "btn-ghost" : "btn-primary"}`} onClick={toggleJoin}>
                {joined ? "Cancelar Inscrição" : "Marcar Aula"}
              </button>
              <button className="btn btn-ghost">Contactar Treinador</button>
            </div>
          </div>
        </div>

        <div className="dash-row">
          <div className="dash-panel">
            <div className="dash-panel-head"><h2>Sobre esta aula</h2></div>
            <div className="dash-panel-body" style={{ padding: "16px 20px" }}>
              <p style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.6 }}>{fitClass.description}</p>
              <div className="rich-meta-row" style={{ marginTop: 14 }}>
                <span>Treinador: {fitClass.trainer}</span>
              </div>
            </div>
          </div>

          <div className="dash-panel">
            <div className="dash-panel-head">
              <h2>Participantes</h2>
              <span>{fitClass.seatsTaken}</span>
            </div>
            <div className="dash-panel-body">
              {attendees.slice(0, fitClass.seatsTaken > 5 ? 5 : fitClass.seatsTaken).map((a) => (
                <div className="client-row" key={a} style={{ gridTemplateColumns: "auto 1fr" }}>
                  <span className="lb-av">{initials(a)}</span>
                  <div className="client-info"><span className="client-name">{a}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
