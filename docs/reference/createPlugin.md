---
id: createPlugin
title: createPlugin
description: Documentation on createPlugin
---

Takes a plugin config as an argument and returns a new plugin.

## Plugin Config

```typescript
function createPlugin(config: PluginConfig): BackstagePlugin;

type PluginConfig = {
  id: string;
  register?(hooks: PluginHooks): void;
};

type PluginHooks = {
  router: RouterHooks;
};
```

- [Read more about the router here](createPlugin-router.md)
- [Read more about feature flags here](createPlugin-feature-flags.md)

## Example Uses

### Creating a basic plugin

Showcasing adding a route and a feature flag.

```jsx
import { createPlugin, createRouteRef } from '@backstage/core';
import ExampleComponent from './components/ExampleComponent';

export const rootRouteRef = createRouteRef({
  path: '/new-plugin',
  title: 'New Plugin',
});

export default createPlugin({
  id: 'new-plugin',
  register({ router, featureFlags }) {
    router.addRoute(rootRouteRef, ExampleComponent);
    featureFlags.register('enable-example-component');
  },
});
```
