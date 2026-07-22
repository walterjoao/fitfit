"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/dashboard/athlete/workouts", label: "Os Meus Treinos" },
  { href: "/dashboard/athlete/classes", label: "Aulas" },
  { href: "/dashboard/athlete/book", label: "Marcar Sessões" },
];

export default function WorkoutsSubNav() {
  const pathname = usePathname();
  return (
    <nav className="subnav">
      {tabs.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className={`subnav-btn ${pathname === t.href || pathname.startsWith(t.href + "/") ? "active" : ""}`}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
