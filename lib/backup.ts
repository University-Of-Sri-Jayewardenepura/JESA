import connectMongoDB from "./mongodb";
import BaseApplicant from "../models/BaseApplicant";
import RegTable from "../models/RegTable";
import InternalApplicant from "../models/internalApplicant";
import ExternalApplicant from "../models/externalApplicant";
import fs from "fs";
import path from "path";

export async function createBackup() {
  try {
    console.log("🔄 Starting JESA database backup...");

    // 1. Connect to MongoDB
    await connectMongoDB();
    console.log("✅ Connected to database");

    // 2. Fetch all data from each model
    console.log("📊 Fetching data from collections...");
    const backups = {
      baseApplicants: await BaseApplicant.find({}).lean(),
      regTable: await RegTable.find({}).lean(),
      internalApplicants: await InternalApplicant.find({}).lean(),
      externalApplicants: await ExternalApplicant.find({}).lean(),
    };

    // 3. Create backup directory
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupDir = path.join(
      process.cwd(),
      "backups",
      `backup-${timestamp}`
    );

    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // 4. Write each collection to its own file
    const files = [];
    for (const [name, docs] of Object.entries(backups)) {
      const filename = `${name}.json`;
      const filepath = path.join(backupDir, filename);
      fs.writeFileSync(filepath, JSON.stringify(docs, null, 2), "utf8");
      files.push(filename);
      console.log(`✅ Backed up ${docs.length} records from ${name}`);
    }

    // 5. Create summary file
    const summary = {
      timestamp: new Date().toISOString(),
      totalRecords: {
        baseApplicants: backups.baseApplicants.length,
        regTable: backups.regTable.length,
        internalApplicants: backups.internalApplicants.length,
        externalApplicants: backups.externalApplicants.length,
      },
      files,
      backupPath: backupDir,
    };

    fs.writeFileSync(
      path.join(backupDir, "backup-summary.json"),
      JSON.stringify(summary, null, 2),
      "utf8"
    );

    console.log("🎉 Backup completed successfully!");
    console.log(`📁 Backup location: ${backupDir}`);
    console.log("📋 Summary:", summary.totalRecords);

    return summary;
  } catch (error) {
    console.error("❌ Backup failed:", error);
    throw error;
  }
}

// Run backup if this file is executed directly
if (require.main === module) {
  createBackup()
    .then(() => {
      console.log("✅ Backup script completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Backup script failed:", error);
      process.exit(1);
    });
}
