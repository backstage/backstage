# Discovery: Backstage monorepo (run 20261028-feature-new-entity-former-names)

Built 2026-10-28T15:44:10Z by Tier 1 discovery (first-time, full scan). Plugin mmo 0.9.3.
Upcoming job (feature-new): remember an entity's former names in the catalog, and redirect old entity-page
and TechDocs links to the renamed entity, with a notice.

## Git state

- HEAD `f20fd9b598285c88401406b3812fe00d7708136c` on branch `BS-NF-12/opus55-plus-sonnet55` (a git worktree; toplevel equals cwd).
- Working tree: only `.sdlc/` is untracked. No user source changes.
- Remotes: `origin` https://github.com/tl-ai-labs/backstage.git, `upstream` https://github.com/backstage/backstage.git.
- `.gitignore` does **not** cover `.sdlc/` (`gitignore_covers_sdlc: false`).

## Directory topology

Top level: `.changeset/`, `.claude/`, `.cursor/`, `.devcontainer/`, `.github/`, `.husky/`, `.patches/`, `.storybook/`,
`.yarn/`, `beps/`, `contrib/`, `docs/`, `docs-ui/`, `microsite/`, `packages/` (74), `plugins/` (162), `scripts/`,
`workspaces/`, and a git-ignored `dist-types/`. 12,364 tracked files, so the full (unsampled) scan was used.

## Detected stacks

- `package.json` (root, private, `yarn@4.18.1`, node `22 || 24`, TypeScript `~5.7.0`): **node-typescript**.
  Frameworks: Backstage (React frontend, old `core-*` and new `frontend-*` systems; backend system on Express),
  Yarn workspaces (`packages/*`, `plugins/*`), Jest 30 via `backstage-cli repo test`.
- No other language manifests at root.

## Commands (from CLAUDE.md)

- Test: `CI=1 yarn test <path>` from repo root. Always pass a file or folder; never run every test.
- Type check: `yarn tsc` from repo root, with no options.
- Format: `yarn prettier --write <changed paths>` (only the files you changed). Lint: `yarn lint --fix`.
- API reports: `yarn build:api-reports` before a PR that touches a package.
- Never run: `yarn build`, `yarn changesets version`, `yarn release`. Never use the changeset CLI; edit `.changeset/*.md` directly.
- Precondition: `yarn install` has been run (`node_modules/` exists).

## Docs present

README.md (and 4 translations), `.claude/CLAUDE.md`, AGENTS.md, CONTRIBUTING.md, STYLE.md, REVIEWING.md, SECURITY.md,
ADRs in `docs/architecture-decisions/` (adr001-adr015; adr009 covers entity references),
`docs/contribute/doc-style-guide.md`, `docs/contribute/project-structure.md`, `.github/PULL_REQUEST_TEMPLATE.md`.

Project rules that matter for this job:

- New `.ts/.tsx/.js/.jsx` files need an Apache 2.0 header with the year 2026. Do not change the year on existing files.
- Match each package's own style.
- Published-package changes need changesets. Breaking changes: `minor` below 1.0.0, `major` at 1.0.0 or above.
  New features: `minor` at 1.0.0 or above, `patch` below 1.0.0. Check the 42 existing `.changeset/` entries first.
- New behaviour needs docs (TSDoc, a README, or `/docs`). Never edit `/docs/releases`.
- Never edit ESLint, Prettier or TypeScript config.
- Tests: prefer fewer, thorough tests. In React Testing Library tests, use `screen` and `findBy*`, and don't add test IDs.

## Detected AI/agent setup

- `.claude/` (`CLAUDE.md`, `settings.local.json`, `skills/` with `backstage-release-notes`, `catalog-db-performance.md`)
- `.cursor/rules/` (`backstage-project.mdc`, `tests/backend-test-utils.mdc`, `tests/test-utils.mdc`)
- `AGENTS.md` (same content as CLAUDE.md)
- `.github/copilot-instructions.md`
- None found: `.mcp.json`, `CLAUDE.local.md`, `.cursorrules`, Aider, `.continue/`, `.roo/`, `routing-policy.yaml`, gemini configs.

