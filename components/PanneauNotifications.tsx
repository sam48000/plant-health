"use client";

import { useState, useEffect } from "react";
import { sauvegarderAbonnement, configurerRappel, desactiverRappel, envoyerTestNotification } from "@/lib/actions/notifications";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

type Props = {
  plantId: string;
  plantNom: string;
  notifActives: boolean;
  intervalDays: number;
};

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export default function PanneauNotifications({ plantId, plantNom, notifActives, intervalDays }: Props) {
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [actives, setActives] = useState(notifActives);
  const [interval, setInterval] = useState(intervalDays);
  const [loading, setLoading] = useState(false);
  const [testMsg, setTestMsg] = useState<string | null>(null);

  useEffect(() => {
    setSupported("Notification" in window && "serviceWorker" in navigator && "PushManager" in window);
    if ("Notification" in window) setPermission(Notification.permission);
  }, []);

  async function getOrCreateSubscription(): Promise<PushSubscription | null> {
    const reg = await navigator.serviceWorker.ready;
    const existing = await reg.pushManager.getSubscription();
    if (existing) return existing;
    return reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
  }

  async function handleActiver() {
    setLoading(true);
    setTestMsg(null);
    try {
      // 1. Demander la permission
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== "granted") {
        setTestMsg("❌ Permission refusée. Active les notifications dans les réglages du navigateur.");
        setLoading(false);
        return;
      }

      // 2. Enregistrer le service worker si pas encore fait
      await navigator.serviceWorker.register("/sw.js");

      // 3. Obtenir ou créer l'abonnement push
      const sub = await getOrCreateSubscription();
      if (!sub) throw new Error("Impossible de créer l'abonnement");

      const subJson = sub.toJSON() as { endpoint: string; keys: { p256dh: string; auth: string } };

      // 4. Sauvegarder côté serveur
      await sauvegarderAbonnement({
        endpoint: subJson.endpoint,
        p256dh: subJson.keys.p256dh,
        auth: subJson.keys.auth,
      });

      // 5. Configurer le rappel
      const result = await configurerRappel(plantId, interval);
      if ("error" in result) throw new Error(result.error);

      setActives(true);
      setTestMsg(`✅ Rappels activés toutes les ${interval} jours !`);
    } catch (e) {
      setTestMsg("❌ Erreur : " + (e instanceof Error ? e.message : "inconnue"));
    }
    setLoading(false);
  }

  async function handleDesactiver() {
    setLoading(true);
    await desactiverRappel(plantId);
    setActives(false);
    setTestMsg("Rappels désactivés.");
    setLoading(false);
  }

  async function handleTest() {
    setLoading(true);
    setTestMsg(null);
    const result = await envoyerTestNotification(plantId);
    setTestMsg("error" in result ? "❌ " + result.error : "✅ Notification envoyée !");
    setLoading(false);
    setTimeout(() => setTestMsg(null), 4000);
  }

  if (!supported) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-5">
        <p className="text-sm text-gray-400 dark:text-gray-500 text-center">
          🔔 Notifications non supportées par ce navigateur
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">🔔 Rappels d&apos;entretien</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {actives ? `Rappel toutes les ${interval} jours` : "Désactivés"}
          </p>
        </div>
        <div
          onClick={!loading ? (actives ? handleDesactiver : handleActiver) : undefined}
          className={`relative w-12 h-7 rounded-full transition-colors cursor-pointer ${actives ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${actives ? "translate-x-6" : "translate-x-1"}`} />
        </div>
      </div>

      {actives && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fréquence du rappel
            </label>
            <div className="flex gap-2">
              {[3, 7, 14, 30].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={async () => {
                    setInterval(d);
                    await configurerRappel(plantId, d);
                  }}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${interval === d ? "bg-green-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-700"}`}
                >
                  {d}j
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleTest}
            disabled={loading}
            className="w-full py-2.5 rounded-xl border border-green-300 dark:border-green-700 text-green-700 dark:text-green-400 text-sm font-medium hover:bg-green-50 dark:hover:bg-green-950 disabled:opacity-50 transition-colors"
          >
            Envoyer une notification test
          </button>
        </>
      )}

      {!actives && permission === "denied" && (
        <p className="text-xs text-orange-500 dark:text-orange-400">
          ⚠️ Notifications bloquées dans le navigateur. Va dans Réglages → Confidentialité pour les réactiver.
        </p>
      )}

      {testMsg && (
        <p className="text-sm text-center text-gray-600 dark:text-gray-300">{testMsg}</p>
      )}
    </div>
  );
}
