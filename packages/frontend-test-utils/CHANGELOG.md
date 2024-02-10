# @backstage/frontend-test-utils

## 0.1.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.6.0-next.2
  - @backstage/frontend-app-api@0.6.0-next.2
  - @backstage/test-utils@1.5.0-next.2
  - @backstage/types@1.1.1

## 0.1.2-next.1

### Patch Changes

- bc621aa: Updates to use the new `RouteResolutionsApi`.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.6.0-next.1
  - @backstage/frontend-app-api@0.6.0-next.1
  - @backstage/test-utils@1.5.0-next.1
  - @backstage/types@1.1.1

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-app-api@0.6.0-next.0
  - @backstage/frontend-plugin-api@0.5.1-next.0
  - @backstage/test-utils@1.5.0-next.0
  - @backstage/types@1.1.1

## 0.1.1

### Patch Changes

- f7566f9: Updates to reflect the `app/router` extension having been renamed to `app/root`.
- 516fd3e: Updated README to reflect release status
- c97fa1c: Added `elements`, `wrappers`, and `router` inputs to `app/root`, that let you add things to the root of the React tree above the layout. You can use the `createAppRootElementExtension`, `createAppRootWrapperExtension`, and `createRouterExtension` extension creator, respectively, to conveniently create such extensions. These are all optional, and if you do not supply a router a default one will be used (`BrowserRouter` in regular runs, `MemoryRouter` in tests/CI).
- Updated dependencies
  - @backstage/frontend-plugin-api@0.5.0
  - @backstage/frontend-app-api@0.5.0
  - @backstage/test-utils@1.4.7
  - @backstage/types@1.1.1

## 0.1.1-next.2

### Patch Changes

- 516fd3e: Updated README to reflect release status
- Updated dependencies
  - @backstage/frontend-plugin-api@0.4.1-next.2
  - @backstage/frontend-app-api@0.4.1-next.2

## 0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/frontend-app-api@0.4.1-next.1
  - @backstage/frontend-plugin-api@0.4.1-next.1
  - @backstage/test-utils@1.4.7-next.1
  - @backstage/types@1.1.1

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.4.1-next.0
  - @backstage/frontend-app-api@0.4.1-next.0
  - @backstage/test-utils@1.4.7-next.0
  - @backstage/types@1.1.1

## 0.1.0

### Minor Changes

- 59fabd5: New testing utility library for `@backstage/frontend-app-api` and `@backstage/frontend-plugin-api`.
- af7bc3e: Switched all core extensions to instead use the namespace `'app'`.

### Patch Changes

- 59fabd5: Added `createExtensionTester` for rendering extensions in tests.
- 7e4b0db: The `createExtensionTester` helper is now able to render more than one route in the test app.
- 818eea4: Updates for compatibility with the new extension IDs.
- b9aa6e4: Migrate `renderInTestApp` to `@backstage/frontend-test-utils` for testing individual React components in an app.
- e539735: Updates for `core.router` addition.
- c21c9cf: Re-export mock API implementations as well as `TestApiProvider`, `TestApiRegistry`, `withLogCollector`, and `setupRequestMockHandlers` from `@backstage/test-utils`.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.4.0
  - @backstage/frontend-app-api@0.4.0
  - @backstage/test-utils@1.4.6
  - @backstage/types@1.1.1

## 0.1.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/frontend-app-api@0.4.0-next.3
  - @backstage/frontend-plugin-api@0.4.0-next.3
  - @backstage/test-utils@1.4.6-next.2
  - @backstage/types@1.1.1

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
