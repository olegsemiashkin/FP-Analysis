import { useState } from "react";

export default function IpBulk() {
  const [ips, setIps] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleCheck() {
    setLoading(true);
    const res = await fetch("/api/bulk-ip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ips: ips.split(/[\s,]+/).filter(Boolean) }),
    });
    const data = await res.json();
    setResults(data.results);
    setLoading(false);
  }

  return (
    <main style={{ padding: 30 }}>
      <h1>Bulk IP Checker</h1>
      <textarea
        rows={6}
        style={{ width: "100%" }}
        value={ips}
        onChange={e => setIps(e.target.value)}
        placeholder="Вставьте список IP через запятую или с новой строки"
      />
      <br />
      <button onClick={handleCheck} disabled={loading}>
        {loading ? "Проверяем..." : "Проверить IP"}
      </button>
      <ul>
        {results.map((r, i) => (
          <li key={i}>
            {r.ip}: {r.data ? JSON.stringify(r.data) : "Ошибка/Не найдено"}
          </li>
        ))}
      </ul>
    </main>
  );
}
