"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { anthropic } from "@/lib/anthropic";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

type AnalyseResult = {
  espece: string;
  score_sante: number;
  etat_general: string;
  problemes: string[];
  recommandations: string[];
  urgence: "faible" | "modérée" | "élevée";
};

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"] as const;
type AllowedType = (typeof ALLOWED_TYPES)[number];

export async function analyserPlante(
  formData: FormData,
): Promise<{ id: string } | { error: string }> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const file = formData.get("photo") as File | null;
  if (!file || file.size === 0) return { error: "Aucune photo reçue." };
  if (!ALLOWED_TYPES.includes(file.type as AllowedType)) {
    return { error: "Format non supporté. Utilise JPEG, PNG ou WebP." };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Sauvegarde locale dans public/uploads/
  const ext = file.type.split("/")[1] ?? "jpg";
  const filename = `${randomUUID()}.${ext}`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, filename), buffer);
  const photoUrl = `/uploads/${filename}`;

  // Appel Claude API avec vision
  const base64 = buffer.toString("base64");
  const mediaType = file.type as AllowedType;

  let raw: string;
  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: base64 },
            },
            {
              type: "text",
              text: `Tu es un expert botaniste. Analyse la santé de cette plante et réponds UNIQUEMENT avec un objet JSON valide, sans markdown, sans texte avant ou après. Format exact :
{
  "espece": "nom de la plante (ou 'Inconnue' si non identifiable)",
  "score_sante": <nombre entier de 0 à 100>,
  "etat_general": "description courte de l'état en 1 phrase",
  "problemes": ["problème 1", "problème 2"],
  "recommandations": ["action concrète 1", "action concrète 2"],
  "urgence": "faible" | "modérée" | "élevée"
}`,
            },
          ],
        },
      ],
    });
    raw = message.content[0].type === "text" ? message.content[0].text.trim() : "";
  } catch {
    return { error: "Impossible de contacter l'API d'analyse. Réessaie." };
  }

  let result: AnalyseResult;
  try {
    result = JSON.parse(raw) as AnalyseResult;
  } catch {
    return { error: "L'analyse n'a pas pu être interprétée. Réessaie avec une autre photo." };
  }

  // Sauvegarde en base
  const analysis = await prisma.analysis.create({
    data: {
      userId: session.user.id,
      photoUrl,
      espece: result.espece,
      scoreHealth: result.score_sante,
      etatGeneral: result.etat_general,
      problemes: JSON.stringify(result.problemes),
      recommandations: JSON.stringify(result.recommandations),
      urgence: result.urgence,
    },
  });

  return { id: analysis.id };
}
