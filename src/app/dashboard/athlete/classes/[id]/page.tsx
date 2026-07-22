"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useRoleGuard } from "@/lib/session";
import { notifyAndEmail } from "@/lib/notifications";
import { availableClasses } from "@/lib/workoutsData";
import { portraitImages } from "@/lib/images";

const attendees = ["Tiago Kiala", "Beatriz Chiapa", "Ricardo Bumba", "André Katumba", "Marta Neto", "Diana Sacramento", "Nelson Sami"];

function initials(n: string) {
  return n.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function ClassDetailPage() {
  const { session, ready } = useRoleGuard("athlete");
  const params = useParams<{ id: string }>();
  const fitClass = useMemo(() => availableClasses.find((c) => c.id === params.id), [params.id]);
  const [joined, setJoined] = useState(false);
  const [slot, setSlot] = useState<string | null>(null);

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
      notifyAndEmail(fitClass!.gym, `${session?.name || "O atleta"} inscreveu-se na aula "${fitClass!.name}" (${slot || fitClass!.slots[0]}).`, "good");
    }
  }

  const attendeeCount = Math.min(fitClass.seatsTaken, attendees.length);
  const trainerId = fitClass.trainer.toLowerCase().replace(/\s+/g, "-");

  return (
    <>
      <Sidebar role="athlete" active="workouts" />
      <Header />
      <div className="shell">
        <div className="wk-hero" style={{ background: fitClass.cover }}>
          <div className="wk-hero-inner">
            <div className="wk-hero-cat">{fitClass.category} · {fitClass.difficulty}</div>
            <div className="wk-hero-title">{fitClass.name}</div>
            <div className="wk-hero-by">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={fitClass.trainerAvatar} alt={fitClass.trainer} style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover" }} />
              <span>Com <b>{fitClass.trainer}</b> · {fitClass.gym}</span>
            </div>
            <div className="wk-hero-meta">
              <span className="wk-hero-chip">⭐ {fitClass.rating.toFixed(1)} ({fitClass.reviews})</span>
              <span className="wk-hero-chip">⏱ {fitClass.durationMin} min</span>
              <span className="wk-hero-chip">📍 {fitClass.location}</span>
              <span className="wk-hero-chip">{fitClass.seatsTaken}/{fitClass.seats} vagas</span>
              <span className="wk-hero-chip tabular">{fitClass.price}</span>
            </div>
          </div>
        </div>

        <div className="wk-section">
          <div className="wk-section-title">Sobre esta aula</div>
          <div className="wk-desc-grid">
            <div className="wk-desc-card">
              <h4>O que é</h4>
              <p>{fitClass.description}</p>
            </div>
            <div className="wk-desc-card">
              <h4>Para quem é</h4>
              <p>{fitClass.whoFor}</p>
            </div>
            <div className="wk-desc-card">
              <h4>O que vais aprender</h4>
              <p>{fitClass.learn.join(" · ")}</p>
            </div>
          </div>
        </div>

        <div className="wk-section">
          <div className="wk-section-title">Benefícios</div>
          <div className="wk-benefits">
            {fitClass.benefits.map((b) => <div className="wk-benefit" key={b}>{b}</div>)}
          </div>
        </div>

        <div className="wk-section">
          <div className="wk-section-title">Fotos e Ambiente</div>
          <div className="mk-gallery">
            {fitClass.photos.map((p) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p} alt={fitClass.name} key={p} />
            ))}
          </div>
        </div>

        <div className="dash-row">
          <div className="dash-panel">
            <div className="dash-panel-head"><h2>Treinador</h2></div>
            <div className="dash-panel-body" style={{ padding: "16px 20px" }}>
              <div className="wk-trainer-card" style={{ border: "none", padding: 0, boxShadow: "none" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={fitClass.trainerAvatar} alt={fitClass.trainer} className="wk-trainer-cover" style={{ objectFit: "cover" }} />
                <div className="wk-trainer-info">
                  <div className="wk-trainer-name">{fitClass.trainer}</div>
                  <div className="wk-trainer-meta">⭐ {fitClass.rating.toFixed(1)} · {fitClass.category}</div>
                </div>
                <div className="wk-trainer-actions">
                  <Link href={`/profile/${trainerId}`} className="btn btn-ghost btn-sm">Ver Perfil</Link>
                  <Link href="/dashboard/athlete/messages" className="btn btn-ghost btn-sm">Mensagem</Link>
                </div>
              </div>
            </div>
          </div>

          <div className="dash-panel">
            <div className="dash-panel-head"><h2>{fitClass.gym}</h2></div>
            <div className="dash-panel-body" style={{ padding: "16px 20px" }}>
              <div className="rich-meta-row" style={{ marginBottom: 8 }}>
                <span>📍 {fitClass.location}</span>
                <span>⭐ {fitClass.gymRating.toFixed(1)} ({fitClass.gymReviews})</span>
              </div>
              <div className="rich-meta-row">
                {fitClass.facilities.map((f) => <span key={f}>{f}</span>)}
              </div>
            </div>
          </div>
        </div>

        <div className="wk-section">
          <div className="wk-section-title">Horários Disponíveis</div>
          <div className="mk-slot-grid">
            {fitClass.slots.map((s) => (
              <button key={s} className={`slot-btn ${slot === s ? "selected" : ""}`} onClick={() => setSlot(s)}>{s}</button>
            ))}
          </div>
        </div>

        <div className="dash-panel" style={{ padding: 20, marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700 }}>{fitClass.seatsTaken}/{fitClass.seats} atletas inscritos</p>
              <div className="mk-avatar-stack" style={{ marginTop: 8 }}>
                {attendees.slice(0, attendeeCount).slice(0, 6).map((a, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={portraitImages.athlete[i % portraitImages.athlete.length]} alt={a} key={a} title={a} />
                ))}
              </div>
            </div>
            <button className={`btn ${joined ? "btn-ghost" : "btn-primary"}`} onClick={toggleJoin}>
              {joined ? "Cancelar Inscrição" : "Reservar Aula"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
