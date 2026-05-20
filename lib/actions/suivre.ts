"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function suivrePlante(
  analysisId: string,
  nom: string,
): Promise<{ plantId: string } | { error: string }> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const analysis = await prisma.analysis.findUnique({ where: { id: analysisId } });
  if (!analysis || analysis.userId !== session.user.id) {
    return { error: "Analyse introuvable." };
  }

  const nomTrim = nom.trim();
  if (!nomTrim) return { error: "Donne un nom à ta plante." };

  const plant = await prisma.plant.create({
    data: { userId: session.user.id, nom: nomTrim },
  });

  await prisma.analysis.update({
    where: { id: analysisId },
    data: { plantId: plant.id },
  });

  return { plantId: plant.id };
}

export async function ajouterAnalysePlante(
  analysisId: string,
  plantId: string,
): Promise<{ ok: true } | { error: string }> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [analysis, plant] = await Promise.all([
    prisma.analysis.findUnique({ where: { id: analysisId } }),
    prisma.plant.findUnique({ where: { id: plantId } }),
  ]);

  if (!analysis || analysis.userId !== session.user.id) return { error: "Analyse introuvable." };
  if (!plant || plant.userId !== session.user.id) return { error: "Plante introuvable." };

  await prisma.analysis.update({ where: { id: analysisId }, data: { plantId } });
  return { ok: true };
}
