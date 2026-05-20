import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

function scoreColor(score: number): string {
  if (score >= 70) return "text-green-600 dark:text-green-400";
  if (score >= 40) return "text-orange-500 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" }).format(date);
}

function ScoreChart({ scores }: { scores: { date: Date; score: number }[] }) {
  if (scores.length < 2) return null;

  const W = 300;
  const H = 80;
  const pad = 16;
  const innerW = W - pad * 2;
  const innerH = H - pad * 2;

  const xs = scores.map((_, i) => pad + (i / (scores.length - 1)) * innerW);
  const ys = scores.map((s) => pad + (1 - s.score / 100) * innerH);

  const polyline = xs.map((x, i) => `${x},${ys[i]}`).join(" ");

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-5">
      <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">
        Évolution du score de santé
      </h2>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-hidden="true">
        {/* Lignes de référence */}
        {[25, 50, 75].map((v) => {
          const y = pad + (1 - v / 100) * innerH;
          return (
            <line key={v} x1={pad} x2={W - pad} y1={y} y2={y} stroke="#e5e7eb" strokeWidth="1" />
          );
        })}
        {/* Ligne du score */}
        <polyline points={polyline} fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {/* Points */}
        {xs.map((x, i) => (
          <circle key={i} cx={x} cy={ys[i]} r="4" fill="#16a34a" />
        ))}
      </svg>
      {/* Dates sous le graphe */}
      <div className="flex justify-between mt-1">
        {scores.map((s, i) => (
          <span key={i} className="text-xs text-gray-400 dark:text-gray-500">
            {formatDate(s.date)}
          </span>
        ))}
      </div>
    </div>
  );
}

export default async function PlantePage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<React.JSX.Element> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const plant = await prisma.plant.findUnique({
    where: { id },
    include: {
      analyses: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          photoUrl: true,
          espece: true,
          scoreHealth: true,
          etatGeneral: true,
          createdAt: true,
        },
      },
    },
  });

  if (!plant || plant.userId !== session.user.id) notFound();

  const derniere = plant.analyses.at(-1);
  const scores = plant.analyses.map((a) => ({ date: a.createdAt, score: a.scoreHealth ?? 0 }));
  const scoreMoyen =
    scores.length > 0
      ? Math.round(scores.reduce((s, a) => s + a.score, 0) / scores.length)
      : 0;

  return (
    <main className="min-h-screen bg-green-50 dark:bg-gray-950 px-4 py-8 pb-20">
      <div className="max-w-sm mx-auto flex flex-col gap-5">
        {/* En-tête */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-5">
          <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">
            Ma plante
          </p>
          <h1 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-1">
            {plant.nom}
          </h1>
          {derniere?.espece && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{derniere.espece}</p>
          )}

          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Score actuel</p>
              <p className={`text-3xl font-bold ${scoreColor(derniere?.scoreHealth ?? 0)}`}>
                {derniere?.scoreHealth ?? "—"}
                {derniere && <span className="text-base font-normal text-gray-400 dark:text-gray-500">/100</span>}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Score moyen</p>
              <p className={`text-2xl font-bold ${scoreColor(scoreMoyen)}`}>
                {scoreMoyen}
                <span className="text-sm font-normal text-gray-400 dark:text-gray-500">/100</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">Analyses</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {plant.analyses.length}
              </p>
            </div>
          </div>
        </div>

        {/* Graphe */}
        <ScoreChart scores={scores} />

        {/* Dernière photo */}
        {derniere?.photoUrl && (
          <Link href={`/analyse/${derniere.id}`} className="block">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow hover:opacity-90 transition-opacity">
              <Image
                src={derniere.photoUrl}
                alt={plant.nom}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute bottom-2 right-2 bg-black/50 rounded-lg px-2 py-1">
                <span className="text-white text-xs font-medium">Dernière analyse →</span>
              </div>
            </div>
          </Link>
        )}

        {/* Liste des analyses */}
        {plant.analyses.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-5">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">
              Historique ({plant.analyses.length})
            </h2>
            <ul className="flex flex-col gap-3">
              {[...plant.analyses].reverse().map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/analyse/${a.id}`}
                    className="flex items-center gap-3 hover:opacity-75 active:scale-[0.98] transition-all"
                  >
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-green-100 dark:bg-green-900">
                      {a.photoUrl && (
                        <Image src={a.photoUrl} alt={plant.nom} fill className="object-cover" unoptimized />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {formatDate(a.createdAt)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                        {a.etatGeneral ?? "—"}
                      </p>
                    </div>
                    <p className={`text-lg font-bold shrink-0 ${scoreColor(a.scoreHealth ?? 0)}`}>
                      {a.scoreHealth ?? "—"}
                    </p>
                  </Link>
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
          Analyser à nouveau
        </Link>
        <Link href="/dashboard" className="text-center text-sm text-green-700 dark:text-green-400 underline">
          Retour au tableau de bord
        </Link>
      </div>
    </main>
  );
}
