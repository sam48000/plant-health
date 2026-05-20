import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import BoutonPartager from "@/components/BoutonPartager";
import BoutonSuivre from "@/components/BoutonSuivre";

function scoreColor(score: number): string {
  if (score >= 70) return "text-green-600 dark:text-green-400";
  if (score >= 40) return "text-orange-500 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
}

function urgenceBadge(urgence: string): string {
  if (urgence === "faible") return "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300";
  if (urgence === "modérée") return "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300";
  return "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300";
}

export default async function ResultatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<React.JSX.Element> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const [analysis, plantesExistantes] = await Promise.all([
    prisma.analysis.findUnique({ where: { id } }),
    prisma.plant.findMany({
      where: { userId: session.user.id },
      select: { id: true, nom: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!analysis || analysis.userId !== session.user.id) notFound();

  const problemes = JSON.parse(analysis.problemes ?? "[]") as string[];
  const recommandations = JSON.parse(analysis.recommandations ?? "[]") as string[];

  return (
    <main className="min-h-screen bg-green-50 dark:bg-gray-950 px-4 py-8 pb-20">
      <div className="max-w-sm mx-auto flex flex-col gap-5">
        {/* Photo */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow">
          <Image
            src={analysis.photoUrl ?? ""}
            alt={analysis.espece ?? "Plante"}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        {/* En-tête */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-5">
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">
            Espèce identifiée
          </p>
          <h1 className="text-xl font-bold text-green-800 dark:text-green-400 mb-3">
            {analysis.espece ?? "Inconnue"}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
            {analysis.etatGeneral ?? ""}
          </p>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Score de santé</p>
              <p className={`text-3xl font-bold ${scoreColor(analysis.scoreHealth ?? 0)}`}>
                {analysis.scoreHealth ?? 0}
                <span className="text-base font-normal text-gray-400 dark:text-gray-500">/100</span>
              </p>
            </div>
            <span
              className={`text-sm font-medium px-3 py-1.5 rounded-full capitalize ${urgenceBadge(analysis.urgence ?? "faible")}`}
            >
              Urgence {analysis.urgence ?? "faible"}
            </span>
          </div>
        </div>

        {/* Problèmes */}
        {problemes.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-5">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">
              ⚠️ Problèmes détectés
            </h2>
            <ul className="flex flex-col gap-2">
              {problemes.map((p, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <span className="text-orange-400 mt-0.5">•</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommandations */}
        {recommandations.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-5">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">
              ✅ Recommandations
            </h2>
            <ul className="flex flex-col gap-2">
              {recommandations.map((r, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <span className="text-green-500 mt-0.5">→</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <Link
          href="/analyse"
          className="w-full py-4 rounded-2xl bg-green-600 text-white font-semibold text-base text-center shadow hover:bg-green-700 active:scale-95 transition-all"
        >
          Analyser une autre plante
        </Link>
        <BoutonPartager analysisId={analysis.id} />
        {!analysis.plantId && (
          <BoutonSuivre
            analysisId={analysis.id}
            especeDetectee={analysis.espece}
            plantesExistantes={plantesExistantes}
          />
        )}
        {analysis.plantId && (
          <Link
            href={`/plantes/${analysis.plantId}`}
            className="w-full py-4 rounded-2xl border-2 border-green-600 text-green-700 dark:text-green-400 dark:border-green-500 font-semibold text-base text-center hover:bg-green-50 dark:hover:bg-green-950 active:scale-95 transition-all"
          >
            📈 Voir l&apos;évolution
          </Link>
        )}
        <Link
          href="/dashboard"
          className="text-center text-sm text-green-700 dark:text-green-400 underline"
        >
          Retour au tableau de bord
        </Link>
      </div>
    </main>
  );
}
