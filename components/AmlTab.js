import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const Card = styled(Paper)(({ theme }) => ({
  background: "#181a20",
  color: "#fff",
  borderRadius: 16,
  boxShadow: "0 2px 16px 0 rgba(0,0,0,0.12)",
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  border: "1px solid #262b36",
}));

const RiskCircle = styled(Box)(({ theme, color }) => ({
  width: 62,
  height: 62,
  borderRadius: "50%",
  border: `2.5px solid ${color}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#222531",
  margin: "0 auto",
  marginBottom: theme.spacing(1),
}));

const StatBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "8px 0",
  minWidth: 0,
});

const RiskBarBg = styled(Box)(({ theme }) => ({
  width: "100%",
  height: 7,
  borderRadius: 4,
  background: "#23262f",
  marginRight: 12,
}));

const RiskBarFg = styled(Box)(({ value, color }) => ({
  width: `${value}%`,
  height: "100%",
  borderRadius: 4,
  background: color,
  transition: "width .3s cubic-bezier(.4,0,.2,1)",
}));

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
        <InfoOutlinedIcon sx={{ fontSize: 15, color: "#555" }} />
      </Tooltip>
    )}
  </Box>
);

export default function AmlTab() {
  const [address, setAddress] = useState("");
  const [data, setData] = useState(null);

  const handleAnalyze = async () => {
    // Здесь будет реальный запрос к API, сейчас используем моковые данные
    const mockData = {
      address: address,
      riskScore: 7,
      riskLevel: "Low Risk",
      riskColor: "#4caf50",
      riskDistribution: {
        safe: 90,
        risky: 0,
        danger: 10,
      },
      activity: {
        firstTransaction: "2025-05-13",
        lastActive: "2025-05-26",
        totalReceived: "0.0118 ETH",
        totalSent: "0.0000 ETH",
        totalTransactions: 10,
        uniqueInteractions: 5,
        contractInteractions: 7,
      },
      riskAnalysis: {
        highRisk: [
          { name: "Dark Market", percentage: 4.7, amount: 34.65 },
          { name: "Exchange Fraudulent", percentage: 0.3, amount: 2.21 },
          { name: "Mixer", percentage: 0.6, amount: 4.42 },
        ],
        suspicious: [
          { name: "Exchange High Risk", percentage: 24.1, amount: 177.68 },
          { name: "Exchange Moderate Risk", percentage: 23.7, amount: 174.73 },
        ],
      },
    };
    setData(mockData);
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
          Введите ETH-адрес для быстрой оценки рисков, истории транзакций и проверки на связь с мошенническими сервисами. Для расширенного анализа используйте сторонние сервисы ниже.
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
            />
          </Grid>
          <Grid item xs={12} sm={4} sx={{ display: "flex", alignItems: "stretch" }}>
            <Button
              onClick={handleAnalyze}
              disabled={!address}
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
              Анализировать
            </Button>
          </Grid>
        </Grid>
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
                <SecondaryLabel>Риск-оценка</SecondaryLabel>
                <Box sx={{ textAlign: "center", mt: 0.5 }}>
                  <RiskCircle color={data.riskColor}>
                    <Typography variant="h6" sx={{ color: data.riskColor }}>
                      {data.riskScore}
                    </Typography>
                  </RiskCircle>
                  <Chip
                    label={data.riskLevel}
                    sx={{
                      background: "#23262f",
                      color: data.riskColor,
                      fontWeight: 700,
                      fontSize: 13,
                      border: "1.3px solid",
                      borderColor: data.riskColor,
                      mt: -1,
                    }}
                    size="small"
                  />
                </Box>
              </Grid>
            </Grid>
          </Card>

          <Card>
            <SecondaryLabel>Распределение риска</SecondaryLabel>
            <Grid container spacing={2} sx={{ mt: 0.7 }}>
              {[
                { label: "Безопасно", value: data.riskDistribution.safe, color: "#4caf50" },
                { label: "Риск", value: data.riskDistribution.risky, color: "#ff9800" },
                { label: "Опасно", value: data.riskDistribution.danger, color: "#f44336" },
              ].map((item) => (
                <Grid item xs={4} key={item.label}>
                  <StatBox>
                    <Typography
                      fontWeight={600}
                      fontSize={23}
                      color={item.color}
                      mb={0.4}
                    >
                      {item.value}%
                    </Typography>
                    <Typography variant="caption" color="#8a92a6">
                      {item.label}
                    </Typography>
                  </StatBox>
                </Grid>
              ))}
            </Grid>
          </Card>

          <Card>
            <Grid container spacing={2}>
              <Grid item xs={6} md={4}>
                <StatBox>
                  <SecondaryLabel tip="С момента первой зафиксированной транзакции">Первая транзакция</SecondaryLabel>
                  <Typography color="#b8bac6">{data.activity.firstTransaction}</Typography>
                </StatBox>
              </Grid>
              <Grid item xs={6} md={4}>
                <StatBox>
                  <SecondaryLabel>Последняя активность</SecondaryLabel>
                  <Typography color="#b8bac6">{data.activity.lastActive}</Typography>
                </StatBox>
              </Grid>
              <Grid item xs={6} md={4}>
                <StatBox>
                  <SecondaryLabel>Получено</SecondaryLabel>
                  <Typography color="#b8bac6">{data.activity.totalReceived}</Typography>
                </StatBox>
              </Grid>
              <Grid item xs={6} md={4}>
                <StatBox>
                  <SecondaryLabel>Отправлено</SecondaryLabel>
                  <Typography color="#b8bac6">{data.activity.totalSent}</Typography>
                </StatBox>
              </Grid>
              <Grid item xs={6} md={4}>
                <StatBox>
                  <SecondaryLabel>Всего транзакций</SecondaryLabel>
                  <Typography color="#b8bac6">{data.activity.totalTransactions}</Typography>
                </StatBox>
              </Grid>
              <Grid item xs={6} md={4}>
                <StatBox>
                  <SecondaryLabel>Уникальных взаимодействий</SecondaryLabel>
                  <Typography color="#b8bac6">{data.activity.uniqueInteractions}</Typography>
                </StatBox>
              </Grid>
            </Grid>
          </Card>

          <Card>
            <Typography fontWeight={700} sx={{ mb: 1 }}>
              Детализация риска
            </Typography>
            <Divider sx={{ mb: 1.5, borderColor: "#252832" }} />

            {data.riskAnalysis.highRisk.length > 0 && (
              <>
                <SecondaryLabel tip="Высокорисковые связи или сервисы, связанные с адресом">Высокий риск</SecondaryLabel>
                {data.riskAnalysis.highRisk.map((item) => (
                  <Box key={item.name} sx={{ mb: 1.5 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography color="#e57373">{item.name}</Typography>
                      <Typography color="#c1cbdd">${item.amount}</Typography>
                    </Box>
                    <RiskBarBg>
                      <RiskBarFg value={item.percentage} color="#e57373" />
                    </RiskBarBg>
                    <Typography variant="caption" color="#e57373">
                      {item.percentage}%
                    </Typography>
                  </Box>
                ))}
              </>
            )}

            {data.riskAnalysis.suspicious.length > 0 && (
              <>
                <Box mt={2}>
                  <SecondaryLabel tip="Подозрительные сервисы и moderate risk обменники">Подозрительно</SecondaryLabel>
                </Box>
                {data.riskAnalysis.suspicious.map((item) => (
                  <Box key={item.name} sx={{ mb: 1.5 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography color="#ffb74d">{item.name}</Typography>
                      <Typography color="#c1cbdd">${item.amount}</Typography>
                    </Box>
                    <RiskBarBg>
                      <RiskBarFg value={item.percentage} color="#ffb74d" />
                    </RiskBarFg>
                    <Typography variant="caption" color="#ffb74d">
                      {item.percentage}%
                    </Typography>
                  </Box>
                ))}
              </>
            )}
          </Card>

          <Card sx={{ background: "#171923" }}>
            <Typography fontWeight={600} gutterBottom>
              Расширенный анализ (откроется в новой вкладке)
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <ExtLinkButton
                  fullWidth
                  href={`https://metasleuth.io/address/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  MetaSleuth
                </ExtLinkButton>
              </Grid>
              <Grid item xs={12} md={4}>
                <ExtLinkButton
                  fullWidth
                  href={`https://etherscan.io/address/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Etherscan
                </ExtLinkButton>
              </Grid>
              <Grid item xs={12} md={4}>
                <ExtLinkButton
                  fullWidth
                  href={`https://www.breadcrumbs.app/address/${address}`}
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
