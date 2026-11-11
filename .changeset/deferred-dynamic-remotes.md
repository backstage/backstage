---
'@backstage/frontend-dynamic-feature-loader': patch
---

Added an experimental `app.experimental.deferredRemotes` option. When it is enabled, the plugins of dynamic frontend plugin remotes that can be deferred are loaded the first time one of their pages or elements is rendered, rather than before the app starts. Set it to `true`, or to an object with an `exclude` list of package names whose plugins are always loaded before the app starts. Remotes without a frontend manifest are loaded as before.
