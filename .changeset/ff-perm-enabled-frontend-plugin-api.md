---
'@backstage/frontend-plugin-api': patch
---

Added `enabled` option to `createExtension`, `createExtensionBlueprint`, and `AppNodeSpec`, accepting a `FilterPredicate` from `@backstage/filter-predicates` to conditionally enable extensions based on feature flags or other runtime conditions.

Added `permissions` option to `createFrontendPlugin` and `createFrontendModule`, allowing plugins and modules to declare which permissions they use. These permissions are checked at app startup so that extensions can conditionally enable themselves using a `permissions` predicate, e.g. `enabled: { permissions: { $contains: 'catalog.entity.create' } }`.
