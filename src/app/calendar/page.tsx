"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ComingSoon from "@/components/ComingSoon";

export default function CalendarPage() {
  return (
    <>
      <Sidebar role="trainer" active="calendar" />
      <Header />
      <ComingSoon title="Calendário" description="As tuas próximas sessões e marcações com clientes." />
    </>
  );
}
