---
id: package-metadata
title: Package Metadata
description: An inventory of well known package metadata fields in the Backstage ecosystem.
---

The `package.json` file is a JSON file that contains metadata about a JavaScript package, and in required for all package publish to NPM or a similar package registry. It is a [Node.js standard](https://nodejs.org/api/packages.html) that is expanded upon in the [NPM ecosystem](https://docs.npmjs.com/cli/v10/configuring-npm/package-json).

## Known Metadata Fields

This section documents the known `package.json` metadata fields that play a significant role in the Backstage ecosystem.

All [fields defined by NPM](https://docs.npmjs.com/cli/v10/configuring-npm/package-json) are inherited by the Backstage ecosystem. The list below only includes those standard fields for which additional information is available.

### `name`

The name of the package, as defined by [NPM](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#name). In addition, the following naming scheme is strongly encouraged for packages published in the Backstage ecosystem:

First pick a package name prefix that is unique to your organization or collection of packages, but also places it within the Backstage ecosystem, for example: `@example/backstage`, `@example-backstage/`, or `example-backstage`. This prefix should be used by all packages that you publish, regardless of whether they're part of a plugin or not.

Any package that is not part of a plugin should use the prefix along with a descriptive name, for example: `@example/backstage-components` or `@example/backstage-foo-client`.

For plugin packages you should also pick a plugin ID and add `plugin-<pluginId>` to the prefix, along with a suffix based on the package role:

- `<prefix>-plugin-<pluginId>`: The main frontend code of the plugin.
- `<prefix>-plugin-<pluginId>-module-<name>`: Optional modules related to the frontend plugin package.
- `<prefix>-plugin-<pluginId>-backend`: The main backend code of the plugin.
- `<prefix>-plugin-<pluginId>-backend-module-<name>`: Optional modules related to the backend plugin package.
- `<prefix>-plugin-<pluginId>-react`: Shared widgets, hooks and similar that both the plugin itself and third-party frontend plugins or modules can depend on.
- `<prefix>-plugin-<pluginId>-node`: Utilities for backends that both the plugin backend itself and third-party backend plugins or modules can depend on.
- `<prefix>-plugin-<pluginId>-common`: An isomorphic package with platform agnostic models, clients, and utilities that all packages above or any third-party plugin or module can depend on.

For example, a frontend package for the `poetry` plugin might be called `@example/backstage-plugin-poetry`, and a backend package for the same plugin might be called `@example/backstage-plugin-poetry-backend`.

If you are creating a module for an existing package that is not part of your project, you should use the same prefix along with the plugin ID of the package that the module is for. For example, if you are creating a poetry provider module for `@backstage/plugin-catalog-backend`, you might call it `@example/backstage-plugin-catalog-backend-module-poetry-provider`.
