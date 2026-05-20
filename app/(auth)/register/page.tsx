"use client";

import { useState } from "react";
import { register } from "@/lib/actions/auth";
import Link from "next/link";

export default function RegisterPage(): React.JSX.Element {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await register(new FormData(e.currentTarget));
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-green-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-2 text-center">
          🌿 Plant Health
        </h1>
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-6">
          Crée ton compte gratuitement
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Prénom (facultatif)
            </label>
            <input
              name="name"
              type="text"
              autoComplete="given-name"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mot de passe
            </label>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">8 caractères minimum</p>
          </div>

          {error && <p className="text-red-500 dark:text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-green-700 text-white rounded-lg py-2 text-sm font-semibold hover:bg-green-800 disabled:opacity-50 transition-colors"
          >
            {loading ? "Création…" : "Créer mon compte"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-green-700 dark:text-green-400 font-medium hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  );
}
