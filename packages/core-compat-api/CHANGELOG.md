# @backstage/core-compat-api

## 0.2.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.12.0-next.1
  - @backstage/core-plugin-api@1.9.0-next.1
  - @backstage/frontend-plugin-api@0.6.0-next.2
  - @backstage/version-bridge@1.0.7

## 0.2.0-next.1

### Minor Changes

- e586f79: Add support to the new analytics api.

### Patch Changes

- edfd3a5: Updated dependency `@oriflame/backstage-plugin-score-card` to `^0.8.0`.
- bc621aa: Updates to use the new `RouteResolutionsApi`.
- 46b63de: Allow external route refs in the new system to have a `defaultTarget` pointing to a route that it'll resolve to by default if no explicit bindings were made by the adopter.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.6.0-next.1
  - @backstage/core-plugin-api@1.8.3-next.0
  - @backstage/core-app-api@1.11.4-next.0
  - @backstage/version-bridge@1.0.7

## 0.1.2-next.0

### Patch Changes

- 1fa5041: The backwards compatibility provider will now use the new `ComponentsApi` and `IconsApi` when implementing the old `AppContext`.
- 7155c30: Added `convertLegacyRouteRefs` for bulk conversion of plugin routes.
- 2f2a1d2: Plugins converted by `convertLegacyApp` now have their `routes` and `externalRoutes` included as well, allowing them to be used to bind external routes in configuration.
- 1184990: collectLegacyRoutes throws in case invalid <Route /> element is found
- Updated dependencies
  - @backstage/frontend-plugin-api@0.5.1-next.0
  - @backstage/core-app-api@1.11.3
  - @backstage/core-plugin-api@1.8.2
  - @backstage/version-bridge@1.0.7

## 0.1.1

### Patch Changes

- 4c1f50c: Make `convertLegacyApp` wrap discovered routes with `compatWrapper`.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.5.0
  - @backstage/core-plugin-api@1.8.2
  - @backstage/core-app-api@1.11.3
  - @backstage/version-bridge@1.0.7

## 0.1.1-next.2

### Patch Changes

- 4c1f50c: Make `convertLegacyApp` wrap discovered routes with `compatWrapper`.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.4.1-next.2

## 0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.8.2-next.0
  - @backstage/core-app-api@1.11.3-next.0
  - @backstage/frontend-plugin-api@0.4.1-next.1
  - @backstage/version-bridge@1.0.7

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.4.1-next.0
  - @backstage/core-app-api@1.11.2
  - @backstage/core-plugin-api@1.8.1
  - @backstage/version-bridge@1.0.7

## 0.1.0

### Minor Changes

- cf5cc4c: Discover plugins and routes recursively beneath the root routes in `collectLecacyRoutes`
- af7bc3e: Switched all core extensions to instead use the namespace `'app'`.
- f63dd72: The `collectLegacyRoutes` has been removed and is replaced by `convertLegacyApp` now being able to convert a `FlatRoutes` element directly.

### Patch Changes

- 03d0b6d: Added `convertLegacyRouteRef` utility to convert existing route refs to be used with the new experimental packages.
- a379243: Leverage the new `FrontendFeature` type to simplify interfaces
- 8226442: Added `compatWrapper`, which can be used to wrap any React element to provide bi-directional interoperability between the `@backstage/core-*-api` and `@backstage/frontend-*-api` APIs.
- 8f5d6c1: Updates to match the new extension input wrapping.
- c219b16: Made package public so it can be published
- b7adf24: Delete alpha DI compatibility helper for components, migrating components should be simple without a helper.
- 046e443: Updates for compatibility with the new extension IDs.
- Updated dependencies
  - @backstage/core-plugin-api@1.8.1
  - @backstage/frontend-plugin-api@0.4.0
  - @backstage/core-app-api@1.11.2
  - @backstage/version-bridge@1.0.7

## 0.1.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.11.2-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/frontend-plugin-api@0.4.0-next.3
  - @backstage/version-bridge@1.0.7

## 0.1.0-next.2

### Minor Changes

- cf5cc4c: Discover plugins and routes recursively beneath the root routes in `collectLecacyRoutes`

### Patch Changes

- 8226442: Added `compatWrapper`, which can be used to wrap any React element to provide bi-directional interoperability between the `@backstage/core-*-api` and `@backstage/frontend-*-api` APIs.
- 8f5d6c1: Updates to match the new extension input wrapping.
- b7adf24: Delete alpha DI compatibility helper for components, migrating components should be simple without a helper.
- 046e443: Updates for compatibility with the new extension IDs.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.4.0-next.2
  - @backstage/core-app-api@1.11.2-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/version-bridge@1.0.7

## 0.0.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.4.0-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/core-app-api@1.11.2-next.1

## 0.0.1-next.0

### Patch Changes

- c219b168aa: Made package public so it can be published

## 0.0.2-next.0

### Patch Changes

- 03d0b6dcdc: Added `convertLegacyRouteRef` utility to convert existing route refs to be used with the new experimental packages.
- Updated dependencies
  - @backstage/core-plugin-api@1.8.1-next.0
  - @backstage/frontend-plugin-api@0.3.1-next.0
  - @backstage/core-app-api@1.11.2-next.0

## 0.0.1

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.3.0
  - @backstage/core-plugin-api@1.8.0

## 0.0.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.3.0-next.2

## 0.0.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.3.0-next.1
  - @backstage/core-plugin-api@1.8.0-next.0

## 0.0.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.3.0-next.0
  - @backstage/core-plugin-api@1.8.0-next.0
