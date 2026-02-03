Backstage is an open platform for building developer portals. This is a TypeScript monorepo using Yarn workspaces.

## Key Directories

- `/packages`: Core framework packages (prefixed `@backstage/`)
- `/plugins`: Plugin packages (prefixed `@backstage/plugin-*`)
- `/packages/app` and `/packages/backend`: Example app for local development
- `/packages/app-next`: Example app using the new frontend system (NFS)
- `/docs`: Documentation files

Packages prefixed with `core-` (e.g., `@backstage/core-plugin-api`) are part of the old frontend system. Packages prefixed with `frontend-` (e.g., `@backstage/frontend-plugin-api`) are part of the new frontend system (NFS). Packages prefixed with `backend-` (e.g., `@backstage/backend-plugin-api`) are part of the backend system.

## Code Standards

The following files contain guidelines for the project:

- `/CONTRIBUTING.md`: comprehensive contribution guidelines.
- `/STYLE.md`: guidelines for code style.
- `/REVIEWING.md`: guidelines for pull requests and writing changesets.
- `/SECURITY.md`: guidelines for security.
- `/docs/architecture-decisions/`: contains the architecture decisions for the project.

## Development Flow

Before any of these commands can be run, you need to run `yarn install` in the project root.

- Build: There is no need to build the project during development, and it is verified automatically in the CI pipeline.
- Test: Use `yarn test --no-watch <path>` in the project root to run tests. The path can be either a single file or a directory. Always provide a path, avoid running all tests.
- Type checking: Use `yarn tsc` in the project root to run the type checker.
- Code formatting: Use `yarn prettier --write <path>` to format code.
- Lint: Use `yarn lint --fix` in the project root to run the linter.
- API reports: Before submitting a pull request with changes to any package in the workspace, run `yarn build:api-reports` in the project root to generate API reports for all packages.
- Dev server: Use `yarn start` to run the example app locally (frontend on :3000, backend on :7007).
- Create: Use `yarn new` to scaffold new plugins, packages, or modules.

You MUST NOT create a release by running `yarn changesets version` or `yarn release` as part of any changes. Releases are created by separate workflows.

All changes that affect the published version of packages in the `/packages` and `/plugins` directories must be accompanied by a changeset. Only non-private packages require changesets. See the guidelines in `/CONTRIBUTING.md#creating-changesets` for information on how to write good changesets. Changesets are stored in the `/.changeset` directory. Breaking changes must be accompanied by a `minor` version bump for packages below version `1.0.0`, or a `major` version bump for packages at version `1.0.0` or higher.

Never update ESLint, Prettier, or TypeScript configuration files unless specifically requested.

## Repository Structure

See `/docs/contribute/project-structure.md` for a detailed description of the repository structure.

## Pull Request Reviews

When reviewing a pull request you MUST calculate a priority score between 0 and 100, where a higher score indicates higher priority. You MUST include the score as an HTML comment at the very beginning of the "PR Overview" section, using the following format: `<!-- priority: <score> -->`.

The score MUST be calculated as a sum of the following:

- **60% Guideline Adherence**: How well does the pull request follow the project guidelines in `/STYLE.md`, `/REVIEWING.md`, `/CONTRIBUTING.md`, and `/SECURITY.md`? A pull request that fully adheres to all guidelines scores 60 points, while one that violates multiple guidelines scores closer to 0.

- **40% Complexity**: How straightforward is the pull request? A simple bug fix or documentation update scores the full 40 points. A complex API change, new feature, or architectural modification scores closer to 0.

Higher priority pull requests (higher scores) are those that are both well-crafted according to project standards AND easy to review and merge quickly.
