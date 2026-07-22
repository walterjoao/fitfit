"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ComingSoon from "@/components/ComingSoon";

export default function ShopOrdersPage() {
  return (
    <>
      <Sidebar role="shop" active="orders" />
      <Header />
      <ComingSoon title="Encomendas" description="Todas as encomendas recebidas e o seu estado de envio." />
    </>
  );
}
