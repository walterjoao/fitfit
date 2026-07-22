"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ComingSoon from "@/components/ComingSoon";

export default function SettingsPage() {
  return (
    <>
      <Sidebar role="trainer" active="settings" />
      <Header />
      <ComingSoon title="Definições" description="Preferências da conta, notificações e faturação." />
    </>
  );
}
