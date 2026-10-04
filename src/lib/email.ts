import 'server-only';

type Mail = { to: string; subject: string; text: string };

/** Wysyła e-mail przez Resend. Bez RESEND_API_KEY tylko loguje treść (prototyp). */
export async function sendMail({ to, subject, text }: Mail) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`[email] (brak RESEND_API_KEY) Do: ${to}\nTemat: ${subject}\n\n${text}\n`);
    return;
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: process.env.EMAIL_FROM, to, subject, text }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}
