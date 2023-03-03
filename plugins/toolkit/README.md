## Toolkit

Welcome to the toolkit plugin!

_This plugin was created through the Backstage CLI_

## Features

1. You can add a tool that can be used to bookmark the web page or web application.
2. You can create, update, and delete your tool and add other's tools that are public.
3. The tool can be created by providing a title, logo and URL.
4. Public tools are visible to all the members throughout the application and a private tool is visible to its creator only.
5. Toolkit card to display all the tools which are either created or added by the user
6. A card for showing tool which is created by the user, So in this way making the card specific to the current user

## Setup

The following sections will help you set up the toolkit plugin.

1. Install the plugin by running this command

```bash
# From your Backstage root directory
yarn add --cwd packages/app @backstage/plugin-toolkit
```

## Create a route for the toolkit

1. Import the ToolkitPage from `@backstage/plugin-toolkit`.
2. You can then provide a route to `Toolkit` in the backstage front end.

```tsx
import { ToolkitPage } from '@backstage/plugin-toolkit';

<Route path="/toolkit" element={<ToolkitPage />} />;
```

## Add a Toolkit react component

1. Import the Toolkit React component from `@backstage/plugin-toolkit`
2. You can then use the provided React component `Toolkit` in the backstage front end where ever you want.

```tsx
import { ToolkitPage } from '@backstage/plugin-toolkit';

// ...
<Grid item xs={12} md={4}>
  <ToolkitPage />
</Grid>;
// ...
```

## Dependencies

> React redux
> Redux toolkit
> Material-ui

## Getting started

Your plugin has been added to the example app in this repository, meaning you'll be able to access it by running `yarn start` in the root directory, and then navigating to [/toolkit](http://localhost:3000/toolkit).

You can also serve the plugin in isolation by running `yarn start` in the plugin directory.
This method of serving the plugin provides quicker iteration speed and a faster startup and hot reloads.
It is only meant for local development, and the setup for it can be found inside the [/dev](./dev) directory.
