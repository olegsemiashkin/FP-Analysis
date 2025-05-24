import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const logsPath = path.join(process.cwd(), "data", "visit-logs.json");
  const { fingerprint, ip, userAgent } = req.body;
  const entry = {
    timestamp: new Date().toISOString(),
    fingerprint,
    ip,
    userAgent,
  };

  let logs = [];
  try {
    if (fs.existsSync(logsPath)) {
      logs = JSON.parse(fs.readFileSync(logsPath));
    }
  } catch {}
  logs.push(entry);
  fs.writeFileSync(logsPath, JSON.stringify(logs, null, 2));
  res.status(200).json({ ok: true });
}
