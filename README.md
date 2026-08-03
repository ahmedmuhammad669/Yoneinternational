# Yone International — Netlify + Supabase release

Production-oriented multilingual B2B website, RFQ system and protected Owner/Editor CMS for Yone International. Public pages use Next.js App Router and crawlable server-rendered HTML. PostgreSQL, authentication and private media use Supabase; hosting is configured for Netlify.

## Included

- English, American English, Arabic/RTL, German, Italian, Chinese, Japanese and Korean public routes
- Categories, products, media, blog, gallery, careers, SEO, settings and user administration
- Multi-product RFQ basket, full enquiry details, notes, assignment/status and CSV export
- Bulk product/catalog image and PDF uploads through private Supabase Storage
- Bulk Blog CSV import (up to 100 Draft articles per file)
- Passwordless Supabase admin login and one-time Owner setup
- Installable Android admin PWA with optional enquiry push notifications
- WhatsApp chat, X/Twitter, LinkedIn, Facebook, Instagram and downloadable catalog links

## Requirements

- Node.js 22.13+
- Netlify account/site
- Supabase project
- Optional Resend account for email notifications

Versions are locked in `package-lock.json`.

## Setup

1. Create a Supabase project. Open SQL Editor and run `supabase/migrations/0001_yone_international.sql`, followed by `0002_bulk_admin.sql`. Existing v15 deployments only need the second migration.
2. In Supabase Authentication, enable Email OTP/magic links. Add `https://YOUR-DOMAIN/auth/callback` to redirect URLs.
3. Copy the variable names from `.env.example` into Netlify → Site configuration → Environment variables. Never commit real values.
4. Set `OWNER_INVITE_EMAIL=yoneinternational@gmail.com` (or the approved Owner address). Do not put a password in code.
5. Deploy this folder through Git or Netlify CLI. Do not drag only `.next`; Netlify must build the source.
6. Visit `/admin/setup`, request the secure email link and activate the first Owner.
7. Open `/admin` on Android Chrome, choose **Add to Home screen**, then press **Enable enquiry notifications**.

For exact Netlify/Supabase steps see `docs/NETLIFY_DEPLOYMENT.md`. For mobile administration see `docs/MOBILE_ADMIN_APP.md`.

## Bulk administration

- **Admin → Media:** select up to 20 images/PDFs (50 MB combined). Files use signed, direct Supabase uploads and are verified server-side before records are committed.
- **Admin → Blog / News:** download the included CSV template and import up to 100 articles. Imports are always saved as Draft and must be reviewed before publication.

## Environment variables

- `NEXT_PUBLIC_SITE_URL`: canonical HTTPS origin
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase browser-safe project values
- `SUPABASE_SERVICE_ROLE_KEY`: server-only Storage key
- `DATABASE_URL`: Supabase direct/session-pooler PostgreSQL URL for server functions
- `SUPABASE_STORAGE_BUCKET`: normally `yone-media`
- `OWNER_INVITE_EMAIL`: approved first Owner email
- `RATE_LIMIT_SALT`: long random server-only string
- `RESEND_API_KEY`, `MAIL_FROM`, `NOTIFICATION_EMAIL`: optional email delivery
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`: optional web-push notifications

Generate VAPID keys locally with `npx web-push generate-vapid-keys`. Never expose the private key.

## Commands

```bash
npm ci
npm run dev
npm run typecheck
npm run lint
npm test
npm run build
npm audit --omit=dev
```

## Backup, restore and rollback

- Before migrations, take a Supabase database backup and copy the `yone-media` bucket.
- Test restores in a separate Supabase project, then point a Netlify preview deployment at it.
- Keep the previous Netlify deploy available. Roll back from Deploys → select prior successful deploy → Publish deploy.
- Restore the matching database/storage snapshot if a schema change is not backward compatible.

## Documentation

- `docs/NETLIFY_DEPLOYMENT.md`
- `docs/MOBILE_ADMIN_APP.md`
- `docs/ADMIN_GUIDE.md`
- `docs/PRODUCT_IMPORT_TEMPLATE.csv`
- `docs/SEO_CHECKLIST.md`
- `docs/INFORMATION_NEEDED.md`
- `docs/TEST_REPORT.md`
- `docs/FINAL_REVIEW.md`
