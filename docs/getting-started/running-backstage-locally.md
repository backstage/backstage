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

First make sure you are using Node.js with an [Active LTS Release](https://nodejs.org/en/about/releases/).
This is made easy with a version manager such as
[nvm](https://github.com/nvm-sh/nvm) which allows for version switching.

```bash
# Installing current LTS release
nvm install --lts
> Installing latest LTS version.
> Downloading and installing node v16.16.0...
> Now using node v16.16.0 (npm v8.11.0)

# Checking your version
node --version
> v16.16.0
```

- Yarn

Please refer to the
[installation instructions for Yarn](https://classic.yarnpkg.com/en/docs/install/).

- Docker

We use Docker for few of our core features. So, you will need Docker installed
locally to use features like Software Templates and TechDocs. Please refer to
the
[installation instructions for Docker](https://docs.docker.com/engine/install/).

## Clone and Install

To get up and running with a local Backstage to evaluate it, let's clone it off
of GitHub and run an initial install.

```bash
# Start from your local development folder
git clone --depth 1 https://github.com/backstage/backstage.git
cd backstage

# Install our dependencies
yarn install
```

Phew! Now you have a local repository that's ready to run and to add any open
source contributions into.

We are now going to launch two things: an example Backstage frontend app, and an
example Backstage backend that the frontend talks to. These can both be launched
through the following command:

```bash
# From your Backstage root directory, launches both the frontend and backend
yarn dev
```

If you prefer to run the frontend and backend separately, you can instead use `yarn start`
and `yarn start-backend` in two separate terminal windows.

Which ever way you choose, you will now have a backend instance running on port 7007,
and the frontend running on port 3000. A browser window should also automatically open,
showing the frontend.

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
