// components/Map.js

import { MapContainer, TileLayer, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function Map({ lat, lon }) {
  return (
    <div style={{
      width: '100%',
      height: 150,
      background: '#fff',
      borderRadius: 16,
      border: '4px solid #249afd',
      filter: 'grayscale(0.2) brightness(1.03)',
      margin: '0 auto',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <MapContainer
        center={[lat, lon]}
        zoom={10}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 12,
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
            weight: 0,
            opacity: 0.8
          }}
        />
      </MapContainer>
    </div>
  );
}
