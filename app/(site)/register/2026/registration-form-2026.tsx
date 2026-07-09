"use client";

import React, { useState, useCallback, createContext, useContext, useRef } from "react";
import { AlertCircle, CheckCircle, Loader2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { createNewApplication } from "./service/application.service";
import {
  SRI_LANKA_PHONE_REGEX,
  SRI_LANKA_NIC_REGEX,
} from "./schemas/applicationSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type ApplicantType = "internal" | "external";

interface PersonalInfo {
  publicDisplayName: string;
  nic?: string;
  gender: string;
  email: string;
  whatsappNumber: string;
  mobileNumber: string;
}

interface AcademicInfo {
  university: string;
  universityRegistrationNumber: string;
  universityEmail: string;
  academicYear: string;
  faculty: string;
  degree: string;
  otherDegree?: string;
  graduationYear?: string;
}

type AwardType =
  | "best-leader"
  | "best-team-player"
  | "best-creative-designer"
  | "best-communicator"
  | "best-innovator"
  | "best-young-entrepreneur"
  | "best-csr"
  | "besa-inter-university"
  | "besa-fhss"
  | "besa-fas"
  | "besa-fmsc"
  | "besa-fms"
  | "besa-fot"
  | "besa-foe"
  | "besa-fahs"
  | "besa-fuab"
  | "besa-fds";

interface AwardSelection {
  selectedAwards: AwardType[];
  hasConditionalAwards: boolean;
}

interface BestInnovatorQuestions {
  industry: string;
  innovationCompletionPercentage: boolean;
  otherIndustry?: string;
}

interface BestCSRQuestions {
  clubAdvisorNameTitle: string;
  clubAdvisorEmail: string;
  memberAttendingName: string;
  memberAttendingWhatsapp: string;
  clubPresidentName: string;
  clubPresidentWhatsapp: string;
  clubPresidentEmail: string;
}

interface Declaration {
  confirmAccuracy: boolean;
  agreeDisqualification: boolean;
  agreePhysicalInterview: boolean;
  permitVerification: boolean;
  consentPublicity: boolean;
}

interface ApplicationFormData {
  applicantType: ApplicantType | null;
  personalInfo: Partial<PersonalInfo>;
  academicInfo: Partial<AcademicInfo>;
  awardSelection: Partial<AwardSelection>;
  bestInnovatorQuestions?: Partial<BestInnovatorQuestions>;
  bestCSRQuestions?: Partial<BestCSRQuestions>;
  declaration: Partial<Declaration>;
}

const JESA_AWARDS: Record<string, string> = {
  "best-leader": "Best Leader",
  "best-team-player": "Best Team Player",
  "best-creative-designer": "Best Creative Designer",
  "best-communicator": "Best Communicator",
  "best-innovator": "Best Innovator",
  "best-young-entrepreneur": "Best Young Entrepreneur",
  "best-csr": "Best CSR",
};

const BESA_AWARDS: Record<string, string> = {
  "besa-inter-university": "BESA – Inter University Award",
  "besa-fhss": "BESA – FHSS (Faculty of Humanities and Social Sciences)",
  "besa-fas": "BESA – FAS (Faculty of Applied Sciences)",
  "besa-fmsc": "BESA – FMSC (Faculty of Management Studies and Commerce)",
  "besa-fms": "BESA – FMS (Faculty of Medical Sciences)",
  "besa-fot": "BESA – FOT (Faculty of Technology)",
  "besa-foe": "BESA – FOE (Faculty of Engineering)",
  "besa-fahs": "BESA – FAHS (Faculty of Allied Health Sciences)",
  "besa-fuab": "BESA – FUAB (Faculty of Urban and Aquatic Bioresources)",
  "besa-fds": "BESA – FDS (Faculty of Dental Sciences)",
};

const FACULTIES = [
  "FHSS",
  "FAS",
  "FMSC",
  "FMS",
  "FOT",
  "FOE",
  "FAHS",
  "FUAB",
  "FDS",
];

const BESA_FACULTY_MAP: Record<string, AwardType> = {
  FHSS: "besa-fhss",
  FAS: "besa-fas",
  FMSC: "besa-fmsc",
  FMS: "besa-fms",
  FOT: "besa-fot",
  FOE: "besa-foe",
  FAHS: "besa-fahs",
  FUAB: "besa-fuab",
  FDS: "besa-fds",
};

const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Agriculture",
  "Manufacturing",
  "Energy",
  "Transportation",
  "Retail",
  "Other",
];

const ACADEMIC_YEARS = [
  { value: "year-1", label: "Year 1" },
  { value: "year-2", label: "Year 2" },
  { value: "year-3", label: "Year 3" },
  { value: "year-4", label: "Year 4" },
  { value: "recent-graduate", label: "Recent Graduate (Within One Year)" },
];

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

const SRI_LANKAN_UNIVERSITIES = [
  "University of Colombo",
  "University of Peradeniya",
  "University of Kelaniya",
  "University of Moratuwa",
  "University of Jaffna",
  "University of Ruhuna",
  "The Open University of Sri Lanka",
  "Eastern University, Sri Lanka",
  "South Eastern University of Sri Lanka",
  "Rajarata University of Sri Lanka",
  "Sabaragamuwa University of Sri Lanka",
  "Wayamba University of Sri Lanka",
  "Uva Wellassa University",
  "University of the Visual & Performing Arts",
  "Gampaha Wickramarachchi University of Indigenous Medicine",
  "University of Vauniya, Sri Lanka",
];

const STEP_TITLES = {
  1: "Personal Information",
  2: "Academic Information",
  3: "Award Selection",
  4: "Award Questions",
  5: "Declaration",
};

const INITIAL_FORM_DATA: ApplicationFormData = {
  applicantType: null,
  personalInfo: {},
  academicInfo: {},
  awardSelection: {
    selectedAwards: [],
    hasConditionalAwards: false,
  },
  declaration: {},
};

interface FormContextType {
  formData: ApplicationFormData;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  updateApplicantType: (type: ApplicantType) => void;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  updateAcademicInfo: (info: Partial<AcademicInfo>) => void;
  updateAwardSelection: (selection: Partial<AwardSelection>) => void;
  updateBestInnovatorQuestions: (
    questions: Partial<BestInnovatorQuestions>,
  ) => void;
  updateBestCSRQuestions: (questions: Partial<BestCSRQuestions>) => void;
  updateDeclaration: (declaration: Partial<Declaration>) => void;
  resetForm: () => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context)
    throw new Error("useFormContext must be used within FormProvider");
  return context;
};

