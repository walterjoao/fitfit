"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/dashboard/athlete/goals", label: "Visão Geral" },
  { href: "/dashboard/athlete/goals/active", label: "Objetivos Ativos" },
  { href: "/dashboard/athlete/goals/new", label: "Criar Objetivo" },
  { href: "/dashboard/athlete/goals/history", label: "Histórico" },
  { href: "/dashboard/athlete/goals/achievements", label: "Conquistas" },
];

export default function GoalsSubNav() {
  const pathname = usePathname();
  return (
    <nav className="subnav" style={{ flexWrap: "wrap" }}>
      {tabs.map((t) => (
        <Link key={t.href} href={t.href} className={`subnav-btn ${pathname === t.href ? "active" : ""}`}>
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
