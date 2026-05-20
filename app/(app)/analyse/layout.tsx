// Donne 60s au lieu de 10s (défaut Vercel Hobby) pour l'appel Claude API vision
export const maxDuration = 60;

export default function AnalyseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
