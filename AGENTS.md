---
alwaysApply: true
---

Backstage is an open platform for building developer portals. This is a TypeScript monorepo using Yarn workspaces.

## Key Directories

- `/packages`: Core framework packages (prefixed `@backstage/`)
- `/plugins`: Plugin packages (prefixed `@backstage/plugin-*`)
- `/packages/app`: Main example app using the new frontend system
- `/packages/app-legacy`: Example app using the old frontend system
- `/packages/backend`: Example backend for local development
- `/docs`: Documentation files

Packages prefixed with `core-` (e.g., `@backstage/core-plugin-api`) are part of the old frontend system. Packages prefixed with `frontend-` (e.g., `@backstage/frontend-plugin-api`) are part of the new frontend system. Packages prefixed with `backend-` (e.g., `@backstage/backend-plugin-api`) are part of the backend system.

## Writing Standards

Changes to the docs should follow the documentation style guide at `/docs/contribute/doc-style-guide.md`.

## Code Standards

The following files contain guidelines for the project:

- `/CONTRIBUTING.md`: comprehensive contribution guidelines.
- `/STYLE.md`: guidelines for code style.
- `/REVIEWING.md`: guidelines for pull requests and writing changesets.
- `/SECURITY.md`: guidelines for security.
- `/docs/architecture-decisions/`: contains the architecture decisions for the project.

All new source files (`.ts`, `.tsx`, `.js`, `.jsx`) must include an Apache 2.0 copyright header with the current year. This does not apply to generated files, configuration files (JSON, YAML), or documentation files. Do NOT update the copyright year on existing files — leave the original year as-is.

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

Changes that affect the published version of non-private packages in `/packages` and `/plugins` must have appropriate changeset coverage for the upcoming release. Changes outside these directories (for example, `.patches/`, `.github/`, `docs/`, root config files), private packages, and test-only changes do not require changesets. Release coverage does not necessarily require a new changelog entry: existing changesets can already cover the affected packages and behavior. See `/CONTRIBUTING.md#creating-changesets` for further guidance. Inspect, create, and update files in `/.changeset` directly — never use the changeset CLI, including for inspection.

Changesets describe the final adopter-facing changes in the upcoming release relative to the last release, not the sequence of commits or PRs or the difference from a parent branch. Before adding a changeset, inspect existing changesets for the affected packages, including those inherited from a parent PR. When refining unreleased work, update its existing changesets where needed; do not add separate changesets merely because the refinement is in another commit, branch, or stacked PR. If existing changesets already describe the final behavior accurately and cover the affected published packages, leave them unchanged. Internal refactoring, compatibility plumbing, and test infrastructure supporting an already-described change should not receive separate changelog entries unless they introduce a distinct adopter-facing change.

Breaking changes must be accompanied by a `minor` version bump for packages below version `1.0.0`, or a `major` version bump for packages at version `1.0.0` or higher. For non-breaking changes that introduce new APIs or features, use `minor` for packages at version `1.0.0` or higher, and `patch` for packages below `1.0.0`.

Each changeset message should be relevant to every package it names and written for Backstage adopters — describe user-facing behavior changes in plain language. Never reference internal implementation details such as function names, class names, variable names, or other code symbols that are not part of the public API. Use separate changesets when packages need different messages, while reusing existing changesets for unreleased work as described above.

Changes that introduce new features or modify existing behavior must include documentation updates. Documentation should be placed in [TSDoc](https://tsdoc.org) comments, the package README, or within the `/docs` folder, whichever is most appropriate. Documentation should follow the style guide at `/docs/contribute/doc-style-guide.md`.

Before creating a pull request, check whether there is already an open PR for the same change to avoid duplicating effort.

When creating pull requests, use the template at `/.github/PULL_REQUEST_TEMPLATE.md`. Do NOT erase or replace the template — fill it in and only check items on the checklist that have actually been completed. PR descriptions should be short and concise. If there are extensive details to share (design rationale, migration context, investigation notes), suggest opening a GitHub issue and linking to it from the PR instead. If the PR is related to an existing issue, link to it in the PR description.

Never update ESLint, Prettier, or TypeScript configuration files unless specifically requested.

Never make changes to the release notes in `/docs/releases` unless explicitly asked. These document past releases and should not be updated based on newer changes.

## Repository Structure

See `/docs/contribute/project-structure.md` for a detailed description of the repository structure.