const Select: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}> = ({ value, onChange, options, placeholder }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="flex h-10 w-full min-w-0 rounded-[8px] border border-slate-700/60 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 shadow-xs outline-none transition-[color,box-shadow] placeholder:text-slate-500 focus-visible:border-blue-500 focus-visible:ring-[3px] focus-visible:ring-blue-500/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
      backgroundPosition: "right 0.75rem center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "1.25rem",
    }}
  >
    <option value="">{placeholder || "Select an option"}</option>
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <div
    className={`rounded-2xl border border-slate-700/50 bg-slate-900/50 p-6 md:p-8 lg:p-10 backdrop-blur-sm ${className}`}
  >
    {children}
  </div>
);

const StepHeader: React.FC<{ title: string; subtitle: string }> = ({
  title,
  subtitle,
}) => (
  <div className="mb-8">
    <h2 className="bg-[linear-gradient(92deg,rgba(255,255,255,0.60)_6.46%,#FFF_22.73%,rgba(255,255,255,1.00)_79.27%,rgba(255,255,255,0.50)_95.93%)] bg-clip-text font-title text-[32px] text-transparent leading-[1.125] tracking-tight md:text-[40px] lg:text-[48px]">
      {title}
    </h2>
    <p className="mt-2 text-slate-400 text-sm">{subtitle}</p>
  </div>
);

const StepNav: React.FC<{
  onBack: () => void;
  onNext?: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
}> = ({ onBack, onNext, nextDisabled, nextLabel = "Continue →" }) => (
  <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-2">
    <Button onClick={onBack} variant="outline" className="rounded-[8px] border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-slate-100">
      ← Back
    </Button>
    {onNext && (
      <Button onClick={onNext} disabled={nextDisabled} className="rounded-[8px] py-3 font-medium text-base">
        {nextLabel}
      </Button>
    )}
  </div>
);

const InfoBanner: React.FC<{ message: string }> = ({ message }) => (
  <div className="p-4 rounded-2xl bg-blue-600/10 border border-blue-600/30 flex gap-3">
    <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
    <p className="text-sm text-slate-300">{message}</p>
  </div>
);

const Field: React.FC<{
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}> = ({ label, required, error, children }) => (
  <div className="space-y-1.5">
    <Label className="text-slate-200">
      {label} {required && <span className="text-blue-400">*</span>}
    </Label>
    {children}
    {error && <p className="text-destructive text-xs">{error}</p>}
  </div>
);

const normalizePhoneLocalPart = (local: string): string => {
  const digits = local.replace(/\D/g, "");
  if (digits.length === 10 && digits.startsWith("0")) {
    return digits.slice(1);
  }
  return digits;
};

const PhoneInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hasError?: boolean;
}> = ({ value, onChange, placeholder, hasError }) => {
  const [localValue, setLocalValue] = React.useState("");

  React.useEffect(() => {
    setLocalValue(value.replace(/^\+94/, "").replace(/\D/g, ""));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setLocalValue(digits);
    const normalized = normalizePhoneLocalPart(digits);
    onChange(`+94${normalized}`);
  };

  const handleBlur = () => {
    const normalized = normalizePhoneLocalPart(localValue);
    setLocalValue(normalized);
    onChange(`+94${normalized}`);
  };

  return (
    <div
      className={cn(
        "flex items-center rounded-[8px] border bg-slate-900/80 overflow-hidden transition-[color,box-shadow] focus-within:border-blue-500 focus-within:ring-[3px] focus-within:ring-blue-500/50",
        hasError ? "border-destructive" : "border-slate-700/60"
      )}
    >
      <span className="px-3 text-sm text-slate-400 border-r border-slate-700/60 bg-slate-900/80 h-10 flex items-center shrink-0 select-none">
        +94
      </span>
      <input
        type="tel"
        inputMode="numeric"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder || "7X XXX XXXX"}
        className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 outline-none h-10"
      />
    </div>
  );
};

