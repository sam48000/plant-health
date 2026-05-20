"use client";

import { useState } from "react";
import { activerPartage } from "@/lib/actions/partage";

export default function BoutonPartager({ analysisId }: { analysisId: string }) {
  const [state, setState] = useState<"idle" | "loading" | "copied">("idle");

  async function handlePartage() {
    setState("loading");
    const result = await activerPartage(analysisId);
    if ("error" in result) {
      setState("idle");
      return;
    }
    const url = `${window.location.origin}/p/${analysisId}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // fallback si clipboard non disponible
      prompt("Copie ce lien :", url);
    }
    setState("copied");
    setTimeout(() => setState("idle"), 3000);
  }

  return (
    <button
      onClick={handlePartage}
      disabled={state === "loading"}
      className="w-full py-4 rounded-2xl border-2 border-green-600 text-green-700 dark:text-green-400 dark:border-green-500 font-semibold text-base text-center hover:bg-green-50 dark:hover:bg-green-950 active:scale-95 transition-all disabled:opacity-50"
    >
      {state === "copied" ? "✅ Lien copié !" : state === "loading" ? "…" : "🔗 Partager cette analyse"}
    </button>
  );
}
