
// components/AmlTab.js

import { useState } from "react";

const explorerLinks = {
  BTC: addr => `https://www.blockchain.com/btc/address/${addr}`,
  ETH: addr => `https://etherscan.io/address/${addr}`,
};

function detectType(addr) {
  if (/^0x[a-fA-F0-9]{40}$/.test(addr)) return "ETH";
  if (/^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/.test(addr)) return "BTC";
  return "";
}

export default function AmlTab() {
  const [address, setAddress] = useState("");
  const [cryptoType, setCryptoType] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function handleAnalyze() {
    setLoading(true);
    setResult(null);
    const type = detectType(address.trim());
    setCryptoType(type);

    let balance = "-";
    let txs = [];
    let riskScore = "-";
    let chainabuse = null;

    try {
      // BALANCE & TXs (Blockchair, бесплатный)
      if (type === "BTC") {
        const resp = await fetch(`https://api.blockchair.com/bitcoin/dashboards/address/${address}`);
        const data = await resp.json();
        balance = data?.data?.[address]?.address?.balance || "0";
        txs = data?.data?.[address]?.transactions?.slice(0, 3) || [];
      } else if (type === "ETH") {
        const resp = await fetch(`https://api.blockchair.com/ethereum/dashboards/address/${address}`);
        const data = await resp.json();
        balance = data?.data?.[address]?.address?.balance || "0";
        txs = data?.data?.[address]?.transactions?.slice(0, 3) || [];
      }
    } catch (e) {}

    try {
      // Chainabuse — черные списки (публичный endpoint)
      const resp = await fetch(`https://api.chainabuse.com/api/v1/search/entity?term=${address}&entity=address`);
      chainabuse = await resp.json();
    } catch (e) {}

    setResult({
      address,
      type,
      balance,
      txs,
      riskScore,
      chainabuse,
    });
    setLoading(false);
  }

  return (
    <div style={{ background: "#fff", borderRadius: 14, padding: 22, minHeight: 400 }}>
      <h2 style={{ color: "#f55d2b", fontWeight: 700, fontSize: 20, marginBottom: 15 }}>AML / Crypto Address Analysis</h2>
      <div style={{ display: "flex", gap: 13, marginBottom: 13 }}>
        <input
          style={{
            flex: 1, padding: "8px 12px", fontSize: 15, border: "1.5px solid #fdad60",
            borderRadius: 7, fontFamily: "inherit"
          }}
          placeholder="Enter crypto address (BTC or ETH)"
          value={address}
          onChange={e => setAddress(e.target.value)}
        />
        <button
          style={{
            background: "#f55d2b", color: "#fff", fontWeight: 700, fontSize: 15,
            padding: "7px 20px", border: "none", borderRadius: 7, cursor: loading ? "wait" : "pointer"
          }}
          disabled={loading || !address.trim()}
          onClick={handleAnalyze}
        >
          {loading ? "Checking..." : "Analyze"}
        </button>
      </div>
      {result && (
        <div style={{
          background: "#fff8f2", borderRadius: 10, border: "2px solid #ffe0c2", padding: 18,
          marginTop: 16, fontFamily: "inherit", color: "#b45309"
        }}>
          <div style={{ fontWeight: 700, fontSize: 18 }}>{result.address}</div>
          <div style={{ marginTop: 6, fontSize: 14 }}>
            <span>Type: <b style={{ color: "#f55d2b" }}>{result.type || "-"}</b></span> &nbsp; | &nbsp;
            <span>Balance: <b>{result.balance}</b></span>
            {result.type && <a href={explorerLinks[result.type]?.(result.address)} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 15, color: "#2d80c8" }}>Explorer ↗</a>}
          </div>
          <div style={{ marginTop: 7 }}>
            Chainabuse reports: <b>{Array.isArray(result.chainabuse?.data) && result.chainabuse.data.length ? result.chainabuse.data.length : "0"}</b>
          </div>
          <div style={{ marginTop: 7 }}>
            Recent transactions: <span style={{ color: "#f55d2b" }}>{result.txs?.join(", ") || "-"}</span>
          </div>
        </div>
      )}
      {/* MetaSleuth визуализация */}
      {result?.address && (
        <div style={{
          marginTop: 22, borderRadius: 11, overflow: "hidden", border: "2px solid #ffad57"
        }}>
          <iframe
            src={`https://metasleuth.io/result/${result.type?.toLowerCase()}/${result.address}`}
            width="100%"
            height="400"
            style={{ border: "none" }}
            title="MetaSleuth"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}
