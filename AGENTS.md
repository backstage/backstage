# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Backstage is an open platform for building developer portals. This is a TypeScript monorepo using Yarn workspaces.

## Key Directories

- `/packages`: Core framework packages (prefixed `@backstage/`)
- `/plugins`: Plugin packages (prefixed `@backstage/plugin-*`)
- `/packages/app`: Main example app using the new frontend system
- `/packages/app-legacy`: Example app using the old frontend system
- `/packages/backend`: Example backend for local development
- `/docs`: Documentation files

Packages prefixed with `core-` (e.g., `@backstage/core-plugin-api`) are part of the old frontend system. Packages prefixed with `frontend-` (e.g., `@backstage/frontend-plugin-api`) are part of the new frontend system (NFS). Packages prefixed with `backend-` (e.g., `@backstage/backend-plugin-api`) are part of the backend system.

## Code Standards

The following files contain guidelines for the project:

- `/CONTRIBUTING.md`: comprehensive contribution guidelines.
- `/STYLE.md`: guidelines for code style.
- `/REVIEWING.md`: guidelines for pull requests and writing changesets.
- `/SECURITY.md`: guidelines for security.
- `/docs/architecture-decisions/`: contains the architecture decisions for the project.

When writing or generating code, always match the existing coding style of each individual package and file. Different packages in the monorepo may have different conventions — consistency within a package is more important than consistency across the repo.

When writing or generating tests, prefer fewer thorough tests with multiple assertions over many small tests. When using React Testing Library, prefer using `screen` and `.findBy*` queries over `waitFor`, and avoid adding test IDs to the implementation.

## Development Flow

Before any of these commands can be run, you need to run `yarn install` in the project root.

- Build: There is no need to build the project during development, and it is verified automatically in the CI pipeline.
- Test: Use `CI=1 yarn test <path>` in the project root to run tests. The path can be either a single file or a directory. Always provide a path, avoid running all tests.
- Type checking: Use `yarn tsc` in the project root to run the type checker. Do not try to run it somewhere else than the project root and do not supply any options.
- Code formatting: Use `yarn prettier --write <...paths>` to format code. Run it explicitly for file paths that you know are changed, not for entire folders - otherwise it may change formatting of unrelated files.
- Lint: Use `yarn lint --fix` in the project root to run the linter.
- API reports: Before submitting a pull request with changes to any package in the workspace, run `yarn build:api-reports` in the project root to generate API reports for all packages.
- Dev server: Use `yarn start` to run the example app locally (frontend on :3000, backend on :7007).
- Create: Use `yarn new` to scaffold new plugins, packages, or modules.

You MUST NOT run builds or create a release by running `yarn build`, `yarn changesets version`, or `yarn release` as part of any changes. Builds and releases are made by separate workflows.

All changes that affect the published version of packages in the `/packages` and `/plugins` directories must be accompanied by a changeset. Only non-private packages require changesets. See the guidelines in `/CONTRIBUTING.md#creating-changesets` for information on how to write good changesets. Changesets are stored in the `/.changeset` directory and should be created by writing changeset files directly — never use the changeset CLI. Breaking changes must be accompanied by a `minor` version bump for packages below version `1.0.0`, or a `major` version bump for packages at version `1.0.0` or higher. For non-breaking changes that introduce new APIs or features, use `minor` for packages at version `1.0.0` or higher, and `patch` for packages below `1.0.0`. Each changeset message should be relevant to the specific package it targets and written for Backstage adopters as the audience — avoid referencing internal implementation details. If a change spans multiple packages you often need to create separate changesets to make sure they are tailored to each package.

When creating pull requests, use the template at `/.github/PULL_REQUEST_TEMPLATE.md`.

Never update ESLint, Prettier, or TypeScript configuration files unless specifically requested.

Never make changes to the release notes in `/docs/releases` unless explicitly asked. These document past releases and should not be updated based on newer changes.

## Pre-Push Checklist (MANDATORY)

**Run every step below and confirm it passes before any `git push` or PR creation. Do not skip steps. If any step fails, fix the issue first and re-run from the top.**

For the **root Backstage monorepo**:

```bash
# 1. Sync dependencies
yarn install

# 2. Type check — zero errors required
yarn tsc

# 3. Prettier check on changed files — zero violations required
yarn prettier --check <changed-file-paths>

# 4. Lint — zero errors required
yarn lint --fix

# 5. Tests for affected paths — must pass
CI=1 yarn test <affected-paths>

# 6. API reports (if any public API changed)
yarn build:api-reports

# 7. Lockfile sanity — must succeed
yarn install --immutable
```

For **submodule plugin repos** (`backstage-plugin-techdocs-editor`, `backstage-plugin-onboarding`):

```bash
# From the submodule root

# 1. Immutable install — no YN0028 errors
yarn install --immutable

# 2. Type check
yarn tsc

# 3. Prettier check
yarn prettier:check

# 4. Build all packages
yarn build:all

# 5. Build API reports
yarn build:api-reports:only

# 6. Lint
yarn lint

# 7. Tests
yarn test
```

> **Rule:** Never call `git push` or any PR-creation tool until all seven steps pass with zero errors.

## Custom Onboarding Plugin

`plugins/backstage-plugin-onboarding` is a **git submodule** pointing to `github.com/Estehsan/backstage-plugin-onboarding`. Its packages are included in the root workspace via the `plugins/backstage-plugin-onboarding/workspaces/onboarding/plugins/*` glob in `package.json`.

Three packages under the `@estehsaan/` npm scope:

- `@estehsaan/backstage-plugin-onboarding` — Frontend (new frontend system, `/alpha` exports)
- `@estehsaan/backstage-plugin-onboarding-backend` — Backend (Express router + Knex DB + catalog processor)
- `@estehsaan/backstage-plugin-onboarding-common` — Shared types and permissions

**Integration in this repo:**

- Backend: wired via `backend.add(import('@estehsaan/backstage-plugin-onboarding-backend'))` in `packages/backend/src/index.ts`
- Frontend: import from `@estehsaan/backstage-plugin-onboarding/alpha` (currently commented out in `packages/app/src/App.tsx`)

When working on the onboarding plugin, see `plugins/backstage-plugin-onboarding/CLAUDE.md` for plugin-specific architecture, routes, config schema, and testing patterns. To update the submodule to a newer commit, use `git submodule update --remote plugins/backstage-plugin-onboarding`.

## Harness: Backstage Plugin Development

**Goal:** Coordinate techdocs-editor and onboarding plugin development through an architect → parallel implementation → QA team pipeline.

**Trigger:** Use the `backstage-plugin-dev` skill for any plugin development work — adding features, implementing endpoints, building components, adding providers. Simple code lookups or explanation questions can be answered directly without the skill.

**Change log:**
| Date | Change | Scope | Reason |
|------|--------|-------|--------|
| 2026-05-30 | Initial setup | All | Coordinate techdocs-editor + onboarding plugin development |

## Repository Structure

See `/docs/contribute/project-structure.md` for a detailed description of the repository structure.
