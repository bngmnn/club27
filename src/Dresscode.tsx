import React from "react";
import { Sparkles, PartyPopper, Sun, Undo2 } from "lucide-react";
import { Link } from "react-router-dom";

const Dresscode = () => {
  return (
    <div className="min-h-screen bg-white text-neutral-900 px-6 py-12 md:px-12">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <div className="flex items-center justify-center gap-2 text-3xl font-bold tracking-tight">
          <Sparkles className="text-yellow-500" />
          <h1>Dresscode: White Festival Vibes</h1>
        </div>

        <p className="text-lg text-neutral-600">
          Stell dir ein Festival im Garten vor: weiß, luftig, verspielt – und du mittendrin.
        </p>

        <div className="grid md:grid-cols-2 gap-8 text-left">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Sun className="text-orange-400" /> Was passt gut?
            </h2>
            <ul className="mt-4 list-disc list-inside space-y-2">
              <li>Weiße Shirts, Kleider, Hemden</li>
              <li>Beige, Creme & Leinentöne</li>
              <li>Weiße Sneaker, Sandalen</li>
              <li>Festival-Vibes: Glitzer, Sonnenbrille, Hut</li>
              <li>Lässig, leicht, zum Tanzen gemacht</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Undo2 className="text-red-400" /> Lieber nicht
            </h2>
            <ul className="mt-4 list-disc list-inside space-y-2">
              <li>Dunkle oder knallige Farben</li>
              <li>Steife oder zu schicke Looks</li>
              <li>Business-Outfits</li>
            </ul>
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-xl shadow-inner mt-8">
          <p className="text-lg font-medium">
            Hauptsache: <span className="text-yellow-600">Du fühlst dich wohl</span>, es ist luftig, hell und du bist bereit für eine richtig gute Zeit!
          </p>
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