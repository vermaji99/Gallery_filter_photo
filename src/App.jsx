import Gallery from './components/Gallery';

export default function App() {
  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-800 flex flex-col justify-between selection:bg-stone-200">
      <main className="flex-1">
        <Gallery />
      </main>
      <footer className="py-8 text-center text-xs text-stone-400 border-t border-stone-200/60 mt-16">
        <p>Curated photography collection</p>
      </footer>
    </div>
  );
}
