"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ComingSoon from "@/components/ComingSoon";

export default function AppointmentsPage() {
  return (
    <>
      <Sidebar role="nutritionist" active="appointments" />
      <Header />
      <ComingSoon title="Consultas" description="Marcações e consultas de nutrição agendadas." icon="📅" backHref="/dashboard/nutritionist" />
    </>
  );
}
