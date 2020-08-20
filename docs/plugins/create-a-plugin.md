---
id: create-a-plugin
title: Create a Backstage Plugin
---

A Backstage Plugin adds functionality to Backstage.

## Create a Plugin

To create a new plugin, make sure you've run `yarn install` and installed
dependencies, then run the following on your command line (invoking the
`backstage-cli`).

```bash
yarn create-plugin
```

<p align='center'>
    <img src='https://github.com/spotify/backstage/raw/master/docs/getting-started/create-plugin_output.png' width='600' alt='create plugin'>
</p>

This will create a new Backstage Plugin based on the ID that was provided. It
will be built and added to the Backstage App automatically.

_If `yarn start` is already running you should be able to see the default page
for your new plugin directly by navigating to
`http://localhost:3000/my-plugin`._

<p align='center'>
    <img src='https://github.com/spotify/backstage/raw/master/docs/plugins/my-plugin_screenshot.png' width='600' alt='my plugin'>
</p>

You can also serve the plugin in isolation by running `yarn start` in the plugin
directory. Or by using the yarn workspace command, for example:

```bash
yarn workspace @backstage/plugin-welcome start # Also supports --check
```

This method of serving the plugin provides quicker iteration speed and a faster
startup and hot reloads. It is only meant for local development, and the setup
for it can be found inside the plugin's `dev/` directory.

[Next Step - Structure of a plugin](structure-of-a-plugin.md)

[Back to Getting Started](../README.md)
