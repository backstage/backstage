# createPlugin

Taking a plugin config as argument and returns a new plugin.

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

Showcasing adding multiple routes, a feature flag and a redirect.

```jsx
import { createPlugin } from '@backstage/core';
import ExampleComponent from './components/ExampleComponent';

export default createPlugin({
  id: 'new-plugin',
  register({ router, featureFlags: { registerFeatureFlag } }) {
    registerFeatureFlag('enable-example-component');

    router.registerRoute('/new-plugin', ExampleComponent);
  },
});
```

[Back to References](README.md)
