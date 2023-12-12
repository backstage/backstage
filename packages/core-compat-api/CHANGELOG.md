# @backstage/core-compat-api

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
