// /pages/api/bulk-privacy.js

export default async function handler(req, res) {
  const { ips } = req.body;
  const token = "1b6b36162bfd71"; // твой ipinfo токен

  // максимум 50 IP
  const safeIps = Array.isArray(ips) ? ips.slice(0, 50) : [];

  // Запросить данные для всех IP
  const results = await Promise.all(safeIps.map(async ip => {
    try {
      // Сначала geo + org инфа
      const geoResp = await fetch(`https://ipinfo.io/${ip}?token=${token}`);
      const geo = await geoResp.json();

      // Потом privacy инфа
      const privResp = await fetch(`https://ipinfo.io/${ip}/privacy?token=${token}`);
      const priv = await privResp.json();

      // Склеить всё в одну data
      return {
        ip,
        data: {
          ...geo,
          ...priv.privacy, // сюда прилетят vpn, proxy, tor и пр.
        }
      };
    } catch (e) {
      return { ip, data: { error: true } };
    }
  }));

  res.status(200).json({ results });
}
