"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useRoleGuard } from "@/lib/session";
import { directory, type DirRole } from "@/lib/directory";

const roleLabel: Record<DirRole, string> = {
  athlete: "Atleta",
  trainer: "Personal Trainer",
  nutritionist: "Nutricionista",
  gym: "Ginásio",
  shop: "Loja",
};

const STATUS_KEY = "fitpro_admin_user_status";

function getStatuses(): Record<string, "active" | "suspended"> {
  try {
    return JSON.parse(localStorage.getItem(STATUS_KEY) || "{}");
  } catch {
    return {};
  }
}
function saveStatuses(v: Record<string, "active" | "suspended">) {
  try {
    localStorage.setItem(STATUS_KEY, JSON.stringify(v));
  } catch {}
}

export default function AdminUsersPage() {
  const { ready } = useRoleGuard("admin");
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<DirRole | "all">("all");
  const [statuses, setStatuses] = useState<Record<string, "active" | "suspended">>({});

  useEffect(() => {
    setStatuses(getStatuses());
  }, []);

  const users = Object.values(directory);
  const visible = useMemo(
    () =>
      users.filter((u) => {
        const matchesQuery = !query || u.name.toLowerCase().includes(query.toLowerCase()) || u.location.toLowerCase().includes(query.toLowerCase());
        const matchesRole = roleFilter === "all" || u.role === roleFilter;
        return matchesQuery && matchesRole;
      }),
    [query, roleFilter, users]
  );

  if (!ready) return null;

  function toggleStatus(id: string) {
    const newStatus: "active" | "suspended" = statuses[id] === "suspended" ? "active" : "suspended";
    const next: Record<string, "active" | "suspended"> = { ...statuses, [id]: newStatus };
    setStatuses(next);
    saveStatuses(next);
  }

  const roleCounts = users.reduce<Record<string, number>>((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <Sidebar role="admin" active="users" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Utilizadores</h1>
          <p>Vê e gere todas as contas da plataforma FitPro.</p>
        </div>

        <div className="stat-grid" style={{ marginBottom: 22 }}>
          <div className="stat-card"><div className="stat-top"><span className="stat-label">Total</span></div><div className="stat-value tabular">{users.length}</div></div>
          {(Object.keys(roleLabel) as DirRole[]).map((r) => (
            <div className="stat-card" key={r}><div className="stat-top"><span className="stat-label">{roleLabel[r]}</span></div><div className="stat-value tabular">{roleCounts[r] || 0}</div></div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          <div className="search" style={{ maxWidth: 300 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Procurar por nome ou localização…" />
          </div>
          <select className="field-input" style={{ maxWidth: 220 }} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as DirRole | "all")}>
            <option value="all">Todas as funções</option>
            {(Object.keys(roleLabel) as DirRole[]).map((r) => <option key={r} value={r}>{roleLabel[r]}</option>)}
          </select>
        </div>

        <div className="dash-panel">
          <div className="dash-panel-head"><h2>Todos os Utilizadores</h2><span>{visible.length}</span></div>
          <div className="dash-panel-body">
            {visible.map((u) => {
              const status = statuses[u.id] || "active";
              return (
                <div className="client-row" key={u.id}>
                  <Link href={`/profile/${u.id}`} style={{ display: "contents" }}>
                    <span className="lb-av">{u.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}</span>
                    <div className="client-info">
                      <span className="client-name">{u.name}</span>
                      <span className="client-plan">{roleLabel[u.role]} · {u.location}</span>
                    </div>
                  </Link>
                  <span className={`badge ${status === "active" ? "on" : "risk"}`}>{status === "active" ? "Ativo" : "Suspenso"}</span>
                  <button className="btn btn-ghost btn-sm" onClick={() => toggleStatus(u.id)}>{status === "active" ? "Suspender" : "Reativar"}</button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
