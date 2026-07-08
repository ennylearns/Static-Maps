import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import locations from '../data/locations.json';

const destinations = Object.values(locations).filter((l) => l.id !== 'main_gate');

export default function LocationSelector() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const filtered = destinations.filter((loc) => {
    const q = query.toLowerCase();
    return (
      !q ||
      loc.name.toLowerCase().includes(q) ||
      (loc.keywords || []).some((k) => k.includes(q))
    );
  });

  return (
    <div className="location-selector" id="location-selector-page">

      {/* Header */}
      <div className="selector-header">
        <div className="brand">
          <span className="brand-icon" aria-hidden="true">✈️</span>
          <div>
            <div className="brand-name">AFIT MAPS</div>
            <div className="brand-sub">Air Force Institute of Technology, Kaduna</div>
          </div>
        </div>



        {/* Search Bar */}
        <div className="search-bar" id="destination-search">
          <span className="search-icon" aria-hidden="true">🔍</span>
          <input
            id="search-input"
            type="text"
            placeholder="Query destination..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search campus destinations"
            autoComplete="off"
          />
        </div>
      </div>

      {/* Destination Grid */}
      <div
        className="locations-grid"
        id="destinations-grid"
        role="list"
        aria-label="Campus destinations"
      >
        {filtered.length > 0 ? (
          filtered.map((loc) => (
            <button
              key={loc.id}
              id={`dest-btn-${loc.id}`}
              className="location-card"
              onClick={() => navigate(`/?to=${loc.id}`)}
              role="listitem"
              aria-label={`Navigate to ${loc.name}`}
            >
              <span className="loc-icon" aria-hidden="true">{loc.icon || '📍'}</span>
              <span className="loc-name">{loc.name}</span>
            </button>
          ))
        ) : (
          <div className="no-results" role="status">
            <span style={{ fontSize: '2rem' }}>🔭</span>
            <p>No destinations match "{query}"</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="selector-footer" role="contentinfo">
        Powered by AFIT ICT Unit
      </div>
    </div>
  );
}
