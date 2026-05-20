"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { suivrePlante, ajouterAnalysePlante } from "@/lib/actions/suivre";

type Props = {
  analysisId: string;
  especeDetectee: string | null;
  plantesExistantes: { id: string; nom: string }[];
};

export default function BoutonSuivre({ analysisId, especeDetectee, plantesExistantes }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"nouvelle" | "existante">("nouvelle");
  const [nom, setNom] = useState(especeDetectee ?? "");
  const [plantId, setPlantId] = useState(plantesExistantes[0]?.id ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === "nouvelle") {
      const result = await suivrePlante(analysisId, nom);
      if ("error" in result) {
        setError(result.error);
        setLoading(false);
        return;
      }
      router.push(`/plantes/${result.plantId}`);
    } else {
      const result = await ajouterAnalysePlante(analysisId, plantId);
      if ("error" in result) {
        setError(result.error);
        setLoading(false);
        return;
      }
      router.push(`/plantes/${plantId}`);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full py-4 rounded-2xl border-2 border-green-600 text-green-700 dark:text-green-400 dark:border-green-500 font-semibold text-base text-center hover:bg-green-50 dark:hover:bg-green-950 active:scale-95 transition-all"
      >
        📈 Suivre cette plante
      </button>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-5 flex flex-col gap-4">
      <h3 className="font-semibold text-gray-800 dark:text-gray-100">Suivre cette plante</h3>

      {plantesExistantes.length > 0 && (
        <div className="flex rounded-xl overflow-hidden border border-green-200 dark:border-green-800 text-sm font-medium">
          <button
            type="button"
            onClick={() => setMode("nouvelle")}
            className={`flex-1 py-2 transition-colors ${mode === "nouvelle" ? "bg-green-600 text-white" : "text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-800"}`}
          >
            Nouvelle plante
          </button>
          <button
            type="button"
            onClick={() => setMode("existante")}
            className={`flex-1 py-2 transition-colors ${mode === "existante" ? "bg-green-600 text-white" : "text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-800"}`}
          >
            Plante existante
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {mode === "nouvelle" ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nom de la plante
            </label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="ex. Mon ficus, Basilic du balcon…"
              required
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Choisir une plante
            </label>
            <select
              value={plantId}
              onChange={(e) => setPlantId(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {plantesExistantes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nom}
                </option>
              ))}
            </select>
          </div>
        )}

        {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "…" : "Confirmer"}
          </button>
        </div>
      </form>
    </div>
  );
}
