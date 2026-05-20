import { auth } from "@/auth";
import { redirect } from "next/navigation";

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

        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <p className="text-4xl mb-3">🌱</p>
          <p className="text-gray-600 text-sm">
            L&apos;analyse de plantes arrive bientôt.<br />
            Le socle est prêt !
          </p>
        </div>
      </div>
    </main>
  );
}
