/**
 * Generate per-award vCard (.vcf) files containing all WhatsApp contacts
 * for applicants of that award.
 * One file per award (expected 17) at: /data/contacts/*.vcf
 *
 * Contact naming inside each vCard:
 *   <Award Name> Contact <running number>
 * (original participant name added in NOTE)
 *
 * Run (from project root):
 *   npx ts-node data/contacts.ts
 */

import * as fs from "fs";
import * as path from "path";

type AnyRec = Record<string, any>;

interface Applicant extends AnyRec {
  Name?: string;
  Whatsapp?: string;
  Source: string;
  [key: string]: any;
}

const rootDir = path.resolve(__dirname, ".."); // /data -> root
const backupsDir = path.join(rootDir, "backups", "recent");
const outputDir = path.join(__dirname, "contacts");

const externalPath = path.join(backupsDir, "externalApplicants.json");
const internalPath = path.join(backupsDir, "internalApplicants.json");

function readJsonArray(file: string): AnyRec[] {
  if (!fs.existsSync(file)) {
    console.error(`Missing file: ${file}`);
    return [];
  }
  try {
    const raw = fs.readFileSync(file, "utf8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error(`Failed parsing ${file}:`, e);
    return [];
  }
}

const external: Applicant[] = readJsonArray(externalPath).map((r: AnyRec) => ({
  ...r,
  Source: "External",
}));
const internal: Applicant[] = readJsonArray(internalPath).map((r: AnyRec) => ({
  ...r,
  Source: "Internal",
}));
const allApplicants: Applicant[] = [...external, ...internal].filter(
  (a: Applicant) => a && (a.Name || a.Whatsapp)
);

const awardFields = ["Award1", "Award2", "Award3"];

// Collect award names (trimmed, non-empty)
const awardSet = new Set<string>();
for (const a of allApplicants) {
  for (const f of awardFields) {
    const v = (a[f] || "").toString().trim();
    if (v) awardSet.add(v);
  }
}

// Helpers
function safeFileName(award: string): string {
  return award
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, "_")
    .replace(/^_+|_+$/g, "");
}

function formatPhone(raw: any): string | null {
  if (raw === null || raw === undefined) return null;
  let digits = String(raw).replace(/\D+/g, "");
  if (!digits) return null;
  // Remove leading zeros (common local format)
  if (digits.startsWith("0")) digits = digits.replace(/^0+/, "");
  // Ensure length reasonable (Sri Lanka numbers normally 9 without leading 0)
  if (digits.length < 7) return null;
  return `+94${digits}`;
}

function buildVCard(
  index: number,
  award: string,
  applicant: Applicant,
  phone: string
): string {
  const awardLabel = award;
  const contactName = `${awardLabel} Contact ${index}`;
  const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  // vCard 3.0
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${contactName}`,
    `N:${contactName};;;;`,
    `TEL;TYPE=CELL:${phone}`,
    applicant.Name
      ? `NOTE:Participant Name: ${escapeText(applicant.Name)}`
      : "NOTE:Participant",
    applicant.Email ? `EMAIL;TYPE=INTERNET:${escapeText(applicant.Email)}` : "",
    applicant.University ? `ORG:${escapeText(applicant.University)}` : "",
    `REV:${now}`,
    "END:VCARD",
  ]
    .filter(Boolean)
    .join("\n");
}

function escapeText(s: string): string {
  return s.replace(/[\r\n]+/g, " ").replace(/[,;]/g, " ");
}

fs.mkdirSync(outputDir, { recursive: true });

let fileCount = 0;

for (const award of Array.from(awardSet).sort()) {
  // Participants having this award in any Award field
  const participants = allApplicants.filter((a) =>
    awardFields.some((f) => (a[f] || "").toString().trim() === award)
  );

  // Collect unique phone numbers (avoid duplicates per award)
  const seen = new Set<string>();
  const vCards: string[] = [];
  let idx = 0;

  for (const p of participants) {
    const phone = formatPhone(p.Whatsapp);
    if (!phone) continue;
    if (seen.has(phone)) continue;
    seen.add(phone);
    idx++;
    vCards.push(buildVCard(idx, award, p, phone));
  }

  if (!vCards.length) continue;

  const fileName = `${safeFileName(award)}.vcf`;
  const outPath = path.join(outputDir, fileName);
  fs.writeFileSync(outPath, vCards.join("\n"), "utf8");
  console.log(`Wrote ${fileName} (${vCards.length} contact(s))`);
  fileCount++;
}

console.log(
  `Done. Generated ${fileCount} award contact file(s) in ${outputDir}`
);
