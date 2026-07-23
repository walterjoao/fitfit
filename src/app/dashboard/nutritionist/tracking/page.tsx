"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ComingSoon from "@/components/ComingSoon";

export default function TrackingPage() {
  return (
    <>
      <Sidebar role="nutritionist" active="tracking" />
      <Header />
      <ComingSoon title="Acompanhamento Nutricional" description="Acompanha a adesão e o progresso nutricional dos clientes." icon="📈" backHref="/dashboard/nutritionist" />
    </>
  );
}
