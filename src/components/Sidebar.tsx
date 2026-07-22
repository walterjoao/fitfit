"use client";

import Link from "next/link";
import type { ReactElement } from "react";

export type Role = "athlete" | "trainer" | "nutritionist" | "gym" | "admin";

type NavItem = {
  key: string;
  label: string;
  href: string;
  icon: ReactElement;
  action?: "open-ai";
};

const icons = {
  dashboard: (
    <>
      <path d="M4 13h6V4H4v9Z" />
      <path d="M4 20h6v-4H4v4Z" />
      <path d="M14 20h6v-9h-6v9Z" />
      <path d="M14 4v4h6V4h-6Z" />
    </>
  ),
  workouts: <path d="M6.5 6.5 3 10l3.5 3.5M17.5 6.5 21 10l-3.5 3.5M14 4l-4 16" />,
  nutrition: <path d="M12 3c-3 2-5 5-5 9a5 5 0 0 0 10 0c0-4-2-7-5-9Z" />,
  progress: <path d="M3 17l6-6 4 4 8-8M21 7v6h-6" />,
  goals: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r=".6" /></>,
  achievements: <><path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4Z" /></>,
  clients: <><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M17 8h4M19 6v4" /></>,
  programs: <><path d="M3 9 12 4l9 5-9 5-9-5Z" /><path d="M3 9v6l9 5 9-5V9" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  analytics: <><path d="M4 19V9M10 19V5M16 19v-7M22 19H2" /></>,
  meal_plans: <path d="M12 3c-3 2-5 5-5 9a5 5 0 0 0 10 0c0-4-2-7-5-9Z" />,
  tracking: <><path d="M4 19V9M10 19V5M16 19v-7" /></>,
  appointments: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  reports: <><path d="M6 3h9l5 5v13H6z" /><path d="M15 3v5h5" /></>,
  members: <><circle cx="9" cy="8" r="3.2" /><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M17 8h4M19 6v4" /></>,
  trainers: <path d="M6.5 6.5 3 10l3.5 3.5M17.5 6.5 21 10l-3.5 3.5M14 4l-4 16" />,
  classes: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  subscriptions: <><rect x="3" y="6" width="18" height="14" rx="2" /><path d="M3 10h18" /></>,
  payments: <path d="M12 3v3M12 18v3M6 8a3 3 0 0 1 3-3h4a3 3 0 1 1 0 6H9a3 3 0 1 0 0 6h6a3 3 0 0 0 3-3" />,
  messages: <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />,
  ai: <><path d="M12 3v3M12 18v3M5 5l2 2M17 17l2 2M3 12h3M18 12h3M5 19l2-2M17 7l2-2" /><circle cx="12" cy="12" r="3.2" /></>,
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.4 1Z" />
    </>
  ),
};

