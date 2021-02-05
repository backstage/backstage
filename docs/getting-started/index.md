---
id: index
title: Getting Started
description: Documentation on How to get started with Backstage
---

There are two different ways to get started with Backstage, either by creating a
standalone app, or by cloning this repo. Which method you use depends on what
you're planning to do.

Creating a standalone instance makes it simpler to customize the application for
your needs whilst staying up to date with the project. You will also depend on
`@backstage` packages from npm, making the project much smaller. This is the
recommended approach if you want to kick the tyres of Backstage or setup your
own instance.

On the other hand, if you want to contribute plugins or to the project in
general, it's easier to fork and clone this project. That will let you stay up
to date with the latest changes, and gives you an easier path to make Pull
Requests towards this repo.

### Creating a Standalone App

Backstage provides the `@backstage/create-app` package to scaffold standalone
instances of Backstage. You will need to have
[Node.js](https://nodejs.org/en/download/) Active LTS Release installed
(currently v14), [Yarn](https://classic.yarnpkg.com/en/docs/install) and
[Python](https://www.python.org/downloads/) (although you likely have it
already). You will also need to have
[Docker](https://docs.docker.com/engine/install/) installed to use some features
like Software Templates and TechDocs.

Using `npx` you can then run the following to create an app in a chosen
subdirectory of your current working directory:

```bash
npx @backstage/create-app
```

You will be taken through a wizard to create your app, and the output should
look something like this. You can read more about this process in
[Create an app](https://backstage.io/docs/getting-started/create-an-app).

### Contributing to Backstage

You can read more in our
[CONTRIBUTING](https://github.com/backstage/backstage/blob/master/CONTRIBUTING.md)
guide, which can help you get setup with a Backstage development environment.

### Next steps

Take a look at the [Running Backstage Locally](./running-backstage-locally.md)
guide to learn how to set up Backstage, and how to develop on the platform.
