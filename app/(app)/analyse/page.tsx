"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export default function AnalysePage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  function handleReset() {
    setPreview(null);
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    // Palier 2.2 — Server Action ici
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-green-50 flex flex-col items-center px-4 py-10">
      <h1 className="text-2xl font-bold text-green-800 mb-2">Analyser ma plante</h1>
      <p className="text-sm text-green-600 mb-8 text-center">
        Prends une photo de ta plante ou importe-en une depuis ta galerie.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-6">
        {/* Zone de sélection / aperçu */}
        {!preview ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full aspect-square rounded-2xl border-2 border-dashed border-green-300 bg-white flex flex-col items-center justify-center gap-3 text-green-500 hover:bg-green-50 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-14 h-14"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
              />
            </svg>
            <span className="text-sm font-medium">Prendre une photo ou importer</span>
          </button>
        ) : (
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-green-200 shadow">
            <Image
              src={preview}
              alt="Aperçu de la plante"
              fill
              className="object-cover"
              unoptimized
            />
            <button
              type="button"
              onClick={handleReset}
              className="absolute top-2 right-2 bg-white/80 rounded-full p-1.5 shadow hover:bg-white transition-colors"
              aria-label="Changer la photo"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-green-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Input caché — ouvre caméra sur mobile, galerie sur desktop */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Bouton d'analyse */}
        <button
          type="submit"
          disabled={!file || loading}
          className="w-full py-4 rounded-2xl bg-green-600 text-white font-semibold text-base shadow hover:bg-green-700 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Analyse en cours…" : "Analyser ma plante 🌿"}
        </button>
      </form>
    </main>
  );
}
