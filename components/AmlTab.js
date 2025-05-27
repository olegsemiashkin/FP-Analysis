import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  Paper
} from "@mui/material";
import { styled } from "@mui/material/styles";
import InfoIcon from "@mui/icons-material/Info";

const ACCENT = "#c75b23";
const BG = "#fff6f2";
const CARD = "#fff";
const BORDER = "#f7c89e";

const Card = styled(Paper)(({ theme }) => ({
  background: CARD,
  borderRadius: 16,
  boxShadow: "none",
  border: `2px solid ${BORDER}`,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
}));

const Label = styled(Typography)({
  fontFamily: "IBM Plex Mono, monospace",
  color: ACCENT,
  fontSize: 16,
  fontWeight: 600,
});

const StatText = styled(Typography)({
  fontFamily: "IBM Plex Mono, monospace",
  color: ACCENT,
  fontWeight: 400,
  fontSize: 18,
});

const RiskCircle = styled(Box)(({ riskColor }) => ({
  width: 72,
  height: 72,
  borderRadius: "50%",
  background: "#fff6f2",
  border: `3px solid ${riskColor}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  margin: "auto"
}));

const ScoreText = styled(Typography)(({ riskColor }) => ({
  fontFamily: "IBM Plex Mono, monospace",
  color: riskColor,
  fontWeight: 700,
  fontSize: 26,
}));

const RiskLabel = styled(Typography)(({ riskColor }) => ({
  fontFamily: "IBM Plex Mono, monospace",
  color: riskColor,
  fontWeight: 700,
  fontSize: 18,
  marginTop: 4,
}));

const AccentButton = styled(Button)({
  background: ACCENT,
  color: "#fff",
  fontWeight: 600,
  fontFamily: "IBM Plex Mono, monospace",
  fontSize: 18,
  borderRadius: 10,
  textTransform: "none",
  marginLeft: 8,
  "&:hover": {
    background: "#a84e1a",
  },
});

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
    color: "#a84e1a"
  },
});

const mockRiskData = {
  score: 3,
  label: "High Risk",
  color: "#e03c1a",
  message: "High risk of blocking. Transfers from this wallet may be blocked on centralized exchanges. We recommend contacting an AML officer.",
  distribution: [
    { label: "Dark Market", percent: 4.7, color: "#e03c1a" },
    { label: "Exchange", percent: 30.4, color: "#4caf50" },
    { label: "Mixer", percent: 2.1, color: "#ffb300" }
  ]
};

export default function AmlTab() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  // Risk scoring logic (mock example)
  function getRiskScore(txCount) {
    if (txCount > 8000) return { score: 3, label: "High Risk", color: "#e03c1a" };
    if (txCount > 2000) return { score: 7, label: "Low Risk", color: "#4caf50" };
    return { score: 9, label: "Trusted", color: "#4caf50" };
  }

  const handleAnalyze = async () => {
    setErr(null);
    setData(null);
    if (!address) return;
    setLoading(true);

    try {
      const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=1QUX49MGQE21PWNXJSANUUU2ASHYUGMDKK`;
      const res = await fetch(url);
      const json = await res.json();

      if (!json.result || !Array.isArray(json.result) || json.result.length === 0) {
        setErr("No data or invalid address.");
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

      // Risk mock for demo (replace with real scoring)
      const risk = getRiskScore(txs.length);

      setData({
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
        etherscan: `https://etherscan.io/address/${address}`,
        metasleuth: `https://metasleuth.io/address/${address}`,
        breadcrumbs: `https://www.breadcrumbs.app/address/${address}`,
        riskMessage: mockRiskData.message,
        riskDistribution: mockRiskData.distribution
      });

    } catch (e) {
      setErr("Error fetching data.");
    }
    setLoading(false);
  };

  return (
    <Box sx={{ p: { xs: 1, md: 2 }, maxWidth: 900, mx: "auto", background: BG }}>
      <Card>
        <Label variant="h4" sx={{ fontSize: 28, mb: 2 }}>
          Crypto Address AML Analysis
        </Label>
        <Typography
          variant="body2"
          sx={{ color: ACCENT, fontFamily: "IBM Plex Mono, monospace", mb: 3, fontSize: 16 }}
        >
          Enter an ETH address to check its transaction history and risk score using Etherscan API.
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={9}>
            <TextField
              fullWidth
              placeholder="Enter Ethereum address"
              value={address}
              onChange={(e) => setAddress(e.target.value.trim())}
              sx={{
                input: { fontFamily: "IBM Plex Mono, monospace", fontSize: 17, color: ACCENT },
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
            <AccentButton
              fullWidth
              onClick={handleAnalyze}
              disabled={!address || loading}
              sx={{ py: 1.4 }}
            >
              {loading ? <CircularProgress color="inherit" size={24} /> : "Analyze"}
            </AccentButton>
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
                <Typography
                  sx={{
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: 18,
                    color: ACCENT,
                    mb: 1
                  }}
                >
                  Address
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "IBM Plex Mono, monospace",
                    color: "#b46a3e",
                    wordBreak: "break-all",
                    fontSize: 17
                  }}
                >
                  {data.address}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography sx={{ color: ACCENT, fontSize: 16, fontFamily: "IBM Plex Mono, monospace", mb: 0.7 }}>
                  Transactions
                </Typography>
                <Chip
                  label={data.totalTransactions}
                  sx={{
                    background: "#fff6f2",
                    color: ACCENT,
                    fontWeight: 700,
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: 15,
                    border: `2px solid ${BORDER}`,
                  }}
                  size="medium"
                />
              </Grid>
            </Grid>
          </Card>

          <Card>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <RiskCircle riskColor={data.riskColor}>
                  <ScoreText riskColor={data.riskColor}>
                    {data.riskScore}
                  </ScoreText>
                  <RiskLabel riskColor={data.riskColor}>
                    {data.riskLabel}
                  </RiskLabel>
                </RiskCircle>
              </Grid>
              <Grid item xs={12} md={9}>
                <Typography
                  sx={{
                    color: data.riskColor,
                    fontFamily: "IBM Plex Mono, monospace",
                    fontWeight: 600,
                    fontSize: 18,
                  }}
                >
                  {data.riskLabel === "High Risk" ? "High risk of blocking" : "Trusted"}
                </Typography>
                <Typography
                  sx={{
                    color: ACCENT,
                    fontFamily: "IBM Plex Mono, monospace",
                    fontSize: 15,
                    mb: 2
                  }}
                >
                  {data.riskMessage}
                </Typography>
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  {data.riskDistribution.map((risk, idx) => (
                    <Grid item xs={12} md={4} key={idx}>
                      <Box sx={{ border: `2px solid ${risk.color}`, borderRadius: 10, p: 2, textAlign: "center", mb: 1 }}>
                        <Typography sx={{ color: risk.color, fontWeight: 700, fontFamily: "IBM Plex Mono, monospace" }}>
                          {risk.label}
                        </Typography>
                        <Typography sx={{ color: ACCENT, fontFamily: "IBM Plex Mono, monospace", fontSize: 15 }}>
                          {risk.percent}%
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
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
              Advanced Analysis (opens in a new tab)
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <LinkBtn
                  fullWidth
                  href={data.metasleuth}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  MetaSleuth
                </LinkBtn>
              </Grid>
              <Grid item xs={12} md={4}>
                <LinkBtn
                  fullWidth
                  href={data.etherscan}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Etherscan
                </LinkBtn>
              </Grid>
              <Grid item xs={12} md={4}>
                <LinkBtn
                  fullWidth
                  href={data.breadcrumbs}
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
