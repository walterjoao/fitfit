"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ComingSoon from "@/components/ComingSoon";
import { useRoleGuard } from "@/lib/session";

export default function AthleteBookingsPage() {
  const { ready } = useRoleGuard("athlete");
  if (!ready) return null;

  return (
    <>
      <Sidebar role="athlete" active="dashboard" />
      <Header />
      <ComingSoon title="As Minhas Marcações" description="Sessões de PT, aulas de ginásio e consultas de nutrição agendadas." />
    </>
  );
}
