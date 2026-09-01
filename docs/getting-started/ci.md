---
id: ci
title: Setting up CI
sidebar_label: Setting up CI
description: Configure continuous integration checks for your Backstage instance.
---

Audience: Developers and Admins

## Why CI matters for Backstage

A Backstage instance is a living project. As you add plugins, customize
configuration, and update dependencies, things can break in subtle ways: a
TypeScript error in one package, a config typo that prevents the backend
from starting, or a Docker image that no longer builds. Continuous
Integration (CI) catches these problems on every pull request, before they
reach production.

A good CI pipeline for Backstage verifies that:

- Code compiles and passes lint checks
- Tests pass across all packages in the monorepo
- Configuration files are valid
- The deployment artifact (typically a Docker image) builds successfully

## What to check

These checks apply regardless of which CI system you use. Most map to
commands provided by the Backstage CLI.

### Lint

```shell
yarn backstage-cli repo lint
```

Runs ESLint across all packages in the monorepo. This catches code quality
issues, unused imports, and style violations. See
[repo lint](../tooling/cli/module-lint.md#repo-lint) for available options.

### Type checking

```shell
yarn tsc:full
```

Runs the TypeScript compiler with `--skipLibCheck false` and
`--incremental false`, performing a complete type check across the entire
project. This is stricter than the default `yarn tsc` and catches type
errors that incremental builds might miss.

### Tests

```shell
yarn backstage-cli repo test
```

Runs the test suite for all packages. The Backstage CLI automatically
detects which test runner to use and handles monorepo-specific
configuration. See
[repo test](../tooling/cli/module-test.md#repo-test) for available
options.

### Deprecated API usage

```shell
yarn backstage-cli repo list-deprecations
```

Scans your code for usage of deprecated Backstage APIs. This is especially
useful when preparing for version upgrades, but running it in CI ensures
new code doesn't introduce deprecated patterns. See
[repo list-deprecations](../tooling/cli/module-maintenance.md#repo-list-deprecations)
for available options.

### Build

```shell
yarn build:all
```

Builds all packages in the monorepo, including the backend bundle that the
Dockerfile needs. Running the build in CI catches compilation errors,
missing dependencies, and broken imports that type checking alone might
not surface. See
[repo build](../tooling/cli/module-build.md#repo-build) for available
options.

### Configuration validation

```shell
yarn backstage-cli config:check --lax --strict \
  --config app-config.yaml \
  --config app-config.production.yaml
```

Validates your configuration files against the configuration schema. The
`--lax` flag allows environment variables to remain unresolved (useful in
CI where production secrets aren't available), while `--strict` ensures
the config structure matches the schema. Passing multiple `--config`
flags lets you validate your production configuration alongside the
default. See
[config:check](../tooling/cli/module-config.md#configcheck) for available
options.

### Docker build (optional)

```shell
yarn build-image
```

Verifies that the Docker image builds successfully. This script runs
`docker build` with the correct build context and Dockerfile path. It
catches issues like incompatible dependencies that only surface at
packaging time. This step expects pre-built backend bundles from
`yarn build:all`.

This step is optional. Docker builds can be slow, so some teams prefer to
run them only on merges to the default branch or on a scheduled basis
rather than on every pull request.

## GitHub Actions

If you created your Backstage instance with `create-app`, a GitHub Actions
workflow is included at `.github/workflows/ci.yml`. It runs all of the
checks above on every pull request.

Here's what the workflow does, step by step:

### Node.js and Yarn setup

The workflow installs Node.js 24.x and caches both `node_modules` and the
global Yarn cache. On subsequent runs, `yarn install --immutable` finishes
in seconds when the lockfile hasn't changed.

### CI steps

The pipeline runs these steps in order:

1. **Lint** -- checks code quality across all packages
2. **Type checking** -- full TypeScript compilation
3. **Deprecations** -- flags deprecated API usage
4. **Tests** -- runs the full test suite
5. **Build** -- builds all packages (`yarn build:all`)
6. **Config check** -- validates default and production configuration together
7. **Docker build** -- verifies the container image builds

Tests run before the full build to give faster feedback on the most common
failure mode. Build runs before the Docker build because the Dockerfile
expects pre-built backend bundles.

### Customizing the workflow

Common modifications:

- **Add a matrix strategy** to test on multiple Node.js versions (the
  template supports Node.js 22 and 24).
- **Add a deploy step** that pushes the Docker image to a registry when
  merging to your default branch.
- **Add end-to-end tests** using the included Playwright configuration
  (`yarn test:e2e`).

## Other CI systems

The same checks work in any CI system -- only the pipeline syntax changes.

### GitLab CI

```yaml
stages:
  - validate
  - build
  - test

default:
  cache:
    key:
      files:
        - yarn.lock
    paths:
      - node_modules/
      - .yarn/cache/

variables:
  CI: 'true'
  NODE_OPTIONS: '--max-old-space-size=8192'

lint:
  stage: validate
  script:
    - yarn install --immutable
    - yarn backstage-cli repo lint

type-check:
  stage: validate
  script:
    - yarn install --immutable
    - yarn tsc:full

build:
  stage: build
  script:
    - yarn install --immutable
    - yarn build:all

test:
  stage: test
  script:
    - yarn install --immutable
    - yarn backstage-cli repo test
```

### Jenkins

```groovy
pipeline {
  agent {
    docker {
      image 'node:24-slim'
    }
  }
  environment {
    CI = 'true'
    NODE_OPTIONS = '--max-old-space-size=8192'
  }
  stages {
    stage('Install') {
      steps {
        sh 'yarn install --immutable'
      }
    }
    stage('Lint') {
      steps {
        sh 'yarn backstage-cli repo lint'
      }
    }
    stage('Type check') {
      steps {
        sh 'yarn tsc:full'
      }
    }
    stage('Build') {
      steps {
        sh 'yarn build:all'
      }
    }
    stage('Test') {
      steps {
        sh 'yarn backstage-cli repo test'
      }
    }
    stage('Config check') {
      steps {
        sh 'yarn backstage-cli config:check --lax --strict --config app-config.yaml --config app-config.production.yaml'
      }
    }
  }
}
```

### Azure DevOps

> **Note:** YAML `pr:` triggers only work when your repo is hosted on
> GitHub or Bitbucket Cloud. If you use Azure Repos Git, configure a
> [branch policy for build validation](https://learn.microsoft.com/en-us/azure/devops/repos/git/branch-policies#build-validation)
> to run this pipeline on pull requests.

```yaml
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

variables:
  CI: 'true'
  NODE_OPTIONS: '--max-old-space-size=8192'

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: '24.x'
    displayName: use node.js

  - script: yarn install --immutable
    displayName: yarn install

  - script: yarn backstage-cli repo lint
    displayName: lint

  - script: yarn tsc:full
    displayName: type checking

  - script: yarn backstage-cli repo list-deprecations
    displayName: deprecations

  - script: yarn build:all
    displayName: build

  - script: yarn backstage-cli repo test
    displayName: tests

  - script: yarn backstage-cli config:check --lax --strict --config app-config.yaml --config app-config.production.yaml
    displayName: config check
```

### Key differences from GitHub Actions

- **Caching**: GitHub Actions has built-in cache actions. Other systems
  require you to configure cache paths and keys manually.
- **Docker-in-Docker**: Some CI systems require extra configuration to run
  `docker build` inside a pipeline. Check your platform's documentation
  for Docker support.
- **Environment variables**: Set `CI=true` and
  `NODE_OPTIONS=--max-old-space-size=8192` in your pipeline environment.
  The `CI` variable ensures deterministic behavior in tools like Jest, and
  the memory limit is explained below.

## Environment variables

Two environment variables are set in the generated workflow:

- **`CI=true`** -- Enables CI-specific behavior in tools like Jest (for
  example, running all tests instead of only changed ones) and prevents
  interactive prompts.
- **`NODE_OPTIONS=--max-old-space-size=8192`** -- Increases the Node.js
  heap memory limit to 8 GB. TypeScript compilation and bundling across a
  monorepo can exceed the default memory limit, especially as you add
  plugins. This setting prevents out-of-memory crashes during
  `yarn tsc:full` and `yarn build:all`.
