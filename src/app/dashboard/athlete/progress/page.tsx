"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ComingSoon from "@/components/ComingSoon";

export default function AthleteProgressPage() {
  return (
    <>
      <Sidebar role="athlete" active="progress" />
      <Header />
      <ComingSoon title="Progresso" description="Evolução de peso, medidas corporais e nível de atividade." />
    </>
  );
}
