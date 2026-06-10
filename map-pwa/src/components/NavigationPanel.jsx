import { useState } from 'react';
import { calcDistance } from '../utils/mapUtils';

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
        aria-label={expanded ? 'Collapse panel' : 'Expand panel for details'}
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
            <span className="stat-value" id="stat-distance">{distance.display}</span>
            <span className="stat-label">Distance</span>
          </div>
          <div className="stat-card" role="listitem">
            <span className="stat-value" id="stat-time">{distance.walkDisplay}</span>
            <span className="stat-label">ETA</span>
          </div>
          <div className="stat-card" role="listitem">
            <span className="stat-value">🚶</span>
            <span className="stat-label">Mode</span>
          </div>
        </div>

        {/* Description (expanded only) */}
        {expanded && destination.description && (
          <div className="dest-description">
            <p>{destination.description}</p>
          </div>
        )}

        {/* Route Summary */}
        {expanded && (
          <>
            <div className="panel-divider" />
            <div className="route-info" role="list" aria-label="Route steps">
              <div className="route-step" role="listitem">
                <div className="step-dot start" />
                <p className="step-text"><strong>{origin.name}</strong> — Starting point</p>
              </div>
              <div className="route-step"><div className="step-line" /></div>
              <div className="route-step" role="listitem">
                <div className="step-dot mid" />
                <p className="step-text">Follow the dashed blue route on the map</p>
              </div>
              <div className="route-step"><div className="step-line" /></div>
              <div className="route-step" role="listitem">
                <div className="step-dot end" />
                <p className="step-text">
                  <strong>{destination.name}</strong> — {distance.display} · {distance.walkDisplay}
                </p>
              </div>
            </div>
            <div className="panel-divider" />
          </>
        )}

        {/* Start Route CTA */}
        <button
          id="btn-start-route"
          className="btn-start-route"
          aria-label={`Start navigation to ${destination.name}`}
        >
          <span aria-hidden="true">⚡</span>
          Start Guided Tactical Route
        </button>

        {/* Placeholder Notice */}
        {isPlaceholder && (
          <div className="placeholder-notice" role="note">
            <span className="notice-icon" aria-hidden="true">⚠️</span>
            <p>
              Demo coordinates — replace with real campus data in <code>locations.json</code>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
