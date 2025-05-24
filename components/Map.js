// components/Map.js
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function GeoMap({ lat, lon }) {
  if (!lat || !lon) return <div style={{ textAlign: "center", color: "#f55d2b" }}>No map data</div>;

  return (
    <div style={{
      background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #f9d6bd52", padding: 10,
      display: "flex", justifyContent: "center", alignItems: "center"
    }}>
      <MapContainer
        center={[lat, lon]}
        zoom={11}
        style={{ width: 260, height: 150, borderRadius: 16, border: "3px solid #2981e9", background: "#fff" }}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          // Белый минималистичный стиль
          url="https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lon]} />
        <Circle center={[lat, lon]} radius={2000} pathOptions={{ color: "#f55d2b", fillOpacity: 0.22 }} />
      </MapContainer>
    </div>
  );
}
