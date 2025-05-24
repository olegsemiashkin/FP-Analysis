import fetch from "node-fetch";

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
  res.status(200).json({ results: out });
}
