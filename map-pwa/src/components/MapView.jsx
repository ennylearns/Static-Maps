import { useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { createCustomIcon } from '../utils/mapUtils';
import RoutingControl from './RoutingControl';

// ── Expose recenter function via ref ──────────────────────────────────
function RecenterControl({ coords, controlRef }) {
  const map = useMap();
  useEffect(() => {
    if (controlRef) {
      controlRef.current = () => {
        if (coords && coords.length === 2) {
          map.fitBounds(coords, { padding: [80, 80], maxZoom: 18, animate: true });
        }
      };
    }
  }, [coords, map, controlRef]);
  return null;
}

/**
 * MapView — Central map component rendering tiles, markers, and the
 * animated dashed polyline route between origin and destination.
 */
export default function MapView({ origin, destination, recenterRef }) {
  const routeCoords = [origin.coords, destination.coords];

  // Build custom icons
  const destIcon = createCustomIcon(destination.icon || '📍', 'destination', destination.name);
  const originIcon = createCustomIcon('🚪', 'origin', origin.name);

  // Midpoint for initial center (before fitBounds kicks in)
  const center = [
    (origin.coords[0] + destination.coords[0]) / 2,
    (origin.coords[1] + destination.coords[1]) / 2,
  ];

  return (
    <MapContainer
      center={center}
      zoom={16}
      zoomControl={false}
      attributionControl={false}
      id="campus-map"
      style={{ height: '100%', width: '100%' }}
    >
      {/* OpenStreetMap tiles */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        maxZoom={19}
        keepBuffer={4}
      />

      {/* Routing Control for Actual Roads */}
      <RoutingControl origin={origin.coords} destination={destination.coords} />

      {/* Origin Marker — Main Gate */}
      <Marker position={origin.coords} icon={originIcon} alt={origin.name}>
      </Marker>

      {/* Destination Marker */}
      <Marker position={destination.coords} icon={destIcon} alt={destination.name}>
      </Marker>

      {/* Expose recenter via ref */}
      <RecenterControl coords={routeCoords} controlRef={recenterRef} />
    </MapContainer>
  );
}
