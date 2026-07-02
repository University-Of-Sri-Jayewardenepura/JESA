'use client';

import React, { useState, useCallback, createContext, useContext } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

type ApplicantType = 'internal' | 'external';

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
  | 'best-leader'
  | 'best-team-player'
  | 'best-creative-designer'
  | 'best-communicator'
  | 'best-innovator'
  | 'best-young-entrepreneur'
  | 'best-csr'
  | 'besa-inter-university'
  | 'besa-fhss'
  | 'besa-fas'
  | 'besa-fmsc'
  | 'besa-fms'
  | 'besa-fot'
  | 'besa-foe'
  | 'besa-fahs'
  | 'besa-fuab'
  | 'besa-fds';

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
  'best-leader': 'Best Leader',
  'best-team-player': 'Best Team Player',
  'best-creative-designer': 'Best Creative Designer',
  'best-communicator': 'Best Communicator',
  'best-innovator': 'Best Innovator',
  'best-young-entrepreneur': 'Best Young Entrepreneur',
  'best-csr': 'Best CSR',
};

const BESA_AWARDS: Record<string, string> = {
  'besa-inter-university': 'BESA – Inter University Award',
  'besa-fhss': 'BESA – FHSS (Faculty of Humanities and Social Sciences)',
  'besa-fas': 'BESA – FAS (Faculty of Applied Sciences)',
  'besa-fmsc': 'BESA – FMSC (Faculty of Management Studies and Commerce)',
  'besa-fms': 'BESA – FMS (Faculty of Medical Sciences)',
  'besa-fot': 'BESA – FOT (Faculty of Technology)',
  'besa-foe': 'BESA – FOE (Faculty of Engineering)',
  'besa-fahs': 'BESA – FAHS (Faculty of Allied Health Sciences)',
  'besa-fuab': 'BESA – FUAB (Faculty of Urban and Aquatic Bioresources)',
  'besa-fds': 'BESA – FDS (Faculty of Dental Sciences)',
};

const FACULTIES = ['FHSS', 'FAS', 'FMSC', 'FMS', 'FOT', 'FOE', 'FAHS', 'FUAB', 'FDS'];

const BESA_FACULTY_MAP: Record<string, AwardType> = {
  FHSS: 'besa-fhss',
  FAS: 'besa-fas',
  FMSC: 'besa-fmsc',
  FMS: 'besa-fms',
  FOT: 'besa-fot',
  FOE: 'besa-foe',
  FAHS: 'besa-fahs',
  FUAB: 'besa-fuab',
  FDS: 'besa-fds',
};

const INDUSTRIES = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'Agriculture',
  'Manufacturing', 'Energy', 'Transportation', 'Retail', 'Other',
];

const ACADEMIC_YEARS = [
  { value: 'year-1', label: 'Year 1' },
  { value: 'year-2', label: 'Year 2' },
  { value: 'year-3', label: 'Year 3' },
  { value: 'year-4', label: 'Year 4' },
  { value: 'recent-graduate', label: 'Recent Graduate (Within One Year)' },
];

const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

const STEP_TITLES = {
  1: 'Personal Information',
  2: 'Academic Information',
  3: 'Award Selection',
  4: 'Award Questions',
  5: 'Declaration',
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
  updateBestInnovatorQuestions: (questions: Partial<BestInnovatorQuestions>) => void;
  updateBestCSRQuestions: (questions: Partial<BestCSRQuestions>) => void;
  updateDeclaration: (declaration: Partial<Declaration>) => void;
  resetForm: () => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) throw new Error('useFormContext must be used within FormProvider');
  return context;
};

const inputBase =
  'w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700/60 text-slate-50 placeholder-slate-500 rounded-lg transition-colors ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 focus-visible:border-blue-500';

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input {...props} className={`${inputBase} ${props.className || ''}`} />
);

const Label: React.FC<{ children: React.ReactNode; htmlFor?: string }> = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="block text-slate-200 text-sm font-medium mb-1.5">
    {children}
  </label>
);

