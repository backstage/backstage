# cli-builder

Welcome to the cli-builder plugin! This plugin is meant to provide a new way to interact with Backstage, through the CLI.

## Getting started

You can also serve the plugin in isolation by running `yarn start` in the plugin directory.
This method of serving the plugin provides quicker iteration speed and a faster startup and hot reloads.
It is only meant for local development, and the setup for it can be found inside the [/dev](./dev) directory. You will need to update the `process.argv` overrides in the `dev/index.ts` file to test various cases.

## Left to do

- [ ] Package into an executable that doesn't stay alive on failure.
