---
'@backstage/app-defaults': none
'@backstage/core-app-api': none
'@backstage/core-plugin-api': none
'@backstage/plugin-catalog': none
---

Introduced plugin options for the components, to be able to customise existing components.
The author of the component might define the configurable places of the component, and the user of this
component can reconfigure it if necessary.

The configurable options could be defined during the creation of the plugin via `__experimentalConfigure` method.
And the user of the plugin can redefine it with

```typescript jsx
import { catalogPlugin } from '@backstage/plugin-catalog';

catalogPlugin.__experimentalReconfigure({
  createButtonTitle: 'New',
});
```

Also introduced an extra parameter in BackstagePlugin.
This optional parameter is responsible for providing a type for input options for the plugin.
