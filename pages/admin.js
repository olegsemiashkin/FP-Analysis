import { useState } from "react";

export default function Admin() {
  const [pw, setPw] = useState("");
  const [ok, setOk] = useState(false);
  const [logs, setLogs] = useState({ visits: [], bulk: [] });
  const [tab, setTab] = useState("visits");
  const [err, setErr] = useState("");

  function login() {
    if (pw === process.env.NEXT_PUBLIC_ADMIN_PASS || pw === "1234") {
      fetch("/api/logs").then(r => r.json()).then(setLogs);
      setOk(true);
      setErr("");
    } else setErr("Неверный пароль");
  }

  if (!ok)
    return (
      <div style={{ minHeight: "100vh", background: "#f9fafb", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px 0 rgba(0,0,0,0.09)", padding: 36, width: 350 }}>
          <h2>Вход в админку</h2>
          <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Пароль" style={{ width: "100%", padding: 8, fontSize: 15, borderRadius: 7, border: "1px solid #ddd", marginBottom: 12 }} />
          <button onClick={login} style={{ width: "100%", padding: 9, background: "#2d6cdf", color: "#fff", border: 0, borderRadius: 7, fontWeight: 600 }}>Войти</button>
          {err && <div style={{ color: "red", marginTop: 12 }}>{err}</div>}
        </div>
      </div>
    );

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", padding: 0 }}>
      <div style={{ maxWidth: 820, margin: "44px auto 0 auto", background: "#fff", boxShadow: "0 4px 24px 0 rgba(0,0,0,0.09)", borderRadius: 16, padding: 36 }}>
        <h2>Логи</h2>
        <div style={{ marginBottom: 20 }}>
          <button onClick={() => setTab("visits")} style={{ marginRight: 12, background: tab === "visits" ? "#2d6cdf" : "#f1f5f9", color: tab === "visits" ? "#fff" : "#222", border: 0, borderRadius: 5, padding: "6px 16px", fontWeight: 600 }}>Визиты</button>
          <button onClick={() => setTab("bulk")} style={{ background: tab === "bulk" ? "#2d6cdf" : "#f1f5f9", color: tab === "bulk" ? "#fff" : "#222", border: 0, borderRadius: 5, padding: "6px 16px", fontWeight: 600 }}>Массовая проверка IP</button>
        </div>
        {tab === "visits" && (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr>
              <th style={{ borderBottom: "1px solid #eee", padding: 6 }}>Время</th>
              <th style={{ borderBottom: "1px solid #eee", padding: 6 }}>Fingerprint</th>
              <th style={{ borderBottom: "1px solid #eee", padding: 6 }}>IP</th>
              <th style={{ borderBottom: "1px solid #eee", padding: 6 }}>User-Agent</th>
            </tr></thead>
            <tbody>
              {logs.visits.map((l, i) => (
                <tr key={i}>
                  <td style={{ borderBottom: "1px solid #f1f1f1", padding: 6 }}>{l.timestamp}</td>
                  <td style={{ borderBottom: "1px solid #f1f1f1", padding: 6, wordBreak: "break-all" }}>{l.fingerprint}</td>
                  <td style={{ borderBottom: "1px solid #f1f1f1", padding: 6 }}>{l.ip}</td>
                  <td style={{ borderBottom: "1px solid #f1f1f1", padding: 6, maxWidth: 220, wordBreak: "break-all" }}>{l.userAgent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {tab === "bulk" && (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr>
              <th style={{ borderBottom: "1px solid #eee", padding: 6 }}>Время</th>
              <th style={{ borderBottom: "1px solid #eee", padding: 6 }}>IP-адреса</th>
              <th style={{ borderBottom: "1px solid #eee", padding: 6 }}>User-Agent</th>
            </tr></thead>
            <tbody>
              {logs.bulk.map((l, i) => (
                <tr key={i}>
                  <td style={{ borderBottom: "1px solid #f1f1f1", padding: 6 }}>{l.timestamp}</td>
                  <td style={{ borderBottom: "1px solid #f1f1f1", padding: 6 }}>{l.ips.join(", ")}</td>
                  <td style={{ borderBottom: "1px solid #f1f1f1", padding: 6, maxWidth: 240, wordBreak: "break-all" }}>{l.userAgent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
