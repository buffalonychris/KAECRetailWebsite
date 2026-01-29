# Reliable Elder Care – Retail Website

Public-facing retail website for Reliable Elder Care. Built with Vite, React, and TypeScript.

## Getting started

```bash
npm install
npm run dev
```

## Install prerequisites (npm registry 403)

This repo uses the public npm registry. If you see `npm ERR! 403` during install, your environment is likely pointing at a
private registry. Confirm with:

```bash
npm config get registry
```

It must resolve to `https://registry.npmjs.org/`. If it does not, set it before running installs:

```bash
npm config set registry https://registry.npmjs.org/
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
- `MAIL_FROM` (for example, `Reliable Elder Care <no-reply@yourdomain.com>`)

Optional SMTP fallback (used when Resend is unavailable):

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`

If no provider variables are present, the API routes return `provider: "mock"` and log payloads so preview deployments do not
break.

## Stripe Checkout (Home Security)

Set the following environment variables in Vercel (Project Settings → Environment Variables) to enable hosted Stripe
Checkout for the Home Security deposit step:

- `STRIPE_SECRET_KEY` (server-only, secret key from Stripe)
- `PUBLIC_SITE_URL` (public base URL, for example `https://reliableeldercare.com`)
- `STRIPE_WEBHOOK_SECRET` (optional, required to verify webhooks in production)

Local testing notes:

- Run API routes locally with the Vercel CLI (`vercel dev`) so `/api/create-checkout-session` and `/api/stripe-webhook`
  are available alongside the Vite frontend.
- Use Stripe test mode keys and card `4242 4242 4242 4242` with any future expiry and any CVC.
- If validating webhooks locally, run `stripe listen --forward-to localhost:3000/api/stripe-webhook` (adjust the port if
  your Vercel dev server uses a different one).

## Notes
- One-time, upfront pricing only; no subscriptions.
- Home Assistant is the sole control platform across packages.
- Offline-first messaging is emphasized throughout the site.

## SEO validation checklist
- Check `/robots.txt` and `/sitemap.xml` are served from production.
- For each route below, open "View Page Source" and confirm the `<meta name="robots">` matches the expected directive.

| Route | Expected robots |
| --- | --- |
| `/`, `/packages`, `/recommendation`, `/health-homes`, `/health-homes/outcomes`, `/health-homes/funding`, `/health-homes/packages`, `/health-homes/operations`, `/health-homes/pilot`, `/health-homes/packet`, `/health-homes/intake` | `index, follow` |
| `/quote`, `/quoteReview`, `/agreementReview`, `/payment`, `/schedule`, `/resume`, `/resume-verify` | `noindex, follow` |
| `/verify`, `/quotePrint`, `/agreementPrint`, `/uat`, `/certificate` | `noindex, nofollow` |

## Server-side robots validation

Use the following commands to confirm the X-Robots-Tag headers served from production:

```bash
curl -I https://reliableeldercare.com/quoteReview
curl -I "https://reliableeldercare.com/verify?doc=quote&t=test"
curl -I https://reliableeldercare.com/
```

Expected results:

- `/quoteReview` response includes `X-Robots-Tag: noindex, follow`.
- `/verify` response includes `X-Robots-Tag: noindex, nofollow` even with query params.
- The home page (`/`) response does not include an X-Robots-Tag header.
