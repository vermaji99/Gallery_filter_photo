export default function ErrorMessage({ error, onRetry }) {
  return (
    <div
      role="alert"
      className="max-w-md mx-auto my-16 p-6 bg-red-50/80 border border-red-200 rounded-2xl text-center shadow-sm"
    >
      <div className="w-12 h-12 mx-auto mb-3 text-red-600 flex items-center justify-center rounded-full bg-red-100">
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h3 className="text-lg font-semibold text-red-900 mb-1">
        Failed to Load Photos
      </h3>
      <p className="text-sm text-red-700 mb-5 leading-relaxed">
        {error || 'An error occurred while fetching the photo list.'}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors cursor-pointer"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