## Env keys

No `.env*` files exist. The code references 123 distinct `process.env.*` names, recorded in baseline.json by name only.
They include AWS/Azure/GitHub/Postgres/Backstage CLI names and Yarn's bundled release. No env values were read.

## Monorepo / submodules / LFS / infra

- Yarn workspaces monorepo (`packages/*`, `plugins/*`). Tests run per package with `CI=1 yarn test <package-path>`.
- Submodules: none. LFS: none. No `.gitattributes`.
- Infra: `docker-compose.deps.yml`, `.devcontainer/`, `.github/workflows/` (49 files). No Dockerfile at root, no terraform, GitLab CI, CircleCI or Jenkins.
- Generated code (do not hand-edit; regenerate from `openapi.yaml`):
  - `plugins/catalog-backend/src/schema/openapi/generated/`
  - `packages/catalog-client/src/schema/openapi/generated/`
  - 9 more tracked `*/generated/` folders
  - API report files (`report*.api.md`) come from `yarn build:api-reports`.

## Job-relevant locations

- **catalog-model** (`packages/catalog-model`, v1.10.2):
  - `src/entity/Entity.ts`, `src/entity/constants.ts` (well-known `ANNOTATION_*`), `src/location/annotation.ts`
  - `src/schema/EntityMeta.schema.json` and `Entity.schema.json`
  - `src/entity/ref.ts` (entity refs), `src/validation/`, `src/kinds/`
- **catalog-backend** (`plugins/catalog-backend`, v4.0.3-next.0):
  - REST router: `src/service/createRouter.ts` (`GET /entities/by-name/:kind/:namespace/:name` near line 423;
    also `/entities/by-refs`, `/entities/by-uid/:uid`, `/entities/by-query`).
  - OpenAPI spec: `src/schema/openapi.yaml`, plus the generated router in `src/schema/openapi/generated/`.
  - Entity reads: `src/service/DefaultEntitiesCatalog.ts`, `AuthorizedEntitiesCatalog.ts`, `src/catalog/types.ts`.
  - Tables: `src/database/tables.ts` (`DbRefreshStateRow`, `DbFinalEntitiesRow`, `DbSearchRow`, `DbRelationsRow`, ...).
  - Processing and stitching:
    - `src/database/DefaultProcessingDatabase.ts`
    - `src/database/operations/{refreshState,stitcher,relations}/`
    - `src/processing/DefaultCatalogProcessingEngine.ts`
    - `src/stitching/DefaultStitcher.ts`
  - Migrations: `migrations/*.js` (the latest is `20261007000000_stitch_failure_count.js`). There is also a
    `.claude/skills/catalog-db-performance.md` note.
  - Node extension points: `plugins/catalog-node`.
- **catalog-client** (`packages/catalog-client`, v1.16.3): `src/CatalogClient.ts` (`getEntityByRef` near line 468,
  `getEntitiesByRefs`), `src/types/api.ts` (the `CatalogApi` interface), and the generated client in `src/schema/openapi/generated/`.
- **plugin-catalog** (`plugins/catalog`, v2.0.11-next.0):
  - Old frontend system:
    - `src/components/CatalogEntityPage/{CatalogEntityPage.tsx,useEntityFromUrl.ts}` (loads the entity from `:namespace/:kind/:name`)
    - `src/components/EntityLayout/EntityLayout.tsx` (`NotFoundComponent`, around line 388)
    - `src/components/EntityNotFound/`
  - New frontend system:
    - `src/alpha/pages.tsx` (`catalogEntityPage`, path `/catalog/:namespace/:kind/:name`, near line 197)
    - `src/alpha/components/CatalogEntityPage.tsx` (reuses `useEntityFromUrl`)
    - `src/alpha/components/EntityLayout/EntityLayoutBui.tsx` (not-found branch, `entityPage.notFoundMessage`)
    - `src/alpha/translation.ts`
