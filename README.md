![headline](docs/headline.png)

# [Backstage](https://backstage.io)

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
![](https://github.com/spotify/backstage/workflows/Frontend%20CI/badge.svg)
[![Discord](https://img.shields.io/discord/687207715902193673)](https://discord.gg/EBHEGzX)
![Code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)
[![](https://img.shields.io/npm/v/@backstage/core?label=Version)](https://github.com/spotify/backstage/releases)

## What is Backstage?

Backstage is an open platform for building developer portals.

The philosophy behind Backstage is simple: Don't expose your engineers to the full complexity of your infrastructure tooling. Engineers should be shipping code — not figuring out a whole new toolset every time they want to implement the basics. Backstage allows you add "stuff" (tooling, services, features, etc.) by adding a plugin, instead of building a new tool. This saves you work and avoids the need of your team to learn how to use and support yet another tool.

For more information go to [backstage.io](https://backstage.io) or join our [Discord chatroom](https://discord.gg/EBHEGzX).

## What problem does Backstage solve?

As companies grow, their infrastructure systems get messier. Backstage unifies all your infrastructure tooling, services, and documentation with a single, consistent UI.

This blog post provides more examples of how Backstage is used inside Spotify:

https://labs.spotify.com/2020/03/17/what-the-heck-is-backstage-anyway/

https://backstage.io/demos

## Project roadmap

We created Backstage about 4 years ago. While our internal version of Backstage has had the benefit of time to mature and evolve, the first iteration of our open source version is still nascent. We are envisioning three phases of the project and we have already begun work on various aspects of these phases:

- 🐣 **Phase 1:** Extensible frontend platform (Done ✅) - You will be able to easily create a single consistent UI layer for your internal infrastructure and tools. A set of reusable UX patterns and components help ensure a consistent experience between tools.

- 🐢 **Phase 2:** Manage your stuff ([current focus](https://backstage.io/blog/2020/05/22/phase-2-service-catalog)) - Manage anything from microservices to software components to infrastructure and your service catalog. Regardless of whether you want to create a new library, view service deployment status in Kubernetes, or check the test coverage for a website -- Backstage will provide all of those tools - and many more - in a single developer portal.

- 🐇 **Phase 3:** Ecosystem (later) - Everyone's infrastructure stack is different. By fostering a vibrant community of contributors we hope to provide an ecosystem of Open Source plugins/integrations that allows you to pick the tools that match your stack.

Check out our [Milestones](https://github.com/spotify/backstage/milestones) and open [RFCs](https://github.com/spotify/backstage/labels/rfc) how they relate to the three Phases outlined above.

Our vision for Backstage is for it to become the trusted standard toolbox (read: UX layer) for the open source infrastructure landscape. Think of it like Kubernetes for developer experience. We realize this is an ambitious goal. We can’t do it alone. If this sounds interesting or you'd like to help us shape our product vision, we'd love to talk. You can email me directly: [alund@spotify.com](mailto:alund@spotify.com).

## Overview

The Backstage platform consists of a number of different components:

- **app** - Main web application that users interact with. It's built up by a number of different _Plugins_. This repo contains an example implementation of an app (located in `packages/example-app`) and you can easily get started with your own app by [creating one](docs/create-an-app.md).
- [**plugins**](https://github.com/spotify/backstage/tree/master/plugins) - Each plugin is treated as a self-contained web app and can include almost any type of content. Plugins all use a common set of platform API's and reusable UI components. Plugins can fetch data either from the _backend_ or through any RESTful API exposed through the _proxy_.
- [**backend**](https://github.com/spotify/backstage/tree/master/packages/backend) - GraphQL aggregation service that holds the model of your software ecosystem, including organisational information and what team owns what software. The backend also has a Plugin model for extending its graph.
- **proxy** \* - Terminates HTTPS and exposes any RESTful API to Plugins.
- **identity** \* - A backend service that holds your organisation's metadata.

_\* not yet released_

![overview](backstage_overview.png)

## Getting started

To run a Backstage app, you will need to have the following installed:

- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [NodeJS](https://nodejs.org/en/download/) - Active LTS Release, currently v12
- [yarn](https://classic.yarnpkg.com/en/docs/install)

After cloning this repo, open a terminal window and start the example app using the following commands from the project root:

```bash
yarn install # Install dependencies

yarn start # Start dev server, use --check to enable linting and type-checks
```

The final `yarn start` command should open a local instance of Backstage in your browser, otherwise open one of the URLs printed in the terminal.

And thats it! You are good to go 👍

### Next step

Take a look at the [Getting Started](docs/getting-started/README.md) guide to learn more about how to extend the functionality with Plugins.

## Documentation

- [Getting Started](docs/getting-started/README.md)
- [Create a Backstage App](docs/create-an-app.md)
- [Architecture](docs/architecture-terminology.md) ([Decisions](docs/architecture-decisions))
- [API references](docs/reference/README.md)
- [Designing for Backstage](docs/design.md)
- [Storybook - UI components](http://storybook.backstage.io)
- [Contributing to Storybook](docs/getting-started/contributing-to-storybook.md)

## Contributing

We would love your help in building Backstage! See [CONTRIBUTING](CONTRIBUTING.md) for more information.

## Community

- [Discord chatroom](https://discord.gg/MUpMjP2) - Get support or discuss the project
- [Good First Issues](https://github.com/spotify/backstage/contribute) - Start here if you want to contribute
- [RFCs](https://github.com/spotify/backstage/labels/rfc) - Help shape the technical direction
- [FAQ](docs/FAQ.md) - Frequently Asked Questions
- [Code of Conduct](CODE_OF_CONDUCT.md) - This is how we roll
- [Blog](https://backstage.io/blog/) - Announcements and updates
- Give us a star ⭐️ - If you are using Backstage or think it is an interesting project, we would love a star ❤️

Or, if you are an open source developer and are interested in joining our team, please reach out to [foss-opportunities@spotify.com ](mailto:foss-opportunities@spotify.com)

## License

Copyright 2020 Spotify AB.

Licensed under the Apache License, Version 2.0: http://www.apache.org/licenses/LICENSE-2.0
