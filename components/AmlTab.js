import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Chip,
  Tooltip,
  CircularProgress
} from "@mui/material";
import { styled } from "@mui/material/styles";
import InfoIcon from "@mui/icons-material/Info";

const Card = styled(Paper)(({ theme }) => ({
  background: "#181a20",
  color: "#fff",
  borderRadius: 16,
  boxShadow: "0 2px 16px 0 rgba(0,0,0,0.12)",
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  border: "1px solid #262b36",
}));

const StatBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "8px 0",
  minWidth: 0,
});

const ExtLinkButton = styled(Button)({
  borderRadius: 12,
  fontWeight: 600,
  background: "#24293a",
  color: "#fff",
  marginTop: 10,
  "&:hover": { background: "#343d55", color: "#fff" },
  boxShadow: "none",
  textTransform: "none",
  fontSize: 15,
});

const SecondaryLabel = ({ children, tip }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
    <Typography
      component="span"
      variant="caption"
      color="#8a92a6"
      fontWeight={500}
      letterSpacing={0.2}
      sx={{ userSelect: "text" }}
    >
      {children}
    </Typography>
    {tip && (
      <Tooltip title={tip}>
        <InfoIcon sx={{ fontSize: 15, color: "#555" }} />
      </Tooltip>
    )}
  </Box>
);

