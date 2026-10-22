import React from 'react';

/**
 * SearchBar Component
 *
 * Wrapped in React.memo so it only re-renders when searchTerm or onSearchChange changes.
 * Because onSearchChange is memoized with useCallback in the parent,
 * toggling favourites in the gallery will NOT trigger unnecessary re-renders of this component.
 */
const SearchBar = React.memo(function SearchBar({
  searchTerm,
  onSearchChange,
  onClear,
}) {
  return (
    <div className="w-full max-w-xl mx-auto mb-8">
      <div className="relative flex items-center">
        {/* Search magnifying glass icon */}
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Search input */}
        <input
          type="text"
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search photos by author name..."
          className="w-full pl-11 pr-10 py-3 text-sm sm:text-base bg-white border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-800"
          aria-label="Search photos by author name"
        />

        {/* Clear search button */}
        {searchTerm && (
          <button
            type="button"
            onClick={onClear}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
});

export default SearchBar;
