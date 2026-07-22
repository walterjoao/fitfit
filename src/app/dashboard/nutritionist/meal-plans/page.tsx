"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ComingSoon from "@/components/ComingSoon";

export default function MealPlansPage() {
  return (
    <>
      <Sidebar role="nutritionist" active="meal_plans" />
      <Header />
      <ComingSoon title="Planos Alimentares" description="Cria e gere os planos alimentares dos teus clientes." />
    </>
  );
}
