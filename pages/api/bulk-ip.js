import fetch from "node-fetch";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  const { ips } = req.body;
  const out = [];

  for (let ip of ips) {
    try {
      const r = await fetch(`https://ipinfo.io/${ip}/json`);
      const data = await r.json();
      out.push({ ip, data });
    } catch (e) {
      out.push({ ip, data: null });
    }
  }

  // Логируем запрос
  const logsPath = path.join(process.cwd(), "data", "bulk-logs.json");
  let logs = [];
  try {
    if (fs.existsSync(logsPath)) {
      logs = JSON.parse(fs.readFileSync(logsPath));
    }
  } catch {}
  logs.push({
    timestamp: new Date().toISOString(),
    ips,
    userAgent: req.headers["user-agent"] || "",
  });
  fs.writeFileSync(logsPath, JSON.stringify(logs, null, 2));

  res.status(200).json({ results: out });
}
