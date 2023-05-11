# Release v1.10.0-next.1

## @backstage/backend-common@0.18.0-next.0

### Minor Changes

- 5e2cebe9a3: **BREAKING**: Removed deprecated `read` method from the `UrlReader` interface. All implementations should use the `readUrl` method instead.

  Migrated `UrlReader` and related types to `backend/backend-plugin-api`, types remain re-exported from `backend-common` for now.

### Patch Changes

- 6f02d23b01: Moved `PluginEndpointDiscovery` type from backend-common to backend-plugin-api.
- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/cli-common@0.1.11
  - @backstage/config-loader@1.1.8-next.0
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0
  - @backstage/types@1.0.2

## @backstage/plugin-scaffolder-backend@1.10.0-next.1

### Minor Changes

- 04a2048fb8: Allow custom repository roles to be configured on github repos
- a69664faee: Add Github repository support for squash merge commit title and message options

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-catalog-backend@1.7.0-next.1
  - @backstage/plugin-catalog-node@1.3.1-next.1
  - @backstage/backend-tasks@0.4.1-next.0
  - @backstage/catalog-client@1.3.0-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.9-next.0
  - @backstage/plugin-scaffolder-common@1.2.4-next.1

## @backstage/app-defaults@1.0.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.3.1-next.0
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-permission-react@0.4.9-next.0

## @backstage/backend-app-api@0.2.5-next.0

### Patch Changes

- 6cfd4d7073: Updated implementations for the new `RootLifecycleService`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/backend-tasks@0.4.1-next.0
  - @backstage/errors@1.1.4
  - @backstage/plugin-permission-node@0.7.3-next.0

## @backstage/backend-defaults@0.1.5-next.0

### Patch Changes

- 6cfd4d7073: Include implementations for the new `rootLifecycleServiceRef`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/backend-app-api@0.2.5-next.0

## @backstage/backend-plugin-api@0.2.1-next.0

### Patch Changes

- 6cfd4d7073: Added `RootLifecycleService` and `rootLifecycleServiceRef`, as well as added a `labels` option to the existing `LifecycleServiceShutdownHook`.
- 5e2cebe9a3: Migrate `UrlReader` into this package to gradually remove the dependency on backend-common.
- 6f02d23b01: Moved `PluginEndpointDiscovery` type from backend-common to backend-plugin-api.
- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/backend-tasks@0.4.1-next.0
  - @backstage/plugin-permission-common@0.7.3-next.0

## @backstage/backend-tasks@0.4.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2

## @backstage/backend-test-utils@0.1.32-next.1

### Patch Changes

- 6cfd4d7073: Include implementations for the new `rootLifecycleServiceRef`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/cli@0.22.1-next.1
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/backend-app-api@0.2.5-next.0

## @backstage/catalog-client@1.3.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4

## @backstage/catalog-model@1.1.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2

## @backstage/cli@0.22.1-next.1

### Patch Changes

- db2e137744: Removed unnecessary usage of `ThemeProvider` from the `ExampleComponent` test in the plugin template.
- 4b572126f1: Add experimental environment variable to enable caching for production builds.
- Updated dependencies
  - @backstage/config@1.0.6-next.0
  - @backstage/cli-common@0.1.11
  - @backstage/config-loader@1.1.8-next.0
  - @backstage/errors@1.1.4
  - @backstage/release-manifests@0.0.8
  - @backstage/types@1.0.2

## @backstage/config@1.0.6-next.0

### Patch Changes

- ba2d69ee17: Adds the ability to coerce values to their boolean representatives.
  Values such as `"true"` `1` `on` and `y` will become `true` when using `getBoolean` and the opposites `false`.
  This happens particularly when such parameters are used with environmental substitution as environment variables are always strings.
- Updated dependencies
  - @backstage/types@1.0.2

## @backstage/config-loader@1.1.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6-next.0
  - @backstage/cli-common@0.1.11
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2

## @backstage/core-app-api@1.3.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6-next.0
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.3

## @backstage/core-components@0.12.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6-next.0
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/errors@1.1.4
  - @backstage/theme@0.2.16
  - @backstage/version-bridge@1.0.3

## @backstage/core-plugin-api@1.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6-next.0
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.3

## @backstage/create-app@0.4.36-next.1

### Patch Changes

- 724b55689b: Avoid potential temporary directory conflict.
- a2a70504e3: Remove deprecated `create-plugin` script from the `default-app` template's `package.json.hbs`.
  Also, update the documentation to not mention the `create-plugin` script and instead mention
  the `new` script.
- Updated dependencies
  - @backstage/cli-common@0.1.11

## @backstage/dev-utils@1.0.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/app-defaults@1.0.11-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-app-api@1.3.1-next.0
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/integration-react@1.1.9-next.1
  - @backstage/test-utils@1.2.4-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.4-next.1

