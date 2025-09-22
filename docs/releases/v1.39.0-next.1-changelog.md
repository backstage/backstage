# Release v1.39.0-next.1

Upgrade Helper: [https://backstage.github.io/upgrade-helper/?to=1.39.0-next.1](https://backstage.github.io/upgrade-helper/?to=1.39.0-next.1)

## @backstage/plugin-catalog-backend@2.0.0-next.1

### Major Changes

- 90ab044: **BREAKING**: Removed all deprecated exports, and removed support for the old backend system.

  It also removes the `CodeOwnersProcessor` from the default set of processors, because it is expensive to run and has vague semantics. You need to update your backend to add it to the `catalogProcessingExtensionPoint` if you wish to continue using it.

  The following removed exports are available from `@backstage/plugin-catalog-node`:

  - `locationSpecToMetadataName`
  - `locationSpecToLocationEntity`
  - `processingResult`
  - `EntitiesSearchFilter`
  - `EntityFilter`
  - `DeferredEntity`
  - `EntityRelationSpec`
  - `CatalogProcessor`
  - `CatalogProcessorParser`
  - `CatalogProcessorCache`
  - `CatalogProcessorEmit`
  - `CatalogProcessorLocationResult`
  - `CatalogProcessorEntityResult`
  - `CatalogProcessorRelationResult`
  - `CatalogProcessorErrorResult`
  - `CatalogProcessorRefreshKeysResult`
  - `CatalogProcessorResult`
  - `EntityProvider`
  - `EntityProviderConnection`
  - `EntityProviderMutation`
  - `AnalyzeOptions`
  - `LocationAnalyzer`
  - `ScmLocationAnalyzer`
  - `PlaceholderResolver`
  - `PlaceholderResolverParams`
  - `PlaceholderResolverRead`
  - `PlaceholderResolverResolveUrl`
  - `parseEntityYaml`

  The following removed exports are available from `@backstage/plugin-catalog-common`:

  - `LocationSpec`
  - `AnalyzeLocationRequest`
  - `AnalyzeLocationResponse`
  - `AnalyzeLocationExistingEntity`
  - `AnalyzeLocationGenerateEntity`
  - `AnalyzeLocationEntityField`

  The following removed exports are instead implemented in the new backend system by `@backstage/plugin-search-backend-module-catalog`:

  - `defaultCatalogCollatorEntityTransformer`
  - `CatalogCollatorEntityTransformer`
  - `DefaultCatalogCollator`

  The following exports are removed without a direct replacement:

  - `DefaultCatalogCollatorFactory`
  - `DefaultCatalogCollatorFactoryOptions`
  - `LocationEntityProcessor`
  - `LocationEntityProcessorOptions`
  - `CatalogBuilder`
  - `CatalogEnvironment`
  - `CatalogPermissionRuleInput`
  - `CatalogProcessingEngine`
  - `createRandomProcessingInterval`
  - `ProcessingIntervalFunction`

### Minor Changes

- 6c9b88e: **BREAKING ALPHA**: You can no longer import the catalog plugin from the `/alpha` export; please use the regular root default export instead.
- d88b922: Adds the ability to disable the default entity processors using a new boolean app config item `catalog.disableDefaultProcessors`.

### Patch Changes

- 0e710fc: This patch addresses an issue identified in Backstage when configured with a MySQL database. If an entity of type location
  (e..all.yaml) has more than 70 referenced entities, clicking "Refresh" does not update the referenced entities as expected. This occurs because the TEXT type in MySQL has a limit of 65,535 bytes, which is insufficient to store all the referenced entities, causing the refresh operation to fail.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/integration@1.16.4-next.1
  - @backstage/plugin-permission-common@0.9.0-next.0
  - @backstage/plugin-permission-node@0.10.0-next.1
  - @backstage/backend-openapi-utils@0.5.3-next.1
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.4-next.0
  - @backstage/plugin-events-node@0.4.11-next.1

## @backstage/backend-defaults@0.10.0-next.1

### Minor Changes

- d385854: **BREAKING**: The `DefaultSchedulerService` constructor options now requires `RootLifecycleService`, `HttpRouterService`, and `PluginMetadataService` fields.

  The scheduler will register a REST API for listing and triggering tasks. Please see [the scheduler documentation](https://backstage.io/docs/backend-system/core-services/scheduler) for more details about this API.

### Patch Changes

- acea1d4: update documentation
- 72d019d: Removed various typos
- c6bc67d: Added Valkey support alongside Redis in backend-defaults cache clients, using the new Keyv Valkey package. Also extended backend-test-utils to support Valkey in tests.
- 36f77e9: Bug fix: Pass user provided token through to gitlab url resolvers
- Updated dependencies
  - @backstage/backend-app-api@1.2.3-next.1
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/integration@1.16.4-next.1
  - @backstage/plugin-permission-node@0.10.0-next.1
  - @backstage/config-loader@1.10.1-next.0
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/cli-node@0.2.13
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.15
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.11-next.1

## @backstage/backend-test-utils@1.5.0-next.1

### Minor Changes

- c6bc67d: Added Valkey support alongside Redis in backend-defaults cache clients, using the new Keyv Valkey package. Also extended backend-test-utils to support Valkey in tests.

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.10.0-next.1
  - @backstage/backend-app-api@1.2.3-next.1
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.11-next.1

## @backstage/canon@0.4.0-next.1

### Minor Changes

- ea36f74: **Breaking Change** Icons on Button and IconButton now need to be imported and placed like this: &lt;Button iconStart={<ChevronDownIcon />} />

### Patch Changes

- 720033c: For improved a11y, clicking a Select component label now focuses the Select trigger element, and the TextField component's label is now styled to indicate it's interactive.
- 206ffbe: Fixed an issue with Canon's DataTable.Pagination component showing the wrong number for the "to" count.
- 72d019d: Removed various typos

## @backstage/plugin-catalog-backend-module-msgraph@0.7.0-next.1

### Minor Changes

- 20c1ea7: Add new `userGroupMember.path`, `user.path` and, `group.path` option to each query type to allow more complex msgraph queries

### Patch Changes

- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.4-next.0

## @backstage/plugin-catalog-node@1.17.0-next.1

### Minor Changes

- a459f17: Added `parseEntityYaml` from `@backstage/plugin-catalog-backend`, to make it more easily usable by custom plugins and modules

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-permission-common@0.9.0-next.0
  - @backstage/plugin-permission-node@0.10.0-next.1
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.4-next.0

## @backstage/plugin-events-backend-module-github@0.4.0-next.1

### Minor Changes

- ae249fc: **BREAKING**: Removed the `createGithubSignatureValidator` export.

  Added support webhook validation based on `integrations.github.[].apps.[].webhookSecret`.

### Patch Changes

- c7ef81c: Correct README installation instructions.
- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/integration@1.16.4-next.1
  - @backstage/config@1.3.2
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.11-next.1

## @backstage/plugin-kubernetes-node@0.3.0-next.1

### Minor Changes

- 9cdf001: **BREAKING**: The `PinnipedHelper` class now expects a regular `LoggerService` instance from the new backend system, instead of a Winston logger.

### Patch Changes

- 216c6b2: Updated dependency `@kubernetes/client-node` to `1.1.2`.
- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-kubernetes-common@0.9.5-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/types@1.2.1

## @backstage/plugin-permission-backend@0.7.0-next.1

### Minor Changes

- 4da2965: Fixed an issue causing the `PermissionClient` to exhaust the request body size limit too quickly when making many requests.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-permission-common@0.9.0-next.0
  - @backstage/plugin-permission-node@0.10.0-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## @backstage/plugin-permission-common@0.9.0-next.0

### Minor Changes

- 4da2965: Fixed an issue causing the `PermissionClient` to exhaust the request body size limit too quickly when making many requests.

### Patch Changes

- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1

## @backstage/plugin-permission-node@0.10.0-next.1

### Minor Changes

- 4da2965: Fixed an issue causing the `PermissionClient` to exhaust the request body size limit too quickly when making many requests.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-permission-common@0.9.0-next.0
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## @backstage/plugin-scaffolder-backend@1.33.0-next.1

### Minor Changes

- 587cb05: Added `workspace:template` and `workspace:template:file` actions to complement respective `fetch:*` actions

### Patch Changes

- eb39388: Fixed bug in fs:delete that prevented wildcard patterns from matching paths starting with "."
- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/backend-defaults@0.10.0-next.1
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/integration@1.16.4-next.1
  - @backstage/plugin-permission-common@0.9.0-next.0
  - @backstage/plugin-permission-node@0.10.0-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.9-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.9-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.10-next.1
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.9-next.1
  - @backstage/plugin-scaffolder-backend-module-github@0.7.1-next.1
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.9.1-next.1
  - @backstage/plugin-scaffolder-node@0.8.2-next.1
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.8-next.1
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-bitbucket-cloud-common@0.3.0-next.1
  - @backstage/plugin-events-node@0.4.11-next.1
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.9-next.1
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.9-next.1
  - @backstage/plugin-scaffolder-common@1.5.11-next.0

## @backstage/plugin-search-react@1.9.0-next.0

### Minor Changes

- 611c941: Allow search filters to provide labels and values separately, and not only values

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.6.6-next.0
  - @backstage/core-components@0.17.2-next.0
  - @backstage/frontend-plugin-api@0.10.2-next.0
  - @backstage/core-plugin-api@1.10.6
  - @backstage/types@1.2.1
  - @backstage/version-bridge@1.0.11
  - @backstage/plugin-search-common@1.2.18-next.0

## @backstage/app-defaults@1.6.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.6.6-next.0
  - @backstage/core-components@0.17.2-next.0
  - @backstage/core-app-api@1.16.1
  - @backstage/core-plugin-api@1.10.6
  - @backstage/plugin-permission-react@0.4.34-next.0

## @backstage/backend-app-api@1.2.3-next.1

### Patch Changes

- 729a7d6: Added a configuration to permit backend plugin module failures on startup:

  ```yaml
  backend:
    ...
    startup:
      plugins:
        plugin-x:
          modules:
            module-y:
              onPluginModuleBootFailure: continue
  ```

  This configuration permits `plugin-x` with `module-y` to fail on startup. Omitting the
  `onPluginModuleBootFailure` configuration matches the previous behavior, wherein any
  individual plugin module failure is forwarded to the plugin and aborts backend startup.

  The default can also be changed, so that continuing on failure is the default
  unless otherwise specified:

  ```yaml
  backend:
    startup:
      default:
        onPluginModuleBootFailure: continue
      plugins:
        catalog:
          modules:
            github:
              onPluginModuleBootFailure: abort
  ```

- 72d019d: Removed various typos

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## @backstage/backend-dynamic-feature-service@0.7.0-next.1

### Patch Changes

- 72d019d: Fixed various typos.
  `FrontendRemoteResolver`'s misspelled `getAdditionaRemoteInfo` has been deprecated. Use the correct spelling `getAdditionalRemoteInfo` instead.
- Updated dependencies
  - @backstage/plugin-catalog-backend@2.0.0-next.1
  - @backstage/backend-defaults@0.10.0-next.1
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-permission-common@0.9.0-next.0
  - @backstage/plugin-permission-node@0.10.0-next.1
  - @backstage/plugin-scaffolder-node@0.8.2-next.1
  - @backstage/config-loader@1.10.1-next.0
  - @backstage/plugin-events-backend@0.5.2-next.1
  - @backstage/plugin-search-backend-node@1.3.11-next.1
  - @backstage/backend-openapi-utils@0.5.3-next.1
  - @backstage/cli-common@0.1.15
  - @backstage/cli-node@0.2.13
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-app-node@0.1.33-next.1
  - @backstage/plugin-events-node@0.4.11-next.1
  - @backstage/plugin-search-common@1.2.18-next.0

## @backstage/backend-openapi-utils@0.5.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1

## @backstage/backend-plugin-api@1.3.1-next.1

### Patch Changes

- acea1d4: update documentation
- 72d019d: Removed various typos
- d385854: Minor doc comment update
- Updated dependencies
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/plugin-permission-common@0.9.0-next.0
  - @backstage/plugin-permission-node@0.10.0-next.1
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1

## @backstage/cli@0.32.1-next.1

### Patch Changes

- d649df0: Internal code cleanup
- 9aaec54: Internal refactor of opaque type handling.
- 9285385: Added `info` object to the context of the alpha CLI.
- 6cc9507: Updated dependency `@octokit/request` to `^8.0.0`.
- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/integration@1.16.4-next.1
  - @backstage/config-loader@1.10.1-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/cli-common@0.1.15
  - @backstage/cli-node@0.2.13
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/eslint-plugin@0.1.10
  - @backstage/release-manifests@0.0.12
  - @backstage/types@1.2.1

## @backstage/config-loader@1.10.1-next.0

### Patch Changes

- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1

## @backstage/core-compat-api@0.4.2-next.1

### Patch Changes

- fb58f20: Internal update to use the new `pluginId` option of `createFrontendPlugin`.
- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/frontend-plugin-api@0.10.2-next.0
  - @backstage/plugin-catalog-react@1.18.0-next.1
  - @backstage/core-plugin-api@1.10.6
  - @backstage/version-bridge@1.0.11

## @backstage/core-components@0.17.2-next.0

### Patch Changes

- e0d1025: `LogViewer` now supports a `textWrap` prop that wraps log lines to the next line for overflowing content instead of using horizontal scroll
- bb84534: Fix the hidden sidebar's sub-menu when the sidebar is scrollable
- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/theme@0.6.6-next.0
  - @backstage/config@1.3.2
  - @backstage/core-plugin-api@1.10.6
  - @backstage/errors@1.2.7
  - @backstage/version-bridge@1.0.11

## @backstage/create-app@0.6.2-next.1

### Patch Changes

- Bumped create-app version.
- Updated dependencies
  - @backstage/cli-common@0.1.15

## @backstage/dev-utils@1.1.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.6.6-next.0
  - @backstage/core-components@0.17.2-next.0
  - @backstage/plugin-catalog-react@1.18.0-next.1
  - @backstage/app-defaults@1.6.2-next.0
  - @backstage/integration-react@1.2.7-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/core-app-api@1.16.1
  - @backstage/core-plugin-api@1.10.6

## @backstage/frontend-app-api@0.11.2-next.1

### Patch Changes

- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/frontend-plugin-api@0.10.2-next.0
  - @backstage/frontend-defaults@0.2.2-next.1
  - @backstage/config@1.3.2
  - @backstage/core-app-api@1.16.1
  - @backstage/core-plugin-api@1.10.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/version-bridge@1.0.11

## @backstage/frontend-defaults@0.2.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.10.2-next.0
  - @backstage/plugin-app@0.1.9-next.1
  - @backstage/frontend-app-api@0.11.2-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## @backstage/frontend-dynamic-feature-loader@0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.10.2-next.0
  - @backstage/config@1.3.2

## @backstage/frontend-plugin-api@0.10.2-next.0

### Patch Changes

- fb58f20: The `id` option of `createFrontendPlugin` has been renamed to `pluginId` in order to better align with similar APIs in the frontend and backend systems.

  The old `id` option is deprecated and will be removed in a future release.

- 72d019d: Removed various typos

- Updated dependencies
  - @backstage/core-components@0.17.2-next.0
  - @backstage/core-plugin-api@1.10.6
  - @backstage/types@1.2.1
  - @backstage/version-bridge@1.0.11

## @backstage/frontend-test-utils@0.3.2-next.1

### Patch Changes

- fb58f20: Internal update to use the new `pluginId` option of `createFrontendPlugin`.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.10.2-next.0
  - @backstage/plugin-app@0.1.9-next.1
  - @backstage/frontend-app-api@0.11.2-next.1
  - @backstage/test-utils@1.7.8-next.0
  - @backstage/config@1.3.2
  - @backstage/types@1.2.1
  - @backstage/version-bridge@1.0.11

## @backstage/integration@1.16.4-next.1

### Patch Changes

- acea1d4: update documentation
- Updated dependencies
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## @backstage/integration-react@1.2.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.16.4-next.1
  - @backstage/config@1.3.2
  - @backstage/core-plugin-api@1.10.6

## @backstage/repo-tools@0.13.3-next.1

### Patch Changes

- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/config-loader@1.10.1-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/cli-common@0.1.15
  - @backstage/cli-node@0.2.13
  - @backstage/errors@1.2.7

## @techdocs/cli@1.9.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.10.0-next.1
  - @backstage/plugin-techdocs-node@1.13.3-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.2

## @backstage/test-utils@1.7.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.6.6-next.0
  - @backstage/plugin-permission-common@0.9.0-next.0
  - @backstage/config@1.3.2
  - @backstage/core-app-api@1.16.1
  - @backstage/core-plugin-api@1.10.6
  - @backstage/types@1.2.1
  - @backstage/plugin-permission-react@0.4.34-next.0

## @backstage/theme@0.6.6-next.0

### Patch Changes

- 1b14572: Show arrow when MuiTableSortLabel receives focus

## @backstage/plugin-api-docs@0.12.7-next.1

### Patch Changes

- fb58f20: Internal update to use the new `pluginId` option of `createFrontendPlugin`.
- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/core-components@0.17.2-next.0
  - @backstage/frontend-plugin-api@0.10.2-next.0
  - @backstage/core-compat-api@0.4.2-next.1
  - @backstage/plugin-catalog@1.29.1-next.1
  - @backstage/plugin-catalog-react@1.18.0-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/core-plugin-api@1.10.6
  - @backstage/plugin-catalog-common@1.1.4-next.0
  - @backstage/plugin-permission-react@0.4.34-next.0

## @backstage/plugin-app@0.1.9-next.1

### Patch Changes

- fb58f20: Internal update to use the new `pluginId` option of `createFrontendPlugin`.
- Updated dependencies
  - @backstage/theme@0.6.6-next.0
  - @backstage/core-components@0.17.2-next.0
  - @backstage/frontend-plugin-api@0.10.2-next.0
  - @backstage/integration-react@1.2.7-next.1
  - @backstage/core-plugin-api@1.10.6
  - @backstage/types@1.2.1
  - @backstage/plugin-permission-react@0.4.34-next.0

## @backstage/plugin-app-backend@0.5.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/config-loader@1.10.1-next.0
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-app-node@0.1.33-next.1

## @backstage/plugin-app-node@0.1.33-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/config-loader@1.10.1-next.0

## @backstage/plugin-app-visualizer@0.1.19-next.0

### Patch Changes

- fb58f20: Internal update to use the new `pluginId` option of `createFrontendPlugin`.
- Updated dependencies
  - @backstage/core-components@0.17.2-next.0
  - @backstage/frontend-plugin-api@0.10.2-next.0
  - @backstage/core-plugin-api@1.10.6

## @backstage/plugin-auth-backend@0.25.0-next.1

### Patch Changes

- 0d606ac: Added the configuration flag `auth.omitIdentityTokenOwnershipClaim` that causes issued user tokens to no longer contain the `ent` claim that represents the ownership references of the user.

  The benefit of this new flag is that issued user tokens will be much smaller in
  size, but they will no longer be self-contained. This means that any consumers
  of the token that require access to the ownership claims now need to call the
  `/api/auth/v1/userinfo` endpoint instead. Within the Backstage ecosystem this is
  done automatically, as clients will still receive the full set of claims during
  authentication, while plugin backends will need to use the `UserInfoService`
  which already calls the user info endpoint if necessary.

  When enabling this flag, it is important that any custom sign-in resolvers directly return the result of the sign-in method. For example, the following would not work:

  ```ts
  const { token } = await ctx.issueToken({
    claims: { sub: entityRef, ent: [entityRef] },
  });
  return { token }; // WARNING: This will not work with the flag enabled
  ```

  Instead, the sign-in resolver should directly return the result:

  ```ts
  return ctx.issueToken({
    claims: { sub: entityRef, ent: [entityRef] },
  });
  ```

- 72d019d: Removed various typos

- b128ed9: The `static` key store now issues tokens with the same structure as other key stores. Tokens now include the `typ` field in the header and the `uip` (user identity proof) in the payload.

- Updated dependencies
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1

## @backstage/plugin-auth-backend-module-atlassian-provider@0.4.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1

## @backstage/plugin-auth-backend-module-auth0-provider@0.2.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1

## @backstage/plugin-auth-backend-module-aws-alb-provider@0.4.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.25.0-next.1
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/errors@1.2.7

## @backstage/plugin-auth-backend-module-azure-easyauth-provider@0.2.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/errors@1.2.7

## @backstage/plugin-auth-backend-module-bitbucket-provider@0.3.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1

## @backstage/plugin-auth-backend-module-bitbucket-server-provider@0.2.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1

## @backstage/plugin-auth-backend-module-cloudflare-access-provider@0.4.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## @backstage/plugin-auth-backend-module-gcp-iap-provider@0.4.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1

## @backstage/plugin-auth-backend-module-github-provider@0.3.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1

## @backstage/plugin-auth-backend-module-gitlab-provider@0.3.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1

## @backstage/plugin-auth-backend-module-google-provider@0.3.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1

## @backstage/plugin-auth-backend-module-guest-provider@0.2.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/errors@1.2.7

## @backstage/plugin-auth-backend-module-microsoft-provider@0.3.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1

## @backstage/plugin-auth-backend-module-oauth2-provider@0.4.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1

## @backstage/plugin-auth-backend-module-oauth2-proxy-provider@0.2.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/errors@1.2.7

## @backstage/plugin-auth-backend-module-oidc-provider@0.4.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.25.0-next.1
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/config@1.3.2
  - @backstage/types@1.2.1

## @backstage/plugin-auth-backend-module-okta-provider@0.2.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1

## @backstage/plugin-auth-backend-module-onelogin-provider@0.3.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1

## @backstage/plugin-auth-backend-module-pinniped-provider@0.3.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/config@1.3.2
  - @backstage/types@1.2.1

## @backstage/plugin-auth-backend-module-vmware-cloud-provider@0.5.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/catalog-model@1.7.3

## @backstage/plugin-auth-node@0.6.3-next.1

### Patch Changes

- 332e934: Added the `identity` property to `BackstageSignInResult`.

  The `prepareBackstageIdentityResponse` function will now also forward the `identity` to the response if present in the provided sign-in result.

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1

## @backstage/plugin-auth-react@0.1.15-next.0

### Patch Changes

- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/core-components@0.17.2-next.0
  - @backstage/core-plugin-api@1.10.6
  - @backstage/errors@1.2.7

## @backstage/plugin-bitbucket-cloud-common@0.3.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.16.4-next.1

## @backstage/plugin-catalog@1.29.1-next.1

### Patch Changes

- fb58f20: Internal update to use the new `pluginId` option of `createFrontendPlugin`.
- Updated dependencies
  - @backstage/core-components@0.17.2-next.0
  - @backstage/frontend-plugin-api@0.10.2-next.0
  - @backstage/core-compat-api@0.4.2-next.1
  - @backstage/plugin-search-react@1.9.0-next.0
  - @backstage/plugin-catalog-react@1.18.0-next.1
  - @backstage/integration-react@1.2.7-next.1
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/core-plugin-api@1.10.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/version-bridge@1.0.11
  - @backstage/plugin-catalog-common@1.1.4-next.0
  - @backstage/plugin-permission-react@0.4.34-next.0
  - @backstage/plugin-scaffolder-common@1.5.11-next.0
  - @backstage/plugin-search-common@1.2.18-next.0

## @backstage/plugin-catalog-backend-module-aws@0.4.11-next.1

### Patch Changes

- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/backend-defaults@0.10.0-next.1
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/integration@1.16.4-next.1
  - @backstage/plugin-kubernetes-common@0.9.5-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.15
  - @backstage/plugin-catalog-common@1.1.4-next.0

## @backstage/plugin-catalog-backend-module-azure@0.3.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/integration@1.16.4-next.1
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.4-next.0

## @backstage/plugin-catalog-backend-module-backstage-openapi@0.5.2-next.1

### Patch Changes

- d385854: Do not swallow errors; instead allow them to bubble up to the task scheduler for better tracking and logging.
- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/backend-openapi-utils@0.5.3-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## @backstage/plugin-catalog-backend-module-bitbucket-cloud@0.4.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/integration@1.16.4-next.1
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/plugin-bitbucket-cloud-common@0.3.0-next.1
  - @backstage/plugin-catalog-common@1.1.4-next.0
  - @backstage/plugin-events-node@0.4.11-next.1

## @backstage/plugin-catalog-backend-module-bitbucket-server@0.4.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/integration@1.16.4-next.1
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-common@1.1.4-next.0
  - @backstage/plugin-events-node@0.4.11-next.1

## @backstage/plugin-catalog-backend-module-gcp@0.3.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-kubernetes-common@0.9.5-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2

## @backstage/plugin-catalog-backend-module-gerrit@0.3.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/integration@1.16.4-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-common@1.1.4-next.0

## @backstage/plugin-catalog-backend-module-github@0.9.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@2.0.0-next.1
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/integration@1.16.4-next.1
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.4-next.0
  - @backstage/plugin-events-node@0.4.11-next.1

## @backstage/plugin-catalog-backend-module-github-org@0.3.10-next.1

### Patch Changes

- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-catalog-backend-module-github@0.9.0-next.1
  - @backstage/config@1.3.2
  - @backstage/plugin-events-node@0.4.11-next.1

## @backstage/plugin-catalog-backend-module-gitlab@0.6.6-next.1

### Patch Changes

- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/backend-defaults@0.10.0-next.1
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/integration@1.16.4-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.4-next.0
  - @backstage/plugin-events-node@0.4.11-next.1

## @backstage/plugin-catalog-backend-module-gitlab-org@0.2.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-catalog-backend-module-gitlab@0.6.6-next.1
  - @backstage/plugin-events-node@0.4.11-next.1

## @backstage/plugin-catalog-backend-module-incremental-ingestion@0.7.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@2.0.0-next.1
  - @backstage/backend-defaults@0.10.0-next.1
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-permission-common@0.9.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.11-next.1

## @backstage/plugin-catalog-backend-module-ldap@0.11.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.4-next.0

## @backstage/plugin-catalog-backend-module-logs@0.1.10-next.1

### Patch Changes

- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/plugin-catalog-backend@2.0.0-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-events-node@0.4.11-next.1

## @backstage/plugin-catalog-backend-module-openapi@0.2.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/integration@1.16.4-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.4-next.0

## @backstage/plugin-catalog-backend-module-puppetdb@0.2.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1

## @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/plugin-catalog-common@1.1.4-next.0
  - @backstage/plugin-scaffolder-common@1.5.11-next.0

## @backstage/plugin-catalog-backend-module-unprocessed@0.6.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-permission-common@0.9.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-unprocessed-entities-common@0.0.8-next.0

## @backstage/plugin-catalog-common@1.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.9.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/plugin-search-common@1.2.18-next.0

## @backstage/plugin-catalog-graph@0.4.19-next.1

### Patch Changes

- fb58f20: Internal update to use the new `pluginId` option of `createFrontendPlugin`.
- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/core-components@0.17.2-next.0
  - @backstage/frontend-plugin-api@0.10.2-next.0
  - @backstage/core-compat-api@0.4.2-next.1
  - @backstage/plugin-catalog-react@1.18.0-next.1
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/core-plugin-api@1.10.6
  - @backstage/types@1.2.1

## @backstage/plugin-catalog-import@0.12.14-next.1

### Patch Changes

- fb58f20: Internal update to use the new `pluginId` option of `createFrontendPlugin`.
- Updated dependencies
  - @backstage/core-components@0.17.2-next.0
  - @backstage/frontend-plugin-api@0.10.2-next.0
  - @backstage/core-compat-api@0.4.2-next.1
  - @backstage/integration@1.16.4-next.1
  - @backstage/plugin-catalog-react@1.18.0-next.1
  - @backstage/integration-react@1.2.7-next.1
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/core-plugin-api@1.10.6
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-common@1.1.4-next.0

## @backstage/plugin-catalog-react@1.18.0-next.1

### Patch Changes

- 6d7f0d5: Fixed an issue causing entities of kind user and group to be empty when an owner was selected
- Updated dependencies
  - @backstage/core-components@0.17.2-next.0
  - @backstage/frontend-plugin-api@0.10.2-next.0
  - @backstage/frontend-test-utils@0.3.2-next.1
  - @backstage/core-compat-api@0.4.2-next.1
  - @backstage/plugin-permission-common@0.9.0-next.0
  - @backstage/integration-react@1.2.7-next.1
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/core-plugin-api@1.10.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/version-bridge@1.0.11
  - @backstage/plugin-catalog-common@1.1.4-next.0
  - @backstage/plugin-permission-react@0.4.34-next.0

## @backstage/plugin-catalog-unprocessed-entities@0.2.17-next.1

### Patch Changes

- fb58f20: Internal update to use the new `pluginId` option of `createFrontendPlugin`.
- Updated dependencies
  - @backstage/core-components@0.17.2-next.0
  - @backstage/frontend-plugin-api@0.10.2-next.0
  - @backstage/core-compat-api@0.4.2-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/core-plugin-api@1.10.6
  - @backstage/errors@1.2.7

## @backstage/plugin-catalog-unprocessed-entities-common@0.0.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.9.0-next.0

## @backstage/plugin-config-schema@0.1.68-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.2-next.0
  - @backstage/core-plugin-api@1.10.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1

## @backstage/plugin-devtools@0.1.27-next.1

### Patch Changes

- fb58f20: Internal update to use the new `pluginId` option of `createFrontendPlugin`.
- Updated dependencies
  - @backstage/core-components@0.17.2-next.0
  - @backstage/frontend-plugin-api@0.10.2-next.0
  - @backstage/core-compat-api@0.4.2-next.1
  - @backstage/core-plugin-api@1.10.6
  - @backstage/errors@1.2.7
  - @backstage/plugin-devtools-common@0.1.16-next.0
  - @backstage/plugin-permission-react@0.4.34-next.0

## @backstage/plugin-devtools-backend@0.5.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.10.0-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-permission-common@0.9.0-next.0
  - @backstage/plugin-permission-node@0.10.0-next.1
  - @backstage/config-loader@1.10.1-next.0
  - @backstage/cli-common@0.1.15
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-devtools-common@0.1.16-next.0

## @backstage/plugin-devtools-common@0.1.16-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.9.0-next.0
  - @backstage/types@1.2.1

## @backstage/plugin-events-backend@0.5.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/backend-openapi-utils@0.5.3-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.11-next.1

## @backstage/plugin-events-backend-module-aws-sqs@0.4.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/config@1.3.2
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.11-next.1

## @backstage/plugin-events-backend-module-azure@0.2.20-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-events-node@0.4.11-next.1

## @backstage/plugin-events-backend-module-bitbucket-cloud@0.2.20-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-events-node@0.4.11-next.1

## @backstage/plugin-events-backend-module-bitbucket-server@0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-events-node@0.4.11-next.1

## @backstage/plugin-events-backend-module-gerrit@0.2.20-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-events-node@0.4.11-next.1

## @backstage/plugin-events-backend-module-gitlab@0.3.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/config@1.3.2
  - @backstage/plugin-events-node@0.4.11-next.1

## @backstage/plugin-events-backend-module-google-pubsub@0.1.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.11-next.1

## @backstage/plugin-events-backend-test-utils@0.1.44-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.11-next.1

## @backstage/plugin-events-node@0.4.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1

## @backstage/plugin-gateway-backend@1.0.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1

## @backstage/plugin-home@0.8.8-next.1

### Patch Changes

- fb58f20: Internal update to use the new `pluginId` option of `createFrontendPlugin`.
- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/theme@0.6.6-next.0
  - @backstage/core-components@0.17.2-next.0
  - @backstage/frontend-plugin-api@0.10.2-next.0
  - @backstage/core-compat-api@0.4.2-next.1
  - @backstage/plugin-catalog-react@1.18.0-next.1
  - @backstage/plugin-home-react@0.1.26-next.0
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/core-app-api@1.16.1
  - @backstage/core-plugin-api@1.10.6

## @backstage/plugin-home-react@0.1.26-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.2-next.0
  - @backstage/core-plugin-api@1.10.6

## @backstage/plugin-kubernetes@0.12.7-next.1

### Patch Changes

- fb58f20: Internal update to use the new `pluginId` option of `createFrontendPlugin`.
- 216c6b2: Updated dependency `@kubernetes/client-node` to `1.1.2`.
- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/plugin-kubernetes-react@0.5.7-next.0
  - @backstage/core-components@0.17.2-next.0
  - @backstage/frontend-plugin-api@0.10.2-next.0
  - @backstage/core-compat-api@0.4.2-next.1
  - @backstage/plugin-catalog-react@1.18.0-next.1
  - @backstage/plugin-kubernetes-common@0.9.5-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/core-plugin-api@1.10.6
  - @backstage/plugin-permission-react@0.4.34-next.0

## @backstage/plugin-kubernetes-backend@0.19.6-next.1

### Patch Changes

- f6f692c: Changed logging of cluster details to debug to minimise log clutter.
- 216c6b2: Updated dependency `@kubernetes/client-node` to `1.1.2`.
- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/plugin-kubernetes-node@0.3.0-next.1
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-permission-common@0.9.0-next.0
  - @backstage/plugin-permission-node@0.10.0-next.1
  - @backstage/plugin-kubernetes-common@0.9.5-next.0
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.15
  - @backstage/types@1.2.1

## @backstage/plugin-kubernetes-cluster@0.0.25-next.1

### Patch Changes

- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/plugin-kubernetes-react@0.5.7-next.0
  - @backstage/core-components@0.17.2-next.0
  - @backstage/plugin-catalog-react@1.18.0-next.1
  - @backstage/plugin-kubernetes-common@0.9.5-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/core-plugin-api@1.10.6
  - @backstage/plugin-permission-react@0.4.34-next.0

## @backstage/plugin-kubernetes-common@0.9.5-next.0

### Patch Changes

- 216c6b2: Updated dependency `@kubernetes/client-node` to `1.1.2`.
- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/plugin-permission-common@0.9.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/types@1.2.1

## @backstage/plugin-kubernetes-react@0.5.7-next.0

### Patch Changes

- 599c89e: Add headlamp formatter
- 216c6b2: Updated dependency `@kubernetes/client-node` to `1.1.2`.
- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/core-components@0.17.2-next.0
  - @backstage/plugin-kubernetes-common@0.9.5-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/core-plugin-api@1.10.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1

## @backstage/plugin-notifications@0.5.5-next.1

### Patch Changes

- fb58f20: Internal update to use the new `pluginId` option of `createFrontendPlugin`.
- Updated dependencies
  - @backstage/theme@0.6.6-next.0
  - @backstage/core-components@0.17.2-next.0
  - @backstage/frontend-plugin-api@0.10.2-next.0
  - @backstage/core-compat-api@0.4.2-next.1
  - @backstage/core-plugin-api@1.10.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-signals-react@0.0.12

## @backstage/plugin-notifications-backend@0.5.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-signals-node@0.1.20-next.1
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.11-next.1
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-notifications-node@0.2.15-next.1

## @backstage/plugin-notifications-backend-module-email@0.3.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/integration-aws-node@0.1.15
  - @backstage/types@1.2.1
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-notifications-node@0.2.15-next.1

## @backstage/plugin-notifications-backend-module-slack@0.1.1-next.1

### Patch Changes

- a1c5bbb: Added email-based Slack User ID lookup if `metadata.annotations.slack.com/bot-notify` is missing from user entity
- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-notifications-node@0.2.15-next.1

## @backstage/plugin-notifications-node@0.2.15-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-signals-node@0.1.20-next.1
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/plugin-notifications-common@0.0.8

## @backstage/plugin-org@0.6.39-next.1

### Patch Changes

- fb58f20: Internal update to use the new `pluginId` option of `createFrontendPlugin`.
- 08ba448: display entity-ref in GroupProfileCard so groups can easily determine their Group ID
- 18e84c9: Fixed missing spec.profile field on MyGroupsSidebarItem.tsx so the group spec.profile.displayName is shown on the sidebar"
- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/core-components@0.17.2-next.0
  - @backstage/frontend-plugin-api@0.10.2-next.0
  - @backstage/core-compat-api@0.4.2-next.1
  - @backstage/plugin-catalog-react@1.18.0-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/core-plugin-api@1.10.6
  - @backstage/plugin-catalog-common@1.1.4-next.0

## @backstage/plugin-org-react@0.1.38-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.2-next.0
  - @backstage/plugin-catalog-react@1.18.0-next.1
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/core-plugin-api@1.10.6

## @backstage/plugin-permission-backend-module-allow-all-policy@0.2.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-permission-common@0.9.0-next.0
  - @backstage/plugin-permission-node@0.10.0-next.1

## @backstage/plugin-permission-react@0.4.34-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.9.0-next.0
  - @backstage/config@1.3.2
  - @backstage/core-plugin-api@1.10.6

## @backstage/plugin-proxy-backend@0.6.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/types@1.2.1
  - @backstage/plugin-proxy-node@0.1.4-next.1

## @backstage/plugin-proxy-node@0.1.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1

## @backstage/plugin-scaffolder@1.31.0-next.1

### Patch Changes

- fb58f20: Internal update to use the new `pluginId` option of `createFrontendPlugin`.
- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/core-components@0.17.2-next.0
  - @backstage/frontend-plugin-api@0.10.2-next.0
  - @backstage/core-compat-api@0.4.2-next.1
  - @backstage/integration@1.16.4-next.1
  - @backstage/plugin-catalog-react@1.18.0-next.1
  - @backstage/plugin-scaffolder-react@1.16.0-next.1
  - @backstage/integration-react@1.2.7-next.1
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/core-plugin-api@1.10.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-catalog-common@1.1.4-next.0
  - @backstage/plugin-permission-react@0.4.34-next.0
  - @backstage/plugin-scaffolder-common@1.5.11-next.0

## @backstage/plugin-scaffolder-backend-module-azure@0.2.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/integration@1.16.4-next.1
  - @backstage/plugin-scaffolder-node@0.8.2-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.10-next.1

### Patch Changes

- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/integration@1.16.4-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.9-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.9-next.1
  - @backstage/plugin-scaffolder-node@0.8.2-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.9-next.1

### Patch Changes

- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/integration@1.16.4-next.1
  - @backstage/plugin-scaffolder-node@0.8.2-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-bitbucket-cloud-common@0.3.0-next.1

## @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.9-next.1

### Patch Changes

- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/integration@1.16.4-next.1
  - @backstage/plugin-scaffolder-node@0.8.2-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## @backstage/plugin-scaffolder-backend-module-confluence-to-markdown@0.3.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/integration@1.16.4-next.1
  - @backstage/plugin-scaffolder-node@0.8.2-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## @backstage/plugin-scaffolder-backend-module-cookiecutter@0.3.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.10.0-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/integration@1.16.4-next.1
  - @backstage/plugin-scaffolder-node@0.8.2-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1

## @backstage/plugin-scaffolder-backend-module-gcp@0.2.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/integration@1.16.4-next.1
  - @backstage/plugin-scaffolder-node@0.8.2-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## @backstage/plugin-scaffolder-backend-module-gerrit@0.2.9-next.1

### Patch Changes

- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/integration@1.16.4-next.1
  - @backstage/plugin-scaffolder-node@0.8.2-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## @backstage/plugin-scaffolder-backend-module-gitea@0.2.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/integration@1.16.4-next.1
  - @backstage/plugin-scaffolder-node@0.8.2-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## @backstage/plugin-scaffolder-backend-module-github@0.7.1-next.1

### Patch Changes

- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/integration@1.16.4-next.1
  - @backstage/plugin-scaffolder-node@0.8.2-next.1
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1

## @backstage/plugin-scaffolder-backend-module-gitlab@0.9.1-next.1

### Patch Changes

- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/integration@1.16.4-next.1
  - @backstage/plugin-scaffolder-node@0.8.2-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## @backstage/plugin-scaffolder-backend-module-notifications@0.1.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-scaffolder-node@0.8.2-next.1
  - @backstage/plugin-notifications-common@0.0.8
  - @backstage/plugin-notifications-node@0.2.15-next.1

## @backstage/plugin-scaffolder-backend-module-rails@0.5.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/integration@1.16.4-next.1
  - @backstage/plugin-scaffolder-node@0.8.2-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1

## @backstage/plugin-scaffolder-backend-module-sentry@0.2.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-scaffolder-node@0.8.2-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7

## @backstage/plugin-scaffolder-backend-module-yeoman@0.4.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-scaffolder-node-test-utils@0.2.2-next.1
  - @backstage/plugin-scaffolder-node@0.8.2-next.1
  - @backstage/types@1.2.1

## @backstage/plugin-scaffolder-common@1.5.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.9.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/types@1.2.1

## @backstage/plugin-scaffolder-node@0.8.2-next.1

### Patch Changes

- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/integration@1.16.4-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-scaffolder-common@1.5.11-next.0

## @backstage/plugin-scaffolder-node-test-utils@0.2.2-next.1

### Patch Changes

- b27c48d: Include optional `user` in `createMockActionContext`
- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-scaffolder-node@0.8.2-next.1
  - @backstage/backend-test-utils@1.5.0-next.1
  - @backstage/types@1.2.1

## @backstage/plugin-scaffolder-react@1.16.0-next.1

### Patch Changes

- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/theme@0.6.6-next.0
  - @backstage/core-components@0.17.2-next.0
  - @backstage/frontend-plugin-api@0.10.2-next.0
  - @backstage/plugin-catalog-react@1.18.0-next.1
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/core-plugin-api@1.10.6
  - @backstage/types@1.2.1
  - @backstage/version-bridge@1.0.11
  - @backstage/plugin-permission-react@0.4.34-next.0
  - @backstage/plugin-scaffolder-common@1.5.11-next.0

## @backstage/plugin-search@1.4.26-next.1

### Patch Changes

- fb58f20: Internal update to use the new `pluginId` option of `createFrontendPlugin`.
- Updated dependencies
  - @backstage/core-components@0.17.2-next.0
  - @backstage/frontend-plugin-api@0.10.2-next.0
  - @backstage/core-compat-api@0.4.2-next.1
  - @backstage/plugin-search-react@1.9.0-next.0
  - @backstage/plugin-catalog-react@1.18.0-next.1
  - @backstage/core-plugin-api@1.10.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/version-bridge@1.0.11
  - @backstage/plugin-search-common@1.2.18-next.0

## @backstage/plugin-search-backend@2.0.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.10.0-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-permission-common@0.9.0-next.0
  - @backstage/plugin-permission-node@0.10.0-next.1
  - @backstage/plugin-search-backend-node@1.3.11-next.1
  - @backstage/backend-openapi-utils@0.5.3-next.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-search-common@1.2.18-next.0

## @backstage/plugin-search-backend-module-catalog@0.3.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-permission-common@0.9.0-next.0
  - @backstage/plugin-search-backend-node@1.3.11-next.1
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-common@1.1.4-next.0
  - @backstage/plugin-search-common@1.2.18-next.0

## @backstage/plugin-search-backend-module-elasticsearch@1.7.2-next.1

### Patch Changes

- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-search-backend-node@1.3.11-next.1
  - @backstage/config@1.3.2
  - @backstage/integration-aws-node@0.1.15
  - @backstage/plugin-search-common@1.2.18-next.0

## @backstage/plugin-search-backend-module-explore@0.3.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-search-backend-node@1.3.11-next.1
  - @backstage/config@1.3.2
  - @backstage/plugin-search-common@1.2.18-next.0

## @backstage/plugin-search-backend-module-pg@0.5.44-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-search-backend-node@1.3.11-next.1
  - @backstage/config@1.3.2
  - @backstage/plugin-search-common@1.2.18-next.0

## @backstage/plugin-search-backend-module-stack-overflow-collator@0.3.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-search-backend-node@1.3.11-next.1
  - @backstage/config@1.3.2
  - @backstage/plugin-search-common@1.2.18-next.0

## @backstage/plugin-search-backend-module-techdocs@0.4.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-permission-common@0.9.0-next.0
  - @backstage/plugin-techdocs-node@1.13.3-next.1
  - @backstage/plugin-search-backend-node@1.3.11-next.1
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/plugin-catalog-common@1.1.4-next.0
  - @backstage/plugin-search-common@1.2.18-next.0

## @backstage/plugin-search-backend-node@1.3.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-permission-common@0.9.0-next.0
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-search-common@1.2.18-next.0

## @backstage/plugin-search-common@1.2.18-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.9.0-next.0
  - @backstage/types@1.2.1

## @backstage/plugin-signals@0.0.19-next.0

### Patch Changes

- fb58f20: Internal update to use the new `pluginId` option of `createFrontendPlugin`.
- Updated dependencies
  - @backstage/theme@0.6.6-next.0
  - @backstage/core-components@0.17.2-next.0
  - @backstage/frontend-plugin-api@0.10.2-next.0
  - @backstage/core-plugin-api@1.10.6
  - @backstage/types@1.2.1
  - @backstage/plugin-signals-react@0.0.12

## @backstage/plugin-signals-backend@0.3.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-signals-node@0.1.20-next.1
  - @backstage/config@1.3.2
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.11-next.1

## @backstage/plugin-signals-node@0.1.20-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/config@1.3.2
  - @backstage/types@1.2.1
  - @backstage/plugin-events-node@0.4.11-next.1

## @backstage/plugin-techdocs@1.12.6-next.1

### Patch Changes

- fb58f20: Internal update to use the new `pluginId` option of `createFrontendPlugin`.
- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/theme@0.6.6-next.0
  - @backstage/core-components@0.17.2-next.0
  - @backstage/frontend-plugin-api@0.10.2-next.0
  - @backstage/core-compat-api@0.4.2-next.1
  - @backstage/integration@1.16.4-next.1
  - @backstage/plugin-search-react@1.9.0-next.0
  - @backstage/plugin-catalog-react@1.18.0-next.1
  - @backstage/plugin-techdocs-react@1.2.17-next.0
  - @backstage/plugin-auth-react@0.1.15-next.0
  - @backstage/integration-react@1.2.7-next.1
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/core-plugin-api@1.10.6
  - @backstage/errors@1.2.7
  - @backstage/plugin-search-common@1.2.18-next.0
  - @backstage/plugin-techdocs-common@0.1.0

## @backstage/plugin-techdocs-addons-test-utils@1.0.48-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-techdocs@1.12.6-next.1
  - @backstage/plugin-catalog@1.29.1-next.1
  - @backstage/plugin-search-react@1.9.0-next.0
  - @backstage/plugin-catalog-react@1.18.0-next.1
  - @backstage/plugin-techdocs-react@1.2.17-next.0
  - @backstage/test-utils@1.7.8-next.0
  - @backstage/integration-react@1.2.7-next.1
  - @backstage/core-app-api@1.16.1
  - @backstage/core-plugin-api@1.10.6

## @backstage/plugin-techdocs-backend@2.0.2-next.1

### Patch Changes

- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/backend-defaults@0.10.0-next.1
  - @backstage/plugin-catalog-node@1.17.0-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/integration@1.16.4-next.1
  - @backstage/plugin-permission-common@0.9.0-next.0
  - @backstage/plugin-techdocs-node@1.13.3-next.1
  - @backstage/plugin-search-backend-module-techdocs@0.4.2-next.1
  - @backstage/catalog-client@1.10.0-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/plugin-catalog-common@1.1.4-next.0
  - @backstage/plugin-techdocs-common@0.1.0

## @backstage/plugin-techdocs-module-addons-contrib@1.1.24-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.2-next.0
  - @backstage/frontend-plugin-api@0.10.2-next.0
  - @backstage/integration@1.16.4-next.1
  - @backstage/plugin-techdocs-react@1.2.17-next.0
  - @backstage/integration-react@1.2.7-next.1
  - @backstage/core-plugin-api@1.10.6

## @backstage/plugin-techdocs-node@1.13.3-next.1

### Patch Changes

- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/integration@1.16.4-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/integration-aws-node@0.1.15
  - @backstage/plugin-search-common@1.2.18-next.0
  - @backstage/plugin-techdocs-common@0.1.0

## @backstage/plugin-techdocs-react@1.2.17-next.0

### Patch Changes

- 72d019d: Removed various typos
- Updated dependencies
  - @backstage/core-components@0.17.2-next.0
  - @backstage/frontend-plugin-api@0.10.2-next.0
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/core-plugin-api@1.10.6
  - @backstage/version-bridge@1.0.11

## @backstage/plugin-user-settings@0.8.22-next.1

### Patch Changes

- fb58f20: Internal update to use the new `pluginId` option of `createFrontendPlugin`.
- 5b04b14: Uppercase language name in language select
- Updated dependencies
  - @backstage/theme@0.6.6-next.0
  - @backstage/core-components@0.17.2-next.0
  - @backstage/frontend-plugin-api@0.10.2-next.0
  - @backstage/core-compat-api@0.4.2-next.1
  - @backstage/plugin-catalog-react@1.18.0-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/core-app-api@1.16.1
  - @backstage/core-plugin-api@1.10.6
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-signals-react@0.0.12
  - @backstage/plugin-user-settings-common@0.0.1

## @backstage/plugin-user-settings-backend@0.3.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.10.0-next.1
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-signals-node@0.1.20-next.1
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1
  - @backstage/plugin-user-settings-common@0.0.1

## example-app@0.2.109-next.1

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.6.6-next.0
  - @backstage/core-components@0.17.2-next.0
  - @backstage/cli@0.32.1-next.1
  - @backstage/canon@0.4.0-next.1
  - @backstage/plugin-catalog-unprocessed-entities@0.2.17-next.1
  - @backstage/plugin-catalog-import@0.12.14-next.1
  - @backstage/plugin-catalog-graph@0.4.19-next.1
  - @backstage/plugin-notifications@0.5.5-next.1
  - @backstage/plugin-user-settings@0.8.22-next.1
  - @backstage/plugin-kubernetes@0.12.7-next.1
  - @backstage/plugin-scaffolder@1.31.0-next.1
  - @backstage/plugin-api-docs@0.12.7-next.1
  - @backstage/plugin-devtools@0.1.27-next.1
  - @backstage/plugin-techdocs@1.12.6-next.1
  - @backstage/plugin-catalog@1.29.1-next.1
  - @backstage/plugin-signals@0.0.19-next.0
  - @backstage/plugin-search@1.4.26-next.1
  - @backstage/plugin-home@0.8.8-next.1
  - @backstage/plugin-org@0.6.39-next.1
  - @backstage/plugin-search-react@1.9.0-next.0
  - @backstage/plugin-catalog-react@1.18.0-next.1
  - @backstage/plugin-kubernetes-cluster@0.0.25-next.1
  - @backstage/frontend-app-api@0.11.2-next.1
  - @backstage/plugin-scaffolder-react@1.16.0-next.1
  - @backstage/plugin-techdocs-react@1.2.17-next.0
  - @backstage/plugin-auth-react@0.1.15-next.0
  - @backstage/app-defaults@1.6.2-next.0
  - @backstage/integration-react@1.2.7-next.1
  - @backstage/plugin-techdocs-module-addons-contrib@1.1.24-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/core-app-api@1.16.1
  - @backstage/core-plugin-api@1.10.6
  - @backstage/plugin-catalog-common@1.1.4-next.0
  - @backstage/plugin-permission-react@0.4.34-next.0
  - @backstage/plugin-search-common@1.2.18-next.0

## example-app-next@0.0.23-next.1

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.6.6-next.0
  - @backstage/core-components@0.17.2-next.0
  - @backstage/frontend-plugin-api@0.10.2-next.0
  - @backstage/cli@0.32.1-next.1
  - @backstage/canon@0.4.0-next.1
  - @backstage/plugin-catalog-unprocessed-entities@0.2.17-next.1
  - @backstage/core-compat-api@0.4.2-next.1
  - @backstage/plugin-app-visualizer@0.1.19-next.0
  - @backstage/plugin-catalog-import@0.12.14-next.1
  - @backstage/plugin-catalog-graph@0.4.19-next.1
  - @backstage/plugin-notifications@0.5.5-next.1
  - @backstage/plugin-user-settings@0.8.22-next.1
  - @backstage/plugin-kubernetes@0.12.7-next.1
  - @backstage/plugin-scaffolder@1.31.0-next.1
  - @backstage/plugin-api-docs@0.12.7-next.1
  - @backstage/plugin-techdocs@1.12.6-next.1
  - @backstage/plugin-catalog@1.29.1-next.1
  - @backstage/plugin-signals@0.0.19-next.0
  - @backstage/plugin-search@1.4.26-next.1
  - @backstage/plugin-home@0.8.8-next.1
  - @backstage/plugin-app@0.1.9-next.1
  - @backstage/plugin-org@0.6.39-next.1
  - @backstage/plugin-search-react@1.9.0-next.0
  - @backstage/plugin-catalog-react@1.18.0-next.1
  - @backstage/plugin-kubernetes-cluster@0.0.25-next.1
  - @backstage/frontend-app-api@0.11.2-next.1
  - @backstage/plugin-scaffolder-react@1.16.0-next.1
  - @backstage/plugin-techdocs-react@1.2.17-next.0
  - @backstage/plugin-auth-react@0.1.15-next.0
  - @backstage/app-defaults@1.6.2-next.0
  - @backstage/integration-react@1.2.7-next.1
  - @backstage/plugin-techdocs-module-addons-contrib@1.1.24-next.1
  - @backstage/frontend-defaults@0.2.2-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/core-app-api@1.16.1
  - @backstage/core-plugin-api@1.10.6
  - @backstage/plugin-catalog-common@1.1.4-next.0
  - @backstage/plugin-permission-react@0.4.34-next.0
  - @backstage/plugin-search-common@1.2.18-next.0

## app-next-example-plugin@0.0.23-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.2-next.0
  - @backstage/frontend-plugin-api@0.10.2-next.0

## example-backend@0.0.38-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.25.0-next.1
  - @backstage/plugin-catalog-backend@2.0.0-next.1
  - @backstage/backend-defaults@0.10.0-next.1
  - @backstage/plugin-catalog-backend-module-backstage-openapi@0.5.2-next.1
  - @backstage/plugin-kubernetes-backend@0.19.6-next.1
  - @backstage/plugin-auth-node@0.6.3-next.1
  - @backstage/plugin-scaffolder-backend@1.33.0-next.1
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/plugin-permission-backend@0.7.0-next.1
  - @backstage/plugin-permission-common@0.9.0-next.0
  - @backstage/plugin-permission-node@0.10.0-next.1
  - @backstage/plugin-scaffolder-backend-module-github@0.7.1-next.1
  - @backstage/plugin-techdocs-backend@2.0.2-next.1
  - @backstage/plugin-auth-backend-module-github-provider@0.3.3-next.1
  - @backstage/plugin-notifications-backend@0.5.6-next.1
  - @backstage/plugin-signals-backend@0.3.4-next.1
  - @backstage/plugin-app-backend@0.5.2-next.1
  - @backstage/plugin-devtools-backend@0.5.5-next.1
  - @backstage/plugin-events-backend@0.5.2-next.1
  - @backstage/plugin-events-backend-module-google-pubsub@0.1.0-next.1
  - @backstage/plugin-proxy-backend@0.6.2-next.1
  - @backstage/plugin-search-backend@2.0.2-next.1
  - @backstage/plugin-search-backend-node@1.3.11-next.1
  - @backstage/plugin-catalog-backend-module-openapi@0.2.10-next.1
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.8-next.1
  - @backstage/plugin-catalog-backend-module-unprocessed@0.6.0-next.1
  - @backstage/plugin-search-backend-module-catalog@0.3.4-next.1
  - @backstage/plugin-search-backend-module-techdocs@0.4.2-next.1
  - @backstage/plugin-auth-backend-module-guest-provider@0.2.8-next.1
  - @backstage/plugin-permission-backend-module-allow-all-policy@0.2.8-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/plugin-scaffolder-backend-module-notifications@0.1.10-next.1
  - @backstage/plugin-search-backend-module-explore@0.3.2-next.1

## e2e-test@0.2.28-next.1

### Patch Changes

- Updated dependencies
  - @backstage/create-app@0.6.2-next.1
  - @backstage/cli-common@0.1.15
  - @backstage/errors@1.2.7

## @internal/frontend@0.0.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.10.2-next.0
  - @backstage/types@1.2.1
  - @backstage/version-bridge@1.0.11

## @internal/scaffolder@0.0.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.10.2-next.0
  - @backstage/plugin-scaffolder-react@1.16.0-next.1

## techdocs-cli-embedded-app@0.2.108-next.1

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.6.6-next.0
  - @backstage/core-components@0.17.2-next.0
  - @backstage/cli@0.32.1-next.1
  - @backstage/plugin-techdocs@1.12.6-next.1
  - @backstage/plugin-catalog@1.29.1-next.1
  - @backstage/plugin-techdocs-react@1.2.17-next.0
  - @backstage/app-defaults@1.6.2-next.0
  - @backstage/test-utils@1.7.8-next.0
  - @backstage/integration-react@1.2.7-next.1
  - @backstage/catalog-model@1.7.3
  - @backstage/config@1.3.2
  - @backstage/core-app-api@1.16.1
  - @backstage/core-plugin-api@1.10.6

## @internal/plugin-todo-list@1.0.39-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.2-next.0
  - @backstage/core-plugin-api@1.10.6

## @internal/plugin-todo-list-backend@1.0.39-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.3.1-next.1
  - @backstage/errors@1.2.7

## @internal/plugin-todo-list-common@1.0.25-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.9.0-next.0
