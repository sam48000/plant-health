"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { sendPushNotification } from "@/lib/push";

export async function sauvegarderAbonnement(
  subscription: { endpoint: string; p256dh: string; auth: string },
): Promise<{ ok: true } | { error: string }> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  await prisma.pushSubscription.upsert({
    where: { endpoint: subscription.endpoint },
    create: { userId: session.user.id, ...subscription },
    update: { userId: session.user.id, p256dh: subscription.p256dh, auth: subscription.auth },
  });

  return { ok: true };
}

export async function configurerRappel(
  plantId: string,
  intervalDays: number,
): Promise<{ ok: true } | { error: string }> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const plant = await prisma.plant.findUnique({ where: { id: plantId } });
  if (!plant || plant.userId !== session.user.id) return { error: "Plante introuvable." };

  await prisma.plant.update({
    where: { id: plantId },
    data: { notifActives: true, intervalDays, dernierRappel: new Date() },
  });

  return { ok: true };
}

export async function desactiverRappel(
  plantId: string,
): Promise<{ ok: true } | { error: string }> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const plant = await prisma.plant.findUnique({ where: { id: plantId } });
  if (!plant || plant.userId !== session.user.id) return { error: "Plante introuvable." };

  await prisma.plant.update({ where: { id: plantId }, data: { notifActives: false } });
  return { ok: true };
}

export async function envoyerTestNotification(
  plantId: string,
): Promise<{ ok: true } | { error: string }> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [plant, subscriptions] = await Promise.all([
    prisma.plant.findUnique({ where: { id: plantId } }),
    prisma.pushSubscription.findMany({ where: { userId: session.user.id } }),
  ]);

  if (!plant || plant.userId !== session.user.id) return { error: "Plante introuvable." };
  if (subscriptions.length === 0) return { error: "Aucun abonnement trouvé. Active d'abord les notifications." };

  await Promise.allSettled(
    subscriptions.map((sub) =>
      sendPushNotification(sub, {
        title: `🌿 ${plant.nom}`,
        body: "C'est l'heure de vérifier ta plante !",
        url: `/plantes/${plant.id}`,
      }),
    ),
  );

  return { ok: true };
}
