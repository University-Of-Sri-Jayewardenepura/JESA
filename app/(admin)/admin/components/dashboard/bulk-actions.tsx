"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ApplicationStatus } from "./types";

interface BulkActionsProps {
  selectedCount: number;
  onStatusChange: (status: ApplicationStatus) => Promise<void>;
  onDelete: () => Promise<void>;
  loading?: boolean;
}

export default function BulkActions({
  selectedCount,
  onStatusChange,
  onDelete,
  loading = false,
}: BulkActionsProps) {
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  const handleStatus = async (status: ApplicationStatus) => {
    setUpdating(true);
    try {
      await onStatusChange(status);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete ${selectedCount} selected applications? This cannot be undone.`)) {
      return;
    }
    setDeleting(true);
    try {
      await onDelete();
    } finally {
      setDeleting(false);
    }
  };

  if (selectedCount === 0) return null;

  const isLoading = loading || deleting || updating;

  return (
    <div className="flex flex-wrap items-center gap-3 mb-4 p-4 rounded-2xl border border-slate-700/50 bg-slate-800/40">
      <span className="text-slate-300 text-sm font-medium">
        {selectedCount} selected
      </span>
      <div className="flex-1" />
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleStatus("submitted")}
          disabled={isLoading}
          className="rounded-[8px] border-slate-600 text-slate-300 hover:bg-slate-800"
        >
          Mark Submitted
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleStatus("shortlisted")}
          disabled={isLoading}
          className="rounded-[8px] border-blue-600/50 text-blue-300 hover:bg-blue-900/20"
        >
          Mark Shortlisted
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleStatus("approved")}
          disabled={isLoading}
          className="rounded-[8px] border-emerald-600/50 text-emerald-300 hover:bg-emerald-900/20"
        >
          Mark Approved
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleStatus("rejected")}
          disabled={isLoading}
          className="rounded-[8px] border-amber-600/50 text-amber-300 hover:bg-amber-900/20"
        >
          Mark Rejected
        </Button>
        <Button
          size="sm"
          onClick={handleDelete}
          disabled={isLoading}
          className="rounded-[8px] bg-red-600 hover:bg-red-500 text-white"
        >
          {deleting || updating ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : null}
          Delete
        </Button>
      </div>
    </div>
  );
}
