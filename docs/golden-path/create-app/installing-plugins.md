---
id: installing-plugins
sidebar_label: 003 - Installing plugins
title: 003 - Installing plugins
---

Now that you have a working Backstage app, let's walk through the most valuable part of the Backstage ecosystem - plugins!

## What is a Backstage plugin?

A Backstage plugin usually consists of frontend and backend functionality. Some examples of Backstage plugins are our Software Catalog, Search, and Software Templates plugins! Each plugin provides a series of well-contained focused features, for example - the Software Catalog contains an entity ingestion engine, an optimized query layer for fetching entity information and a series of UI elements that provide list and detail functionality for entities. Some plugins allow modules which supplement existing plugin-level functionality, customizing it for specific use cases - a good example here are catalog processor modules which allow for ingesting data from common sources into the catalog.

:::note Backstage Plugin Naming

The `backstage-cli new` command scaffolds plugins automatically with the expected naming conventions. We describe the naming conventions below for users who are installing external plugins.

:::

You'll generally have multiple packages that combine into a single "plugin". The common naming standard (detailed in [ADR-11](../../architecture-decisions/adr011-plugin-package-structure.md)) is demonstrated below for plugin `x`:

> `x`: Primary frontend entrypoint, contains frontend-only code for the plugin.

> `x-backend`: Primary backend entrypoint, contains backend-only code.

> `x-backend-module-y`: Optional backend module `y` for plugin `x`, contains backend-only code.

> `x-node`: Shared utilities for consumers of backend plugin `x`, should _NOT_ be used on the frontend.

> `x-react`: Shared utilities for consumers of frontend plugin `x`, should _NOT_ be used on the backend.

> `x-common`: Shared utilities for consumers of plugin `x`, can be used across backend and frontend.

Not all plugins need all of those packages, we recommend starting with just a `x` and `x-backend` package and expanding from there.

## How do I install a plugin?

As mentioned above, there's 2 parts to installing a plugin - the frontend and the backend. It's recommended to start with installing the backend plugin to ensure your frontend doesn't run into any weird errors.

In both cases, you'll want to find the plugin's installation documentation. For most plugins, this is available through that plugin's `README.md` file. For example, the Software Catalog plugin's installation instructions are available through their [backend plugin README](https://github.com/backstage/backstage/blob/850ad502eafc356d940e4f1ce6d32951548bb257/plugins/catalog-backend/README.md#L1) and [frontend plugin README](https://github.com/backstage/backstage/blob/850ad502eafc356d940e4f1ce6d32951548bb257/plugins/catalog/README.md#L1).

### Installing a Backend Plugin

Generally, installing a backend plugin is really easy - you just add a

```
backend.import(`@scope/package`)
```

to your `packages/backend/src/index.ts` file alongside the other entries. Saving the file will trigger a hot reload and just like that your new plugin is available and usable. For advanced cases, there may be required config for the plugin that you'll have to set. That config will (or should) be documented by the plugin in their `README`.

You may also need to add backend modules to provide the additional functionality in the plugin that you're looking for. Backend modules are further extensions to backend code that can provide tailored functionality, good examples are catalog processor modules that add support for Github, LDAP and AWS software entities. Modules install the exact same way as backend plugins. Installing a module may also require additional configuration, which should also be documented in the plugin's `README`.

### Installing a Frontend Plugin

Frontend plugins have multiple entrypoints, you should follow the plugin's documentation for how to install it.

The New Frontend System vastly simplifies this! Keep your eyes peeled for updates.

## Finding plugins

The open source community already has a host of plugins that solve many common asks - we recommend you look through [the plugin directory](https://backstage.io/plugins) before you go about creating your own!

You can find other community maintained plugins in the [Community Plugins Repository](https://github.com/backstage/community-plugins)!

## Next Steps

If you're chomping at the bit to write your own plugin, you can move to the `plugins` Golden Path. We recommend you make a note to come back and finish this Golden Path to get more information on maintaining a Backstage app long term.

For the rest of you, let's walk through keeping your Backstage app up to date!
