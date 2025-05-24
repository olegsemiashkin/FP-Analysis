import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const Map = dynamic(() => import("../components/Map"), { ssr: false });

// Новый парсер userAgent: всегда есть данные
function parseUA(ua = "") {
  let browser = "-";
  let os = "-";
  if (/Edg/i.test(ua)) browser = "Edge";
  else if (/OPR/i.test(ua)) browser = "Opera";
  else if (/Chrome/i.test(ua)) browser = "Chrome";
  else if (/Firefox/i.test(ua)) browser = "Firefox";
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = "Safari";
  if (/Windows NT/i.test(ua)) os = "Windows";
  else if (/Mac OS X/i.test(ua)) os = "macOS";
  else if (/Linux/i.test(ua)) os = "Linux";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/iPhone|iPad/i.test(ua)) os = "iOS";
  return { browser, os };
}

const mainCards = [
  { key: "ip", label: "IP Address" },
  { key: "country", label: "Country" },
  { key: "region", label: "Region" },
  { key: "city", label: "City" },
  { key: "browser", label: "Browser" },
  { key: "os", label: "OS" },
  { key: "platform", label: "Platform" },
  { key: "languages", label: "Languages" },
];

const deviceParams = [
  { key: "fonts", label: "Fonts" },
  { key: "domBlockers", label: "DomBlockers" },
  { key: "plugins", label: "Plugins" },
  { key: "canvas", label: "Canvas" },
  { key: "audio", label: "Audio" },
  { key: "webGL", label: "WebGL" },
  { key: "touchSupport", label: "TouchSupport" },
  { key: "hardwareConcurrency", label: "CPU Cores" },
  { key: "deviceMemory", label: "Device RAM" },
];

