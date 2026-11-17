import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { siteConfig } from '@/config/site';

// ─── Request schema ───────────────────────────────────────────────────────────
const ContactSchema = z.object({
  email:   z.email({ error: '請輸入有效的 Email' }),
  message: z.string().min(10, '訊息至少需要 10 個字').max(2000),
});

// ─── Simple rate limiting (in-memory, per IP) ─────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 3;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  // Drop expired entries so the map doesn't grow forever.
  if (rateLimitMap.size > 1000) {
    for (const [key, e] of rateLimitMap) if (now > e.resetAt) rateLimitMap.delete(key);
  }
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

// ─── Route Handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL;
  if (!apiKey || !recipientEmail) {
    console.error('[contact] RESEND_API_KEY / CONTACT_RECIPIENT_EMAIL is not set — contact form disabled');
    return NextResponse.json({ error: '聯絡表單尚未設定，請改用其他方式聯絡。' }, { status: 503 });
  }
  const resend = new Resend(apiKey);

  const ip =
    req.headers.get('cf-connecting-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: '傳送太頻繁，請稍後再試。' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: '無效的請求格式。' }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    const messages = parsed.error.issues.map(i => i.message).join('；');
    return NextResponse.json({ error: messages }, { status: 400 });
  }

  const { email, message } = parsed.data;

  try {
    await resend.emails.send({
      from:    process.env.CONTACT_FROM_EMAIL ?? `${siteConfig.name} <onboarding@resend.dev>`,
      to:      recipientEmail,
      replyTo: email,
      subject: `[Blog 聯絡] 來自 ${email}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
          <h2 style="margin-top: 0; color: #7c3aed;">📬 新訊息來自部落格聯絡表單</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; width: 80px; vertical-align: top;"><strong>Email</strong></td>
              <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #7c3aed;">${email}</a></td>
            </tr>
          </table>
          <div style="background: #f9fafb; border-left: 3px solid #7c3aed; padding: 16px; border-radius: 0 4px 4px 0; white-space: pre-wrap; line-height: 1.6;">
${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
          </div>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">
            直接回覆此郵件即可聯絡到對方。
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[contact] Resend error:', err);
    return NextResponse.json({ error: '郵件傳送失敗，請稍後再試。' }, { status: 500 });
  }
}
