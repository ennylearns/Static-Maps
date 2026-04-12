import { useState } from 'react';
import { calcDistance } from '../utils/mapUtils';

/**
 * NavigationPanel — Slide-up bottom panel showing destination info,
 * walk distance, and a simple route summary.
 */
export default function NavigationPanel({ destination, origin, isPlaceholder }) {
  const [expanded, setExpanded] = useState(false);

  if (!destination || !origin) return null;

  const distance = calcDistance(origin.coords, destination.coords);

  return (
    <div
      id="nav-panel"
      className={`nav-panel ${expanded ? 'expanded' : ''}`}
      role="complementary"
      aria-label="Navigation information"
    >
      {/* Drag Handle */}
      <div
        className="panel-handle-area"
        onClick={() => setExpanded((e) => !e)}
        role="button"
        aria-expanded={expanded}
        aria-label={expanded ? 'Collapse panel' : 'Expand panel'}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setExpanded((v) => !v)}
      >
        <div className="panel-handle" />
      </div>

      <div className="panel-content">
        {/* Destination Header */}
        <div className="dest-header">
          <div className="dest-icon-wrap" aria-hidden="true">
            {destination.icon || '📍'}
          </div>
          <div className="dest-info">
            <h2 id="destination-name">{destination.name}</h2>
            <p className="dest-from">From {origin.name}</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="stats-row" role="list" aria-label="Route statistics">
          <div className="stat-card" role="listitem">
            <span className="stat-value" id="walk-distance">{distance.display}</span>
            <span className="stat-label">Distance</span>
          </div>
          <div className="stat-card" role="listitem">
            <span className="stat-value" id="walk-time">{distance.walkDisplay}</span>
            <span className="stat-label">Walk Time</span>
          </div>
          <div className="stat-card" role="listitem">
            <span className="stat-value">🚶</span>
            <span className="stat-label">On Foot</span>
          </div>
        </div>

        {/* Description */}
        {destination.description && (
          <div className="dest-description">
            <p>{destination.description}</p>
          </div>
        )}

        <div className="panel-divider" />

        {/* Route Steps */}
        <div className="route-info" role="list" aria-label="Route steps">
          <div className="route-step" role="listitem">
            <div className="step-dot start" />
            <p className="step-text"><strong>{origin.name}</strong> — Starting point</p>
          </div>
          <div className="route-step" role="listitem">
            <div className="step-line" />
          </div>
          <div className="route-step" role="listitem">
            <div className="step-dot mid" />
            <p className="step-text">Follow the dashed blue path on the map</p>
          </div>
          <div className="route-step" role="listitem">
            <div className="step-line" />
          </div>
          <div className="route-step" role="listitem">
            <div className="step-dot end" />
            <p className="step-text">
              <strong>{destination.name}</strong> — Your destination ({distance.display} · {distance.walkDisplay})
            </p>
          </div>
        </div>

        {/* Placeholder Notice */}
        {isPlaceholder && (
          <div className="placeholder-notice" role="note">
            <span className="notice-icon">⚠️</span>
            <p>
              <strong>Demo Mode:</strong> Map coordinates are placeholders. Real campus locations will appear once the campus survey data is loaded into <code>locations.json</code>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
