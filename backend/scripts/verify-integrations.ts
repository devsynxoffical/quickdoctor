/**
 * Verifies Stripe + Zoom credentials without printing secret values.
 * Usage: cd backend && npx ts-node scripts/verify-integrations.ts
 */
import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

async function verifyZoom(): Promise<{ ok: boolean; message: string }> {
  const accountId = process.env.ZOOM_ACCOUNT_ID;
  const clientId = process.env.ZOOM_CLIENT_ID;
  const clientSecret = process.env.ZOOM_CLIENT_SECRET;

  if (!accountId || !clientId || !clientSecret) {
    return { ok: false, message: 'Zoom env vars missing (ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET)' };
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const res = await fetch(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`,
    {
      method: 'POST',
      headers: { Authorization: `Basic ${credentials}` },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    return { ok: false, message: `Zoom OAuth failed (${res.status}): ${text.slice(0, 200)}` };
  }

  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) {
    return { ok: false, message: 'Zoom OAuth returned no access_token' };
  }

  return { ok: true, message: 'Zoom Server-to-Server OAuth OK' };
}

async function verifyStripe(): Promise<{ ok: boolean; message: string }> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return { ok: false, message: 'STRIPE_SECRET_KEY not set (test mode booking only)' };
  }

  try {
    const stripe = new Stripe(key);
    await stripe.balance.retrieve();
    const mode = key.startsWith('sk_live') ? 'live' : 'test';
    const webhook = process.env.STRIPE_WEBHOOK_SECRET ? 'webhook secret set' : 'webhook secret MISSING';
    return { ok: true, message: `Stripe ${mode} API OK (${webhook})` };
  } catch (e: unknown) {
    return { ok: false, message: `Stripe error: ${e instanceof Error ? e.message : String(e)}` };
  }
}

async function main() {
  const zoom = await verifyZoom();
  const stripe = await verifyStripe();

  console.log('--- Integration check ---');
  console.log(zoom.ok ? '✓' : '✗', 'Zoom:', zoom.message);
  console.log(stripe.ok ? '✓' : '✗', 'Stripe:', stripe.message);
  console.log('-------------------------');

  if (!zoom.ok || !stripe.ok) {
    process.exit(1);
  }
}

main();
