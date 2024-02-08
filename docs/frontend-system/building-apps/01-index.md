---
id: index
title: Building Frontend Apps
sidebar_label: Overview
# prettier-ignore
description: Building frontend apps using the new frontend system
---

> **NOTE: The new frontend system is in alpha and is only supported by a small number of plugins.**

To get set up quickly with your own Backstage project you can create a Backstage App.

A Backstage App is a monorepo setup that includes everything you need to run Backstage in your own environment.

## Creating a new app

To create a new Backstage app we recommend using the `@backstage/create-app` command line, and the easiest way to run this package is with `npx`:

:::note
The create-app CLI requires Node.js Active LTS Release.
:::

```sh
# The command bellow creates a Backstage App inside the current folder.
# The name of the app-folder is the name that was provided when prompted.
npx @backstage/create-app@latest
```

The created-app is currently templated for legacy frontend system applications, so the app wiring code it creates needs to be migrated, see [the app instance](#the-app-instance) section for an example.

## The app instance

The starting point of a frontend app is the `createApp` function, which accepts a single options object as its only parameter. It is imported from `@backstage/frontend-app-api`, which is where you will find most of the common APIs for building apps.

This is how to create a minimal app:

```tsx title="in src/index.ts"
import ReactDOM from 'react-dom/client';
import { createApp } from '@backstage/frontend-app-api';
import catalogPlugin from '@backstage/plugin-catalog/alpha';

// Create your app instance
const app = createApp({
  // Features such as plugins can be installed explicitly, but we will explore other options later on
  features: [catalogPlugin],
});

// This creates a React element that renders the entire app
const root = app.createRoot();

// Just like any other React we need a root element. No server side rendering is used.
const rootEl = document.getElementById('root')!;

ReactDOM.createRoot(rootEl).render(root);
```

Note that `createRoot` returns the root element that is rendered by React. The above example is installing a catalog plugin and using default settings for the app, as no options other than the `features` array are passed to the `createApp` function.

Visit the [built-in extensions](#customize-or-override-built-in-extensions) section to see what is installed by default in a Backstage application.

## Configure your app

### Bind external routes

Linking routes from different plugins requires this configuration. You can do this either through a configuration file or by coding, visit [this](https://backstage.io/docs/frontend-system/architecture/routes#binding-external-route-references) page for instructions.

### Enable feature discovery

Use this setting to enable experimental feature discovery when building your app with `@backstage/cli`. With this configuration your application tries to discover and install package extensions automatically, check [here](../architecture/02-app.md#feature-discovery) for more details.

:::warning
Remember that package extensions that are not auto-discovered must be manually added to the application when creating an app. See [features](#install-features-manually) for more details.
:::

### Configure extensions individually

It is possible to enable, disable and configure extensions individually in the `app-config.yaml` config file. To get familiar with what is available for app extensions personalization, go to the [built-in extensions](./02-built-in-extensions.md) documentation. For plugin customizations, we recommend that you read the instructions in each plugin's README file.

### Customize or override built-in extensions

Previously you would customize the application route, components, apis, sidebar, etc. through the code in `App.tsx`. Now we want you to write less code and install more extensions to customize your Backstage instance. See [here](../building-plugins/03-extension-types.md) which types of extensions are available for you to customize your application.

## Use code to customize the app at a more granular level

### Install features manually

A manual installation is required if your packages are not discovered automatically, either because you are not using `@backstage/cli` to build your application or because the features are defined in local modules in the app package. In order to manually install a feature, you must import it and pass it to the `createApp` function:

```tsx title="packages/app/src/App.tsx"
import { createApp } from '@backstage/frontend-app-api';
// This plugin was create as a local module in the app
import { somePlugin } from './plugins';

const app = createApp({
  features: [somePlugin],
});

export default app.createRoot();
```

:::info
You can also pass overrides to the features array, for more details, please read the [extension overrides](../architecture/05-extension-overrides.md) documentation.
:::

### Using an async features loader

In case you need to perform asynchronous operations before passing features to the `createApp` function, define a [feature loader](https://backstage.io/docs/reference/frontend-app-api.createappfeatureloader/) object and pass it to the `features` option:

```tsx title="packages/app/src/App.tsx"
import { createApp } from '@backstage/frontend-app-api';

const app = createApp({
  features: {
    getLoaderName: () => '<your-custom-features-loader-name>',
    // there is a reference to the config api in the options param
    load: async _options => {
      // returning a lazy loaded plugins and overrides array
      // could be util for module federation
      return import('./features').then(m => m.default);
    },
  },
});

export default app.createRoot();
```

### Lazy load your configuration file

In some cases we want to load our configuration from a backend server and to do so, you can pass an callback to the `configLoader` option when calling the `createApp` function, the callback should return a promise of an object with the config object:

```tsx title="packages/app/src/App.tsx"
import { createApp } from '@backstage/frontend-app-api';
import { getConfigFromServer } from './utils';

// Example lazy loading the app configuration
const app = createApp({
  // Returns Promise<{ config: ConfigApi }>
  configLoader: async () => {
    // Calls an async utility method that fetches the config object from the server
    const config = await getConfigFromServer();
    // Feel free to manipulate the config object before returning it
    // A common example is conditionally modify the config based on the running enviroment
    return { config };
  },
});

export default app.createRoot();
```
