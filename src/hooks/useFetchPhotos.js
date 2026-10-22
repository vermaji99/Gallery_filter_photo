import { useState, useEffect } from 'react';

const PICSUM_API_URL = 'https://picsum.photos/v2/list?limit=30';

/**
 * Custom Hook: useFetchPhotos
 *
 * Fetches 30 photos from the Picsum Photos API on component mount.
 *
 * Returns exactly:
 * - photos: Array of fetched photo objects
 * - loading: boolean indicating whether fetch is active
 * - error: string describing failure reason, or null if successful
 */
export function useFetchPhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // AbortController cancels network fetch if component unmounts
    const controller = new AbortController();

    async function fetchPhotos() {
      try {
        const response = await fetch(PICSUM_API_URL, {
          signal: controller.signal,
        });

        // Verify HTTP status code
        if (!response.ok) {
          throw new Error(
            `Server error: HTTP ${response.status} (${response.statusText || 'Failed to fetch'})`
          );
        }

        const data = await response.json();

        // Validate response format
        if (!Array.isArray(data)) {
          throw new Error('Received malformed data: expected an array of photos.');
        }

        setPhotos(data);
        setError(null);
      } catch (err) {
        // Do not update state if unmounted / aborted
        if (err.name === 'AbortError') return;

        setError(
          err.message || 'Unable to connect to the photo service. Please check your network connection.'
        );
      } finally {
        // Always ensure loading finishes if not aborted
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchPhotos();

    return () => {
      controller.abort();
    };
  }, []); // Empty dependency array ensures request runs only once on mount

  return { photos, loading, error };
}
