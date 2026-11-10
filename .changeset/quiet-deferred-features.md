---
'@backstage/frontend-app-api': patch
'@backstage/frontend-defaults': patch
'@backstage/plugin-app': patch
---

Added experimental support for deferred plugins. When `app.experimental.deferredPackages` is enabled, deferrable plugins start out as stand-ins built from their build-time manifest, and the real plugin code is loaded the first time one of its pages is visited or one of its elements, such as an entity content tab, is rendered. The APIs of a deferred plugin become available once it has loaded, so they should only be used by the plugin itself. Config in `app.extensions` for a deferred element is applied once the plugin has loaded. If the config changes what the element shows before then, for example its title or filter, the plugin is loaded normally instead. The navigation sidebar now also updates when a deferred plugin is loaded.