## @backstage/integration@1.4.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4

## @backstage/integration-aws-node@0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4

## @backstage/integration-react@1.1.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6-next.0
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/integration@1.4.2-next.0
  - @backstage/theme@0.2.16

## @backstage/repo-tools@0.1.1-next.1

### Patch Changes

- d48cf39f2a: fix glob on windows os
- Updated dependencies
  - @backstage/cli-common@0.1.11
  - @backstage/errors@1.1.4

## @techdocs/cli@1.2.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/cli-common@0.1.11
  - @backstage/plugin-techdocs-node@1.4.4-next.1

## @backstage/test-utils@1.2.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6-next.0
  - @backstage/core-app-api@1.3.1-next.0
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.2
  - @backstage/plugin-permission-common@0.7.3-next.0
  - @backstage/plugin-permission-react@0.4.9-next.0

## @backstage/plugin-adr@0.2.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/integration-react@1.1.9-next.1
  - @backstage/theme@0.2.16
  - @backstage/plugin-adr-common@0.2.5-next.1
  - @backstage/plugin-catalog-react@1.2.4-next.1
  - @backstage/plugin-search-common@1.2.1-next.0
  - @backstage/plugin-search-react@1.3.2-next.1

## @backstage/plugin-adr-backend@0.2.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/catalog-client@1.3.0-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0
  - @backstage/plugin-adr-common@0.2.5-next.1
  - @backstage/plugin-search-common@1.2.1-next.0

## @backstage/plugin-adr-common@0.2.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/integration@1.4.2-next.0
  - @backstage/plugin-search-common@1.2.1-next.0

## @backstage/plugin-airbrake@0.3.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/dev-utils@1.0.11-next.1
  - @backstage/test-utils@1.2.4-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.4-next.1

## @backstage/plugin-airbrake-backend@0.2.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0

## @backstage/plugin-allure@0.1.30-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.4-next.1

## @backstage/plugin-analytics-module-ga@0.1.25-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6-next.0
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/theme@0.2.16

## @backstage/plugin-apache-airflow@0.2.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0

## @backstage/plugin-api-docs@0.8.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog@1.7.2-next.1
  - @backstage/plugin-catalog-react@1.2.4-next.1

## @backstage/plugin-apollo-explorer@0.1.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/theme@0.2.16

## @backstage/plugin-app-backend@0.3.40-next.0

### Patch Changes

- b4ffa3bd91: The warning for missing app contents is now logged as an error instead, but only in production.
- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/config-loader@1.1.8-next.0
  - @backstage/types@1.0.2

## @backstage/plugin-auth-backend@0.17.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/catalog-client@1.3.0-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.9-next.0

## @backstage/plugin-auth-node@0.2.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4

## @backstage/plugin-azure-devops@0.2.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/errors@1.1.4
  - @backstage/theme@0.2.16
  - @backstage/plugin-azure-devops-common@0.3.0
  - @backstage/plugin-catalog-react@1.2.4-next.1

## @backstage/plugin-azure-devops-backend@0.3.19-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-azure-devops-common@0.3.0

## @backstage/plugin-azure-sites@0.1.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-azure-sites-common@0.1.0
  - @backstage/plugin-catalog-react@1.2.4-next.1

## @backstage/plugin-azure-sites-backend@0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-azure-sites-common@0.1.0

## @backstage/plugin-badges@0.2.38-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/errors@1.1.4
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.4-next.1

## @backstage/plugin-badges-backend@0.1.34-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/catalog-client@1.3.0-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4

## @backstage/plugin-bazaar@0.2.3-next.1

### Patch Changes

- 0bf734dbac: Created soft cut on `ProjectCard` to indicate more content.
- 41d0b0a24a: Added `isBazaarAvailable` helper to be used with the `EntitySwitch`.
- Updated dependencies
  - @backstage/cli@0.22.1-next.1
  - @backstage/catalog-client@1.3.0-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/errors@1.1.4
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog@1.7.2-next.1
  - @backstage/plugin-catalog-react@1.2.4-next.1

## @backstage/plugin-bazaar-backend@0.2.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-test-utils@0.1.32-next.1
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4
  - @backstage/plugin-auth-node@0.2.9-next.0

## @backstage/plugin-bitbucket-cloud-common@0.2.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.4.2-next.0

## @backstage/plugin-bitrise@0.1.41-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.4-next.1

## @backstage/plugin-catalog@1.7.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.3.0-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/errors@1.1.4
  - @backstage/integration-react@1.1.9-next.1
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.10-next.1
  - @backstage/plugin-catalog-react@1.2.4-next.1
  - @backstage/plugin-search-common@1.2.1-next.0
  - @backstage/plugin-search-react@1.3.2-next.1

