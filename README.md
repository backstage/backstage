![headline](docs/assets/headline.png)

# [Backstage](https://backstage.io)

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
![](https://github.com/spotify/backstage/workflows/Frontend%20CI/badge.svg)
[![Discord](https://img.shields.io/discord/687207715902193673)](https://discord.gg/EBHEGzX)
![Code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)
[![](https://img.shields.io/npm/v/@backstage/core?label=Version)](https://github.com/spotify/backstage/releases)

## What is Backstage?

[Backstage](https://backstage.io/) is an open platform for building developer portals. Powered by a centralized service catalog, Backstage restores order to your microservices and infrastructure. So your product teams can ship high-quality code quickly — without compromising autonomy.

Backstage unifies all your infrastructure tooling, services, and documentation to create a streamlined development environment from end to end.

![service-catalog](https://backstage.io/blog/assets/6/header.png)

Out of the box, Backstage includes:

- [Backstage Service Catalog](https://backstage.io/docs/features/software-catalog/software-catalog-overview) for managing all your software (microservices, libraries, data pipelines, websites, ML models, etc.)
- [Backstage Software Templates](https://backstage.io/docs/features/software-templates/software-templates-index) for quickly spinning up new projects and standardizing your tooling with your organization’s best practices
- [Backstage TechDocs](https://backstage.io/docs/features/techdocs/techdocs-overview) for making it easy to create, maintain, find, and use technical documentation, using a "docs like code" approach
- Plus, a growing ecosystem of [open source plugins](https://github.com/spotify/backstage/tree/master/plugins) that further expand Backstage’s customizability and functionality

For more information go to [backstage.io](https://backstage.io) or join our [Discord chatroom](https://discord.gg/EBHEGzX).

## Project roadmap

A detailed project roadmap, including already delivered milestones, is available [here](https://backstage.io/docs/overview/roadmap).

## Overview

The Backstage platform consists of a number of different components:

- **app** - Main web application that users interact with. It's built up by a number of different _Plugins_. This repo contains an example implementation of an app (located in `packages/app`) and you can easily get started with your own app by [creating one](docs/getting-started/create-an-app.md).
- [**plugins**](https://github.com/spotify/backstage/tree/master/plugins) - Each plugin is treated as a self-contained web app and can include almost any type of content. Plugins all use a common set of platform API's and reusable UI components. Plugins can fetch data either from the _backend_ or through any RESTful API exposed through the _proxy_.
- [**service catalog**](https://github.com/spotify/backstage/tree/master/packages/backend) - Service that holds the model of your software ecosystem, including organisational information and what team owns what software. The backend also has a Plugin model for extending its graph.
- [**proxy**](https://github.com/spotify/backstage/tree/master/plugins/proxy-backend) - Terminates HTTPS and exposes any RESTful API to Plugins.
- **identity** - A backend service that holds your organisation's metadata.

## Getting Started

There are two different ways to get started with Backstage, either by creating a standalone app, or by cloning this repo. Which method you use depends on what you're planning to do.

Creating a standalone instance makes it simpler to customize the application for your needs whilst staying up to date with the project. You will also depend on `@backstage` packages from NPM, making the project much smaller. This is the recommended approach if you want to kick the tyres of Backstage or setup your own instance.

On the other hand, if you want to contribute plugins or to the project in general, it's easier to fork and clone this project. That will let you stay up to date with the latest changes, and gives you an easier path to make Pull Requests towards this repo.

### Creating a Standalone App

Backstage provides the `@backstage/create-app` package to scaffold standalone instances of Backstage. You will need to have
[NodeJS](https://nodejs.org/en/download/) Active LTS Release installed
(currently v12), and [yarn](https://classic.yarnpkg.com/en/docs/install). You will also need to have [Docker](https://docs.docker.com/engine/install/) installed to use some features like Software Templates and TechDocs.

Using `npx` you can then run the following to create an app in a chosen subdirectory of your current working directory:

```bash
npx @backstage/create-app
```

You will be taken through a wizard to create your app, and the output should look something like this. You can read more about this process [here](https://backstage.io/docs/getting-started/create-an-app)

### Contributing to Backstage

You can read more in our [CONTRIBUTING.md](./CONTRIBUTING.md#get-started) guide, which can help you get setup with a Backstage development environment.

### Next steps

Take a look at the [Getting Started](https://backstage.io/docs/getting-started/index) guide to learn how to set up Backstage, and how to develop on the platform.

## Documentation

- [Main documentation](https://backstage.io/docs/overview/what-is-backstage)
- [Service Catalog](https://backstage.io/docs/features/software-catalog/software-catalog-overview)
- [Architecture](https://backstage.io/docs/overview/architecture-terminology) ([Decisions](https://backstage.io/docs/architecture-decisions/adrs-overview))
- [Designing for Backstage](https://backstage.io/docs/dls/design)
- [Storybook - UI components](https://backstage.io/storybook)

## Community

- [Discord chatroom](https://discord.gg/MUpMjP2) - Get support or discuss the project
- [Good First Issues](https://github.com/spotify/backstage/contribute) - Start here if you want to contribute
- [RFCs](https://github.com/spotify/backstage/labels/rfc) - Help shape the technical direction
- [FAQ](https://backstage.io/docs/FAQ) - Frequently Asked Questions
- [Code of Conduct](CODE_OF_CONDUCT.md) - This is how we roll
- [Adopters](ADOPTERS.md) - Companies already using Backstage
- [Blog](https://backstage.io/blog/) - Announcements and updates
- [Newsletter](https://mailchi.mp/spotify/backstage-community)
- Give us a star ⭐️ - If you are using Backstage or think it is an interesting project, we would love a star ❤️

Or, if you are an open source developer and are interested in joining our team, please reach out to [foss-opportunities@spotify.com ](mailto:foss-opportunities@spotify.com)

## License

Copyright 2020 Spotify AB.

Licensed under the Apache License, Version 2.0: http://www.apache.org/licenses/LICENSE-2.0
