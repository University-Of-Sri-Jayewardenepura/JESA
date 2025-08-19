/**
 * Script to read internal & external applicant JSON backups,
 * group participants by each award (Award1/Award2/Award3),
 * and write one CSV per award (expected 17) including full participant info.
 * Output: /data/awards/*.csv
 *
 * Run (from project root):
 *   npx ts-node data/data.ts
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
const outputDir = path.join(__dirname, "awards");

const externalPath = path.join(backupsDir, "externalApplicants.json");
const internalPath = path.join(backupsDir, "internalApplicants.json");

function readJsonArray(file: string): AnyRec[] {
  if (!fs.existsSync(file)) {
    console.error(`Missing file: ${file}`);
    return [];
  }
  const raw = fs.readFileSync(file, "utf8");
  try {
    const data = JSON.parse(raw);
    if (Array.isArray(data)) return data;
  } catch (e) {
    console.error(`Failed parsing ${file}:`, e);
  }
  return [];
}

const external: Applicant[] = readJsonArray(externalPath).map((r: AnyRec) => ({
  ...r,
  Source: "External",
}));
const internal: Applicant[] = readJsonArray(internalPath).map((r: AnyRec) => ({
  ...r,
  Source: "Internal",
}));

// Filter out empty placeholder objects (those without Name)
const allApplicants: Applicant[] = [...external, ...internal].filter(
  (a: Applicant) => a && a.Name
);

// Collect all award names dynamically
const awardFields = ["Award1", "Award2", "Award3"];
const awardSet = new Set<string>();
for (const applicant of allApplicants) {
  for (const field of awardFields) {
    const val = applicant[field];
    if (val && typeof val === "string") {
      awardSet.add(val.trim());
    }
  }
}

// Build unified header (union of all keys)
const allKeysSet = new Set<string>();
for (const a of allApplicants) {
  Object.keys(a).forEach((k) => allKeysSet.add(k));
}
const preferredOrder = [
  "Source",
  "ApplicantId",
  "_id",
  "Name",
  "NIC",
  "Gender",
  "Email",
  "Whatsapp",
  "University",
  "Faculty",
  "UniversityRegisterId",
  "AcademicYear",
  "Degree",
  "OtherDegree",
  "WhichIndustry",
  "Award1",
  "Award2",
  "Award3",
  "createdAt",
  "updatedAt",
  "__v",
];

// Final ordered headers: preferred first if present, then remaining alphabetically
const allKeys = [
  ...preferredOrder.filter((k) => allKeysSet.has(k)),
  ...Array.from(allKeysSet)
    .filter((k) => !preferredOrder.includes(k))
    .sort(),
];

// CSV escape
function esc(val: any): string {
  if (val === null || val === undefined) return "";
  let s = String(val);
  if (s.includes('"')) s = s.replace(/"/g, '""');
  if (/[",\n]/.test(s)) s = `"${s}"`;
  return s;
}

// Ensure output directory
fs.mkdirSync(outputDir, { recursive: true });

// Helper to create safe filename
function safeFileName(award: string): string {
  return award
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, "_")
    .replace(/^_+|_+$/g, "");
}

let totalFiles = 0;

for (const award of Array.from(awardSet).sort()) {
  const participants = allApplicants.filter((a) =>
    awardFields.some((f) => (a[f] || "").trim() === award)
  );
  if (!participants.length) continue;

  const rows = [
    allKeys.join(","),
    ...participants.map((p) => allKeys.map((k) => esc(p[k])).join(",")),
  ];

  const fileName = `${safeFileName(award)}.csv`;
  const outPath = path.join(outputDir, fileName);
  fs.writeFileSync(outPath, rows.join("\n"), "utf8");
  totalFiles++;
  console.log(`Wrote ${fileName} (${participants.length} records)`);
}

console.log(`Done. Generated ${totalFiles} award CSV file(s)`);
