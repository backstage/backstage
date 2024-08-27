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
[versions:bump](https://backstage.io/docs/tooling/cli/03-commands#versionsbump).

```bash
yarn backstage-cli versions:bump
```

The reason for bumping all `@backstage` packages at once is to maintain the
dependencies that they have between each other.

By default the bump command will upgrade `@backstage` packages to the latest `main` release line which is released monthly. For those in a hurry that want to track the `next` release line which releases weekly can do so using the `--release next` option.

```bash
yarn backstage-cli versions:bump --release next
```

If you are using other plugins you can pass in the `--pattern` option to update
more than just the `@backstage/*` dependencies.

```bash
yarn backstage-cli versions:bump --pattern '@{backstage,roadiehq}/*'
```

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
for any applicable updates when upgrading packages. As an alternative, the
[Backstage Upgrade Helper](https://backstage.github.io/upgrade-helper/) provides
a consolidated view of all the changes between two versions of Backstage. You
can find the current version of your Backstage installation in `backstage.json`.

## More information on dependency mismatches

Backstage is structured as a monorepo with
[Yarn workspaces](https://classic.yarnpkg.com/en/docs/workspaces/). This means
the `app` and `backend` packages, as well as any custom plugins you've added,
are separate packages with their own `package.json` and dependencies.

When a given dependency version is the _same_ between different packages, the
dependency is hoisted to the main `node_modules` folder in the monorepo root to
be shared between packages. When _different_ versions of the same dependency are
encountered, Yarn creates a `node_modules` folder within a particular package.
This can lead to multiple versions of the same package being installed and used
in the same app.

All Backstage core packages are implemented in such as way that package
duplication is **not** a problem. For example, duplicate installations of
packages like `@backstage/core-plugin-api`, `@backstage/core-components`,
`@backstage/plugin-catalog-react`, and `@backstage/backend-plugin-api` are all
acceptable.

While package duplication might be acceptable in many cases, you might want to
deduplicate packages for the purpose of optimizing bundle size and installation
speed. We recommend using deduplication utilities such as `yarn dedupe` to trim
down the number of duplicate packages.

## Proxy

The Backstage CLI uses [global-agent](https://www.npmjs.com/package/global-agent) to configure HTTP/HTTPS proxy settings using environment variables. This allows you to route the CLI’s network traffic through a proxy server, which can be useful in environments with restricted internet access.

### Example Configuration

```bash
export GLOBAL_AGENT_HTTP_PROXY=http://proxy.company.com:8080
export GLOBAL_AGENT_HTTPS_PROXY=https://secure-proxy.company.com:8080
export GLOBAL_AGENT_NO_PROXY=localhost,internal.company.com
```
