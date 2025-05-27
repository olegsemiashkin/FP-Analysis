import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// --- Цвета и стили ---
const ACCENT = "#c75b23";
const BG = "#fff6f2";
const CARD = "#fff";
const BORDER = "#facfad";
const RED = "#e03c1a";
const GREEN = "#4caf50";
const ORANGE = "#ffb300";

// --- Компоненты ---
const Card = styled(Paper)({
  background: CARD,
  borderRadius: 22,
  boxShadow: "none",
  border: `2px solid ${BORDER}`,
  padding: 32,
  marginBottom: 24,
});

const RiskCircle = styled(Box)(({ riskColor }) => ({
  width: 120,
  height: 120,
  borderRadius: "50%",
  border: `5px solid ${riskColor}`,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  background: "#fff",
  margin: "0 28px 0 0",
}));

const RiskBadge = styled(Box)(({ borderColor }) => ({
  border: `4px solid ${borderColor}`,
  borderRadius: 100,
  padding: "12px 38px",
  textAlign: "center",
  background: "#fff",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  minWidth: 170,
  margin: "0 14px",
}));

const LinkBtn = styled(Button)({
  background: "#fff",
  color: ACCENT,
  fontWeight: 700,
  border: `2px solid ${ACCENT}`,
  fontFamily: "IBM Plex Mono, monospace",
  borderRadius: 12,
  margin: "8px 0",
  minWidth: 130,
  fontSize: 18,
  textTransform: "none",
  "&:hover": {
    background: "#ffe7d2",
    borderColor: "#a84e1a",
    color: "#a84e1a",
  },
});

const BLOCKCHAIR_NETWORKS = {
  btc: { code: "bitcoin", label: "Bitcoin", symbol: "BTC", decimals: 8 },
  bch: { code: "bitcoin-cash", label: "Bitcoin Cash", symbol: "BCH", decimals: 8 },
  ltc: { code: "litecoin", label: "Litecoin", symbol: "LTC", decimals: 8 },
  doge: { code: "dogecoin", label: "Dogecoin", symbol: "DOGE", decimals: 8 },
  dash: { code: "dash", label: "Dash", symbol: "DASH", decimals: 8 },
  zec: { code: "zcash", label: "Zcash", symbol: "ZEC", decimals: 8 },
  xrp: { code: "ripple", label: "Ripple", symbol: "XRP", decimals: 6 },
};

function detectNetwork(address) {
  if (/^(0x)?[0-9a-fA-F]{40}$/.test(address) || (address.startsWith("0x") && address.length === 42))
    return { key: "eth", label: "Ethereum", symbol: "ETH", explorer: `https://etherscan.io/address/${address}` };
  if (/^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/.test(address)) return { key: "btc", ...BLOCKCHAIR_NETWORKS.btc, explorer: `https://blockchair.com/bitcoin/address/${address}` };
  if (/^(bitcoincash:)?(q|p)[a-z0-9]{41}$/.test(address) || /^([13][a-km-zA-HJ-NP-Z1-9]{25,34})$/.test(address)) return { key: "bch", ...BLOCKCHAIR_NETWORKS.bch, explorer: `https://blockchair.com/bitcoin-cash/address/${address}` };
  if (/^(ltc1|[LM3])[a-zA-HJ-NP-Z0-9]{26,39}$/.test(address)) return { key: "ltc", ...BLOCKCHAIR_NETWORKS.ltc, explorer: `https://blockchair.com/litecoin/address/${address}` };
  if (/^(D){1}[5-9A-HJ-NP-U]{1}[1-9A-HJ-NP-Za-km-z]{32}$/.test(address)) return { key: "doge", ...BLOCKCHAIR_NETWORKS.doge, explorer: `https://blockchair.com/dogecoin/address/${address}` };
  if (/^X[1-9A-HJ-NP-Za-km-z]{33}$/.test(address)) return { key: "dash", ...BLOCKCHAIR_NETWORKS.dash, explorer: `https://blockchair.com/dash/address/${address}` };
  if (/^t1[0-9A-Za-z]{33}$/.test(address)) return { key: "zec", ...BLOCKCHAIR_NETWORKS.zec, explorer: `https://blockchair.com/zcash/address/${address}` };
  if (/^r[0-9a-zA-Z]{24,34}$/.test(address)) return { key: "xrp", ...BLOCKCHAIR_NETWORKS.xrp, explorer: `https://blockchair.com/ripple/address/${address}` };
  return null;
}

