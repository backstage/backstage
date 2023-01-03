---
id: index
title: Getting Started
description: Documentation on How to get started with Backstage
---

For most Backstage installations, installing the standalone app will bring you
the best and most streamlined experience. In this guide you will:

- Deploy Backstage Standalone with npm packages
- Run Backstage Standalone with a SQLite in-memory database and demo content

This guide assumes a basic understanding of working on a Linux based operating
system using tools like apt-get, npm, yarn, curl. Docker knowledge is also
helpful for making the best use of your Backstage installation.

If you are planning to contribute plugins or the project in general, we advise
you to use the
[Getting Started for Contributors](https://backstage.io/docs/getting-started/running-backstage-locally)
guide to do a repository-based installation.

### Prerequisites

- Access to a Unix-based operating system, such as Linux, MacOS or
  [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/)
- An account with elevated rights to install the dependencies
- `curl` or `wget` installed
- Node.js [Active LTS Release](https://nodejs.org/en/blog/release/) installed using one of these
  methods:
  - Using `nvm` (recommended)
    - [Installing nvm](https://github.com/nvm-sh/nvm#install--update-script)
    - [Install and change Node version with nvm](https://nodejs.org/en/download/package-manager/#nvm)
  - [Binary Download](https://nodejs.org/en/download/)
  - [Package manager](https://nodejs.org/en/download/package-manager/)
  - [Using NodeSource packages](https://github.com/nodesource/distributions/blob/master/README.md)
- `yarn` [Installation](https://classic.yarnpkg.com/en/docs/install)
  - You will need to use Yarn classic to create a new project, but it can then be [migrated to Yarn 3](../tutorials/yarn-migration.md)
- `docker` [installation](https://docs.docker.com/engine/install/)
- `git` [installation](https://github.com/git-guides/install-git)
- If the system is not directly accessible over your network the following ports
  need to be opened: 3000, 7007. This is quite uncommon, unless when you're
  installing in a container, VM or remote system.

### Create your Backstage App

To install the Backstage Standalone app, we make use of `npx`, a tool to run
Node executables straight from the registry. This tool is part of your Node.js
installation. Running the command below will install Backstage. The wizard will
create a subdirectory inside your current working directory.

```bash
npx @backstage/create-app@latest
```

The wizard will ask you for the name of the app, which will also be the name of the directory

<p align='center'>
  <img src='../assets/getting-started/wizard.png' alt='Screenshot of the wizard asking for a name for the app.' />
</p>

### Run the Backstage app

When the installation is complete you can go to the application directory and
start the app. The `yarn dev` command will run both the frontend and backend as
separate processes (named `[0]` and `[1]`) in the same window.

```bash
cd my-backstage-app
yarn dev
```

<p align='center'>
  <img src='../assets/getting-started/startup.png' alt='Screenshot of the command output, with the message web pack compiled successfully.'/>
</p>

It might take a little while, but as soon as the message
`[0] webpack compiled successfully` appears, you can open a browser and directly
navigate to your freshly installed Backstage portal at `http://localhost:3000`.
You can start exploring the demo immediately. Please note that the in-memory
database will be cleared when you restart the app, so you'll most likely want to
carry on with the database steps.

<p align='center'>
  <img src='../assets/getting-started/portal.png' alt='Screenshot of the Backstage portal.'/>
</p>

In the next part of this tutorial, you'll learn how to change to a persistent
database, configure authentication, and add your first integration. Continue
with [getting started: Configuring Backstage](configuration.md).

Share your experiences, comments, or suggestions with us:
[on discord](https://discord.gg/EBHEGzX), file issues for any
[feature](https://github.com/backstage/backstage/issues/new?labels=help+wanted&template=feature_template.md)
or
[plugin suggestions](https://github.com/backstage/backstage/issues/new?labels=plugin&template=plugin_template.md&title=%5BPlugin%5D+THE+PLUGIN+NAME),
or
[bugs](https://github.com/backstage/backstage/issues/new?labels=bug&template=bug_template.md)
you have, and feel free to
[contribute](https://github.com/backstage/backstage/blob/master/CONTRIBUTING.md)!
