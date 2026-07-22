"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useSession, clearSession } from "@/lib/session";
import { settingsPath, billingPath, financePath } from "@/lib/accountData";
import { getNotifications, markRead, removeNotification, type Notification } from "@/lib/notifications";

const workoutIcon = <path d="M6.5 6.5 3 10l3.5 3.5M17.5 6.5 21 10l-3.5 3.5M14 4l-4 16" />;
const mealIcon = <path d="M12 3c-3 2-5 5-5 9a5 5 0 0 0 10 0c0-4-2-7-5-9Z" />;
const eventIcon = <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>;
const clientIcon = <><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M17 8h4M19 6v4" /></>;
const productIcon = <><path d="M3 9 12 4l9 5-9 5-9-5Z" /><path d="M3 9v6l9 5 9-5V9" /></>;
const goalIcon = <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r=".6" /></>;
const calendarIcon = <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>;

const createMenuByRole: Record<string, { label: string; href: string; icon: ReactNode }[]> = {
  athlete: [
    { label: "Treino Pessoal", href: "/dashboard/athlete/workouts/new", icon: workoutIcon },
    { label: "Objetivo", href: "/dashboard/athlete/goals", icon: goalIcon },
    { label: "Evento", href: "/events", icon: eventIcon },
  ],
  trainer: [
    { label: "Programa de Treino", href: "/programs", icon: workoutIcon },
    { label: "Cliente", href: "/clients", icon: clientIcon },
    { label: "Evento", href: "/events", icon: eventIcon },
    { label: "Disponibilidade", href: "/calendar", icon: calendarIcon },
  ],
  nutritionist: [
    { label: "Cliente", href: "/dashboard/nutritionist/clients", icon: clientIcon },
    { label: "Plano Alimentar", href: "/dashboard/nutritionist/meal-plans", icon: mealIcon },
    { label: "Consulta", href: "/dashboard/nutritionist/appointments", icon: calendarIcon },
  ],
  gym: [
    { label: "Membro", href: "/dashboard/gym/members", icon: clientIcon },
    { label: "Aula", href: "/dashboard/gym/classes", icon: eventIcon },
    { label: "Evento", href: "/events", icon: eventIcon },
    { label: "Plano de Subscrição", href: "/dashboard/gym/subscriptions", icon: productIcon },
  ],
  shop: [
    { label: "Produto", href: "/dashboard/shop/products", icon: productIcon },
    { label: "Promoção", href: "/dashboard/shop/products", icon: productIcon },
    { label: "Evento", href: "/events", icon: eventIcon },
  ],
  admin: [
    { label: "Membro", href: "/dashboard/gym/members", icon: clientIcon },
    { label: "Produto (Loja)", href: "/dashboard/shop/products", icon: productIcon },
    { label: "Evento", href: "/events", icon: eventIcon },
  ],
};

const roleLabel: Record<string, string> = {
  admin: "Admin",
  trainer: "Personal Trainer",
  nutritionist: "Nutricionista",
  gym: "Ginásio",
  athlete: "Atleta",
  shop: "Lojista",
};

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "?";
}

