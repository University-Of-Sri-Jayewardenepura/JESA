import csv from "csv-parser";
import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";
import connectMongoDB from "@/lib/mongodb";
import RegTable from "@/models/RegTable";

// Award prefix mapping based on check-registration-form.tsx
const awardPrefixes: { [key: string]: string } = {
  "Best Team Player": "TP",
  "Best Leader": "BL",
  "Best Communicator": "BC",
  "Best Creative Designer": "CD",
  "Best Young Entrepreneur": "YE",
  "Best Innovator": "BI",
  "Best CSR Award": "CSR",
  "BESA - FMSC": "FMSC",
  "BESA - FHSS": "FHSS",
  "BESA - FAS": "FAS",
  "BESA - FOT": "FOT",
  "BESA - FAHS": "FAHS",
  "BESA - FOE": "FOE",
  "BESA - FMS": "FMS",
  "BESA - FDS": "FDS",
  "BESA - FUAB": "FUAB",
  "BESA - Inter University Award": "IU",
};

interface ApplicantData {
  Name: string;
  Email: string;
  Whatsapp: string;
  Award1?: string;
  Award2?: string;
  Award3?: string;
}

interface RegTableData {
  Name: string;
  Email: string;
  Whatsapp: string;
  RegNo: string;
}

// Counter for each award type to generate unique registration numbers
const counters: { [key: string]: number } = {};

function generateRegNo(award: string): string {
  const prefix = awardPrefixes[award];
  if (!prefix) {
    console.warn(`No prefix found for award: ${award}`);
    return `UNK${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }

  if (!counters[prefix]) {
    counters[prefix] = 0;
  }

  counters[prefix]++;
  return `${prefix}${counters[prefix].toString().padStart(3, "0")}`;
}

async function readCSVFile(filePath: string): Promise<ApplicantData[]> {
  return new Promise((resolve, reject) => {
    const results: ApplicantData[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data: any) => {
        if (data.Name && data.Email && data.Whatsapp) {
          results.push({
            Name: data.Name.trim(),
            Email: data.Email.trim(),
            Whatsapp: data.Whatsapp.trim(),
            Award1: data.Award1?.trim(),
            Award2: data.Award2?.trim(),
            Award3: data.Award3?.trim(),
          });
        }
      })
      .on("end", () => resolve(results))
      .on("error", reject);
  });
}

async function readExcelFile(filePath: string): Promise<ApplicantData[]> {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet);

  return jsonData
    .filter((row: any) => row.Name && row.Email && row.Whatsapp)
    .map((row: any) => ({
      Name: row.Name?.toString().trim(),
      Email: row.Email?.toString().trim(),
      Whatsapp: row.Whatsapp?.toString().trim(),
      Award1: row.Award1?.toString().trim(),
      Award2: row.Award2?.toString().trim(),
      Award3: row.Award3?.toString().trim(),
    }));
}

async function processAwardFiles() {
  const awardsDir = path.join(process.cwd(), "data", "awards");
  const files = fs.readdirSync(awardsDir);

  const allApplicants: ApplicantData[] = [];

  for (const file of files) {
    const filePath = path.join(awardsDir, file);
    const ext = path.extname(file).toLowerCase();

    console.log(`Processing file: ${file}`);

    try {
      let applicants: ApplicantData[] = [];

      if (ext === ".csv") {
        applicants = await readCSVFile(filePath);
      } else if (ext === ".xlsx" || ext === ".xls") {
        applicants = await readExcelFile(filePath);
      } else {
        console.log(`Skipping file with unsupported extension: ${file}`);
        continue;
      }

      allApplicants.push(...applicants);
      console.log(`Processed ${applicants.length} applicants from ${file}`);
    } catch (error) {
      console.error(`Error processing file ${file}:`, error);
    }
  }

  return allApplicants;
}

function generateRegTableEntries(applicants: ApplicantData[]): RegTableData[] {
  const regTableEntries: RegTableData[] = [];
  const processedCombinations = new Set<string>(); // Track WhatsApp+Award combinations to avoid duplicates

  for (const applicant of applicants) {
    // Process all awards for each applicant
    const awards = [
      applicant.Award1,
      applicant.Award2,
      applicant.Award3,
    ].filter(Boolean);

    for (const award of awards) {
      if (award && awardPrefixes[award]) {
        // Create unique key for WhatsApp + Award combination
        const combinationKey = `${applicant.Whatsapp}-${award}`;

        // Skip if this person already has this specific award
        if (processedCombinations.has(combinationKey)) {
          console.log(
            `Skipping duplicate: ${applicant.Name} already has ${award}`
          );
          continue;
        }

        const regNo = generateRegNo(award);

        const regTableEntry: RegTableData = {
          Name: applicant.Name,
          Email: applicant.Email,
          Whatsapp: applicant.Whatsapp,
          RegNo: regNo,
        };

        regTableEntries.push(regTableEntry);
        processedCombinations.add(combinationKey);

        console.log(
          `Generated RegNo ${regNo} for ${applicant.Name} (${award})`
        );
      }
    }

    // Check if no valid awards were found for this applicant
    if (
      awards.length === 0 ||
      !awards.some((award) => award && awardPrefixes[award])
    ) {
      console.warn(
        `No valid award found for applicant: ${
          applicant.Name
        } - Awards: ${awards.join(", ")}`
      );
    }
  }

  return regTableEntries;
}

async function populateDatabase(regTableEntries: RegTableData[]) {
  try {
    await connectMongoDB();

    // Clear existing data
    await RegTable.deleteMany({});
    console.log("Cleared existing RegTable data");

    // Insert new data
    const result = await RegTable.insertMany(regTableEntries);
    console.log(`Successfully inserted ${result.length} records into RegTable`);

    // Display summary by award type
    const summary: { [key: string]: number } = {};
    for (const entry of regTableEntries) {
      const prefix = entry.RegNo.replace(/\d+$/, "");
      summary[prefix] = (summary[prefix] || 0) + 1;
    }

    console.log("\nSummary by award type:");
    Object.entries(summary).forEach(([prefix, count]) => {
      const awardName = Object.keys(awardPrefixes).find(
        (award) => awardPrefixes[award] === prefix
      );
      console.log(`${prefix} (${awardName}): ${count} records`);
    });
  } catch (error) {
    console.error("Error populating database:", error);
    throw error;
  }
}

async function main() {
  try {
    console.log("Starting RegTable population process...");

    // Process all award files
    const applicants = await processAwardFiles();
    console.log(`\nTotal applicants found: ${applicants.length}`);

    // Generate RegTable entries
    const regTableEntries = generateRegTableEntries(applicants);
    console.log(
      `\nGenerated ${regTableEntries.length} unique RegTable entries`
    );

    // Populate database
    await populateDatabase(regTableEntries);

    console.log("\nRegTable population completed successfully!");
  } catch (error) {
    console.error("Error in main process:", error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export default main;
