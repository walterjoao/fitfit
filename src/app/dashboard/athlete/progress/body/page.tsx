"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ProgressSubNav from "@/components/ProgressSubNav";
import { useRoleGuard } from "@/lib/session";
import { useLocalList } from "@/lib/progressStore";
import { seedMeasurements, type MeasurementEntry } from "@/lib/progressData";

export default function ProgressBodyPage() {
  const { ready } = useRoleGuard("athlete");
  const list = useLocalList<MeasurementEntry>("fitpro_measurements", seedMeasurements);
  const [entries, setEntries] = useState<MeasurementEntry[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ chest: "", waist: "", arm: "", leg: "" });

  useEffect(() => {
    setEntries(list.getAll());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ready) return null;

  function addEntry() {
    const entry: MeasurementEntry = {
      id: Math.random().toString(36).slice(2),
      date: new Date().toISOString().slice(0, 10),
      chest: Number(form.chest) || 0,
      waist: Number(form.waist) || 0,
      arm: Number(form.arm) || 0,
      leg: Number(form.leg) || 0,
    };
    setEntries(list.add(entry));
    setForm({ chest: "", waist: "", arm: "", leg: "" });
  }

  function remove(id: string) {
    setEntries(list.remove(id));
  }

  function startEdit(e: MeasurementEntry) {
    setEditing(e.id);
    setForm({ chest: String(e.chest), waist: String(e.waist), arm: String(e.arm), leg: String(e.leg) });
  }

  function saveEdit() {
    if (!editing) return;
    setEntries(list.update(editing, { chest: Number(form.chest), waist: Number(form.waist), arm: Number(form.arm), leg: Number(form.leg) }));
    setEditing(null);
    setForm({ chest: "", waist: "", arm: "", leg: "" });
  }

  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  const latest = sorted[0];
  const first = [...entries].sort((a, b) => a.date.localeCompare(b.date))[0];

  return (
    <>
      <Sidebar role="athlete" active="progress" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Corpo</h1>
          <p>Regista e acompanha as tuas medidas corporais ao longo do tempo.</p>
        </div>

        <ProgressSubNav />

        {latest && first && (
          <div className="stat-grid">
            {(["chest", "waist", "arm", "leg"] as const).map((k) => {
              const label = { chest: "Peito", waist: "Cintura", arm: "Braço", leg: "Perna" }[k];
              const delta = latest[k] - first[k];
              return (
                <div className="stat-card" key={k}>
                  <div className="stat-top"><span className="stat-label">{label}</span></div>
                  <div className="stat-value tabular">{latest[k]} cm</div>
                  <div className={`stat-delta ${delta >= 0 ? "up" : "down"}`}>{delta >= 0 ? "▲" : "▼"} {Math.abs(delta).toFixed(1)} cm</div>
                </div>
              );
            })}
          </div>
        )}

        <div className="dash-row">
          <div className="dash-panel" style={{ padding: 24 }}>
            <p className="field-label" style={{ marginBottom: 10 }}>{editing ? "Editar medição" : "Adicionar nova medição"}</p>
            <div className="form-grid" style={{ marginBottom: 14 }}>
              <label className="field"><span className="field-label">Peito (cm)</span><input className="field-input" type="number" value={form.chest} onChange={(e) => setForm((f) => ({ ...f, chest: e.target.value }))} /></label>
              <label className="field"><span className="field-label">Cintura (cm)</span><input className="field-input" type="number" value={form.waist} onChange={(e) => setForm((f) => ({ ...f, waist: e.target.value }))} /></label>
              <label className="field"><span className="field-label">Braço (cm)</span><input className="field-input" type="number" value={form.arm} onChange={(e) => setForm((f) => ({ ...f, arm: e.target.value }))} /></label>
              <label className="field"><span className="field-label">Perna (cm)</span><input className="field-input" type="number" value={form.leg} onChange={(e) => setForm((f) => ({ ...f, leg: e.target.value }))} /></label>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {editing ? (
                <>
                  <button className="auth-submit" style={{ maxWidth: 160 }} onClick={saveEdit}>Guardar Edição</button>
                  <button className="btn btn-ghost" onClick={() => { setEditing(null); setForm({ chest: "", waist: "", arm: "", leg: "" }); }}>Cancelar</button>
                </>
              ) : (
                <button className="auth-submit" style={{ maxWidth: 160 }} onClick={addEntry}>Adicionar Medição</button>
              )}
            </div>
          </div>

          <div className="dash-panel">
            <div className="dash-panel-head"><h2>Histórico</h2><span>{sorted.length}</span></div>
            <div className="dash-panel-body">
              {sorted.map((e) => (
                <div className="tx-row" key={e.id}>
                  <div className="tx-info">
                    <div className="tx-label">{new Date(e.date).toLocaleDateString("pt-PT")}</div>
                    <div className="tx-sub">Peito {e.chest}cm · Cintura {e.waist}cm · Braço {e.arm}cm · Perna {e.leg}cm</div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => startEdit(e)}>Editar</button>
                    <button className="icon-action" title="Remover" onClick={() => remove(e.id)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
