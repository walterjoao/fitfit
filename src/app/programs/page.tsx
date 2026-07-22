"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ComingSoon from "@/components/ComingSoon";

export default function ProgramsPage() {
  return (
    <>
      <Sidebar role="trainer" active="programs" />
      <Header />
      <ComingSoon title="Programas de Treino" description="Cria e gere os planos de treino dos teus clientes." />
    </>
  );
}
