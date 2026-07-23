"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ComingSoon from "@/components/ComingSoon";

export default function ShopPaymentsPage() {
  return (
    <>
      <Sidebar role="shop" active="payments" />
      <Header />
      <ComingSoon title="Pagamentos" description="Histórico de pagamentos e faturação da tua loja." icon="💰" backHref="/dashboard/shop" />
    </>
  );
}
