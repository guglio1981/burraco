/* ============================================================
   Push notifications lato server (web-push + VAPID).
   ============================================================ */
import webpush from 'web-push';
import { ENV } from './env.js';
import { query } from './db.js';

let _initialized = false;

function ensureInit(): void {
  if (_initialized) return;
  const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_EMAIL } = ENV;
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY || !VAPID_EMAIL) return;
  webpush.setVapidDetails(`mailto:${VAPID_EMAIL}`, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  _initialized = true;
}

export type PushStatus = 'ok' | 'no_sub' | 'expired' | 'not_configured';

export async function sendPush(
  userId: string,
  payload: { title: string; body: string; url: string; icon?: string },
): Promise<PushStatus> {
  ensureInit();
  if (!_initialized) return 'not_configured';

  const r = await query<{ push_subscription: unknown }>(
    'SELECT push_subscription FROM users WHERE id = $1',
    [userId],
  );
  const sub = r.rows[0]?.push_subscription;
  if (!sub) return 'no_sub';

  try {
    await webpush.sendNotification(sub as webpush.PushSubscription, JSON.stringify(payload));
    return 'ok';
  } catch (e: unknown) {
    const status = typeof e === 'object' && e !== null && 'statusCode' in e
      ? (e as { statusCode: number }).statusCode : 0;
    if (status === 404 || status === 410) {
      await query('UPDATE users SET push_subscription = NULL WHERE id = $1', [userId]);
      return 'expired';
    }
    throw e;
  }
}
