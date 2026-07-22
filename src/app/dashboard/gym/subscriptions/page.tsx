"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ComingSoon from "@/components/ComingSoon";

export default function GymSubscriptionsPage() {
  return (
    <>
      <Sidebar role="gym" active="subscriptions" />
      <Header />
      <ComingSoon title="Subscrições" description="Planos de subscrição, renovações e performance por plano." />
    </>
  );
}
