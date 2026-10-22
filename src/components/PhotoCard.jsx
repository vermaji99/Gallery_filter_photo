import React, { useState } from 'react';

/**
 * PhotoCard Component
 *
 * Displays an individual photo card:
 * - 4:3 aspect ratio container with lazy loading
 * - Resized image using Picsum's dimension format: https://picsum.photos/id/{photo.id}/800/600
 * - Author name caption
 * - Accessible heart-shaped favourite toggle button
 * - Graceful fallback on individual image load failure
 */
const PhotoCard = React.memo(function PhotoCard({
  photo,
  isFavourite,
  onToggleFavourite,
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Requirement 3: Picsum's resized 800x600 image URL format (4:3 aspect ratio)
  const imageUrl = `https://picsum.photos/id/${photo.id}/800/600`;

  return (
    <article className="group bg-white rounded-xl border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col">
      {/* 4:3 Aspect Ratio Container */}
      <div className="relative aspect-[4/3] w-full bg-stone-100 overflow-hidden">
        {/* Placeholder skeleton while image decodes */}
        {!isLoaded && !hasError && (
          <div
            className="absolute inset-0 bg-stone-200/70 animate-pulse flex items-center justify-center text-stone-400"
            aria-hidden="true"
          >
            <svg
              className="w-6 h-6 opacity-30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Resized Photo Image */}
        {!hasError ? (
          <img
            src={imageUrl}
            alt={`Photograph by ${photo.author}`}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          /* Graceful image error fallback */
          <div
            className="w-full h-full flex flex-col items-center justify-center text-stone-400 p-4 text-center bg-stone-100"
            role="img"
            aria-label={`Image by ${photo.author} unavailable`}
          >
            <svg
              className="w-6 h-6 mb-1 text-stone-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span className="text-xs text-stone-400">Image unavailable</span>
          </div>
        )}
      </div>

      {/* Card Caption & Heart Toggle Button */}
      <div className="p-3.5 flex items-center justify-between gap-3 bg-white border-t border-stone-100">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wider text-stone-400 font-medium">
            Photographer
          </p>
          <h3
            className="text-sm font-medium text-stone-900 truncate"
            title={photo.author}
          >
            {photo.author}
          </h3>
        </div>

        {/* Heart-shaped favourite toggle button */}
        <button
          type="button"
          onClick={() => onToggleFavourite(photo.id)}
          aria-label={
            isFavourite
              ? `Remove ${photo.author}'s photo from favourites`
              : `Save ${photo.author}'s photo to favourites`
          }
          aria-pressed={isFavourite}
          className={`p-2 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-1 ${
            isFavourite
              ? 'text-rose-600 bg-rose-50/70 hover:bg-rose-100/70'
              : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
          }`}
          title={isFavourite ? 'Favourited' : 'Add to favourites'}
        >
          <svg
            className="w-5 h-5 transition-transform duration-150 active:scale-125"
            viewBox="0 0 24 24"
            fill={isFavourite ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={isFavourite ? '0' : '1.75'}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
    </article>
  );
});

export default PhotoCard;
