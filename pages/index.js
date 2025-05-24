import { useEffect, useState } from "react";

export default function Home() {
  const [fingerprint, setFingerprint] = useState("");
  const [ip, setIp] = useState("");
  const [device, setDevice] = useState([]);
  const [loading, setLoading] = useState(true);

  const [ips, setIps] = useState("");
  const [results, setResults] = useState([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  useEffect(() => {
    import("fingerprintjs2").then(Fingerprint2 => {
      Fingerprint2.get(components => {
        setDevice(components);
        const values = components.map(component => component.value);
        const fp = Fingerprint2.x64hash128(values.join(""), 31);
        setFingerprint(fp);
        setLoading(false);

        // Логируем визит
        fetch("/api/myip")
          .then(res => res.json())
          .then(data => {
            setIp(data.ip);
            fetch("/api/visit", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                fingerprint: fp,
                ip: data.ip,
                userAgent: navigator.userAgent
              })
            });
          });
      });
    });
  }, []);

  async function handleCheck() {
    setBulkLoading(true);
    setResults([]);
    const res = await fetch("/api/bulk-ip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ips: ips.split(/[\s,]+/).filter(Boolean) }),
    });
    const data = await res.json();
    setResults(data.results);
    setBulkLoading(false);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f9fafb",
      fontFamily: "Inter, Arial, sans-serif",
      padding: 0,
      margin: 0
    }}>
      <div style={{
        maxWidth: 520,
        margin: "44px auto 0 auto",
        background: "#fff",
        boxShadow: "0 4px 24px 0 rgba(0,0,0,0.09)",
        borderRadius: 16,
        padding: 36,
        textAlign: "center"
      }}>
        <img
          src="https://avatars.githubusercontent.com/u/47512665?s=48"
          alt="Logo"
          style={{ marginBottom: 12, borderRadius: 12, width: 48, height: 48 }}
        />
        <h2 style={{ fontWeight: 700, fontSize: 28, margin: 0, marginBottom: 18 }}>FP-Analysis: Device &amp; IP Tools</h2>
        <div style={{ margin: "22px 0" }}>
          <h3 style={{ fontWeight: 600, fontSize: 18, marginBottom: 4 }}>Анализ устройства</h3>
          <div style={{
            background: "#f3f4f6",
            borderRadius: 8,
            fontFamily: "monospace",
            fontSize: 14,
            padding: "8px 12px",
            margin: "6px 0 14px 0",
            wordBreak: "break-all"
          }}>
            <b>Fingerprint:</b><br/>
            {loading ? "Calculating..." : fingerprint}
          </div>
          <div>
            <b>Ваш IP:</b> <span style={{ fontFamily: "monospace", fontSize: 15 }}>{ip}</span>
          </div>
          <details style={{ marginTop: 16, textAlign: "left" }}>
            <summary style={{ cursor: "pointer", fontWeight: 600, color: "#2d6cdf" }}>Device details</summary>
            <pre style={{
              background: "#f3f4f6",
              borderRadius: 8,
              padding: 12,
              marginTop: 8,
              maxHeight: 180,
              overflow: "auto",
              fontSize: 13
            }}>{device.length === 0 ? "Loading..." : JSON.stringify(device, null, 2)}</pre>
          </details>
        </div>

        <hr style={{margin: "30px 0 24px 0", border: 0, borderBottom: "1px solid #e5e7eb"}} />

        <div>
          <h3 style={{ fontWeight: 600, fontSize: 18, marginBottom: 6 }}>Массовая проверка IP</h3>
          <textarea
            rows={4}
            style={{
              width: "100%",
              resize: "vertical",
              borderRadius: 7,
              border: "1px solid #d1d5db",
              padding: 10,
              fontSize: 15,
              marginBottom: 8
            }}
            value={ips}
            onChange={e => setIps(e.target.value)}
            placeholder="Вставьте IP через запятую или с новой строки"
          />
          <br />
          <button
            onClick={handleCheck}
            disabled={bulkLoading || !ips.trim()}
            style={{
              background: "#2d6cdf",
              color: "#fff",
              border: 0,
              borderRadius: 7,
              padding: "8px 22px",
              fontWeight: 600,
              fontSize: 15,
              cursor: bulkLoading ? "wait" : "pointer",
              marginBottom: 18
            }}>
            {bulkLoading ? "Проверяем..." : "Проверить IP"}
          </button>
          <div style={{ textAlign: "left", marginTop: 4 }}>
            {results.length > 0 && (
              <div style={{
                background: "#f3f4f6",
                borderRadius: 8,
                padding: 12,
                marginTop: 4,
                fontSize: 13,
                maxHeight: 240,
                overflowY: "auto"
              }}>
                <b>Результаты:</b>
                <ul style={{ paddingLeft: 18, margin: 0 }}>
                  {results.map((r, i) => (
                    <li key={i} style={{ marginBottom: 10 }}>
                      <b>{r.ip}:</b>{" "}
                      {r.data ? (
                        <span>
                          {r.data.city ? `${r.data.city}, ` : ""}
                          {r.data.country ? `${r.data.country}, ` : ""}
                          {r.data.org ? r.data.org : ""}
                          <details>
                            <summary style={{ cursor: "pointer", color: "#2563eb", fontWeight: 500 }}>Подробнее</summary>
                            <pre style={{
                              background: "#f8fafc",
                              borderRadius: 6,
                              padding: 7,
                              fontSize: 12,
                              marginTop: 4
                            }}>{JSON.stringify(r.data, null, 2)}</pre>
                          </details>
                        </span>
                      ) : (
                        <span style={{ color: "red" }}>Ошибка/Не найдено</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div style={{
          marginTop: 34,
          fontSize: 13,
          color: "#6b7280"
        }}>
          <a href="https://github.com/olegsemiashkin/FP-Analysis" target="_blank" rel="noopener noreferrer" style={{ color: "#2d6cdf" }}>
            GitHub проекта
          </a>
        </div>
      </div>
      <div style={{ marginTop: 40, fontSize: 13, color: "#6b7280", textAlign: "center" }}>
        Made with ❤️ for anti-fraud research
      </div>
    </div>
  );
}
