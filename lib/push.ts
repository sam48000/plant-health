import webpush from "web-push";

export type PushPayload = {
  title: string;
  body: string;
  url?: string;
};

function getWebPush() {
  const email = process.env.VAPID_EMAIL ?? "mailto:admin@planthealthapp.com";
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  if (!publicKey || !privateKey) {
    throw new Error("VAPID keys are not configured");
  }

  webpush.setVapidDetails(email, publicKey, privateKey);
  return webpush;
}

export async function sendPushNotification(
  subscription: { endpoint: string; p256dh: string; auth: string },
  payload: PushPayload,
): Promise<void> {
  const wp = getWebPush();
  await wp.sendNotification(
    {
      endpoint: subscription.endpoint,
      keys: { p256dh: subscription.p256dh, auth: subscription.auth },
    },
    JSON.stringify(payload),
  );
}

export const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY ?? "";
