// components/Map.js

import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';

export default function Map({ lat, lon, city }) {
  return (
    <div style={{
      background: "#fff1e6",
      border: "2px solid #3793ec",
      borderRadius: 18,
      padding: 8,
      margin: "0 auto"
    }}>
      <MapContainer
        center={[lat, lon]}
        zoom={10} // Уменьшил для охвата города!
        style={{ height: 180, width: 320 }}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={[lat, lon]} />
        <Circle center={[lat, lon]} radius={2500} pathOptions={{ color: "#e95a16", fillOpacity: 0.2 }} />
      </MapContainer>
    </div>
  );
}