const ETHERSCAN_API_KEY = "1QUX49MGQE21PWNXJSANUUU2ASHYUGMDKK"; // твой ключ

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

    try {
      const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${ETHERSCAN_API_KEY}`;
      const res = await fetch(url);
      const json = await res.json();

      if (!json.result || !Array.isArray(json.result) || json.result.length === 0) {
        setErr("Нет данных или некорректный адрес.");
        setLoading(false);
        return;
      }

      // Аналитика:
      const txs = json.result;
      const firstTx = txs[0];
      const lastTx = txs[txs.length - 1];
      let totalIn = 0;
      let totalOut = 0;
      let contractInteractions = 0;
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
        if (tx.contractAddress && tx.contractAddress !== "") contractInteractions++;
      }

      setData({
        address,
        firstTransaction: new Date(firstTx.timeStamp * 1000).toLocaleDateString(),
        lastActive: new Date(lastTx.timeStamp * 1000).toLocaleDateString(),
        totalReceived: totalIn.toFixed(6) + " ETH",
        totalSent: totalOut.toFixed(6) + " ETH",
        totalTransactions: txs.length,
        uniqueInteractions: uniqueAddresses.size,
        contractInteractions: contractInteractions,
        etherscan: `https://etherscan.io/address/${address}`,
        metasleuth: `https://metasleuth.io/address/${address}`,
        breadcrumbs: `https://www.breadcrumbs.app/address/${address}`,
      });

    } catch (e) {
      setErr("Ошибка при получении данных.");
    }
    setLoading(false);
  };

  return (
    <Box sx={{ p: { xs: 0, md: 2 }, maxWidth: 900, mx: "auto" }}>
      <Card>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Крипто-адрес AML анализ
        </Typography>
        <Typography
          variant="body2"
          color="#8a92a6"
          sx={{ mb: 2, maxWidth: 520 }}
        >
          Введите ETH-адрес для базовой проверки истории транзакций через Etherscan API.
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              placeholder="Введите Ethereum-адрес"
              value={address}
              onChange={(e) => setAddress(e.target.value.trim())}
              sx={{
                input: { color: "#fff" },
                "& .MuiOutlinedInput-root": {
                  background: "#23262f",
                  borderRadius: "8px",
                  color: "#fff",
                  "& fieldset": { borderColor: "#353e56" },
                  "&:hover fieldset": { borderColor: "#4567a2" },
                },
              }}
              disabled={loading}
            />
          </Grid>
          <Grid item xs={12} sm={4} sx={{ display: "flex", alignItems: "stretch" }}>
            <Button
              onClick={handleAnalyze}
              disabled={!address || loading}
              fullWidth
              variant="contained"
              sx={{
                fontWeight: 700,
                borderRadius: 2,
                background: "#296cff",
                boxShadow: "none",
                textTransform: "none",
                fontSize: 18,
                height: "100%",
                "&:hover": { background: "#1858d7" },
              }}
            >
              {loading ? <CircularProgress color="inherit" size={24} /> : "Анализировать"}
            </Button>
          </Grid>
        </Grid>
        {err && (
          <Typography color="error" sx={{ mt: 2 }}>
            {err}
          </Typography>
        )}
      </Card>

      {data && (
        <>
          <Card sx={{ mb: 2, background: "#1d2027" }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={8}>
                <SecondaryLabel>Адрес</SecondaryLabel>
                <Typography
                  sx={{
                    fontSize: 15.5,
                    fontFamily: "monospace",
                    wordBreak: "break-all",
                    mt: 0.5,
                    color: "#c1cbdd",
                  }}
                >
                  {data.address}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <SecondaryLabel>Транзакций</SecondaryLabel>
                <Box sx={{ textAlign: "center", mt: 0.5 }}>
                  <Chip
                    label={data.totalTransactions}
                    sx={{
                      background: "#23262f",
                      color: "#1976d2",
                      fontWeight: 700,
                      fontSize: 13,
                      border: "1.3px solid",
                      borderColor: "#1976d2",
                      mt: -1,
                    }}
                    size="small"
                  />
                </Box>
              </Grid>
            </Grid>
          </Card>

          <Card>
            <Grid container spacing={2}>
              <Grid item xs={6} md={4}>
                <StatBox>
                  <SecondaryLabel tip="С момента первой зафиксированной транзакции">Первая транзакция</SecondaryLabel>
                  <Typography color="#b8bac6">{data.firstTransaction}</Typography>
                </StatBox>
              </Grid>
              <Grid item xs={6} md={4}>
                <StatBox>
                  <SecondaryLabel>Последняя активность</SecondaryLabel>
                  <Typography color="#b8bac6">{data.lastActive}</Typography>
                </StatBox>
              </Grid>
              <Grid item xs={6} md={4}>
                <StatBox>
                  <SecondaryLabel>Получено</SecondaryLabel>
                  <Typography color="#b8bac6">{data.totalReceived}</Typography>
                </StatBox>
              </Grid>
              <Grid item xs={6} md={4}>
                <StatBox>
                  <SecondaryLabel>Отправлено</SecondaryLabel>
                  <Typography color="#b8bac6">{data.totalSent}</Typography>
                </StatBox>
              </Grid>
              <Grid item xs={6} md={4}>
                <StatBox>
                  <SecondaryLabel>Всего транзакций</SecondaryLabel>
                  <Typography color="#b8bac6">{data.totalTransactions}</Typography>
                </StatBox>
              </Grid>
              <Grid item xs={6} md={4}>
                <StatBox>
                  <SecondaryLabel>Уникальных взаимодействий</SecondaryLabel>
                  <Typography color="#b8bac6">{data.uniqueInteractions}</Typography>
                </StatBox>
              </Grid>
            </Grid>
          </Card>

          <Card sx={{ background: "#171923" }}>
            <Typography fontWeight={600} gutterBottom>
              Расширенный анализ (откроется в новой вкладке)
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <ExtLinkButton
                  fullWidth
                  href={data.metasleuth}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  MetaSleuth
                </ExtLinkButton>
              </Grid>
              <Grid item xs={12} md={4}>
                <ExtLinkButton
                  fullWidth
                  href={data.etherscan}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Etherscan
                </ExtLinkButton>
              </Grid>
              <Grid item xs={12} md={4}>
                <ExtLinkButton
                  fullWidth
                  href={data.breadcrumbs}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Breadcrumbs
                </ExtLinkButton>
              </Grid>
            </Grid>
          </Card>
        </>
      )}
    </Box>
  );
}