## @backstage/plugin-catalog-backend@1.7.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-catalog-node@1.3.1-next.1
  - @backstage/catalog-client@1.3.0-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.10-next.1
  - @backstage/plugin-permission-common@0.7.3-next.0
  - @backstage/plugin-permission-node@0.7.3-next.0
  - @backstage/plugin-scaffolder-common@1.2.4-next.1
  - @backstage/plugin-search-common@1.2.1-next.0

## @backstage/plugin-catalog-backend-module-aws@0.1.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-catalog-backend@1.7.0-next.1
  - @backstage/plugin-catalog-node@1.3.1-next.1
  - @backstage/backend-tasks@0.4.1-next.0
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0
  - @backstage/types@1.0.2

## @backstage/plugin-catalog-backend-module-azure@0.1.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-catalog-backend@1.7.0-next.1
  - @backstage/plugin-catalog-node@1.3.1-next.1
  - @backstage/backend-tasks@0.4.1-next.0
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0
  - @backstage/types@1.0.2

## @backstage/plugin-catalog-backend-module-bitbucket@0.2.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-catalog-backend@1.7.0-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-bitbucket-cloud-common@0.2.3-next.0

## @backstage/plugin-catalog-backend-module-bitbucket-cloud@0.1.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-catalog-backend@1.7.0-next.1
  - @backstage/plugin-catalog-node@1.3.1-next.1
  - @backstage/plugin-events-node@0.2.1-next.0
  - @backstage/backend-tasks@0.4.1-next.0
  - @backstage/catalog-client@1.3.0-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/integration@1.4.2-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.3-next.0
  - @backstage/plugin-catalog-common@1.0.10-next.1

## @backstage/plugin-catalog-backend-module-bitbucket-server@0.1.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-catalog-backend@1.7.0-next.1
  - @backstage/plugin-catalog-node@1.3.1-next.1
  - @backstage/backend-tasks@0.4.1-next.0
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0

## @backstage/plugin-catalog-backend-module-gerrit@0.1.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-catalog-backend@1.7.0-next.1
  - @backstage/plugin-catalog-node@1.3.1-next.1
  - @backstage/backend-tasks@0.4.1-next.0
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0

## @backstage/plugin-catalog-backend-module-github@0.2.3-next.1

### Patch Changes

- 427d8f4411: Added support for event based updates in the `GithubOrgEntityProvider`!
  Based on webhook events from GitHub the affected `User` or `Group` entity will be refreshed.
  This includes adding new entities, refreshing existing ones, and removing obsolete ones.

  Please find more information at
  <https://backstage.io/docs/integrations/github/org#installation-with-events-support>

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-catalog-backend@1.7.0-next.1
  - @backstage/plugin-catalog-node@1.3.1-next.1
  - @backstage/plugin-events-node@0.2.1-next.0
  - @backstage/backend-tasks@0.4.1-next.0
  - @backstage/catalog-client@1.3.0-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.10-next.1

## @backstage/plugin-catalog-backend-module-gitlab@0.1.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-catalog-backend@1.7.0-next.1
  - @backstage/plugin-catalog-node@1.3.1-next.1
  - @backstage/backend-tasks@0.4.1-next.0
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0
  - @backstage/types@1.0.2

## @backstage/plugin-catalog-backend-module-incremental-ingestion@0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/backend-test-utils@0.1.32-next.1
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-catalog-backend@1.7.0-next.1
  - @backstage/plugin-catalog-node@1.3.1-next.1
  - @backstage/backend-tasks@0.4.1-next.0
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4
  - @backstage/plugin-permission-common@0.7.3-next.0

## @backstage/plugin-catalog-backend-module-ldap@0.5.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-catalog-backend@1.7.0-next.1
  - @backstage/backend-tasks@0.4.1-next.0
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2

## @backstage/plugin-catalog-backend-module-msgraph@0.4.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-catalog-backend@1.7.0-next.1
  - @backstage/plugin-catalog-node@1.3.1-next.1
  - @backstage/backend-tasks@0.4.1-next.0
  - @backstage/catalog-model@1.1.5-next.1

## @backstage/plugin-catalog-backend-module-openapi@0.1.6-next.1

### Patch Changes

- f9abdb64fc: Updated internal usage of UrlReader interface.
- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-catalog-backend@1.7.0-next.1
  - @backstage/plugin-catalog-node@1.3.1-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/integration@1.4.2-next.0
  - @backstage/types@1.0.2

## @backstage/plugin-catalog-common@1.0.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/plugin-permission-common@0.7.3-next.0
  - @backstage/plugin-search-common@1.2.1-next.0

## @backstage/plugin-catalog-graph@0.2.26-next.1

### Patch Changes