export default function Home() {
  const [tab, setTab] = useState("device");
  const [visitorId, setVisitorId] = useState("");
  const [geo, setGeo] = useState({});
  const [details, setDetails] = useState({});
  const [mainData, setMainData] = useState({});
  const [showAll, setShowAll] = useState(false);

  // Bulk IP state (для вкладки)
  const [ips, setIps] = useState("");
  const [results, setResults] = useState([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  useEffect(() => {
    import('@fingerprintjs/fingerprintjs').then(FingerprintJS => {
      FingerprintJS.load().then(fp => {
        fp.get().then(async result => {
          setVisitorId(result.visitorId);
          setDetails(result.components || {});
          const ipResp = await fetch("https://ipapi.co/json/");
          const ipData = await ipResp.json();
          // Получаем userAgent — сначала из FPJS, если нет — из браузера
          let ua = result.components?.userAgent?.value;
          if (!ua && typeof window !== "undefined") ua = window.navigator.userAgent;
          const parsed = parseUA(ua);
          setGeo(ipData);
          setMainData({
            ip: ipData.ip,
            country: ipData.country_name,
            region: ipData.region,
            city: ipData.city,
            browser: parsed.browser,
            os: parsed.os,
            platform: result.components?.platform?.value || "-",
            languages: (result.components?.languages?.value || []).join(", ") || "-",
          });
        });
      });
    });
  }, []);

  // BULK IP CHECKER (оставь если используешь bulk checker)
  async function handleBulkCheck() {
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
      background: "#fff7f2",
      fontFamily: "'IBM Plex Mono', monospace, Arial"
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", paddingTop: 36 }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
          <button onClick={() => setTab("device")} style={tabBtn(tab === "device")}>Device Analysis</button>
          <button onClick={() => setTab("bulk")} style={tabBtn(tab === "bulk")}>Bulk IP Check</button>
        </div>

        {/* DEVICE TAB */}
        {tab === "device" && (
          <div style={{
            background: "#fff", borderRadius: 18, boxShadow: "0 10px 32px 0 rgba(246, 122, 38, 0.10)",
            padding: 40, marginBottom: 40
          }}>
            <h2 style={{ color: "#f55d2b", fontWeight: 700, fontSize: 26, marginBottom: 20 }}>Identification</h2>
            <div style={{
              background: "#fff3e7", border: "2px dashed #f55d2b", borderRadius: 10, padding: "18px 24px", marginBottom: 30,
              fontSize: 22, fontWeight: 700, color: "#f55d2b", letterSpacing: 1
            }}>
              Visitor ID: <span style={{ fontFamily: "monospace" }}>{visitorId || "Calculating..."}</span>
            </div>

            {/* --- Новая аккуратная сетка с картой 1-в-1 как в демо --- */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gridTemplateRows: "repeat(2, 1fr)",
                gap: 22,
                marginBottom: 32,
                alignItems: "stretch",
                minHeight: 250
              }}
            >
              {/* Левая часть: карточки */}
              {mainCards.slice(0, 3).map(({ key, label }) => (
                <div key={key} style={mainCardStyle}>
                  <div style={mainCardLabel}>{label}</div>
                  <div style={{ fontWeight: 700, fontSize: 23, marginTop: 7 }}>{mainData[key] || "-"}</div>
                </div>
              ))}
              {/* Карта — занимает 2 строки и 1 колонку справа */}
              <div
                style={{
                  gridRow: "1 / span 2", gridColumn: "4 / span 1",
                  background: "#fff", border: "2.5px solid #f3f3f3", borderRadius: 16,
                  display: "flex", flexDirection: "column", alignItems: "center", padding: 17, minHeight: 250,
                  justifyContent: "center", boxShadow: "0 3px 18px 0 rgba(255,98,0,0.03)"
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 29, color: "#2d2d2d", marginBottom: 3, textAlign: "center" }}>
                  Geolocation <span style={{ fontSize: 20, color: "#f55d2b" }}>↗</span>
                </div>
                <div style={{ fontSize: 19, color: "#ad5a11", marginBottom: 12, textAlign: "center" }}>
                  {geo?.city}, {geo?.region},<br />{geo?.country_name}
                </div>
                <div
                  style={{
                    width: 300,
                    height: 140,
                    borderRadius: 12,
                    border: "3px solid #3396f3",
                    overflow: "hidden",
                    marginTop: 8,
                    boxShadow: "0 2px 8px 0 rgba(45,143,222,0.09)"
                  }}
                >
                  {geo && Number(geo.latitude) && Number(geo.longitude) ? (
                    <Map lat={Number(geo.latitude)} lon={Number(geo.longitude)} />
                  ) : (
                    <div style={{ color: "#d15000", padding: 40, textAlign: "center", fontWeight: 600 }}>
                      No map
                    </div>
                  )}
                </div>
              </div>
              {/* Вторая строка карточек */}
              {mainCards.slice(3, 7).map(({ key, label }) => (
                <div key={key} style={mainCardStyle}>
                  <div style={mainCardLabel}>{label}</div>
                  <div style={{ fontWeight: 700, fontSize: 23, marginTop: 7 }}>{mainData[key] || "-"}</div>
                </div>
              ))}
              {/* Последняя ячейка: Languages (можно объединить ячейки, если хочешь) */}
              <div style={{ ...mainCardStyle, gridColumn: "2 / span 2" }}>
                <div style={mainCardLabel}>Languages</div>
                <div style={{ fontWeight: 700, fontSize: 23, marginTop: 7 }}>{mainData.languages || "-"}</div>
              </div>
            </div>

            {/* Device Details Cards */}
            <h3 style={{ color: "#f55d2b", fontWeight: 600, fontSize: 19, marginBottom: 16, marginTop: 18 }}>Device Details</h3>
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginBottom: 22
            }}>
              {deviceParams.map(({ key, label }) => {
                const val = details?.[key]?.value;
                let displayValue = "-";
                if (Array.isArray(val)) displayValue = val.join(", ");
                else if (typeof val === "object" && val !== null) displayValue = JSON.stringify(val);
                else if (typeof val !== "undefined") displayValue = String(val);
                return (
                  <div key={key} style={{
                    background: "#fff", border: "1.5px solid #ffe0c2", borderRadius: 8,
                    padding: "13px 15px", fontSize: 15, fontWeight: 600,
                    color: "#b45309", boxShadow: "0 1.5px 6px 0 rgba(246,122,38,0.03)"
                  }}>
                    <div style={{ color: "#f55d2b", fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 15, wordBreak: "break-word" }}>
                      {displayValue.length > 100 ? displayValue.slice(0, 99) + "..." : displayValue}
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              style={{
                marginTop: 10, background: "#fff3e7", color: "#e05222", border: "1.5px solid #ffcc99",
                borderRadius: 8, padding: "7px 24px", fontWeight: 600, cursor: "pointer", fontSize: 15
              }}
              onClick={() => setShowAll(v => !v)}
            >
              {showAll ? "Hide all details" : "Show all details"}
            </button>
            {showAll && (
              <pre style={{
                background: "#fff8f2", border: "1.5px solid #ffe0c2", borderRadius: 9,
                padding: 15, marginTop: 12, fontSize: 13, color: "#6a3403", whiteSpace: "pre-wrap"
              }}>
                {JSON.stringify(details, null, 2)}
              </pre>
            )}
          </div>
        )}

        {/* BULK TAB */}
        {tab === "bulk" && (
          <div style={{
            background: "#fff", borderRadius: 18, boxShadow: "0 8px 30px 0 rgba(246, 122, 38, 0.13)", padding: 40
          }}>
            <h2 style={{ color: "#f55d2b", fontWeight: 700, fontSize: 24, marginBottom: 20 }}>Bulk IP Check</h2>
            <textarea
              rows={4}
              style={{
                width: "100%", resize: "vertical", borderRadius: 10, border: "1.5px solid #fdad60",
                padding: 14, fontSize: 16, marginBottom: 10, fontFamily: "inherit"
              }}
              value={ips}
              onChange={e => setIps(e.target.value)}
              placeholder="Enter IP addresses separated by comma or newline"
            />
            <button
              onClick={handleBulkCheck}
              disabled={bulkLoading || !ips.trim()}
              style={{
                background: "#f55d2b", color: "#fff", border: 0, borderRadius: 10,
                padding: "10px 34px", fontWeight: 700, fontSize: 16, cursor: bulkLoading ? "wait" : "pointer",
                marginBottom: 18, marginTop: 5
              }}>
              {bulkLoading ? "Checking..." : "Check IPs"}
            </button>
            <div style={{ marginTop: 24 }}>
              {results.length > 0 && (
                <table style={{ width: "100%", fontSize: 15, background: "#fff7f2", borderRadius: 10 }}>
                  <thead>
                    <tr>
                      <th style={{ color: "#f55d2b", padding: 8 }}>IP</th>
                      <th style={{ color: "#f55d2b", padding: 8 }}>Country</th>
                      <th style={{ color: "#f55d2b", padding: 8 }}>City</th>
                      <th style={{ color: "#f55d2b", padding: 8 }}>Org/ISP</th>
                      <th style={{ color: "#f55d2b", padding: 8 }}>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => (
                      <tr key={i}>
                        <td style={{ padding: 7 }}>{r.ip}</td>
                        <td style={{ padding: 7 }}>{r.data?.country || "-"}</td>
                        <td style={{ padding: 7 }}>{r.data?.city || "-"}</td>
                        <td style={{ padding: 7 }}>{r.data?.org || "-"}</td>
                        <td style={{ padding: 7 }}>
                          <details>
                            <summary style={{ cursor: "pointer", color: "#ea580c", fontWeight: 500 }}>Details</summary>
                            <pre style={{
                              background: "#fff4e7", borderRadius: 7, padding: 7, fontSize: 12, marginTop: 4
                            }}>{JSON.stringify(r.data, null, 2)}</pre>
                          </details>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        <div style={{ marginTop: 32, textAlign: "center", color: "#e05222", fontSize: 16, letterSpacing: 1 }}>
          <a href="https://github.com/olegsemiashkin/FP-Analysis" style={{ color: "#e05222" }}>
            GitHub Project
          </a>
        </div>
      </div>
    </div>
  );
}

// --- Стиль для карточек ---
const mainCardStyle = {
  background: "#fff8f2",
  border: "2px solid #ffe0c2",
  borderRadius: 13,
  padding: "19px 24px",
  fontSize: 18,
  color: "#b45309",
  fontWeight: 600,
  boxShadow: "0 2px 8px 0 rgba(246,122,38,0.03)",
  minHeight: 85,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const mainCardLabel = {
  color: "#f55d2b",
  fontSize: 19,
  fontWeight: 800,
  marginBottom: 3,
  fontFamily: "inherit"
};

const tabBtn = active => ({
  fontWeight: 600,
  letterSpacing: 1,
  fontSize: 16,
  padding: "10px 30px",
  background: active ? "#f55d2b" : "#fff",
  color: active ? "#fff" : "#f55d2b",
  border: "2.3px solid #f55d2b",
  borderRadius: 12,
  cursor: "pointer"
});
