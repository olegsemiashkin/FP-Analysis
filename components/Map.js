import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';

export default function Map({ lat, lon, city }) {
  return (
    <div style={{
      background: "#fff1e6",
      border: "2.5px solid #3793ec",
      borderRadius: 18,
      padding: 10,
      margin: "0 auto",
      minWidth: 220,
      minHeight: 145,
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <MapContainer
        center={[lat, lon]}
        zoom={10}
        style={{
          height: 135,
          width: 240,
          background: "#fff"
        }}
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
        <Circle center={[lat, lon]} radius={2500} pathOptions={{ color: "#e95a16", fillOpacity: 0.18 }} />
      </MapContainer>
    </div>
  );
}
