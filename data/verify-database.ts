import csv from "csv-parser";
import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";
import connectMongoDB from "@/lib/mongodb";
import RegTable from "@/models/RegTable";

interface ApplicantData {
  Name: string;
  Email: string;
  Whatsapp: string;
  Award1?: string;
  Award2?: string;
  Award3?: string;
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
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.worksheets[0];

  const results: ApplicantData[] = [];
  const headers: string[] = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      // First row is headers
      row.eachCell((cell) => {
        headers.push(cell.value?.toString() || "");
      });
    } else {
      // Data rows
      const rowData: Record<string, string> = {};
      row.eachCell((cell, colNumber) => {
        const header = headers[colNumber - 1];
        if (header) {
          rowData[header] = cell.value?.toString()?.trim() || "";
        }
      });

      if (rowData.Name && rowData.Email && rowData.Whatsapp) {
        results.push({
          Name: rowData.Name,
          Email: rowData.Email,
          Whatsapp: rowData.Whatsapp,
          Award1: rowData.Award1,
          Award2: rowData.Award2,
          Award3: rowData.Award3,
        });
      }
    }
  });

  return results;
}

async function getAllSourceData(): Promise<ApplicantData[]> {
  const awardsDir = path.join(process.cwd(), "data", "awards");
  const files = fs.readdirSync(awardsDir);

  const allApplicants: ApplicantData[] = [];

  for (const file of files) {
    const filePath = path.join(awardsDir, file);
    const ext = path.extname(file).toLowerCase();

    try {
      let applicants: ApplicantData[] = [];

      if (ext === ".csv") {
        applicants = await readCSVFile(filePath);
      } else if (ext === ".xlsx" || ext === ".xls") {
        applicants = await readExcelFile(filePath);
      } else {
        continue;
      }

      allApplicants.push(...applicants);
    } catch (error) {
      console.error(`Error processing file ${file}:`, error);
    }
  }

  return allApplicants;
}

async function verifyDatabase() {
  try {
    console.log("🔍 Starting database verification...\n");

    await connectMongoDB();

    // Get all data from source files
    const sourceData = await getAllSourceData();
    console.log(`📄 Total records in source files: ${sourceData.length}`);

    // Get all data from database
    const dbData = await RegTable.find({}).lean();
    console.log(`🗄️  Total records in database: ${dbData.length}\n`);

    // Count unique people in source files
    const uniquePeopleInSource = new Set(
      sourceData.map((person) => person.Whatsapp)
    ).size;
    console.log(`👥 Unique people in source files: ${uniquePeopleInSource}`);

    // Count unique people in database
    const uniquePeopleInDB = new Set(dbData.map((person) => person.Whatsapp))
      .size;
    console.log(`👥 Unique people in database: ${uniquePeopleInDB}\n`);

    // Count total awards in source files
    let totalAwardsInSource = 0;
    const sourceAwardCounts: { [key: string]: number } = {};

    for (const person of sourceData) {
      const awards = [person.Award1, person.Award2, person.Award3].filter(
        Boolean
      );
      totalAwardsInSource += awards.length;

      for (const award of awards) {
        if (award) {
          sourceAwardCounts[award] = (sourceAwardCounts[award] || 0) + 1;
        }
      }
    }

    console.log(
      `🏆 Total award applications in source files: ${totalAwardsInSource}`
    );
    console.log(`🏆 Total award records in database: ${dbData.length}\n`);

    // Check for people who applied for multiple awards
    const peopleWithMultipleAwards: { [whatsapp: string]: string[] } = {};

    for (const person of sourceData) {
      const awards = [person.Award1, person.Award2, person.Award3].filter(
        Boolean
      ) as string[];
      if (awards.length > 1) {
        peopleWithMultipleAwards[person.Whatsapp] = awards;
      }
    }

    console.log(
      `👥 People with multiple awards in source: ${
        Object.keys(peopleWithMultipleAwards).length
      }`
    );

    if (Object.keys(peopleWithMultipleAwards).length > 0) {
      console.log("\n📋 Examples of people with multiple awards:");
      let count = 0;
      for (const [whatsapp, awards] of Object.entries(
        peopleWithMultipleAwards
      )) {
        if (count >= 5) break; // Show only first 5 examples
        const person = sourceData.find((p) => p.Whatsapp === whatsapp);
        console.log(`   ${person?.Name} (${whatsapp}): ${awards.join(", ")}`);
        count++;
      }
    }

    // Check if people with multiple awards have multiple records in DB
    console.log(
      "\n🔍 Checking if people with multiple awards have multiple DB records:"
    );
    for (const [whatsapp, sourceAwards] of Object.entries(
      peopleWithMultipleAwards
    )) {
      const dbRecords = dbData.filter((record) => record.Whatsapp === whatsapp);
      const person = sourceData.find((p) => p.Whatsapp === whatsapp);

      console.log(`   ${person?.Name} (${whatsapp}):`);
      console.log(
        `     Source awards: ${sourceAwards.length} (${sourceAwards.join(
          ", "
        )})`
      );
      console.log(
        `     DB records: ${dbRecords.length} (${dbRecords
          .map((r) => r.RegNo)
          .join(", ")})`
      );

      if (sourceAwards.length !== dbRecords.length) {
        console.log(
          `     ⚠️  MISMATCH: Expected ${sourceAwards.length} records, found ${dbRecords.length}`
        );
      } else {
        console.log("     ✅ MATCH");
      }
      console.log("");
    }

    // Award distribution comparison
    console.log("\n📊 Award distribution comparison:");
    const dbAwardCounts: { [key: string]: number } = {};

    for (const record of dbData) {
      // Extract award name from RegNo by finding matching prefix
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

      const prefix = record.RegNo.replace(/\d+$/, "");
      const awardName = Object.keys(awardPrefixes).find(
        (award) => awardPrefixes[award] === prefix
      );

      if (awardName) {
        dbAwardCounts[awardName] = (dbAwardCounts[awardName] || 0) + 1;
      }
    }

    const allAwards = new Set([
      ...Object.keys(sourceAwardCounts),
      ...Object.keys(dbAwardCounts),
    ]);

    for (const award of allAwards) {
      const sourceCount = sourceAwardCounts[award] || 0;
      const dbCount = dbAwardCounts[award] || 0;
      const status = sourceCount === dbCount ? "✅" : "⚠️";

      console.log(`   ${status} ${award}:`);
      console.log(`     Source: ${sourceCount}, DB: ${dbCount}`);
    }
  } catch (error) {
    console.error("Error during verification:", error);
  }
}

// Run verification
verifyDatabase();
