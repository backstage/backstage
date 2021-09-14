---
id: index
title: Getting Started
description: Documentation on How to get started with Backstage
---

There are two different ways to get started with Backstage:

- **Recommended:** Create a standalone app
- **Contributors:** Clone the Backstage repository

Creating a standalone app makes it simpler to customize the application for your
needs and stay up to date with the project. You will depend on `@backstage`
packages from npm, making your app much smaller. This is the recommended
approach for most installations.

If you want to contribute plugins or to the project in general, it's easier to
fork and clone the repository. The `@backstage` packages will be included in the
clone. That will let you stay up to date with the latest changes, and give you
an easier path to make Pull Requests.

### Create your Backstage App

Backstage provides the `@backstage/create-app` package to scaffold standalone
instances of Backstage. You will need to have
[Node.js](https://nodejs.org/en/download/) Active LTS Release installed
(currently v14) and [Yarn](https://classic.yarnpkg.com/en/docs/install). You
will also need to have [Docker](https://docs.docker.com/engine/install/)
installed to use some features like Software Templates and TechDocs.

Using `npx` you can then run the following to create an app in a chosen
subdirectory of your current working directory:

```bash
npx @backstage/create-app
```

You will be taken through a wizard to create your app. You can read more about
this process in [Create an app](./create-an-app.md).

### Contributing to Backstage

If you intend to make changes to the core project's packages, certain plugins,
or project documentation, then you can fork and clone
[https://github.com/backstage/backstage](https://github.com/backstage/backstage).

This will let you run the latest code off of the `master` branch, fix bugs or
contribute new features, run test suites, etc.

You can read more in our
[CONTRIBUTING](https://github.com/backstage/backstage/blob/master/CONTRIBUTING.md)
guide, which can help you get setup with a Backstage development environment.