- **catalog-react** (`plugins/catalog-react`, v4.0.0-next.0): `src/routes.ts` (`entityRouteRef`), `src/hooks/useEntity.tsx`
  (`AsyncEntityProvider`), `src/translation.ts`, `src/components/EntityRefLink/`.
- **techdocs frontend** (`plugins/techdocs`, v1.19.1-next.0):
  - `src/routes.ts` (`rootDocsRouteRef`, `rootCatalogDocsRouteRef`), `src/Router.tsx`
  - `src/reader/components/TechDocsReaderPage/TechDocsReaderPage.tsx`, with `useExternalRedirect.ts`. This existing hook
    redirects via the `backstage.io/techdocs-entity` annotation, which makes it a good model for a rename redirect.
  - `src/reader/components/TechDocsRedirectNotification/` (an existing redirect notice component)
  - `src/reader/components/TechDocsNotFound.tsx`, `useReaderState.ts`
  - New frontend system: `src/alpha/components/TechDocsReaderPage.tsx`
  - `src/client.ts`, `src/translation.ts`. Also see `plugins/techdocs-react`.
- **techdocs-backend** (`plugins/techdocs-backend`, v2.4.1-next.0):
  - `src/service/router.ts` (`GET /metadata/techdocs/:namespace/:kind/:name`, `/metadata/entity/...`, `/sync/...`)
  - `src/service/CachedEntityLoader.ts`, `DocsSynchronizer.ts`
- **Docs**:
  - Software catalog: `docs/features/software-catalog/{well-known-annotations.md,descriptor-format.md,life-of-an-entity.md,api.md,references.md,configuration.md}`
  - TechDocs: `docs/features/techdocs/{how-to-guides.md,configuration.md,FAQ.md,architecture.md}` (these already describe redirects)
  - The `--old.md` variants cover the legacy frontend system.

## Coexistence risks

- You have Cursor rules at `.cursor/rules/`. The plugin will never touch them, but if you have Cursor's auto-lint running on save, changes we make may trigger it.
- You have Claude Code project config at `.claude/` (CLAUDE.md, settings.local.json, skills). It stays untouched.
- Your `.gitignore` doesn't cover `.sdlc/`. Run artifacts under `.sdlc/` (packets, backups, telemetry) will be untracked but visible to `git add -A`. Gate 0 will offer to add `.gitignore` (create if missing, append if present) to this run's allowlist so the plugin can add the entry as part of the run.
- Husky and lint-staged pre-commit hooks run eslint, prettier, docs-quality checks and catalog-info generation on commit.

## Regulated-repo signals

- `SECURITY.md` (kind: security-policy) at the repo root. This is the standard OSS policy for reporting vulnerabilities.
  No HIPAA/PCI/SOC2/GDPR/compliance folders, and no CODEOWNERS entries for security, compliance, privacy or legal teams.
  `regulated_repo_warning_required: true` by rule. The real risk looks low.

## Proposed off-limits

`.env`, `.env.*`, `.envrc`, `.claude/**`, `.cursor/**`, `.mcp.json`, `AGENTS.md`, `.github/copilot-instructions.md`,
`routing-policy.yaml`, `node_modules/**`, `dist/**`, `dist-types/**`, `dist-workspace/**`, `dist-storybook/**`,
`build/**`, `.next/**`, `target/**`, `vendor/**`, `third_party/**`, `**/src/schema/openapi/generated/**`
(regenerate from openapi.yaml rather than editing by hand), `.yarn/**`, `docs/releases/**`, `.git/**`, `.sdlc/**`.

## Adaptive stack profile (Tier 2b)

Triggered, but not built. The stack is TypeScript/React with the Backstage backend system, and the shipped adapters
cover only generic, nest and python. The orchestrator should run Tier 2b and write `.sdlc/baseline/stack-profile.md`.
Because CLAUDE.md asks for per-package style, sample from the job's packages (catalog-backend, catalog, catalog-react,
techdocs, techdocs-backend).
