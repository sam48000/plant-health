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

type EspeceGroup = {
  espece: string;
  count: number;
  scoreMoyen: number;
  analyses: { id: string; photoUrl: string | null; scoreHealth: number | null }[];
};

export default async function GaleriePage(): Promise<React.JSX.Element> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const analyses = await prisma.analysis.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, photoUrl: true, espece: true, scoreHealth: true },
  });

  // Grouper par espèce
  const groupsMap = new Map<string, EspeceGroup>();
  for (const a of analyses) {
    const key = a.espece ?? "Inconnue";
    if (!groupsMap.has(key)) {
      groupsMap.set(key, { espece: key, count: 0, scoreMoyen: 0, analyses: [] });
    }
    const group = groupsMap.get(key)!;
    group.analyses.push(a);
    group.count++;
  }

  // Calculer score moyen par groupe
  const groups: EspeceGroup[] = Array.from(groupsMap.values()).map((g) => {
    const scores = g.analyses.map((a) => a.scoreHealth ?? 0);
    return { ...g, scoreMoyen: Math.round(scores.reduce((s, n) => s + n, 0) / scores.length) };
  });

  return (
    <main className="min-h-screen bg-green-50 dark:bg-gray-950 px-4 py-8 pb-20">
      <div className="max-w-sm mx-auto">
        <h1 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-1">
          Galerie par espèce
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {groups.length === 0
            ? "Aucune analyse pour l'instant."
            : `${groups.length} espèce${groups.length > 1 ? "s" : ""} identifiée${groups.length > 1 ? "s" : ""}`}
        </p>

        {groups.length === 0 ? (
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
          <div className="flex flex-col gap-6">
            {groups.map((g) => (
              <div key={g.espece} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-5">
                {/* En-tête du groupe */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-bold text-gray-800 dark:text-gray-100 text-base">
                      {g.espece}
                    </h2>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {g.count} analyse{g.count > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Score moyen</p>
                    <p className={`text-xl font-bold ${scoreColor(g.scoreMoyen)}`}>
                      {g.scoreMoyen}
                      <span className="text-xs font-normal text-gray-400 dark:text-gray-500">
                        /100
                      </span>
                    </p>
                  </div>
                </div>

                {/* Grille de miniatures */}
                <div className="grid grid-cols-3 gap-2">
                  {g.analyses.slice(0, 6).map((a) => (
                    <Link key={a.id} href={`/analyse/${a.id}`} className="block">
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-green-100 dark:bg-green-900 hover:opacity-80 active:scale-95 transition-all">
                        {a.photoUrl ? (
                          <Image
                            src={a.photoUrl}
                            alt={g.espece}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <span className="flex items-center justify-center w-full h-full text-xl">
                            🌿
                          </span>
                        )}
                        {/* Score en overlay */}
                        <div className="absolute bottom-1 right-1 bg-black/50 rounded-md px-1 py-0.5">
                          <span className={`text-xs font-bold ${scoreColor(a.scoreHealth ?? 0)}`}>
                            {a.scoreHealth ?? 0}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                  {g.count > 6 && (
                    <Link href="/historique">
                      <div className="aspect-square rounded-xl bg-green-50 dark:bg-gray-800 flex items-center justify-center text-green-700 dark:text-green-400 text-xs font-semibold hover:bg-green-100 dark:hover:bg-gray-700 transition-colors">
                        +{g.count - 6} autres
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/analyse"
            className="w-full py-4 rounded-2xl bg-green-600 text-white font-semibold text-base text-center shadow hover:bg-green-700 active:scale-95 transition-all"
          >
            Nouvelle analyse
          </Link>
          <Link
            href="/historique"
            className="text-center text-sm text-green-700 dark:text-green-400 underline"
          >
            Voir la liste chronologique
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
