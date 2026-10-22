export default function ErrorMessage({ error, onRetry }) {
  return (
    <div
      role="alert"
      className="max-w-md mx-auto my-16 p-6 bg-white border border-stone-200 rounded-xl text-center shadow-xs"
    >
      <div className="w-10 h-10 mx-auto mb-3 text-stone-400 bg-stone-100 flex items-center justify-center rounded-full">
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      </div>

      <h3 className="text-sm font-semibold text-stone-900 mb-1">
        Unable to Load Collection
      </h3>
      <p className="text-xs text-stone-500 leading-relaxed mb-4">
        {error || 'An error occurred while communicating with the photo service.'}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-4 py-2 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
