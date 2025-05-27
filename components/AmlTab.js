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

const ACCENT = "#c75b23";
const BG = "#fff6f2";
const CARD = "#fff";
const BORDER = "#facfad";
const RED = "#e03c1a";
const GREEN = "#4caf50";
const ORANGE = "#ffb300";

const Card = styled(Paper)({
  background: CARD,
  borderRadius: 24,
  boxShadow: "none",
  border: `2px solid ${BORDER}`,
  padding: 32,
  marginBottom: 22,
});

const Label = styled(Typography)({
  fontFamily: "IBM Plex Mono, monospace",
  color: ACCENT,
  fontSize: 19,
  fontWeight: 600,
});

const StatText = styled(Typography)({
  fontFamily: "IBM Plex Mono, monospace",
  color: ACCENT,
  fontWeight: 400,
  fontSize: 19,
});

const RiskCircle = styled(Box)(({ riskColor }) => ({
  width: 108,
  height: 108,
  borderRadius: "50%",
  border: `5px solid ${riskColor}`,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto",
  mb: 2,
}));

const ScoreNum = styled(Typography)(({ riskColor }) => ({
  fontFamily: "IBM Plex Mono, monospace",
  color: riskColor,
  fontWeight: 900,
  fontSize: 42,
  lineHeight: "44px",
}));

const ScoreLabel = styled(Typography)(({ riskColor }) => ({
  fontFamily: "IBM Plex Mono, monospace",
  color: riskColor,
  fontWeight: 700,
  fontSize: 18,
  lineHeight: "18px",
  marginTop: 8,
  textAlign: "center",
}));

const RiskCard = styled(Box)(({ borderColor }) => ({
  border: `3px solid ${borderColor}`,
  borderRadius: 100,
  px: 4,
  py: 2,
  textAlign: "center",
  minWidth: 170,
  margin: "0 12px",
  background: "#fff",
  display: "inline-block",
}));

