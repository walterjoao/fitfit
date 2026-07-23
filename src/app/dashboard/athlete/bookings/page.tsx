"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useRoleGuard } from "@/lib/session";
import { getBookingsFor, updateBookingStatus, statusMeta, type Booking, type BookingKind, type BookingStatus } from "@/lib/bookings";

type TypeFilter = "all" | BookingKind;
type StatusFilter = "all" | BookingStatus;
type DateFilter = "all" | "today" | "week" | "month";

export default function AthleteBookingsPage() {
  const { session, ready } = useRoleGuard("athlete");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!session?.name) return;
    setBookings(getBookingsFor(session.name));
    const onChange = () => setBookings(getBookingsFor(session.name));
    window.addEventListener("fitpro:bookings", onChange);
    return () => window.removeEventListener("fitpro:bookings", onChange);
  }, [session?.name]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return bookings.filter((b) => {
      const matchesType = typeFilter === "all" || b.kind === typeFilter;
      const matchesStatus = statusFilter === "all" || b.status === statusFilter;
      const matchesQuery = !q || b.professionalName.toLowerCase().includes(q) || b.title.toLowerCase().includes(q);
      return matchesType && matchesStatus && matchesQuery;
    });
  }, [bookings, typeFilter, statusFilter, query]);

  if (!ready) return null;

  const upcoming = bookings.filter((b) => b.status === "confirmed" || b.status === "pending").length;
  const thisMonth = bookings.length;
  const hoursTrained = Math.round(bookings.filter((b) => b.status === "completed").reduce((s, b) => s + b.durationMin, 0) / 60);
  const professionalsFollowed = new Set(bookings.map((b) => b.professionalName)).size;

  function cancel(id: string) {
    updateBookingStatus(id, "cancelled", session?.name);
    setBookings(getBookingsFor(session?.name));
  }

  return (
    <>
      <Sidebar role="athlete" active="bookings" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1>As Minhas Marcações</h1>
            <p>Consulta e gere todas as tuas sessões de PT, aulas, consultas e serviços agendados.</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Link href="/dashboard/athlete/book" className="btn btn-primary">+ Nova Marcação</Link>
            <Link href="/calendar" className="btn btn-ghost">Ver Calendário</Link>
          </div>
        </div>

        <div className="stat-grid" style={{ marginBottom: 22 }}>
          <button className="stat-card" onClick={() => { setStatusFilter("confirmed"); setTypeFilter("all"); }} style={{ textAlign: "left", cursor: "pointer" }}>
            <div className="stat-top"><span className="stat-label">Próximas Marcações</span></div>
            <div className="stat-value tabular">{upcoming}</div>
          </button>
          <button className="stat-card" onClick={() => { setStatusFilter("all"); setDateFilter("month"); }} style={{ textAlign: "left", cursor: "pointer" }}>
            <div className="stat-top"><span className="stat-label">Sessões este mês</span></div>
            <div className="stat-value tabular">{thisMonth}</div>
          </button>
          <button className="stat-card" onClick={() => setStatusFilter("completed")} style={{ textAlign: "left", cursor: "pointer" }}>
            <div className="stat-top"><span className="stat-label">Horas treinadas</span></div>
            <div className="stat-value tabular">{hoursTrained}h</div>
          </button>
          <button className="stat-card" onClick={() => { setStatusFilter("all"); setTypeFilter("all"); }} style={{ textAlign: "left", cursor: "pointer" }}>
            <div className="stat-top"><span className="stat-label">Profissionais seguidos</span></div>
            <div className="stat-value tabular">{professionalsFollowed}</div>
          </button>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
          <div className="search" style={{ maxWidth: 300 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Pesquisar marcações…" />
          </div>
          <select className="field-input" style={{ maxWidth: 180 }} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}>
            <option value="all">Tipo: Todas</option>
            <option value="pt">Sessões PT</option>
            <option value="class">Aulas</option>
            <option value="nutrition">Nutrição</option>
            <option value="gym">Ginásio</option>
            <option value="event">Eventos</option>
          </select>
          <select className="field-input" style={{ maxWidth: 180 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}>
            <option value="all">Estado: Todos</option>
            <option value="confirmed">Confirmada</option>
            <option value="pending">Pendente</option>
            <option value="completed">Concluída</option>
            <option value="cancelled">Cancelada</option>
            <option value="no-show">Falta</option>
          </select>
          <select className="field-input" style={{ maxWidth: 160 }} value={dateFilter} onChange={(e) => setDateFilter(e.target.value as DateFilter)}>
            <option value="all">Data: Todas</option>
            <option value="today">Hoje</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mês</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="dash-panel" style={{ padding: 40, textAlign: "center" }}>
            <p style={{ fontSize: 30, marginBottom: 10 }}>📅</p>
            <p style={{ fontWeight: 700, marginBottom: 4 }}>Sem marcações para mostrar</p>
            <p style={{ fontSize: 12.5, color: "var(--text-faint)", marginBottom: 16 }}>Ajusta os filtros ou cria uma nova marcação.</p>
            <Link href="/dashboard/athlete/book" className="btn btn-primary btn-sm">+ Nova Marcação</Link>
          </div>
        ) : (
          <div className="rich-grid">
            {filtered.map((b) => {
              const st = statusMeta[b.status];
              return (
                <div className="dash-panel" key={b.id} style={{ padding: 0, overflow: "hidden" }}>
                  <Link href={`/dashboard/athlete/bookings/${b.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div style={{ height: 90, background: `url(${b.professionalPhoto}) center/cover`, position: "relative" }}>
                      <span className={`role-status ${st.tone}`} style={{ position: "absolute", top: 10, right: 10 }}>{st.dot} {st.label}</span>
                    </div>
                    <div style={{ padding: 16 }}>
                      <p style={{ fontSize: 14, fontWeight: 700 }}>{b.title}</p>
                      <p style={{ fontSize: 12, color: "var(--text-faint)", marginBottom: 10 }}>{b.tag}</p>
                      <div className="mk-card-avatar-row" style={{ marginBottom: 8 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={b.professionalPhoto} alt={b.professionalName} className="mk-avatar-sm" />
                        <div>
                          <div style={{ fontSize: 12.5, fontWeight: 600 }}>{b.professionalName}</div>
                          <div style={{ fontSize: 11, color: "var(--text-faint)" }}>{b.professionalRole}</div>
                        </div>
                      </div>
                      <p style={{ fontSize: 12, color: "var(--text-dim)" }}>📅 {b.date}</p>
                      <p style={{ fontSize: 12, color: "var(--text-dim)" }}>⏰ {b.time}</p>
                      <p style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 8 }}>📍 {b.location}</p>
                      <p className="product-price tabular" style={{ fontSize: 14 }}>{b.price}</p>
                    </div>
                  </Link>
                  <div style={{ display: "flex", gap: 6, padding: "0 16px 16px", flexWrap: "wrap" }}>
                    <Link href={`/dashboard/athlete/bookings/${b.id}`} className="btn btn-ghost btn-sm">Ver Detalhes</Link>
                    <Link href="/dashboard/athlete/messages" className="btn btn-ghost btn-sm">Mensagem</Link>
                    {(b.status === "confirmed" || b.status === "pending") && (
                      <button className="btn btn-ghost btn-sm" onClick={() => cancel(b.id)}>Cancelar</button>
                    )}
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
