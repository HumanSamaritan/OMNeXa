# OMNeXa Vercel Website

A premium one-page consulting website for OMNeXa Pte. Ltd. built with Next.js App Router and ready for Vercel deployment.

## What is included

- Premium responsive landing page
- Services and six OMNeXa pillars
- Human + AI future-readiness section
- Founder / About section
- Client feedback / testimonials
- Contact form with name, email, phone, organisation, interest and message capture
- Server-side contact form email route using Resend

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Email setup with Resend

1. Create a Resend account.
2. Verify your sending domain, ideally `omnexagoc.com`.
3. Create an API key.
4. In `.env.local`, add:

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxx
CONTACT_TO_EMAIL=dhiraj.kumar@omnexagoc.com
CONTACT_FROM_EMAIL=OMNeXa Website <noreply@omnexagoc.com>
```

For production, add the same variables in Vercel:

`Project Settings` → `Environment Variables` → Add each key → Redeploy.

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. Log in to Vercel.
3. Click `Add New` → `Project`.
4. Import the GitHub repository.
5. Add the environment variables above.
6. Click `Deploy`.

## Custom domain

After deployment, in Vercel:

`Project Settings` → `Domains` → Add your domain, for example:

- `omnexagoc.com`
- `www.omnexagoc.com`

Then update DNS as instructed by Vercel.

## Files to customize

- `lib/site-data.ts` — services, testimonials, navigation, stats
- `app/page.tsx` — page structure
- `app/globals.css` — design system, colors and layout
- `app/api/contact/route.ts` — email logic

## Important note

The contact form will only send email after `RESEND_API_KEY` is configured and the sender domain is verified. Until then, the page can be deployed and viewed, but form submissions will return an email configuration message.
