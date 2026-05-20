import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage(): Promise<React.JSX.Element> {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <main className="min-h-screen bg-green-50 px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-green-800 mb-1">
          Bonjour {session.user?.name ?? session.user?.email} 👋
        </h1>
        <p className="text-gray-500 text-sm mb-8">Que veux-tu faire aujourd&apos;hui ?</p>

        <Link
          href="/analyse"
          className="block bg-green-600 text-white rounded-2xl shadow-md p-6 text-center hover:bg-green-700 active:scale-95 transition-all"
        >
          <p className="text-4xl mb-3">📷</p>
          <p className="font-semibold text-lg">Analyser une plante</p>
          <p className="text-green-100 text-sm mt-1">Prends une photo et obtiens un diagnostic</p>
        </Link>
      </div>
    </main>
  );
}
