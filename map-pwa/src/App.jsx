import { useRef, Suspense, lazy, useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import locations from './data/locations.json';
import OfflineBanner from './components/OfflineBanner';
import NavigationPanel from './components/NavigationPanel';
import LocationSelector from './components/LocationSelector';

const MapView = lazy(() => import('./components/MapView'));

/* ── Bottom Nav Bar ── */
function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'map',      icon: '🗺️',  label: 'MAP'      },
    { id: 'missions', icon: '📋',  label: 'MISSIONS' },
    { id: 'intel',    icon: '📡',  label: 'INTEL'    },
    { id: 'profile',  icon: '👤',  label: 'PROFILE'  },
  ];

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          id={`nav-${tab.id}`}
          className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
          aria-label={tab.label}
          aria-current={activeTab === tab.id ? 'page' : undefined}
        >
          <span className="nav-icon" aria-hidden="true">{tab.icon}</span>
          <span className="nav-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default function App() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [activeTab, setActiveTab] = useState('map');
  const recenterRef = useRef(null);

  const destinationId = searchParams.get('to');
  const destination = destinationId ? locations[destinationId] : null;
  const origin = locations['main_gate'];

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleRecenter = () => recenterRef.current?.();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'map') return; // stay on map
    // Future: navigate to other sections
  };

  /* ── No destination → Destination Selector ── */
  if (!destinationId) {
    return (
      <>
        <OfflineBanner />
        <LocationSelector />
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      </>
    );
  }

  /* ── Unknown destination ── */
  if (!destination) {
    return (
      <div className="error-screen" role="alert" id="error-screen">
        <span className="error-icon">🎯</span>
        <h2>Target Not Found</h2>
        <p>The location <strong>"{destinationId}"</strong> is not in the AFIT campus directory.</p>
        <div className="hint">
          Scan the QR code again at the kiosk, or select a destination manually.
        </div>
        <button
          id="btn-go-home"
          className="btn-primary"
          onClick={() => navigate('/')}
        >
          ← Choose Destination
        </button>
      </div>
    );
  }

  const isPlaceholder = destination.PLACEHOLDER || origin.PLACEHOLDER;

  /* ── Full Map Navigation View ── */
  return (
    <div className="app-shell" id="map-app">
      <OfflineBanner />



      {/* Map */}
      <div className="map-container" id="map-container">
        {ready && (
          <Suspense
            fallback={
              <div className="loading-screen">
                <div className="loading-spinner" role="status" aria-label="Loading tactical map" />
                <p>Loading tactical map…</p>
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
        title="Recenter"
      >
        ⊕
      </button>

      {/* Navigation Panel */}
      <NavigationPanel
        destination={destination}
        origin={origin}
        isPlaceholder={isPlaceholder}
      />
    </div>
  );
}