const Step0Landing: React.FC = () => {
  const { formData, updateApplicantType, setCurrentStep } = useFormContext();
  const { applicantType } = formData;

  return (
    <div className="space-y-6">
      <StepHeader
        title="Select applicant type"
        subtitle="Choose the category that applies to you"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(["internal", "external"] as const).map((type) => (
          <button
            key={type}
            onClick={() => updateApplicantType(type)}
            className={`p-6 rounded-2xl border-2 transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
              applicantType === type
                ? "border-blue-600 bg-blue-600/10"
                : "border-slate-700/50 bg-slate-900/50 hover:border-slate-600"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center ${
                  applicantType === type
                    ? "bg-blue-600 border-blue-600"
                    : "border-slate-600"
                }`}
              >
                {applicantType === type && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-50 capitalize">
                  {type} student
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  {type === "internal"
                    ? "University of Sri Jayewardenepura"
                    : "Other Sri Lankan state universities"}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <InfoBanner message="You must be a currently enrolled undergraduate at a Sri Lankan state university to apply. Your applicant type determines which awards you can apply for." />

      <div className="flex justify-end pt-2">
        <Button onClick={() => setCurrentStep(1)} disabled={!applicantType} className="rounded-[8px] py-3 font-medium text-base">
          Continue →
        </Button>
      </div>
    </div>
  );
};

const Step1PersonalInfo: React.FC = () => {
  const { formData, updatePersonalInfo, setCurrentStep } = useFormContext();
  const { personalInfo } = formData;
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    const { publicDisplayName, email, whatsappNumber, mobileNumber, gender, nic } =
      personalInfo;

    if (!publicDisplayName?.trim()) {
      nextErrors.publicDisplayName = "Name is required";
    }

    if (!nic?.trim()) {
      nextErrors.nic = "NIC is required";
    } else if (!SRI_LANKA_NIC_REGEX.test(nic)) {
      nextErrors.nic = "NIC must be 9 digits followed by V/X or 12 digits";
    }

    if (!gender) {
      nextErrors.gender = "Gender is required";
    }

    if (!email?.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address";
    }

    if (!whatsappNumber?.trim()) {
      nextErrors.whatsappNumber = "WhatsApp number is required";
    } else if (!SRI_LANKA_PHONE_REGEX.test(whatsappNumber)) {
      nextErrors.whatsappNumber = "Enter a valid Sri Lankan number";
    }

    if (!mobileNumber?.trim()) {
      nextErrors.mobileNumber = "Mobile number is required";
    } else if (!SRI_LANKA_PHONE_REGEX.test(mobileNumber)) {
      nextErrors.mobileNumber = "Enter a valid Sri Lankan number";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      setCurrentStep(2);
    }
  };

  return (
    <div className="space-y-6">
      <StepHeader title="Personal Information" subtitle="Step 1" />

      <Card className="space-y-5">
        <Field label="Public Display Name" required error={errors.publicDisplayName}>
          <Input
            type="text"
            placeholder="Enter your display name"
            value={personalInfo.publicDisplayName || ""}
            onChange={(e) =>
              updatePersonalInfo({ publicDisplayName: e.target.value })
            }
            className={errors.publicDisplayName ? "border-destructive" : ""}
          />
        </Field>

        <Field label="NIC" required error={errors.nic}>
          <Input
            type="text"
            placeholder="000000000V or 000000000000"
            value={personalInfo.nic || ""}
            onChange={(e) =>
              updatePersonalInfo({
                nic: e.target.value.toUpperCase(),
              })
            }
            className={errors.nic ? "border-destructive" : ""}
          />
        </Field>

        <Field label="Gender" required error={errors.gender}>
          <Select
            value={personalInfo.gender || ""}
            onChange={(value) => updatePersonalInfo({ gender: value })}
            options={GENDER_OPTIONS}
            placeholder="Select gender"
          />
        </Field>

        <Field label="Email Address" required error={errors.email}>
          <Input
            type="email"
            placeholder="Enter your email address"
            value={personalInfo.email || ""}
            onChange={(e) => updatePersonalInfo({ email: e.target.value })}
            className={errors.email ? "border-destructive" : ""}
          />
        </Field>

        <Field label="WhatsApp Number" required error={errors.whatsappNumber}>
          <PhoneInput
            value={personalInfo.whatsappNumber || "+94"}
            onChange={(value) =>
              updatePersonalInfo({ whatsappNumber: value })
            }
            placeholder="7X XXX XXXX"
            hasError={Boolean(errors.whatsappNumber)}
          />
        </Field>

        <Field label="Mobile Number" required error={errors.mobileNumber}>
          <PhoneInput
            value={personalInfo.mobileNumber || "+94"}
            onChange={(value) =>
              updatePersonalInfo({ mobileNumber: value })
            }
            placeholder="7X XXX XXXX"
            hasError={Boolean(errors.mobileNumber)}
          />
        </Field>
      </Card>

      <StepNav
        onBack={() => setCurrentStep(0)}
        onNext={handleNext}
      />
    </div>
  );
};

const Step2AcademicInfo: React.FC = () => {
  const { formData, updateAcademicInfo, updateAwardSelection, setCurrentStep } = useFormContext();
  const { applicantType, academicInfo, awardSelection } = formData;
  const isRecentGraduate = academicInfo.academicYear === "recent-graduate";
  const academicYearOptions = ACADEMIC_YEARS;
  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    if (applicantType === "internal" && academicInfo.university !== "University of Sri Jayewardenepura") {
      updateAcademicInfo({ university: "University of Sri Jayewardenepura" });
    }
  }, [applicantType]);

  React.useEffect(() => {
    if (isRecentGraduate && (awardSelection.selectedAwards?.length ?? 0) > 0) {
      updateAwardSelection({ selectedAwards: [], hasConditionalAwards: false });
    }
  }, [academicInfo.academicYear]);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    const {
      university,
      universityRegistrationNumber,
      universityEmail,
      academicYear,
      faculty,
      degree,
    } = academicInfo;

    if (!university?.trim()) {
      nextErrors.university = "University is required";
    }

    if (!universityRegistrationNumber?.trim()) {
      nextErrors.universityRegistrationNumber = "Registration number is required";
    }

    if (!universityEmail?.trim()) {
      nextErrors.universityEmail = "University email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(universityEmail)) {
      nextErrors.universityEmail = "Enter a valid email address";
    }

    if (!academicYear) {
      nextErrors.academicYear = "Academic year is required";
    }

    if (!faculty?.trim()) {
      nextErrors.faculty = "Faculty is required";
    }

    if (!degree?.trim()) {
      nextErrors.degree = "Degree is required";
    }

    if (isRecentGraduate) {
      const gy = academicInfo.graduationYear?.trim();
      if (!gy) {
        nextErrors.graduationYear = "Graduation year is required for recent graduates";
      } else if (!/^(2023|2024|2025|2026)$/.test(gy)) {
        nextErrors.graduationYear = "Graduation year must be between 2023 and 2026";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      setCurrentStep(3);
    }
  };

  return (
    <div className="space-y-6">
      <StepHeader title="Academic Information" subtitle="Step 2" />

      {isRecentGraduate && (
        <InfoBanner message="Only recent graduates who completed their degree within one year of the release of their final examination results are eligible to apply for the Best Innovator Award." />
      )}

      <Card className="space-y-5">
        <Field label="University" required error={errors.university}>
          {applicantType === "external" ? (
            <Select
              value={
                academicInfo.university &&
                SRI_LANKAN_UNIVERSITIES.includes(academicInfo.university)
                  ? academicInfo.university
                  : ""
              }
              onChange={(value) => updateAcademicInfo({ university: value })}
              options={SRI_LANKAN_UNIVERSITIES.map((u) => ({
                value: u,
                label: u,
              }))}
              placeholder="Select your university"
            />
          ) : (
            <Input
              type="text"
              value={
                academicInfo.university || "University of Sri Jayewardenepura"
              }
              disabled
              onChange={(e) =>
                updateAcademicInfo({ university: e.target.value })
              }
            />
          )}
        </Field>

        <Field label="University Registration Number" required error={errors.universityRegistrationNumber}>
          <Input
            type="text"
            placeholder="Enter your registration number"
            value={academicInfo.universityRegistrationNumber || ""}
            onChange={(e) =>
              updateAcademicInfo({
                universityRegistrationNumber: e.target.value,
              })
            }
            className={errors.universityRegistrationNumber ? "border-destructive" : ""}
          />
        </Field>

        <Field label="University Email" required error={errors.universityEmail}>
          <Input
            type="email"
            placeholder="Enter your university email"
            value={academicInfo.universityEmail || ""}
            onChange={(e) =>
              updateAcademicInfo({ universityEmail: e.target.value })
            }
            className={errors.universityEmail ? "border-destructive" : ""}
          />
        </Field>

        <Field label="Academic Year" required error={errors.academicYear}>
          <Select
            value={academicInfo.academicYear || ""}
            onChange={(value) => updateAcademicInfo({ academicYear: value })}
            options={academicYearOptions}
            placeholder="Select academic year"
          />
        </Field>

        <Field label="Faculty" required error={errors.faculty}>
          {applicantType === "external" ? (
            <Input
              type="text"
              placeholder="Enter your faculty name"
              value={academicInfo.faculty || ""}
              onChange={(e) => updateAcademicInfo({ faculty: e.target.value })}
              className={errors.faculty ? "border-destructive" : ""}
            />
          ) : (
            <Select
              value={academicInfo.faculty || ""}
              onChange={(value) => updateAcademicInfo({ faculty: value })}
              options={FACULTIES.map((f) => ({ value: f, label: f }))}
              placeholder="Select faculty"
            />
          )}
        </Field>

        <Field label="Degree" required error={errors.degree}>
          <Input
            type="text"
            placeholder="Enter your degree name"
            value={academicInfo.degree || ""}
            onChange={(e) => updateAcademicInfo({ degree: e.target.value })}
            className={errors.degree ? "border-destructive" : ""}
          />
        </Field>

        <Field label="Other Degree">
          <Input
            type="text"
            placeholder="Enter any other degree if applicable"
            value={academicInfo.otherDegree || ""}
            onChange={(e) =>
              updateAcademicInfo({ otherDegree: e.target.value })
            }
          />
        </Field>

        {isRecentGraduate && (
          <Field label="Graduation Year" required error={errors.graduationYear}>
            <select
              value={academicInfo.graduationYear || ""}
              onChange={(e) =>
                updateAcademicInfo({ graduationYear: e.target.value })
              }
              className={`flex h-10 w-full min-w-0 rounded-[8px] border border-slate-700/60 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 shadow-xs outline-none transition-[color,box-shadow] placeholder:text-slate-500 focus-visible:border-blue-500 focus-visible:ring-[3px] focus-visible:ring-blue-500/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer ${
                errors.graduationYear ? "border-destructive" : ""
              }`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 0.75rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.25rem",
              }}
            >
              <option value="">Select graduation year</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </Field>
        )}
      </Card>

      <StepNav
        onBack={() => setCurrentStep(1)}
        onNext={handleNext}
      />
    </div>
  );
};

