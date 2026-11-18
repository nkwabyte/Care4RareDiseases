# Care4RareDiseases — Security & UI Improvement Plan

Status legend: `[ ]` todo · `[x]` done · `[~]` needs owner action (cannot be done in code)

## Phase 0 — Dependencies
- [x] Upgrade all dependencies to latest (TypeScript held at 6.0.3: typescript-eslint does not support TS 7 yet)
- [x] Remove unused native `bcrypt`
- [x] Port shadcn `chart`, `calendar`, `resizable` wrappers to recharts 3 / react-day-picker 10 / react-resizable-panels 4

## Phase 1 — Critical security
Goal: no unauthenticated or cross-patient access; no secrets or PHI in the repository.

- [x] **Sessions**: replace JWT cookies with opaque random tokens. Store only the SHA-256 hash in `sessions.token_hash`. Absolute expiry 8h, idle timeout 30 min. Cookie: `httpOnly`, `secure` (prod), `sameSite=strict`, `__Host-` prefix in production.
  - Removes `JWT_SECRET` and its hardcoded fallback entirely; removes `jose`.
- [x] **Single identity model**: drop the empty legacy `doctors` table and its login fallback (its IDs collided with `users.id`). `doctor_patient_assignments.doctor_id` → references `users.id`, unique on (doctor, patient). Backfill assignments from `patients.assigned_clinician`.
- [x] **Authorization layer** (`src/lib/auth/`, `server-only`): `requireUser()`, `accessiblePatientIds()`, `assertPatientAccess()`.
  - Policy: `admin` → all patients; `clinician` → assigned patients only; `researcher`/`user` → none.
  - Applied to every patient, report and AI server action.
- [x] **AI actions**: require auth + patient access. Server builds patient context from the DB (never from client-supplied data). Cap chat history/message size. Patient data passed as delimited data under a system instruction (prompt-injection mitigation).
- [x] **Login**: generic errors, constant-time behaviour for unknown emails, remove demo credentials and the false "encrypted / HIPAA compliant" claim from the login page.
- [x] **Repo hygiene**: untrack `secrets.zip` and `data/*.db*`, extend `.gitignore`, delete `debug-login.ts` and obsolete `migrate-sessions.ts`, seed passwords from env (or random, printed once).
- [x] Proper migration runner (`yarn db:apply`), baselining the existing untracked DB.
- [~] **Owner action**: reset local account passwords (`yarn user:set-password <email>`); they are still the previously published defaults.
- [~] **Owner action**: rotate the Gemini API key, purge `secrets.zip` and `data/` from git history (`git filter-repo`), force-push, have collaborators re-clone.

## Phase 2 — Hardening
- [x] `proxy.ts`: optimistic redirect for unauthenticated users on protected routes; nonce-based CSP.
- [x] Security headers: HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `frame-ancestors 'none'`; disable `X-Powered-By`.
- [x] Login rate limiting / lockout (per email and per IP).
- [x] zod validation on every server action input.
- [x] Audit log (`audit_events`): logins, patient views, AI generation, report generation, status changes.
- [x] Settings screen: remove fake 2FA / session-timeout controls; show the real, enforced policy instead.
- [x] Working **change password** (revokes other sessions) and **sign out everywhere**; profile/role read-only; unimplemented sections disabled and labelled.
- [x] Login page surfaces errors (previously swallowed; button stuck on "Signing in…") and honours a safe `?next=` redirect.

## Phase 3 — UI / UX
- [x] Dashboard driven by real, access-scoped data (stats, monthly reports, status breakdown, top genes, pending cases, recent activity from audit log). Remove hardcoded chart data.
- [x] Sidebar: real `<Link>`s with `aria-current`, visible tooltips for icon-only nav, focus styles.
- [x] Genomic upload: replace simulated `setTimeout` "processing" with real client-side parsing and an honest preview. Replaced the template that put mock Parkinson's data under real patient ID UDN-P4.
- [x] Database screen showed the *viewer's* name as every patient's assigned clinician; now shows the real assignment.
- [x] Fixed the theme: all semantic tokens compiled to invalid colours (transparent cards, no hover/focus highlight in menus/selects). WCAG AA contrast verified; `text-slate-500` (failed AA) replaced.
- [x] Design tokens: replace hardcoded hex colours with semantic theme tokens; fix stale light-theme values in `globals.css`.
- [x] Server root layout with `metadata` (done in Phase 2 for CSP), `autocomplete` on login fields.
- [x] App icon (fixes favicon 404).
- [x] Lint: 0 errors. The 5 remaining warnings are all in unused vendored components (`ui/carousel`, `ui/sidebar`, `ui/use-mobile`, `common/ImageWithFallback`) — candidates for deletion.

## Phase 4 — Verification & docs
- [x] `tsc`, `eslint`, `next build` clean.
- [x] Browser checks: admin vs clinician see different patient sets; clinician cannot open another clinician's patient by URL; logged-out users redirected; response headers present.
- [x] Unauthenticated server-action call to AI endpoints is rejected (HTTP-level action tests).
- [x] Update README / ARCHITECTURE (they still describe API routes and JWT sessions).
