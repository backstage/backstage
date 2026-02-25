---
id: feature-flags
title: Feature Flags
description: Details the process of defining setting and reading a feature flag.
---

Backstage offers the ability to define feature flags inside a plugin or during application creation. This allows you to restrict parts of your plugin to those individual users who have toggled the feature flag to on.

This page describes the process of defining, setting and reading a feature flag. If you are looking for using feature flags specifically with software templates please see [Writing Templates](https://backstage.io/docs/features/software-templates/writing-templates#remove-sections-or-fields-based-on-feature-flags).

## Defining a Feature Flag

### In a plugin

Defining a feature flag in a plugin is done by passing the name of the feature flag into the `featureFlags` array:

```ts title="src/plugin.ts"
import { createPlugin } from '@backstage/core-plugin-api';

export const examplePlugin = createPlugin({
  // ...
  featureFlags: [{ name: 'show-example-feature' }],
  // ...
});
```

### In the application

Defining a feature flag in the application is done by adding feature flags in `featureFlags` array in the
`createApp()` function call:

```ts title="packages/app/src/App.tsx"
import { createApp } from '@backstage/app-defaults';

const app = createApp({
  // ...
  featureFlags: [
    {
      // pluginId is required for feature flags used in plugins.
      // pluginId can be left blank for a feature flag used in the application and not in plugins.
      pluginId: '',
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

## FeatureFlagged Component

The easiest way to control content based on the state of a feature flag is to use the [FeatureFlagged](https://backstage.io/api/stable/functions/_backstage_core-app-api.FeatureFlagged.html) component.

```ts
import { FeatureFlagged } from '@backstage/core-app-api';

...

<FeatureFlagged with="show-example-feature">
  <NewFeatureComponent />
</FeatureFlagged>

<FeatureFlagged without="show-example-feature">
  <PreviousFeatureComponent />
</FeatureFlagged>
```

## Evaluating Feature Flag State

It is also possible to query a feature flag using the [FeatureFlags Api](https://backstage.io/api/stable/interfaces/_backstage_core-plugin-api.index.FeatureFlagsApi.html).

```ts
import { useApi, featureFlagsApiRef } from '@backstage/core-plugin-api';

const featureFlagsApi = useApi(featureFlagsApiRef);
const isOn = featureFlagsApi.isActive('show-example-feature');
```
