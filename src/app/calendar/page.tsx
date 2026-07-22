"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useRoleGuard } from "@/lib/session";
import { todaySessions, getAvailability, saveAvailability, getPricing, savePricing, type Availability, type PricingPlan } from "@/lib/trainerBusinessData";

type Tab = "calendar" | "availability" | "pricing";

function initials(n: string) {
  return n.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function CalendarPage() {
  const { ready } = useRoleGuard("trainer");
  const [tab, setTab] = useState<Tab>("calendar");
  const [view, setView] = useState<"day" | "week" | "month">("day");
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [pricing, setPricing] = useState<PricingPlan[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setAvailability(getAvailability());
    setPricing(getPricing());
  }, []);

  if (!ready) return null;

  function flash() {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  function toggleDay(day: string) {
    setAvailability((a) => a.map((d) => (d.day === day ? { ...d, enabled: !d.enabled } : d)));
  }

  return (
    <>
      <Sidebar role="trainer" active="calendar" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Calendário</h1>
          <p>Sessões, aulas, disponibilidade e preços.</p>
        </div>

        <div className="toggle-row">
          <button className={`toggle-btn ${tab === "calendar" ? "active" : ""}`} onClick={() => setTab("calendar")}>Calendário</button>
          <button className={`toggle-btn ${tab === "availability" ? "active" : ""}`} onClick={() => setTab("availability")}>Disponibilidade</button>
          <button className={`toggle-btn ${tab === "pricing" ? "active" : ""}`} onClick={() => setTab("pricing")}>Preços</button>
        </div>

        {tab === "calendar" && (
          <>
            <div className="pill-row">
              {(["day", "week", "month"] as const).map((v) => (
                <button key={v} className={`pill ${view === v ? "active" : ""}`} onClick={() => setView(v)}>{v === "day" ? "Dia" : v === "week" ? "Semana" : "Mês"}</button>
              ))}
            </div>
            <div className="dash-panel">
              <div className="dash-panel-head"><h2>Hoje</h2><span>{todaySessions.length} sessões</span></div>
              <div className="dash-panel-body">
                {todaySessions.map((s) => (
                  <div className="schedule-item" key={s.id}>
                    <span className="lb-av">{initials(s.traineeName)}</span>
                    <div className="schedule-body">
                      <p>{s.traineeName}</p>
                      <span>{s.time} · {s.type}</span>
                    </div>
                    <span className={`badge-status ${s.status === "concluída" ? "concluída" : "confirmada"}`} style={{ marginLeft: "auto", marginRight: 10 }}>{s.status}</span>
                    <button className="btn btn-ghost btn-sm">Ver Detalhes</button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === "availability" && (
          <div className="dash-panel" style={{ padding: 22, maxWidth: 560 }}>
            <div className="settings-section-head"><h2>Disponibilidade Recorrente</h2><p>Define os teus dias e horários de trabalho.</p></div>
            {availability.map((d) => (
              <div className="notif-row" key={d.day}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <label className="switch">
                    <input type="checkbox" checked={d.enabled} onChange={() => toggleDay(d.day)} />
                    <span className="switch-track" />
                  </label>
                  <span className="notif-row-label">{d.day}</span>
                </div>
                {d.enabled && (
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <input className="field-input" style={{ width: 90 }} value={d.from} onChange={(e) => setAvailability((a) => a.map((x) => (x.day === d.day ? { ...x, from: e.target.value } : x)))} />
                    <span style={{ fontSize: 12, color: "var(--text-faint)" }}>até</span>
                    <input className="field-input" style={{ width: 90 }} value={d.to} onChange={(e) => setAvailability((a) => a.map((x) => (x.day === d.day ? { ...x, to: e.target.value } : x)))} />
                  </div>
                )}
              </div>
            ))}
            <div style={{ marginTop: 16, display: "flex", alignItems: "center" }}>
              <button className="btn btn-primary btn-sm" onClick={() => { saveAvailability(availability); flash(); }}>Guardar Disponibilidade</button>
              {saved && <span style={{ fontSize: 12, color: "var(--good)", marginLeft: 10 }}>✓ Guardado</span>}
            </div>
          </div>
        )}

        {tab === "pricing" && (
          <div className="dash-panel" style={{ padding: 22, maxWidth: 560 }}>
            <div className="settings-section-head"><h2>Preços</h2><p>Valores por sessão, online vs. presencial e pacotes.</p></div>
            {pricing.map((p) => (
              <div className="notif-row" key={p.id}>
                <span className="notif-row-label">{p.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input
                    className="field-input tabular"
                    type="number"
                    style={{ width: 110 }}
                    value={p.price}
                    onChange={(e) => setPricing((list) => list.map((x) => (x.id === p.id ? { ...x, price: Number(e.target.value) } : x)))}
                  />
                  <span style={{ fontSize: 11.5, color: "var(--text-faint)" }}>Kz {p.unit}</span>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 16, display: "flex", alignItems: "center" }}>
              <button className="btn btn-primary btn-sm" onClick={() => { savePricing(pricing); flash(); }}>Guardar Preços</button>
              {saved && <span style={{ fontSize: 12, color: "var(--good)", marginLeft: 10 }}>✓ Guardado</span>}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
