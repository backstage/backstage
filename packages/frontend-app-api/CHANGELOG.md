# @backstage/frontend-app-api

## 0.2.0

### Minor Changes

- 4461d87d5a: Removed support for the new `useRouteRef`.
- 9d03dfe5e3: The `createApp` config option has been replaced by a new `configLoader` option. There is now also a `pluginLoader` option that can be used to dynamically load plugins into the app.
- d7c5d80c57: The hidden `'root'` extension has been removed and has instead been made an input of the `'core'` extension. The checks for rejecting configuration of the `'root'` extension to rejects configuration of the `'core'` extension instead.
- d920b8c343: Added support for installing `ExtensionOverrides` via `createApp` options. As part of this change the `plugins` option has been renamed to `features`, and the `pluginLoader` has been renamed to `featureLoader`.

### Patch Changes

- 322bbcae24: Internal update for removal of experimental plugin configuration API.
- f78ac58f88: Filters for discovered packages are now also applied at runtime. This makes it possible to disable packages through the `app.experimental.packages` config at runtime.
- 68ffb9e67d: The app will now reject any extensions that attach to nonexistent inputs.
- 5072824817: Implement `toString()` and `toJSON()` for extension instances.
- 1e60a9c3a5: Fixed an issue preventing the routing system to match subroutes
- 52366db5b3: Make themes configurable through extensions, and switched default themes to use extensions instead.
- 2ecd33618a: Added the `bindRoutes` option to `createApp`.
- e5a2956dd2: Register default api implementations when creating declarative integrated apps.
- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- 06432f900c: Updates for `at` -> `attachTo` refactor.
- 1718ec75b7: Added support for the existing routing system.
- 66d51a4827: Prevents root extension override and duplicated plugin extensions.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.2.0
  - @backstage/core-app-api@1.11.0
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/plugin-graphiql@0.2.55
  - @backstage/version-bridge@1.0.6
  - @backstage/theme@0.4.3
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## 0.2.0-next.2

### Minor Changes

- 4461d87d5a: Removed support for the new `useRouteRef`.

### Patch Changes

- 5072824817: Implement `toString()` and `toJSON()` for extension instances.
- 06432f900c: Updates for `at` -> `attachTo` refactor.
- 1718ec75b7: Added support for the existing routing system.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.2.0-next.2
  - @backstage/core-app-api@1.11.0-next.2
  - @backstage/core-components@0.13.6-next.2
  - @backstage/core-plugin-api@1.7.0-next.1
  - @backstage/plugin-graphiql@0.2.55-next.2
  - @backstage/theme@0.4.3-next.0
  - @backstage/config@1.1.1-next.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.5

## 0.2.0-next.1

### Patch Changes

- 52366db5b3: Make themes configurable through extensions, and switched default themes to use extensions instead.
- e5a2956dd2: Register default api implementations when creating declarative integrated apps.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.1.1-next.1
  - @backstage/core-components@0.13.6-next.1
  - @backstage/core-app-api@1.10.1-next.1
  - @backstage/plugin-graphiql@0.2.55-next.1
  - @backstage/core-plugin-api@1.7.0-next.0
  - @backstage/config@1.1.0
  - @backstage/theme@0.4.2
  - @backstage/types@1.1.1

## 0.2.0-next.0

### Minor Changes

- 9d03dfe5e3: The `createApp` config option has been replaced by a new `configLoader` option. There is now also a `pluginLoader` option that can be used to dynamically load plugins into the app.

### Patch Changes

- 322bbcae24: Internal update for removal of experimental plugin configuration API.
- 66d51a4827: Prevents root extension override and duplicated plugin extensions.
- Updated dependencies
  - @backstage/core-plugin-api@1.7.0-next.0
  - @backstage/core-components@0.13.6-next.0
  - @backstage/frontend-plugin-api@0.1.1-next.0
  - @backstage/config@1.1.0
  - @backstage/core-app-api@1.10.1-next.0
  - @backstage/plugin-graphiql@0.2.55-next.0
  - @backstage/types@1.1.1

## 0.1.0

### Minor Changes

- 628ca7e458e4: Initial release

### Patch Changes

- Updated dependencies
  - @backstage/plugin-graphiql@0.2.54
  - @backstage/frontend-plugin-api@0.1.0
  - @backstage/core-components@0.13.5
  - @backstage/config@1.1.0
  - @backstage/core-app-api@1.10.0
  - @backstage/core-plugin-api@1.6.0
  - @backstage/types@1.1.1

## 0.1.0-next.0

### Minor Changes

- 628ca7e458e4: Initial release

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.1.0-next.0
  - @backstage/plugin-graphiql@0.2.54-next.3
  - @backstage/config@1.1.0-next.2
  - @backstage/core-app-api@1.10.0-next.3
  - @backstage/core-components@0.13.5-next.3
  - @backstage/core-plugin-api@1.6.0-next.3
  - @backstage/types@1.1.1-next.0

## 0.0.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-graphiql@0.2.54-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/frontend-plugin-api@0.0.1-next.0
  - @backstage/types@1.1.0

## 0.0.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.0
  - @backstage/plugin-graphiql@0.2.54-next.1
  - @backstage/frontend-plugin-api@0.0.0
  - @backstage/types@1.1.0
