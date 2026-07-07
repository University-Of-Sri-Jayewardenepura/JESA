"use client";

import { useMemo } from "react";
import {
  Users,
  GraduationCap,
  Building2,
  Award,
  Layers,
} from "lucide-react";
import type { Application } from "./types";
import { isBesaAward } from "@/lib/awards";

interface StatsCardsProps {
  applications: Application[];
}

export default function StatsCards({ applications }: StatsCardsProps) {
  const stats = useMemo(() => {
    const total = applications.length;
    const internal = applications.filter((a) => a.applicantType === "internal").length;
    const external = applications.filter((a) => a.applicantType === "external").length;

    const jesaCount = applications.filter((a) =>
      a.awardSelection?.selectedAwards?.some((award) => !isBesaAward(award))
    ).length;

    const besaCount = applications.filter((a) =>
      a.awardSelection?.selectedAwards?.some((award) => isBesaAward(award))
    ).length;

    const universities = new Set(
      applications.map((a) => a.academicInfo?.university).filter(Boolean)
    ).size;

    const faculties = new Set(
      applications.map((a) => a.academicInfo?.faculty).filter(Boolean)
    ).size;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = applications.filter((a) => {
      if (!a.submittedAt) return false;
      const d = new Date(a.submittedAt);
      return d >= today;
    }).length;

    return {
      total,
      internal,
      external,
      jesaCount,
      besaCount,
      universities,
      faculties,
      todayCount,
    };
  }, [applications]);

  const cards = [
    {
      label: "Total Applications",
      value: stats.total,
      icon: Users,
      color: "text-slate-100",
      bg: "bg-slate-800/40",
    },
    {
      label: "Internal",
      value: stats.internal,
      icon: GraduationCap,
      color: "text-blue-300",
      bg: "bg-blue-600/10",
    },
    {
      label: "External",
      value: stats.external,
      icon: Building2,
      color: "text-amber-300",
      bg: "bg-amber-600/10",
    },
    {
      label: "JESA Awards",
      value: stats.jesaCount,
      icon: Award,
      color: "text-emerald-300",
      bg: "bg-emerald-600/10",
    },
    {
      label: "BESA Awards",
      value: stats.besaCount,
      icon: Layers,
      color: "text-purple-300",
      bg: "bg-purple-600/10",
    },
    {
      label: "Today",
      value: stats.todayCount,
      icon: Users,
      color: "text-cyan-300",
      bg: "bg-cyan-600/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`rounded-2xl border border-slate-700/50 ${card.bg} p-4`}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-slate-400 text-xs uppercase tracking-wider">
              {card.label}
            </p>
            <card.icon className="w-4 h-4 text-slate-500" />
          </div>
          <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
        </div>
      ))}
    </div>
  );
}
