---
'@backstage/core-plugin-api': patch
---

Introduced plugin options for the components, to be able to customise existing components.
Those customizations are stored in React context of the plugin.
The configurable options could be defined during the creation of the plugin via `__experimentalConfigure` method.
And the user of the plugin can redefine it with.
