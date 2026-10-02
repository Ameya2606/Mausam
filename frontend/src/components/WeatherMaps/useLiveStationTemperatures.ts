import { useState, useEffect, useRef } from 'react';
import { fetchLiveStationTemperatures, LiveStationData, LIVE_INDIAN_STATIONS } from './MapProviderService';

export function useLiveStationTemperatures() {
  const [liveData, setLiveData] = useState<Map<string, LiveStationData>>(new Map());
  const [error, setError] = useState<Error | null>(null);
  const inFlightRef = useRef(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let controller = new AbortController();
    let isMounted = true;

    const fetchData = async () => {
      // Don't fetch if tab is hidden
      if (document.hidden || inFlightRef.current) return;
      
      inFlightRef.current = true;
      try {
        const results = await fetchLiveStationTemperatures(LIVE_INDIAN_STATIONS, controller.signal);
        if (isMounted) {
          // Merge with previous data in case of partial failures
          setLiveData(prev => {
            const next = new Map(prev);
            results.forEach((val, key) => next.set(key, val));
            return next;
          });
          setError(null);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.warn('Failed to fetch live station temperatures:', err);
          if (isMounted) {
            setError(err);
          }
        }
      } finally {
        inFlightRef.current = false;
      }
    };

    const scheduleNext = () => {
      // Refresh every 10 minutes (600,000 ms)
      timeoutId = setTimeout(() => {
        fetchData().finally(scheduleNext);
      }, 10 * 60 * 1000);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchData(); // Fetch immediately when tab becomes visible
      }
    };

    // Initial fetch
    fetchData().finally(scheduleNext);

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMounted = false;
      controller.abort();
      clearTimeout(timeoutId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return { liveData, error };
}
