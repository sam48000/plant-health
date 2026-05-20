"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { analyserPlante } from "@/lib/actions/analyse";

export default function AnalysePage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setError(null);
    const formData = new FormData();
    formData.append("photo", file);
    const result = await analyserPlante(formData);
    if ("error" in result) {
      setError(result.error);
      setLoading(false);
      return;
    }
    router.push(`/analyse/${result.id}`);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-green-50 dark:bg-gray-950 flex flex-col items-center justify-center px-4 gap-6">
        {preview && (
          <div className="relative w-32 h-32 rounded-2xl overflow-hidden shadow-md">
            <Image src={preview} alt="Plante en cours d'analyse" fill className="object-cover" unoptimized />
          </div>
        )}
        <div className="w-12 h-12 rounded-full border-4 border-green-200 dark:border-green-900 border-t-green-600 dark:border-t-green-400 animate-spin" />
        <div className="text-center">
          <p className="text-lg font-semibold text-green-800 dark:text-green-400">
            Claude analyse ta plante…
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Identification, score de santé, recommandations
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-green-50 dark:bg-gray-950 flex flex-col items-center px-4 py-10">
      <h1 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-2">
        Analyser ma plante
      </h1>
      <p className="text-sm text-green-600 dark:text-green-500 mb-8 text-center">
        Prends une photo de ta plante ou importe-en une depuis ta galerie.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-6">
        {!preview ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full aspect-square rounded-2xl border-2 border-dashed border-green-300 dark:border-green-700 bg-white dark:bg-gray-900 flex flex-col items-center justify-center gap-3 text-green-500 dark:text-green-500 hover:bg-green-50 dark:hover:bg-gray-800 transition-colors"
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
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-green-200 dark:border-gray-700 shadow">
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
              className="absolute top-2 right-2 bg-white/80 dark:bg-gray-900/80 rounded-full p-1.5 shadow hover:bg-white dark:hover:bg-gray-900 transition-colors"
              aria-label="Changer la photo"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-green-700 dark:text-green-400"
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

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />

        {error && (
          <p className="text-red-500 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-950 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!file || loading}
          className="w-full py-4 rounded-2xl bg-green-600 text-white font-semibold text-base shadow hover:bg-green-700 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Analyser ma plante 🌿
        </button>
      </form>
    </main>
  );
}
