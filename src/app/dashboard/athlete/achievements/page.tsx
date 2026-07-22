"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ComingSoon from "@/components/ComingSoon";

export default function AthleteAchievementsPage() {
  return (
    <>
      <Sidebar role="athlete" active="achievements" />
      <Header />
      <ComingSoon title="Conquistas" description="Streaks, badges e recordes pessoais." />
    </>
  );
}
