import { useState } from "react";

const services = [
  {
    key: "metasleuth",
    label: "MetaSleuth",
    getUrl: address => `https://metasleuth.io/search?query=${encodeURIComponent(address)}`
  },
  {
    key: "blockchair",
    label: "Blockchair",
    getUrl: address => `https://blockchair.com/search?q=${encodeURIComponent(address)}`
  },
  {
    key: "chainabuse",
    label: "Chainabuse",
    getUrl: address => `https://www.chainabuse.com/address/${address}`
  }
];

export default function AmlTab() {
  const [address, setAddress] = useState("");

  return (
    <div style={{ padding: 18 }}>
      <h2 style={{
        color: "#f55d2b", fontWeight: 900, fontFamily: "'IBM Plex Mono', monospace, Arial",
        fontSize: 28, marginBottom: 10
      }}>AML / Crypto Address Analysis</h2>
      <input
        value={address}
        onChange={e => setAddress(e.target.value.trim())}
        placeholder="Enter any crypto address or transaction hash"
        style={{
          fontSize: 16, width: "100%", margin: "12px 0", padding: 10,
          borderRadius: 8, border: "2px solid #ffad60", outline: "none",
          fontFamily: "'IBM Plex Mono', monospace, Arial"
        }}
      />

      {address && (
        <div style={{
          background: "#fff6ee", borderRadius: 13, border: "2.5px solid #ffd5b0",
          padding: "18px 22px", marginBottom: 16, minHeight: 92,
          boxShadow: "0 4px 20px 0 rgba(246,122,38,0.07)",
          fontFamily: "'IBM Plex Mono', monospace, Arial"
        }}>
          <div style={{ fontWeight: 900, fontSize: 20, color: "#ba4107", marginBottom: 6 }}>
            Address / Hash:
          </div>
          <div style={{ fontWeight: 600, fontSize: 16, color: "#ba4107", marginBottom: 10 }}>
            {address}
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {services.map(s => (
              <a
                key={s.key}
                href={s.getUrl(address)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "#f55d2b", color: "#fff", borderRadius: 8,
                  padding: "8px 18px", fontWeight: 700, textDecoration: "none",
                  fontSize: 15, marginTop: 8, letterSpacing: 0.2, boxShadow: "0 1px 4px #ffd5b066"
                }}
              >
                {s.label} ↗
              </a>
            ))}
          </div>
        </div>
      )}

      <div style={{ fontSize: 14, color: "#c15713", marginTop: 26, marginBottom: 3, fontWeight: 600 }}>
        Need more? Try additional AML / KYC tools below:
      </div>
      <div style={{
        display: "flex", gap: 18, marginTop: 7, flexWrap: "wrap",
        fontFamily: "'IBM Plex Mono', monospace, Arial"
      }}>
        <a href="https://opensanctions.org/" target="_blank" rel="noopener noreferrer"
          style={{ color: "#ea580c", textDecoration: "underline", fontWeight: 700 }}>OpenSanctions</a>
        <a href="https://cryptoscamdb.org/" target="_blank" rel="noopener noreferrer"
          style={{ color: "#ea580c", textDecoration: "underline", fontWeight: 700 }}>CryptoScamDB</a>
        <a href="https://haveibeenpwned.com/" target="_blank" rel="noopener noreferrer"
          style={{ color: "#ea580c", textDecoration: "underline", fontWeight: 700 }}>HaveIBeenPwned</a>
        <a href="https://ipinfo.io/" target="_blank" rel="noopener noreferrer"
          style={{ color: "#ea580c", textDecoration: "underline", fontWeight: 700 }}>ipinfo.io</a>
      </div>
    </div>
  );
}