- 99f05cbc70: The link from the `CatalogGraphCard` to the `CatalogGraphPage` no longer includes an explicit `maxDepth` parameter, letting the `CatalogGraphPage` choose the initial `maxDepth` instead.
- Updated dependencies
  - @backstage/catalog-client@1.3.0-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.4-next.1

## @backstage/plugin-catalog-graphql@0.3.17-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6-next.0
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/types@1.0.2

## @backstage/plugin-catalog-import@0.9.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6-next.0
  - @backstage/catalog-client@1.3.0-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0
  - @backstage/integration-react@1.1.9-next.1
  - @backstage/plugin-catalog-common@1.0.10-next.1
  - @backstage/plugin-catalog-react@1.2.4-next.1

## @backstage/plugin-catalog-node@1.3.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/catalog-client@1.3.0-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.10-next.1

## @backstage/plugin-catalog-react@1.2.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.3.0-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.3
  - @backstage/plugin-catalog-common@1.0.10-next.1
  - @backstage/plugin-permission-common@0.7.3-next.0
  - @backstage/plugin-permission-react@0.4.9-next.0

## @backstage/plugin-cicd-statistics@0.1.16-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/plugin-catalog-react@1.2.4-next.1

## @backstage/plugin-cicd-statistics-module-gitlab@0.1.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/plugin-cicd-statistics@0.1.16-next.1

## @backstage/plugin-circleci@0.3.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.4-next.1

## @backstage/plugin-cloudbuild@0.3.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.4-next.1

## @backstage/plugin-code-climate@0.1.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.4-next.1

## @backstage/plugin-code-coverage@0.2.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6-next.0
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/errors@1.1.4
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.4-next.1

## @backstage/plugin-code-coverage-backend@0.2.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/catalog-client@1.3.0-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0

## @backstage/plugin-codescene@0.1.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6-next.0
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/errors@1.1.4
  - @backstage/theme@0.2.16

## @backstage/plugin-config-schema@0.1.37-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6-next.0
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/errors@1.1.4
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.2

## @backstage/plugin-cost-insights@0.12.3-next.1

### Patch Changes

- 6a41175d70: Removed @backstage/test-utils dependency, since it was already in the devDependencies where it belongs. The main benefit is that this will exclude better-sqlite3 from the production build.
- Updated dependencies
  - @backstage/config@1.0.6-next.0
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.4-next.1
  - @backstage/plugin-cost-insights-common@0.1.1

## @backstage/plugin-dynatrace@1.0.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.4-next.1

## @backstage/plugin-events-backend@0.2.1-next.0

### Patch Changes

- 217149ae98: The default event broker will now catch and log errors thrown by the `onEvent` method of subscribers. The returned promise from `publish` method will also not resolve until all subscribers have handled the event.
- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-events-node@0.2.1-next.0

## @backstage/plugin-events-backend-module-aws-sqs@0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-events-node@0.2.1-next.0
  - @backstage/backend-tasks@0.4.1-next.0
  - @backstage/types@1.0.2

## @backstage/plugin-events-backend-module-azure@0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/plugin-events-node@0.2.1-next.0

## @backstage/plugin-events-backend-module-bitbucket-cloud@0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/plugin-events-node@0.2.1-next.0

## @backstage/plugin-events-backend-module-gerrit@0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/plugin-events-node@0.2.1-next.0

## @backstage/plugin-events-backend-module-github@0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-events-node@0.2.1-next.0

## @backstage/plugin-events-backend-module-gitlab@0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-events-node@0.2.1-next.0

## @backstage/plugin-events-backend-test-utils@0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.1-next.0

## @backstage/plugin-events-node@0.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.2.1-next.0

## @backstage/plugin-explore@0.3.45-next.1

### Patch Changes

- 9f9d279bd1: Updated `README.md` examples
- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/errors@1.1.4
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.4-next.1
  - @backstage/plugin-explore-common@0.0.1
  - @backstage/plugin-explore-react@0.0.25-next.0
  - @backstage/plugin-search-common@1.2.1-next.0
  - @backstage/plugin-search-react@1.3.2-next.1

## @backstage/plugin-explore-backend@0.0.2-next.1

### Patch Changes

- 9f9d279bd1: Updated `README.md` examples
- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-explore-common@0.0.1
  - @backstage/plugin-search-common@1.2.1-next.0

## @backstage/plugin-explore-react@0.0.25-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/plugin-explore-common@0.0.1

## @backstage/plugin-firehydrant@0.1.31-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.4-next.1

## @backstage/plugin-fossa@0.2.46-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/errors@1.1.4
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.4-next.1

## @backstage/plugin-gcalendar@0.3.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/errors@1.1.4
  - @backstage/theme@0.2.16

## @backstage/plugin-gcp-projects@0.3.33-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/theme@0.2.16

