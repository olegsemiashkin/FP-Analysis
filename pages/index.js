{/* --- СЕТКА ОСНОВНЫХ КАРТОЧЕК и КАРТЫ --- */}
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 22,
    marginBottom: 30,
    alignItems: "stretch",
  }}
>
  {/* Первая строка: IP, Country, Region, КАРТА (на 2 колонки) */}
  <div
    style={{
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
    }}
  >
    <div style={{ color: "#f55d2b", fontSize: 13, fontWeight: 700, marginBottom: 2 }}>IP Address</div>
    <div>{mainData.ip || "-"}</div>
  </div>
  <div
    style={{
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
    }}
  >
    <div style={{ color: "#f55d2b", fontSize: 13, fontWeight: 700, marginBottom: 2 }}>Country</div>
    <div>{mainData.country || "-"}</div>
  </div>
  <div
    style={{
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
    }}
  >
    <div style={{ color: "#f55d2b", fontSize: 13, fontWeight: 700, marginBottom: 2 }}>Region</div>
    <div>{mainData.region || "-"}</div>
  </div>
  {/* Карта - занимает 2 колонки в первой строке */}
  <div
    style={{
      gridRow: "1 / span 2",
      gridColumn: "4 / span 1",
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

  {/* Вторая строка: City, Browser, OS, Platform, Languages */}
  <div
    style={{
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
    }}
  >
    <div style={{ color: "#f55d2b", fontSize: 13, fontWeight: 700, marginBottom: 2 }}>City</div>
    <div>{mainData.city || "-"}</div>
  </div>
  <div
    style={{
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
    }}
  >
    <div style={{ color: "#f55d2b", fontSize: 13, fontWeight: 700, marginBottom: 2 }}>Browser</div>
    <div>{mainData.browser || "-"}</div>
  </div>
  <div
    style={{
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
    }}
  >
    <div style={{ color: "#f55d2b", fontSize: 13, fontWeight: 700, marginBottom: 2 }}>OS</div>
    <div>{mainData.os || "-"}</div>
  </div>
  <div
    style={{
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
    }}
  >
    <div style={{ color: "#f55d2b", fontSize: 13, fontWeight: 700, marginBottom: 2 }}>Platform</div>
    <div>{mainData.platform || "-"}</div>
  </div>
  <div
    style={{
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
      gridColumn: "1 / span 2",
    }}
  >
    <div style={{ color: "#f55d2b", fontSize: 13, fontWeight: 700, marginBottom: 2 }}>Languages</div>
    <div>{mainData.languages || "-"}</div>
  </div>
</div>
