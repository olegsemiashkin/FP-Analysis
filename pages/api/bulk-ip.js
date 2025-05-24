// pages/api/bulk-ip.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { ips } = req.body;
  if (!Array.isArray(ips) || ips.length === 0) {
    return res.status(400).json({ error: "Invalid IP list" });
  }

  const token = process.env.IPINFO_TOKEN || "1b6b36162bfd71";

  const results = await Promise.all(
    ips.map(async (ip) => {
      try {
        const [geoRes, privacyRes] = await Promise.all([
          fetch(`https://ipinfo.io/${ip}?token=${token}`),
          fetch(`https://ipinfo.io/${ip}/privacy?token=${token}`),
        ]);

        const geoData = await geoRes.json();
        const privacyData = await privacyRes.json();

        return {
          ip,
          data: {
            ...geoData,
            ...privacyData,
          },
        };
      } catch (error) {
        return {
          ip,
          error: error.message,
        };
      }
    })
  );

  res.status(200).json({ results });
}