## @backstage/plugin-git-release-manager@0.3.27-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/integration@1.4.2-next.0
  - @backstage/theme@0.2.16

## @backstage/plugin-github-actions@0.5.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/integration@1.4.2-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.4-next.1

## @backstage/plugin-github-deployments@0.1.45-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0
  - @backstage/integration-react@1.1.9-next.1
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.4-next.1

## @backstage/plugin-github-issues@0.2.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.4-next.1

## @backstage/plugin-github-pull-requests-board@0.1.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/integration@1.4.2-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.4-next.1

## @backstage/plugin-gitops-profiles@0.3.32-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/theme@0.2.16

## @backstage/plugin-gocd@0.1.20-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/errors@1.1.4
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.4-next.1

## @backstage/plugin-graphiql@0.2.46-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/theme@0.2.16

## @backstage/plugin-graphql-backend@0.1.30-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-catalog-graphql@0.3.17-next.1

## @backstage/plugin-home@0.4.30-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6-next.0
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.4-next.1
  - @backstage/plugin-stack-overflow@0.1.10-next.1

## @backstage/plugin-ilert@0.2.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/errors@1.1.4
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.4-next.1

## @backstage/plugin-jenkins@0.7.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/errors@1.1.4
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.4-next.1
  - @backstage/plugin-jenkins-common@0.1.12-next.1

## @backstage/plugin-jenkins-backend@0.1.30-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/catalog-client@1.3.0-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4
  - @backstage/plugin-auth-node@0.2.9-next.0
  - @backstage/plugin-jenkins-common@0.1.12-next.1
  - @backstage/plugin-permission-common@0.7.3-next.0

## @backstage/plugin-jenkins-common@0.1.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-common@1.0.10-next.1
  - @backstage/plugin-permission-common@0.7.3-next.0

## @backstage/plugin-kafka@0.3.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6-next.0
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.4-next.1

## @backstage/plugin-kafka-backend@0.2.33-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4

## @backstage/plugin-kubernetes@0.7.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6-next.0
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.4-next.1
  - @backstage/plugin-kubernetes-common@0.5.1-next.1

## @backstage/plugin-kubernetes-backend@0.9.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-test-utils@0.1.32-next.1
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/catalog-client@1.3.0-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4
  - @backstage/plugin-auth-node@0.2.9-next.0
  - @backstage/plugin-kubernetes-common@0.5.1-next.1

## @backstage/plugin-kubernetes-common@0.5.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1

## @backstage/plugin-lighthouse@0.3.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6-next.0
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.4-next.1

## @backstage/plugin-newrelic@0.3.32-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/theme@0.2.16

## @backstage/plugin-newrelic-dashboard@0.2.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/errors@1.1.4
  - @backstage/plugin-catalog-react@1.2.4-next.1

## @backstage/plugin-org@0.6.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.4-next.1

## @backstage/plugin-org-react@0.1.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.3.0-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.4-next.1

## @backstage/plugin-pagerduty@0.5.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/errors@1.1.4
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.4-next.1

## @backstage/plugin-periskop@0.1.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/errors@1.1.4
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.4-next.1

## @backstage/plugin-periskop-backend@0.1.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0

## @backstage/plugin-permission-backend@0.5.15-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4
  - @backstage/plugin-auth-node@0.2.9-next.0
  - @backstage/plugin-permission-common@0.7.3-next.0
  - @backstage/plugin-permission-node@0.7.3-next.0

## @backstage/plugin-permission-common@0.7.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2

## @backstage/plugin-permission-node@0.7.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4
  - @backstage/plugin-auth-node@0.2.9-next.0
  - @backstage/plugin-permission-common@0.7.3-next.0

## @backstage/plugin-permission-react@0.4.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6-next.0
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/plugin-permission-common@0.7.3-next.0

## @backstage/plugin-playlist@0.1.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/errors@1.1.4
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-common@1.0.10-next.1
  - @backstage/plugin-catalog-react@1.2.4-next.1
  - @backstage/plugin-permission-common@0.7.3-next.0
  - @backstage/plugin-permission-react@0.4.9-next.0
  - @backstage/plugin-playlist-common@0.1.4-next.0
  - @backstage/plugin-search-react@1.3.2-next.1

## @backstage/plugin-playlist-backend@0.2.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-test-utils@0.1.32-next.1
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/catalog-client@1.3.0-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4
  - @backstage/plugin-auth-node@0.2.9-next.0
  - @backstage/plugin-permission-common@0.7.3-next.0
  - @backstage/plugin-permission-node@0.7.3-next.0
  - @backstage/plugin-playlist-common@0.1.4-next.0

## @backstage/plugin-playlist-common@0.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.7.3-next.0

## @backstage/plugin-proxy-backend@0.2.34-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0

## @backstage/plugin-rollbar@0.4.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.4-next.1

