---
id: package-role-migration
title: Package Role Migration
description: Guide for how to migrate packages to use the new role utility
---

The Backstage CLI has introduced the concept of package roles, whose purpose is to
enable more powerful tooling, optimizations, and leaner package configuration. More background and
information about the change can be found in the [original RFC](https://github.com/backstage/backstage/issues/8729) and the [FAQ](#faq) on this page.

Package roles are implemented through a well-known `"backstage"."role"` field in the
`package.json` of each package. There are a handful of roles defined so far, and it
is not possible to use values outside the [set of predefined roles](../local-dev/cli-build-system.md#package-roles).

With roles in place in all packages, the Backstage CLI is able to automatically
determine how to handle each package. For example, the different build commands
have been replaced by a single one that instead knows how to build each role.
The test and lint configurations are also selected automatically based on the role, and
a new category of `repo` commands have been introduced in the CLI, which are able
to operate across all packages simultaneously.

Package roles have been used in the Backstage main repository for a while, and
we now recommend that all Backstage projects are migrated to use package roles.

## Migration

In order to make the migration as smooth as possible `@backstage/cli` provides
a number of migration utilities. Using these in combination with some manual review
and optional steps should be all you need to migrate to package roles in most projects.

Before you begin the migration, make sure you have updated to the most recent version of
the `@backstage/cli`.

### TL;DR, Step 1-4:

This is a shorter version of all of the steps below, in case you're in a hurry.

Run the following commands:

```sh
yarn backstage-cli migrate package-roles
yarn backstage-cli migrate package-scripts
yarn backstage-cli migrate package-lint-configs
```

Have a look at the new commands under `yarn backstage-cli repo`, and switch to them wherever you can. They tend to be much faster compared to their `lerna` equivalents.

### Step 1 - Add package roles

The first step is to add the `"backstage"."role"` field to each package. This can of course be done manually, but the following command will attempt to automatically detect the role of each package in your project:

```sh
yarn backstage-cli migrate package-roles
```

The automatic detection is not perfect, so it is recommended to manually review the
roles that were assigned to each package.
You can use the [package role definitions](../local-dev/cli-build-system.md#package-roles) as a reference.

### Step 2 - Migrate package scripts

The migration to package roles also introduces a new `package` command category to the CLI.
Each command under the `package` category is designed to be mapped directly to an entry in `"scripts"` in `package.json`. These commands replace the existing commands like `build`, `app:build`, `lint`, and `test`. They look something like this:

```json
{
  "scripts": {
    "start": "backstage-cli package start",
    "build": "backstage-cli package build",
    "lint": "backstage-cli package lint",
    ...
  }
}
```

Every package role has a fixed set of recommended scripts. It is strongly recommended that you use these scripts, as it allows for optimizations in other parts of the CLI. You can migrate to using all of these scripts by running the following command:

```sh
yarn backstage-cli migrate package-scripts
```

The migration command also carries over any existing flags that were being passed in the old scripts.

If you in the end do not want to use this exact script setup, it is still recommended to migrate to using the `package` commands, as the top-level commands will be deprecated and removed. If you don't want to use package roles either, you can pass an explicit role to some of the package commands, for example `yarn backstage-cli package build --role web-library`.

### Step 3 - Migrate package ESLint configurations

An area that has been simplified as part of the move to package roles is the ESLint configuration. Rather than having each package select which configuration they want (and getting it wrong), they now use a shared configuration factory that utilizes the package role. You can read more about the new configuration setup in the [build system documentation](../local-dev/cli-build-system.md#linting).

To migrate the ESLint configuration of all packages in your project, run the following command:

```sh
yarn backstage-cli migrate package-lint-configs
```

This will migrate all existing `.eslintrc.js` that extend the old configuration from `@backstage/cli`, as well as carry over any additional configuration.

### Step 4 - Use `backstage-cli repo`

The Backstage CLI recently introduced a new `repo` command category, which houses commands that operate on an entire monorepo at once. These commands work particularly well once packages have been migrated to use roles, as that allows for some very effective optimizations. It is typically much faster to use these commands compared to using tools like `lerna`, as they're able to avoid the overhead of calling package scripts through `yarn` and can operate on multiple packages at once. You can read more about the `repo` command in the [CLI command documentation](../local-dev/cli-commands.md#repo-build).

The way to execute this step of the migration is not as well defined as the previous steps, as it depends on what your development and CI/CD setup looks like. Look for the following patterns to replace in your root `package.json` as well as CI/CD setup:

- Commands that lint the entire repo should be replaced with `yarn backstage-cli repo lint` along with a `--since` flag if needed. For example this:

  ```sh
  lerna run lint --since origin/master --
  ```

  would be replaced by the following:

  ```sh
  backstage-cli repo lint --since origin/master
  ```

- In places where the entire repo is being built, use `yarn backstage-cli repo build`, which also supports the `--since` flag. The migration here is a bit more nuanced as it depends on why you are building all packages.
  - If you are building all packages to **verify** that you are able to build them, you most likely want `backstage-cli repo build --all`. The `--all` flag signals that bundled packages like `packages/app` and `packages/backend` should be built as well. Pair this up with a `--since` flag in CI to avoid needing to build all packages.
  - If you are building all packages to **publish** them, then `backstage-cli repo build` is enough, as it builds all published packages.
  - If you are building all packages to **deploy** them, you likely don't want to use the `repo` command at all, simply call `yarn build` in the packages you want to deploy instead. For example, if you are deploying the backend with a docker host build, it's enough to call `yarn build` inside `packages/backend`.

## FAQ

### Why were package roles introduced?

To keep configuration lean, allow for more utilities and tooling, and to enable optimizations in the build system. You can read more about the reasoning in the [original RFC](https://github.com/backstage/backstage/issues/8729).

### Do I have to migrate to using package roles?

Short answer - yes.

Longer answer - mostly, you can get around having to declare the role of your packages by instead explicitly declaring the role in the command invocation or configuration. For example, the `app:build` command will go away, but you can replace it with `package build --role frontend` if you don't want to declare the role in `package.json` . It is however strongly recommended to declare the package roles.

### I have a package where none of the existing roles apply

The `web-library`, `node-library` and `common-library` roles are general purpose roles that should cover most use cases. If you feel like none of those roles work for you, then please open an issue in the [Backstage repo](https://github.com/backstage/backstage) and suggest the addition of a new role.

### Should I include the role in published packages?

Yes. While there is nothing that will consume the role at the moment, it is likely that future tooling will be able to provide a better experience for users when published packages include the role.
