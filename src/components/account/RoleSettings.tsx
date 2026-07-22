"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import type { Role } from "@/components/Sidebar";
import { useRoleGuard } from "@/lib/session";
import { settingsSections, type RoleKey } from "@/lib/accountData";

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
            <div className="settings-card" key={s.title}>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
              <button className="btn btn-ghost btn-sm">Editar</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
