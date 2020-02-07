# Backstage

[![GitHub license](https://img.shields.io/github/license/spotify/backstage.svg)](./LICENSE)

## What is Backstage?

Backstage is an open platform for building developer portals.

## Getting started

### Install Dependencies with Homebrew and Yarn

Run the following to install relevant dependencies (such as Git, Docker, etc):

```bash
# If you don't have Homebrew, run the following command:
# $ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
$ make install
```

### Secrets

To setup secrets, copy the `secrets.env.example` to `secrets.env` as such:

```bash
$ make init-secrets
```

### Protobuf Definitions

To generate the Protobuf definitions in Go and TypeScript, run the following command from the root to run [Prototool](https://github.com/uber/prototool):

```bash
$ make build-protocol-definitions
```

See [proto/README.md](proto/README.md) for more information.

## Running Locally

Once you've installed all dependencies, start serving the frontend using `yarn`:

```bash
$ make start
```

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

## Documentation

## License

Copyright 2020 Spotify AB.

Licensed under the Apache License, Version 2.0: http://www.apache.org/licenses/LICENSE-2.0
