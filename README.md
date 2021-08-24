![headline](docs/assets/headline.png)

# BIH

## Start Up

The BIH use of Backstage has been configured to utilize Docker to startup the application, both the UI and backend components along with a Postgres databse. These have been wrapped up into a single Docker call to ease the start up steps. The first that needs to be done is to create a .env file to contain all of your environment variables for your local deployment. A template for this file has been provided in the example.env file. Once this file has been added to the workspace, then you will be able to make a single call to start the application, `docker-compose up`.

## Environment Variables

Each of the environment variables supported for this application are listed in the example.env file. These map to much of the configurations that are utilized in the app-config.yaml.

## Individual App Start Up

If you are looking to start up just the UI or backend components, you can take a look at the [Backstage documentation](https://backstage.io/docs).

# [Backstage](https://backstage.io)

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![CNCF Status](https://img.shields.io/badge/cncf%20status-sandbox-blue.svg)](https://www.cncf.io/projects)
[![Main CI Build](https://github.com/backstage/backstage/workflows/Main%20Master%20Build/badge.svg)](https://github.com/backstage/backstage/actions?query=workflow%3A%22Main+Master+Build%22)
[![Discord](https://img.shields.io/discord/687207715902193673)](https://discord.gg/EBHEGzX)
![Code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)
[![Codecov](https://img.shields.io/codecov/c/github/backstage/backstage)](https://codecov.io/gh/backstage/backstage)
[![](https://img.shields.io/npm/v/@backstage/core?label=Version)](https://github.com/backstage/backstage/releases)

## What is Backstage?

[Backstage](https://backstage.io/) is an open platform for building developer portals. Powered by a centralized software catalog, Backstage restores order to your microservices and infrastructure and enables your product teams to ship high-quality code quickly — without compromising autonomy.

Backstage unifies all your infrastructure tooling, services, and documentation to create a streamlined development environment from end to end.

![software-catalog](https://backstage.io/blog/assets/6/header.png)

Out of the box, Backstage includes:

- [Backstage Software Catalog](https://backstage.io/docs/features/software-catalog/software-catalog-overview) for managing all your software (microservices, libraries, data pipelines, websites, ML models, etc.)
- [Backstage Software Templates](https://backstage.io/docs/features/software-templates/software-templates-index) for quickly spinning up new projects and standardizing your tooling with your organization’s best practices
- [Backstage TechDocs](https://backstage.io/docs/features/techdocs/techdocs-overview) for making it easy to create, maintain, find, and use technical documentation, using a "docs like code" approach
- Plus, a growing ecosystem of [open source plugins](https://github.com/backstage/backstage/tree/master/plugins) that further expand Backstage’s customizability and functionality

Backstage was created by Spotify but is now hosted by the [Cloud Native Computing Foundation (CNCF)](https://www.cncf.io) as a Sandbox level project. Read the announcement [here](https://backstage.io/blog/2020/09/23/backstage-cncf-sandbox).

## Project roadmap

A detailed project roadmap, including already delivered milestones, is available [here](https://backstage.io/docs/overview/roadmap).

## Getting Started

Check out [the documentation](https://backstage.io/docs/getting-started) on how to start using Backstage.

## Documentation

- [Main documentation](https://backstage.io/docs)
- [Software Catalog](https://backstage.io/docs/features/software-catalog/software-catalog-overview)
- [Architecture](https://backstage.io/docs/overview/architecture-overview) ([Decisions](https://backstage.io/docs/architecture-decisions/adrs-overview))
- [Designing for Backstage](https://backstage.io/docs/dls/design)
- [Storybook - UI components](https://backstage.io/storybook)

## Community

- [Discord chatroom](https://discord.gg/MUpMjP2) - Get support or discuss the project
- [Contributing to Backstage](https://github.com/backstage/backstage/blob/master/CONTRIBUTING.md) - Start here if you want to contribute
- [RFCs](https://github.com/backstage/backstage/labels/rfc) - Help shape the technical direction
- [FAQ](https://backstage.io/docs/FAQ) - Frequently Asked Questions
- [Code of Conduct](CODE_OF_CONDUCT.md) - This is how we roll
- [Adopters](ADOPTERS.md) - Companies already using Backstage
- [Blog](https://backstage.io/blog/) - Announcements and updates
- [Newsletter](https://mailchi.mp/spotify/backstage-community) - Subscribe to our email newsletter
- [Backstage Community Sessions](https://github.com/backstage/community) - Join monthly meetup and explore Backstage community
- Give us a star ⭐️ - If you are using Backstage or think it is an interesting project, we would love a star ❤️

## BIH Style Guide
![updatedColors](https://user-images.githubusercontent.com/12993587/125858910-7961a44a-3ce8-4854-a1a3-fbc4809bb396.png)
- #112e51 background for all headers and content banners.
- #293e40 background for the left Nav, this color can be found in the VA's Service Now. 
- #FFFFFF most widely used font color, some dropdowns and headers.
- #fac922 Used as the border-top for the content element, this border-top is only triggered on the home page 'catalog' as a way to signify the homepage and to reflect the same functionality as the VA homepage. There is a hard coded check in the content element that checks for 'catalog' in the url, if the user is not currently on the homepage, it sets the border to ```border:none;```.
- #2E77D0 used for buttons and other call to action clickable items.
----------------------------------------
- Font-family: 'Source Sans Pro,Helvetica Neue,Helvetica,Roboto,Arial,sans-serif'.
- Padding: headers and banners - 24px, components - 8px.
- Margin: 0px;
- All alert, info, warning and success colors are the standard set with Material UI. (backstage standard)
----------------------------------------
- All Logos can be found at the VA design page [VA design Logos](https://design.va.gov/design/logos).
- The current VA logo used for backstage (which isnt found in the design page),

![va-color-logo](https://user-images.githubusercontent.com/12993587/125843344-a41587e3-2d0d-49bc-ab51-a0cffbe8ed0b.png)

Material UI theming can be found in ```packages/app/src/theme.tsx```




## License

Copyright 2020-2021 © The Backstage Authors. All rights reserved. The Linux Foundation has registered trademarks and uses trademarks. For a list of trademarks of The Linux Foundation, please see our Trademark Usage page: https://www.linuxfoundation.org/trademark-usage

Licensed under the Apache License, Version 2.0: http://www.apache.org/licenses/LICENSE-2.0

## Security

Please report sensitive security issues via Spotify's [bug-bounty program](https://hackerone.com/spotify) rather than GitHub.

For further details please see our complete [security release process](SECURITY.md).
