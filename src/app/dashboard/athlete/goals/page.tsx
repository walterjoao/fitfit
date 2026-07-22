"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ComingSoon from "@/components/ComingSoon";

export default function AthleteGoalsPage() {
  return (
    <>
      <Sidebar role="athlete" active="goals" />
      <Header />
      <ComingSoon title="Objetivos" description="Define e acompanha os teus objetivos de fitness." />
    </>
  );
}
