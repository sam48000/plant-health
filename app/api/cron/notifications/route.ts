import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPushNotification } from "@/lib/push";

// Déclencher via : GET /api/cron/notifications?secret=<CRON_SECRET>
// En production : configurer un cron Vercel ou équivalent pour appeler cette URL toutes les heures.

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const now = new Date();

  // Trouver les plantes avec notif actives et dont le rappel est dû
  const plantsDues = await prisma.plant.findMany({
    where: { notifActives: true },
    include: { user: { include: { pushSubscriptions: true } } },
  });

  let envoyes = 0;
  let erreurs = 0;

  for (const plant of plantsDues) {
    const dernierRappel = plant.dernierRappel ?? plant.createdAt;
    const prochainRappel = new Date(dernierRappel);
    prochainRappel.setDate(prochainRappel.getDate() + plant.intervalDays);

    if (now < prochainRappel) continue;

    const subscriptions = plant.user.pushSubscriptions;
    if (subscriptions.length === 0) continue;

    const results = await Promise.allSettled(
      subscriptions.map((sub) =>
        sendPushNotification(sub, {
          title: `🌿 ${plant.nom}`,
          body: `Il est temps de prendre soin de ta plante ! Vérifie son état.`,
          url: `/plantes/${plant.id}`,
        }),
      ),
    );

    const ok = results.filter((r) => r.status === "fulfilled").length;
    envoyes += ok;
    erreurs += results.length - ok;

    await prisma.plant.update({
      where: { id: plant.id },
      data: { dernierRappel: now },
    });
  }

  return NextResponse.json({ ok: true, envoyes, erreurs, plantes: plantsDues.length });
}