const Checkbox: React.FC<{
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}> = ({ id, checked, onChange, label }) => (
  <div className="flex items-start gap-3">
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="mt-0.5 w-5 h-5 shrink-0 rounded border-2 border-slate-600 bg-slate-900/80 cursor-pointer accent-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
    />
    {label && (
      <label htmlFor={id} className="text-slate-200 cursor-pointer flex-1 leading-relaxed text-sm">
        {label}
      </label>
    )}
  </div>
);

const Select: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}> = ({ value, onChange, options, placeholder }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`${inputBase} appearance-none cursor-pointer`}
    style={{
      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
      backgroundPosition: 'right 0.75rem center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '1.25rem',
    }}
  >
    <option value="">{placeholder || 'Select an option'}</option>
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);

const Button: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}> = ({ onClick, disabled, variant = 'primary', children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
      variant === 'primary'
        ? 'bg-blue-600 hover:bg-blue-500 text-white focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600'
        : 'border border-slate-600 text-slate-300 hover:bg-slate-800 focus-visible:ring-slate-400 disabled:opacity-50 disabled:cursor-not-allowed'
    }`}
  >
    {children}
  </button>
);

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-6 md:p-8 rounded-xl bg-slate-900/50 border border-slate-700/50 shadow-sm ${className}`}>
    {children}
  </div>
);

const StepHeader: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <div className="mb-8">
    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-50">{title}</h2>
    <p className="text-slate-400 text-sm mt-1.5">{subtitle}</p>
  </div>
);

const StepNav: React.FC<{ onBack: () => void; onNext?: () => void; nextDisabled?: boolean; nextLabel?: string }> = ({
  onBack,
  onNext,
  nextDisabled,
  nextLabel = 'Continue →',
}) => (
  <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-2">
    <Button onClick={onBack} variant="secondary">
      ← Back
    </Button>
    {onNext && (
      <Button onClick={onNext} disabled={nextDisabled}>
        {nextLabel}
      </Button>
    )}
  </div>
);

const InfoBanner: React.FC<{ message: string }> = ({ message }) => (
  <div className="p-4 rounded-xl bg-blue-600/10 border border-blue-600/30 flex gap-3">
    <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
    <p className="text-sm text-slate-300">{message}</p>
  </div>
);

const Field: React.FC<{
  label: string;
  required?: boolean;
  children: React.ReactNode;
}> = ({ label, required, children }) => (
  <div>
    <Label>
      {label} {required && <span className="text-blue-400">*</span>}
    </Label>
    {children}
  </div>
);

