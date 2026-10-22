import React from 'react';

/**
 * SearchBar Component
 *
 * Memoized with React.memo so it only re-renders when searchTerm or handlers change.
 * Pair with `useCallback` on `onSearchChange` to prevent unnecessary re-renders when
 * favourites state updates in the parent component.
 */
const SearchBar = React.memo(function SearchBar({
  searchTerm,
  onSearchChange,
  onClear,
}) {
  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="relative flex items-center">
        {/* Minimal Search Icon */}
        <div
          className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400"
          aria-hidden="true"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
            />
          </svg>
        </div>

        {/* Search Input */}
        <input
          id="photographer-search"
          type="text"
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search photographers..."
          autoComplete="off"
          spellCheck="false"
          className="w-full pl-10 pr-9 py-2.5 text-sm bg-white border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-colors shadow-2xs"
          aria-label="Search photographers by name"
        />

        {/* Accessible Clear Search Button */}
        {searchTerm && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search query"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
});

export default SearchBar;
