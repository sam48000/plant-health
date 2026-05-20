import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

function scoreColor(score: number): string {
  if (score >= 70) return "text-green-600 dark:text-green-400";
  if (score >= 40) return "text-orange-500 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function HistoriquePage(): Promise<React.JSX.Element> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const analyses = await prisma.analysis.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      photoUrl: true,
      espece: true,
      scoreHealth: true,
      urgence: true,
      createdAt: true,
    },
  });

  return (
    <main className="min-h-screen bg-green-50 dark:bg-gray-950 px-4 py-8 pb-20">
      <div className="max-w-sm mx-auto">
        <h1 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-1">Mes analyses</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {analyses.length === 0
            ? "Aucune analyse pour l'instant."
            : `${analyses.length} analyse${analyses.length > 1 ? "s" : ""} enregistrée${analyses.length > 1 ? "s" : ""}`}
        </p>

        {analyses.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <span className="text-6xl">🌿</span>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Tu n&apos;as pas encore analysé de plante.
            </p>
            <Link
              href="/analyse"
              className="mt-2 px-6 py-3 bg-green-600 text-white rounded-2xl font-semibold shadow hover:bg-green-700 active:scale-95 transition-all"
            >
              Analyser ma première plante
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {analyses.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/analyse/${a.id}`}
                  className="flex items-center gap-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-4 hover:shadow-md dark:hover:bg-gray-800 active:scale-[0.98] transition-all"
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-green-100 dark:bg-green-900">
                    {a.photoUrl ? (
                      <Image
                        src={a.photoUrl}
                        alt={a.espece ?? "Plante"}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="flex items-center justify-center w-full h-full text-2xl">
                        🌿
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 dark:text-gray-100 truncate">
                      {a.espece ?? "Plante inconnue"}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {formatDate(a.createdAt)}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className={`text-xl font-bold ${scoreColor(a.scoreHealth ?? 0)}`}>
                      {a.scoreHealth ?? 0}
                      <span className="text-xs font-normal text-gray-400 dark:text-gray-500">/100</span>
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/analyse"
            className="w-full py-4 rounded-2xl bg-green-600 text-white font-semibold text-base text-center shadow hover:bg-green-700 active:scale-95 transition-all"
          >
            Nouvelle analyse
          </Link>
          <Link
            href="/galerie"
            className="w-full py-4 rounded-2xl border-2 border-green-600 text-green-700 dark:text-green-400 dark:border-green-500 font-semibold text-base text-center hover:bg-green-50 dark:hover:bg-green-950 active:scale-95 transition-all"
          >
            🌿 Voir par espèce
          </Link>
          <Link
            href="/dashboard"
            className="text-center text-sm text-green-700 dark:text-green-400 underline"
          >
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    </main>
  );
}