const Step0Landing: React.FC = () => {
  const { formData, updateApplicantType, setCurrentStep } = useFormContext();
  const { applicantType } = formData;

  return (
    <div className="space-y-6">
      <StepHeader title="Select applicant type" subtitle="Choose the category that applies to you" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(['internal', 'external'] as const).map((type) => (
          <button
            key={type}
            onClick={() => updateApplicantType(type)}
            className={`p-6 rounded-xl border-2 transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
              applicantType === type
                ? 'border-blue-600 bg-blue-600/10'
                : 'border-slate-700/50 bg-slate-900/50 hover:border-slate-600'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center ${
                  applicantType === type ? 'bg-blue-600 border-blue-600' : 'border-slate-600'
                }`}
              >
                {applicantType === type && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-50 capitalize">
                  {type} student
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  {type === 'internal'
                    ? 'University of Sri Jayewardenepura'
                    : 'Other Sri Lankan state universities'}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <InfoBanner message="You must be a currently enrolled undergraduate at a Sri Lankan state university to apply. Your applicant type determines which awards you can apply for." />

      <div className="flex justify-end pt-2">
        <Button onClick={() => setCurrentStep(1)} disabled={!applicantType}>
          Continue →
        </Button>
      </div>
    </div>
  );
};

const Step1PersonalInfo: React.FC = () => {
  const { formData, updatePersonalInfo, setCurrentStep } = useFormContext();
  const { applicantType, personalInfo } = formData;
  const isExternal = applicantType === 'external';

  const isValid = () => {
    const { publicDisplayName, email, whatsappNumber, mobileNumber, gender } = personalInfo;
    if (!publicDisplayName || !email || !whatsappNumber || !mobileNumber || !gender) return false;
    if (isExternal && !personalInfo.nic) return false;
    return true;
  };

  return (
    <div className="space-y-6">
      <StepHeader title="Personal Information" subtitle="Step 1" />

      <Card className="space-y-5">
        <Field label="Public Display Name" required>
          <Input
            type="text"
            placeholder="Enter your display name"
            value={personalInfo.publicDisplayName || ''}
            onChange={(e) => updatePersonalInfo({ publicDisplayName: e.target.value })}
          />
        </Field>

        {isExternal && (
          <Field label="NIC" required>
            <Input
              type="text"
              placeholder="Enter your NIC number"
              value={personalInfo.nic || ''}
              onChange={(e) => updatePersonalInfo({ nic: e.target.value })}
            />
          </Field>
        )}

        <Field label="Gender" required>
          <Select
            value={personalInfo.gender || ''}
            onChange={(value) => updatePersonalInfo({ gender: value })}
            options={GENDER_OPTIONS}
            placeholder="Select gender"
          />
        </Field>

        <Field label="Email Address" required>
          <Input
            type="email"
            placeholder="Enter your email address"
            value={personalInfo.email || ''}
            onChange={(e) => updatePersonalInfo({ email: e.target.value })}
          />
        </Field>

        <Field label="WhatsApp Number" required>
          <Input
            type="tel"
            placeholder="Enter your WhatsApp number"
            value={personalInfo.whatsappNumber || ''}
            onChange={(e) => updatePersonalInfo({ whatsappNumber: e.target.value })}
          />
        </Field>

        <Field label="Mobile Number" required>
          <Input
            type="tel"
            placeholder="Enter your mobile number"
            value={personalInfo.mobileNumber || ''}
            onChange={(e) => updatePersonalInfo({ mobileNumber: e.target.value })}
          />
        </Field>
      </Card>

      <StepNav onBack={() => setCurrentStep(0)} onNext={() => setCurrentStep(2)} nextDisabled={!isValid()} />
    </div>
  );
};

const Step2AcademicInfo: React.FC = () => {
  const { formData, updateAcademicInfo, setCurrentStep } = useFormContext();
  const { applicantType, academicInfo } = formData;
  const isRecentGraduate = academicInfo.academicYear === 'recent-graduate';
  const academicYearOptions = ACADEMIC_YEARS.filter(
    (opt) => applicantType === 'internal' || opt.value !== 'recent-graduate'
  );

  const isValid = () => {
    const { university, universityRegistrationNumber, universityEmail, academicYear, faculty, degree } = academicInfo;
    return university && universityRegistrationNumber && universityEmail && academicYear && faculty && degree;
  };

  return (
    <div className="space-y-6">
      <StepHeader title="Academic Information" subtitle="Step 2" />

      {isRecentGraduate && (
        <InfoBanner message="Only recent graduates who completed their degree within one year of the release of their final examination results are eligible to apply for the Best Innovator Award." />
      )}

      <Card className="space-y-5">
        <Field label="University" required>
          <Input
            type="text"
            placeholder="Enter your university name"
            value={academicInfo.university || ''}
            onChange={(e) => updateAcademicInfo({ university: e.target.value })}
          />
        </Field>

        <Field label="University Registration Number" required>
          <Input
            type="text"
            placeholder="Enter your registration number"
            value={academicInfo.universityRegistrationNumber || ''}
            onChange={(e) => updateAcademicInfo({ universityRegistrationNumber: e.target.value })}
          />
        </Field>

        <Field label="University Email" required>
          <Input
            type="email"
            placeholder="Enter your university email"
            value={academicInfo.universityEmail || ''}
            onChange={(e) => updateAcademicInfo({ universityEmail: e.target.value })}
          />
        </Field>

        <Field label="Academic Year" required>
          <Select
            value={academicInfo.academicYear || ''}
            onChange={(value) => updateAcademicInfo({ academicYear: value })}
            options={academicYearOptions}
            placeholder="Select academic year"
          />
        </Field>

        <Field label="Faculty" required>
          <Select
            value={academicInfo.faculty || ''}
            onChange={(value) => updateAcademicInfo({ faculty: value })}
            options={FACULTIES.map((f) => ({ value: f, label: f }))}
            placeholder="Select faculty"
          />
        </Field>

        <Field label="Degree" required>
          <Input
            type="text"
            placeholder="Enter your degree name"
            value={academicInfo.degree || ''}
            onChange={(e) => updateAcademicInfo({ degree: e.target.value })}
          />
        </Field>

        <Field label="Other Degree">
          <Input
            type="text"
            placeholder="Enter any other degree if applicable"
            value={academicInfo.otherDegree || ''}
            onChange={(e) => updateAcademicInfo({ otherDegree: e.target.value })}
          />
        </Field>

        {isRecentGraduate && (
          <Field label="Graduation Year">
            <Input
              type="text"
              placeholder="Enter your graduation year"
              value={academicInfo.graduationYear || ''}
              onChange={(e) => updateAcademicInfo({ graduationYear: e.target.value })}
            />
          </Field>
        )}
      </Card>

      <StepNav onBack={() => setCurrentStep(1)} onNext={() => setCurrentStep(3)} nextDisabled={!isValid()} />
    </div>
  );
};

const Step3AwardSelection: React.FC = () => {
  const { formData, updateAwardSelection, setCurrentStep } = useFormContext();
  const { applicantType, academicInfo, awardSelection } = formData;
  const { selectedAwards = [], hasConditionalAwards = false } = awardSelection;
  const isInternal = applicantType === 'internal';
  const isRecentGraduate = academicInfo.academicYear === 'recent-graduate';
  const faculty = academicInfo.faculty;

  const getAvailableAwards = (): { id: AwardType; label: string }[] => {
    if (isRecentGraduate) {
      return [{ id: 'best-innovator' as AwardType, label: JESA_AWARDS['best-innovator'] }];
    }
    if (isInternal) {
      const awards: { id: AwardType; label: string }[] = [];
      Object.entries(JESA_AWARDS).forEach(([id, label]) => {
        awards.push({ id: id as AwardType, label });
      });
      awards.push({ id: 'besa-inter-university', label: BESA_AWARDS['besa-inter-university'] });
      if (faculty && BESA_FACULTY_MAP[faculty]) {
        awards.push({ id: BESA_FACULTY_MAP[faculty], label: BESA_AWARDS[BESA_FACULTY_MAP[faculty]] });
      }
      return awards;
    }
    return [
      { id: 'besa-inter-university' as AwardType, label: BESA_AWARDS['besa-inter-university'] },
      { id: 'best-innovator' as AwardType, label: JESA_AWARDS['best-innovator'] },
    ];
  };

  const availableAwards = getAvailableAwards();

  const handleAwardToggle = (awardId: AwardType) => {
    const newSelectedAwards = selectedAwards.includes(awardId)
      ? selectedAwards.filter((id) => id !== awardId)
      : [...selectedAwards, awardId];

    const hasConditional =
      newSelectedAwards.includes('best-innovator') ||
      newSelectedAwards.includes('best-csr');

    updateAwardSelection({
      selectedAwards: newSelectedAwards,
      hasConditionalAwards: hasConditional,
    });
  };

  const isValid = () => {
    if (isRecentGraduate) return selectedAwards.length >= 1;
    return selectedAwards.length >= 1;
  };

  const handleContinue = () => {
    if (isValid()) {
      if (hasConditionalAwards) {
        setCurrentStep(4);
      } else {
        setCurrentStep(5);
      }
    }
  };

  return (
    <div className="space-y-6">
      <StepHeader title="Award Selection" subtitle="Step 3" />

      {isRecentGraduate ? (
        <InfoBanner message="Recent Graduates are only eligible to apply for the Best Innovator Award." />
      ) : (
        <InfoBanner
          message={
            isInternal
              ? 'Select a minimum of 1 award and a maximum of 2 + BESA – Inter University Award'
              : 'Select 1 or more awards from the available options.'
          }
        />
      )}

      <Card className="space-y-3">
        {availableAwards.map(({ id, label }) => (
          <div key={id} className="flex items-center gap-3 py-1">
            <input
              type="checkbox"
              id={id}
              checked={selectedAwards.includes(id)}
              onChange={() => handleAwardToggle(id)}
              className="mt-0.5 w-5 h-5 shrink-0 rounded border-2 border-slate-600 bg-slate-900/80 cursor-pointer accent-blue-600 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            />
            <label htmlFor={id} className="text-slate-200 cursor-pointer flex-1 text-sm">
              {label}
            </label>
          </div>
        ))}
      </Card>

      <p className="text-sm text-slate-400">
        Selected: {selectedAwards.length} award{selectedAwards.length !== 1 ? 's' : ''}
      </p>

      <StepNav onBack={() => setCurrentStep(2)} onNext={handleContinue} nextDisabled={!isValid()} />
    </div>
  );
};

const Step4AwardQuestions: React.FC = () => {
  const { formData, updateBestInnovatorQuestions, updateBestCSRQuestions, setCurrentStep } = useFormContext();
  const { awardSelection, bestInnovatorQuestions, bestCSRQuestions } = formData;
  const { selectedAwards = [] } = awardSelection;

  const hasBestInnovator = selectedAwards.includes('best-innovator');
  const hasBestCSR = selectedAwards.includes('best-csr');

  const isInnovatorValid = () => {
    if (!hasBestInnovator) return true;
    const { industry, otherIndustry, innovationCompletionPercentage } = bestInnovatorQuestions || {};
    if (!industry) return false;
    if (industry === 'Other' && !otherIndustry) return false;
    return innovationCompletionPercentage === true;
  };

  const isCSRValid = () => {
    if (!hasBestCSR) return true;
    const csr = bestCSRQuestions;
    return (
      csr?.clubAdvisorNameTitle &&
      csr?.clubAdvisorEmail &&
      csr?.memberAttendingName &&
      csr?.memberAttendingWhatsapp &&
      csr?.clubPresidentName &&
      csr?.clubPresidentWhatsapp &&
      csr?.clubPresidentEmail
    );
  };

  const isValid = () => isInnovatorValid() && isCSRValid();

  return (
    <div className="space-y-6">
      <StepHeader title="Award Questions" subtitle="Step 4" />

      {hasBestInnovator && (
        <Card className="space-y-5">
          <h3 className="text-lg font-semibold text-slate-50">Best Innovator Award</h3>

          <Field label="Which industry is your innovation related to?" required>
            <Select
              value={bestInnovatorQuestions?.industry || ''}
              onChange={(value) => updateBestInnovatorQuestions({ industry: value })}
              options={INDUSTRIES.map((ind) => ({ value: ind, label: ind }))}
              placeholder="Select industry"
            />
          </Field>

          {bestInnovatorQuestions?.industry === 'Other' && (
            <Field label="Please specify your industry" required>
              <Input
                type="text"
                placeholder="Enter your industry"
                value={bestInnovatorQuestions?.otherIndustry || ''}
                onChange={(e) => updateBestInnovatorQuestions({ otherIndustry: e.target.value })}
              />
            </Field>
          )}

          <Checkbox
            id="innovationCompletion"
            checked={bestInnovatorQuestions?.innovationCompletionPercentage === true}
            onChange={(checked) =>
              updateBestInnovatorQuestions({ innovationCompletionPercentage: checked })
            }
            label="I declare that my innovation is more than 75% completed"
          />
        </Card>
      )}

      {hasBestCSR && (
        <Card className="space-y-5">
          <h3 className="text-lg font-semibold text-slate-50">Best CSR Award</h3>

          <div className="space-y-5 pb-5 border-b border-slate-700/50">
            <h4 className="text-sm font-semibold text-slate-300">Club Advisor Information</h4>

            <Field label="Club Advisor Name & Title" required>
              <Input
                type="text"
                placeholder="Enter advisor name and title"
                value={bestCSRQuestions?.clubAdvisorNameTitle || ''}
                onChange={(e) => updateBestCSRQuestions({ clubAdvisorNameTitle: e.target.value })}
              />
            </Field>

            <Field label="Club Advisor Email" required>
              <Input
                type="email"
                placeholder="Enter advisor email"
                value={bestCSRQuestions?.clubAdvisorEmail || ''}
                onChange={(e) => updateBestCSRQuestions({ clubAdvisorEmail: e.target.value })}
              />
            </Field>
          </div>

          <div className="space-y-5 pb-5 border-b border-slate-700/50">
            <h4 className="text-sm font-semibold text-slate-300">Member Attending Interview & Workshops</h4>

            <Field label="Member Name" required>
              <Input
                type="text"
                placeholder="Enter member name"
                value={bestCSRQuestions?.memberAttendingName || ''}
                onChange={(e) => updateBestCSRQuestions({ memberAttendingName: e.target.value })}
              />
            </Field>

            <Field label="Member WhatsApp Number" required>
              <Input
                type="tel"
                placeholder="Enter member WhatsApp number"
                value={bestCSRQuestions?.memberAttendingWhatsapp || ''}
                onChange={(e) => updateBestCSRQuestions({ memberAttendingWhatsapp: e.target.value })}
              />
            </Field>
          </div>

          <div className="space-y-5">
            <h4 className="text-sm font-semibold text-slate-300">Club President Information</h4>

            <Field label="Club President Name" required>
              <Input
                type="text"
                placeholder="Enter president name"
                value={bestCSRQuestions?.clubPresidentName || ''}
                onChange={(e) => updateBestCSRQuestions({ clubPresidentName: e.target.value })}
              />
            </Field>

            <Field label="Club President WhatsApp Number" required>
              <Input
                type="tel"
                placeholder="Enter president WhatsApp number"
                value={bestCSRQuestions?.clubPresidentWhatsapp || ''}
                onChange={(e) => updateBestCSRQuestions({ clubPresidentWhatsapp: e.target.value })}
              />
            </Field>

            <Field label="Club President Email" required>
              <Input
                type="email"
                placeholder="Enter president email"
                value={bestCSRQuestions?.clubPresidentEmail || ''}
                onChange={(e) => updateBestCSRQuestions({ clubPresidentEmail: e.target.value })}
              />
            </Field>
          </div>
        </Card>
      )}

      <StepNav onBack={() => setCurrentStep(3)} onNext={() => setCurrentStep(5)} nextDisabled={!isValid()} />
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

  const isValid = () => confirmAccuracy && agreeDisqualification && agreePhysicalInterview && permitVerification && consentPublicity;

  const handleSubmit = () => {
    if (isValid()) {
      console.log('Application submitted:', formData);
      alert('Application submitted successfully!');
    }
  };

  const handleBack = () => {
    setCurrentStep(hasConditionalAwards ? 4 : 3);
  };

  return (
    <div className="space-y-6">
      <StepHeader title="Declaration" subtitle={hasConditionalAwards ? 'Step 5' : 'Step 4'} />

      <Card className="space-y-5">
        <Checkbox
          id="confirmAccuracy"
          checked={confirmAccuracy}
          onChange={(checked) => updateDeclaration({ confirmAccuracy: checked })}
          label="I confirm all provided information is true."
        />
        <Checkbox
          id="agreeDisqualification"
          checked={agreeDisqualification}
          onChange={(checked) => updateDeclaration({ agreeDisqualification: checked })}
          label="I agree that false information will result in disqualification."
        />
        <Checkbox
          id="agreePhysicalInterview"
          checked={agreePhysicalInterview}
          onChange={(checked) => updateDeclaration({ agreePhysicalInterview: checked })}
          label="I agree that not attending physical interview on the given date will result in disqualification."
        />
        <Checkbox
          id="permitVerification"
          checked={permitVerification}
          onChange={(checked) => updateDeclaration({ permitVerification: checked })}
          label="I permit the organizing committee to verify my submissions."
        />
        <Checkbox
          id="consentPublicity"
          checked={consentPublicity}
          onChange={(checked) => updateDeclaration({ consentPublicity: checked })}
          label="I consent to the use of my name, photograph, and submitted materials for publicity related to the awards."
        />
      </Card>

      {isValid() && (
        <div className="p-4 rounded-xl bg-green-600/10 border border-green-600/30 flex gap-3">
          <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-300">
            All declarations accepted. You're ready to submit your application.
          </p>
        </div>
      )}

      <StepNav onBack={handleBack} onNext={handleSubmit} nextDisabled={!isValid()} nextLabel="Submit Application" />
    </div>
  );
};

const Sidebar: React.FC = () => {
  const { currentStep, setCurrentStep, formData } = useFormContext();
  const { hasConditionalAwards = false } = formData.awardSelection;

  const steps = [1, 2, 3, 4, 5];

  const getStepTitle = (step: number) => {
    if (step === 4 && !hasConditionalAwards) return 'Declaration';
    return STEP_TITLES[step as keyof typeof STEP_TITLES];
  };

  const isStepActive = (step: number) => {
    if (currentStep === 0) return step === 1;
    if (!hasConditionalAwards && step === 4) return false;
    return step === currentStep;
  };

  const isStepCompleted = (step: number) => {
    const adjustedStep = currentStep === 0 ? 0 : !hasConditionalAwards && currentStep > 3 ? currentStep - 1 : currentStep;
    return step < (currentStep === 0 ? 1 : adjustedStep);
  };

  return (
    <aside className="w-full lg:w-60 xl:w-64 shrink-0">
      <div className="lg:sticky lg:top-28 space-y-6">
        <div className="hidden lg:block space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">JESA 2026</p>
          <h1 className="text-xl font-bold text-slate-50">Awards Application</h1>
        </div>

        <nav className="flex lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {steps.map((step) => (
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
                  ? 'bg-blue-600/20 text-blue-300'
                  : isStepCompleted(step)
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  : 'text-slate-600 cursor-not-allowed'
              }`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 font-semibold text-sm shrink-0 ${
                  isStepActive(step)
                    ? 'border-blue-400 bg-blue-600 text-white'
                    : isStepCompleted(step)
                    ? 'border-blue-600 bg-blue-600/20 text-blue-300'
                    : 'border-slate-700 text-slate-600'
                }`}
              >
                {isStepCompleted(step) ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step
                )}
              </div>
              <div className="flex-1 min-w-0 hidden lg:block">
                <div className="text-sm font-medium truncate">{getStepTitle(step)}</div>
                <div className="text-xs text-slate-500">Step {step}</div>
              </div>
            </button>
          ))}
        </nav>

        <div className="hidden lg:block pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Progress</span>
            <span>{currentStep === 0 ? 'Start' : `${currentStep} of 5`}</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(Math.max(0, currentStep) / 5) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default function NewRegistrationForm2026() {
  const [formData, setFormData] = useState<ApplicationFormData>(INITIAL_FORM_DATA);
  const [currentStep, setCurrentStep] = useState(0);

  const updateApplicantType = useCallback((type: ApplicantType) => {
    setFormData((prev) => ({ ...prev, applicantType: type }));
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

  const updateAwardSelection = useCallback((selection: Partial<AwardSelection>) => {
    setFormData((prev) => ({
      ...prev,
      awardSelection: { ...prev.awardSelection, ...selection },
    }));
  }, []);

  const updateBestInnovatorQuestions = useCallback((questions: Partial<BestInnovatorQuestions>) => {
    setFormData((prev) => ({
      ...prev,
      bestInnovatorQuestions: { ...prev.bestInnovatorQuestions, ...questions },
    }));
  }, []);

  const updateBestCSRQuestions = useCallback((questions: Partial<BestCSRQuestions>) => {
    setFormData((prev) => ({
      ...prev,
      bestCSRQuestions: { ...prev.bestCSRQuestions, ...questions },
    }));
  }, []);

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
      case 0: return <Step0Landing />;
      case 1: return <Step1PersonalInfo />;
      case 2: return <Step2AcademicInfo />;
      case 3: return <Step3AwardSelection />;
      case 4: return <Step4AwardQuestions />;
      case 5: return <Step5Declaration />;
      default: return <Step0Landing />;
    }
  };

  return (
    <FormContext.Provider value={contextValue}>
      <div className="min-h-screen bg-slate-950 pb-16 lg:pb-24">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
            <Sidebar />
            <main className="flex-1 min-w-0 max-w-3xl">
              {renderStep()}
            </main>
          </div>
        </div>
      </div>
    </FormContext.Provider>
  );
}
