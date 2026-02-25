Backstage is an open platform for building developer portals. This is a TypeScript monorepo using Yarn workspaces.

## Key Directories

- `/packages`: Core framework packages (prefixed `@backstage/`)
- `/plugins`: Plugin packages (prefixed `@backstage/plugin-*`)
- `/packages/app` and `/packages/backend`: Example app for local development
- `/packages/app`: Main example app using the new frontend system
- `/packages/app-legacy`: Example app using the old frontend system
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

## Repository Structure

See `/docs/contribute/project-structure.md` for a detailed description of the repository structure.