## @backstage/plugin-rollbar-backend@0.1.37-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0

## @backstage/plugin-scaffolder@1.10.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6-next.0
  - @backstage/catalog-client@1.3.0-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0
  - @backstage/integration-react@1.1.9-next.1
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.10-next.1
  - @backstage/plugin-catalog-react@1.2.4-next.1
  - @backstage/plugin-permission-react@0.4.9-next.0
  - @backstage/plugin-scaffolder-common@1.2.4-next.1

## @backstage/plugin-scaffolder-backend-module-cookiecutter@0.2.15-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.10.0-next.1
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0
  - @backstage/types@1.0.2

## @backstage/plugin-scaffolder-backend-module-rails@0.4.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.10.0-next.1
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0
  - @backstage/types@1.0.2

## @backstage/plugin-scaffolder-backend-module-yeoman@0.2.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.10.0-next.1
  - @backstage/config@1.0.6-next.0
  - @backstage/types@1.0.2

## @backstage/plugin-scaffolder-common@1.2.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/types@1.0.2

## @backstage/plugin-search@1.0.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6-next.0
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/errors@1.1.4
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.3
  - @backstage/plugin-catalog-react@1.2.4-next.1
  - @backstage/plugin-search-common@1.2.1-next.0
  - @backstage/plugin-search-react@1.3.2-next.1

## @backstage/plugin-search-backend@1.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.9-next.0
  - @backstage/plugin-permission-common@0.7.3-next.0
  - @backstage/plugin-permission-node@0.7.3-next.0
  - @backstage/plugin-search-backend-node@1.1.1-next.1
  - @backstage/plugin-search-common@1.2.1-next.0

## @backstage/plugin-search-backend-module-elasticsearch@1.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-search-backend-node@1.1.1-next.1
  - @backstage/plugin-search-common@1.2.1-next.0

## @backstage/plugin-search-backend-module-pg@0.5.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-search-backend-node@1.1.1-next.1
  - @backstage/plugin-search-common@1.2.1-next.0

## @backstage/plugin-search-backend-node@1.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/backend-tasks@0.4.1-next.0
  - @backstage/errors@1.1.4
  - @backstage/plugin-permission-common@0.7.3-next.0
  - @backstage/plugin-search-common@1.2.1-next.0

## @backstage/plugin-search-common@1.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/types@1.0.2
  - @backstage/plugin-permission-common@0.7.3-next.0

## @backstage/plugin-search-react@1.3.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.3
  - @backstage/plugin-search-common@1.2.1-next.0

## @backstage/plugin-sentry@0.4.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.4-next.1

## @backstage/plugin-shortcuts@0.3.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.2

## @backstage/plugin-sonarqube@0.6.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.4-next.1
  - @backstage/plugin-sonarqube-react@0.1.1-next.1

## @backstage/plugin-sonarqube-backend@0.1.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4

## @backstage/plugin-sonarqube-react@0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-plugin-api@1.2.1-next.0

## @backstage/plugin-splunk-on-call@0.4.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.4-next.1

## @backstage/plugin-stack-overflow@0.1.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6-next.0
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-home@0.4.30-next.1
  - @backstage/plugin-search-common@1.2.1-next.0
  - @backstage/plugin-search-react@1.3.2-next.1

## @backstage/plugin-stack-overflow-backend@0.1.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-search-common@1.2.1-next.0

## @backstage/plugin-tech-insights@0.3.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/errors@1.1.4
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-react@1.2.4-next.1
  - @backstage/plugin-tech-insights-common@0.2.9

## @backstage/plugin-tech-insights-backend@0.5.6-next.1

### Patch Changes

- 7a38a31699: Complete check results run when a single check errors so that we don't block other checks from working due to an error in a single check
- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/backend-tasks@0.4.1-next.0
  - @backstage/catalog-client@1.3.0-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2
  - @backstage/plugin-tech-insights-common@0.2.9
  - @backstage/plugin-tech-insights-node@0.3.8-next.0

## @backstage/plugin-tech-insights-backend-module-jsonfc@0.1.24-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4
  - @backstage/plugin-tech-insights-common@0.2.9
  - @backstage/plugin-tech-insights-node@0.3.8-next.0

## @backstage/plugin-tech-insights-node@0.3.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/backend-tasks@0.4.1-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-tech-insights-common@0.2.9

## @backstage/plugin-tech-radar@0.5.21-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/theme@0.2.16

## @backstage/plugin-techdocs@1.4.3-next.1

### Patch Changes

- a74dd61534: Fix sizing of build log component to render all lines
- Updated dependencies
  - @backstage/config@1.0.6-next.0
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0
  - @backstage/integration-react@1.1.9-next.1
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.4-next.1
  - @backstage/plugin-search-common@1.2.1-next.0
  - @backstage/plugin-search-react@1.3.2-next.1
  - @backstage/plugin-techdocs-react@1.1.2-next.1

