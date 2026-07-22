"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSession, roleDashboardPath } from "@/lib/session";

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
  const [openMenu, setOpenMenu] = useState<"notif" | "create" | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const session = useSession();

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenMenu(null);
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
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
              <span className="dot" />
            </button>
            <div className={`menu notif-panel ${openMenu === "notif" ? "open" : ""}`}>
              <div className="notif-head">Notificações</div>
              <div className="notif-item">
                <span className="notif-dot" style={{ background: "var(--good)" }} />
                <div className="notif-body">
                  <p><b>Rui Ferreira</b> completou o teu plano de treino desta semana.</p>
                  <span>há 12 min</span>
                </div>
              </div>
              <div className="notif-item">
                <span className="notif-dot" style={{ background: "var(--accent)" }} />
                <div className="notif-body">
                  <p>Subiste para <b>#8</b> no leaderboard de Consistência.</p>
                  <span>há 2 h</span>
                </div>
              </div>
              <div className="notif-item">
                <span className="notif-dot" style={{ background: "var(--bad)" }} />
                <div className="notif-body">
                  <p>Pagamento de <b>Inês Gonçalves</b> falhou — ação necessária.</p>
                  <span>ontem</span>
                </div>
              </div>
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
              <button className="menu-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 6.5 3 10l3.5 3.5M17.5 6.5 21 10l-3.5 3.5M14 4l-4 16" /></svg>
                Criar treino
              </button>
              <button className="menu-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3c-3 2-5 5-5 9a5 5 0 0 0 10 0c0-4-2-7-5-9Z" /></svg>
                Criar plano alimentar
              </button>
              <button className="menu-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>
                Criar evento
              </button>
              <div className="menu-divider" />
              <button className="menu-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M17 8h4M19 6v4" /></svg>
                Adicionar cliente
              </button>
              <button className="menu-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9 12 4l9 5-9 5-9-5Z" /><path d="M3 9v6l9 5 9-5V9" /></svg>
                Adicionar produto
              </button>
            </div>
          </div>

          <Link
            href={session ? roleDashboardPath[session.role] || "/dashboard" : "/"}
            className="avatar"
            title={session ? `${session.name} · ${roleLabel[session.role] || session.role}` : "Iniciar sessão"}
          >
            {session ? initials(session.name) : "?"}
          </Link>
        </div>
      </div>
    </header>
  );
}
