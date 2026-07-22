"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ComingSoon from "@/components/ComingSoon";

export default function AthleteNutritionPage() {
  return (
    <>
      <Sidebar role="athlete" active="nutrition" />
      <Header />
      <ComingSoon title="A Minha Nutrição" description="As tuas refeições, calorias e metas nutricionais diárias." />
    </>
  );
}
