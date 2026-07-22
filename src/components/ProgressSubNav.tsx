"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/dashboard/athlete/progress", label: "Visão Geral" },
  { href: "/dashboard/athlete/progress/charts", label: "Gráficos" },
  { href: "/dashboard/athlete/progress/workouts", label: "Treinos" },
  { href: "/dashboard/athlete/progress/body", label: "Corpo" },
  { href: "/dashboard/athlete/progress/nutrition", label: "Nutrição" },
  { href: "/dashboard/athlete/progress/photos", label: "Fotos" },
  { href: "/dashboard/athlete/achievements", label: "Conquistas" },
  { href: "/dashboard/athlete/progress/history", label: "Histórico" },
];

export default function ProgressSubNav() {
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
