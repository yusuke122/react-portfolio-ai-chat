import type { ContactFormValues } from '@/pages/Contact';

export async function sendContactEmail(values: ContactFormValues) {
  const env = (import.meta as any)?.env ?? {};
  const isDev = !!env.DEV;
  const rawBase = (env.VITE_API_BASE || '').toString().trim();

  if (isDev && !rawBase) {
    // Helpful hint for local dev (we use Vite proxy by default)
    console.warn('[contact] 開発環境では VITE_API_BASE なしで /api を呼び出します（Vite の proxy によりローカル API へ到達）。');
  }

  // Build URL safely (avoid double slashes)
  const base = rawBase;
  const url = `${base ? base : ''}/api/send-email`.replace(/([^:]\/)\/+/, '$1');

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    const hint = isDev
      ? '（開発中は Vite の proxy が /api をローカル API に転送します。`npm run dev` で dev API サーバーが起動しているか確認してください）'
      : '';
    throw new Error(`メール送信に失敗しました: ${res.status} ${text} ${hint}`.trim());
  }
}
