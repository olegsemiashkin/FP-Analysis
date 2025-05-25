import { useState } from "react";

const services = [
  {
    key: "metasleuth",
    label: "MetaSleuth",
    getUrl: addr => `https://metasleuth.io/result/btc/${addr}`
  },
  {
    key: "blockchair",
    label: "Blockchair",
    getUrl: addr => `https://blockchair.com/bitcoin/address/${addr}`
  },
  {
    key: "chainabuse",
    label: "Chainabuse",
    getUrl: addr => `https://www.chainabuse.com/address/${addr}`
  }
  // Можно добавить ещё (opensanctions, cryptoscamdb и т.д.)
];

export default function AmlTab() {
  const [address, setAddress] = useState("");
  const [active, setActive] = useState(services[0].key);

  const currentService = services.find(s => s.key === active);
  const valid = address && /^[13bc][a-km-zA-HJ-NP-Z1-9]{25,40}$/.test(address); // простой чек для BTC адреса

  return (
    <div style={{ padding: 15 }}>
      <h2 style={{ color: "#f55d2b", fontWeight: 700 }}>AML / Crypto Address Analysis</h2>
      <input
        value={address}
        onChange={e => setAddress(e.target.value)}
        placeholder="Enter BTC/ETH/USDT address"
        style={{
          fontSize: 16, width: "60%", margin: "12px 0", padding: 8, borderRadius: 8,
          border: "1.5px solid #ffad60"
        }}
      />
      <div style={{ display: "flex", gap: 10, margin: "16px 0" }}>
        {services.map(s => (
          <button
            key={s.key}
            style={{
              background: active === s.key ? "#f55d2b" : "#fff",
              color: active === s.key ? "#fff" : "#f55d2b",
              border: "2px solid #f55d2b",
              borderRadius: 9, padding: "5px 18px", fontWeight: 700, fontSize: 15,
              cursor: "pointer"
            }}
            onClick={() => setActive(s.key)}
          >{s.label}</button>
        ))}
      </div>
      {valid && (
        <div style={{
          border: "2px solid #ffad60", borderRadius: 10, background: "#fff7f2",
          margin: "14px 0", padding: "12px 14px", minHeight: 60
        }}>
          {/* Тут будет резюме (тип, баланс, подозрения, если сможем вытянуть) */}
          <b style={{ color: "#ba4107", fontSize: 16 }}>Address:</b>
          <span style={{ marginLeft: 8, fontFamily: "monospace" }}>{address}</span>
        </div>
      )}
      {/* Вставка iframe */}
      {valid && (
        <iframe
          src={currentService.getUrl(address)}
          style={{
            width: "100%", minHeight: 650, border: "2px solid #ffe0c2",
            background: "#f7f6f5", borderRadius: 10
          }}
          sandbox="allow-scripts allow-same-origin allow-forms"
          title={currentService.label}
        />
      )}
      {!valid && address && (
        <div style={{ color: "#d15000", fontWeight: 600, marginTop: 18 }}>
          Enter a valid address
        </div>
      )}
    </div>
  );
}
