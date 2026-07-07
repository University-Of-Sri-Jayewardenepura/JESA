"use client";

import { useMemo } from "react";
import { Award, Layers } from "lucide-react";
import type { Application } from "./types";
import {
  ALL_AWARD_IDS,
  getAwardLabel,
  isBesaAward,
} from "@/lib/awards";

interface AwardsBreakdownProps {
  applications: Application[];
}

export default function AwardsBreakdown({ applications }: AwardsBreakdownProps) {
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    ALL_AWARD_IDS.forEach((id) => map.set(id, 0));

    applications.forEach((app) => {
      app.awardSelection?.selectedAwards?.forEach((award) => {
        map.set(award, (map.get(award) || 0) + 1);
      });
    });

    return Array.from(map.entries())
      .filter(([, count]) => count > 0)
      .sort((a, b) => b[1] - a[1]);
  }, [applications]);

  const jesaCounts = counts.filter(([id]) => !isBesaAward(id));
  const besaCounts = counts.filter(([id]) => isBesaAward(id));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <Award className="w-5 h-5 text-emerald-400" />
          <h3 className="font-title text-lg text-slate-100">JESA Awards</h3>
        </div>
        {jesaCounts.length === 0 ? (
          <p className="text-slate-500 text-sm">No JESA award applications yet.</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {jesaCounts.map(([id, count]) => (
              <div
                key={id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40"
              >
                <span className="text-slate-300 text-sm">{getAwardLabel(id)}</span>
                <span className="text-emerald-300 font-bold">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <Layers className="w-5 h-5 text-purple-400" />
          <h3 className="font-title text-lg text-slate-100">BESA Awards</h3>
        </div>
        {besaCounts.length === 0 ? (
          <p className="text-slate-500 text-sm">No BESA award applications yet.</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {besaCounts.map(([id, count]) => (
              <div
                key={id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40"
              >
                <span className="text-slate-300 text-sm">{getAwardLabel(id)}</span>
                <span className="text-purple-300 font-bold">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
