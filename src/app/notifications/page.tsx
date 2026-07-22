"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import type { Role } from "@/components/Sidebar";
import { useSession } from "@/lib/session";
import { getNotifications, markRead, removeNotification, type Notification, type NotifCategory } from "@/lib/notifications";

const filters: { key: NotifCategory | "all"; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "training", label: "Treino" },
  { key: "booking", label: "Marcações" },
  { key: "events", label: "Eventos" },
  { key: "messages", label: "Mensagens" },
  { key: "payments", label: "Pagamentos" },
];

export default function NotificationsPage() {
  const session = useSession();
  const [list, setList] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<NotifCategory | "all">("all");

  useEffect(() => {
    function refresh() {
      setList(getNotifications());
    }
    refresh();
    window.addEventListener("fitpro:notifications", refresh);
    return () => window.removeEventListener("fitpro:notifications", refresh);
  }, []);

  if (session === undefined) return null;
  if (!session) {
    if (typeof window !== "undefined") window.location.href = "/";
    return null;
  }

  const visible = filter === "all" ? list : list.filter((n) => n.category === filter);

  return (
    <>
      <Sidebar role={session.role as Role} active="" />
      <Header />
      <div className="shell">
        <div className="page-head" style={{ paddingTop: 22 }}>
          <h1>Notificações</h1>
          <p>Tudo o que aconteceu na tua conta FitPro.</p>
        </div>

        <div className="pill-row">
          {filters.map((f) => (
            <button key={f.key} className={`pill ${filter === f.key ? "active" : ""}`} onClick={() => setFilter(f.key)}>
              {f.label}
            </button>
          ))}
        </div>

        <div className="dash-panel">
          <div className="dash-panel-body">
            {visible.length === 0 && (
              <p style={{ padding: "24px 20px", fontSize: 12.5, color: "var(--text-faint)" }}>Sem notificações nesta categoria.</p>
            )}
            {visible.map((n) => (
              <div className="tx-row" key={n.id} style={{ opacity: n.read ? 0.6 : 1 }}>
                <span className="schedule-dot" style={{ background: n.tone === "good" ? "var(--good)" : n.tone === "bad" ? "var(--bad)" : "var(--accent)", marginRight: 4 }} />
                <Link href={n.href || "#"} className="tx-info" style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }} onClick={() => markRead(n.id)}>
                  <div className="tx-label">{n.message}</div>
                  <div className="tx-sub">{n.time} · {filters.find((f) => f.key === n.category)?.label}</div>
                </Link>
                <div style={{ display: "flex", gap: 6 }}>
                  {!n.read && (
                    <button className="btn btn-ghost btn-sm" onClick={() => markRead(n.id)}>Marcar como lida</button>
                  )}
                  <button className="icon-action" title="Remover" onClick={() => removeNotification(n.id)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