const LinkBtn = styled(Button)({
  background: "#fff",
  color: ACCENT,
  fontWeight: 600,
  border: `2px solid ${ACCENT}`,
  fontFamily: "IBM Plex Mono, monospace",
  borderRadius: 10,
  margin: "8px 0",
  minWidth: 140,
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

// МОК для примера — можно брать реальные данные при интеграции риск-аналитики
function getRiskDistribution() {
  return [
    { label: "Dark Market", percent: 4.7, color: RED },
    { label: "Exchange", percent: 30.4, color: GREEN },
    { label: "Mixer", percent: 2.1, color: ORANGE }
  ];
}

function riskMock(txCount) {
  if (txCount > 5000) return { score: 3, label: "High Risk", color: RED, msg: "High risk of blocking. Transfers from this wallet may be blocked on centralized exchanges. We recommend contacting an AML officer." };
  if (txCount > 500) return { score: 6, label: "Medium Risk", color: ORANGE, msg: "Medium risk. Activity detected but nothing critical." };
  return { score: 9, label: "Trusted", color: GREEN, msg: "This wallet is generally considered safe." };
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

    try {
      if (networkInfo.key === "eth") {
        // ETH via Etherscan
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

        const risk = riskMock(txs.length);

        setData({
          network: networkInfo.label,
          address,
          firstTransaction: new Date(firstTx.timeStamp * 1000).toLocaleDateString(),
          lastActive: new Date(lastTx.timeStamp * 1000).toLocaleDateString(),
          totalReceived: totalIn.toFixed(6) + " ETH",
          totalSent: totalOut.toFixed(6) + " ETH",
          totalTransactions: txs.length,
          uniqueInteractions: uniqueAddresses.size,
          riskScore: risk.score,
          riskLabel: risk.label,
          riskColor: risk.color,
          riskMsg: risk.msg,
          blockExplorer: networkInfo.explorer,
          riskDistribution: getRiskDistribution()
        });
      } else {
        // Blockchair coins
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
        const risk = riskMock(info.transaction_count || info.transaction_count_received || 0);

        setData({
          network: nc.label,
          address,
          firstTransaction: info.first_seen_receiving || "-",
          lastActive: info.last_seen_receiving || "-",
          totalReceived: (info.received / Math.pow(10, nc.decimals)).toFixed(nc.decimals) + ` ${nc.symbol}`,
          totalSent: (info.spent / Math.pow(10, nc.decimals)).toFixed(nc.decimals) + ` ${nc.symbol}`,
          totalTransactions: info.transaction_count,
          uniqueInteractions: info.output_count || info.outputs_count || "-",
          riskScore: risk.score,
          riskLabel: risk.label,
          riskColor: risk.color,
          riskMsg: risk.msg,
          blockExplorer: networkInfo.explorer,
          riskDistribution: getRiskDistribution()
        });
      }
    } catch (e) {
      setErr("Error fetching blockchain data.");
    }
    setLoading(false);
  };

  return (
    <Box sx={{ p: { xs: 1, md: 2 }, maxWidth: 900, mx: "auto", background: BG }}>
      <Card>
        <Typography
          sx={{
            fontFamily: "IBM Plex Mono, monospace",
            color: ACCENT,
            fontSize: 26,
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
            fontSize: 16,
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
                fontWeight: 600,
                fontFamily: "IBM Plex Mono, monospace",
                fontSize: 18,
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
          <Typography color="error" sx={{ mt: 2, fontFamily: "IBM Plex Mono, monospace" }}>
            {err}
          </Typography>
        )}
      </Card>

      {data && (
        <>
          <Card>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={12} md={9}>
                <Label sx={{ fontWeight: 700, fontSize: 22 }}>
                  Address ({data.network})
                </Label>
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
                <Label sx={{ fontWeight: 700, fontSize: 20 }}>
                  Transactions
                </Label>
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
              </Grid>
            </Grid>
          </Card>

          <Card>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={12} md={4}>
                <RiskCircle riskColor={data.riskColor}>
                  <ScoreNum riskColor={data.riskColor}>{data.riskScore}</ScoreNum>
                  <ScoreLabel riskColor={data.riskColor}>{data.riskLabel}</ScoreLabel>
                </RiskCircle>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography
                  sx={{
                    color: data.riskColor,
                    fontFamily: "IBM Plex Mono, monospace",
                    fontWeight: 700,
                    fontSize: 25,
                  }}
                >
                  {data.riskMsg.split(".")[0]}
                </Typography>
                <Typography
                  sx={{
                    color: ACCENT,
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: 16,
                    mb: 2,
                  }}
                >
                  {data.riskMsg}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 3,
                    justifyContent: { xs: "flex-start", md: "flex-start" },
                    flexWrap: "wrap",
                    mt: 3,
                  }}
                >
                  {data.riskDistribution.map((risk, idx) => (
                    <RiskCard borderColor={risk.color} key={risk.label}>
                      <Typography sx={{ color: risk.color, fontWeight: 700, fontFamily: "IBM Plex Mono, monospace", fontSize: 21 }}>
                        {risk.label}
                      </Typography>
                      <Typography sx={{ color: ACCENT, fontFamily: "IBM Plex Mono, monospace", fontSize: 18 }}>
                        {risk.percent}%
                      </Typography>
                    </RiskCard>
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Card>

          <Card>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Label>First Transaction</Label>
                <StatText>{data.firstTransaction}</StatText>
              </Grid>
              <Grid item xs={12} md={4}>
                <Label>Last Active</Label>
                <StatText>{data.lastActive}</StatText>
              </Grid>
              <Grid item xs={12} md={4}>
                <Label>Received</Label>
                <StatText>{data.totalReceived}</StatText>
              </Grid>
              <Grid item xs={12} md={4}>
                <Label>Sent</Label>
                <StatText>{data.totalSent}</StatText>
              </Grid>
              <Grid item xs={12} md={4}>
                <Label>Total Transactions</Label>
                <StatText>{data.totalTransactions}</StatText>
              </Grid>
              <Grid item xs={12} md={4}>
                <Label>Unique Interactions</Label>
                <StatText>{data.uniqueInteractions}</StatText>
              </Grid>
            </Grid>
          </Card>

          <Card sx={{ border: `2px dashed ${BORDER}` }}>
            <Typography sx={{ color: ACCENT, fontWeight: 700, fontFamily: "IBM Plex Mono, monospace", mb: 2 }}>
              View on Block Explorer
            </Typography>
            <LinkBtn
              fullWidth
              href={data.blockExplorer}
              target="_blank"
              rel="noopener noreferrer"
            >
              {data.network} Explorer
            </LinkBtn>
          </Card>
        </>
      )}
    </Box>
  );
}
