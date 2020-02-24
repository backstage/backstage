# Backstage

[![GitHub license](https://img.shields.io/github/license/spotify/backstage.svg)](./LICENSE)

## What is Backstage?

Backstage is an open platform for building developer portals.

## Getting started

### Install Dependencies

To run the frontend, you will need to have [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git), [NodeJS](https://nodejs.org/en/download/), and [yarn](https://classic.yarnpkg.com/en/docs/install#mac-stable) installed.

For running the backend, depending on your OS, you need [Docker Desktop for Mac](https://docs.docker.com/docker-for-mac/install/), [Docker Desktop for Windows](https://docs.docker.com/docker-for-windows/install/), or for Linux, [docker](https://docs.docker.com/install/) and [docker-compose](https://docs.docker.com/compose/install/#install-compose-on-linux-systems).

The above dependencies are enough to run and work on the Backstage frontend packages. To develop backend services, there are some more tools to install, see [backend/README.md](backend/README.md). To update protobuf definitions, you will need another set of tools, see [proto/README.md](proto/README.md).

### Secrets

To setup secrets, copy the `secrets.env.example` to `secrets.env` as such:

```bash
$ make init-secrets
```

## Running Locally

The full local system consists of a collection of backend services, as well as a web application. From the root of the project directory, run the following in a terminal to start up all backend services locally:

```bash
cd backend

docker-compose up --build
```

Once the backend services are up and running, open a separate terminal window and start the web app using the following commands from the project root:

```bash
cd frontend

yarn # may take a while

yarn start
```

The final `yarn start` command should open a local instance of Backstage in your browser, otherwise open one of the URLs printed in the terminal.

## Plugins

### Creating a Plugin

Run the following:

```bash
$ make scaffold-new-frontend-plugin
```

This will generate a plugin in the `frontend/packages/plugins` folder. It is important to note you will still need to include the plugin in your `frontend/packages/app` in the `package.json`. You will then be able to import it as follows:

```bash
$ make scaffold-new-frontend-plugin
plugin_name [example-plugin]: github-api

$ vim frontend/packages/app/package.json
# Add the following line to your package.json
# Note all plugins are prefixed with "plugin-" by default with a version number of "0.0.0"
# "@backstage/plugin-github-api": "0.0.0",

$ vim frontend/packages/app/src/App.tsx
# Add the following line to import your generated component
# import { ExampleComponent } from '@backstage/plugin-github-api';
# <ExampleComponent />
```

## Protobuf Definitions

The protobuf definitions are all found in the `/proto` folder in the project root. They are used to generate code for gRPC communication for both the frontend and backend. The generated code is checked into version control though, so unless you want to change the protobuf definitions you don't need to install any tooling.

Information about how to work with the protobuf definitions can be found inside [proto/README.md](proto/README.md).

## Documentation

## License

Copyright 2020 Spotify AB.

Licensed under the Apache License, Version 2.0: http://www.apache.org/licenses/LICENSE-2.0
