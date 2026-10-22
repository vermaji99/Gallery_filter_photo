import { useState, useEffect, useCallback } from 'react';

const PICSUM_API_URL = 'https://picsum.photos/v2/list?limit=30';

/**
 * Custom Hook: useFetchPhotos
 * Fetches 30 photos from Picsum API on mount.
 *
 * Requirements:
 * - Return: photos, loading, error
 * - Gallery component must use this hook instead of fetching directly
 *
 * @returns {{ photos: Array, loading: boolean, error: string | null, refetch: Function }}
 */
export function useFetchPhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    setReloadKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let isCancelled = false;
    const abortController = new AbortController();

    async function fetchPhotos() {
      try {
        const response = await fetch(PICSUM_API_URL, {
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Failed to load photos from server (Status: ${response.status} ${response.statusText})`
          );
        }

        const data = await response.json();
        if (!isCancelled) {
          setPhotos(data);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (err.name === 'AbortError') return;

        if (!isCancelled) {
          setError(
            err.message || 'Unable to connect to Picsum API. Please check your network.'
          );
          setLoading(false);
        }
      }
    }

    fetchPhotos();

    return () => {
      isCancelled = true;
      abortController.abort();
    };
  }, [reloadKey]);

  return {
    photos,
    loading,
    error,
    refetch,
  };
}
