// components/Map.js

import { MapContainer, TileLayer, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function Map({ lat, lon }) {
  return (
    <div style={{
      width: '100%',
      height: 100,            // чуть ниже — чтобы circle был в центре
      background: '#fff',
      borderRadius: 12,       // 8-12 достаточно
      border: 'none',         // border убери!
      filter: 'grayscale(0.18) brightness(1.06)',
      margin: '0 auto',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: "0 1.5px 6px 0 rgba(36, 138, 253, 0.07)"
    }}>
      <MapContainer
        center={[lat, lon]}
        zoom={11}                        // 12-13 — "идеальное" приближение для города
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: 0,               // убираем radius внутри карты
        }}
        zoomControl={false}
        dragging={false}
        doubleClickZoom={false}
        scrollWheelZoom={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <Circle
          center={[lat, lon]}
          radius={300}
          pathOptions={{
            color: "#f55d2b",
            fillColor: "#f55d2b",
            fillOpacity: 0.35,
            weight: 2,
            opacity: 0.7
          }}
        />
      </MapContainer>
    </div>
  );
}
