# Backstage

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
![](https://github.com/spotify/backstage/workflows/Frontend%20CI/badge.svg)

## What is Backstage?

Backstage is an open platform for building developer portals.

The philosophy behind Backstage is simple: don't expose your engineers to the full complexity of all your infrastructure tooling and services -- hide it behind a _single_ centralized, consistent user-friendly interface.

![headline](headline.png)

At Spotify we believe that a better developer experience leads to happier and more productive engineers.

## Overview

The Backstage platform consists of a number of different components:

- **frontend** Main web application that users interact with. It's built up by a number of different _Plugins_. Plugins all use a common set of platform API's and reusable UI components. Each plugin is treated as a self-contained web app and can include almost any type of content. Plugins can fetch data either from the _backend_ or through any RESTful API exposed through the _proxy_.
- **backend** GraphQL aggregation service that holds the model of your software ecosystem, including organisational information and what team owns what software. The backend also has a Plugin model for extending its graph.
- **proxy** Terminates HTTPS and exposes any RESTful API to Plugins.
- **identity** A backend service that holds your organisation's metadata.

![overview](backstage_overview.png)

## Getting started

### Install Dependencies

To run the frontend, you will need to have [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git), [NodeJS](https://nodejs.org/en/download/), and [yarn](https://classic.yarnpkg.com/en/docs/install#mac-stable) installed.

For running the backend, depending on your OS, you need [Docker Desktop for Mac](https://docs.docker.com/docker-for-mac/install/), [Docker Desktop for Windows](https://docs.docker.com/docker-for-windows/install/), or for Linux, [docker](https://docs.docker.com/install/) and [docker-compose](https://docs.docker.com/compose/install/#install-compose-on-linux-systems).

The above dependencies are enough to run and work on the Backstage frontend packages. To develop backend services, there are some more tools to install, see [backend/README.md](backend/README.md). To update protobuf definitions, you will need another set of tools, see [proto/README.md](proto/README.md).

## Running Locally

The full local system consists of a collection of backend services, as well as a web application. From the root of the project directory, run the following in a terminal to start up all backend services locally:

```bash
$ cd backend

$ docker-compose up --build
```

Once the backend services are up and running, open a separate terminal window and start the web app using the following commands from the project root:

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

This will prompt you to enter an ID for your plugin, and then create your plugin inside the `plugins/` directory. The plugin will be automatically included in the app by modifing the app's `package.json` and `src/plugins.ts`.

If you have `yarn start` already running you should be able to see the default page for your new plugin at [localhost:3000/my-plugin](http://localhost:3000/my-plugin), if you called the plugin `"my-plugin"`.

## Documentation

## License

Copyright 2020 Spotify AB.

Licensed under the Apache License, Version 2.0: http://www.apache.org/licenses/LICENSE-2.0
