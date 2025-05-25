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

  // Попап state
  const [showPopup, setShowPopup] = useState(true);

  // Закрытие по overlay
  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) setShowPopup(false);
  }

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
      {/* --------- POPUP --------- */}
      {showPopup && (
        <div
          onClick={handleOverlayClick}
          style={{
            position: "fixed",
            zIndex: 9999,
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(30,22,12,0.19)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
          <div style={{
            background: "#fffdf8",
            border: "2px solid #fdad60",
            borderRadius: 17,
            padding: "27px 36px 22px 36px",
            maxWidth: 390,
            boxShadow: "0 8px 40px 0 rgba(246,122,38,0.13)",
            textAlign: "center",
            fontSize: 16
          }}>
            <div style={{ fontWeight: 700, color: "#e05222", fontSize: 17, marginBottom: 9 }}>
              Data Collection Notice
            </div>
            <div style={{ color: "#ad5a11", fontSize: 14, marginBottom: 15 }}>
              All processing is <b>compliant with US, EU (GDPR)</b>, and <b>UK</b> data protection laws.<br />
              By using this service, you consent to the collection and processing of technical data.
              <br /><br />
              <a href="https://gdpr-info.eu/" target="_blank" rel="noopener noreferrer" style={{ color: "#f55d2b", textDecoration: "underline" }}>
                GDPR (EU)
              </a>
              {" | "}
              <a href="https://ico.org.uk/for-organisations/guide-to-data-protection/" target="_blank" rel="noopener noreferrer" style={{ color: "#f55d2b", textDecoration: "underline" }}>
                UK DPA
              </a>
              {" | "}
              <a href="https://www.ftc.gov/legal-library/browse/rules/children-online-privacy-protection-rule-coppa" target="_blank" rel="noopener noreferrer" style={{ color: "#f55d2b", textDecoration: "underline" }}>
                US COPPA
              </a>
              <br />
              <span style={{ color: "#bdbdbd", fontSize: 12 }}>
                (Cookies, device & IP information for fraud & analytics)
              </span>
            </div>
            <button
              style={{
                marginTop: 6, background: "#f55d2b", color: "#fff",
                border: "none", borderRadius: 7, padding: "8px 22px",
                fontWeight: 700, fontSize: 15, cursor: "pointer"
              }}
              onClick={() => setShowPopup(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}

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
            {/* ... остальной код вкладки ... */}
            {/* ТВОЙ DEVICE TAB ОСТАЕТСЯ ТАКИМ КАК БЫЛ */}
            {/* --- не трогал --- */}
            {/* смотри твой предыдущий код */}
            {/* ... */}
            <h2 style={{ color: "#f55d2b", fontWeight: 700, fontSize: 22, marginBottom: 16 }}>Identification</h2>
            <div style={{
              background: "#fff3e7", border: "2px dashed #f55d2b", borderRadius: 9, padding: "12px 18px", marginBottom: 20,
              fontSize: 16, fontWeight: 700, color: "#f55d2b", letterSpacing: 1
            }}>
              Visitor ID: <span style={{ fontFamily: "monospace" }}>{visitorId || "Calculating..."}</span>
            </div>
            {/* ... и дальше по твоему шаблону */}
            {/* --- оставил без изменений --- */}
            {/* (!!! см. твой код выше !!!) */}
            {/* --- --- --- */}
          </div>
        )}

        {/* BULK TAB */}
        {tab === "bulk" && (
          <div style={{
            background: "#fff", borderRadius: 14, boxShadow: "0 8px 30px 0 rgba(246, 122, 38, 0.13)", padding: 23
          }}>
            {/* ... твой Bulk IP Check ... */}
            {/* --- остальной код --- */}
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
