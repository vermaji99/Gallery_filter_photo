import Gallery from './components/Gallery';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Gallery />
      <footer className="py-6 text-center text-xs text-slate-400 border-t border-slate-200 mt-12">
        <p>Celebrare Frontend React Internship Pre-Screening Assignment</p>
      </footer>
    </div>
  );
}
