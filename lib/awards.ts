export type AwardType =
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

export type AwardCategory = "jesa" | "besa" | "all";

export const JESA_AWARDS: Record<AwardType, string> = {
  "best-leader": "Best Leader",
  "best-team-player": "Best Team Player",
  "best-creative-designer": "Best Creative Designer",
  "best-communicator": "Best Communicator",
  "best-innovator": "Best Innovator",
  "best-young-entrepreneur": "Best Young Entrepreneur",
  "best-csr": "Best CSR",
  "besa-inter-university": "BESA – Inter University Award",
  "besa-fhss": "BESA – FHSS",
  "besa-fas": "BESA – FAS",
  "besa-fmsc": "BESA – FMSC",
  "besa-fms": "BESA – FMS",
  "besa-fot": "BESA – FOT",
  "besa-foe": "BESA – FOE",
  "besa-fahs": "BESA – FAHS",
  "besa-fuab": "BESA – FUAB",
  "besa-fds": "BESA – FDS",
};

export const AWARD_CATEGORIES: Record<AwardType, AwardCategory> = {
  "best-leader": "jesa",
  "best-team-player": "jesa",
  "best-creative-designer": "jesa",
  "best-communicator": "jesa",
  "best-innovator": "jesa",
  "best-young-entrepreneur": "jesa",
  "best-csr": "jesa",
  "besa-inter-university": "besa",
  "besa-fhss": "besa",
  "besa-fas": "besa",
  "besa-fmsc": "besa",
  "besa-fms": "besa",
  "besa-fot": "besa",
  "besa-foe": "besa",
  "besa-fahs": "besa",
  "besa-fuab": "besa",
  "besa-fds": "besa",
};

export const JESA_AWARD_IDS: AwardType[] = [
  "best-leader",
  "best-team-player",
  "best-creative-designer",
  "best-communicator",
  "best-innovator",
  "best-young-entrepreneur",
  "best-csr",
];

export const BESA_AWARD_IDS: AwardType[] = [
  "besa-inter-university",
  "besa-fhss",
  "besa-fas",
  "besa-fmsc",
  "besa-fms",
  "besa-fot",
  "besa-foe",
  "besa-fahs",
  "besa-fuab",
  "besa-fds",
];

export const ALL_AWARD_IDS: AwardType[] = [...JESA_AWARD_IDS, ...BESA_AWARD_IDS];

export const FACULTIES = [
  "FHSS",
  "FAS",
  "FMSC",
  "FMS",
  "FOT",
  "FOE",
  "FAHS",
  "FUAB",
  "FDS",
] as const;

export const BESA_FACULTY_MAP: Record<string, AwardType> = {
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

export function getAwardLabel(id: AwardType | string): string {
  return JESA_AWARDS[id as AwardType] || id;
}

export function getAwardCategory(id: AwardType | string): AwardCategory {
  return AWARD_CATEGORIES[id as AwardType] || "jesa";
}

export function isBesaAward(id: AwardType | string): boolean {
  return getAwardCategory(id) === "besa";
}