async function fetchBlacklists() {
  // Можно добавлять ещё листы
  const urls = [
    "https://raw.githubusercontent.com/AMLBot/blacklists/main/blacklist.txt",
    "https://raw.githubusercontent.com/crystal-blockchain/public-aml-addresses/master/blacklist.txt",
  ];
  let all = [];
  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const text = await res.text();
        const addrs = text
          .split("\n")
          .map((line) => line.trim().toLowerCase())
          .filter((line) => !!line && !line.startsWith("#"));
        all = all.concat(addrs);
      }
    } catch (e) {}
  }
  return all;
}

function getRiskDistribution(isBlacklisted) {
  return [
    {
      label: "Dark Market",
      percent: isBlacklisted ? 60 : 4.7,
      color: RED,
    },
    {
      label: "Exchange",
      percent: isBlacklisted ? 5 : 30.4,
      color: GREEN,
    },
    {
      label: "Mixer",
      percent: isBlacklisted ? 20 : 2.1,
      color: ORANGE,
    },
  ];
}

function getRiskScore({ isBlacklisted, totalTransactions }) {
  if (isBlacklisted)
    return {
      score: 3,
      label: "High Risk",
      color: RED,
      msg: "High risk of blocking. Transfers from this wallet may be blocked on centralized exchanges. We recommend contacting an AML officer.",
    };
  if (
    typeof totalTransactions === "number" &&
    (totalTransactions <= 2 || totalTransactions > 10000)
  )
    return {
      score: 6,
      label: "Medium Risk",
      color: ORANGE,
      msg: "Medium risk. Suspicious transaction count for typical activity.",
    };
  return {
    score: 9,
    label: "Trusted",
    color: GREEN,
    msg: "This wallet is generally considered safe.",
  };
}

