// components/Map.js
import { MapContainer, TileLayer, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Map({ lat, lon }) {
  // Если координаты не переданы — не рендерим карту
  if (!lat || !lon) return <div style={{ height: 150, background: "#fff", borderRadius: 16 }} />;

  return (
    <MapContainer
      center={[lat, lon]}
      zoom={12}
      scrollWheelZoom={false}
      style={{
        height: 150,
        width: "100%",
        borderRadius: 16,
        border: "4px solid #248afd",
        background: "#fff", // Белый фон
        filter: "grayscale(0.2) brightness(1.03)", // Чуть светлее
        margin: "0 auto",
      }}
      dragging={false}
      doubleClickZoom={false}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        url="https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution=""
      />
      <Circle
        center={[lat, lon]}
        radius={2500}
        pathOptions={{
          fillColor: "#f55d2b",
          color: "#f55d2b",
          fillOpacity: 0.35,
        }}
      />
    </MapContainer>
  );
}
