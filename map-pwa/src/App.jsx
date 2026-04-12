import { useRef, Suspense, lazy, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import locations from './data/locations.json';
import OfflineBanner from './components/OfflineBanner';
import NavigationPanel from './components/NavigationPanel';
import LocationSelector from './components/LocationSelector';

// Lazy-load the heavy Leaflet map to speed up initial render
const MapView = lazy(() => import('./components/MapView'));

export default function App() {
  const [searchParams] = useSearchParams();
  const [ready, setReady] = useState(false);
  const recenterRef = useRef(null);

  const destinationId = searchParams.get('to');
  const destination = destinationId ? locations[destinationId] : null;
  const origin = locations['main_gate'];

  // Small delay so CSS animations play on first frame
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleRecenter = () => {
    if (recenterRef.current) recenterRef.current();
  };

  // ── No destination selected → show picker ──
  if (!destinationId) {
    return (
      <>
        <OfflineBanner />
        <LocationSelector />
      </>
    );
  }

  // ── Unknown destination ID ──
  if (!destination) {
    return (
      <div className="error-screen" role="alert" id="error-screen">
        <span className="error-icon">🗺️</span>
        <h2>Destination Not Found</h2>
        <p>
          The location <strong>"{destinationId}"</strong> doesn't exist in the campus directory.
        </p>
        <div className="hint">
          Try scanning the QR code again at the kiosk, or select a destination manually.
        </div>
        <button
          id="btn-go-home"
          className="btn-primary"
          onClick={() => window.location.replace('/')}
        >
          🏠 Choose Destination
        </button>
      </div>
    );
  }

  const isPlaceholder = destination.PLACEHOLDER || origin.PLACEHOLDER;

  // ── Full Map View ──
  return (
    <div className="app-shell" id="map-app">
      <OfflineBanner />

      {/* Top Header */}
      <header className="map-header" role="banner" aria-label="App header">
        <div className="map-branding">
          <span className="brand-icon" aria-hidden="true">🗺️</span>
          <span className="brand-name">Campus<span>Guide</span></span>
        </div>
        <div
          className="map-badge"
          aria-label="Navigation active"
          role="status"
        >
          <span className="dot" aria-hidden="true" />
          Navigating
        </div>
      </header>

      {/* Map + Route */}
      <div className="map-container" id="map-container">
        {ready && (
          <Suspense
            fallback={
              <div className="loading-screen">
                <div className="loading-spinner" role="status" aria-label="Loading map" />
                <p>Loading map…</p>
              </div>
            }
          >
            <MapView
              origin={origin}
              destination={destination}
              recenterRef={recenterRef}
            />
          </Suspense>
        )}
      </div>

      {/* Recenter FAB */}
      <button
        id="btn-recenter"
        className="map-fab"
        onClick={handleRecenter}
        aria-label="Recenter map to show full route"
        title="Recenter map"
      >
        ⊕
      </button>

      {/* Bottom Navigation Panel */}
      <NavigationPanel
        destination={destination}
        origin={origin}
        isPlaceholder={isPlaceholder}
      />
    </div>
  );
}
