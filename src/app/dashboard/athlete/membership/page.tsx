"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ComingSoon from "@/components/ComingSoon";
import { useRoleGuard } from "@/lib/session";

export default function AthleteMembershipPage() {
  const { ready } = useRoleGuard("athlete");
  if (!ready) return null;

  return (
    <>
      <Sidebar role="athlete" active="dashboard" />
      <Header />
      <ComingSoon title="A Minha Subscrição" description="O teu ginásio atual e os planos que tens ativos." icon="🏢" backHref="/dashboard/athlete" />
    </>
  );
}
