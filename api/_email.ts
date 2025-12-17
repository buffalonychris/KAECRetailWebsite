type EmailLinks = {
  reviewUrl?: string;
  printUrl: string;
  verifyUrl: string;
  resumeUrl: string;
};

type EmailPayload = {
  to: string;
  meta: {
    docType: string;
    reference: string;
    issuedAtISO: string;
    hashShort?: string;
  } & Record<string, unknown>;
  links: EmailLinks;
  context?: {
    name?: string;
    city?: string;
    tier?: string;
  };
};

type EmailProvider = 'resend' | 'smtp' | 'mock';

type EmailSuccess = { ok: true; provider: EmailProvider; id?: string };

type EmailFailure = { ok: false; provider: EmailProvider; error: string };

type EmailResult = EmailSuccess | EmailFailure;

const isEmailFailure = (result: EmailResult): result is EmailFailure => result.ok === false;

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const getBody = (req: { body?: unknown }) => {
  if (!req.body) return null;
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body) as Record<string, unknown>;
    } catch (error) {
      console.error('Failed to parse JSON body', error);
      return null;
    }
  }
  return req.body as Record<string, unknown>;
};

const validatePayload = (input: Record<string, unknown> | null): { valid: boolean; error?: string; payload?: EmailPayload } => {
  if (!input) return { valid: false, error: 'Invalid JSON body' };
  const { to, meta, links, context } = input as EmailPayload;

  if (!to || typeof to !== 'string' || !isEmail(to)) return { valid: false, error: 'to is required and must be an email' };
  if (!meta || typeof meta !== 'object') return { valid: false, error: 'meta is required' };
  if (!links || typeof links !== 'object') return { valid: false, error: 'links is required' };
  if (!('printUrl' in (links as EmailLinks)) || !('verifyUrl' in (links as EmailLinks)) || !('resumeUrl' in (links as EmailLinks))) {
    return { valid: false, error: 'links must include printUrl, verifyUrl, and resumeUrl' };
  }

  return { valid: true, payload: { to, meta, links: links as EmailLinks, context } };
};

const renderButton = (href: string, label: string) =>
  `<p style="margin:14px 0"><a href="${href}" style="background:#f5c042;color:#0c0b0b;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:700">${label}</a></p>`;

