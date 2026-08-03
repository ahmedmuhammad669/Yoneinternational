# Release test report

Local release run on 2026-08-01:

| Check | Command | Release requirement |
|---|---|---|
| TypeScript | `npm run typecheck` | Pass — no errors |
| ESLint | `npm run lint` | Pass — no errors |
| Contract tests | `npm test` | Pass — 10/10, including Blog CSV parsing/import contracts and secure Media bulk-upload contracts |
| Production build | `npm run build` | Pass — Next.js 16.2.12 production build |
| Dependency audit | `npm audit --omit=dev` | Pass — 0 vulnerabilities reported |
| ZIP integrity | `unzip -t FILE.zip` | Recorded after packaging |

Not run without the owner’s configured external accounts: real Supabase magic-link delivery, live PostgreSQL/Storage integration (including signed bulk uploads), Netlify domain publication, Resend delivery, Android push receipt, Lighthouse field data, cross-device/browser matrix, and backup restore drill. Follow the exact deployment and mobile guides to complete those checks on staging before replacing production.