const Step3AwardSelection: React.FC = () => {
  const { formData, updateAwardSelection, setCurrentStep } = useFormContext();
  const { applicantType, academicInfo, awardSelection } = formData;
  const { selectedAwards = [], hasConditionalAwards = false } = awardSelection;
  const isInternal = applicantType === "internal";
  const isRecentGraduate = academicInfo.academicYear === "recent-graduate";
  const faculty = academicInfo.faculty;

  const mainAwards: { id: AwardType; label: string }[] = Object.entries(
    JESA_AWARDS,
  ).map(([id, label]) => ({
    id: id as AwardType,
    label,
  }));
  if (faculty && BESA_FACULTY_MAP[faculty]) {
    mainAwards.push({
      id: BESA_FACULTY_MAP[faculty],
      label: `${BESA_AWARDS[BESA_FACULTY_MAP[faculty]]} (Faculty wise award)`,
    });
  }

  const mainSelectedCount = selectedAwards.filter(
    (id) => id !== "besa-inter-university",
  ).length;
  const mainMaxReached = mainSelectedCount >= 2;
  const totalMaxReached = selectedAwards.length >= 3;

  const handleAwardToggle = (awardId: AwardType) => {
    const alreadySelected = selectedAwards.includes(awardId);
    const isMain = awardId !== "besa-inter-university";

    if (!alreadySelected && isMain && mainMaxReached) return;
    if (!alreadySelected && !isMain && totalMaxReached) return;

    const newSelected = alreadySelected
      ? selectedAwards.filter((id) => id !== awardId)
      : [...selectedAwards, awardId];

    const hasConditional =
      newSelected.includes("best-innovator") ||
      newSelected.includes("best-csr");

    updateAwardSelection({
      selectedAwards: newSelected,
      hasConditionalAwards: hasConditional,
    });
  };

  const [error, setError] = useState("");

  const isValid = () => selectedAwards.length >= 1;

  const handleContinue = () => {
    if (isValid()) {
      setError("");
      if (hasConditionalAwards) {
        setCurrentStep(4);
      } else {
        setCurrentStep(5);
      }
    } else {
      setError("Please select at least one award to continue.");
    }
  };

  const renderCheckbox = (id: AwardType, label: string, disabled = false) => (
    <div key={id} className="flex items-start gap-3 py-1">
      <Checkbox
        id={id}
        checked={selectedAwards.includes(id)}
        onCheckedChange={() => handleAwardToggle(id)}
        disabled={disabled}
        className="mt-0.5 shrink-0"
      />
      <Label
        htmlFor={id}
        className={`${disabled ? "text-slate-600 cursor-not-allowed" : "text-slate-200 cursor-pointer"} flex-1 font-normal leading-relaxed text-sm`}
      >
        {label}
      </Label>
    </div>
  );

  return (
    <div className="space-y-6">
      <StepHeader title="Award Selection" subtitle="Step 3" />

      {isRecentGraduate ? (
        <InfoBanner message="Recent Graduates are only eligible to apply for the Best Innovator Award." />
      ) : (
        <InfoBanner
          message={
            isInternal
              ? "You must select at least 1 award. You may choose up to 2 awards from the list below, plus the BESA – Inter University Award (3 awards total)."
              : "You must select at least 1 award. External students may apply for the Best Innovator Award and/or the BESA – Inter University Award."
          }
        />
      )}

      {isRecentGraduate ? (
        <Card className="space-y-3">
          {renderCheckbox("best-innovator", JESA_AWARDS["best-innovator"])}
        </Card>
      ) : isInternal ? (
        <Card className="space-y-1">
          {mainAwards.map(({ id, label }) =>
            renderCheckbox(
              id,
              label,
              !selectedAwards.includes(id) && mainMaxReached,
            ),
          )}

          <hr className="border-slate-700/50 my-3" />

          {renderCheckbox(
            "besa-inter-university",
            BESA_AWARDS["besa-inter-university"],
            !selectedAwards.includes("besa-inter-university") &&
              totalMaxReached,
          )}
        </Card>
      ) : (
        <Card className="space-y-3">
          {renderCheckbox(
            "besa-inter-university",
            BESA_AWARDS["besa-inter-university"],
          )}
          {renderCheckbox("best-innovator", JESA_AWARDS["best-innovator"])}
        </Card>
      )}

      <p className="text-sm text-slate-400">
        Selected: {selectedAwards.length} award
        {selectedAwards.length !== 1 ? "s" : ""}
      </p>

      {error && (
        <p className="text-destructive text-xs">{error}</p>
      )}

      <StepNav
        onBack={() => setCurrentStep(2)}
        onNext={handleContinue}
      />
    </div>
  );
};

