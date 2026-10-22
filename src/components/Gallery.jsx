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
 * 1. Consumes data via the custom hook `useFetchPhotos` ({ photos, loading, error })
 * 2. Manages favourite photo IDs via `useReducer` with safe localStorage persistence
 * 3. Memoizes search filter handler with `useCallback`
 * 4. Derives filtered photo array with `useMemo`
 * 5. Renders a responsive grid (Desktop: 4 cols, Tablet: 2 cols, Mobile: 1 col)
 */
export default function Gallery() {
  // 1. Fetch photos from remote API via custom hook
  const { photos, loading, error } = useFetchPhotos();

  // Search input state
  const [searchTerm, setSearchTerm] = useState('');

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

  // Memoized toggle favourite action dispatcher
  const handleToggleFavourite = useCallback((photoId) => {
    dispatch({
      type: FAVOURITES_ACTIONS.TOGGLE_FAVOURITE,
      payload: photoId,
    });
  }, []);

  // 4. useMemo computes the filtered photo collection based on author name
  // Prevents re-running filter computations when unrelated state (such as favourites) changes
  const filteredPhotos = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      return photos;
    }
    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(query)
    );
  }, [photos, searchTerm]);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* 1. Gallery Header */}
      <header className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900">
          Photo Gallery
        </h1>
        <p className="mt-1.5 text-sm text-stone-500 max-w-md mx-auto">
          A curated collection of thirty photographs from around the world.
        </p>
      </header>

      {/* 2. Search Section */}
      <div className="mb-6">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onClear={handleClearSearch}
        />
      </div>

      {/* 3. Gallery Information (Live photo count) */}
      {!loading && !error && photos.length > 0 && (
        <div className="flex items-center justify-between text-xs text-stone-400 mb-6 px-1 border-b border-stone-200/60 pb-3">
          <p>
            {searchTerm.trim() ? (
              <>
                Showing <span className="font-medium text-stone-700">{filteredPhotos.length}</span> of{' '}
                <span className="font-medium text-stone-700">{photos.length}</span> photographs
              </>
            ) : (
              <>
                Showing all <span className="font-medium text-stone-700">{photos.length}</span> photographs
              </>
            )}
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && <LoadingSpinner />}

      {/* Error State */}
      {!loading && error && <ErrorMessage error={error} />}

      {/* 4. Responsive Photo Grid (Desktop: 4, Tablet: 2, Mobile: 1) */}
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
            /* Restrained Empty State */
            <div className="text-center py-16 px-4 bg-white rounded-xl border border-stone-200/80 max-w-md mx-auto shadow-2xs">
              <p className="text-sm font-medium text-stone-800">
                No photographers found
              </p>
              <p className="mt-1 text-xs text-stone-500">
                No matching photos found for &ldquo;{searchTerm}&rdquo;.
              </p>
              <button
                type="button"
                onClick={handleClearSearch}
                className="mt-4 text-xs font-medium text-stone-700 underline underline-offset-4 hover:text-stone-900 cursor-pointer"
              >
                Clear search query
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
