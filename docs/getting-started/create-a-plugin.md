# Backstage Plugins

A Backstage Plugin adds functionality to Backstage.

## Create a plugin

To create a new plugin, make sure you've run `yarn` and installed dependencies, then run the following on your command line (invoking the `backstage-cli`).

```bash
yarn create-plugin
```

<p align='center'>
    <img src='https://github.com/spotify/backstage/raw/master/docs/getting-started/create-plugin_output.png' width='600' alt='create plugin'>
</p>

This will create a new Backstage Plugin based on the ID that was provided. It will be built and
added to the Backstage App automatically.

_If `yarn start` is already running you should be able to see the default page for your new
plugin directly by navigating to `http://localhost:3000/my-plugin`._

<p align='center'>
    <img src='https://github.com/spotify/backstage/raw/master/docs/getting-started/my-plugin_screenshot.png' width='600' alt='my plugin'>
</p>

[Next Step - Structure of a plugin](structure-of-a-plugin.md)

[Back to Getting Started](README.md)
