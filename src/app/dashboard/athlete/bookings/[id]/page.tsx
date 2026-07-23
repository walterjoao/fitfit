"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useRoleGuard } from "@/lib/session";
import { getBookingById, updateBookingStatus, addBookingNote, statusMeta, type Booking } from "@/lib/bookings";

export default function AthleteBookingDetailPage() {
  const { session, ready } = useRoleGuard("athlete");
  const params = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | undefined>(undefined);
  const [note, setNote] = useState("");
  const [rescheduling, setRescheduling] = useState(false);

  useEffect(() => {
    setBooking(getBookingById(params.id));
    const onChange = () => setBooking(getBookingById(params.id));
    window.addEventListener("fitpro:bookings", onChange);
    return () => window.removeEventListener("fitpro:bookings", onChange);
  }, [params.id]);

  if (!ready) return null;

  if (!booking) {
    return (
      <>
        <Sidebar role="athlete" active="bookings" />
        <Header />
        <div className="shell">
          <div className="page-head" style={{ paddingTop: 22 }}><h1>Marcação não encontrada</h1></div>
          <Link href="/dashboard/athlete/bookings" className="btn btn-ghost">← Voltar às Marcações</Link>
        </div>
      </>
    );
  }

  const st = statusMeta[booking.status];

  function cancel() {
    if (!booking) return;
    updateBookingStatus(booking.id, "cancelled", session?.name);
  }

  function requestReschedule() {
    if (!booking) return;
    addBookingNote(booking.id, { author: session?.name || "Atleta", text: "Pedido de reagendamento enviado.", time: "agora" });
    updateBookingStatus(booking.id, "pending", session?.name);
    setRescheduling(false);
  }

  function submitNote() {
    if (!booking || !note.trim()) return;
    addBookingNote(booking.id, { author: session?.name || "Atleta", text: note.trim(), time: "agora" });
    setNote("");
  }

  function addToCalendar(kind: "google" | "apple" | "outlook") {
    if (!booking) return;
    const text = encodeURIComponent(booking.title);
    const details = encodeURIComponent(`${booking.description}\nCom ${booking.professionalName}`);
    const location = encodeURIComponent(booking.location);
    if (kind === "google") {
      window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}&location=${location}`, "_blank");
    } else {
      alert(`Ficheiro .ics para ${kind === "apple" ? "Apple Calendar" : "Outlook"} seria descarregado aqui.`);
    }
  }

  return (
    <>
      <Sidebar role="athlete" active="bookings" />
      <Header />
      <div className="shell">
        <Link href="/dashboard/athlete/bookings" className="auth-back" style={{ marginBottom: 14, display: "inline-block" }}>← Voltar às Marcações</Link>

        <div className="dash-panel" style={{ display: "flex", alignItems: "center", gap: 18, padding: 22, marginBottom: 22, flexWrap: "wrap" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={booking.professionalPhoto} alt={booking.professionalName} className="mk-profile-photo" />
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 19, fontWeight: 800 }}>{booking.title}</div>
            <div className="rich-meta-row" style={{ marginTop: 6 }}>
              <span className={`role-status ${st.tone}`}>{st.dot} {st.label}</span>
              <span>{booking.tag}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href="/dashboard/athlete/messages" className="btn btn-ghost btn-sm">Mensagem</Link>
            {(booking.status === "confirmed" || booking.status === "pending") && (
              <>
                <button className="btn btn-ghost btn-sm" onClick={() => setRescheduling((v) => !v)}>Reagendar</button>
                <button className="btn btn-ghost btn-sm" onClick={cancel}>Cancelar</button>
              </>
            )}
          </div>
        </div>

        {rescheduling && (
          <div className="dash-panel" style={{ padding: 18, marginBottom: 22 }}>
            <p style={{ fontWeight: 700, marginBottom: 8, fontSize: 13 }}>Pedir reagendamento</p>
            <p style={{ fontSize: 12, color: "var(--text-faint)", marginBottom: 12 }}>O pedido será enviado a {booking.professionalName} e a marcação fica pendente até nova confirmação.</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-primary btn-sm" onClick={requestReschedule}>Confirmar Pedido</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setRescheduling(false)}>Cancelar</button>
            </div>
          </div>
        )}

        <div className="wk-section">
          <div className="wk-section-title">Detalhes da Marcação</div>
          <div className="wk-desc-grid">
            <div className="wk-desc-card">
              <h4>Serviço</h4>
              <p>{booking.title}</p>
            </div>
            <div className="wk-desc-card">
              <h4>Profissional</h4>
              <p>{booking.professionalName} · {booking.professionalRole}</p>
              <Link href={`/profile/${booking.professionalId}`} className="btn btn-ghost btn-sm" style={{ marginTop: 8 }}>Ver Perfil</Link>
            </div>
            <div className="wk-desc-card">
              <h4>Data e Hora</h4>
              <p>📅 {booking.date}<br />⏰ {booking.time} ({booking.durationMin} min)</p>
            </div>
            <div className="wk-desc-card">
              <h4>Local</h4>
              <p>📍 {booking.location}</p>
            </div>
            <div className="wk-desc-card">
              <h4>Preço</h4>
              <p className="product-price tabular">{booking.price}</p>
            </div>
            <div className="wk-desc-card">
              <h4>Pagamento</h4>
              <p>{booking.paymentStatus === "paid" ? "✅ Pago" : "🕒 Pendente"}</p>
            </div>
          </div>
        </div>

        <div className="wk-section">
          <div className="wk-section-title">Descrição</div>
          <div className="wk-desc-card"><p>{booking.description}</p></div>
        </div>

        <div className="wk-section">
          <div className="wk-section-title">O que precisas</div>
          <div className="wk-benefits">
            {booking.preparation.map((p) => <div className="wk-benefit" key={p}>✅ {p}</div>)}
          </div>
        </div>

        <div className="wk-section">
          <div className="wk-section-title">Participantes</div>
          <div className="mk-card-avatar-row">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={booking.professionalPhoto} alt={booking.professionalName} className="mk-avatar-sm" />
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 600 }}>{booking.professionalName}</div>
              <div style={{ fontSize: 11, color: "var(--text-faint)" }}>{booking.professionalRole}</div>
            </div>
          </div>
          <div className="mk-card-avatar-row" style={{ marginTop: 10 }}>
            <div className="mk-avatar-sm" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "var(--accent-soft)", color: "var(--accent-strong)", fontWeight: 700, fontSize: 11 }}>
              {booking.athleteName.split(" ").map((w) => w[0]).slice(0, 2).join("")}
            </div>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 600 }}>{booking.athleteName}</div>
              <div style={{ fontSize: 11, color: "var(--text-faint)" }}>Atleta</div>
            </div>
          </div>
        </div>

        <div className="wk-section">
          <div className="wk-section-title">Adicionar ao Calendário</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="btn btn-ghost btn-sm" onClick={() => addToCalendar("google")}>Google Calendar</button>
            <button className="btn btn-ghost btn-sm" onClick={() => addToCalendar("apple")}>Apple Calendar</button>
            <button className="btn btn-ghost btn-sm" onClick={() => addToCalendar("outlook")}>Outlook</button>
          </div>
        </div>

        <div className="wk-section">
          <div className="wk-section-title">Notas</div>
          {booking.notes.length === 0 && <p style={{ fontSize: 12.5, color: "var(--text-faint)", marginBottom: 10 }}>Sem notas ainda.</p>}
          {booking.notes.map((n, i) => (
            <div className="mk-review" key={i}>
              <div className="mk-review-head"><span>{n.author}</span><span>{n.time}</span></div>
              <p>{n.text}</p>
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <input className="field-input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Adicionar uma nota…" style={{ flex: 1 }} />
            <button className="btn btn-primary btn-sm" onClick={submitNote}>Adicionar</button>
          </div>
        </div>
      </div>
    </>
  );
}
