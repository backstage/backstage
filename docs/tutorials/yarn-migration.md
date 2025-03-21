---
id: yarn-migration
title: Migration to Yarn 4
description: Guide for how to migrate a Backstage project to use Yarn 4
---

Backstage projects created with `@backstage/create-app` now use [Yarn 4](https://yarnpkg.com/), you may have a previous version of Backstage that is still using [Yarn 1](https://classic.yarnpkg.com/) that you'll want to migrate, this tutorial will help you with this task.

## Migration

In addition to this guide, also be sure to check out the [Yarn migration guide](https://yarnpkg.com/getting-started/migration) as well.

### Ignore File Updates

First off, be sure to have the updated ignore entries in your app. These are included in all newly created projects, but might be missing in yours:

Add the following to `.gitignore`:

```gitignore
# Yarn files
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

Let's move on to the actual installation. We'd recommend making separate Git commits of most of these steps, in case you need to go back and debug anything. To install Yarn 4, run the following command in the project root:

```bash
yarn set version 4.x
```

:::note

If the above command doesn't work then you may need to run `yarn set version latest` but use this with caution as it may take you to a version beyond Yarn 4

:::

We'll need the Yarn workspace tools plugin later on, so let's install that too:

```bash
yarn plugin import @yarnpkg/plugin-workspace-tools
```

Now we're ready to re-install all dependencies. This will update your `yarn.lock` and switch the project to use `node-modules` as the Yarn node linker.

In case you had a `.yarnrc` you can delete it now, but be sure to migrate over any options to `.yarnrc.yml`. See the [Yarn configuration docs](https://yarnpkg.com/configuration/manifest) for a full list of options. For example, `registry` is now `npmRegistryServer`, and `network-timeout` is `httpTimeout`.

### Migrate Usage

At this point you'll be all set up with Yarn 4! What remains is to migrate any usage of Yarn according to their [migration guide](https://yarnpkg.com/getting-started/migration). For example, any `yarn install --frozen-lockfile` commands should be replaced with `yarn install --immutable`.

You'll also need to update any `Dockerfile`s to add instructions to copy in your Yarn 4 installation into the image:

```Dockerfile
COPY .yarn ./.yarn
COPY .yarnrc.yml ./
```

In a multi-stage `Dockerfile`, each stage that runs a `yarn` command will also need the Yarn 4 installation. For example, in the final stage you may need to add the following:

```Dockerfile
COPY --from=build --chown=node:node /app/.yarn ./.yarn
COPY --from=build --chown=node:node /app/.yarnrc.yml  ./
```

The `--production` flag to `yarn install` has been removed in Yarn 4, instead you need to use `yarn workspaces focus --all --production` to avoid installing development dependencies in your production deployment. A tradeoff of this is that `yarn workspaces focus` does not support the `--immutable` flag.

```Dockerfile
RUN yarn workspaces focus --all --production && rm -rf "$(yarn cache clean)"
```

Additionally, `yarn config` has been reworked from being able to store any arbitrary key-value pairs to only supporting a handful of predefined pairs. Previously, we would set our preferred `python3` interpreter to work around [any issues related to node-gyp](https://github.com/backstage/backstage/issues/11583) so we need to provide an appropriate substitute.

```Dockerfile
# highlight-add-start
# Set Python interpreter for `node-gyp` to use
ENV PYTHON=/usr/bin/python3
# highlight-add-end

# Install sqlite3 dependencies. You can skip this if you don't use sqlite3 in the image,
# in which case you should also move better-sqlite3 to "devDependencies" in package.json.
RUN apt-get update && \
    apt-get install -y --no-install-recommends libsqlite3-dev python3 build-essential && \
    # highlight-remove-start
    rm -rf /var/lib/apt/lists/* && \
    yarn config set python /usr/bin/python3
    # highlight-remove-end
    # highlight-add-next-line
    rm -rf /var/lib/apt/lists/*
```

You'll want to make sure that the `PYTHON` environment variable is declared relatively early, before any instances of `Yarn` are invoked as `node-gyp` is indirectly triggered by some modules during installation.

If you have any internal CLI tools in your project that are exposed through `"bin"` entries in `package.json`, then you'll need to add these packages as dependencies in your project root `package.json`. This is to make sure Yarn picks up the executables and makes them available through `yarn <executable>`.