## @backstage/plugin-techdocs-addons-test-utils@1.0.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-techdocs@1.4.3-next.1
  - @backstage/core-app-api@1.3.1-next.0
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/integration-react@1.1.9-next.1
  - @backstage/test-utils@1.2.4-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog@1.7.2-next.1
  - @backstage/plugin-search-react@1.3.2-next.1
  - @backstage/plugin-techdocs-react@1.1.2-next.1

## @backstage/plugin-techdocs-backend@1.5.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/catalog-client@1.3.0-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0
  - @backstage/plugin-catalog-common@1.0.10-next.1
  - @backstage/plugin-permission-common@0.7.3-next.0
  - @backstage/plugin-search-common@1.2.1-next.0
  - @backstage/plugin-techdocs-node@1.4.4-next.1

## @backstage/plugin-techdocs-module-addons-contrib@1.0.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/integration@1.4.2-next.0
  - @backstage/integration-react@1.1.9-next.1
  - @backstage/theme@0.2.16
  - @backstage/plugin-techdocs-react@1.1.2-next.1

## @backstage/plugin-techdocs-node@1.4.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0
  - @backstage/integration-aws-node@0.1.1-next.0
  - @backstage/plugin-search-common@1.2.1-next.0

## @backstage/plugin-techdocs-react@1.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6-next.0
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/version-bridge@1.0.3

## @backstage/plugin-todo@0.2.16-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/errors@1.1.4
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.4-next.1

## @backstage/plugin-todo-backend@0.1.37-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/catalog-client@1.3.0-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0

## @backstage/plugin-user-settings@0.6.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.3.1-next.0
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/errors@1.1.4
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.2

## @backstage/plugin-user-settings-backend@0.1.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.9-next.0

## @backstage/plugin-vault@0.1.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/errors@1.1.4
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.4-next.1

## @backstage/plugin-vault-backend@0.2.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-test-utils@0.1.32-next.1
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/backend-tasks@0.4.1-next.0
  - @backstage/errors@1.1.4

## @backstage/plugin-xcmetrics@0.2.34-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/errors@1.1.4
  - @backstage/theme@0.2.16

## example-app@0.2.79-next.1

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.22.1-next.1
  - @backstage/plugin-catalog-graph@0.2.26-next.1
  - @backstage/plugin-explore@0.3.45-next.1
  - @backstage/plugin-techdocs@1.4.3-next.1
  - @backstage/plugin-cost-insights@0.12.3-next.1
  - @backstage/config@1.0.6-next.0
  - @backstage/app-defaults@1.0.11-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-app-api@1.3.1-next.0
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/integration-react@1.1.9-next.1
  - @backstage/theme@0.2.16
  - @backstage/plugin-airbrake@0.3.14-next.1
  - @backstage/plugin-apache-airflow@0.2.7-next.1
  - @backstage/plugin-api-docs@0.8.14-next.1
  - @backstage/plugin-azure-devops@0.2.5-next.1
  - @backstage/plugin-azure-sites@0.1.3-next.1
  - @backstage/plugin-badges@0.2.38-next.1
  - @backstage/plugin-catalog-common@1.0.10-next.1
  - @backstage/plugin-catalog-import@0.9.4-next.1
  - @backstage/plugin-catalog-react@1.2.4-next.1
  - @backstage/plugin-circleci@0.3.14-next.1
  - @backstage/plugin-cloudbuild@0.3.14-next.1
  - @backstage/plugin-code-coverage@0.2.7-next.1
  - @backstage/plugin-dynatrace@1.0.4-next.1
  - @backstage/plugin-gcalendar@0.3.10-next.1
  - @backstage/plugin-gcp-projects@0.3.33-next.1
  - @backstage/plugin-github-actions@0.5.14-next.1
  - @backstage/plugin-gocd@0.1.20-next.1
  - @backstage/plugin-graphiql@0.2.46-next.1
  - @backstage/plugin-home@0.4.30-next.1
  - @backstage/plugin-jenkins@0.7.13-next.1
  - @backstage/plugin-kafka@0.3.14-next.1
  - @backstage/plugin-kubernetes@0.7.7-next.1
  - @backstage/plugin-lighthouse@0.3.14-next.1
  - @backstage/plugin-newrelic@0.3.32-next.1
  - @backstage/plugin-newrelic-dashboard@0.2.7-next.1
  - @backstage/plugin-org@0.6.4-next.1
  - @backstage/plugin-pagerduty@0.5.7-next.1
  - @backstage/plugin-permission-react@0.4.9-next.0
  - @backstage/plugin-playlist@0.1.5-next.1
  - @backstage/plugin-rollbar@0.4.14-next.1
  - @backstage/plugin-scaffolder@1.10.0-next.1
  - @backstage/plugin-search@1.0.7-next.1
  - @backstage/plugin-search-common@1.2.1-next.0
  - @backstage/plugin-search-react@1.3.2-next.1
  - @backstage/plugin-sentry@0.4.7-next.1
  - @backstage/plugin-shortcuts@0.3.6-next.1
  - @backstage/plugin-stack-overflow@0.1.10-next.1
  - @backstage/plugin-tech-insights@0.3.6-next.1
  - @backstage/plugin-tech-radar@0.5.21-next.1
  - @backstage/plugin-techdocs-module-addons-contrib@1.0.9-next.1
  - @backstage/plugin-techdocs-react@1.1.2-next.1
  - @backstage/plugin-todo@0.2.16-next.1
  - @backstage/plugin-user-settings@0.6.2-next.1
  - @internal/plugin-catalog-customized@0.0.6-next.1

