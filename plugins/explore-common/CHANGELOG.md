# @backstage/plugin-explore-common

## 0.0.1

### Patch Changes

- 4dec6f16be: Added new `@backstage/plugin-explore-backend` & `@backstage/plugin-explore-common` packages.

  This deprecates the `ExploreToolsConfig` API (in `@backstage/plugin-explore-react`) which is replaced by the `ExploreApi` & `ExploreClient`. The list of `ExploreTool` data can now be provided on the backend by either using the supplied `StaticExploreToolProvider` or by implementing a custom `ExploreToolProvider`. See the [explore-backend README](https://github.com/backstage/backstage/blob/master/plugins/explore-backend/README.md) for full details.

  NOTE: Existing installations that have customized the `ExploreToolConfig` will continue to work through the new `ExploreClient`. However, existing data should be migrated over to new `explore-backend` plugin as `ExploreToolConfig` will be removed in the future.

  BREAKING CHANGE: If you have previously installed the `explore` plugin, but not yet customized the `ExploreToolConfig` API in your `packages/app`, this will result in an empty list of tools.

## 0.0.1-next.0

### Patch Changes

- 4dec6f16be: Added new `@backstage/plugin-explore-backend` & `@backstage/plugin-explore-common` packages.

  This deprecates the `ExploreToolsConfig` API (in `@backstage/plugin-explore-react`) which is replaced by the `ExploreApi` & `ExploreClient`. The list of `ExploreTool` data can now be provided on the backend by either using the supplied `StaticExploreToolProvider` or by implementing a custom `ExploreToolProvider`. See the [explore-backend README](https://github.com/backstage/backstage/blob/master/plugins/explore-backend/README.md) for full details.

  NOTE: Existing installations that have customized the `ExploreToolConfig` will continue to work through the new `ExploreClient`. However, existing data should be migrated over to new `explore-backend` plugin as `ExploreToolConfig` will be removed in the future.

  BREAKING CHANGE: If you have previously installed the `explore` plugin, but not yet customized the `ExploreToolConfig` API in your `packages/app`, this will result in an empty list of tools.