const Step4AwardQuestions: React.FC = () => {
  const {
    formData,
    updateBestInnovatorQuestions,
    updateBestCSRQuestions,
    setCurrentStep,
  } = useFormContext();
  const { awardSelection, bestInnovatorQuestions, bestCSRQuestions } = formData;
  const { selectedAwards = [] } = awardSelection;
  const [errors, setErrors] = useState<Record<string, string>>({});

  const hasBestInnovator = selectedAwards.includes("best-innovator");
  const hasBestCSR = selectedAwards.includes("best-csr");

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (hasBestInnovator) {
      if (!bestInnovatorQuestions?.industry) {
        nextErrors.industry = "Industry is required";
      }
      if (
        bestInnovatorQuestions?.industry === "Other" &&
        !bestInnovatorQuestions?.otherIndustry?.trim()
      ) {
        nextErrors.otherIndustry = "Please specify your industry";
      }
      if (bestInnovatorQuestions?.innovationCompletionPercentage !== true) {
        nextErrors.innovationCompletionPercentage =
          "You must confirm your innovation is more than 75% completed";
      }
    }

    if (hasBestCSR) {
      if (!bestCSRQuestions?.clubAdvisorNameTitle?.trim()) {
        nextErrors.clubAdvisorNameTitle = "Advisor name and title are required";
      }
      if (!bestCSRQuestions?.clubAdvisorEmail?.trim()) {
        nextErrors.clubAdvisorEmail = "Advisor email is required";
      } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bestCSRQuestions.clubAdvisorEmail)
      ) {
        nextErrors.clubAdvisorEmail = "Enter a valid email address";
      }
      if (!bestCSRQuestions?.memberAttendingName?.trim()) {
        nextErrors.memberAttendingName = "Member name is required";
      }
      if (!bestCSRQuestions?.memberAttendingWhatsapp?.trim()) {
        nextErrors.memberAttendingWhatsapp = "Member WhatsApp number is required";
      } else if (
        !SRI_LANKA_PHONE_REGEX.test(bestCSRQuestions.memberAttendingWhatsapp)
      ) {
        nextErrors.memberAttendingWhatsapp = "Enter a valid Sri Lankan number";
      }
      if (!bestCSRQuestions?.clubPresidentName?.trim()) {
        nextErrors.clubPresidentName = "President name is required";
      }
      if (!bestCSRQuestions?.clubPresidentWhatsapp?.trim()) {
        nextErrors.clubPresidentWhatsapp = "President WhatsApp number is required";
      } else if (
        !SRI_LANKA_PHONE_REGEX.test(bestCSRQuestions.clubPresidentWhatsapp)
      ) {
        nextErrors.clubPresidentWhatsapp = "Enter a valid Sri Lankan number";
      }
      if (!bestCSRQuestions?.clubPresidentEmail?.trim()) {
        nextErrors.clubPresidentEmail = "President email is required";
      } else if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bestCSRQuestions.clubPresidentEmail)
      ) {
        nextErrors.clubPresidentEmail = "Enter a valid email address";
      }
      if (
        bestCSRQuestions?.clubAdvisorEmail?.trim() &&
        bestCSRQuestions?.clubPresidentEmail?.trim() &&
        bestCSRQuestions.clubAdvisorEmail.trim().toLowerCase() ===
          bestCSRQuestions.clubPresidentEmail.trim().toLowerCase()
      ) {
        nextErrors.clubPresidentEmail =
          "President email must be different from advisor email";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      setCurrentStep(5);
    }
  };

  return (
    <div className="space-y-6">
      <StepHeader title="Award Questions" subtitle="Step 4" />

      {hasBestInnovator && (
        <Card className="space-y-5">
          <h3 className="text-lg font-semibold text-slate-50">
            Best Innovator Award
          </h3>

          <Field label="Which industry is your innovation related to?" required error={errors.industry}>
            <Select
              value={bestInnovatorQuestions?.industry || ""}
              onChange={(value) =>
                updateBestInnovatorQuestions({ industry: value })
              }
              options={INDUSTRIES.map((ind) => ({ value: ind, label: ind }))}
              placeholder="Select industry"
            />
          </Field>

          {bestInnovatorQuestions?.industry === "Other" && (
            <Field label="Please specify your industry" required error={errors.otherIndustry}>
              <Input
                type="text"
                placeholder="Enter your industry"
                value={bestInnovatorQuestions?.otherIndustry || ""}
                onChange={(e) =>
                  updateBestInnovatorQuestions({
                    otherIndustry: e.target.value,
                  })
                }
                className={errors.otherIndustry ? "border-destructive" : ""}
              />
            </Field>
          )}

          <div className="flex items-start gap-3">
            <Checkbox
              id="innovationCompletion"
              checked={
                bestInnovatorQuestions?.innovationCompletionPercentage === true
              }
              onCheckedChange={(checked) =>
                updateBestInnovatorQuestions({
                  innovationCompletionPercentage: checked === true,
                })
              }
              className="mt-0.5"
            />
            <Label htmlFor="innovationCompletion" className="cursor-pointer font-normal text-slate-200 leading-relaxed text-sm">
              I declare that my innovation is more than 75% completed
            </Label>
          </div>
          {errors.innovationCompletionPercentage && (
            <p className="text-destructive text-xs">{errors.innovationCompletionPercentage}</p>
          )}
        </Card>
      )}

      {hasBestCSR && (
        <Card className="space-y-5">
          <h3 className="text-lg font-semibold text-slate-50">
            Best CSR Award
          </h3>

          <div className="space-y-5 pb-5 border-b border-slate-700/50">
            <h4 className="text-sm font-semibold text-slate-300">
              Club Advisor Information
            </h4>

            <Field label="Club Advisor Name & Title" required error={errors.clubAdvisorNameTitle}>
              <Input
                type="text"
                placeholder="Enter advisor name and title"
                value={bestCSRQuestions?.clubAdvisorNameTitle || ""}
                onChange={(e) =>
                  updateBestCSRQuestions({
                    clubAdvisorNameTitle: e.target.value,
                  })
                }
                className={errors.clubAdvisorNameTitle ? "border-destructive" : ""}
              />
            </Field>

            <Field label="Club Advisor Email" required error={errors.clubAdvisorEmail}>
              <Input
                type="email"
                placeholder="Enter advisor email"
                value={bestCSRQuestions?.clubAdvisorEmail || ""}
                onChange={(e) =>
                  updateBestCSRQuestions({ clubAdvisorEmail: e.target.value })
                }
                className={errors.clubAdvisorEmail ? "border-destructive" : ""}
              />
            </Field>
          </div>

          <div className="space-y-5 pb-5 border-b border-slate-700/50">
            <h4 className="text-sm font-semibold text-slate-300">
              Member Attending Interview & Workshops
            </h4>

            <Field label="Member Name" required error={errors.memberAttendingName}>
              <Input
                type="text"
                placeholder="Enter member name"
                value={bestCSRQuestions?.memberAttendingName || ""}
                onChange={(e) =>
                  updateBestCSRQuestions({
                    memberAttendingName: e.target.value,
                  })
                }
                className={errors.memberAttendingName ? "border-destructive" : ""}
              />
            </Field>

            <Field label="Member WhatsApp Number" required error={errors.memberAttendingWhatsapp}>
              <PhoneInput
                value={bestCSRQuestions?.memberAttendingWhatsapp || "+94"}
                onChange={(value) =>
                  updateBestCSRQuestions({
                    memberAttendingWhatsapp: value,
                  })
                }
                placeholder="7X XXX XXXX"
                hasError={Boolean(errors.memberAttendingWhatsapp)}
              />
            </Field>
          </div>

          <div className="space-y-5">
            <h4 className="text-sm font-semibold text-slate-300">
              Club President Information
            </h4>

            <Field label="Club President Name" required error={errors.clubPresidentName}>
              <Input
                type="text"
                placeholder="Enter president name"
                value={bestCSRQuestions?.clubPresidentName || ""}
                onChange={(e) =>
                  updateBestCSRQuestions({ clubPresidentName: e.target.value })
                }
                className={errors.clubPresidentName ? "border-destructive" : ""}
              />
            </Field>

            <Field label="Club President WhatsApp Number" required error={errors.clubPresidentWhatsapp}>
              <PhoneInput
                value={bestCSRQuestions?.clubPresidentWhatsapp || "+94"}
                onChange={(value) =>
                  updateBestCSRQuestions({
                    clubPresidentWhatsapp: value,
                  })
                }
                placeholder="7X XXX XXXX"
                hasError={Boolean(errors.clubPresidentWhatsapp)}
              />
            </Field>

            <Field label="Club President Email" required error={errors.clubPresidentEmail}>
              <Input
                type="email"
                placeholder="Enter president email"
                value={bestCSRQuestions?.clubPresidentEmail || ""}
                onChange={(e) =>
                  updateBestCSRQuestions({ clubPresidentEmail: e.target.value })
                }
                className={errors.clubPresidentEmail ? "border-destructive" : ""}
              />
            </Field>
          </div>
        </Card>
      )}

      <StepNav
        onBack={() => setCurrentStep(3)}
        onNext={handleNext}
      />
    </div>
  );
};

