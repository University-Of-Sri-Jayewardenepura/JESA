import facultyInformationJson from "./faculty-information.json";

export const FACULTY_OTHER_DEGREE = "Other";

export type FacultyInformation = typeof facultyInformationJson;
export type FacultyCode = keyof FacultyInformation["faculties"];
export type FacultyConfig = FacultyInformation["faculties"][FacultyCode];

export const FACULTY_INFORMATION = facultyInformationJson.faculties;

export const FACULTY_CODES = Object.keys(FACULTY_INFORMATION) as FacultyCode[];

export const isFacultyCode = (value: string): value is FacultyCode =>
  value in FACULTY_INFORMATION;

export const getFacultyConfig = (faculty?: string): FacultyConfig | undefined =>
  faculty && isFacultyCode(faculty) ? FACULTY_INFORMATION[faculty] : undefined;

export const getFacultyOptions = () =>
  FACULTY_CODES.map((code) => ({
    value: code,
    label: `${code} - ${FACULTY_INFORMATION[code].name}`,
  }));

export const getFacultyDegreeOptions = (faculty?: string) => {
  const config = getFacultyConfig(faculty);
  return config
    ? [
        ...config.degrees.map((degree) => ({ value: degree, label: degree })),
        { value: FACULTY_OTHER_DEGREE, label: FACULTY_OTHER_DEGREE },
      ]
    : [];
};

export const buildFacultyRegistrationNumber = (
  config: FacultyConfig,
  localPart: string
) => `${config.registration.prefix}${localPart}`;

export const buildFacultyEmail = (config: FacultyConfig, localPart: string) =>
  `${localPart}${config.email.suffix}`;

export const extractFacultyRegistrationLocalPart = (
  config: FacultyConfig,
  value?: string
) => {
  const raw = value ?? "";
  const withoutPrefix = raw.startsWith(config.registration.prefix)
    ? raw.slice(config.registration.prefix.length)
    : raw;
  return withoutPrefix.replace(/\D/g, "").slice(0, 6);
};

export const extractFacultyEmailLocalPart = (
  config: FacultyConfig,
  value?: string
) => {
  let local = value ?? "";

  if (local.endsWith(config.email.suffix)) {
    local = local.slice(0, -config.email.suffix.length);
  } else if (local.includes("@")) {
    local = local.split("@")[0] ?? "";
  }

  return local;
};

export const normalizeFacultyEmailLocalPart = (
  config: FacultyConfig,
  value: string
) => {
  const extracted = extractFacultyEmailLocalPart(config, value);
  return extracted.replace(/[^a-zA-Z0-9._%+-]/g, "");
};

export const validateFacultyRegistrationNumber = (
  faculty: string | undefined,
  value: string | undefined
) => {
  const config = getFacultyConfig(faculty);
  return Boolean(config && value && new RegExp(config.registration.regex).test(value));
};

export const validateFacultyEmail = (
  faculty: string | undefined,
  value: string | undefined
) => {
  const config = getFacultyConfig(faculty);
  if (!config || !value) return false;

  const parts = value.split("@");
  if (parts.length !== 2) return false;

  const [localPart, domainPart] = parts;
  const suffix = config.email.suffix;
  return Boolean(
    localPart &&
      domainPart &&
      value.endsWith(suffix) &&
      /^[a-zA-Z0-9._%+-]+$/.test(localPart)
  );
};

export const validateFacultyDegree = (
  faculty: string | undefined,
  degree: string | undefined,
  otherDegree?: string
) => {
  const config = getFacultyConfig(faculty);
  if (!config || !degree) return false;
  if (degree === FACULTY_OTHER_DEGREE) return Boolean(otherDegree?.trim());
  return config.degrees.includes(degree);
};
