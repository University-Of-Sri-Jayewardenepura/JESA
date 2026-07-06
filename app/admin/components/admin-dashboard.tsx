"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { signOut } from "next-auth/react";
import {
  Search,
  Download,
  Trash2,
  Eye,
  FileSpreadsheet,
  FileJson,
  Loader2,
  AlertCircle,
  X,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ExcelJS from "exceljs";

interface Application {
  id: string;
  applicantType?: string;
  personalInfo?: {
    publicDisplayName?: string;
    email?: string;
    whatsappNumber?: string;
    mobileNumber?: string;
    gender?: string;
    nic?: string;
  };
  academicInfo?: {
    university?: string;
    universityRegistrationNumber?: string;
    universityEmail?: string;
    academicYear?: string;
    faculty?: string;
    degree?: string;
    graduationYear?: string;
  };
  awardSelection?: {
    selectedAwards?: string[];
  };
  status?: string;
  submittedAt?: string | null;
  createdAt?: string | null;
}

interface AdminDashboardProps {
  userEmail: string;
  userName?: string | null;
}

export default function AdminDashboard({ userEmail, userName }: AdminDashboardProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "internal" | "external">("all");
  const [awardFilter, setAwardFilter] = useState("all");
  const [selected, setSelected] = useState<Application | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Application | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/applications");
      if (!res.ok) throw new Error("Failed to fetch applications");
      const data = await res.json();
      setApplications(data.applications || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const awardOptions = useMemo(() => {
    const awards = new Set<string>();
    applications.forEach((app) => {
      app.awardSelection?.selectedAwards?.forEach((award) => awards.add(award));
    });
    return Array.from(awards).sort();
  }, [applications]);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const term = search.toLowerCase();
      const matchesSearch =
        !term ||
        app.personalInfo?.publicDisplayName?.toLowerCase().includes(term) ||
        app.personalInfo?.email?.toLowerCase().includes(term) ||
        app.academicInfo?.university?.toLowerCase().includes(term) ||
        app.academicInfo?.universityRegistrationNumber?.toLowerCase().includes(term);

      const matchesType =
        typeFilter === "all" || app.applicantType === typeFilter;

      const matchesAward =
        awardFilter === "all" ||
        app.awardSelection?.selectedAwards?.includes(awardFilter);

      return matchesSearch && matchesType && matchesAward;
    });
  }, [applications, search, typeFilter, awardFilter]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/applications/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setApplications((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(filteredApplications, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `jesa-applications-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Applications");

    worksheet.columns = [
      { header: "ID", key: "id", width: 40 },
      { header: "Type", key: "type", width: 12 },
      { header: "Name", key: "name", width: 28 },
      { header: "NIC", key: "nic", width: 18 },
      { header: "Email", key: "email", width: 32 },
      { header: "WhatsApp", key: "whatsapp", width: 18 },
      { header: "Mobile", key: "mobile", width: 18 },
      { header: "Gender", key: "gender", width: 12 },
      { header: "University", key: "university", width: 42 },
      { header: "Reg No", key: "regNo", width: 22 },
      { header: "University Email", key: "uniEmail", width: 32 },
      { header: "Academic Year", key: "academicYear", width: 20 },
      { header: "Faculty", key: "faculty", width: 18 },
      { header: "Degree", key: "degree", width: 36 },
      { header: "Awards", key: "awards", width: 48 },
      { header: "Submitted At", key: "submittedAt", width: 24 },
    ];

    filteredApplications.forEach((app) => {
      worksheet.addRow({
        id: app.id,
        type: app.applicantType,
        name: app.personalInfo?.publicDisplayName,
        nic: app.personalInfo?.nic,
        email: app.personalInfo?.email,
        whatsapp: app.personalInfo?.whatsappNumber,
        mobile: app.personalInfo?.mobileNumber,
        gender: app.personalInfo?.gender,
        university: app.academicInfo?.university,
        regNo: app.academicInfo?.universityRegistrationNumber,
        uniEmail: app.academicInfo?.universityEmail,
        academicYear: app.academicInfo?.academicYear,
        faculty: app.academicInfo?.faculty,
        degree: app.academicInfo?.degree,
        awards: app.awardSelection?.selectedAwards?.join(", "),
        submittedAt: app.submittedAt,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `jesa-applications-${new Date().toISOString().split("T")[0]}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-6 md:p-8 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="bg-[linear-gradient(92deg,rgba(255,255,255,0.60)_6.46%,#FFF_22.73%,rgba(255,255,255,1.00)_79.27%,rgba(255,255,255,0.50)_95.93%)] bg-clip-text font-title text-[32px] text-transparent leading-[1.125] tracking-tight md:text-[40px]">
                Admin Dashboard
              </h1>
              <p className="mt-2 text-slate-400 text-sm">
                Signed in as {userName || userEmail}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-[8px] border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
            >
              Sign Out
            </Button>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-900/30 border border-red-500/40 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Search name, email, university..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 rounded-[8px]"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <select
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(e.target.value as "all" | "internal" | "external")
                }
                className="flex h-9 w-full min-w-0 rounded-[8px] border border-input bg-transparent px-3 py-1 pl-9 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30"
              >
                <option value="all">All Types</option>
                <option value="internal">Internal</option>
                <option value="external">External</option>
              </select>
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <select
                value={awardFilter}
                onChange={(e) => setAwardFilter(e.target.value)}
                className="flex h-9 w-full min-w-0 rounded-[8px] border border-input bg-transparent px-3 py-1 pl-9 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30"
              >
                <option value="all">All Awards</option>
                {awardOptions.map((award) => (
                  <option key={award} value={award}>
                    {award}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={exportExcel}
                variant="outline"
                className="flex-1 rounded-[8px] border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Excel
              </Button>
              <Button
                onClick={exportJson}
                variant="outline"
                className="flex-1 rounded-[8px] border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
              >
                <FileJson className="w-4 h-4 mr-2" />
                JSON
              </Button>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <p className="text-slate-400 text-sm">
              Showing {filteredApplications.length} of {applications.length} applications
            </p>
            <Button
              onClick={fetchApplications}
              variant="ghost"
              className="text-slate-400 hover:text-slate-100"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Refresh"
              )}
            </Button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-700/50">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/80 text-slate-300">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">University</th>
                  <th className="px-4 py-3 font-medium">Awards</th>
                  <th className="px-4 py-3 font-medium">Submitted</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Loading applications...
                    </td>
                  </tr>
                ) : filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                      No applications found.
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-4 py-3 text-slate-200">
                        {app.personalInfo?.publicDisplayName || "—"}
                        <div className="text-xs text-slate-500">
                          {app.personalInfo?.email}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="capitalize text-slate-300">
                          {app.applicantType || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {app.academicInfo?.university || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {app.awardSelection?.selectedAwards?.map((award) => (
                            <span
                              key={award}
                              className="inline-flex items-center rounded-full bg-blue-600/15 px-2 py-0.5 text-xs text-blue-300 border border-blue-600/20"
                            >
                              {award}
                            </span>
                          )) || "—"}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                        {app.submittedAt
                          ? new Date(app.submittedAt).toLocaleString()
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelected(app)}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-slate-100"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDeleteTarget(app)}
                            className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="rounded-2xl border-slate-700/50 bg-slate-900 text-slate-100 max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-title text-2xl">
              Application Details
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {selected?.id}
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="space-y-6 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem label="Name" value={selected.personalInfo?.publicDisplayName} />
                <DetailItem label="NIC" value={selected.personalInfo?.nic} />
                <DetailItem label="Email" value={selected.personalInfo?.email} />
                <DetailItem label="Gender" value={selected.personalInfo?.gender} />
                <DetailItem label="WhatsApp" value={selected.personalInfo?.whatsappNumber} />
                <DetailItem label="Mobile" value={selected.personalInfo?.mobileNumber} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
                <DetailItem label="University" value={selected.academicInfo?.university} />
                <DetailItem label="Registration No" value={selected.academicInfo?.universityRegistrationNumber} />
                <DetailItem label="University Email" value={selected.academicInfo?.universityEmail} />
                <DetailItem label="Academic Year" value={selected.academicInfo?.academicYear} />
                <DetailItem label="Faculty" value={selected.academicInfo?.faculty} />
                <DetailItem label="Degree" value={selected.academicInfo?.degree} />
                <DetailItem label="Graduation Year" value={selected.academicInfo?.graduationYear} />
              </div>

              <div className="pt-4 border-t border-slate-700/50">
                <p className="text-slate-400 mb-2">Selected Awards</p>
                <div className="flex flex-wrap gap-2">
                  {selected.awardSelection?.selectedAwards?.map((award) => (
                    <span
                      key={award}
                      className="inline-flex items-center rounded-full bg-blue-600/15 px-3 py-1 text-xs text-blue-300 border border-blue-600/20"
                    >
                      {award}
                    </span>
                  )) || "—"}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700/50">
                <p className="text-slate-400 mb-1">Submitted At</p>
                <p className="text-slate-200">
                  {selected.submittedAt
                    ? new Date(selected.submittedAt).toLocaleString()
                    : "—"}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={() => setSelected(null)}
              className="rounded-[8px]"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="rounded-2xl border-red-500/30 bg-slate-900 text-slate-100">
          <DialogHeader>
            <DialogTitle className="font-title text-2xl text-red-200">
              Delete Application
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Are you sure you want to delete the application from{" "}
              <strong className="text-slate-200">
                {deleteTarget?.personalInfo?.publicDisplayName}
              </strong>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
              className="rounded-[8px] border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-[8px] bg-red-600 hover:bg-red-500"
            >
              {deleting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-slate-400 mb-0.5">{label}</p>
      <p className="text-slate-200">{value || "—"}</p>
    </div>
  );
}
