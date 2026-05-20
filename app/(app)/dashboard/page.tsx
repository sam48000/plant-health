import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage(): Promise<React.JSX.Element> {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <main className="min-h-screen bg-green-50 dark:bg-gray-950 px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-1">
          Bonjour {session.user?.name ?? session.user?.email} 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
          Que veux-tu faire aujourd&apos;hui ?
        </p>

        <div className="flex flex-col gap-4">
          <Link
            href="/analyse"
            className="block bg-green-600 text-white rounded-2xl shadow-md p-6 text-center hover:bg-green-700 active:scale-95 transition-all"
          >
            <p className="text-4xl mb-3">📷</p>
            <p className="font-semibold text-lg">Analyser une plante</p>
            <p className="text-green-100 text-sm mt-1">Prends une photo et obtiens un diagnostic</p>
          </Link>

          <Link
            href="/historique"
            className="block bg-white dark:bg-gray-900 text-green-800 dark:text-green-400 rounded-2xl shadow-md p-6 text-center border border-green-100 dark:border-gray-700 hover:bg-green-50 dark:hover:bg-gray-800 active:scale-95 transition-all"
          >
            <p className="text-4xl mb-3">🗂️</p>
            <p className="font-semibold text-lg">Mes analyses</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              Retrouve toutes tes analyses passées
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
