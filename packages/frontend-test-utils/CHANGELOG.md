# @backstage/frontend-test-utils

## 0.1.0-next.2

### Patch Changes

- 818eea4: Updates for compatibility with the new extension IDs.
- b9aa6e4: Migrate `renderInTestApp` to `@backstage/frontend-test-utils` for testing individual React components in an app.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.4.0-next.2
  - @backstage/frontend-app-api@0.4.0-next.2
  - @backstage/test-utils@1.4.6-next.2
  - @backstage/types@1.1.1

## 0.1.0-next.1

### Patch Changes

- e539735435: Updates for `core.router` addition.
- c21c9cf07b: Re-export mock API implementations as well as `TestApiProvider`, `TestApiRegistry`, `withLogCollector`, and `setupRequestMockHandlers` from `@backstage/test-utils`.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.4.0-next.1
  - @backstage/frontend-app-api@0.4.0-next.1
  - @backstage/test-utils@1.4.6-next.1
  - @backstage/types@1.1.1

## 0.1.0-next.0

### Minor Changes

- 59fabd5106: New testing utility library for `@backstage/frontend-app-api` and `@backstage/frontend-plugin-api`.

### Patch Changes

- 59fabd5106: Added `createExtensionTester` for rendering extensions in tests.
- Updated dependencies
  - @backstage/frontend-app-api@0.3.1-next.0
  - @backstage/frontend-plugin-api@0.3.1-next.0
  - @backstage/test-utils@1.4.6-next.0
  - @backstage/types@1.1.1
