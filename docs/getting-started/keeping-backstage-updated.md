---
id: keeping-backstage-updated
title: Keeping Backstage Updated
description: How to keep your Backstage App updated
---

Backstage is always improving, so it's a good idea to stay in sync with the
latest releases. Backstage is more of a library than an application or service;
similar to `create-react-app`, the `@backstage/create-app` tool gives you a
starting point that's meant to be evolved.

## Updating Backstage versions with backstage-cli

The Backstage CLI has a command to bump all `@backstage` packages and
dependencies you're using to the latest versions:
[versions:bump](https://backstage.io/docs/cli/commands#versionsbump).

```bash
yarn backstage-cli versions:bump
```

The reason for bumping all `@backstage` packages at once is to maintain the
dependencies that they have between each other.

## Following create-app template changes

The `@backstage/create-app` command creates the initial structure of your
Backstage installation from a **template**. The source of this template in the
Backstage repository is updated periodically, but your local `app` and `backend`
packages are established at `create-app` time and won't automatically get these
template updates.

For this reason, any changes made to the template are documented along with
upgrade instructions in the
[changelog](https://github.com/backstage/backstage/blob/master/packages/create-app/CHANGELOG.md)
of the `@backstage/create-app` package. We recommend peeking at this changelog
for any applicable updates when upgrading packages.

## More information on dependency mismatches

Backstage is structured as a monorepo with
[Yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/). This means
the `app` and `backend` packages, as well as any custom plugins you've added,
are separate packages with their own `package.json` and dependencies.

When a given dependency version is the _same_ between different packages, the
dependency is hoisted to the main `node_modules` folder in the monorepo root to
be shared between packages. When _different_ versions of the same dependency are
encountered, Yarn creates a `node_modules` folder within a particular package.

This can lead to confusing situations with type definitions, or anything with
global state. React [Context](https://reactjs.org/docs/context.html), for
example, depends on global referential equality. This can cause problems in
Backstage with API lookup, or config loading.

To help resolve these situations, the Backstage CLI has
[versions:check](https://backstage.io/docs/cli/commands#versionscheck). This
will validate versions of `@backstage` packages in your app to check for
duplicate definitions:

```bash
# Add --fix to attempt automatic resolution in yarn.lock
yarn backstage-cli versions:check
```
