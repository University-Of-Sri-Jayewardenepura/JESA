"use client";

import { useState } from "react";
import {
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Square,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Application, ApplicationStatus } from "./types";
import { getAwardLabel } from "@/lib/awards";

interface MobileCardsProps {
  applications: Application[];
  loading: boolean;
  selectedIds: string[];
  onSelect: (id: string) => void;
  onView: (app: Application) => void;
  onDelete: (app: Application) => void;
  onStatusChange?: (id: string, status: ApplicationStatus) => void;
}

const PAGE_SIZE = 10;

export default function MobileCards({
  applications,
  loading,
  selectedIds,
  onSelect,
  onView,
  onDelete,
  onStatusChange,
}: MobileCardsProps) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(applications.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const paginated = applications.slice(start, start + PAGE_SIZE);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-700/50 p-8 text-center text-slate-500 lg:hidden">
        Loading applications...
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-700/50 p-8 text-center text-slate-500 lg:hidden">
        No applications found.
      </div>
    );
  }

  return (
    <div className="lg:hidden space-y-3">
      {paginated.map((app) => (
        <div
          key={app.id}
          className={`rounded-2xl border border-slate-700/50 p-4 ${
            selectedIds.includes(app.id) ? "bg-slate-800/60" : "bg-slate-900/50"
          }`}
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-start gap-3">
              <button
                onClick={() => onSelect(app.id)}
                className="text-slate-400 hover:text-slate-100 mt-1"
              >
                {selectedIds.includes(app.id) ? (
                  <CheckSquare className="w-5 h-5" />
                ) : (
                  <Square className="w-5 h-5" />
                )}
              </button>
              <div>
                <p className="text-slate-100 font-medium">
                  {app.personalInfo?.publicDisplayName || "—"}
                </p>
                <p className="text-slate-500 text-xs">
                  {app.personalInfo?.email}
                </p>
              </div>
            </div>
            <span className="capitalize text-xs text-slate-300 bg-slate-800 px-2 py-0.5 rounded-full">
              {app.applicantType || "—"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            <div>
              <p className="text-slate-500">University</p>
              <p className="text-slate-300">{app.academicInfo?.university || "—"}</p>
            </div>
            <div>
              <p className="text-slate-500">Faculty</p>
              <p className="text-slate-300">{app.academicInfo?.faculty || "—"}</p>
            </div>
            <div>
              <p className="text-slate-500">Submitted</p>
              <p className="text-slate-300">
                {app.submittedAt
                  ? new Date(app.submittedAt).toLocaleDateString()
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Status</p>
              <p className="text-slate-300 capitalize">{app.status || "submitted"}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {app.awardSelection?.selectedAwards?.map((award) => (
              <span
                key={award}
                className="inline-flex items-center rounded-full bg-blue-600/15 px-2 py-0.5 text-xs text-blue-300 border border-blue-600/20"
              >
                {getAwardLabel(award)}
              </span>
            )) || "—"}
          </div>

          <div className="flex items-center justify-between">
            {onStatusChange && (
              <select
                value={app.status || "submitted"}
                onChange={(e) =>
                  onStatusChange(app.id, e.target.value as ApplicationStatus)
                }
                className="h-8 rounded-[8px] border border-slate-600 bg-slate-800/50 px-2 text-xs text-slate-300 outline-none"
              >
                <option value="submitted">Submitted</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onView(app)}
                className="h-8 w-8 p-0 text-slate-400 hover:text-slate-100"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(app)}
                className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}

      <div className="flex items-center justify-between pt-2">
        <p className="text-slate-400 text-xs">
          {start + 1}-{Math.min(start + PAGE_SIZE, applications.length)} of{" "}
          {applications.length}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-[8px] border-slate-600 text-slate-300 hover:bg-slate-800 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-slate-400 text-xs">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-[8px] border-slate-600 text-slate-300 hover:bg-slate-800 disabled:opacity-50"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
