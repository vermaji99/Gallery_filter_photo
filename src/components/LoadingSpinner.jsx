export default function LoadingSpinner() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center py-24 text-slate-500"
    >
      <div className="relative w-14 h-14">
        {/* Outer subtle ring */}
        <div className="w-14 h-14 rounded-full border-4 border-indigo-100"></div>
        {/* Spinning indicator */}
        <div className="w-14 h-14 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
      <p className="mt-4 text-base font-medium text-slate-600 tracking-wide">
        Fetching photos from Picsum...
      </p>
      <span className="sr-only">Loading photos...</span>
    </div>
  );
}
