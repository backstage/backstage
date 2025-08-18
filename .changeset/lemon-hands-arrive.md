---
'@backstage/frontend-app-api': patch
---

External route references are no longer required to be exported via a plugin instance to function. The default target will still be resolved even if the external route reference is not included in `externalRoutes` of a plugin, but users of the plugin will not be able to configure the target of the route. This is particularly useful when building modules or overrides for existing plugins, allowing you add external routes both within and out from the plugin.
