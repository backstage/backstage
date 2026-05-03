# PROJECT_GUIDE.md

**Delivery:** Blitzy-customized Backstage fork — Four frontend feature enhancements
**Branch:** `blitzy-2c6e2e95-5d5a-444b-8758-c000f74a2fba`
**Merge-base:** `c952930aa2`
**Review status:** **APPROVED** by Principal Reviewer (see `CODE_REVIEW.md` §7.7)
**Date:** 2026-04-22

---

## 1. Purpose of This Guide

This guide is the top-level navigation index for everything that accompanies this four-feature Backstage delivery. It links:

1. The finalized code review record (`CODE_REVIEW.md`) — the authoritative multi-phase review log.
2. The Agent Action Plan (`blitzy/documentation/Technical Specifications.md`) — the binding source-of-truth specification.
3. The implementation summary (`blitzy/documentation/Project Guide.md`) — the hours-breakdown, compliance table, risk register, and production-readiness narrative.
4. The code-side entry points for each of the four features.
5. The operator-side prerequisites that must be completed before the delivery goes live in a user-facing environment.

All artifacts referenced below are committed to the working branch. The Principal Reviewer rendered a PASS verdict in `CODE_REVIEW.md` §7.7, and the delivery is production-ready for its agent-scoped code surface pending the operator-side prerequisites listed in §5 of this guide.

---

## 2. Code Review — Start Here

The authoritative record of the review pipeline is:

- **`CODE_REVIEW.md`** (repository root) — 2,374 lines — contains the YAML frontmatter tracking all eight phases and the full body for each phase.

The review was executed as an eight-phase sequential pipeline per the user's Refine PR instructions. Every phase reached a terminal APPROVED status. The table below is a quick-reference; refer to `CODE_REVIEW.md` for the complete evidence-based body of each phase.

