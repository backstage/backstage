---
id: running-backstage-locally
title: Running Backstage Locally
description: Documentation on How to run Backstage Locally
---

To develop a plugin or contribute to the Backstage project, we recommend cloning
the Backstage repository and running locally in development mode. If you are not
trying to contribute, follow the instructions to
[Create an App](./create-an-app.md) instead.

## Prerequisites

- Node.js

First make sure you are using Node.js with an Active LTS Release, currently v14.
This is made easy with a version manager such as
[nvm](https://github.com/nvm-sh/nvm) which allows for version switching.

```bash
# Installing a new version
nvm install 14
> Downloading and installing node v14.15.1...
> Now using node v14.15.1 (npm v6.14.8)

# Checking your version
node --version
> v14.15.1
```

- Yarn

Please refer to the
[installation instructions for Yarn](https://classic.yarnpkg.com/en/docs/install/).

- Docker

We use Docker for few of our core features. So, you will need Docker installed
locally to use features like Software Templates and TechDocs. Please refer to
the
[installation instructions for Docker](https://docs.docker.com/engine/install/).

## Clone and Build

To get up and running with a local Backstage to evaluate it, let's clone it off
of GitHub and run an initial build.

```bash
# Start from your local development folder
git clone --depth 1 git@github.com:backstage/backstage.git
cd backstage

# Fetch our dependencies and run an initial build
yarn install
yarn tsc
yarn build
```

Phew! Now you have a local repository that's ready to run and to add any open
source contributions into.

We are now going to launch two things: an example Backstage frontend app, and an
example Backstage backend that the frontend talks to. You are going to need two
terminal windows, both starting from the Backstage project root.

In the first window, run

```bash
cd packages/backend
yarn start
```

That starts up a backend instance on port 7000.

In the other window, we will then launch the frontend. This command is run from
the project root, not inside the backend directory.

```bash
yarn start
```

That starts up the frontend on port 3000, and should automatically open a
browser window showing it.

## Authentication

When Backstage starts, you can choose to enter as a Guest user and start
exploring.

But you can also set up any of the available authentication methods. The easiest
option will be GitHub. To setup GitHub authentication in Backstage, see
[these instructions](https://github.com/backstage/backstage/tree/master/plugins/auth-backend#github).

---

Congratulations! That should be it. Let us know how it went
[on discord](https://discord.gg/EBHEGzX), file issues for any
[feature](https://github.com/backstage/backstage/issues/new?labels=help+wanted&template=feature_template.md)
or
[plugin suggestions](https://github.com/backstage/backstage/issues/new?labels=plugin&template=plugin_template.md&title=%5BPlugin%5D+THE+PLUGIN+NAME),
or
[bugs](https://github.com/backstage/backstage/issues/new?labels=bug&template=bug_template.md)
you have, and feel free to
[contribute](https://github.com/backstage/backstage/blob/master/CONTRIBUTING.md)!

## Creating a Plugin

The value of Backstage grows with every new plugin that gets added. Here is a
collection of tutorials that will guide you through setting up and extending an
instance of Backstage with your own plugins.

- [Create a Backstage Plugin](../plugins/create-a-plugin.md)
- [Structure of a Plugin](../plugins/structure-of-a-plugin.md)
- [Utility APIs](../api/utility-apis.md)
