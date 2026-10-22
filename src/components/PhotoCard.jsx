import React, { useState } from 'react';

/**
 * PhotoCard Component
 *
 * Displays:
 * 1. Photo (optimized thumbnail from Picsum with lazy loading)
 * 2. Author name
 * 3. Heart icon button (toggles favourite status)
 */
const PhotoCard = React.memo(function PhotoCard({
  photo,
  isFavourite,
  onToggleFavourite,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Use Picsum 600x400 endpoint for fast, consistent aspect-ratio thumbnail loading
  const imageUrl = `https://picsum.photos/id/${photo.id}/600/400`;

  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col">
      {/* Photo Container */}
      <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
        {/* Skeleton placeholder while image loads */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center text-slate-400">
            <svg
              className="w-8 h-8 opacity-40"
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

        {/* Actual Image */}
        {!imageError ? (
          <img
            src={imageUrl}
            alt={`Photo by ${photo.author}`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100 p-4 text-center">
            <svg
              className="w-8 h-8 mb-1 text-slate-300"
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
            <span className="text-xs">Image unavailable</span>
          </div>
        )}

        {/* Quick favourite button floating overlay on top right */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <button
            type="button"
            onClick={() => onToggleFavourite(photo.id)}
            aria-label={
              isFavourite
                ? `Remove ${photo.author}'s photo from favourites`
                : `Add ${photo.author}'s photo to favourites`
            }
            className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer shadow-sm ${
              isFavourite
                ? 'bg-white/90 text-rose-500 scale-105'
                : 'bg-black/30 text-white hover:bg-white/90 hover:text-rose-500 hover:scale-105'
            }`}
          >
            <svg
              className="w-5 h-5 transition-transform active:scale-125"
              viewBox="0 0 24 24"
              fill={isFavourite ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={isFavourite ? '0' : '2'}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Card Footer: Author Name & Favourite Status */}
      <div className="p-4 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
            Photographer
          </p>
          <h4
            className="text-sm font-semibold text-slate-800 truncate"
            title={photo.author}
          >
            {photo.author}
          </h4>
        </div>

        {/* Bottom heart icon button (always visible and easy to tap) */}
        <button
          type="button"
          onClick={() => onToggleFavourite(photo.id)}
          aria-label={
            isFavourite
              ? `Remove ${photo.author}'s photo from favourites`
              : `Add ${photo.author}'s photo to favourites`
          }
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            isFavourite
              ? 'text-rose-500 hover:bg-rose-50'
              : 'text-slate-400 hover:text-rose-500 hover:bg-slate-50'
          }`}
          title={isFavourite ? 'Favourited' : 'Add to favourites'}
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill={isFavourite ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={isFavourite ? '0' : '2'}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
    </article>
  );
});

export default PhotoCard;
