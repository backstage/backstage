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

[Read more about the router here](createPlugin-router.md)

## Example Uses

### Creating a basic plugin

Showcasing adding multiple routes and a redirect.

```jsx
import { createPlugin } from '@spotify-backstage/core';
import ExampleComponent from './components/ExampleComponent';

export default createPlugin({
  id: 'new-plugin',
  register({ router }) {
    router.registerRoute('/new-plugin', ExampleComponent);
  },
});
```

[Back to References](README.md)