## example-backend@0.2.79-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.10.0-next.1
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/plugin-explore-backend@0.0.2-next.1
  - @backstage/plugin-events-backend@0.2.1-next.0
  - @backstage/plugin-app-backend@0.3.40-next.0
  - @backstage/plugin-tech-insights-backend@0.5.6-next.1
  - @backstage/config@1.0.6-next.0
  - @backstage/plugin-catalog-backend@1.7.0-next.1
  - @backstage/plugin-catalog-node@1.3.1-next.1
  - @backstage/plugin-events-node@0.2.1-next.0
  - example-app@0.2.79-next.1
  - @backstage/backend-tasks@0.4.1-next.0
  - @backstage/catalog-client@1.3.0-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/integration@1.4.2-next.0
  - @backstage/plugin-auth-backend@0.17.3-next.1
  - @backstage/plugin-auth-node@0.2.9-next.0
  - @backstage/plugin-azure-devops-backend@0.3.19-next.0
  - @backstage/plugin-azure-sites-backend@0.1.2-next.0
  - @backstage/plugin-badges-backend@0.1.34-next.1
  - @backstage/plugin-code-coverage-backend@0.2.6-next.1
  - @backstage/plugin-graphql-backend@0.1.30-next.1
  - @backstage/plugin-jenkins-backend@0.1.30-next.1
  - @backstage/plugin-kafka-backend@0.2.33-next.1
  - @backstage/plugin-kubernetes-backend@0.9.1-next.1
  - @backstage/plugin-permission-backend@0.5.15-next.0
  - @backstage/plugin-permission-common@0.7.3-next.0
  - @backstage/plugin-permission-node@0.7.3-next.0
  - @backstage/plugin-playlist-backend@0.2.3-next.1
  - @backstage/plugin-proxy-backend@0.2.34-next.0
  - @backstage/plugin-rollbar-backend@0.1.37-next.0
  - @backstage/plugin-scaffolder-backend-module-rails@0.4.8-next.1
  - @backstage/plugin-search-backend@1.2.1-next.1
  - @backstage/plugin-search-backend-module-elasticsearch@1.1.1-next.1
  - @backstage/plugin-search-backend-module-pg@0.5.1-next.1
  - @backstage/plugin-search-backend-node@1.1.1-next.1
  - @backstage/plugin-search-common@1.2.1-next.0
  - @backstage/plugin-tech-insights-backend-module-jsonfc@0.1.24-next.0
  - @backstage/plugin-tech-insights-node@0.3.8-next.0
  - @backstage/plugin-techdocs-backend@1.5.1-next.1
  - @backstage/plugin-todo-backend@0.1.37-next.1

## example-backend-next@0.0.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.1.5-next.0
  - @backstage/plugin-scaffolder-backend@1.10.0-next.1
  - @backstage/plugin-app-backend@0.3.40-next.0
  - @backstage/plugin-catalog-backend@1.7.0-next.1

## techdocs-cli-embedded-app@0.2.78-next.1

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.22.1-next.1
  - @backstage/plugin-techdocs@1.4.3-next.1
  - @backstage/config@1.0.6-next.0
  - @backstage/app-defaults@1.0.11-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-app-api@1.3.1-next.0
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/integration-react@1.1.9-next.1
  - @backstage/test-utils@1.2.4-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog@1.7.2-next.1
  - @backstage/plugin-techdocs-react@1.1.2-next.1

## @internal/plugin-catalog-customized@0.0.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog@1.7.2-next.1
  - @backstage/plugin-catalog-react@1.2.4-next.1

## @internal/plugin-todo-list@1.0.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/theme@0.2.16

## @internal/plugin-todo-list-backend@1.0.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4
  - @backstage/plugin-auth-node@0.2.9-next.0

## @internal/plugin-todo-list-common@1.0.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.7.3-next.0
