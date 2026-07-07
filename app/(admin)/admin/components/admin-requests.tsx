"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Check,
  Loader2,
  ShieldAlert,
  UserCheck,
  UserX,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminRequest {
  uid: string;
  email: string;
  name?: string;
  status: "pending" | "approved" | "rejected";
  requestedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
}

interface AdminRequestsProps {
  userEmail: string;
}

export default function AdminRequests({ userEmail }: AdminRequestsProps) {
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingUid, setProcessingUid] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/requests");
      if (!res.ok) throw new Error("Failed to fetch admin requests");
      const data = await res.json();
      setRequests(data.requests || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleUpdate = async (
    uid: string,
    status: "approved" | "rejected",
    revoke = false
  ) => {
    setProcessingUid(uid);
    try {
      const res = await fetch(`/api/admin/requests/${uid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, revoke }),
      });
      if (!res.ok) throw new Error("Failed to update request");
      await fetchRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setProcessingUid(null);
    }
  };

  const pending = requests.filter((r) => r.status === "pending");
  const approved = requests.filter(
    (r) => r.status === "approved" && r.email !== userEmail
  );

  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-6 md:p-8 backdrop-blur-sm">
      <div className="flex items-center gap-3 mb-6">
        <ShieldAlert className="w-6 h-6 text-amber-400" />
        <div>
          <h2 className="font-title text-2xl text-slate-100">Admin Access</h2>
          <p className="text-slate-400 text-sm">
            Approve or reject team member requests
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-900/30 border border-red-500/40 text-sm text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
          Loading requests...
        </div>
      ) : (
        <>
          <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-400" />
            Pending Requests ({pending.length})
          </h3>

          {pending.length === 0 ? (
            <p className="text-slate-500 text-sm mb-8">
              No pending admin requests.
            </p>
          ) : (
            <div className="space-y-3 mb-8">
              {pending.map((req) => (
                <div
                  key={req.uid}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-2xl border border-slate-700/50 bg-slate-800/40"
                >
                  <div>
                    <p className="text-slate-200 font-medium">
                      {req.name || req.email}
                    </p>
                    <p className="text-slate-500 text-sm">{req.email}</p>
                    {req.requestedAt && (
                      <p className="text-slate-600 text-xs mt-1">
                        Requested{" "}
                        {new Date(req.requestedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleUpdate(req.uid, "approved")}
                      disabled={processingUid === req.uid}
                      className="rounded-[8px] bg-emerald-600 hover:bg-emerald-500 text-white"
                    >
                      {processingUid === req.uid ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-1" />
                      ) : (
                        <Check className="w-4 h-4 mr-1" />
                      )}
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdate(req.uid, "rejected")}
                      disabled={processingUid === req.uid}
                      className="rounded-[8px] border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            Approved Admins ({approved.length})
          </h3>

          {approved.length === 0 ? (
            <p className="text-slate-500 text-sm">
              No other approved admins yet.
            </p>
          ) : (
            <div className="space-y-3">
              {approved.map((req) => (
                <div
                  key={req.uid}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-2xl border border-slate-700/50 bg-slate-800/40"
                >
                  <div>
                    <p className="text-slate-200 font-medium">
                      {req.name || req.email}
                    </p>
                    <p className="text-slate-500 text-sm">{req.email}</p>
                    {req.approvedAt && req.approvedBy && (
                      <p className="text-slate-600 text-xs mt-1">
                        Approved by {req.approvedBy} on{" "}
                        {new Date(req.approvedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdate(req.uid, "rejected", true)}
                    disabled={processingUid === req.uid}
                    className="rounded-[8px] border-red-600/50 text-red-400 hover:bg-red-900/20 hover:text-red-300"
                  >
                    {processingUid === req.uid ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-1" />
                    ) : (
                      <UserX className="w-4 h-4 mr-1" />
                    )}
                    Revoke
                  </Button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
