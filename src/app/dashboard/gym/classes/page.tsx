"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ComingSoon from "@/components/ComingSoon";

export default function GymClassesPage() {
  return (
    <>
      <Sidebar role="gym" active="classes" />
      <Header />
      <ComingSoon title="Aulas" description="Horários e inscrições nas aulas em grupo do ginásio." icon="🧑‍🤝‍🧑" backHref="/dashboard/gym" />
    </>
  );
}
