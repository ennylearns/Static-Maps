import { divIcon } from 'leaflet';

/**
 * Creates a custom Leaflet DivIcon for destination markers.
 * @param {string} emoji - Icon emoji for the marker
 * @param {'destination' | 'origin'} type - Marker style type
 * @param {string} label - Text label below the pin
 */
export function createCustomIcon(emoji, type = 'destination', label = '') {
  const html = `
    <div class="custom-marker">
      <div class="marker-pin ${type}">
        <span class="marker-icon">${emoji}</span>
      </div>
      ${label ? `<span class="marker-label">${label}</span>` : ''}
    </div>
  `;

  return divIcon({
    html,
    className: '',
    iconAnchor: [18, 44],
    popupAnchor: [0, -48],
  });
}

/**
 * Calculates approximate straight-line distance between two [lat, lng] points.
 * Returns distance in metres and an estimated walking time.
 */
export function calcDistance(coordA, coordB) {
  const R = 6371000; // Earth radius in metres
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(coordB[0] - coordA[0]);
  const dLng = toRad(coordB[1] - coordA[1]);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(coordA[0])) *
      Math.cos(toRad(coordB[0])) *
      Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distMetres = R * c;

  // Average walking speed 4.5 km/h → 75 m/min
  const walkMinutes = Math.ceil(distMetres / 75);

  return {
    metres: Math.round(distMetres),
    display: distMetres >= 1000
      ? `${(distMetres / 1000).toFixed(1)} km`
      : `${Math.round(distMetres)} m`,
    walkMinutes,
    walkDisplay: walkMinutes < 1 ? '< 1 min' : `${walkMinutes} min`,
  };
}
