// pages/api/bulk-privacy.js

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Only POST allowed" });

  const { ips } = req.body;
  if (!Array.isArray(ips)) return res.status(400).json({ error: "No IPs provided" });

  const token = process.env.IPINFO_TOKEN || "1b6b36162bfd71";

  // Запросим у IPinfo batched (bulk) privacy info
  try {
    const responses = await Promise.all(
      ips.map(ip =>
        fetch(`https://ipinfo.io/${ip}/privacy?token=${token}`)
          .then(r => r.json())
          .then(data => ({ ip, ...data }))
          .catch(() => ({ ip, error: true }))
      )
    );
    res.json({ results: responses });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
