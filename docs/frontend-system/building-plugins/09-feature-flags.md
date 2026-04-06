---
id: feature-flags
title: Feature Flags
sidebar_label: Feature Flags
description: Defining and using feature flags in plugins and apps
---

Backstage offers the ability to define feature flags inside a plugin or during application creation. This allows you to restrict parts of your plugin to those individual users who have toggled the feature flag to on.

This page describes the process of defining, setting and reading a feature flag. If you are looking for using feature flags specifically with software templates please see [Writing Templates](https://backstage.io/docs/features/software-templates/writing-templates#remove-sections-or-fields-based-on-feature-flags).

## Defining a Feature Flag

### In a plugin

Feature flags are declared via the `featureFlags` option in `createFrontendPlugin`:

```ts title="src/plugin.ts"
import { createFrontendPlugin } from '@backstage/frontend-plugin-api';

export const examplePlugin = createFrontendPlugin({
  pluginId: 'example',
  featureFlags: [
    {
      name: 'show-example-feature',
      description: 'Enables the new beta dashboard view',
    },
  ],
  extensions: [
    // ...
  ],
});
```

Note that the `description` property is optional. If not provided, the default "Registered in {pluginId} plugin" message is shown.

### In the application

Defining a feature flag in the application is done by adding feature flags in the `featureFlags` array in the
`createApp()` function call:

```ts title="packages/app/src/App.tsx"
import { createApp } from '@backstage/frontend-defaults';

const app = createApp({
  // ...
  featureFlags: [
    {
      name: 'tech-radar',
      description: 'Enables the tech radar plugin',
    },
  ],
  // ...
});
```

## Enabling Feature Flags

Feature flags are defaulted to off and can be updated by individual users in the backstage interface. These are set by navigating to the page under `Settings` > `Feature Flags`.

The user's selection is saved in the user's browser local storage. Once a feature flag is toggled it may be required for a user to refresh the page to see the change.

## Evaluating Feature Flag State

You can query a feature flag using the [FeatureFlagsApi](https://backstage.io/api/stable/interfaces/_backstage_frontend-plugin-api.index.FeatureFlagsApi.html):

```tsx
import { useApi, featureFlagsApiRef } from '@backstage/frontend-plugin-api';

function MyComponent() {
  const featureFlagsApi = useApi(featureFlagsApiRef);

  if (featureFlagsApi.isActive('show-example-feature')) {
    return <NewFeatureComponent />;
  }
  return <PreviousFeatureComponent />;
}
```
