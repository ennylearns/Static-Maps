import { useOnlineStatus } from '../hooks/useOnlineStatus';

export default function OfflineBanner() {
  const { isOnline, wasOffline } = useOnlineStatus();

  if (isOnline && !wasOffline) return null;

  return (
    <div
      id="offline-banner"
      className={`offline-banner ${isOnline ? 'online' : ''}`}
      role="status"
      aria-live="polite"
    >
      {isOnline ? (
        <>
          <span>✅</span>
          <span>Back online — map is live!</span>
        </>
      ) : (
        <>
          <span>⚡</span>
          <span>You're offline — cached map tiles will be used</span>
        </>
      )}
    </div>
  );
}
