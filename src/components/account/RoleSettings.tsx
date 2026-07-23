"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import type { Role } from "@/components/Sidebar";
import { useRoleGuard } from "@/lib/session";
import { settingsSections, type RoleKey } from "@/lib/accountData";

function noteKey(role: RoleKey, title: string) {
  return `fitpro_settings_note_${role}_${title}`;
}

function SettingsCard({ role, title, description }: { role: RoleKey; title: string; description: string }) {
  const [editing, setEditing] = useState(false);
  const [note, setNote] = useState(() => {
    try {
      return localStorage.getItem(noteKey(role, title)) || "";
    } catch {
      return "";
    }
  });
  const [saved, setSaved] = useState(false);

  function save() {
    try {
      localStorage.setItem(noteKey(role, title), note);
    } catch {}
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div className="settings-card">
      <h3>{title}</h3>
      <p>{description}</p>
      {editing ? (
        <>
          <input className="field-input" style={{ marginBottom: 8 }} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Adiciona uma nota ou valor…" />
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-primary btn-sm" onClick={save}>Guardar</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>Cancelar</button>
          </div>
        </>
      ) : (
        <>
          {note && <p style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 8 }}>{note}</p>}
          <button className="btn btn-ghost btn-sm" onClick={() => setEditing(true)}>Editar{saved && " ✓"}</button>
        </>
      )}
    </div>
  );
}

export default function RoleSettings({ role, sidebarActive }: { role: RoleKey; sidebarActive: string }) {
  const { ready } = useRoleGuard(role);
  if (!ready) return null;

  return (
    <>
      <Sidebar role={role as Role} active={sidebarActive} />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Definições</h1>
          <p>Gere as definições da tua conta.</p>
        </div>
        <div className="settings-grid">
          {settingsSections[role].map((s) => (
            <SettingsCard key={s.title} role={role} title={s.title} description={s.description} />
          ))}
        </div>
      </div>
    </>
  );
}