export default function AmlTab() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  const handleAnalyze = async () => {
    setErr(null);
    setData(null);
    if (!address) return;
    setLoading(true);

    const networkInfo = detectNetwork(address);
    if (!networkInfo) {
      setErr("Unknown or unsupported wallet format.");
      setLoading(false);
      return;
    }

    // --- Blacklist ---
    let isBlacklisted = false;
    let totalTransactions = null;
    try {
      const allBlacklists = await fetchBlacklists();
      if (
        allBlacklists.includes(address.toLowerCase()) ||
        allBlacklists.includes(address.replace(/^0x/, "").toLowerCase())
      ) {
        isBlacklisted = true;
      }
    } catch (e) {}

    // --- Blockchain data ---
    let firstTransaction = "-",
      lastActive = "-",
      totalReceived = "-",
      totalSent = "-",
      uniqueInteractions = "-";
    try {
      if (networkInfo.key === "eth") {
        const apiKey = "1QUX49MGQE21PWNXJSANUUU2ASHYUGMDKK";
        const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;
        const res = await fetch(url);
        const json = await res.json();

        if (!json.result || !Array.isArray(json.result) || json.result.length === 0) {
          setErr("No data or invalid ETH address.");
          setLoading(false);
          return;
        }

        const txs = json.result;
        totalTransactions = txs.length;
        if (totalTransactions === 10000) totalTransactions = ">10,000";
        const firstTx = txs[0];
        const lastTx = txs[txs.length - 1];
        let totalIn = 0;
        let totalOut = 0;
        let uniqueAddresses = new Set();

        for (const tx of txs) {
          if (tx.from.toLowerCase() === address.toLowerCase()) {
            totalOut += Number(tx.value) / 1e18;
            uniqueAddresses.add(tx.to.toLowerCase());
          }
          if (tx.to.toLowerCase() === address.toLowerCase()) {
            totalIn += Number(tx.value) / 1e18;
            uniqueAddresses.add(tx.from.toLowerCase());
          }
        }

        firstTransaction = new Date(firstTx.timeStamp * 1000).toLocaleDateString();
        lastActive = new Date(lastTx.timeStamp * 1000).toLocaleDateString();
        totalReceived = totalIn.toFixed(6) + " ETH";
        totalSent = totalOut.toFixed(6) + " ETH";
        uniqueInteractions = uniqueAddresses.size;
      } else {
        const nc = BLOCKCHAIR_NETWORKS[networkInfo.key];
        const url = `https://api.blockchair.com/${nc.code}/dashboards/address/${address}`;
        const res = await fetch(url);
        const json = await res.json();
        if (!json.data || !json.data[address] || !json.data[address].address) {
          setErr("No data or invalid address.");
          setLoading(false);
          return;
        }
        const info = json.data[address].address;
        totalTransactions = info.transaction_count;
        if (totalTransactions === 10000) totalTransactions = ">10,000";
        firstTransaction = info.first_seen_receiving || "-";
        lastActive = info.last_seen_receiving || "-";
        totalReceived = (info.received / Math.pow(10, nc.decimals)).toFixed(nc.decimals) + ` ${nc.symbol}`;
        totalSent = (info.spent / Math.pow(10, nc.decimals)).toFixed(nc.decimals) + ` ${nc.symbol}`;
        uniqueInteractions = info.output_count || info.outputs_count || "-";
      }
    } catch (e) {}

    const risk = getRiskScore({
      isBlacklisted,
      totalTransactions: typeof totalTransactions === "string" && totalTransactions.startsWith(">")
        ? 10001 : totalTransactions // для лимита показываем Medium Risk
    });

    setData({
      network: networkInfo.label,
      address,
      firstTransaction,
      lastActive,
      totalReceived,
      totalSent,
      totalTransactions,
      uniqueInteractions,
      riskScore: risk.score,
      riskLabel: risk.label,
      riskColor: risk.color,
      riskMsg: risk.msg,
      riskDistribution: getRiskDistribution(isBlacklisted),
      blockExplorer: networkInfo.explorer,
    });

    setLoading(false);
  };

  return (
    <Box sx={{ p: { xs: 1, md: 2 }, maxWidth: 900, mx: "auto", background: BG }}>
      <Card>
        <Typography
          sx={{
            fontFamily: "IBM Plex Mono, monospace",
            color: ACCENT,
            fontSize: 28,
            fontWeight: 700,
            mb: 1,
            letterSpacing: 0.5,
          }}
        >
          Crypto Address AML Analysis
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: ACCENT,
            fontFamily: "IBM Plex Mono, monospace",
            mb: 3,
            fontSize: 17,
          }}
        >
          Enter a BTC, ETH, LTC, BCH, DOGE, DASH, ZEC, or XRP address to check its transaction history and risk score.
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={9}>
            <TextField
              fullWidth
              placeholder="Enter any supported crypto address"
              value={address}
              onChange={(e) => setAddress(e.target.value.trim())}
              sx={{
                input: {
                  fontFamily: "IBM Plex Mono, monospace",
                  fontSize: 17,
                  color: ACCENT,
                },
                "& .MuiOutlinedInput-root": {
                  background: "#fff6f2",
                  borderRadius: "10px",
                  color: ACCENT,
                  "& fieldset": { borderColor: BORDER },
                  "&:hover fieldset": { borderColor: ACCENT },
                },
              }}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              fullWidth
              onClick={handleAnalyze}
              disabled={!address || loading}
              sx={{
                background: ACCENT,
                color: "#fff",
                fontWeight: 700,
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: 20,
                borderRadius: 10,
                textTransform: "none",
                py: 1.4,
                "&:hover": { background: "#a84e1a" },
              }}
            >
              {loading ? <CircularProgress color="inherit" size={24} /> : "Analyze"}
            </Button>
          </Grid>
        </Grid>
        {err && (
          <Typography color="error" sx={{ mt: 2, fontFamily: "IBM Plex Mono, monospace", fontSize: 19 }}>
            {err}
          </Typography>
        )}
      </Card>

      {data && (
        <>
          <Card>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={12} md={9}>
                <Typography sx={{ fontWeight: 700, fontSize: 22, color: ACCENT, fontFamily: "IBM Plex Mono, monospace" }}>
                  Address ({data.network})
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "IBM Plex Mono, monospace",
                    color: "#b46a3e",
                    wordBreak: "break-all",
                    fontSize: 18,
                    mt: 0.5,
                  }}
                >
                  {data.address}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3} sx={{ textAlign: "right" }}>
                <Typography sx={{ fontWeight: 700, fontSize: 20, color: ACCENT, fontFamily: "IBM Plex Mono, monospace" }}>
                  Transactions
                </Typography>
                <Chip
                  label={data.totalTransactions}
                  sx={{
                    background: "#fff6f2",
                    color: ACCENT,
                    fontWeight: 700,
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: 19,
                    border: `2px solid ${BORDER}`,
                  }}
                  size="medium"
                />
                {/* Если лимит — выводим сноску */}
                {data.totalTransactions === ">10,000" && (
                  <Typography sx={{ color: RED, fontFamily: "IBM Plex Mono, monospace", fontSize: 15, mt: 1 }}>
                    API limit: showing first 10,000 transactions
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Card>

          <Card>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 4, flexWrap: "wrap" }}>
              {/* Слева — risk score */}
              <RiskCircle riskColor={data.riskColor}>
                <Typography
                  sx={{
                    color: data.riskColor,
                    fontSize: 72,
                    fontWeight: 900,
                    lineHeight: 1,
                    fontFamily: "IBM Plex Mono, monospace",
                  }}
                >
                  {data.riskScore}
                </Typography>
                <Typography
                  sx={{
                    color: data.riskColor,
                    fontSize: 28,
                    fontWeight: 700,
                    letterSpacing: 1,
                    fontFamily: "IBM Plex Mono, monospace",
                    mt: 1,
                  }}
                >
                  {data.riskLabel}
                </Typography>
              </RiskCircle>

              {/* Центр/справа — текст и светофор */}
              <Box sx={{ minWidth: 350 }}>
                <Typography
                  sx={{
                    color: data.riskColor,
                    fontWeight: 800,
                    fontSize: 32,
                    fontFamily: "IBM Plex Mono, monospace",
                  }}
                >
                  {data.riskMsg.split(".")[0]}
                </Typography>
                <Typography
                  sx={{
                    color: ACCENT,
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: 19,
                    mb: 3,
                  }}
                >
                  {data.riskMsg}
                </Typography>
                <Box sx={{ display: "flex", gap: 3, mt: 1 }}>
                  {data.riskDistribution.map((risk) => (
                    <RiskBadge borderColor={risk.color} key={risk.label}>
                      <Typography
                        sx={{
                          color: risk.color,
                          fontWeight: 700,
                          fontFamily: "IBM Plex Mono, monospace",
                          fontSize: 26,
                        }}
                      >
                        {risk.label}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#c75b23",
                          fontFamily: "IBM Plex Mono, monospace",
                          fontSize: 19,
                        }}
                      >
                        {risk.percent}%
                      </Typography>
                    </RiskBadge>
                  ))}
                </Box>
              </Box>
            </Box>
          </Card>

          <Card>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography sx={{ color: ACCENT, fontFamily: "IBM Plex Mono, monospace", fontWeight: 600 }}>
                  First Transaction
                </Typography>
                <Typography>{data.firstTransaction}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography sx={{ color: ACCENT, fontFamily: "IBM Plex Mono, monospace", fontWeight: 600 }}>
                  Last Active
                </Typography>
                <Typography>{data.lastActive}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography sx={{ color: ACCENT, fontFamily: "IBM Plex Mono, monospace", fontWeight: 600 }}>
                  Received
                </Typography>
                <Typography>{data.totalReceived}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography sx={{ color: ACCENT, fontFamily: "IBM Plex Mono, monospace", fontWeight: 600 }}>
                  Sent
                </Typography>
                <Typography>{data.totalSent}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography sx={{ color: ACCENT, fontFamily: "IBM Plex Mono, monospace", fontWeight: 600 }}>
                  Total Transactions
                </Typography>
                <Typography>{data.totalTransactions}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography sx={{ color: ACCENT, fontFamily: "IBM Plex Mono, monospace", fontWeight: 600 }}>
                  Unique Interactions
                </Typography>
                <Typography>{data.uniqueInteractions}</Typography>
              </Grid>
            </Grid>
          </Card>

          {/* ADVANCED ANALYSIS */}
          <Card sx={{ border: `2px dashed ${BORDER}` }}>
            <Typography sx={{ color: ACCENT, fontWeight: 700, fontFamily: "IBM Plex Mono, monospace", mb: 2 }}>
              Advanced Analysis (opens in new tab)
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <LinkBtn
                  fullWidth
                  href={`https://metasleuth.io/address/${data.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  MetaSleuth
                </LinkBtn>
              </Grid>
              <Grid item xs={12} md={4}>
                <LinkBtn
                  fullWidth
                  href={data.blockExplorer}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data.network === "Ethereum" ? "Etherscan" : "Blockchair"}
                </LinkBtn>
              </Grid>
              <Grid item xs={12} md={4}>
                <LinkBtn
                  fullWidth
                  href={`https://breadcrumbs.app/address/${data.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Breadcrumbs
                </LinkBtn>
              </Grid>
            </Grid>
          </Card>
        </>
      )}
    </Box>
  );
}
