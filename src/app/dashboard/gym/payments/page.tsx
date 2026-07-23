"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ComingSoon from "@/components/ComingSoon";

export default function GymPaymentsPage() {
  return (
    <>
      <Sidebar role="gym" active="payments" />
      <Header />
      <ComingSoon title="Pagamentos" description="Histórico de pagamentos e faturação dos membros." icon="💰" backHref="/dashboard/gym" />
    </>
  );
}
