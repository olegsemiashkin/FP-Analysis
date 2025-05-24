import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Карта — белый фон, ярко-оранжевый круг, без тени вокруг
const LeafletMap = dynamic(
  async () => {
    const { MapContainer, TileLayer, CircleMarker } = await import("react-leaflet");
    return function InnerMap({ lat, lon }) {
      if (typeof window === "undefined") return null;
      return (
        <div style={{
          background: "#fff",
          width: "100%",
          height: "100%",
          borderRadius: 12,
          boxShadow: "0 2px 16px 0 rgba(235,120,36,0.04)",
          border: "2px solid #f55d2b",
          overflow: "hidden"
        }}>
          <MapContainer
            center={[lat, lon]}
            zoom={13}
            style={{ height: 140, width: "100%" }}
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
              maxZoom={18}
            />
            <CircleMarker
              center={[lat, lon]}
              radius={19}
              fillColor="#f55d2b"
              color="#f55d2b"
              fillOpacity={0.40}
              stroke={false}
            />
          </MapContainer>
        </div>
      );
    };
  },
  { ssr: false }
);

export default function Map({ lat, lon }) {
  if (!lat || !lon) return null;
  return <LeafletMap lat={lat} lon={lon} />;
}
