# Contributing

Thank you for contributing! This document explains the conventions used in this repository.

## Table of Contents

- [Commit Message Format](#commit-message-format)
- [Branch Naming](#branch-naming)
- [Creating a Changeset](#creating-a-changeset)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Developer Certificate of Origin](#developer-certificate-of-origin)
- [GitHub Actions & NPM_TOKEN](#github-actions--npm_token)
- [Local Development](#local-development)

---

## Commit Message Format

This repo follows the [Conventional Commits](https://www.conventionalcommits.org/) specification, consistent with the Backstage community.

```
<type>(<scope>): <short description>
```

### Types

| Type       | When to use                                      |
|------------|--------------------------------------------------|
| `feat`     | A new feature                                    |
| `fix`      | A bug fix                                        |
| `chore`    | Maintenance, dependency updates, tooling         |
| `docs`     | Documentation only changes                       |
| `refactor` | Code restructuring without behaviour change      |
| `test`     | Adding or improving tests                        |
| `ci`       | GitHub Actions / CI configuration changes        |
| `perf`     | Performance improvements                         |
| `build`    | Build system changes                             |

### Scope

Use the plugin or package name: `onboarding`, `onboarding-backend`, `onboarding-common`.

### Examples

```
feat(onboarding): add team assignment view
fix(onboarding-backend): handle null user in progress endpoint
chore: update @backstage dependencies to 1.35.0
docs(onboarding): add installation guide to README
test(onboarding-backend): add router integration tests
ci: add yarn caching to release workflow
```

---

## Branch Naming

Use `<type>/<short-description>` in kebab-case:

```
feat/add-team-view
fix/handle-missing-user
chore/update-backstage-deps
docs/improve-readme
ci/add-caching
```

---

## Creating a Changeset

Every PR that changes a published package **must** include a changeset. This drives automatic versioning and changelog generation.

```bash
# From the repo root
yarn changeset
```

You will be prompted to:
1. Select which packages changed
2. Choose a bump type: `patch` (bug fix), `minor` (new feature), `major` (breaking change)
3. Write a one-line summary of the change (this goes into the CHANGELOG)

Commit the generated `.changeset/*.md` file alongside your code changes.

### Bump type guide

| Change | Bump |
|--------|------|
| Bug fix, internal refactor | `patch` |
| New feature, non-breaking API addition | `minor` |
| Breaking API change | `major` |

---

## Pull Request Guidelines

- **PR title** must follow the same Conventional Commits format as commit messages.
- **Squash merge** is the default strategy — your commits will be squashed into one.
- Fill in the PR template fully.
- Keep PRs focused: one feature or fix per PR.
- For UI changes, attach before/after screenshots.

---

## Developer Certificate of Origin

All commits must be signed off to certify you wrote the change and have the right to contribute it:

```bash
git commit -s -m "feat(onboarding): add team view"
```

This adds a `Signed-off-by: Your Name <your@email.com>` line to the commit. See [developercertificate.org](https://developercertificate.org/) for the full text.

---

## GitHub Actions & NPM_TOKEN

The Release workflow automatically publishes to npm via [Changesets](https://github.com/changesets/changesets).

**One-time setup** (repo owner only):

1. Create an npm **granular access token**:
   - Go to [npmjs.com → Access Tokens](https://www.npmjs.com/settings/~/tokens)
   - Click **Generate New Token → Granular Access Token**
   - Set **Packages and scopes**: Read and write, scoped to `@estehsaan`
   - Enable **"Bypass 2FA for writes"** (required for CI automation)
   - Copy the token

2. Add the token to GitHub:
   - Go to **GitHub repo → Settings → Secrets and variables → Actions**
   - Click **New repository secret**
   - Name: `NPM_TOKEN`
   - Value: the token you copied

Once `NPM_TOKEN` is set, the workflow is fully automatic:

1. Open a PR with your change + a changeset → CI runs
2. Merge the PR → Release workflow creates a **"chore: version packages"** PR
3. Merge that PR → packages are built, versioned, and published to npm automatically

---

## Local Development

```bash
# Install all dependencies
yarn install

# Type check all packages
yarn tsc

# Build all packages
yarn build:all

# Lint all packages
yarn lint

# Run tests
yarn test

# Start the frontend plugin dev server
cd workspaces/onboarding/plugins/onboarding
yarn start
```
