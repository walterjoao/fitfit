"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ComingSoon from "@/components/ComingSoon";

export default function GymAnalyticsPage() {
  return (
    <>
      <Sidebar role="gym" active="analytics" />
      <Header />
      <ComingSoon title="Analítica" description="Crescimento de membros, retenção e receita do ginásio." icon="📊" backHref="/dashboard/gym" />
    </>
  );
}
