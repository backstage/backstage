---
id: development-environment
title: Development Environment
# prettier-ignore
description: Documentation on how to get set up for doing development on the Backstage repository
---

This section describes how to get set up for doing development on the Backstage
repository.

## Cloning the Repository

After you have cloned the Backstage repository, you should run the following
commands once to set things up for development:

```bash
$ yarn install  # fetch dependency packages - may take a while

$ yarn tsc      # does a first run of type generation and checks
```

## Serving the Example App

Open a terminal window and start the web app by using the following command from
the project root. Make sure you have run the above mentioned commands first.

```bash
$ yarn start
```

This should open a local instance of Backstage in your browser, otherwise open
one of the URLs printed in the terminal.

By default, Backstage will start on port 3000, however you can override this by
setting an environment variable `PORT` on your local machine. e.g.
`export PORT=8080` then running `yarn start`. Or `PORT=8080 yarn start`.

Once successfully started, you should see the following message in your terminal
window:

```
You can now view example-app in the browser.

  Local:            http://localhost:8080
  On Your Network:  http://192.168.1.224:8080
```

## Editor

The Backstage development environment does not require any specific editor, but
it is intended to be used with one that has built-in linting and type-checking.
The development server does not include any checks by default, but they can be
enabled using the `--check` flag. Note that using the flag may consume more
system resources and slow things down.

## Package Scripts

There are many commands to be found in the root
[package.json](https://github.com/backstage/backstage/blob/master/package.json),
here are some useful ones:

```python
yarn start # Start serving the example app, use --check to include type checks and linting

yarn storybook # Start local storybook, useful for working on components in @backstage/core

yarn workspace @backstage/plugin-welcome start # Serve welcome plugin only, also supports --check

yarn tsc # Run typecheck, use --watch for watch mode
yarn tsc:full # Run full type checking, for example without skipLibCheck, use in CI

yarn build # Build published versions of packages, depends on tsc

yarn lint # lint packages that have changed since later commit on origin/master
yarn lint:all # lint all packages
yarn lint:type-deps # verify that @types/* dependencies are placed correctly in packages

yarn test # test packages that have changed since later commit on origin/master
yarn test:all # test all packages

yarn clean # Remove all output folders and @backstage/cli cache

yarn diff # Make sure all plugins are up to date with the latest plugin template

yarn create-plugin # Create a new plugin
```

> See
> [package.json](https://github.com/backstage/backstage/blob/master/package.json)
> for other yarn commands/options.

## Local configuration

Backstage allows you to specify the configuration used while running the
application on your computer. Local configuration is read from
`app-config.local.yaml`. This file is ignored by Git, which means that you can
safely use it to reference secrets like GitHub tokens without worrying about
these secrets, inadvertently ending up in the Git repository. You do not need to
copy everything from the default config to the local config.
`app-config.local.yaml` will be merged with `app-config.yaml` and overwrite the
default app configs.

You can learn more about the local configuration in
[Static Configuration in Backstage](../conf/) section.
