"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ComingSoon from "@/components/ComingSoon";

export default function AnalyticsPage() {
  return (
    <>
      <Sidebar role="trainer" active="analytics" />
      <Header />
      <ComingSoon title="Analítica" description="Crescimento de clientes, receita e envolvimento ao longo do tempo." />
    </>
  );
}
