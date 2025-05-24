import { MapContainer, TileLayer, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Map({ lat, lon }) {
  if (typeof window === "undefined") return null; // Защита от SSR!
  return (
    <MapContainer
      center={[lat, lon]}
      zoom={11}
      style={{ height: 110, width: "100%" }}
      scrollWheelZoom={false}
      attributionControl={false}
      dragging={false}
      zoomControl={false}
      doubleClickZoom={false}
      boxZoom={false}
      keyboard={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      <CircleMarker
        center={[lat, lon]}
        radius={18}
        fillColor="#f55d2b"
        color="#f55d2b"
        fillOpacity={0.45}
        stroke={false}
      />
    </MapContainer>
  );
}
