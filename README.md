# Yone International production website

Database-backed B2B catalog, multi-product RFQ flow and protected Owner/Editor CMS for Yone International. Public pages are server-rendered through Next.js App Router/Vinext. Persistent records use Cloudflare D1 and public/private files use R2. The deployment target is OpenAI Sites; the existing Netlify site is not modified.

## Public languages

The public site includes server-rendered language routes and an accessible
language menu:

- English (`/`)
- American English (`/us`)
- Arabic with right-to-left layout (`/ar`)
- German (`/de`)
- Italian (`/it`)
- Simplified Chinese (`/zh`)
- Japanese (`/ja`)
- Korean (`/ko`)

Navigation, core company content, contact and RFQ interfaces are localized.
Administrator-entered product names, SKUs, specifications and approved editorial
content remain in their entered source language unless a verified translation is
provided, preventing technical claims from being changed automatically.

## Supported stack

- Node.js 22.13 or newer
- Next.js 16.2.12, React 19.2.6 and TypeScript 5.9.3
- Vinext 0.0.50 and Vite 8.0.13
- Drizzle ORM 0.45.2 with D1/SQLite migrations
- R2 object storage
- Dispatch-owned Sign in with ChatGPT plus a database Owner/Editor allowlist

Exact dependency versions are locked in `package-lock.json`.

## Configuration

Copy `.env.example` to the deployment environment and set values there. Never commit values.

- `NEXT_PUBLIC_SITE_URL`: canonical HTTPS origin
- `OWNER_INVITE_EMAIL`: comma-separated approved emails for the one-time
  first-Owner setup. Equivalent Gmail/Googlemail dot and `+tag` aliases are
  matched securely; other providers require an exact address.
- `RATE_LIMIT_SALT`: long random server-only value
- `RESEND_API_KEY`, `MAIL_FROM`, `NOTIFICATION_EMAIL`: optional server-side mail delivery; submissions remain in D1 if delivery is not configured

Do not add a Gmail password. D1 is bound as `DB` and R2 as `BUCKET` in `.openai/hosting.json`.

## Local development and checks

```bash
npm ci
npm run dev
npm run typecheck
npm run lint
npm test
npm run db:generate
```

The Sites lifecycle performs the authoritative production build during checkpoint deployment. `npm run build` is for targeted diagnosis.

## Database

Apply `drizzle/*.sql` in filename order. The safe seed creates editable top-level categories and public contact settings. It creates no products, jobs or testimonials, and certification mentions remain unverified Draft records.

For schema changes, edit `db/schema.ts`, run `npm run db:generate`, inspect the generated SQL, then test it against a disposable database before deployment.

## Secure first Owner

1. Set `OWNER_INVITE_EMAIL` to Mutahar’s approved invitation email or a
   comma-separated list of approved Owner identities.
2. Deploy with D1/R2 and environment variables configured.
3. Visit `/admin/setup` and sign in with an approved email.
4. Activate the one-time Owner invitation.
5. Setup closes after the first active Owner exists.
6. Add Editors/Owners from `/admin/users`. Sign-in identity and role authorization are both enforced server-side.

The application stores no password. Use the platform account’s MFA and session controls.

## Bulk administration

- **Media:** `/admin/media` accepts up to 20 validated files per batch, with a 50 MB combined limit and cleanup if persistence fails.
- **Blog:** `/admin/blog` imports up to 100 CSV rows as Draft articles. Download the included template from `/templates/blog-import-template.csv` and review every article before publication.

## Backup, restore and rollback

- D1: create an export/snapshot before schema changes and on the agreed backup schedule.
- R2: enable object versioning or scheduled replication where available.
- Restore: create a clean database, apply migrations, import the verified D1 export, restore R2 objects with their original keys, then test admin and public downloads.
- Rollback: select the prior saved Sites version and redeploy it. If a migration is not backward compatible, restore the matching D1 snapshot first.

Never test restore against production. Record the snapshot/version IDs and completion time in the operational log.

## Content and operations

See:

- `docs/ADMIN_GUIDE.md`
- `docs/PRODUCT_IMPORT_TEMPLATE.csv`
- `docs/SEO_CHECKLIST.md`
- `docs/INFORMATION_NEEDED.md`
- `docs/TEST_REPORT.md`
- `docs/FINAL_REVIEW.md`
