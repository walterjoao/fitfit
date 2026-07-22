"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/dashboard/athlete/nutrition", label: "Dashboard" },
  { href: "/dashboard/athlete/nutrition/plan", label: "Plano Alimentar" },
  { href: "/dashboard/athlete/nutrition/meals", label: "Refeições" },
  { href: "/dashboard/athlete/nutrition/log", label: "Registar Refeição" },
  { href: "/dashboard/athlete/nutrition/goals", label: "Metas Nutricionais" },
  { href: "/dashboard/athlete/nutrition/progress", label: "Progresso" },
  { href: "/dashboard/athlete/nutrition/nutritionist", label: "Nutricionista" },
];

export default function NutritionSubNav() {
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
