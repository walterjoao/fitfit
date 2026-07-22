"use client";

import Link from "next/link";
import type { ReactElement } from "react";

export type SidebarItem =
  | "dashboard"
  | "leaderboard"
  | "members"
  | "programs"
  | "shop"
  | "events"
  | "marketplace"
  | "messages"
  | "settings";

const items: { key: SidebarItem; label: string; href: string; icon: ReactElement }[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <>
        <path d="M4 13h6V4H4v9Z" />
        <path d="M4 20h6v-4H4v4Z" />
        <path d="M14 20h6v-9h-6v9Z" />
        <path d="M14 4v4h6V4h-6Z" />
      </>
    ),
  },
  {
    key: "leaderboard",
    label: "Leaderboard",
    href: "/leaderboard",
    icon: (
      <>
        <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4Z" />
        <path d="M7 6H4a1 1 0 0 0-1 1c0 2.5 1.8 4.5 4.2 4.9M17 6h3a1 1 0 0 1 1 1c0 2.5-1.8 4.5-4.2 4.9" />
      </>
    ),
  },
  {
    key: "members",
    label: "Membros",
    href: "/dashboard",
    icon: (
      <>
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M17 8h4M19 6v4" />
      </>
    ),
  },
  {
    key: "programs",
    label: "Programas",
    href: "/dashboard",
    icon: (
      <>
        <path d="M6.5 6.5 3 10l3.5 3.5M17.5 6.5 21 10l-3.5 3.5M14 4l-4 16" />
      </>
    ),
  },
  {
    key: "shop",
    label: "Loja",
    href: "/shop",
    icon: (
      <>
        <path d="M3 9 12 4l9 5-9 5-9-5Z" />
        <path d="M3 9v6l9 5 9-5V9" />
      </>
    ),
  },
  {
    key: "events",
    label: "Eventos",
    href: "/events",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4" />
      </>
    ),
  },
  {
    key: "marketplace",
    label: "Marketplace",
    href: "#",
    icon: (
      <>
        <path d="M4 8h16l-1.5 11a2 2 0 0 1-2 1.7H7.5a2 2 0 0 1-2-1.7L4 8Z" />
        <path d="M8 8V6a4 4 0 1 1 8 0v2" />
      </>
    ),
  },
  {
    key: "messages",
    label: "Mensagens",
    href: "#",
    icon: (
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
    ),
  },
  {
    key: "settings",
    label: "Definições",
    href: "#",
    icon: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.4 1Z" />
      </>
    ),
  },
];

export default function Sidebar({ active }: { active: SidebarItem }) {
  return (
    <nav className="app-sidebar" aria-label="Navegação principal">
      <div className="app-sidebar-top">
        <Link href="/dashboard" className="sidebar-brand" aria-label="FitPro">
          <span className="sidebar-brand-mark" />
          <span className="sidebar-brand-word">
            Fit<b>Pro</b>
          </span>
        </Link>

        {items.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={`sidebar-item ${active === item.key ? "active" : ""}`}
            title={item.label}
            aria-label={item.label}
            aria-current={active === item.key ? "page" : undefined}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              {item.icon}
            </svg>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="app-sidebar-bottom">
        <Link href="#" className="sidebar-item" title="Ajuda" aria-label="Ajuda">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1.3.9-1.3 1.7v.3" />
            <path d="M12 17h.01" />
          </svg>
          <span>Ajuda</span>
        </Link>
        <Link href="#" className="sidebar-item" title="Sair" aria-label="Sair">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="M16 17l5-5-5-5" />
            <path d="M21 12H9" />
          </svg>
          <span>Sair</span>
        </Link>
      </div>
    </nav>
  );
}