const buildContent = (payload: EmailPayload, docLabel: 'Quote' | 'Agreement') => {
  const reference = (payload.meta.reference as string) || docLabel;
  const subject = `KickAss Elder Care — ${docLabel} ${reference}`;
  const hash = (payload.meta.hashShort as string) || '';
  const issuedAt = (payload.meta.issuedAtISO as string) || '';
  const header = '<p style="margin:0 0 12px 0;font-size:16px;font-weight:700">Your official copy is ready.</p>';
  const buttons = [
    renderButton(payload.links.printUrl, 'View / Print (legal copy)'),
    renderButton(payload.links.verifyUrl, 'Verify authenticity'),
    renderButton(payload.links.resumeUrl, 'Resume where you left off'),
  ];
  if (payload.links.reviewUrl) {
    buttons.push(renderButton(payload.links.reviewUrl, 'Review page'));
  }

  const plainLinks = [
    `View / Print: ${payload.links.printUrl}`,
    `Verify authenticity: ${payload.links.verifyUrl}`,
    `Resume: ${payload.links.resumeUrl}`,
    payload.links.reviewUrl ? `Review: ${payload.links.reviewUrl}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const hashLine = hash ? `<p style="margin:10px 0;color:#444">Reference: ${reference} • Hash: ${hash}</p>` : '';
  const contextLine = [payload.context?.name, payload.context?.city, payload.context?.tier]
    .filter(Boolean)
    .join(' • ');
  const contextMarkup = contextLine ? `<p style="margin:10px 0;color:#444">Context: ${contextLine}</p>` : '';

  const disclaimers = [
    'This message is informational only and not medical advice.',
    'If there is an emergency or urgent safety concern, call 911.',
    'Do not share this link publicly. It includes your verification token.',
  ]
    .map((item) => `<li>${item}</li>`)
    .join('');

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5;font-size:15px;color:#0c0b0b">
      ${header}
      <p style="margin:0 0 12px 0">Issued: ${issuedAt || 'timestamp pending'} • ${docLabel} ${reference}</p>
      ${buttons.join('')}
      ${hashLine}
      ${contextMarkup}
      <p style="margin:14px 0 6px 0;font-weight:700">Links</p>
      <p style="margin:0 0 12px 0">${plainLinks.replace(/\n/g, '<br/>')}</p>
      <p style="margin:14px 0 6px 0;font-weight:700">Disclaimers</p>
      <ul style="margin:0 0 12px 18px;padding:0">${disclaimers}</ul>
    </div>
  `;

  const text = [
    'Your official copy is ready.',
    `Issued: ${issuedAt || 'timestamp pending'} • ${docLabel} ${reference}`,
    plainLinks,
    hash ? `Reference: ${reference} • Hash: ${hash}` : '',
    contextLine ? `Context: ${contextLine}` : '',
    '',
    'Disclaimers:',
    '- This message is informational only and not medical advice.',
    '- If there is an emergency or urgent safety concern, call 911.',
    '- Do not share this link publicly. It includes your verification token.',
  ]
    .filter(Boolean)
    .join('\n');

  return { subject, html, text };
};

const sendViaResend = async (payload: EmailPayload, content: { subject: string; html: string; text: string }): Promise<EmailResult> => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  if (!apiKey || !from) return { ok: false, provider: 'resend', error: 'Resend not configured' };

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to: payload.to,
      subject: content.subject,
      html: content.html,
      text: content.text,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    return { ok: false, provider: 'resend', error: errorText || 'Resend request failed' };
  }

  const json = (await res.json()) as { id?: string };
  return { ok: true, provider: 'resend', id: json.id };
};

const sendViaSmtp = async (payload: EmailPayload, content: { subject: string; html: string; text: string }): Promise<EmailResult> => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !MAIL_FROM) {
    return { ok: false, provider: 'smtp', error: 'SMTP not configured' };
  }

  const nodemailer = await import('nodemailer');
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const result = await transporter.sendMail({
    from: MAIL_FROM,
    to: payload.to,
    subject: content.subject,
    text: content.text,
    html: content.html,
  });

  return { ok: true, provider: 'smtp', id: result.messageId };
};

export const handleEmailRequest = async (
  req: { method?: string; body?: unknown },
  res: { status: (code: number) => { json: (data: EmailResult) => void } },
  docLabel: 'Quote' | 'Agreement',
) => {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, provider: 'mock', error: 'Method Not Allowed' });
    return;
  }

  const { valid, error, payload } = validatePayload(getBody(req));
  if (!valid || !payload) {
    res.status(400).json({ ok: false, provider: 'mock', error: error || 'Invalid payload' });
    return;
  }

  const content = buildContent(payload, docLabel);

  try {
    const resendConfigured = Boolean(process.env.RESEND_API_KEY && process.env.MAIL_FROM);
    const smtpConfigured = Boolean(
      process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.MAIL_FROM,
    );

    if (resendConfigured) {
      const result: EmailResult = await sendViaResend(payload, content);
      if (isEmailFailure(result)) {
        console.error('Resend send failed', result.error);
      } else {
        res.status(200).json(result);
        return;
      }
    }

    if (smtpConfigured) {
      const result = await sendViaSmtp(payload, content);
      res.status(200).json(result);
      return;
    }

    if (!resendConfigured && !smtpConfigured) {
      console.log('[mock-email]', { ...payload, ...content });
      res.status(200).json({ ok: true, provider: 'mock' });
      return;
    }

    // If we reach here, both providers were configured but failed
    res.status(500).json({ ok: false, provider: 'mock', error: 'Email provider failed to send' });
  } catch (err) {
    console.error('Email send error', err);
    res.status(500).json({
      ok: false,
      provider: 'mock',
      error: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export type { EmailPayload, EmailResult };
