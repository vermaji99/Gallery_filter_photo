export default function LoadingSpinner() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center py-28 text-stone-500"
    >
      <div className="relative w-10 h-10">
        <div className="w-10 h-10 rounded-full border-2 border-stone-200"></div>
        <div className="w-10 h-10 rounded-full border-2 border-stone-800 border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
      <p className="mt-4 text-xs tracking-wider uppercase text-stone-400 font-medium">
        Loading collection...
      </p>
      <span className="sr-only">Loading photos...</span>
    </div>
  );
}
