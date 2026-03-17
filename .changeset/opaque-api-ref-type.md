---
'@backstage/frontend-plugin-api': patch
---

Added a builder form for `createApiRef` in the new frontend system and deprecated the direct `createApiRef({ ... })` call in favor of `createApiRef().with({ ... })`. The builder form now also preserves literal API ref IDs in the resulting `ApiRef` type.

The `createApiRef().with({ ... })` form can also use an explicit `pluginId` to declare API ownership without encoding the plugin ID into the API ref ID, while keeping that metadata internal to runtime handling.
