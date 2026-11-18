# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Clinical geneticists and genetic counsellors at a hospital, working at desk workstations during clinic hours in well-lit rooms. They review undiagnosed rare-disease cases, largely children, over long reading sessions of variant details and reports. Administrators manage accounts and see all cases; clinicians see only the patients assigned to them.

## Product Purpose

Decision support for diagnosing rare genetic disease: bring a patient's phenotypes (HPO terms), primary variant and clinical notes together, help the clinician reason about genotype–phenotype fit (including AI-generated analyses via Google Gemini), and produce a diagnostic report. Success is a clinician reaching a defensible diagnostic conclusion faster, with the evidence visible.

## Operating Context

- Case IDs follow the Undiagnosed Diseases Network style (`UDN-P4`); patients are identified by ID, not name.
- Work spans: case list → patient workspace (demographics, variant, phenotypes, genomic file) → analysis results / AI report and chat → PDF report.
- Case statuses: Pending Analysis, Results Ready, Reviewed. Variant classification follows ACMG terms (Pathogenic, Likely Pathogenic, …).
- Clinic in Ghana (Africa/Accra time); English UI.

## Capabilities and Constraints

- Next.js 16 app, Tailwind CSS 4 with semantic tokens in `src/app/globals.css`, shadcn/Radix components.
- Role-based access (admin, clinician, researcher, user); every patient access is audited.
- AI output is decision support, not diagnosis, and must read as such.
- Genomic file upload is browser preview only (no server ingestion yet).

## Brand Commitments

The name "Care4RareDiseases" ("Care for Rare") stays. No colours, logo or mark are fixed; the existing C4RD tile may change.

## Evidence on Hand

Ten seeded patient cases with real-format variant data (`data/care4rare.db`, git-ignored) and four historical reports. No testimonials, customers or outcome statistics exist; do not invent them.

## Product Principles

1. Evidence first: the variant, phenotypes and their fit are always more prominent than chrome.
2. Clinical seriousness with human warmth: these are children and families, not tickets, but nothing may feel toy-like.
3. Honest status: never show simulated progress, placeholder data or claims the system cannot back.
4. Calm for long sessions: readable for hours in a bright room; no neon, glow, or decorative gradients.

## Accessibility & Inclusion

WCAG 2.1 AA contrast for all text and controls; visible keyboard focus; state never conveyed by colour alone.
