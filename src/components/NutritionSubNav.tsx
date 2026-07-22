"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/dashboard/athlete/nutrition", label: "Overview" },
  { href: "/dashboard/athlete/nutrition/meals", label: "As Minhas Refeições" },
  { href: "/dashboard/athlete/nutrition/plan", label: "Planos Alimentares" },
  { href: "/dashboard/athlete/nutrition/shared", label: "Refeições Partilhadas" },
  { href: "/dashboard/athlete/nutrition/goals", label: "Metas Nutricionais" },
  { href: "/dashboard/athlete/nutrition/progress", label: "Progresso" },
  { href: "/dashboard/athlete/nutrition/nutritionist", label: "Nutricionista" },
];

export default function NutritionSubNav() {
  const pathname = usePathname();
  return (
    <nav className="subnav" style={{ flexWrap: "wrap" }}>
      {tabs.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className={`subnav-btn ${pathname === t.href || (t.href !== "/dashboard/athlete/nutrition" && pathname?.startsWith(t.href)) ? "active" : ""}`}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
