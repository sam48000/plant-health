"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function activerPartage(id: string): Promise<{ ok: true } | { error: string }> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const analysis = await prisma.analysis.findUnique({ where: { id } });
  if (!analysis || analysis.userId !== session.user.id) {
    return { error: "Analyse introuvable." };
  }

  await prisma.analysis.update({ where: { id }, data: { isPublic: true } });
  return { ok: true };
}
