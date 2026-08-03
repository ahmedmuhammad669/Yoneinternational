# Replace the existing Netlify website

1. Unzip this release into a new local folder and push it to a private Git repository.
2. In Supabase SQL Editor run `supabase/migrations/0001_yone_international.sql`, then `supabase/migrations/0002_bulk_admin.sql`. If upgrading an existing v15 deployment, back it up and run only `0002_bulk_admin.sql`.
3. Copy the Supabase project URL, anon key, service-role key and PostgreSQL connection string into Netlify environment variables. Use the session pooler URL if direct IPv6 database connections are unavailable.
4. In Supabase Authentication → URL Configuration add the production and preview callback URLs ending in `/auth/callback`.
5. In the existing Netlify site open **Site configuration → Build & deploy → Continuous deployment → Link repository** and select the new repository/branch.
6. Confirm build command `npm run build`, publish directory `.next`, and Node `22.13.0`.
7. Trigger a deploy preview first. Test Home, Products, Contact, RFQ, `/admin/setup`, multi-file Media upload, Blog CSV import and the language menu.
8. Only after approval select the successful deploy and publish it to production. Netlify retains prior deploys for rollback.

Never upload `.env`, Gmail passwords, Supabase service-role keys or VAPID private keys into Git or the ZIP.

## Owner login

Set `OWNER_INVITE_EMAIL` before the first setup. Open `/admin/setup`, enter that email and use the one-time link sent by Supabase. After activation, login is at `/admin/login`. There is no default password.

## Product image upload

Open Admin → Media, choose up to 20 JPG/PNG/WebP files as **public images**, then copy the required media ID. The browser uploads directly with short-lived signed Supabase tickets; the server verifies each file before saving the database records. Open Admin → Products, enter the product details and that media ID as the primary image. Publish only verified product information.

## Blog bulk import

Open Admin → Blog / News, download the CSV template, and import up to 100 articles. Imported articles are always Draft. Review wording, sources, media and product claims before publishing.

## Catalog download

Upload a PDF as kind **catalog**, visibility **public**. The newest published catalog becomes the downloadable website catalog; the supplied Google Drive link remains the fallback.
