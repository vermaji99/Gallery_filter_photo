import { useState, useReducer, useEffect, useCallback, useMemo } from 'react';
import { useFetchPhotos } from '../hooks/useFetchPhotos';
import {
  favouritesReducer,
  initialFavouritesState,
  loadStoredFavourites,
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
 * Core architectural coordinator adhering strictly to the assignment specifications:
 * 1. Consumes data via custom hook `useFetchPhotos` ({ photos, loading, error, refetch })
 * 2. Manages favourite photo IDs via `useReducer` with safe localStorage persistence
 * 3. Memoizes search filter handler with `useCallback`
 * 4. Derives filtered photo array with `useMemo`
 * 5. Responsive grid (Desktop: 4 cols, Tablet: 2 cols, Mobile: 1 col)
 * 6. Includes a clean view filter (All Photos vs Favourites) and live count
 */
export default function Gallery() {
  // 1. Remote data fetching via custom hook
  const { photos, loading, error, refetch } = useFetchPhotos();

  // Search input state
  const [searchTerm, setSearchTerm] = useState('');

  // Active view tab: 'all' | 'favourites'
  const [activeTab, setActiveTab] = useState('all');

  // 2. Manage favourite photo IDs using useReducer with lazy initialization
  const [favourites, dispatch] = useReducer(
    favouritesReducer,
    initialFavouritesState,
    loadStoredFavourites
  );

  // Synchronize favourites to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(
        FAVOURITES_STORAGE_KEY,
        JSON.stringify(favourites)
      );
    } catch (err) {
      console.warn('Failed to synchronize favourites to localStorage:', err);
    }
  }, [favourites]);

  // 3. useCallback memoizes search input change handler
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  // Memoized search clear handler
  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  // Memoized tab change handler
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  // Memoized toggle favourite action dispatcher
  const handleToggleFavourite = useCallback((photoId) => {
    dispatch({
      type: FAVOURITES_ACTIONS.TOGGLE_FAVOURITE,
      payload: photoId,
    });
  }, []);

  // 4. useMemo computes the filtered photo collection based on view tab & author name
  // Prevents unnecessary calculations and keeps UI smooth and performant
  const filteredPhotos = useMemo(() => {
    let list = photos;

    // Filter by tab if in favourites view
    if (activeTab === 'favourites') {
      list = photos.filter((photo) => favourites.includes(String(photo.id)));
    }

    // Real-time search filter by photographer author name
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return list;
    }

    return list.filter((photo) =>
      photo.author.toLowerCase().includes(query)
    );
  }, [photos, searchTerm, favourites, activeTab]);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Gallery Header */}
      <header className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900">
          Photo Gallery
        </h1>
        <p className="mt-1.5 text-sm text-stone-500 max-w-md mx-auto">
          A curated collection of thirty photographs from around the world.
        </p>
      </header>

      {/* Control Strip / Dashboard Toolbar */}
      <div className="mb-8 space-y-4">
        {/* Search Input */}
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onClear={handleClearSearch}
        />

        {/* View Tabs & Actions Bar */}
        {!loading && !error && photos.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-b border-stone-200/60 pb-3">
            {/* Filter Tabs: All vs Favourites */}
            <div className="inline-flex items-center p-1 bg-stone-100 rounded-lg text-xs font-medium text-stone-600">
              <button
                type="button"
                onClick={() => handleTabChange('all')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                All Photos ({photos.length})
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('favourites')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  activeTab === 'favourites'
                    ? 'bg-white text-rose-600 shadow-2xs font-semibold'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <svg
                  className={`w-3.5 h-3.5 ${
                    activeTab === 'favourites' || favourites.length > 0
                      ? 'fill-rose-500 text-rose-500'
                      : 'stroke-current'
                  }`}
                  viewBox="0 0 24 24"
                  fill={activeTab === 'favourites' || favourites.length > 0 ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                Favourites ({favourites.length})
              </button>
            </div>

            {/* Live Count & Reload Control */}
            <div className="flex items-center gap-4 text-xs text-stone-500">
              <p>
                {searchTerm.trim() ? (
                  <>
                    Showing <span className="font-semibold text-stone-800">{filteredPhotos.length}</span> of{' '}
                    <span className="font-semibold text-stone-800">
                      {activeTab === 'favourites' ? favourites.length : photos.length}
                    </span>{' '}
                    photographs
                  </>
                ) : (
                  <>
                    Showing <span className="font-semibold text-stone-800">{filteredPhotos.length}</span>{' '}
                    {activeTab === 'favourites' ? 'favourited' : ''} photographs
                  </>
                )}
              </p>

              {/* Refresh / Reload Button */}
              <button
                type="button"
                onClick={refetch}
                title="Reload collection from API"
                aria-label="Reload collection from API"
                className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-md transition-colors cursor-pointer"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && <LoadingSpinner />}

      {/* Error State */}
      {!loading && error && <ErrorMessage error={error} onRetry={refetch} />}

      {/* Responsive Photo Grid (Desktop: 4, Tablet: 2, Mobile: 1) */}
      {!loading && !error && (
        <>
          {filteredPhotos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredPhotos.map((photo) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  isFavourite={favourites.includes(String(photo.id))}
                  onToggleFavourite={handleToggleFavourite}
                />
              ))}
            </div>
          ) : (
            /* Context-Aware Empty State */
            <div className="text-center py-16 px-4 bg-white rounded-xl border border-stone-200/80 max-w-md mx-auto shadow-2xs">
              <div className="w-10 h-10 mx-auto mb-3 text-stone-400 bg-stone-100 rounded-full flex items-center justify-center">
                {activeTab === 'favourites' && !searchTerm ? (
                  <svg className="w-5 h-5 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                  </svg>
                )}
              </div>

              {activeTab === 'favourites' && !searchTerm ? (
                <>
                  <p className="text-sm font-medium text-stone-800">
                    No favourite photos yet
                  </p>
                  <p className="mt-1 text-xs text-stone-500">
                    Click the heart icon on any photograph to save it here.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleTabChange('all')}
                    className="mt-4 px-3.5 py-1.5 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Explore all photos
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-stone-800">
                    No photographers found
                  </p>
                  <p className="mt-1 text-xs text-stone-500">
                    No matching photos found for &ldquo;{searchTerm}&rdquo;
                    {activeTab === 'favourites' ? ' in your favourites' : ''}.
                  </p>
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="mt-4 text-xs font-medium text-stone-700 underline underline-offset-4 hover:text-stone-900 cursor-pointer"
                  >
                    Clear search query
                  </button>
                </>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}
