import { useNavigate } from 'react-router-dom';
import locations from '../data/locations.json';

/**
 * LocationSelector — Shown when no ?to= param is present.
 * Lets the visitor pick a destination manually from a grid.
 */
export default function LocationSelector() {
  const navigate = useNavigate();

  // Exclude main_gate from selection options
  const destinations = Object.values(locations).filter(
    (loc) => loc.id !== 'main_gate'
  );

  const handleSelect = (id) => {
    navigate(`/?to=${id}`);
  };

  return (
    <div className="location-selector" id="location-selector-page">
      <div className="selector-header">
        <div className="brand">
          <span className="brand-icon">🗺️</span>
          <span className="brand-name">Campus<span>Guide</span></span>
        </div>
        <h1>Where do you want<br />to go?</h1>
        <p>Select a destination to get directions from the Main Gate</p>
      </div>

      <div
        className="locations-grid"
        id="destinations-grid"
        role="list"
        aria-label="Campus destinations"
      >
        {destinations.map((loc) => (
          <button
            key={loc.id}
            id={`dest-btn-${loc.id}`}
            className="location-card"
            onClick={() => handleSelect(loc.id)}
            role="listitem"
            aria-label={`Navigate to ${loc.name}`}
          >
            <span className="loc-icon" aria-hidden="true">{loc.icon || '📍'}</span>
            <span className="loc-name">{loc.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
