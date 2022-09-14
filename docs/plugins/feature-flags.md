---
id: feature-flags
title: Feature Flags
description: Details the process of defining setting and reading a plugin feature flag.
---

Backstage offers the ability to define feature flags inside a plugin. This allows you to restrict parts of your plugin to those individual users who have toggled the feature flag to on.

This page describes the process of defining setting and reading a plugin feature flag. If you are looking for using feature flags with software templates that can be found under [Writing Templates](https://backstage.io/docs/features/software-templates/writing-templates#remove-sections-or-fields-based-on-feature-flags).

## Defining a Feature Flag

Before using a feature flag we must first define it. This is done when we create the plugin by passing the name of the feature flag into the `featureFlags` array.

```ts
/* src/plugin.ts */
import { createPlugin, createRouteRef } from '@backstage/core-plugin-api';
import ExampleComponent from './components/ExampleComponent';

export const examplePlugin = createPlugin({
  id: 'example',
  routes: {
    root: rootRouteRef,
  },
  featureFlags: [{ name: 'show-example-feature' }],
});
```

## Enabling Feature Flags

Feature flags are defaulted to off and can be updated by individual users in the backstage interface.

These are set by navigating to the page under `Settings` > `Feature Flags`.

The users selection is saved in the users browsers local storage. Once toggled it may be required for a user to refresh the page to see any new changes.

## FeatureFlagged Component

The easiest way to control content based on the state of a feature flag is to use the [FeatureFlagged](https://backstage.io/docs/reference/core-app-api.featureflagged) component.

```ts
import { FeatureFlagged } from '@backstage/core-app-api'

...

<FeatureFlagged with="show-example-feature">
  <NewFeatureComponent />
</FeatureFlagged>

<FeatureFlagged without="show-example-feature">
  <PreviousFeatureComponent />
</FeatureFlagged>
```

## Evaluating Feature Flag State

It is also possible to test the feature flag state using the [FeatureFlags Api](https://backstage.io/docs/reference/core-plugin-api.featureflagsapi).

```ts
import { useApi, featureFlagsApiRef } from '@backstage/core-plugin-api';

const featureFlagsApi = useApi(featureFlagsApiRef);
const isOn = featureFlagsApi.isActive('show-example-feature');
```
