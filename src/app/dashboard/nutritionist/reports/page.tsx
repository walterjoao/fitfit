"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ComingSoon from "@/components/ComingSoon";

export default function ReportsPage() {
  return (
    <>
      <Sidebar role="nutritionist" active="reports" />
      <Header />
      <ComingSoon title="Relatórios" description="Relatórios de progresso e cumprimento de objetivos por cliente." icon="📋" backHref="/dashboard/nutritionist" />
    </>
  );
}
