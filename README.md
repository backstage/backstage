# backstage-plugins

A standalone monorepo for Backstage plugins published under the `@estehsaan` npm scope, following the same workspace pattern as [`backstage/community-plugins`](https://github.com/backstage/community-plugins).

## Packages

| Package | Version | Description |
|---------|---------|-------------|
| [`@estehsaan/backstage-plugin-onboarding`](./workspaces/onboarding/plugins/onboarding) | [![npm](https://img.shields.io/npm/v/@estehsaan/backstage-plugin-onboarding)](https://www.npmjs.com/package/@estehsaan/backstage-plugin-onboarding) | Frontend onboarding checklist plugin |
| [`@estehsaan/backstage-plugin-onboarding-backend`](./workspaces/onboarding/plugins/onboarding-backend) | [![npm](https://img.shields.io/npm/v/@estehsaan/backstage-plugin-onboarding-backend)](https://www.npmjs.com/package/@estehsaan/backstage-plugin-onboarding-backend) | Backend for the onboarding plugin |
| [`@estehsaan/backstage-plugin-onboarding-common`](./workspaces/onboarding/plugins/onboarding-common) | [![npm](https://img.shields.io/npm/v/@estehsaan/backstage-plugin-onboarding-common)](https://www.npmjs.com/package/@estehsaan/backstage-plugin-onboarding-common) | Shared types and permissions |

## Installation (for consumers)

```bash
# In your Backstage app
yarn --cwd packages/app add @estehsaan/backstage-plugin-onboarding

# In your Backstage backend
yarn --cwd packages/backend add @estehsaan/backstage-plugin-onboarding-backend
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for full contribution and publishing instructions.

## Repository Structure

```
workspaces/
  onboarding/              # workspace root (independent yarn workspace)
    plugins/
      onboarding/          # @estehsaan/backstage-plugin-onboarding
      onboarding-backend/  # @estehsaan/backstage-plugin-onboarding-backend
      onboarding-common/   # @estehsaan/backstage-plugin-onboarding-common
    package.json
```

## Development

```bash
# Install all dependencies
yarn install

# Type check
yarn tsc

# Build all packages
yarn build:all

# Run the frontend plugin dev server
cd workspaces/onboarding/plugins/onboarding
yarn start

# Run tests
yarn test
```

## Releasing

This repo uses [Changesets](https://github.com/changesets/changesets) for versioning and publishing.

### Creating a changeset

```bash
# From the repo root
yarn changeset
# Select the packages you've changed, pick a bump type, write a summary
# Commit the generated .changeset/*.md file
```

### Automated publishing via GitHub Actions

1. Open a PR with your change + a changeset
2. Merge the PR → the **Release** workflow creates a **"chore: version packages"** PR automatically
3. Merge that PR → packages are built and published to npm

> **First-time setup:** add an `NPM_TOKEN` secret to GitHub Actions — see [CONTRIBUTING.md#github-actions--npm_token](./CONTRIBUTING.md#github-actions--npm_token).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for commit conventions, branch naming, changeset workflow, and more.

## License

[Apache-2.0](./LICENSE)

