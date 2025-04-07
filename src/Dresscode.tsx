import { Sparkles, PartyPopper, Sun, Undo2, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import Masonry from "react-masonry-css";
import "./App.css";

const Dresscode = () => {

  const imageModules = import.meta.glob('/src/assets/dresscode/*.{jpg,jpeg,png,webp}', {
    eager: true,
    as: 'url',
  });
  
  const imageUrls = Object.values(imageModules); // Array of all image URLs

  return (
    <div className="min-h-screen bg-white text-neutral-900 px-6 py-12 md:px-12">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <div className="flex items-center justify-center gap-2 text-3xl font-bold tracking-tight">
          <Sparkles className="text-yellow-500" />
          <h1>Dresscode: White Festival Vibes</h1>
        </div>

        <p className="text-lg text-neutral-600">
          Erlaubt ist alles, worin du dich wohlfühlst. Wenn du passende Klamotten hast, zieh dir aber gern' etwas passendes an!
        </p>

        <div className="grid md:grid-cols-2 gap-8 text-left">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Sun className="text-amber-400" /> Was ist erlaubt?
            </h2>
            <ul className="mt-4 list-disc list-inside space-y-2">
              <li>Helle Shirts, Kleider, Hemden</li>
              <li>Beige, Creme & Leinentöne</li>
              <li>Helle Sneaker, Sandalen, Flip Flops</li>
              <li>Festival-Vibes: Glitzer, Sonnenbrille, Hut</li>
              <li>Lässig, leicht, zum Tanzen gemacht</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Undo2 className="text-red-400" /> Was geht nicht?
            </h2>
            <ul className="mt-4 list-disc list-inside space-y-2">
              <li>Dunkle oder knallige Farben</li>
              <li>Steife oder zu schicke Looks</li>
              <li>Business-Outfits</li>
            </ul>
          </div>
        </div>

        <div className="mt-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-neutral-700 hover:text-neutral-900 transition"
          >
            <PartyPopper className="w-4 h-4" />
            Zurück zur Einladung
          </Link>
          <Link
            to="/dresscode/#inspiration"
            className="inline-flex items-center gap-2 text-sm text-amber-700 hover:text-amber-900 transition"
          >
            <Lightbulb className="w-4 h-4" />
            Lass dich inspirieren
          </Link>
        </div>

        <div className="bg-yellow-50 p-6 rounded-xl shadow-inner mt-8">
          <p className="text-lg font-medium">
            Hauptsache: <span className="text-yellow-600">Du fühlst dich wohl</span>, es ist luftig, hell und du bringst gute Laune mit!
          </p>
        </div>

        {/* 🖼 Masonry Image Grid */}
        <div className="mt-12" id="inspiration">
          <h2 className="text-xl font-semibold mb-4">Inspiration</h2>
          <Masonry
            breakpointCols={{ default: 4, 768: 3, 540: 2 }}
            className="flex gap-4"
            columnClassName="masonry-column"
          >
            {imageUrls.map((src, idx) => (
              <img key={idx} src={src} alt={`Inspiration ${idx + 1}`} className="rounded-lg shadow-md mb-4 w-full" />
            ))}
          </Masonry>
        </div>

        <div className="mt-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-neutral-700 hover:text-neutral-900 transition"
          >
            <PartyPopper className="w-4 h-4" />
            Zurück zur Einladung
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dresscode;
