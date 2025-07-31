This is a TypeScript project structured as a monorepo using Yarn workspaces.

## Code Standards

The following files contain guidelines for the project:

- `/STYLE.md`: guidelines for code style.
- `/REVIEWING.md`: guidelines for pull requests.
- `/SECURITY.md`: guidelines for security.
- `/docs/architecture-decisions/`: contains the architecture decisions for the project.

## Development Flow

Before any of these commands can be run, you need to run `yarn install` in the project root.

- Build: There is no need to build the project during development, and it is verified automatically in the CI pipeline.
- Test: Use `yarn test <path>` in the project root to run tests. The path can be either a single file or a directory, and be omitted to run tests for all changed files.
- Type checking: Use `yarn tsc` in the project root to run the type checker.
- Code formatting: Use `yarn prettier --write <path>` to format code.
- Lint: Use `yarn lint --fix` in the project root to run the linter.
- API reports: Before submitting a pull request with changes to any package in the workspace, run `yarn build:api-reports` in the project root to generate API reports for all packages.

You MUST NOT create a release by running `yarn changesets version` or `yarn release` as part of any changes. Releases are created by separate workflows.

All changes that affect the published version of packages in the `/packages` and `/plugins` directories must be accompanied by a changeset. See the guidelines in `/REVIEWING.md` for information on how to write good changesets. Changesets are stored in the `/.changeset` directory. Breaking changes must be accompanied by a `minor` version bump for packages that below version `1.0.0`, or a `major` version bump for packages that are at version `1.0.0` or higher.

Never update ESLint, Prettier, or TypeScript configuration files unless specifically requested.

## Repository Structure

See `/docs/contribute/project-structure.md` for a detailed description of the repository structure.
