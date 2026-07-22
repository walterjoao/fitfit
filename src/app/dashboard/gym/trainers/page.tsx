"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ComingSoon from "@/components/ComingSoon";

export default function GymTrainersPage() {
  return (
    <>
      <Sidebar role="gym" active="trainers" />
      <Header />
      <ComingSoon title="Treinadores" description="Gere a equipa de personal trainers e nutricionistas do ginásio." />
    </>
  );
}
