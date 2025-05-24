import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const LeafletMap = dynamic(
  async () => {
    const { MapContainer, TileLayer, CircleMarker } = await import("react-leaflet");
    return function InnerMap({ lat, lon }) {
      if (typeof window === "undefined") return null;
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
    };
  },
  { ssr: false }
);

export default function Map({ lat, lon }) {
  if (!lat || !lon) return null;
  return <LeafletMap lat={lat} lon={lon} />;
}
