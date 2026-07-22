"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ComingSoon from "@/components/ComingSoon";

export default function MessagesPage() {
  return (
    <>
      <Sidebar role="trainer" active="messages" />
      <Header />
      <ComingSoon title="Mensagens" description="Conversas com os teus clientes e a equipa FitPro." />
    </>
  );
}