const SwipeToSubmit: React.FC<{
  onSubmit: () => Promise<void>;
  disabled?: boolean;
  onSuccess?: () => void;
}> = ({ onSubmit, disabled = false, onSuccess }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const dragOffsetRef = useRef(0);
  const metricsRef = useRef({ leftPadding: 8, ballWidth: 48 });

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled || status !== 'idle') return;
    e.preventDefault();
    const track = trackRef.current;
    const ball = ballRef.current;
    if (!track || !ball) return;
    track.setPointerCapture(e.pointerId);

    const trackRect = track.getBoundingClientRect();
    const ballRect = ball.getBoundingClientRect();
    const ballStyle = window.getComputedStyle(ball);
    const leftPadding = parseFloat(ballStyle.left) || 8;

    metricsRef.current = {
      leftPadding,
      ballWidth: ballRect.width || 48,
    };
    dragOffsetRef.current = e.clientX - ballRect.left;
    draggingRef.current = true;
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    e.preventDefault();
    const track = trackRef.current;
    if (!track) return;

    const trackRect = track.getBoundingClientRect();
    const { leftPadding, ballWidth } = metricsRef.current;
    const availableWidth = trackRect.width - ballWidth - leftPadding * 2;
    const relativeX =
      e.clientX - dragOffsetRef.current - trackRect.left - leftPadding;
    const pct = Math.min(100, Math.max(0, (relativeX / availableWidth) * 100));
    setProgress(pct);
  };

  const handlePointerUp = async (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);
    const track = trackRef.current;
    if (track) track.releasePointerCapture(e.pointerId);

    if (progress >= 90) {
      setStatus('loading');
      setProgress(100);
      try {
        await onSubmit();
        setStatus('success');
        onSuccess?.();
      } catch {
        setStatus('idle');
        setProgress(0);
      }
    } else {
      setStatus('idle');
      setProgress(0);
    }
  };

  const canDrag = !disabled && status === 'idle';
  const isComplete = status === 'loading' || status === 'success';
  const textOpacity = Math.max(0, 1 - progress / 60);

  return (
    <div
      ref={trackRef}
      className={`relative w-full h-16 rounded-full select-none overflow-hidden border transition-colors duration-300 ${
        disabled
          ? 'border-slate-700/50 opacity-60'
          : status === 'success'
            ? 'border-emerald-500/50 bg-emerald-600/15'
            : 'border-slate-700/50 bg-slate-900/80'
      }`}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ touchAction: 'none' }}
    >
      <div
        className="absolute inset-y-0 left-0 right-0 origin-left bg-gradient-to-r from-amber-400/50 via-amber-400/30 to-transparent will-change-transform"
        style={{
          transform: `scaleX(${progress / 100})`,
          transition: isDragging ? 'none' : 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />

      <div
        className="absolute inset-y-0 rounded-full will-change-transform"
        style={{
          left: `calc(0.5rem + ${progress} * (100% - 4rem) / 100)`,
          width: '4rem',
          background: 'radial-gradient(circle, rgba(251,191,36,0.25) 0%, transparent 70%)',
          transform: 'translateX(-50%)',
          opacity: isDragging ? 0.8 : 0,
          transition: isDragging ? 'none' : 'opacity 300ms ease',
          pointerEvents: 'none',
        }}
      />

      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
        style={{ opacity: textOpacity }}
      >
        <span className={`text-sm font-medium tracking-wide transition-colors duration-300 ${
          disabled ? 'text-slate-500' : 'text-slate-400'
        }`}>
          {disabled
            ? 'Accept all declarations'
            : 'Swipe to submit'}
        </span>
      </div>

      <div
        ref={ballRef}
        className={`absolute top-1/2 left-2 w-12 h-12 rounded-full flex items-center justify-center z-20 will-change-transform transition-shadow duration-200 ${
          canDrag
            ? 'cursor-grab active:cursor-grabbing bg-white shadow-[0_0_20px_rgba(251,191,36,0.35)]'
            : status === 'loading'
              ? 'bg-amber-400 shadow-[0_0_24px_rgba(251,191,36,0.4)]'
              : status === 'success'
                ? 'bg-emerald-500 shadow-[0_0_24px_rgba(16,185,129,0.4)]'
                : 'bg-slate-600 cursor-not-allowed'
        }`}
        style={{
          transform: `translateY(-50%) translateX(calc(${isComplete ? 1 : progress / 100} * (100% - 4rem))) scale(${isDragging ? 1.12 : 1})`,
          transition: isDragging
            ? 'none'
            : 'transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        onPointerDown={handlePointerDown}
      >
        {status === 'success' ? (
          <CheckCircle className="w-5 h-5 text-white" />
        ) : status === 'loading' ? (
          <Loader2 className="w-5 h-5 text-slate-950 animate-spin" />
        ) : (
          <ArrowRight
            className={`w-5 h-5 text-slate-950 ${canDrag ? 'animate-pulse' : ''}`}
            style={{ animationDuration: '1.8s' }}
          />
        )}
      </div>
    </div>
  );
};

const Step5Declaration: React.FC = () => {
  const { formData, updateDeclaration, setCurrentStep } = useFormContext();
  const { declaration, awardSelection } = formData;
  const { hasConditionalAwards = false } = awardSelection;

  const {
    confirmAccuracy = false,
    agreeDisqualification = false,
    agreePhysicalInterview = false,
    permitVerification = false,
    consentPublicity = false,
  } = declaration;

  const isValid = () =>
    confirmAccuracy &&
    agreeDisqualification &&
    agreePhysicalInterview &&
    permitVerification &&
    consentPublicity;

  const router = useRouter();
  const [toast, setToast] = useState<{ message: string; type: 'error' } | null>(null);

  const handleSubmit = async (): Promise<void> => {
    try {
      await createNewApplication(formData);
      router.push('/register/success');
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : 'Failed to submit application. Please try again.', type: 'error' });
      setTimeout(() => setToast(null), 8000);
      throw error;
    }
  };

  const handleBack = () => {
    setCurrentStep(hasConditionalAwards ? 4 : 3);
  };

  return (
    <div className="space-y-6">
      <StepHeader
        title="Declaration"
        subtitle={hasConditionalAwards ? "Step 5" : "Step 4"}
      />

      <Card className="space-y-5">
        <div className="flex items-start gap-3">
          <Checkbox
            id="confirmAccuracy"
            checked={confirmAccuracy}
            onCheckedChange={(checked) =>
              updateDeclaration({ confirmAccuracy: checked === true })
            }
            className="mt-0.5"
          />
          <Label htmlFor="confirmAccuracy" className="cursor-pointer font-normal text-slate-200 leading-relaxed text-sm">
            I confirm all provided information is true.
          </Label>
        </div>
        <div className="flex items-start gap-3">
          <Checkbox
            id="agreeDisqualification"
            checked={agreeDisqualification}
            onCheckedChange={(checked) =>
              updateDeclaration({ agreeDisqualification: checked === true })
            }
            className="mt-0.5"
          />
          <Label htmlFor="agreeDisqualification" className="cursor-pointer font-normal text-slate-200 leading-relaxed text-sm">
            I agree that false information will result in disqualification.
          </Label>
        </div>
        <div className="flex items-start gap-3">
          <Checkbox
            id="agreePhysicalInterview"
            checked={agreePhysicalInterview}
            onCheckedChange={(checked) =>
              updateDeclaration({ agreePhysicalInterview: checked === true })
            }
            className="mt-0.5"
          />
          <Label htmlFor="agreePhysicalInterview" className="cursor-pointer font-normal text-slate-200 leading-relaxed text-sm">
            I agree that not attending physical interview on the given date will result in disqualification.
          </Label>
        </div>
        <div className="flex items-start gap-3">
          <Checkbox
            id="permitVerification"
            checked={permitVerification}
            onCheckedChange={(checked) =>
              updateDeclaration({ permitVerification: checked === true })
            }
            className="mt-0.5"
          />
          <Label htmlFor="permitVerification" className="cursor-pointer font-normal text-slate-200 leading-relaxed text-sm">
            I permit the organizing committee to verify my submissions.
          </Label>
        </div>
        <div className="flex items-start gap-3">
          <Checkbox
            id="consentPublicity"
            checked={consentPublicity}
            onCheckedChange={(checked) =>
              updateDeclaration({ consentPublicity: checked === true })
            }
            className="mt-0.5"
          />
          <Label htmlFor="consentPublicity" className="cursor-pointer font-normal text-slate-200 leading-relaxed text-sm">
            I consent to the use of my name, photograph, and submitted materials for publicity related to the awards.
          </Label>
        </div>
      </Card>

      {isValid() && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-300">
            All declarations accepted. You're ready to submit your application.
          </p>
        </div>
      )}

      {toast && (
        <div className="fixed top-6 right-6 z-50">
          <div className="p-4 rounded-2xl bg-red-900/40 border border-red-500/40 flex gap-3 shadow-xl backdrop-blur-sm max-w-sm">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-red-200">Submission Failed</p>
              <p className="text-xs text-red-300/80 mt-1">{toast.message}</p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-red-300 hover:text-red-200 shrink-0"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <SwipeToSubmit
          onSubmit={handleSubmit}
          disabled={!isValid()}
        />
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleBack}
            className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
};

const Sidebar: React.FC = () => {
  const { currentStep, setCurrentStep, formData } = useFormContext();
  const { hasConditionalAwards = false } = formData.awardSelection;
  const totalSteps = hasConditionalAwards ? 5 : 4;
  const visibleSteps = hasConditionalAwards ? [1, 2, 3, 4, 5] : [1, 2, 3, 4];

  const getStepTitle = (step: number) => {
    if (step === 4 && !hasConditionalAwards) return "Declaration";
    return STEP_TITLES[step as keyof typeof STEP_TITLES];
  };

  const isStepActive = (step: number) => {
    if (currentStep === 0) return step === 1;
    return step === currentStep;
  };

  const isStepCompleted = (step: number) => {
    return step < currentStep;
  };

  return (
    <aside className="w-full lg:w-60 xl:w-64 shrink-0">
      <div className="lg:sticky lg:top-28 space-y-6">
        <div className="hidden lg:block space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            JESA 2026
          </p>
          <h1 className="text-xl font-bold text-slate-50">
            Awards Application
          </h1>
        </div>

        <nav className="flex lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {visibleSteps.map((step) => (
            <button
              key={step}
              onClick={() => {
                if (isStepCompleted(step) || step === currentStep) {
                  setCurrentStep(step);
                }
              }}
              disabled={!isStepCompleted(step) && !isStepActive(step)}
              className={`flex items-center gap-3 py-2.5 px-3.5 rounded-lg transition-all duration-200 text-left shrink-0 ${
                isStepActive(step)
                  ? "bg-blue-600/20 text-blue-300"
                  : isStepCompleted(step)
                    ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                    : "text-slate-600 cursor-not-allowed"
              }`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 font-semibold text-sm shrink-0 ${
                  isStepActive(step)
                    ? "border-blue-400 bg-blue-600 text-white"
                    : isStepCompleted(step)
                      ? "border-blue-600 bg-blue-600/20 text-blue-300"
                      : "border-slate-700 text-slate-600"
                }`}
              >
                {isStepCompleted(step) ? (
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  step
                )}
              </div>
              <div className="flex-1 min-w-0 hidden lg:block">
                <div className="text-sm font-medium truncate">
                  {getStepTitle(step)}
                </div>
                <div className="text-xs text-slate-500">Step {step}</div>
              </div>
            </button>
          ))}
        </nav>

        <div className="hidden lg:block pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Progress</span>
            <span>{currentStep === 0 ? "Start" : `${Math.min(currentStep, totalSteps)} of ${totalSteps}`}</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(Math.max(0, Math.min(currentStep, totalSteps)) / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default function NewRegistrationForm2026() {
  const [formData, setFormData] =
    useState<ApplicationFormData>(INITIAL_FORM_DATA);
  const [currentStep, setCurrentStep] = useState(0);

  const updateApplicantType = useCallback((type: ApplicantType) => {
    setFormData({ ...INITIAL_FORM_DATA, applicantType: type });
  }, []);

  const updatePersonalInfo = useCallback((info: Partial<PersonalInfo>) => {
    setFormData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...info },
    }));
  }, []);

  const updateAcademicInfo = useCallback((info: Partial<AcademicInfo>) => {
    setFormData((prev) => ({
      ...prev,
      academicInfo: { ...prev.academicInfo, ...info },
    }));
  }, []);

  const updateAwardSelection = useCallback(
    (selection: Partial<AwardSelection>) => {
      setFormData((prev) => ({
        ...prev,
        awardSelection: { ...prev.awardSelection, ...selection },
      }));
    },
    [],
  );

  const updateBestInnovatorQuestions = useCallback(
    (questions: Partial<BestInnovatorQuestions>) => {
      setFormData((prev) => ({
        ...prev,
        bestInnovatorQuestions: {
          ...prev.bestInnovatorQuestions,
          ...questions,
        },
      }));
    },
    [],
  );

  const updateBestCSRQuestions = useCallback(
    (questions: Partial<BestCSRQuestions>) => {
      setFormData((prev) => ({
        ...prev,
        bestCSRQuestions: { ...prev.bestCSRQuestions, ...questions },
      }));
    },
    [],
  );

  const updateDeclaration = useCallback((declaration: Partial<Declaration>) => {
    setFormData((prev) => ({
      ...prev,
      declaration: { ...prev.declaration, ...declaration },
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setCurrentStep(0);
  }, []);

  const contextValue: FormContextType = {
    formData,
    currentStep,
    setCurrentStep,
    updateApplicantType,
    updatePersonalInfo,
    updateAcademicInfo,
    updateAwardSelection,
    updateBestInnovatorQuestions,
    updateBestCSRQuestions,
    updateDeclaration,
    resetForm,
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Step0Landing />;
      case 1:
        return <Step1PersonalInfo />;
      case 2:
        return <Step2AcademicInfo />;
      case 3:
        return <Step3AwardSelection />;
      case 4:
        return <Step4AwardQuestions />;
      case 5:
        return <Step5Declaration />;
      default:
        return <Step0Landing />;
    }
  };

  return (
    <FormContext.Provider value={contextValue}>
      <div className="min-h-screen bg-slate-950 pb-16 lg:pb-24">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
            <Sidebar />
            <main className="flex-1 min-w-0 max-w-3xl">{renderStep()}</main>
          </div>
        </div>
      </div>
    </FormContext.Provider>
  );
}
