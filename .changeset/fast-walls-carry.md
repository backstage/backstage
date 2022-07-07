---
'@internal/plugin-catalog-customized': patch
---

Introduced plugin options for the components, to be able to customise existing components.
The author of the component might define the configurable places of the component, and the user of this
component can reconfigure it if necessary.

---

## @backstage/app-defaults

Introduced an extra parameter in BackstagePlugin.
This optional parameter is responsible for providing a type for input options for the plugin.

---

## @backstage/core-app-api

Introduced an extra parameter in BackstagePlugin.
This optional parameter is responsible for providing a type for input options for the plugin.

---

## @backstage/core-plugin-api

Introduced plugin options for the components, to be able to customise existing components.
Those customizations are stored in React context of the plugin.
The configurable options could be defined during the creation of the plugin via `__experimentalConfigure` method.
And the user of the plugin can redefine it with

```
myPlugin.__experimentalReconfigure({
...
});
```

---

## @backstage/plugin-catalog

Plugin catalog has been modified to use an experimental feature where you can customize the title of the create button.

You can modify it by doing next:

```typescript jsx
import { catalogPlugin } from '@backstage/plugin-catalog';

catalogPlugin.__experimentalReconfigure({
  createButtonTitle: 'New',
});
```
