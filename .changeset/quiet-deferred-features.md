---
'@backstage/frontend-app-api': patch
'@backstage/frontend-defaults': patch
'@backstage/plugin-app': patch
---

Added experimental support for deferred plugins. When `app.experimental.deferredPackages` is enabled, deferrable plugins start out as stand-ins built from their build-time manifest, and the real plugin code is loaded the first time one of its pages is visited or one of its elements, such as an entity content tab, is rendered. The utility APIs of a deferred plugin become available once it has loaded, so they should only be used by the plugin itself, unless they are part of its `./sync` entry point. The extensions of a `./sync` entry point are installed with the app and kept as they are when the rest of the plugin loads. Entity filters that are given as filter predicate objects keep working before a deferred plugin has loaded. A plugin with any `app.extensions` config for one of its element extensions is loaded together with the app instead of being deferred. The navigation sidebar now also updates when a deferred plugin is loaded.
