// pages/api/bulk-ip.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { ips } = req.body;
  const token = "1b6b36162bfd71"; // твой токен ipinfo

  async function fetchIP(ip) {
    try {
      // Получаем базовые данные IP
      const mainRes = await fetch(`https://ipinfo.io/${ip}?token=${token}`);
      const mainData = await mainRes.json();

      // Получаем privacy (vpn/proxy/tor)
      const privacyRes = await fetch(`https://ipinfo.io/${ip}/privacy?token=${token}`);
      const privacyData = await privacyRes.json();

      // Совмещаем
      return {
        ip,
        data: {
          ...mainData,
          vpn: privacyData.vpn ?? null,
          proxy: privacyData.proxy ?? null,
          tor: privacyData.tor ?? null,
          relay: privacyData.relay ?? null,
          hosting: privacyData.hosting ?? null,
          service: privacyData.service ?? null,
        },
      };
    } catch (e) {
      return { ip, data: { error: true, message: String(e) } };
    }
  }

  // Максимум 50 IP за раз!
  const ipArr = (Array.isArray(ips) ? ips : []).slice(0, 50);
  const results = await Promise.all(ipArr.map(fetchIP));
  res.status(200).json({ results });
}
