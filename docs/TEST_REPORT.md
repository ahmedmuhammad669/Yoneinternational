# Test report

## Automated local results

Release candidate tested on 2026-08-01.

| Check | Command | Current result |
|---|---|---|
| TypeScript | `npm run typecheck` | Pass |
| ESLint | `npm run lint` | Pass |
| Schema/security/bulk-import contracts | `npm test` | Pass — 11/11 |
| Rendered HTML smoke test | `npm run test:rendered` | Pass — 1/1 |
| Production build + artifact validation | `npm run build` | Pass |
| Dependency audit | `npm audit --omit=dev` | Pass — 0 vulnerabilities |
| Secret scan | `rg` credential patterns | Pass — no matches |

Contract tests apply every migration to an in-memory SQLite database, verify safe seeds, exercise quoted CSV parsing, and assert authorization, bulk-media limits/cleanup, draft-only blog imports, lifecycle, upload, form, security-header and crawlability controls.

## Remote/manual checks

The local Sites preview was inspected on Home, Products, RFQ, Contact, CEO Message and Privacy. Each had one H1, labelled form controls, image alt attributes, semantic main/footer landmarks and no horizontal overflow at the tested desktop viewport. Static image delivery was corrected and reverified.

Owner sign-in/logout, identity-header behavior, live D1/R2 bulk writes, email delivery, full Chrome/Edge/Firefox/Safari/mobile matrix, Lighthouse, axe, keyboard/screen-reader review, rate limiting under edge traffic, backup restore and final custom-domain behavior still require configured production operations. Never mark these passed without executing them.
