"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ComingSoon from "@/components/ComingSoon";

export default function AthleteWorkoutsPage() {
  return (
    <>
      <Sidebar role="athlete" active="workouts" />
      <Header />
      <ComingSoon title="Os Meus Treinos" description="O teu plano de treino atual e o histórico de sessões concluídas." />
    </>
  );
}