const navByRole: Record<Role, NavItem[]> = {
  athlete: [
    { key: "dashboard", label: "Dashboard", href: "/dashboard/athlete", icon: icons.dashboard },
    { key: "workouts", label: "Os Meus Treinos", href: "/dashboard/athlete/workouts", icon: icons.workouts },
    { key: "nutrition", label: "A Minha Nutrição", href: "/dashboard/athlete/nutrition", icon: icons.nutrition },
    { key: "progress", label: "Progresso", href: "/dashboard/athlete/progress", icon: icons.progress },
    { key: "goals", label: "Objetivos", href: "/dashboard/athlete/goals", icon: icons.goals },
    { key: "achievements", label: "Conquistas", href: "/dashboard/athlete/achievements", icon: icons.achievements },
    { key: "messages", label: "Mensagens", href: "/messages", icon: icons.messages },
    { key: "ai", label: "Assistente IA", href: "#", icon: icons.ai, action: "open-ai" },
    { key: "settings", label: "Definições", href: "/settings", icon: icons.settings },
  ],
  trainer: [
    { key: "dashboard", label: "Dashboard", href: "/dashboard", icon: icons.dashboard },
    { key: "clients", label: "Clientes", href: "/clients", icon: icons.clients },
    { key: "programs", label: "Programas de Treino", href: "/programs", icon: icons.programs },
    { key: "calendar", label: "Calendário", href: "/calendar", icon: icons.calendar },
    { key: "messages", label: "Mensagens", href: "/messages", icon: icons.messages },
    { key: "analytics", label: "Analítica", href: "/analytics", icon: icons.analytics },
    { key: "ai", label: "Assistente IA", href: "#", icon: icons.ai, action: "open-ai" },
    { key: "settings", label: "Definições", href: "/settings", icon: icons.settings },
  ],
  nutritionist: [
    { key: "dashboard", label: "Dashboard", href: "/dashboard/nutritionist", icon: icons.dashboard },
    { key: "clients", label: "Clientes", href: "/dashboard/nutritionist/clients", icon: icons.clients },
    { key: "meal_plans", label: "Planos Alimentares", href: "/dashboard/nutritionist/meal-plans", icon: icons.meal_plans },
    { key: "tracking", label: "Acompanhamento Nutricional", href: "/dashboard/nutritionist/tracking", icon: icons.tracking },
    { key: "appointments", label: "Consultas", href: "/dashboard/nutritionist/appointments", icon: icons.appointments },
    { key: "reports", label: "Relatórios", href: "/dashboard/nutritionist/reports", icon: icons.reports },
    { key: "messages", label: "Mensagens", href: "/messages", icon: icons.messages },
    { key: "ai", label: "Assistente IA", href: "#", icon: icons.ai, action: "open-ai" },
    { key: "settings", label: "Definições", href: "/settings", icon: icons.settings },
  ],
  gym: [
    { key: "dashboard", label: "Dashboard", href: "/dashboard/gym", icon: icons.dashboard },
    { key: "members", label: "Membros", href: "/dashboard/gym/members", icon: icons.members },
    { key: "trainers", label: "Treinadores", href: "/dashboard/gym/trainers", icon: icons.trainers },
    { key: "classes", label: "Aulas", href: "/dashboard/gym/classes", icon: icons.classes },
    { key: "subscriptions", label: "Subscrições", href: "/dashboard/gym/subscriptions", icon: icons.subscriptions },
    { key: "payments", label: "Pagamentos", href: "/dashboard/gym/payments", icon: icons.payments },
    { key: "analytics", label: "Analítica", href: "/dashboard/gym/analytics", icon: icons.analytics },
    { key: "messages", label: "Mensagens", href: "/messages", icon: icons.messages },
    { key: "ai", label: "Assistente IA", href: "#", icon: icons.ai, action: "open-ai" },
    { key: "settings", label: "Definições", href: "/settings", icon: icons.settings },
  ],
  admin: [
    { key: "dashboard", label: "Dashboard", href: "/dashboard/admin", icon: icons.dashboard },
    { key: "clients", label: "Clientes", href: "/clients", icon: icons.clients },
    { key: "members", label: "Membros", href: "/dashboard/gym/members", icon: icons.members },
    { key: "trainers", label: "Treinadores", href: "/dashboard/gym/trainers", icon: icons.trainers },
    { key: "programs", label: "Programas de Treino", href: "/programs", icon: icons.programs },
    { key: "meal_plans", label: "Planos Alimentares", href: "/dashboard/nutritionist/meal-plans", icon: icons.meal_plans },
    { key: "classes", label: "Aulas", href: "/dashboard/gym/classes", icon: icons.classes },
    { key: "subscriptions", label: "Subscrições", href: "/dashboard/gym/subscriptions", icon: icons.subscriptions },
    { key: "payments", label: "Pagamentos", href: "/dashboard/gym/payments", icon: icons.payments },
    { key: "analytics", label: "Analítica", href: "/analytics", icon: icons.analytics },
    { key: "messages", label: "Mensagens", href: "/messages", icon: icons.messages },
    { key: "ai", label: "Assistente IA", href: "#", icon: icons.ai, action: "open-ai" },
    { key: "settings", label: "Definições", href: "/settings", icon: icons.settings },
  ],
};

function openAI(role: Role) {
  window.dispatchEvent(new CustomEvent("fitpro:open-ai", { detail: { role } }));
}

export default function Sidebar({ role, active }: { role: Role; active: string }) {
  const items = navByRole[role];
  const dashboardHref = items[0].href;

  return (
    <nav className="app-sidebar" aria-label="Navegação principal">
      <div className="app-sidebar-top">
        <Link href={dashboardHref} className="sidebar-brand" aria-label="FitPro">
          <span className="sidebar-brand-mark" />
          <span className="sidebar-brand-word">
            Fit<b>Pro</b>
          </span>
        </Link>

        {items.map((item) =>
          item.action === "open-ai" ? (
            <button
              key={item.key}
              className={`sidebar-item ${active === item.key ? "active" : ""}`}
              onClick={() => openAI(role)}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {item.icon}
              </svg>
              <span>{item.label}</span>
            </button>
          ) : (
            <Link
              key={item.key}
              href={item.href}
              className={`sidebar-item ${active === item.key ? "active" : ""}`}
              aria-current={active === item.key ? "page" : undefined}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {item.icon}
              </svg>
              <span>{item.label}</span>
            </Link>
          )
        )}
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
        <Link href="/" className="sidebar-item" title="Sair" aria-label="Sair">
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
