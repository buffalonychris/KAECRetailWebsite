# KickAss Elder Care – Retail Website

Public-facing retail website for KickAss Elder Care. Built with Vite, React, and TypeScript.

## Getting started

```bash
npm install
npm run dev
```

## Quality checks

```bash
npm run lint
npm run build
```

## Email delivery (Vercel)

Set the following environment variables in Vercel (Project Settings → Environment Variables) to enable server-side email
delivery:

- `RESEND_API_KEY`
- `MAIL_FROM` (for example, `KickAss Elder Care <no-reply@yourdomain.com>`)

Optional SMTP fallback (used when Resend is unavailable):

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`

If no provider variables are present, the API routes return `provider: "mock"` and log payloads so preview deployments do not
break.

## Notes
- One-time, upfront pricing only; no subscriptions.
- Home Assistant is the sole control platform across packages.
- Offline-first messaging is emphasized throughout the site.
