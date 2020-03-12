# Backstage

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
![](https://github.com/spotify/backstage/workflows/Frontend%20CI/badge.svg)

## What is Backstage?

Backstage is an open platform for building developer portals.

The philosophy behind Backstage is simple: Don't expose your engineers to the full complexity of your infrastructure tooling. Engineers should be shipping code — not figuring out a whole new toolset every time they want to implement the basics.

![headline](headline.png)

## Project roadmap

We created Backstage about 4 years ago. While our internal version of Backstage has had the benefit of time to mature and evolve, the first iteration of our open source version is still nascent. We are envisioning three phases of the project and we have already begun work on various aspects of these phases:

- **Phase 1:** Extensible frontend platform (now) - You will be able to easily create a single consistent UI layer for your internal infrastructure and tools. A set of reusable UX patterns and components help ensure a consistent experience between tools.

- **Phase 2:** Manage your software inventory (next 2-3 months) - A central software inventory with clear ownership and the ability to easily create and manage software at scale. Regardless of whether you want to create a new library, view service deployment status in Kubernetes, or check the test coverage for a website -- Backstage will provide all of those tools - and many more - in a single developer portal.

- **Phase 3:** Ecosystem (later) - Everyone's infrastructure stack is different. By fostering a vibrant community of contributors we hope to provide an ecosystem of Open Source plugins/integrations that allows you to pick the tools that match your stack.

Our vision for Backstage is for it to become the trusted standard toolbox (read: UI layer) for the open source infrastructure landscape. We realize this is an ambitious goal. We can’t do it alone. If this sounds interesting or you'd like to help us shape our product vision, we'd love to talk. You can email me directly: [alund@spotify.com](mailto:alund@spotify.com).

## Overview

The Backstage platform consists of a number of different components:

- **frontend** - Main web application that users interact with. It's built up by a number of different _Plugins_.
- **plugins** - Each plugin is treated as a self-contained web app and can include almost any type of content. Plugins all use a common set of platform API's and reusable UI components. Plugins can fetch data either from the _backend_ or through any RESTful API exposed through the _proxy_.
- **backend** \* - GraphQL aggregation service that holds the model of your software ecosystem, including organisational information and what team owns what software. The backend also has a Plugin model for extending its graph.
- **proxy** \* - Terminates HTTPS and exposes any RESTful API to Plugins.
- **identity** \* - A backend service that holds your organisation's metadata.

_\* not yet released_

![overview](backstage_overview.png)

## Getting started

### Install Dependencies

To run the frontend, you will need to have the following installed:

- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [NodeJS](https://nodejs.org/en/download/) - Active LTS Release, currently v12
- [yarn](https://classic.yarnpkg.com/en/docs/install)

## Running the frontend locally

Open a terminal window and start the web app using the following commands from the project root:

```bash
$ yarn # may take a while

$ yarn start
```

The final `yarn start` command should open a local instance of Backstage in your browser, otherwise open one of the URLs printed in the terminal.

## Plugins

### Creating a Plugin

To create a new plugin, make sure you're run `yarn` to install dependencies, then run the following:

```bash
$ yarn create-plugin
```

For more information see [Developing a Backstage Plugin](plugins/README.md).

## Documentation

_TODO: Add links to docs on backstage.io_

## License

Copyright 2020 Spotify AB.

Licensed under the Apache License, Version 2.0: http://www.apache.org/licenses/LICENSE-2.0
