
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../components/Map"), { ssr: false });
const AmlTab = dynamic(() => import("../components/AmlTab"), { ssr: false });

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

function extractIPs(text) {
  const ipRegex = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;
  const ips = text.match(ipRegex) || [];
  return Array.from(new Set(ips));
}

export default function Home() {
  const [tab, setTab] = useState("device");
  const [visitorId, setVisitorId] = useState("");
  const [geo, setGeo] = useState({});
  const [details, setDetails] = useState({});
  const [mainData, setMainData] = useState({});
  const [showAll, setShowAll] = useState(false);

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

  function handleBulkInput(e) {
    const text = e.target.value;
    const ipsArr = extractIPs(text);
    setIps(ipsArr.join("\n"));
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#fff7f2",
      fontFamily: "'IBM Plex Mono', monospace, Arial"
    }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", paddingTop: 28 }}>
        {/* TAB BUTTONS */}
        <div style={{ display: "flex", gap: 8, marginBottom: 25 }}>
          <button onClick={() => setTab("device")} style={tabBtn(tab === "device")}>Device Analysis</button>
          <button onClick={() => setTab("bulk")} style={tabBtn(tab === "bulk")}>Bulk IP Check</button>
          <button onClick={() => setTab("aml")} style={tabBtn(tab === "aml")}>AML / Crypto</button>
        </div>

        {/* DEVICE TAB */}
        {tab === "device" && (
          <div style={{
            background: "#fff", borderRadius: 15, boxShadow: "0 6px 18px 0 rgba(246, 122, 38, 0.10)",
            padding: 23, marginBottom: 28
          }}>
            <h2 style={{ color: "#f55d2b", fontWeight: 700, fontSize: 22, marginBottom: 16 }}>Identification</h2>
            <div style={{
              background: "#fff3e7", border: "2px dashed #f55d2b", borderRadius: 9, padding: "12px 18px", marginBottom: 20,
              fontSize: 16, fontWeight: 700, color: "#f55d2b", letterSpacing: 1
            }}>
              Visitor ID: <span style={{ fontFamily: "monospace" }}>{visitorId || "Calculating..."}</span>
            </div>
            {/* --- Сетка карточек с картой справа --- */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gridTemplateRows: "repeat(2, 1fr)",
                gap: 13,
                marginBottom: 20,
                alignItems: "stretch",
                minHeight: 145
              }}
            >
              {/* Левая часть: карточки */}
              {mainCards.slice(0, 3).map(({ key, label }) => (
                <div key={key} style={mainCardStyleSmall}>
                  <div style={mainCardLabelSmall}>{label}</div>
                  <div style={{ fontWeight: 700, fontSize: 16, marginTop: 5 }}>{mainData[key] || "-"}</div>
                </div>
              ))}
              {/* Карта — 2 строки, 1 колонка справа */}
              <div
                style={{
                  gridRow: "1 / span 2", gridColumn: "4 / span 1",
                  background: "#fff8f2",
                  border: "2px solid #ffe0c2",
                  borderRadius: 13,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: 11,
                  minHeight: 145,
                  justifyContent: "center",
                  boxShadow: "0 2px 8px 0 rgba(246,122,38,0.03)"
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 20, color: "#2d2d2d", marginBottom: 2, textAlign: "center" }}>
                  Geolocation <span style={{ fontSize: 14, color: "#f55d2b" }}>↗</span>
                </div>
                <div style={{ fontSize: 13, color: "#ad5a11", marginBottom: 7, textAlign: "center" }}>
                  {geo?.city}, {geo?.region},<br />{geo?.country_name}
                </div>
                <div
                  style={{
                    width: 170,
                    height: 80,
                    borderRadius: 8,
                    border: "2px solid #3396f3",
                    overflow: "hidden",
                    marginTop: 5,
                    boxShadow: "0 2px 8px 0 rgba(45,143,222,0.09)"
                  }}
                >
                  {geo && Number(geo.latitude) && Number(geo.longitude) ? (
                    <Map lat={Number(geo.latitude)} lon={Number(geo.longitude)} />
                  ) : (
                    <div style={{ color: "#d15000", padding: 22, textAlign: "center", fontWeight: 600 }}>
                      No map
                    </div>
                  )}
                </div>
              </div>
              {/* Вторая строка карточек */}
              {mainCards.slice(3, 7).map(({ key, label }) => (
                <div key={key} style={mainCardStyleSmall}>
                  <div style={mainCardLabelSmall}>{label}</div>
                  <div style={{ fontWeight: 700, fontSize: 16, marginTop: 5 }}>{mainData[key] || "-"}</div>
                </div>
              ))}
              {/* Последняя ячейка: Languages */}
              <div style={{ ...mainCardStyleSmall, gridColumn: "2 / span 2" }}>
                <div style={mainCardLabelSmall}>Languages</div>
                <div style={{ fontWeight: 700, fontSize: 16, marginTop: 5 }}>{mainData.languages || "-"}</div>
              </div>
            </div>
            {/* Device Details Cards */}
            <h3 style={{ color: "#f55d2b", fontWeight: 600, fontSize: 14, marginBottom: 10, marginTop: 10 }}>Device Details</h3>
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 12
            }}>
              {deviceParams.map(({ key, label }) => {
                const val = details?.[key]?.value;
                let displayValue = "-";
                if (Array.isArray(val)) displayValue = val.join(", ");
                else if (typeof val === "object" && val !== null) displayValue = JSON.stringify(val);
                else if (typeof val !== "undefined") displayValue = String(val);
                return (
                  <div key={key} style={{
                    background: "#fff", border: "1.2px solid #ffe0c2", borderRadius: 8,
                    padding: "8px 8px", fontSize: 12, fontWeight: 600,
                    color: "#b45309", boxShadow: "0 1.5px 6px 0 rgba(246,122,38,0.03)"
                  }}>
                    <div style={{ color: "#f55d2b", fontSize: 11, fontWeight: 700, marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 12, wordBreak: "break-word" }}>
                      {displayValue.length > 80 ? displayValue.slice(0, 77) + "..." : displayValue}
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              style={{
                marginTop: 6, background: "#fff3e7", color: "#e05222", border: "1px solid #ffcc99",
                borderRadius: 7, padding: "6px 15px", fontWeight: 600, cursor: "pointer", fontSize: 12
              }}
              onClick={() => setShowAll(v => !v)}
            >
              {showAll ? "Hide all details" : "Show all details"}
            </button>
            {showAll && (
              <pre style={{
                background: "#fff8f2", border: "1px solid #ffe0c2", borderRadius: 9,
                padding: 10, marginTop: 7, fontSize: 11, color: "#6a3403", whiteSpace: "pre-wrap"
              }}>
                {JSON.stringify(details, null, 2)}
              </pre>
            )}
          </div>
        )}

        {/* BULK TAB */}
        {tab === "bulk" && (
          <div style={{
            background: "#fff", borderRadius: 14, boxShadow: "0 8px 30px 0 rgba(246, 122, 38, 0.13)", padding: 23
          }}>
            <h2 style={{ color: "#f55d2b", fontWeight: 700, fontSize: 18, marginBottom: 13 }}>Bulk IP Check</h2>
            <textarea
              rows={4}
              style={{
                width: "100%", resize: "vertical", borderRadius: 8, border: "1px solid #fdad60",
                padding: 8, fontSize: 12, marginBottom: 7, fontFamily: "inherit"
              }}
              value={ips}
              onChange={handleBulkInput}
              placeholder="Paste any text or list of IPs — will be extracted automatically"
            />
            <button
              onClick={handleBulkCheck}
              disabled={bulkLoading || !ips.trim()}
              style={{
                background: "#f55d2b", color: "#fff", border: 0, borderRadius: 8,
                padding: "7px 16px", fontWeight: 700, fontSize: 13, cursor: bulkLoading ? "wait" : "pointer",
                marginBottom: 10, marginTop: 3
              }}>
              {bulkLoading ? "Checking..." : "Check IPs"}
            </button>
            <div style={{ marginTop: 14 }}>
              {results.length > 0 && (
                <table style={{
                  width: "100%", background: "#fff7f2", borderRadius: 8,
                  fontSize: 14, borderCollapse: "separate", borderSpacing: 0
                }}>
                  <thead>
                    <tr>
                      <th style={{ color: "#f55d2b", padding: 8, textAlign: "left" }}>IP</th>
                      <th style={{ color: "#f55d2b", padding: 8, textAlign: "left" }}>Country</th>
                      <th style={{ color: "#f55d2b", padding: 8, textAlign: "left" }}>City</th>
                      <th style={{ color: "#f55d2b", padding: 8, textAlign: "left" }}>Proxy</th>
                      <th style={{ color: "#f55d2b", padding: 8, textAlign: "left" }}>VPN</th>
                      <th style={{ color: "#f55d2b", padding: 8, textAlign: "left" }}>TOR</th>
                      <th style={{ color: "#f55d2b", padding: 8, textAlign: "left" }}>Org/ISP</th>
                      <th style={{ color: "#f55d2b", padding: 8, textAlign: "left" }}>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, i) => (
                      <tr key={i}>
                        <td style={{ padding: 8 }}>{r.ip}</td>
                        <td style={{ padding: 8 }}>{r.data?.country || "-"}</td>
                        <td style={{ padding: 8 }}>{r.data?.city || "-"}</td>
                        <td style={{ padding: 8, color: r.data?.proxy ? '#e95a16' : '#2b7b2b', fontWeight: 600 }}>
                          {typeof r.data?.proxy === "boolean" ? (r.data.proxy ? "Yes" : "No") : "-"}
                        </td>
                        <td style={{ padding: 8, color: r.data?.vpn ? '#e95a16' : '#2b7b2b', fontWeight: 600 }}>
                          {typeof r.data?.vpn === "boolean" ? (r.data.vpn ? "Yes" : "No") : "-"}
                        </td>
                        <td style={{ padding: 8, color: r.data?.tor ? '#e95a16' : '#2b7b2b', fontWeight: 600 }}>
                          {typeof r.data?.tor === "boolean" ? (r.data.tor ? "Yes" : "No") : "-"}
                        </td>
                        <td style={{ padding: 8 }}>{r.data?.org || "-"}</td>
                        <td style={{ padding: 8 }}>
                          <details>
                            <summary style={{ cursor: "pointer", color: "#ea580c", fontWeight: 500 }}>Details</summary>
                            <pre style={{
                              background: "#fff4e7", borderRadius: 6, padding: 4, fontSize: 10, marginTop: 2
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

        {/* AML / CRYPTO TAB */}
        {tab === "aml" && <AmlTab />}

        <div style={{ marginTop: 22, textAlign: "center", color: "#e05222", fontSize: 11, letterSpacing: 1 }}>
          <a href="https://github.com/olegsemiashkin/FP-Analysis" style={{ color: "#e05222" }}>
            GitHub Project
          </a>
        </div>
      </div>
    </div>
  );
}

const mainCardStyleSmall = {
  background: "#fff8f2",
  border: "2px solid #ffe0c2",
  borderRadius: 10,
  padding: "11px 12px",
  fontSize: 13,
  color: "#b45309",
  fontWeight: 600,
  boxShadow: "0 2px 8px 0 rgba(246,122,38,0.03)",
  minHeight: 40,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const mainCardLabelSmall = {
  color: "#f55d2b",
  fontSize: 13,
  fontWeight: 800,
  marginBottom: 2,
  fontFamily: "inherit"
};

const tabBtn = active => ({
  fontWeight: 600,
  letterSpacing: 1,
  fontSize: 13,
  padding: "6px 15px",
  background: active ? "#f55d2b" : "#fff",
  color: active ? "#fff" : "#f55d2b",
  border: "2px solid #f55d2b",
  borderRadius: 9,
  cursor: "pointer"
});
