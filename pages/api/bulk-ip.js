// /pages/api/bulk-ip.js

export default async function handler(req, res) {
  const ipqsKey = "cyXaaMXzr2SHL4AzXnINfUnX49WznCvb"; // твой IPQS ключ
  const ipinfoToken = "1b6b36162bfd71"; // твой ipinfo.io токен

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  let { ips } = req.body;
  if (!Array.isArray(ips)) return res.status(400).json({ error: "No IPs" });

  ips = ips.slice(0, 30);

  const results = await Promise.all(ips.map(async ip => {
    let geoData = {};
    let privData = {};

    // Получаем гео-инфу с ipinfo.io
    try {
      const geoResp = await fetch(`https://ipinfo.io/${ip}?token=${ipinfoToken}`);
      geoData = await geoResp.json();
    } catch (e) {
      geoData = {};
    }

    // Получаем VPN/Proxy/Tor с IPQS
    try {
      const ipqsResp = await fetch(`https://ipqualityscore.com/api/json/ip/${ipqsKey}/${ip}`);
      privData = await ipqsResp.json();
    } catch (e) {
      privData = {};
    }

    return {
      ip,
      data: {
        // Основная гео-инфа
        ...geoData,
        // Безопасность:
        proxy: privData.proxy ?? null,
        vpn: privData.vpn ?? null,
        tor: privData.tor ?? null,
        // Дополнительно (если пригодится)
        fraud_score: privData.fraud_score ?? null,
        abuse_velocity: privData.abuse_velocity ?? null,
        recent_abuse: privData.recent_abuse ?? null,
        org: geoData.org || privData.organization || "",
      }
    };
  }));

  res.status(200).json({ results });
}
