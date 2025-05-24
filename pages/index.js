import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../components/Map"), { ssr: false });

export default function Home() {
  const [tab, setTab] = useState("device");
  const [visitorId, setVisitorId] = useState("");
  const [ip, setIp] = useState("");
  const [geo, setGeo] = useState(null);
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(true);

  // BULK IP state
  const [ips, setIps] = useState("");
  const [results, setResults] = useState([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  useEffect(() => {
    // FPJS
    import('@fingerprintjs/fingerprintjs').then(FingerprintJS => {
      FingerprintJS.load().then(fp => {
        fp.get().then(async result => {
          setVisitorId(result.visitorId);
          setDetails(result.components || {});
          setLoading(false);

          // IP & GEO
          const ipResp = await fetch("https://ipapi.co/json/");
          const ipData = await ipResp.json();
          setIp(ipData.ip || "");
          setGeo(ipData);
        });
      });
    });
  }, []);

  // BULK IP CHECKER
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
      <div style={{ maxWidth: 1100, margin: "0 auto", paddingTop: 36 }}>
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
            display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 32, background: "#fff",
            borderRadius: 16, boxShadow: "0 10px 32px 0 rgba(246, 122, 38, 0.11)", padding: 40, alignItems: "flex-start"
          }}>
            <div>
              <h2 style={{ color: "#f55d2b", fontWeight: 700, fontSize: 26, marginBottom: 20 }}>Identification</h2>
              <div style={{
                background: "#fff3e7", border: "2px dashed #f55d2b", borderRadius: 10, padding: "20px 24px", marginBottom: 26,
                fontSize: 21, fontWeight: 600, color: "#d15000"
              }}>
                Visitor ID:<br />
                <span style={{ fontFamily: "monospace", fontSize: 20, color: "#f55d2b" }}>{loading ? "Calculating..." : visitorId}</span>
              </div>
              <div style={{
                display: "flex", gap: 26, flexWrap: "wrap", marginBottom: 16, fontSize: 15, color: "#8a4500"
              }}>
                <div><b>IP Address:</b> {ip}</div>
                <div><b>Country:</b> {geo?.country_name || "-"}</div>
                <div><b>City:</b> {geo?.city || "-"}</div>
                <div><b>Region:</b> {geo?.region || "-"}</div>
              </div>
              <div style={{
                display: "flex", gap: 26, flexWrap: "wrap", marginBottom: 16, fontSize: 15, color: "#8a4500"
              }}>
                <div><b>Browser:</b> {details?.userAgent?.value || "-"}</div>
                <div><b>OS:</b> {details?.os?.value || "-"}</div>
                <div><b>Platform:</b> {details?.platform?.value || "-"}</div>
                <div><b>Languages:</b> {details?.languages?.value?.join(", ") || "-"}</div>
              </div>
              <div style={{
                background: "#fff7f2", borderRadius: 10, padding: 18, marginTop: 22
              }}>
                <h3 style={{ fontSize: 16, color: "#e05222", marginBottom: 8 }}>Device Details</h3>
                <pre style={{
                  whiteSpace: "pre-wrap", fontSize: 13, color: "#6a3403", background: "transparent"
                }}>{JSON.stringify(details, null, 2)}</pre>
              </div>
            </div>
            <div>
              <h3 style={{ color: "#f55d2b", fontWeight: 600, fontSize: 17, marginBottom: 14 }}>Geolocation</h3>
              <div style={{
                borderRadius: 14, overflow: "hidden", border: "2px solid #ffae7b",
                width: "100%", height: 320, background: "#fff7f2"
              }}>
                {geo && geo.latitude && geo.longitude ? (
                  <Map lat={geo.latitude} lon={geo.longitude} />
                ) : (
                  <div style={{
                    color: "#d15000", padding: 40, textAlign: "center", fontWeight: 600
                  }}>No coordinates</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* BULK TAB */}
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
