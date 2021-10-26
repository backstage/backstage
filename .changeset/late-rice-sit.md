---
'@backstage/core-components': patch
---

Added a new `withDefaults` method that accepts a set of `AppOptions` and add the default components, themes and icons. It is intended to be used together with `createApp` from `@backstage/core-app-api` like this: `createApp(withDefaults({ ... }))`.
