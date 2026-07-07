"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getAwardLabel } from "@/lib/awards";
import type { Application } from "./types";

interface DetailDialogProps {
  application: Application | null;
  onClose: () => void;
}

export default function DetailDialog({ application, onClose }: DetailDialogProps) {
  if (!application) return null;

  return (
    <Dialog open={!!application} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl border-slate-700/50 bg-slate-900 text-slate-100 max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-title text-2xl">
            Application Details
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {application.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 text-sm">
          <Section title="Personal Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem label="Name" value={application.personalInfo?.publicDisplayName} />
              <DetailItem label="NIC" value={application.personalInfo?.nic} />
              <DetailItem label="Email" value={application.personalInfo?.email} />
              <DetailItem label="Gender" value={application.personalInfo?.gender} />
              <DetailItem label="WhatsApp" value={application.personalInfo?.whatsappNumber} />
              <DetailItem label="Mobile" value={application.personalInfo?.mobileNumber} />
            </div>
          </Section>

          <Section title="Academic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem label="University" value={application.academicInfo?.university} />
              <DetailItem label="Registration No" value={application.academicInfo?.universityRegistrationNumber} />
              <DetailItem label="University Email" value={application.academicInfo?.universityEmail} />
              <DetailItem label="Academic Year" value={application.academicInfo?.academicYear} />
              <DetailItem label="Faculty" value={application.academicInfo?.faculty} />
              <DetailItem label="Degree" value={application.academicInfo?.degree} />
              <DetailItem label="Graduation Year" value={application.academicInfo?.graduationYear} />
            </div>
          </Section>

          <Section title="Award Selection">
            <div className="flex flex-wrap gap-2">
              {application.awardSelection?.selectedAwards?.map((award) => (
                <span
                  key={award}
                  className="inline-flex items-center rounded-full bg-blue-600/15 px-3 py-1 text-xs text-blue-300 border border-blue-600/20"
                >
                  {getAwardLabel(award)}
                </span>
              )) || "—"}
            </div>
          </Section>

          {application.awardSelection?.selectedAwards?.includes("best-innovator") && application.bestInnovatorQuestions && (
            <Section title="Best Innovator Details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem
                  label="Industry"
                  value={
                    application.bestInnovatorQuestions.industry === "Other"
                      ? application.bestInnovatorQuestions.otherIndustry
                      : application.bestInnovatorQuestions.industry
                  }
                />
                <DetailItem
                  label=">75% Completed"
                  value={application.bestInnovatorQuestions.innovationCompletionPercentage ? "Yes" : "No"}
                />
              </div>
            </Section>
          )}

          {application.awardSelection?.selectedAwards?.includes("best-csr") && application.bestCSRQuestions && (
            <Section title="Best CSR Details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem label="Club Advisor" value={application.bestCSRQuestions.clubAdvisorNameTitle} />
                <DetailItem label="Advisor Email" value={application.bestCSRQuestions.clubAdvisorEmail} />
                <DetailItem label="Member Attending" value={application.bestCSRQuestions.memberAttendingName} />
                <DetailItem label="Member WhatsApp" value={application.bestCSRQuestions.memberAttendingWhatsapp} />
                <DetailItem label="Club President" value={application.bestCSRQuestions.clubPresidentName} />
                <DetailItem label="President WhatsApp" value={application.bestCSRQuestions.clubPresidentWhatsapp} />
                <DetailItem label="President Email" value={application.bestCSRQuestions.clubPresidentEmail} />
              </div>
            </Section>
          )}

          <Section title="Submission">
            <DetailItem
              label="Submitted At"
              value={
                application.submittedAt
                  ? new Date(application.submittedAt).toLocaleString()
                  : "—"
              }
            />
            <DetailItem label="Current Status" value={application.status || "submitted"} />
          </Section>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="rounded-[8px]">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="pt-4 border-t border-slate-700/50 first:pt-0 first:border-t-0">
      <p className="text-slate-400 mb-3 font-medium">{title}</p>
      {children}
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-slate-500 text-xs mb-0.5">{label}</p>
      <p className="text-slate-200">{value || "—"}</p>
    </div>
  );
}
