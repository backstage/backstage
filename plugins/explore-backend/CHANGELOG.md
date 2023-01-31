# @backstage/plugin-explore-backend

## 0.0.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2-next.1
  - @backstage/config@1.0.6
  - @backstage/plugin-explore-common@0.0.1
  - @backstage/plugin-search-common@1.2.1

## 0.0.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2-next.0

## 0.0.2

### Patch Changes

- 358554ff3c: Bump `msw` to `^0.49.0`
- 9f9d279bd1: Updated `README.md` examples
- Updated dependencies
  - @backstage/backend-common@0.18.0
  - @backstage/config@1.0.6
  - @backstage/plugin-explore-common@0.0.1
  - @backstage/plugin-search-common@1.2.1

## 0.0.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.1
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-explore-common@0.0.1
  - @backstage/plugin-search-common@1.2.1-next.0

## 0.0.2-next.1

### Patch Changes

- 9f9d279bd1: Updated `README.md` examples
- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-explore-common@0.0.1
  - @backstage/plugin-search-common@1.2.1-next.0

## 0.0.2-next.0

### Patch Changes

- 358554ff3c: Bump `msw` to `^0.49.0`
- Updated dependencies
  - @backstage/backend-common@0.17.0
  - @backstage/config@1.0.5
  - @backstage/plugin-explore-common@0.0.1
  - @backstage/plugin-search-common@1.2.0

## 0.0.1

### Patch Changes

- 4dec6f16be: Added new `@backstage/plugin-explore-backend` & `@backstage/plugin-explore-common` packages.

  This deprecates the `ExploreToolsConfig` API (in `@backstage/plugin-explore-react`) which is replaced by the `ExploreApi` & `ExploreClient`. The list of `ExploreTool` data can now be provided on the backend by either using the supplied `StaticExploreToolProvider` or by implementing a custom `ExploreToolProvider`. See the [explore-backend README](https://github.com/backstage/backstage/blob/master/plugins/explore-backend/README.md) for full details.

  NOTE: Existing installations that have customized the `ExploreToolConfig` will continue to work through the new `ExploreClient`. However, existing data should be migrated over to new `explore-backend` plugin as `ExploreToolConfig` will be removed in the future.

  BREAKING CHANGE: If you have previously installed the `explore` plugin, but not yet customized the `ExploreToolConfig` API in your `packages/app`, this will result in an empty list of tools.

- Updated dependencies
  - @backstage/backend-common@0.17.0
  - @backstage/plugin-explore-common@0.0.1
  - @backstage/plugin-search-common@1.2.0
  - @backstage/config@1.0.5

## 0.0.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.3
  - @backstage/config@1.0.5-next.1
  - @backstage/plugin-explore-common@0.0.1-next.0
  - @backstage/plugin-search-common@1.2.0-next.3

## 0.0.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.2
  - @backstage/plugin-search-common@1.2.0-next.2
  - @backstage/config@1.0.5-next.1
  - @backstage/plugin-explore-common@0.0.1-next.0

## 0.0.1-next.0

### Patch Changes

- 4dec6f16be: Added new `@backstage/plugin-explore-backend` & `@backstage/plugin-explore-common` packages.

  This deprecates the `ExploreToolsConfig` API (in `@backstage/plugin-explore-react`) which is replaced by the `ExploreApi` & `ExploreClient`. The list of `ExploreTool` data can now be provided on the backend by either using the supplied `StaticExploreToolProvider` or by implementing a custom `ExploreToolProvider`. See the [explore-backend README](https://github.com/backstage/backstage/blob/master/plugins/explore-backend/README.md) for full details.

  NOTE: Existing installations that have customized the `ExploreToolConfig` will continue to work through the new `ExploreClient`. However, existing data should be migrated over to new `explore-backend` plugin as `ExploreToolConfig` will be removed in the future.

  BREAKING CHANGE: If you have previously installed the `explore` plugin, but not yet customized the `ExploreToolConfig` API in your `packages/app`, this will result in an empty list of tools.

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.1
  - @backstage/plugin-explore-common@0.0.1-next.0
  - @backstage/config@1.0.5-next.1
  - @backstage/plugin-search-common@1.1.2-next.1
