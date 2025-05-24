import { useEffect, useState } from "react";
import Map from "../components/Map";

function parseUA(ua = "") {
  let browser = "-";
  let os = "-";
  if (ua.includes("Edg")) browser = "Edge";
  else if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
  if (ua.includes("Mac")) os = "Mac OS X";
  else if (ua.includes("Win")) os = "Windows";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
  return { browser, os };
}

const suspicious = {
  deviceMemory: v => v && Number(v) <= 2,
  hardwareConcurrency: v => v && Number(v) <= 2,
  plugins: v => Array.isArray(v) && v.length === 0,
  domBlockers: v => v && v.value && v.value.length > 0,
  touchSupport: (v, details) =>
    (details?.platform?.value?.toLowerCase().includes("android") ||
      details?.platform?.value?.toLowerCase().includes("iphone")) && !v.value,
};

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
  const [visitorId, setVisitorId] = useState("");
  const [geo, setGeo] = useState({});
  const [details, setDetails] = useState({});
  const [mainData, setMainData] = useState({});
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    import('@fingerprintjs/fingerprintjs').then(FingerprintJS => {
      FingerprintJS.load().then(fp => {
        fp.get().then(async result => {
          setVisitorId(result.visitorId);
          setDetails(result.components || {});
          const ipResp = await fetch("https://ipapi.co/json/");
          const ipData = await ipResp.json();
          const ua = result.components?.userAgent?.value || "";
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

  return (
    <div style={{
      minHeight: "100vh",
      background: "#fff7f2",
      fontFamily: "'IBM Plex Mono', monospace, Arial"
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", paddingTop: 36 }}>
        <h2 style={{ color: "#f55d2b", fontWeight: 700, fontSize: 26, marginBottom: 20 }}>Identification</h2>
        <div style={{
          background: "#fff3e7", border: "2px dashed #f55d2b", borderRadius: 10, padding: "18px 24px", marginBottom: 28,
          fontSize: 21, fontWeight: 700, color: "#f55d2b", letterSpacing: 1
        }}>
          Visitor ID: <span style={{ fontFamily: "monospace" }}>{visitorId || "Calculating..."}</span>
        </div>

        {/* --- СЕТКА КАРТОЧЕК + КАРТА --- */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 22,
            marginBottom: 30,
            alignItems: "stretch",
          }}
        >
          {/* Первая строка */}
          <div style={cardStyle}><div style={cardLabel}>IP Address</div><div>{mainData.ip || "-"}</div></div>
          <div style={cardStyle}><div style={cardLabel}>Country</div><div>{mainData.country || "-"}</div></div>
          <div style={cardStyle}><div style={cardLabel}>Region</div><div>{mainData.region || "-"}</div></div>
          {/* Карта — занимает одну ячейку справа */}
          <div
            style={{
              background: "#fff",
              border: "1.5px solid #ececec",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              padding: "18px 20px",
              minHeight: 100,
              boxShadow: "0 2px 8px 0 rgba(246,122,38,0.03)",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 17, color: "#303030", marginBottom: 2 }}>
              Geolocation <span style={{ fontSize: 17, color: "#f55d2b" }}>↗</span>
            </div>
            <div style={{ fontSize: 15, color: "#ad5a11", marginBottom: 8 }}>
              {geo?.city}, {geo?.region},<br />{geo?.country_name}
            </div>
            <div
              style={{
                width: 200,
                height: 110,
                borderRadius: 8,
                border: "2px solid #3396f3",
                overflow: "hidden",
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
          {/* Вторая строка */}
          <div style={cardStyle}><div style={cardLabel}>City</div><div>{mainData.city || "-"}</div></div>
          <div style={cardStyle}><div style={cardLabel}>Browser</div><div>{mainData.browser || "-"}</div></div>
          <div style={cardStyle}><div style={cardLabel}>OS</div><div>{mainData.os || "-"}</div></div>
          <div style={cardStyle}><div style={cardLabel}>Platform</div><div>{mainData.platform || "-"}</div></div>
          {/* Третья строка (занимает 2 колонки, для языков) */}
          <div style={{ ...cardStyle, gridColumn: "1 / span 2" }}>
            <div style={cardLabel}>Languages</div>
            <div>{mainData.languages || "-"}</div>
          </div>
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
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#fff8f2",
  border: "1.5px solid #ffe0c2",
  borderRadius: 8,
  padding: "18px 20px",
  fontSize: 15,
  color: "#b45309",
  fontWeight: 600,
  boxShadow: "0 2px 8px 0 rgba(246,122,38,0.03)",
  height: 100,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const cardLabel = {
  color: "#f55d2b",
  fontSize: 13,
  fontWeight: 700,
  marginBottom: 2,
};
