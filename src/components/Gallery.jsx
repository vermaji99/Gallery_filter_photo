import { useState, useReducer, useEffect, useCallback, useMemo } from 'react';
import { useFetchPhotos } from '../hooks/useFetchPhotos';
import {
  favouritesReducer,
  initFavourites,
  FAVOURITES_ACTIONS,
  FAVOURITES_STORAGE_KEY,
} from '../reducers/favouritesReducer';
import SearchBar from './SearchBar';
import PhotoCard from './PhotoCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

/**
 * Gallery Component
 *
 * Core component adhering strictly to the assignment specifications:
 * 1. Uses custom hook `useFetchPhotos` (returns: photos, loading, error)
 * 2. Manages favourites using `useReducer` with localStorage persistence
 * 3. Uses `useCallback` for search filter handler
 * 4. Uses `useMemo` to compute filtered photos list in real-time
 * 5. Responsive grid: Desktop 4 cols, Tablet 2 cols, Mobile 1 col
 */
export default function Gallery() {
  // Requirement 6: Use useFetchPhotos custom hook
  const { photos, loading, error, refetch } = useFetchPhotos();

  // Search filter query state
  const [searchTerm, setSearchTerm] = useState('');

  // Requirement 5: Manage favourites list using useReducer (not useState)
  const [favourites, dispatch] = useReducer(
    favouritesReducer,
    [],
    initFavourites
  );

  // Requirement 5: Persist favourites to localStorage across page refreshes
  useEffect(() => {
    try {
      localStorage.setItem(
        FAVOURITES_STORAGE_KEY,
        JSON.stringify(favourites)
      );
    } catch (err) {
      console.error('Failed to persist favourites to localStorage:', err);
    }
  }, [favourites]);

  // Requirement 7: useCallback on search filter handler
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  // Handler to clear search input
  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  // Memoized toggle handler for dispatching favourite action
  const handleToggleFavourite = useCallback((photoId) => {
    dispatch({
      type: FAVOURITES_ACTIONS.TOGGLE_FAVOURITE,
      payload: photoId,
    });
  }, []);

  // Requirement 7: useMemo to compute the filtered photo list
  // Only re-runs when either `photos` or `searchTerm` changes.
  // Toggling favourites will NOT re-filter the array.
  const filteredPhotos = useMemo(() => {
    const trimmed = searchTerm.trim().toLowerCase();
    if (!trimmed) {
      return photos;
    }
    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(trimmed)
    );
  }, [photos, searchTerm]);

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header Section */}
      <header className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full uppercase tracking-wider mb-3">
          Celebrare Frontend Assignment
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Photo Gallery
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
          Explore curated photos from Picsum, search by author, and save your favourites.
        </p>

        {/* Favourites count summary badge */}
        {!loading && !error && (
          <div className="mt-4 flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-500">
            <span>Total: <strong className="text-slate-800">{photos.length}</strong> photos</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-rose-500 fill-rose-500" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <strong className="text-slate-800">{favourites.length}</strong> favourites saved
            </span>
          </div>
        )}
      </header>

      {/* Requirement 4: Search input at top */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onClear={handleClearSearch}
      />

      {/* Requirement 2: Loading State */}
      {loading && <LoadingSpinner />}

      {/* Requirement 2: Error State */}
      {!loading && error && <ErrorMessage error={error} onRetry={refetch} />}

      {/* Requirement 3: Responsive Grid (Desktop 4, Tablet 2, Mobile 1) */}
      {!loading && !error && (
        <>
          {filteredPhotos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredPhotos.map((photo) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  isFavourite={favourites.includes(photo.id)}
                  onToggleFavourite={handleToggleFavourite}
                />
              ))}
            </div>
          ) : (
            /* Search empty state */
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 p-8 max-w-lg mx-auto">
              <div className="w-12 h-12 mx-auto mb-3 text-slate-400 bg-slate-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-slate-800">
                No matching photos found
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                No photos found matching &ldquo;{searchTerm}&rdquo;. Try another author name.
              </p>
              <button
                type="button"
                onClick={handleClearSearch}
                className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
              >
                Clear Search
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
