---
id: npx-create-app
sidebar_label: 001 - Scaffolding
title: '001 - Scaffolding'
description: How to scaffold a new Backstage app using create-app
---

Audience: Developers and Admins

:::note
It is not required, although recommended to have a basic understanding of [Yarn](https://www.pluralsight.com/guides/yarn-a-package-manager-for-node-js) and [npm](https://docs.npmjs.com/about-npm) before starting this guide.
:::

## Summary

This guide walks through how to create your own customizable
[Backstage app](../../overview/what-is-backstage.md). This is the first step in
evaluating, developing on, or demonstrating Backstage.

By the end of this guide, you will have a standalone Backstage installation
running locally with a SQLite database and demo catalog content.

:::caution[Organization customization]

To be clear, this is not a production-ready installation, and it does not
contain information specific to your organization. Later Golden Paths cover
customization, plugin development, and deployment.

:::

## Prerequisites

This guide also assumes a basic understanding of working on a Linux based operating system and have some experience with the terminal, specifically, these commands: `npm`, `yarn`.

- Access to a Unix-based operating system, such as Linux, macOS or
  [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/)
- A GNU-like build environment available at the command line.
  For example, on Debian/Ubuntu you will want to have the `make` and `build-essential` packages installed.
  On macOS, you will want to have run `xcode-select --install` to get the XCode command line build tooling in place.
- An account with elevated rights to install the dependencies
- `curl` or `wget` installed
- Node.js [Active LTS Release](../../overview/versioning-policy.md#nodejs-releases) installed using one of these
  methods:
  - Using `nvm` (recommended)
    - [Installing nvm](https://github.com/nvm-sh/nvm#install--update-script)
    - [Install and change Node version with nvm](https://nodejs.org/en/download/package-manager/#nvm)
    - Install the current Active LTS release with `nvm install --lts`.
  - [Binary download](https://nodejs.org/en/download/)
  - [Package manager](https://nodejs.org/en/download/package-manager/)
  - [Using NodeSource packages](https://github.com/nodesource/distributions/blob/master/README.md)
- `yarn` [Installation](https://yarnpkg.com/getting-started/install)
  - Run `corepack enable`; the generated project selects its supported Yarn version.
- `git` [installation](https://github.com/git-guides/install-git)

## Scaffold your new Backstage app

## 1. Create your Backstage App

To scaffold your new Backstage app, we'll be running an interactive command. Before you run the command, you should open a terminal and move your current working directory somewhere you're comfortable creating a new directory.

The wizard for this command will ask what name you want to have for your new app. That name will match the folder that we create for you.

When you run the command, you'll see an output like this.

```text

? Enter a name for the app [required] my-backstage-app

Creating the app...

Checking if the directory is available:

checking      my-backstage-app ✔

Creating a temporary app directory:

Preparing files:
copying       .dockerignore ✔
copying       .eslintignore ✔
templating    .eslintrc.js.hbs ✔
...
Moving to final location:
moving        my-backstage-app ✔
fetching      yarn.lock seed ✔

Installing dependencies:
executing     yarn install ✔
executing     yarn tsc ✔

Successfully created my-backstage-app
```

And when it finishes, you'll have a working Backstage app (with example data)!

Now, that we know what it does, let's actually scaffold some code!

```bash
npx @backstage/create-app@latest
```

This may take a few minutes to fully install everything. Don't stress if the loading seems to be spinning nonstop, there's a lot going on in the background.

## Structure of your app

### General folder structure

Below is a simplified layout of the files and folders generated when creating an app.

```text
app
├── app-config.yaml
├── catalog-info.yaml
├── package.json
└── packages
    ├── app
    └── backend
```

- **app-config.yaml**: Main [configuration file](../../conf/index.md) for the app.
- **catalog-info.yaml**: A descriptor for
  [Software Catalog entities](../../features/software-catalog/descriptor-format.md).
- **package.json**: Root `package.json` for the project. _Note: Be sure that you
  don't add any npm dependencies here as they probably should be installed in
  the intended workspace rather than in the root._
- **packages/**: [Yarn workspaces](https://yarnpkg.com/features/workspaces) that
  contain the separate frontend and backend packages.
- **packages/app/**: A fully functioning
  [Backstage frontend app](../../frontend-system/index.md) that acts as a good
  starting point for you to get to know Backstage.
- **packages/backend/**: A [Backstage backend](../../backend-system/index.md)
  that powers features such as [Authentication](../../auth/index.md),
  [Software Catalog](../../features/software-catalog/index.md),
  [Software Templates](../../features/software-templates/index.md), and
  [TechDocs](../../features/techdocs/getting-started.md).

## Common Issues

- App is not running on port X: Backstage uses ports `3000` and `7007` as its default frontend and backend ports. Make sure that your commands haven't exited with errors. For remote or containerized setups, make sure those ports above are accessible.

## Next steps

Now that you have a scaffolded app, continue to
[run it locally](./002-local-development.md).
