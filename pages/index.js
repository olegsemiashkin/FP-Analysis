{/* Верхний блок карточек и карта */}
<div style={{
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 22,
  marginBottom: 30
}}>
  {/* Левая колонка: стандартные поля */}
  {["ip", "country", "region", "city", "browser", "os", "platform", "languages"].map((key, idx) => (
    <div key={key} style={{
      background: "#fff8f2",
      border: "1.5px solid #ffe0c2",
      borderRadius: 8,
      padding: "14px 17px",
      fontSize: 15,
      color: "#b45309",
      fontWeight: 600,
      boxShadow: "0 2px 8px 0 rgba(246,122,38,0.03)",
      gridColumn: idx === 2 ? "1 / span 1" : undefined // чтобы City не сломал сетку
    }}>
      <div style={{ color: "#f55d2b", fontSize: 13, fontWeight: 700, marginBottom: 2 }}>
        {paramOrder.find(p => p.key === key)?.label || key}
      </div>
      <div>{mainData[key] || "-"}</div>
    </div>
  ))}
  {/* Карта — большая карточка, занимает две колонки справа */}
  <div style={{
    gridColumn: "3 / span 2", // занимает 3-4 колонку
    background: "#fff",
    border: "1.5px solid #ececec",
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    padding: "18px 20px",
    minHeight: 120,
    boxShadow: "0 2px 8px 0 rgba(246,122,38,0.03)"
  }}>
    <div style={{ flex: 1 }}>
      <div style={{
        fontWeight: 700,
        fontSize: 18,
        color: "#303030",
        marginBottom: 2
      }}>
        Geolocation <span style={{fontSize:18, color:"#f55d2b"}}>↗</span>
      </div>
      <div style={{ fontSize: 16, color: "#ad5a11" }}>
        {geo?.city}, {geo?.region},<br />{geo?.country_name}
      </div>
    </div>
    <div style={{
      width: 220,
      height: 110,
      marginLeft: 16,
      borderRadius: 8,
      border: "2px solid #3396f3",
      overflow: "hidden"
    }}>
      {geo && geo.latitude && geo.longitude ? (
        <Map lat={geo.latitude} lon={geo.longitude} />
      ) : (
        <div style={{ color: "#d15000", padding: 40, textAlign: "center", fontWeight: 600 }}>No map</div>
      )}
    </div>
  </div>
</div>
