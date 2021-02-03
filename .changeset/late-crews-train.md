---
'example-app': patch
'@backstage/plugin-rollbar': patch
---

Migrated to new composability API, exporting the plugin instance as `rollbarPlugin`, the entity page content as `EntityRollbarContent`, and entity conditional as `isRollbarAvailable`. Updated the `EntityPage` for the `example-app` to include a composite `ErrorsSwitcher` component that works with both `Sentry` & `Rollbar`. Also removed the unused and undocumented `RollbarHome` related components.
