import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../components/Map"), { ssr: false });

const suspicious = {
  deviceMemory: v => v && Number(v) <= 2,
  hardwareConcurrency: v => v && Number(v) <= 2,
  plugins: v => Array.isArray(v) && v.length === 0,
  domBlockers: v => v && v.value && v.value.length > 0,
  touchSupport: (v, details) =>
    (details?.platform?.value?.toLowerCase().includes("android") ||
      details?.platform?.value?.toLowerCase().includes("iphone")) && !v.value,
};

const paramOrder = [
  { key: "ip", label: "IP Address" },
  { key: "country", label: "Country" },
  { key: "city", label: "City" },
  { key: "region", label: "Region" },
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
  const [geo, setGeo] = useState(null);
  const [details, setDetails] = useState({});
  const [mainData, setMainData] = useState({});
  const [showAll, setShowAll] = useState(false);

  // BULK IP state (оставь логику если используешь bulk checker)
  const [ips, setIps] = useState("");
  const [results, setResults] = useState([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  useEffect(() => {
    import('@fingerprintjs/fingerprintjs').then(FingerprintJS => {
      FingerprintJS.load().then(fp => {
        fp.get().then(async result => {
          setVisitorId(result.visitorId);
          setDetails(result.components || {});
          // fetch geo
          const ipResp = await fetch("https://ipapi.co/json/");
          const ipData = await ipResp.json();
          setGeo(ipData);
          setMainData({
            ip: ipData.ip,
            country: ipData.country_name,
            city: ipData.city,
            region: ipData.region,
            browser: result.components?.userAgent?.value?.split(" ")[0] || "-",
            os: result.components?.os?.value || "-",
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
      <div style={{ maxWidth: 1200, margin: "0 auto", paddingTop: 36 }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
          <button onClick={() => setTab("device")} style={{
            fontWeight: 600, letterSpacing: 1, fontSize: 16, padding: "10px 30px",
            background: tab === "device" ? "#f55d2b" : "#fff", color: tab === "device" ? "#fff" : "#f55d2b",
            border: "1.7px solid #f55d2b", borderRadius: 10, cursor: "pointer"
          }}>Device Analysis</button>
          <button onClick={() => setTab("bulk")} style={{
            fontWeight: 600, letterSpacing: 1, fontSize: 16, padding: "10px 30px",
            background: tab === "bulk" ? "#f55d2b" : "#fff", color: tab === "bulk" ? "#fff" : "#f55d2b",
            border: "1.7px solid #f55d2b", borderRadius: 10, cursor: "pointer"
          }}>Bulk IP Check</button>
        </div>

        {/* DEVICE TAB */}
        {tab === "device" && (
          <div style={{
            background: "#fff", borderRadius: 16, boxShadow: "0 10px 32px 0 rgba(246, 122, 38, 0.11)",
            padding: 40, marginBottom: 40
          }}>
            <h2 style={{ color: "#f55d2b", fontWeight: 700, fontSize: 26, marginBottom: 20 }}>Identification</h2>
            <div style={{
              background: "#fff3e7", border: "2px dashed #f55d2b", borderRadius: 10, padding: "18px 24px", marginBottom: 28,
              fontSize: 21, fontWeight: 700, color: "#f55d2b", letterSpacing: 1
            }}>
              Visitor ID: <span style={{ fontFamily: "monospace" }}>{visitorId || "Calculating..."}</span>
            </div>
            {/* Main data in cards */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22, marginBottom: 30
            }}>
              {paramOrder.map(({ key, label }) => (
                <div key={key} style={{
                  background: "#fff8f2", border: "1.5px solid #ffe0c2", borderRadius: 8,
                  padding: "14px 17px", fontSize: 15, color: "#b45309", fontWeight: 600,
                  boxShadow: "0 2px 8px 0 rgba(246,122,38,0.03)"
                }}>
                  <div style={{ color: "#f55d2b", fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{label}</div>
                  <div>{mainData[key] || "-"}</div>
                </div>
              ))}
            </div>
            {/* Device Details Cards */}
            <h3 style={{ color: "#f55d2b", fontWeight: 600, fontSize: 17, marginBottom: 16, marginTop: 18 }}>Device Details</h3>
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginBottom: 22
            }}>
              {deviceParams.map(({ key, label }) => {
                const val = details?.[key]?.value;
                let displayValue = "-";
                if (Array.isArray(val)) displayValue = val.join(", ");
                else if (typeof val === "object" && val !== null) displayValue = JSON.stringify(val);
                else if (typeof val !== "undefined") displayValue = String(val);

                // Highlight suspicious
                let highlight = suspicious[key] && suspicious[key](details?.[key]?.value, details) ? "#fff4e7" : "#fff";
                let border = suspicious[key] && suspicious[key](details?.[key]?.value, details) ? "2px solid #fbbf24" : "1.5px solid #ffe0c2";
                let color = suspicious[key] && suspicious[key](details?.[key]?.value, details) ? "#d97706" : "#b45309";

                return (
                  <div key={key} style={{
                    background: highlight, border, borderRadius: 8,
                    padding: "13px 15px", fontSize: 15, fontWeight: 600,
                    color, boxShadow: "0 1.5px 6px 0 rgba(246,122,38,0.03)"
                  }}>
                    <div style={{ color: "#f55d2b", fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 14, wordBreak: "break-word" }}>
                      {displayValue.length > 80 ? displayValue.slice(0, 77) + "..." : displayValue}
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
            <div style={{ margin: "30px 0 10px 0" }}>
              {geo && geo.latitude && geo.longitude && (
                <div>
                  <h3 style={{ color: "#f55d2b", fontWeight: 600, fontSize: 17, marginBottom: 12 }}>Geolocation</h3>
                  <div style={{
                    borderRadius: 14, overflow: "hidden", border: "2px solid #ffae7b",
                    width: 440, height: 280, background: "#fff7f2"
                  }}>
                    <Map lat={geo.latitude} lon={geo.longitude} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* BULK TAB — по желанию */}
        {tab === "bulk" && (
          <div style={{
            background: "#fff", borderRadius: 16, boxShadow: "0 8px 30px 0 rgba(246, 122, 38, 0.13)", padding: 40
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
