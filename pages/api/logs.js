import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const visitsPath = path.join(process.cwd(), "data", "visit-logs.json");
  const bulkPath = path.join(process.cwd(), "data", "bulk-logs.json");
  let visits = [], bulk = [];
  try {
    if (fs.existsSync(visitsPath)) {
      visits = JSON.parse(fs.readFileSync(visitsPath));
    }
    if (fs.existsSync(bulkPath)) {
      bulk = JSON.parse(fs.readFileSync(bulkPath));
    }
  } catch {}
  res.status(200).json({ visits, bulk });
}