| Phase | Domain                           | Agent                              | Status   | Anchor                                                                 |
| ----- | -------------------------------- | ---------------------------------- | -------- | ---------------------------------------------------------------------- |
| 0     | Setup & Domain Assignment        | (meta)                             | APPROVED | [§0.1–0.6](./CODE_REVIEW.md#phase-0--setup--domain-assignment)         |
| 1     | Infrastructure/DevOps            | Infrastructure/DevOps Expert Agent | APPROVED | [§1.1–1.7](./CODE_REVIEW.md#phase-1--infrastructuredevops-review)      |
| 2     | Security                         | Security Expert Agent              | APPROVED | [§2.1–2.13](./CODE_REVIEW.md#phase-2--security-review)                 |
| 3     | Backend Architecture             | Backend Architecture Expert Agent  | APPROVED | [§3.1–3.7](./CODE_REVIEW.md#phase-3--backend-architecture-review)      |
| 4     | QA/Test Integrity                | QA/Test Integrity Expert Agent     | APPROVED | [§4.1–4.9](./CODE_REVIEW.md#phase-4--qatest-integrity-review)          |
| 5     | Business/Domain                  | Business/Domain Expert Agent       | APPROVED | [§5.1–5.9](./CODE_REVIEW.md#phase-5--businessdomain-review)            |
| 6     | Frontend                         | Frontend Expert Agent              | APPROVED | [§6.1–6.11](./CODE_REVIEW.md#phase-6--frontend-review)                 |
| 7     | Principal Reviewer Consolidation | Principal Reviewer Agent           | APPROVED | [§7.1–7.9](./CODE_REVIEW.md#phase-7--principal-reviewer-consolidation) |

**Key verdicts from the Principal Reviewer (see `CODE_REVIEW.md` §7.7 for full evidence):**

- 9/9 numbered AAP Rules pass.
- 3/3 overarching AAP mandates pass (Feature 1 file scope, minimal change, `AboutField.gridSizes` backward compat).
- 16/16 per-story pass/fail criteria pass.
- 6/6 build gates pass.
- 32/32 in-scope unit tests pass.
- Zero code-quality findings (Critical, Major, or Minor).
- GxP/ALCOA+ applicability formally dispositioned NOT_APPLICABLE in Phase 5 §5.6.

---

## 3. Implementation Summary and Technical Specifications

Two accompanying documents in `blitzy/documentation/` provide the long-form implementation narrative:

### 3.1 `blitzy/documentation/Project Guide.md` (591 lines)

The hours-breakdown, compliance rule table, risk register, runtime validation summary, and production-readiness narrative for the four-feature delivery. Key sections:

- **§1 Executive Summary** — 100/120 hours completed (83.3%); 10 checkpoint accomplishments with exact LOC figures.
- **§2 Project Hours Breakdown** — 20 completed workstreams (100h) + 9 remaining operator-side items (20h).
- **§3 Test Results** — 211/211 catalog suite + 32/32 in-scope tests + zero TS errors + both builds green + lint EXIT=0.
- **§4 Runtime Validation & UI Verification** — cross-reference to the 95 responsive screenshots archived under `blitzy/screenshots/` (captured by Phase 4 QA).
- **§5 Compliance & Quality Review** — 9/9 AAP rules + minimal-change + security + accessibility all Pass with file:line evidence.
- **§6 Risk Assessment** — 12 distinct risks classified with severity, likelihood, and mitigation.
- **§7 Visual Project Status** — four Mermaid charts summarizing completion state.
- **§8 Summary & Recommendations** — Production-Ready verdict with HIGH confidence for agent-scoped code.
- **§9 Development Guide** — system prerequisites, environment setup, dependency installation, build gates, and `/github-api` proxy configuration snippet for the deployment operator.
- **§10 Appendices** — supporting tables and cross-references.

### 3.2 `blitzy/documentation/Technical Specifications.md` (860 lines)

The Agent Action Plan (AAP) for the delivery — the binding source-of-truth specification. Key sections:

- **§0.1 Intent Clarification** — four Core Feature Objectives with verbatim user-supplied specifications preserved (SVG palette, `visualMergeXs` pseudocode, SVG layout constants, `useEntitySourceUrl` hook skeleton).
- **§0.2 Repository Scope Discovery** — exhaustive file-by-file enumeration of the change surface.
- **§0.3 Dependency Inventory** — package registry, dependency manifest impact, import updates.
- **§0.4 Integration Analysis** — existing code touchpoints and integration data flow (Mermaid diagrams).
- **§0.5 Design System Compliance** — Tailwind utility classes + shadcn semantic tokens + MUI Dialog allowance.
- **§0.6 Technical Implementation** — file-by-file execution plan + implementation approach + UI design.
- **§0.7 Scope Boundaries** — exhaustively in-scope files + explicitly out-of-scope surfaces.
- **§0.8 Rules** — nine numbered rules (Rule 1 through Rule 9) plus three overarching mandates.
- **§0.9 Validation Framework** — unit tests + per-story criteria + ordered build gates + integration sign-off.
- **§0.10 References** — repository files searched, user-provided attachments, external documentation.

---

## 4. Implemented Features — Code Entry Points

All four features are delivered in a single pass. The files below are the entry points into each feature's implementation.

### 4.1 Feature 1 — `BlitzyProjectGraphCard` (SVG Swimlane)

**Plugin:** `@backstage/plugin-catalog-graph`

| File                                                                                          | Purpose                                                                                                                                                                                                                |
| --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `plugins/catalog-graph/src/alpha.tsx`                                                         | Extension registration with `name: 'relations'` (AAP Rule 6). Lines 30–57 declare `BlitzyProjectGraphEntityCard`; line 107 registers it in the `extensions: [...]` array.                                              |
| `plugins/catalog-graph/src/components/BlitzyProjectGraphCard/BlitzyProjectGraphCard.tsx`      | Main swimlane component (512 lines). 8 unconditional hooks followed by the Rule 9 null-return; fetch via `fetchApi.fetch('/api/proxy/github-api/repos/{owner}/{repo}/pulls?state=all&per_page=100')`; SVG render tree. |
| `plugins/catalog-graph/src/components/BlitzyProjectGraphCard/ProjectModal.tsx`                | MUI Dialog-based detail modal (366 lines). `isSafeHref` URL-scheme allow-list at line 52; state-color accent bar; imperative DOM style fixes for Tailwind scan-path gaps.                                              |
| `plugins/catalog-graph/src/components/BlitzyProjectGraphCard/visualMergeXs.ts`                | Pure function implementing the Rule 5 cap / uncapped merge-x algorithm (AAP §0.1.2).                                                                                                                                   |
| `plugins/catalog-graph/src/components/BlitzyProjectGraphCard/index.ts`                        | Named-export barrel: `export { BlitzyProjectGraphCard } from './BlitzyProjectGraphCard';`                                                                                                                              |
| `plugins/catalog-graph/src/components/BlitzyProjectGraphCard/BlitzyProjectGraphCard.test.tsx` | Jest test file covering the four mandated `visualMergeXs` cases (AAP §0.9.1).                                                                                                                                          |
| `plugins/catalog-graph/src/components/index.ts`                                               | Plugin barrel update: appends `export * from './BlitzyProjectGraphCard';` after the existing `EntityRelationsGraph` export.                                                                                            |

### 4.2 Feature 2 — About Card Redesign

**Plugin:** `@backstage/plugin-catalog`

| File                                                        | Purpose                                                                                                                                                           |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `plugins/catalog/src/components/AboutCard/AboutCard.tsx`    | Outer card shell. `DefaultAboutCardSubheader` / `<Separator />` / named unused imports removed.                                                                   |
| `plugins/catalog/src/components/AboutCard/AboutContent.tsx` | Description-first rendering (plain `<div>`, no label), conditional `Source` field from `useEntitySourceUrl`, `hideIcons` on all four `EntityRefLinks` call sites. |
| `plugins/catalog/src/components/AboutCard/AboutField.tsx`   | Horizontal flex row: `w-24` label column + `flex-1` value column. `gridSizes` retained in interface for backward compatibility but not consumed.                  |
| `plugins/catalog/src/components/AboutCard/hooks.ts`         | New `useEntitySourceUrl` hook (AAP §0.1.2 verbatim skeleton) with try/catch swallowing all SCM-resolution exceptions (Rule 7).                                    |

### 4.3 Feature 3 — Entity Links Card Redesign

**Plugin:** `@backstage/plugin-catalog`

| File                                                               | Purpose                                                                                                                        |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `plugins/catalog/src/components/EntityLinksCard/IconLink.tsx`      | Native `<a>` element (not Backstage `Link`) with Tailwind hover variants; `isSafeHref` URL-scheme allow-list gate at line 141. |
| `plugins/catalog/src/components/EntityLinksCard/LinksGridList.tsx` | `flex flex-col gap-2` vertical list container; `cols` prop retained in interface but not consumed.                             |

### 4.4 Feature 4 — Entity Labels Card Redesign

**Plugin:** `@backstage/plugin-catalog`

| File                                                                   | Purpose                                                                                                                                                                      |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `plugins/catalog/src/components/EntityLabelsCard/EntityLabelsCard.tsx` | Prefix-filter (`.filter(([k]) => !k.startsWith('backstage.io/'))`) + `flex flex-col gap-2` list + `EntityLabelsEmptyState` fallback + `Table`/`TableColumn` imports removed. |

---

## 5. Operator-Side Prerequisites

The Principal Reviewer identified three prerequisites that must be completed by the deployment operator before the delivery goes live in a user-facing environment. These are explicitly out-of-scope for the code delivery per AAP §0.7.2 and are NOT findings against the code. See `CODE_REVIEW.md` §7.7 for the full Principal Reviewer rationale and `blitzy/documentation/Project Guide.md` §9.5 for the configuration snippet.

### 5.1 GitHub API Proxy Endpoint

The `/github-api` proxy endpoint must be configured in `app-config.yaml` for the `BlitzyProjectGraphCard` to fetch live PR data. Until then, the card renders the sanitized error state "Could not load pull requests" (Phase 2 Checkpoint 2 fail-safe behavior).

Refer to `blitzy/documentation/Project Guide.md` §9.5 for the exact proxy configuration snippet the operator should add under `proxy.endpoints`.

### 5.2 Tailwind Content-Scan Paths

The `packages/app/` Tailwind configuration must scan the new files in:

- `plugins/catalog-graph/src/**`
- `plugins/catalog/src/components/{AboutCard,EntityLinksCard,EntityLabelsCard}/**`

Until then, a documented set of imperative DOM fixes (captured in `CODE_REVIEW.md` §6.4.4 / §6.5.2–6.5.3 / §6.7.1) covers the Tailwind-compile-gap at runtime. Updating the scan paths eliminates the need for those workarounds.

### 5.3 Brand Theme Tokens

The Blitzy fork's `globals.css` must emit the following semantic tokens:

- `--muted-foreground`
- `--border`
- `--foreground`
- `--accent`
- `--background`

These tokens are consumed by Tailwind utility classes in the redesigned components.

---

## 6. How to Run the Delivery Locally

See `blitzy/documentation/Project Guide.md` §9 for the full Development Guide. The abbreviated steps:

```bash
# From the repository root
corepack enable
yarn install --immutable
yarn tsc                                                   # emit declarations
yarn workspace @backstage/plugin-catalog-graph build       # build gate #3
yarn workspace @backstage/plugin-catalog build             # build gate #4
yarn workspace @backstage/plugin-catalog-graph test --watchAll=false --ci --maxWorkers=2
yarn workspace @backstage/plugin-catalog test --watchAll=false --ci --maxWorkers=2 \
  --testPathPatterns="AboutCard|EntityLinksCard|EntityLabelsCard|IconLink"
```

All six build gates (`CODE_REVIEW.md` §7.4.4) pass in the current HEAD.

---

## 7. Responsive Screenshot Archive

Phase 4 (QA/Test Integrity) archived 95 responsive screenshots under `blitzy/screenshots/` covering three viewports (1280×800 desktop, 768×1024 tablet, 375×667 mobile) for each of the four features. Refer to `CODE_REVIEW.md` §4.4 for the screenshot integrity disposition and §6.8.6 for the Frontend-domain cross-reference.

---

## 8. Known Pre-Existing Items (Informational)

The following items are pre-existing repository state, unchanged vs the merge-base commit `c952930aa2`, and explicitly out-of-scope per AAP §0.7.2. They are listed here for transparency only — they are NOT findings against this delivery.

| #   | Item                                                                                                             | Classification |
| --- | ---------------------------------------------------------------------------------------------------------------- | -------------- |
| I1  | 26 TypeScript errors in 20 out-of-scope files (MUI → shadcn migration state)                                     | Informational  |
| I2  | 2 pre-existing test failures (`CurveFilter.test.tsx`, `DirectionFilter.test.tsx` — Radix Select role migration)  | Informational  |
| I3  | 2 pre-existing lint warnings in `EntityLabelsEmptyState.tsx` / `EntityLinksEmptyState.tsx` (`<p>` element usage) | Informational  |

---

## 9. GxP / ALCOA+ Disposition

The user's Refine PR clause regarding GxP / ALCOA+ data-integrity principles, V-Model qualification sequencing, ICH Q9 confidence classification, and GAMP 5 Category 5 validation was formally dispositioned as **NOT_APPLICABLE** to this delivery in `CODE_REVIEW.md` Phase 5 §5.6. The four-feature Backstage frontend enhancement is not a regulated analytical deliverable intended to serve as qualification evidence in GMP, GLP, GCP, or equivalent regulated environments; all six applicability criteria evaluate to NO. The Principal Reviewer concurred in Phase 7 §7.5.

The NOT_APPLICABLE disposition is recorded in the YAML frontmatter of `CODE_REVIEW.md` (key: `gxp_alcoa_applicability`) and binds the delivery record.

---

## 10. Final Verdict

Per `CODE_REVIEW.md` §7.7 (Principal Reviewer):

> **VERDICT: PASS — PRODUCTION-READY FOR AGENT-SCOPED CODE**

The delivery is APPROVED for release to users pending the three operator-side prerequisites listed in §5 of this guide. No further code changes are required; no findings remain; no phase is deferred.

For any future work on this branch, refer to `CODE_REVIEW.md` first to understand the review pipeline contract, then to `blitzy/documentation/Technical Specifications.md` for the AAP-level specification, then to the file entry points in §4 of this guide for the code-side surface.
