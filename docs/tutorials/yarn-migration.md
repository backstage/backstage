---
id: yarn-migration
title: Migration to Yarn 3
description: Guide for how to migrate a Backstage project to use Yarn 3
---

> NOTE: We do not yet recommend all projects to migrate to Yarn 3. Only do so if you have specific reasons for it.

While Backstage projects created with `@backstage/create-app` use [Yarn 1](https://classic.yarnpkg.com/) by default, it
is possible to switch them to instead use [Yarn 3](https://yarnpkg.com/). Tools like `yarn backstage-cli versions:bump` will
still work, as they recognize both lockfile formats.

## Migration

In addition to this guide, also be sure to check out the [Yarn migration guide](https://yarnpkg.com/getting-started/migration) as well.

### Ignore File Updates

First off, be sure to have the updated ignore entries in your app. These are included in all newly created projects, but might be missing in yours:

Add the following to `.gitignore`:

```gitignore
# Yarn 3 files
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions
```

And this to `.dockerignore`:

```gitignore
.yarn/cache
.yarn/install-state.gz
```

### Installation

Let's move on to the actual installation. We'd recommend making separate Git commits of most of these steps, in case you need to go back and debug anything. To install Yarn 3, run the following command in the project root:

```bash
yarn set version stable
```

We'll need the Yarn workspace tools plugin later on, so let's install that too:

```bash
yarn plugin import @yarnpkg/plugin-workspace-tools
```

Now we're ready to re-install all dependencies. This will update your `yarn.lock` and switch the project to use `node-modules` as the Yarn node linker.

In case you had a `.yarnrc` you can delete it now, but be sure to migrate over any options to `.yarnrc.yml`. See the [Yarn configuration docs](https://yarnpkg.com/configuration/manifest) for a full list of options. For example, `registry` is now `npmRegistryServer`, and `network-timeout` is `httpTimeout`.

### Migrate Usage

At this point you'll be all set up with Yarn 3! What remains is to migrate any usage of Yarn according to their [migration guide](https://yarnpkg.com/getting-started/migration). For example, any `yarn install --frozen-lockfile` commands should be replaced with `yarn install --immutable`.

You'll also need to update any `Dockerfile`s to add instructions to copy in your Yarn 3 installation into the image:

```Dockerfile
COPY .yarn ./.yarn
COPY .yarnrc.yml ./
```

The `--production` flag to `yarn install` has been removed in Yarn 3, instead you need to use `yarn workspaces focus --all --production` to avoid installing development dependencies in your production deployment. A tradeoff of this is that `yarn workspaces focus` does not support the `--immutable` flag.

```Dockerfile
RUN yarn workspaces focus --all --production && rm -rf "$(yarn cache clean)"
```

If you have any internal CLI tools in your project that are exposed through `"bin"` entries in `package.json`, then you'll need to add these packages as dependencies in your project root `package.json`. This is to make sure Yarn picks up the executables and makes them available through `yarn <executable>`.