export default function Header() {
  const [openMenu, setOpenMenu] = useState<"notif" | "create" | "profile" | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const session = useSession();
  const [liveNotifications, setLiveNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenMenu(null);
    }
    function onNotif() {
      setLiveNotifications(getNotifications());
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    window.addEventListener("fitpro:notifications", onNotif);
    onNotif();
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("fitpro:notifications", onNotif);
    };
  }, []);

  return (
    <header className="app-header">
      <div className="header-inner" ref={wrapRef}>
        <div className="search-wrap">
          <div className="search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input type="text" placeholder="Procurar treinadores, produtos, eventos…" />
            <kbd>⌘K</kbd>
          </div>
        </div>

        <div className="header-actions">
          <Link href="/events" className="icon-btn" title="Eventos" aria-label="Eventos">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M3 10h18M8 3v4M16 3v4" />
            </svg>
          </Link>

          <Link href="/leaderboard" className="icon-btn" title="Leaderboard" aria-label="Leaderboard">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4Z" />
              <path d="M7 6H4a1 1 0 0 0-1 1c0 2.5 1.8 4.5 4.2 4.9M17 6h3a1 1 0 0 1 1 1c0 2.5-1.8 4.5-4.2 4.9" />
            </svg>
          </Link>

          <div className="create-wrap">
            <button
              className="icon-btn"
              title="Notificações"
              aria-label="Notificações"
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenu((m) => (m === "notif" ? null : "notif"));
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.7 21a2 2 0 0 1-3.4 0" />
              </svg>
              {liveNotifications.some((n) => !n.read) && <span className="dot" />}
            </button>
            <div className={`menu notif-panel ${openMenu === "notif" ? "open" : ""}`}>
              <div className="notif-head">Notificações</div>
              {liveNotifications.slice(0, 5).map((n) => (
                <div className="notif-item" key={n.id} style={{ opacity: n.read ? 0.6 : 1, cursor: "pointer" }}>
                  <span className="notif-dot" style={{ background: n.tone === "good" ? "var(--good)" : n.tone === "bad" ? "var(--bad)" : "var(--accent)" }} />
                  <Link
                    href={n.href || "/notifications"}
                    className="notif-body"
                    style={{ flex: 1, textDecoration: "none", color: "inherit" }}
                    onClick={() => {
                      markRead(n.id);
                      setOpenMenu(null);
                    }}
                  >
                    <p>{n.message}</p>
                    <span>{n.time}</span>
                  </Link>
                  <button
                    className="icon-action"
                    style={{ width: 22, height: 22, border: "none" }}
                    title="Remover"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(n.id);
                    }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
              {liveNotifications.length === 0 && (
                <div className="notif-item"><div className="notif-body"><p style={{ color: "var(--text-faint)" }}>Sem notificações.</p></div></div>
              )}
              <Link href="/notifications" className="menu-item" style={{ justifyContent: "center", fontWeight: 700 }} onClick={() => setOpenMenu(null)}>
                Ver todas
              </Link>
            </div>
          </div>

          <div className="create-wrap">
            <button
              className="btn-create"
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenu((m) => (m === "create" ? null : "create"));
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Criar
            </button>
            <div className={`menu ${openMenu === "create" ? "open" : ""}`}>
              <div className="menu-cap">Novo</div>
              {(createMenuByRole[session?.role || "athlete"] || createMenuByRole.athlete).map((item) => (
                <Link key={item.label} href={item.href} className="menu-item" onClick={() => setOpenMenu(null)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{item.icon}</svg>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="create-wrap">
            <button
              className="avatar"
              title={session ? `${session.name} · ${roleLabel[session.role] || session.role}` : "Iniciar sessão"}
              onClick={(e) => {
                e.stopPropagation();
                if (!session) {
                  window.location.href = "/";
                  return;
                }
                setOpenMenu((m) => (m === "profile" ? null : "profile"));
              }}
            >
              {session ? initials(session.name) : "?"}
            </button>
            {session && (
              <div className={`menu ${openMenu === "profile" ? "open" : ""}`}>
                <div className="menu-cap">{session.name} · {roleLabel[session.role] || session.role}</div>
                <Link href={settingsPath(session.role)} className="menu-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.4 1Z" /></svg>
                  Definições da Conta
                </Link>
                <Link href="/affiliate" className="menu-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M17 8h4M19 6v4" /></svg>
                  Afiliados
                </Link>
                <Link href={billingPath(session.role)} className="menu-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="14" rx="2" /><path d="M3 10h18" /></svg>
                  Faturação
                </Link>
                <Link href={financePath(session.role)} className="menu-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v3M12 18v3M6 8a3 3 0 0 1 3-3h4a3 3 0 1 1 0 6H9a3 3 0 1 0 0 6h6a3 3 0 0 0 3-3" /></svg>
                  Finanças
                </Link>
                <div className="menu-divider" />
                <button className="menu-item" onClick={() => { clearSession(); window.location.href = "/"; }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></svg>
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
