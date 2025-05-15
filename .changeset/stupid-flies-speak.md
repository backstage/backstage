---
'@backstage/frontend-app-api': patch
---

Implemented support for the `plugin.info()` method in specialized apps with a default resolved for `package.json` and `catalog-info.yaml`. The default resolution logic can be overridden via the `pluginInfoResolver` option to `createSpecializedApp`, and plugin-specific overrides can be applied via the new `app.pluginOverrides` key in static configuration.
