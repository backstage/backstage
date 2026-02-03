# Release v1.24.0-next.1

## @backstage/config@1.2.0-next.1

### Minor Changes

- 50cf9df: The `ConfigReader` now treats `null` values as present but explicitly undefined, meaning it will not fall back to the next level of configuration.

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1

## @backstage/config-loader@1.7.0-next.1

### Minor Changes

- db8358d: Forward `null` values read from configuration files in configuration data, rather than treating them as an absence of config.

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/cli-common@0.1.13
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1

## @backstage/repo-tools@0.7.0-next.1

### Minor Changes

- 8bfcc50: Fix knip-report command to send 1 exit status in case of fail

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/cli-common@0.1.13
  - @backstage/cli-node@0.2.4-next.0
  - @backstage/errors@1.2.4-next.0

## @backstage/plugin-azure-devops@0.4.0-next.1

### Minor Changes

- 3270b1b: Azure DevOps plugin is now integrated with permission framework for its core features, see the <https://github.com/backstage/backstage/blob/master/plugins/azure-devops/README.md#permission-framework> for more details.

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/plugin-azure-devops-common@0.4.0-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/plugin-permission-react@0.4.21-next.1
  - @backstage/frontend-plugin-api@0.6.1-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/core-compat-api@0.2.1-next.1
  - @backstage/errors@1.2.4-next.0

## @backstage/plugin-azure-devops-backend@0.6.0-next.1

### Minor Changes

- 3270b1b: Azure DevOps plugin is now integrated with permission framework for its core features, see the <https://github.com/backstage/backstage/blob/master/plugins/azure-devops/README.md#permission-framework> for more details.

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/plugin-azure-devops-common@0.4.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/plugin-permission-node@0.7.25-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-catalog-common@1.0.22-next.1
  - @backstage/plugin-catalog-node@1.8.0-next.1

## @backstage/plugin-notifications@0.1.0-next.1

### Minor Changes

- 07abfe1: The NotificationsPage newly uses pagination implemented on the backend layer to avoid large dataset transfers

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-notifications-common@0.0.2-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/theme@0.5.2-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-signals-react@0.0.2-next.1

## @backstage/plugin-notifications-backend@0.1.0-next.1

### Minor Changes

- 07abfe1: The NotificationsPage newly uses pagination implemented on the backend layer to avoid large dataset transfers
- daf85dc: BREAKING CHANGE: Migrates signals to use the `EventsService` and makes it mandatory

### Patch Changes

- a790a3d: Move notification origin resolving to backend with new auth
- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/plugin-notifications-common@0.0.2-next.1
  - @backstage/plugin-notifications-node@0.1.0-next.1
  - @backstage/plugin-signals-node@0.1.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-events-node@0.3.0-next.1

## @backstage/plugin-scaffolder-backend@1.22.0-next.1

### Minor Changes

- aa543c9: Migrate plugin to use the new auth services, add an optional service discovery to the router options and change the permissions type to be `PermissionsService`.

### Patch Changes

- bbd1fe1: Made "checkpoint" on scaffolder action context non-optional
- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/plugin-scaffolder-node@0.4.0-next.1
  - @backstage/plugin-scaffolder-backend-module-github@0.2.4-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/plugin-permission-node@0.7.25-next.1
  - @backstage/plugin-scaffolder-backend-module-azure@0.1.6-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.2.4-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.1.4-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.1.4-next.1
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.1.6-next.1
  - @backstage/plugin-scaffolder-backend-module-gitea@0.1.4-next.1
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.2.17-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.11-next.1
  - @backstage/plugin-catalog-node@1.8.0-next.1
  - @backstage/plugin-scaffolder-common@1.5.1-next.1

## @backstage/plugin-scaffolder-node@0.4.0-next.1

### Minor Changes

- aa543c9: Update task context type to contain the new auth initiator credentials.

### Patch Changes

- bbd1fe1: Made "checkpoint" on scaffolder action context non-optional
- Updated dependencies
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-scaffolder-common@1.5.1-next.1

## @backstage/plugin-signals-backend@0.1.0-next.1

### Minor Changes

- daf85dc: BREAKING CHANGE: Migrates signals to use the `EventsService` and makes it mandatory

### Patch Changes

- df45710: Improved error logging and fixed authentication
- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/plugin-signals-node@0.1.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.3.0-next.1

## @backstage/plugin-signals-node@0.1.0-next.1

### Minor Changes

- daf85dc: BREAKING CHANGE: Migrates signals to use the `EventsService` and makes it mandatory

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.3.0-next.1

## @backstage/app-defaults@1.5.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/core-app-api@1.12.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/plugin-permission-react@0.4.21-next.1
  - @backstage/theme@0.5.2-next.0

## @backstage/backend-app-api@0.6.0-next.1

### Patch Changes

- 81e0120: Fixed an issue where configuration schema for the purpose of redacting secrets from logs was not being read correctly.
- f235ca7: Make sure to not filter out schemas in `createConfigSecretEnumerator`
- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/config-loader@1.7.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/plugin-permission-node@0.7.25-next.1
  - @backstage/cli-common@0.1.13
  - @backstage/cli-node@0.2.4-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1

## @backstage/backend-common@0.21.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/config-loader@1.7.0-next.1
  - @backstage/backend-app-api@0.6.0-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/integration-aws-node@0.1.10-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/backend-dev-utils@0.1.4
  - @backstage/cli-common@0.1.13
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1

## @backstage/backend-defaults@0.2.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.6.0-next.1
  - @backstage/backend-common@0.21.4-next.1

## @backstage/backend-dynamic-feature-service@0.2.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/plugin-scaffolder-node@0.4.0-next.1
  - @backstage/config-loader@1.7.0-next.1
  - @backstage/backend-app-api@0.6.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/plugin-catalog-backend@1.18.0-next.1
  - @backstage/plugin-events-backend@0.3.0-next.1
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/plugin-permission-node@0.7.25-next.1
  - @backstage/plugin-search-backend-node@1.2.18-next.1
  - @backstage/plugin-app-node@0.1.14-next.1
  - @backstage/cli-common@0.1.13
  - @backstage/cli-node@0.2.4-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.3.0-next.1
  - @backstage/plugin-search-common@1.2.11-next.1

## @backstage/backend-openapi-utils@0.1.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/errors@1.2.4-next.0

## @backstage/backend-plugin-api@0.6.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/types@1.1.1

## @backstage/backend-tasks@0.5.19-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1

## @backstage/backend-test-utils@0.3.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-app-api@0.6.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1

## @backstage/cli@0.25.3-next.1

### Patch Changes

- 8dce287: Fix prettier issues on default plugins & module templates
- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/config-loader@1.7.0-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/cli-common@0.1.13
  - @backstage/cli-node@0.2.4-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/eslint-plugin@0.1.6-next.0
  - @backstage/release-manifests@0.0.11
  - @backstage/types@1.1.1

## @backstage/core-app-api@1.12.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## @backstage/core-compat-api@0.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.12.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/frontend-plugin-api@0.6.1-next.1
  - @backstage/version-bridge@1.0.7

## @backstage/core-components@0.14.1-next.1

### Patch Changes

- 2ff3e6e: The translation support for the `Link` component has been removed for now, in order to avoid broad breakages of tests in existing projects where the component is tested without being wrapped in an API provider.
- 2d06e4b: Move the text-transform styling on BackstageTableHeader from inline styling to `withStyles` so it can be customised easier
- 5c271fa: Removed inline styling in breadcrumbs and replaced with a theme reachable class of BreadcrumbsCurrentPage
- 0a8a1e9: Fix a spacing issue for the SidebarSubmenu in case a SidebarScrollWrapper is used that made it hard to reach the SidebarSubmenu
- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/theme@0.5.2-next.0
  - @backstage/version-bridge@1.0.7

## @backstage/core-plugin-api@1.9.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## @backstage/create-app@0.5.12-next.1

### Patch Changes

- Bumped create-app version.
- Updated dependencies
  - @backstage/cli-common@0.1.13

## @backstage/dev-utils@1.0.28-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-app-api@1.12.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/integration-react@1.1.25-next.1
  - @backstage/app-defaults@1.5.1-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/theme@0.5.2-next.0

## @backstage/frontend-app-api@0.6.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/core-components@0.14.1-next.1
  - @backstage/core-app-api@1.12.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/frontend-plugin-api@0.6.1-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/theme@0.5.2-next.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## @backstage/frontend-plugin-api@0.6.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## @backstage/frontend-test-utils@0.1.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/frontend-app-api@0.6.1-next.1
  - @backstage/test-utils@1.5.1-next.1
  - @backstage/frontend-plugin-api@0.6.1-next.1
  - @backstage/types@1.1.1

## @backstage/integration@1.9.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/errors@1.2.4-next.0

## @backstage/integration-aws-node@0.1.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/errors@1.2.4-next.0

## @backstage/integration-react@1.1.25-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/integration@1.9.1-next.1

## @techdocs/cli@1.8.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/plugin-techdocs-node@1.11.6-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/cli-common@0.1.13

## @backstage/test-utils@1.5.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/core-app-api@1.12.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/plugin-permission-react@0.4.21-next.1
  - @backstage/theme@0.5.2-next.0
  - @backstage/types@1.1.1

## @backstage/plugin-adr@0.6.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/integration-react@1.1.25-next.1
  - @backstage/frontend-plugin-api@0.6.1-next.1
  - @backstage/plugin-search-react@1.7.7-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/plugin-adr-common@0.2.21-next.1
  - @backstage/plugin-search-common@1.2.11-next.1

## @backstage/plugin-adr-backend@0.4.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-adr-common@0.2.21-next.1
  - @backstage/plugin-search-common@1.2.11-next.1

## @backstage/plugin-adr-common@0.2.21-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/plugin-search-common@1.2.11-next.1

## @backstage/plugin-airbrake@0.3.31-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/test-utils@1.5.1-next.1
  - @backstage/dev-utils@1.0.28-next.1
  - @backstage/catalog-model@1.4.5-next.0

## @backstage/plugin-airbrake-backend@0.3.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1

## @backstage/plugin-allure@0.1.47-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0

## @backstage/plugin-analytics-module-ga@0.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/core-components@0.14.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/frontend-plugin-api@0.6.1-next.1

## @backstage/plugin-analytics-module-ga4@0.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/core-components@0.14.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/frontend-plugin-api@0.6.1-next.1

## @backstage/plugin-analytics-module-newrelic-browser@0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/core-components@0.14.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/frontend-plugin-api@0.6.1-next.1

## @backstage/plugin-apache-airflow@0.2.21-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1

## @backstage/plugin-api-docs@0.11.1-next.1

### Patch Changes

- efba3d2: Updated dependency `@asyncapi/react-component` to `1.3.1`.
- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/plugin-catalog@1.17.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/plugin-permission-react@0.4.21-next.1
  - @backstage/frontend-plugin-api@0.6.1-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/core-compat-api@0.2.1-next.1
  - @backstage/plugin-catalog-common@1.0.22-next.1

## @backstage/plugin-apollo-explorer@0.1.21-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1

## @backstage/plugin-app-backend@0.3.62-next.1

### Patch Changes

- 52e43f2: Disable default auth policy, allowing unauthenticated access to app bundle.
- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/config-loader@1.7.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-app-node@0.1.14-next.1
  - @backstage/types@1.1.1

## @backstage/plugin-app-node@0.1.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config-loader@1.7.0-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1

## @backstage/plugin-app-visualizer@0.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/frontend-plugin-api@0.6.1-next.1

## @backstage/plugin-auth-backend@0.22.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-backend-module-aws-alb-provider@0.1.5-next.1
  - @backstage/plugin-auth-backend-module-microsoft-provider@0.1.9-next.1
  - @backstage/plugin-auth-backend-module-oidc-provider@0.1.4-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-backend-module-atlassian-provider@0.1.6-next.1
  - @backstage/plugin-auth-backend-module-gcp-iap-provider@0.2.9-next.1
  - @backstage/plugin-auth-backend-module-github-provider@0.1.11-next.1
  - @backstage/plugin-auth-backend-module-gitlab-provider@0.1.11-next.1
  - @backstage/plugin-auth-backend-module-google-provider@0.1.11-next.1
  - @backstage/plugin-auth-backend-module-oauth2-provider@0.1.11-next.1
  - @backstage/plugin-auth-backend-module-oauth2-proxy-provider@0.1.7-next.1
  - @backstage/plugin-auth-backend-module-okta-provider@0.0.7-next.1
  - @backstage/plugin-catalog-node@1.8.0-next.1

## @backstage/plugin-auth-backend-module-atlassian-provider@0.1.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1

## @backstage/plugin-auth-backend-module-aws-alb-provider@0.1.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-backend@0.22.0-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/errors@1.2.4-next.0

## @backstage/plugin-auth-backend-module-gcp-iap-provider@0.2.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1

## @backstage/plugin-auth-backend-module-github-provider@0.1.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1

## @backstage/plugin-auth-backend-module-gitlab-provider@0.1.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1

## @backstage/plugin-auth-backend-module-google-provider@0.1.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1

## @backstage/plugin-auth-backend-module-guest-provider@0.1.0-next.1

### Patch Changes

- 72dd380: Ensure that the config schema is present
- Updated dependencies
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0

## @backstage/plugin-auth-backend-module-microsoft-provider@0.1.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1

## @backstage/plugin-auth-backend-module-oauth2-provider@0.1.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1

## @backstage/plugin-auth-backend-module-oauth2-proxy-provider@0.1.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/errors@1.2.4-next.0

## @backstage/plugin-auth-backend-module-oidc-provider@0.1.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-backend@0.22.0-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1

## @backstage/plugin-auth-backend-module-okta-provider@0.0.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1

## @backstage/plugin-auth-backend-module-pinniped-provider@0.1.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1

## @backstage/plugin-auth-backend-module-vmware-cloud-provider@0.1.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/catalog-model@1.4.5-next.0

## @backstage/plugin-auth-node@0.4.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1

## @backstage/plugin-azure-devops-common@0.4.0-next.1

### Patch Changes

- 3270b1b: Azure DevOps plugin is now integrated with permission framework for its core features, see the <https://github.com/backstage/backstage/blob/master/plugins/azure-devops/README.md#permission-framework> for more details.
- Updated dependencies
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/plugin-catalog-common@1.0.22-next.1

## @backstage/plugin-azure-sites@0.1.20-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/plugin-permission-react@0.4.21-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/theme@0.5.2-next.0
  - @backstage/plugin-azure-sites-common@0.1.3-next.1

## @backstage/plugin-azure-sites-backend@0.3.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/plugin-permission-node@0.7.25-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-azure-sites-common@0.1.3-next.1
  - @backstage/plugin-catalog-node@1.8.0-next.1

## @backstage/plugin-azure-sites-common@0.1.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/plugin-catalog-common@1.0.22-next.1

## @backstage/plugin-badges@0.2.55-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0

## @backstage/plugin-badges-backend@0.3.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0

## @backstage/plugin-bazaar@0.2.23-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0

## @backstage/plugin-bazaar-backend@0.3.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1

## @backstage/plugin-bitbucket-cloud-common@0.2.17-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.9.1-next.1

## @backstage/plugin-bitrise@0.1.58-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0

## @backstage/plugin-catalog@1.17.1-next.1

### Patch Changes

- 2ac1630: Added support for passing in custom filters to `CatalogIndexPage`
- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/integration-react@1.1.25-next.1
  - @backstage/plugin-permission-react@0.4.21-next.1
  - @backstage/frontend-plugin-api@0.6.1-next.1
  - @backstage/plugin-search-react@1.7.7-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/core-compat-api@0.2.1-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.22-next.1
  - @backstage/plugin-scaffolder-common@1.5.1-next.1
  - @backstage/plugin-search-common@1.2.11-next.1

## @backstage/plugin-catalog-backend@1.18.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/repo-tools@0.7.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/plugin-permission-node@0.7.25-next.1
  - @backstage/plugin-search-backend-module-catalog@0.1.18-next.1
  - @backstage/backend-openapi-utils@0.1.7-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.22-next.1
  - @backstage/plugin-catalog-node@1.8.0-next.1
  - @backstage/plugin-events-node@0.3.0-next.1

## @backstage/plugin-catalog-backend-module-aws@0.3.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/integration-aws-node@0.1.10-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-catalog-common@1.0.22-next.1
  - @backstage/plugin-catalog-node@1.8.0-next.1
  - @backstage/plugin-kubernetes-common@0.7.5-next.1

## @backstage/plugin-catalog-backend-module-azure@0.1.33-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/plugin-catalog-common@1.0.22-next.1
  - @backstage/plugin-catalog-node@1.8.0-next.1

## @backstage/plugin-catalog-backend-module-backstage-openapi@0.1.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/backend-openapi-utils@0.1.7-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-catalog-node@1.8.0-next.1

## @backstage/plugin-catalog-backend-module-bitbucket-cloud@0.2.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.17-next.1
  - @backstage/plugin-catalog-common@1.0.22-next.1
  - @backstage/plugin-catalog-node@1.8.0-next.1
  - @backstage/plugin-events-node@0.3.0-next.1

## @backstage/plugin-catalog-backend-module-bitbucket-server@0.1.27-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-catalog-node@1.8.0-next.1

## @backstage/plugin-catalog-backend-module-gcp@0.1.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/plugin-catalog-node@1.8.0-next.1
  - @backstage/plugin-kubernetes-common@0.7.5-next.1

## @backstage/plugin-catalog-backend-module-gerrit@0.1.30-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-catalog-node@1.8.0-next.1

## @backstage/plugin-catalog-backend-module-github@0.5.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/plugin-catalog-backend@1.18.0-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/plugin-catalog-common@1.0.22-next.1
  - @backstage/plugin-catalog-node@1.8.0-next.1
  - @backstage/plugin-events-node@0.3.0-next.1

## @backstage/plugin-catalog-backend-module-github-org@0.1.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/plugin-catalog-backend-module-github@0.5.4-next.1
  - @backstage/plugin-catalog-node@1.8.0-next.1

## @backstage/plugin-catalog-backend-module-gitlab@0.3.11-next.1

### Patch Changes

- 9f5b8bc: Add GitLab `visibility` to group entity annotations.
- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/plugin-catalog-node@1.8.0-next.1

## @backstage/plugin-catalog-backend-module-incremental-ingestion@0.4.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/plugin-catalog-backend@1.18.0-next.1
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-catalog-node@1.8.0-next.1
  - @backstage/plugin-events-node@0.3.0-next.1

## @backstage/plugin-catalog-backend-module-ldap@0.5.29-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.22-next.1
  - @backstage/plugin-catalog-node@1.8.0-next.1

## @backstage/plugin-catalog-backend-module-msgraph@0.5.21-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/plugin-catalog-common@1.0.22-next.1
  - @backstage/plugin-catalog-node@1.8.0-next.1

## @backstage/plugin-catalog-backend-module-openapi@0.1.31-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/plugin-catalog-backend@1.18.0-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.22-next.1
  - @backstage/plugin-catalog-node@1.8.0-next.1

## @backstage/plugin-catalog-backend-module-puppetdb@0.1.19-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-node@1.8.0-next.1

## @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/plugin-catalog-common@1.0.22-next.1
  - @backstage/plugin-catalog-node@1.8.0-next.1
  - @backstage/plugin-scaffolder-common@1.5.1-next.1

## @backstage/plugin-catalog-backend-module-unprocessed@0.3.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/catalog-model@1.4.5-next.0

## @backstage/plugin-catalog-common@1.0.22-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/plugin-search-common@1.2.11-next.1

## @backstage/plugin-catalog-graph@0.4.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/frontend-plugin-api@0.6.1-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/core-compat-api@0.2.1-next.1
  - @backstage/types@1.1.1

## @backstage/plugin-catalog-import@0.10.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/integration-react@1.1.25-next.1
  - @backstage/frontend-plugin-api@0.6.1-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/core-compat-api@0.2.1-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-catalog-common@1.0.22-next.1

## @backstage/plugin-catalog-node@1.8.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/plugin-permission-node@0.7.25-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.22-next.1

## @backstage/plugin-catalog-react@1.10.1-next.1

### Patch Changes

- b2a9926: Adds an argument for which filters should be applied when fetching/counting available values
- a6e237f: Added `DefaultFilters` component
- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/integration-react@1.1.25-next.1
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/plugin-permission-react@0.4.21-next.1
  - @backstage/frontend-plugin-api@0.6.1-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7
  - @backstage/plugin-catalog-common@1.0.22-next.1

## @backstage/plugin-catalog-unprocessed-entities@0.1.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0

## @backstage/plugin-cicd-statistics@0.1.33-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0

## @backstage/plugin-cicd-statistics-module-gitlab@0.1.27-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/plugin-cicd-statistics@0.1.33-next.1

## @backstage/plugin-circleci@0.3.31-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0

## @backstage/plugin-cloudbuild@0.4.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0

## @backstage/plugin-code-climate@0.1.31-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0

## @backstage/plugin-code-coverage@0.2.24-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0

## @backstage/plugin-code-coverage-backend@0.2.28-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0

## @backstage/plugin-codescene@0.1.23-next.1

### Patch Changes

- e477ec4: Extending code scene plugin in Entity page.
- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/theme@0.5.2-next.0

## @backstage/plugin-config-schema@0.1.51-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1

## @backstage/plugin-cost-insights@0.12.20-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/theme@0.5.2-next.0
  - @backstage/plugin-cost-insights-common@0.1.2

## @backstage/plugin-devtools@0.1.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/plugin-permission-react@0.4.21-next.1
  - @backstage/frontend-plugin-api@0.6.1-next.1
  - @backstage/core-compat-api@0.2.1-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-devtools-common@0.1.9-next.1

## @backstage/plugin-devtools-backend@0.3.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/config-loader@1.7.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/plugin-permission-node@0.7.25-next.1
  - @backstage/cli-common@0.1.13
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-devtools-common@0.1.9-next.1

## @backstage/plugin-devtools-common@0.1.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/types@1.1.1

## @backstage/plugin-dynatrace@9.0.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0

## @backstage/plugin-entity-feedback@0.2.14-next.1

### Patch Changes

- 96adf78: Remove empty Chip in `FeedbackResponseTable.tsx` when there is no response, and fix typo in Feedback Dialog Box.
- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-entity-feedback-common@0.1.3

## @backstage/plugin-entity-feedback-backend@0.2.11-next.1

### Patch Changes

- 45115fd: Add in description for 400 response when encountering an invalid rating request
- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-entity-feedback-common@0.1.3

## @backstage/plugin-entity-validation@0.1.16-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-catalog-common@1.0.22-next.1

## @backstage/plugin-events-backend@0.3.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-events-node@0.3.0-next.1

## @backstage/plugin-events-backend-module-aws-sqs@0.3.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.3.0-next.1

## @backstage/plugin-events-backend-module-azure@0.2.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-events-node@0.3.0-next.1

## @backstage/plugin-events-backend-module-bitbucket-cloud@0.2.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-events-node@0.3.0-next.1

## @backstage/plugin-events-backend-module-gerrit@0.2.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-events-node@0.3.0-next.1

## @backstage/plugin-events-backend-module-github@0.2.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-events-node@0.3.0-next.1

## @backstage/plugin-events-backend-module-gitlab@0.2.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-events-node@0.3.0-next.1

## @backstage/plugin-events-backend-test-utils@0.1.24-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.3.0-next.1

## @backstage/plugin-events-node@0.3.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.14-next.1

## @backstage/plugin-explore@0.4.17-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/frontend-plugin-api@0.6.1-next.1
  - @backstage/plugin-search-react@1.7.7-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-explore-common@0.0.2
  - @backstage/plugin-explore-react@0.0.37-next.1
  - @backstage/plugin-search-common@1.2.11-next.1

## @backstage/plugin-explore-backend@0.0.24-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-search-backend-module-explore@0.1.18-next.1
  - @backstage/types@1.1.1
  - @backstage/plugin-explore-common@0.0.2

## @backstage/plugin-explore-react@0.0.37-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/plugin-explore-common@0.0.2

## @backstage/plugin-firehydrant@0.2.15-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0

## @backstage/plugin-fossa@0.2.63-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0

## @backstage/plugin-gcalendar@0.3.24-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/errors@1.2.4-next.0

## @backstage/plugin-gcp-projects@0.3.47-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1

## @backstage/plugin-git-release-manager@0.3.43-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/integration@1.9.1-next.1

## @backstage/plugin-github-actions@0.6.12-next.1

### Patch Changes

- 8ab3218: Fixed bug in WorkflowRunStatus component where skipped and cancelled workflow runs appeared as success
- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/integration-react@1.1.25-next.1
  - @backstage/catalog-model@1.4.5-next.0

## @backstage/plugin-github-deployments@0.1.62-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/integration-react@1.1.25-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0

## @backstage/plugin-github-issues@0.2.20-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0

## @backstage/plugin-github-pull-requests-board@0.1.25-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0

## @backstage/plugin-gitops-profiles@0.3.46-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1

## @backstage/plugin-gocd@0.1.37-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0

## @backstage/plugin-graphiql@0.3.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/frontend-plugin-api@0.6.1-next.1
  - @backstage/core-compat-api@0.2.1-next.1

## @backstage/plugin-graphql-voyager@0.1.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1

## @backstage/plugin-home@0.6.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-app-api@1.12.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/frontend-plugin-api@0.6.1-next.1
  - @backstage/plugin-home-react@0.1.9-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/core-compat-api@0.2.1-next.1
  - @backstage/theme@0.5.2-next.0

## @backstage/plugin-home-react@0.1.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1

## @backstage/plugin-ilert@0.2.20-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0

## @backstage/plugin-jenkins@0.9.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-jenkins-common@0.1.25-next.1

## @backstage/plugin-jenkins-backend@0.4.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/plugin-permission-node@0.7.25-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-catalog-node@1.8.0-next.1
  - @backstage/plugin-jenkins-common@0.1.25-next.1

## @backstage/plugin-jenkins-common@0.1.25-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/plugin-catalog-common@1.0.22-next.1

## @backstage/plugin-kafka@0.3.31-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0

## @backstage/plugin-kafka-backend@0.3.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/errors@1.2.4-next.0

## @backstage/plugin-kubernetes@0.11.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/plugin-kubernetes-react@0.3.1-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/plugin-kubernetes-common@0.7.5-next.1

## @backstage/plugin-kubernetes-backend@0.16.0-next.1

### Patch Changes

- 69d0217: Pass user credentials when calling catalog get entities api.
- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/plugin-kubernetes-node@0.1.8-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/integration-aws-node@0.1.10-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/plugin-permission-node@0.7.25-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-node@1.8.0-next.1
  - @backstage/plugin-kubernetes-common@0.7.5-next.1

## @backstage/plugin-kubernetes-cluster@0.0.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/plugin-kubernetes-react@0.3.1-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/plugin-kubernetes-common@0.7.5-next.1

## @backstage/plugin-kubernetes-common@0.7.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/types@1.1.1

## @backstage/plugin-kubernetes-node@0.1.8-next.1

### Patch Changes

- 69d0217: Accept auth credentials to get kubernetes clusters
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.5-next.1

## @backstage/plugin-kubernetes-react@0.3.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.7.5-next.1

## @backstage/plugin-lighthouse@0.4.16-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/plugin-lighthouse-common@0.1.5-next.1
  - @backstage/catalog-model@1.4.5-next.0

## @backstage/plugin-lighthouse-backend@0.4.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/plugin-lighthouse-common@0.1.5-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-node@1.8.0-next.1

## @backstage/plugin-lighthouse-common@0.1.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1

## @backstage/plugin-linguist@0.1.16-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/frontend-plugin-api@0.6.1-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/core-compat-api@0.2.1-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-linguist-common@0.1.2

## @backstage/plugin-linguist-backend@0.5.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-node@1.8.0-next.1
  - @backstage/plugin-linguist-common@0.1.2

## @backstage/plugin-microsoft-calendar@0.1.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/errors@1.2.4-next.0

## @backstage/plugin-newrelic@0.3.46-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1

## @backstage/plugin-newrelic-dashboard@0.3.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0

## @backstage/plugin-nomad@0.1.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0

## @backstage/plugin-nomad-backend@0.1.16-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/errors@1.2.4-next.0

## @backstage/plugin-notifications-common@0.0.2-next.1

### Patch Changes

- a790a3d: Move notification origin resolving to backend with new auth

## @backstage/plugin-notifications-node@0.1.0-next.1

### Patch Changes

- a790a3d: Move notification origin resolving to backend with new auth
- Updated dependencies
  - @backstage/plugin-notifications-common@0.0.2-next.1
  - @backstage/plugin-signals-node@0.1.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0

## @backstage/plugin-octopus-deploy@0.2.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0

## @backstage/plugin-opencost@0.2.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1

## @backstage/plugin-org@0.6.21-next.1

### Patch Changes

- a767aaa: Fixed an issue where the `OwnershipCard` component failed to scroll properly when used alongside `react-grid-layout`.
- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/frontend-plugin-api@0.6.1-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/core-compat-api@0.2.1-next.1
  - @backstage/plugin-catalog-common@1.0.22-next.1

## @backstage/plugin-org-react@0.1.20-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0

## @backstage/plugin-pagerduty@0.7.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/plugin-home-react@0.1.9-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0

## @backstage/plugin-periskop@0.1.29-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0

## @backstage/plugin-periskop-backend@0.2.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1

## @backstage/plugin-permission-backend@0.5.37-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/plugin-permission-node@0.7.25-next.1
  - @backstage/errors@1.2.4-next.0

## @backstage/plugin-permission-backend-module-allow-all-policy@0.1.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/plugin-permission-node@0.7.25-next.1

## @backstage/plugin-permission-common@0.7.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1

## @backstage/plugin-permission-node@0.7.25-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/errors@1.2.4-next.0

## @backstage/plugin-permission-react@0.4.21-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/plugin-permission-common@0.7.13-next.1

## @backstage/plugin-playlist@0.2.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/plugin-permission-react@0.4.21-next.1
  - @backstage/plugin-search-react@1.7.7-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-catalog-common@1.0.22-next.1
  - @backstage/plugin-playlist-common@0.1.15-next.1

## @backstage/plugin-playlist-backend@0.3.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/plugin-permission-node@0.7.25-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-playlist-common@0.1.15-next.1

## @backstage/plugin-playlist-common@0.1.15-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.7.13-next.1

## @backstage/plugin-proxy-backend@0.4.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1

## @backstage/plugin-puppetdb@0.1.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0

## @backstage/plugin-rollbar@0.4.31-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0

## @backstage/plugin-rollbar-backend@0.1.59-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1

## @backstage/plugin-scaffolder@1.18.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/integration-react@1.1.25-next.1
  - @backstage/plugin-permission-react@0.4.21-next.1
  - @backstage/frontend-plugin-api@0.6.1-next.1
  - @backstage/plugin-scaffolder-react@1.8.1-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/core-compat-api@0.2.1-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.22-next.1
  - @backstage/plugin-scaffolder-common@1.5.1-next.1

## @backstage/plugin-scaffolder-backend-module-azure@0.1.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/plugin-scaffolder-node@0.4.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/errors@1.2.4-next.0

## @backstage/plugin-scaffolder-backend-module-bitbucket@0.2.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/plugin-scaffolder-node@0.4.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.1.4-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.1.4-next.1
  - @backstage/errors@1.2.4-next.0

## @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.1.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/plugin-scaffolder-node@0.4.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/errors@1.2.4-next.0

## @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.1.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/plugin-scaffolder-node@0.4.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/errors@1.2.4-next.0

## @backstage/plugin-scaffolder-backend-module-confluence-to-markdown@0.2.15-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/plugin-scaffolder-node@0.4.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/errors@1.2.4-next.0

## @backstage/plugin-scaffolder-backend-module-cookiecutter@0.2.38-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/plugin-scaffolder-node@0.4.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1

## @backstage/plugin-scaffolder-backend-module-gerrit@0.1.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/plugin-scaffolder-node@0.4.0-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/errors@1.2.4-next.0

## @backstage/plugin-scaffolder-backend-module-gitea@0.1.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/plugin-scaffolder-node@0.4.0-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/errors@1.2.4-next.0

## @backstage/plugin-scaffolder-backend-module-github@0.2.4-next.1

### Patch Changes

- 35fe005: Export `getOctokitOptions` for easy re-use of Octokit configuration handling
- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/plugin-scaffolder-node@0.4.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/errors@1.2.4-next.0

## @backstage/plugin-scaffolder-backend-module-gitlab@0.2.17-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/plugin-scaffolder-node@0.4.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/errors@1.2.4-next.0

## @backstage/plugin-scaffolder-backend-module-rails@0.4.31-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/plugin-scaffolder-node@0.4.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1

## @backstage/plugin-scaffolder-backend-module-sentry@0.1.22-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/plugin-scaffolder-node@0.4.0-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/errors@1.2.4-next.0

## @backstage/plugin-scaffolder-backend-module-yeoman@0.2.35-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.4.0-next.1
  - @backstage/plugin-scaffolder-node-test-utils@0.1.0-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/types@1.1.1

## @backstage/plugin-scaffolder-common@1.5.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/types@1.1.1

## @backstage/plugin-scaffolder-node-test-utils@0.1.0-next.1

### Patch Changes

- aa543c9: Add an initiator credentials getter to the default mock context.
- bbd1fe1: Made "checkpoint" on scaffolder action context non-optional
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.4.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-test-utils@0.3.4-next.1
  - @backstage/types@1.1.1
  - @backstage/plugin-scaffolder-common@1.5.1-next.1

## @backstage/plugin-scaffolder-react@1.8.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/theme@0.5.2-next.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7
  - @backstage/plugin-scaffolder-common@1.5.1-next.1

## @backstage/plugin-search@1.4.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/frontend-plugin-api@0.6.1-next.1
  - @backstage/plugin-search-react@1.7.7-next.1
  - @backstage/core-compat-api@0.2.1-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7
  - @backstage/plugin-search-common@1.2.11-next.1

## @backstage/plugin-search-backend@1.5.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/plugin-permission-node@0.7.25-next.1
  - @backstage/plugin-search-backend-node@1.2.18-next.1
  - @backstage/backend-openapi-utils@0.1.7-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-search-common@1.2.11-next.1

## @backstage/plugin-search-backend-module-catalog@0.1.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/plugin-search-backend-node@1.2.18-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-catalog-common@1.0.22-next.1
  - @backstage/plugin-catalog-node@1.8.0-next.1
  - @backstage/plugin-search-common@1.2.11-next.1

## @backstage/plugin-search-backend-module-elasticsearch@1.3.17-next.1

### Patch Changes

- e1f73d0: Added config.d.ts entry with secrets for the shared auth block
- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/integration-aws-node@0.1.10-next.1
  - @backstage/plugin-search-backend-node@1.2.18-next.1
  - @backstage/plugin-search-common@1.2.11-next.1

## @backstage/plugin-search-backend-module-explore@0.1.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/plugin-search-backend-node@1.2.18-next.1
  - @backstage/plugin-explore-common@0.0.2
  - @backstage/plugin-search-common@1.2.11-next.1

## @backstage/plugin-search-backend-module-pg@0.5.23-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-search-backend-node@1.2.18-next.1
  - @backstage/plugin-search-common@1.2.11-next.1

## @backstage/plugin-search-backend-module-stack-overflow-collator@0.1.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/plugin-search-backend-node@1.2.18-next.1
  - @backstage/plugin-search-common@1.2.11-next.1

## @backstage/plugin-search-backend-module-techdocs@0.1.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/plugin-search-backend-node@1.2.18-next.1
  - @backstage/plugin-techdocs-node@1.11.6-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/plugin-catalog-common@1.0.22-next.1
  - @backstage/plugin-catalog-node@1.8.0-next.1
  - @backstage/plugin-search-common@1.2.11-next.1

## @backstage/plugin-search-backend-node@1.2.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-search-common@1.2.11-next.1

## @backstage/plugin-search-common@1.2.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/types@1.1.1

## @backstage/plugin-search-react@1.7.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/frontend-plugin-api@0.6.1-next.1
  - @backstage/theme@0.5.2-next.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7
  - @backstage/plugin-search-common@1.2.11-next.1

## @backstage/plugin-sentry@0.5.16-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0

## @backstage/plugin-shortcuts@0.3.20-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/theme@0.5.2-next.0
  - @backstage/types@1.1.1

## @backstage/plugin-signals@0.0.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/theme@0.5.2-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-signals-react@0.0.2-next.1

## @backstage/plugin-signals-react@0.0.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/types@1.1.1

## @backstage/plugin-sonarqube@0.7.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/plugin-sonarqube-react@0.1.14-next.1

## @backstage/plugin-sonarqube-backend@0.2.16-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/errors@1.2.4-next.0

## @backstage/plugin-sonarqube-react@0.1.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0

## @backstage/plugin-splunk-on-call@0.4.20-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0

## @backstage/plugin-stack-overflow@0.1.26-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/core-components@0.14.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/frontend-plugin-api@0.6.1-next.1
  - @backstage/plugin-home-react@0.1.9-next.1
  - @backstage/plugin-search-react@1.7.7-next.1
  - @backstage/plugin-search-common@1.2.11-next.1

## @backstage/plugin-stack-overflow-backend@0.2.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-search-backend-module-stack-overflow-collator@0.1.7-next.1

## @backstage/plugin-stackstorm@0.1.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/errors@1.2.4-next.0

## @backstage/plugin-tech-insights@0.3.23-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-tech-insights-common@0.2.12

## @backstage/plugin-tech-insights-backend@0.5.28-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/plugin-tech-insights-node@0.5.0-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-tech-insights-common@0.2.12

## @backstage/plugin-tech-insights-backend-module-jsonfc@0.1.46-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-tech-insights-node@0.5.0-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-tech-insights-common@0.2.12

## @backstage/plugin-tech-insights-node@0.5.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/types@1.1.1
  - @backstage/plugin-tech-insights-common@0.2.12

## @backstage/plugin-tech-radar@0.6.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/frontend-plugin-api@0.6.1-next.1
  - @backstage/core-compat-api@0.2.1-next.1

## @backstage/plugin-techdocs@1.10.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/integration-react@1.1.25-next.1
  - @backstage/plugin-techdocs-react@1.1.17-next.1
  - @backstage/frontend-plugin-api@0.6.1-next.1
  - @backstage/plugin-search-react@1.7.7-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/core-compat-api@0.2.1-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/theme@0.5.2-next.0
  - @backstage/plugin-search-common@1.2.11-next.1

## @backstage/plugin-techdocs-addons-test-utils@1.0.28-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/plugin-catalog@1.17.1-next.1
  - @backstage/core-app-api@1.12.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/integration-react@1.1.25-next.1
  - @backstage/test-utils@1.5.1-next.1
  - @backstage/plugin-techdocs@1.10.1-next.1
  - @backstage/plugin-techdocs-react@1.1.17-next.1
  - @backstage/plugin-search-react@1.7.7-next.1

## @backstage/plugin-techdocs-backend@1.9.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/plugin-search-backend-module-techdocs@0.1.18-next.1
  - @backstage/plugin-techdocs-node@1.11.6-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-catalog-common@1.0.22-next.1

## @backstage/plugin-techdocs-module-addons-contrib@1.1.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/integration-react@1.1.25-next.1
  - @backstage/plugin-techdocs-react@1.1.17-next.1

## @backstage/plugin-techdocs-node@1.11.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/integration-aws-node@0.1.10-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-search-common@1.2.11-next.1

## @backstage/plugin-techdocs-react@1.1.17-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/core-components@0.14.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/version-bridge@1.0.7

## @backstage/plugin-todo@0.2.35-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0

## @backstage/plugin-todo-backend@0.3.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/repo-tools@0.7.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/backend-openapi-utils@0.1.7-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-catalog-node@1.8.0-next.1

## @backstage/plugin-user-settings@0.8.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-app-api@1.12.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/frontend-plugin-api@0.6.1-next.1
  - @backstage/core-compat-api@0.2.1-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/theme@0.5.2-next.0
  - @backstage/types@1.1.1

## @backstage/plugin-user-settings-backend@0.2.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1

## @backstage/plugin-vault@0.1.26-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0

## @backstage/plugin-vault-backend@0.4.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-vault-node@0.1.7-next.1

## @backstage/plugin-vault-node@0.1.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.14-next.1

## @backstage/plugin-xcmetrics@0.2.49-next.1

### Patch Changes

- 7984d1e: Fixed bug in XcMetricsClient where it was not including parameter for excludeCI, which is now a required parameter for XCMetrics.
- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/errors@1.2.4-next.0

## example-app@0.2.93-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-github-actions@0.6.12-next.1
  - @backstage/cli@0.25.3-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/plugin-entity-feedback@0.2.14-next.1
  - @backstage/plugin-api-docs@0.11.1-next.1
  - @backstage/plugin-notifications@0.1.0-next.1
  - @backstage/plugin-catalog@1.17.1-next.1
  - @backstage/plugin-azure-devops@0.4.0-next.1
  - @backstage/plugin-org@0.6.21-next.1
  - @backstage/core-app-api@1.12.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/frontend-app-api@0.6.1-next.1
  - @backstage/integration-react@1.1.25-next.1
  - @backstage/plugin-catalog-import@0.10.7-next.1
  - @backstage/plugin-cost-insights@0.12.20-next.1
  - @backstage/plugin-home@0.6.3-next.1
  - @backstage/plugin-permission-react@0.4.21-next.1
  - @backstage/plugin-stack-overflow@0.1.26-next.1
  - @backstage/plugin-techdocs@1.10.1-next.1
  - @backstage/plugin-techdocs-react@1.1.17-next.1
  - @backstage/app-defaults@1.5.1-next.1
  - @backstage/plugin-adr@0.6.14-next.1
  - @backstage/plugin-airbrake@0.3.31-next.1
  - @backstage/plugin-apache-airflow@0.2.21-next.1
  - @backstage/plugin-azure-sites@0.1.20-next.1
  - @backstage/plugin-badges@0.2.55-next.1
  - @backstage/plugin-catalog-graph@0.4.1-next.1
  - @backstage/plugin-catalog-unprocessed-entities@0.1.9-next.1
  - @backstage/plugin-cloudbuild@0.4.1-next.1
  - @backstage/plugin-code-coverage@0.2.24-next.1
  - @backstage/plugin-devtools@0.1.10-next.1
  - @backstage/plugin-dynatrace@9.0.1-next.1
  - @backstage/plugin-explore@0.4.17-next.1
  - @backstage/plugin-gcalendar@0.3.24-next.1
  - @backstage/plugin-gcp-projects@0.3.47-next.1
  - @backstage/plugin-github-pull-requests-board@0.1.25-next.1
  - @backstage/plugin-gocd@0.1.37-next.1
  - @backstage/plugin-graphiql@0.3.4-next.1
  - @backstage/plugin-jenkins@0.9.6-next.1
  - @backstage/plugin-kafka@0.3.31-next.1
  - @backstage/plugin-kubernetes@0.11.6-next.1
  - @backstage/plugin-kubernetes-cluster@0.0.7-next.1
  - @backstage/plugin-lighthouse@0.4.16-next.1
  - @backstage/plugin-linguist@0.1.16-next.1
  - @backstage/plugin-microsoft-calendar@0.1.13-next.1
  - @backstage/plugin-newrelic@0.3.46-next.1
  - @backstage/plugin-newrelic-dashboard@0.3.6-next.1
  - @backstage/plugin-nomad@0.1.12-next.1
  - @backstage/plugin-octopus-deploy@0.2.13-next.1
  - @backstage/plugin-pagerduty@0.7.3-next.1
  - @backstage/plugin-playlist@0.2.5-next.1
  - @backstage/plugin-puppetdb@0.1.14-next.1
  - @backstage/plugin-rollbar@0.4.31-next.1
  - @backstage/plugin-scaffolder@1.18.1-next.1
  - @backstage/plugin-scaffolder-react@1.8.1-next.1
  - @backstage/plugin-search@1.4.7-next.1
  - @backstage/plugin-search-react@1.7.7-next.1
  - @backstage/plugin-sentry@0.5.16-next.1
  - @backstage/plugin-shortcuts@0.3.20-next.1
  - @backstage/plugin-signals@0.0.2-next.1
  - @backstage/plugin-stackstorm@0.1.12-next.1
  - @backstage/plugin-tech-insights@0.3.23-next.1
  - @backstage/plugin-tech-radar@0.6.14-next.1
  - @backstage/plugin-techdocs-module-addons-contrib@1.1.6-next.1
  - @backstage/plugin-todo@0.2.35-next.1
  - @backstage/plugin-user-settings@0.8.2-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/theme@0.5.2-next.0
  - @backstage/plugin-catalog-common@1.0.22-next.1
  - @backstage/plugin-linguist-common@0.1.2
  - @backstage/plugin-search-common@1.2.11-next.1

## example-app-next@0.0.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/plugin-github-actions@0.6.12-next.1
  - @backstage/cli@0.25.3-next.1
  - @backstage/plugin-catalog-react@1.10.1-next.1
  - @backstage/plugin-entity-feedback@0.2.14-next.1
  - @backstage/plugin-api-docs@0.11.1-next.1
  - @backstage/plugin-catalog@1.17.1-next.1
  - @backstage/plugin-azure-devops@0.4.0-next.1
  - @backstage/plugin-org@0.6.21-next.1
  - @backstage/core-app-api@1.12.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/frontend-app-api@0.6.1-next.1
  - @backstage/integration-react@1.1.25-next.1
  - @backstage/plugin-catalog-import@0.10.7-next.1
  - @backstage/plugin-cost-insights@0.12.20-next.1
  - @backstage/plugin-home@0.6.3-next.1
  - @backstage/plugin-permission-react@0.4.21-next.1
  - @backstage/plugin-techdocs@1.10.1-next.1
  - @backstage/plugin-techdocs-react@1.1.17-next.1
  - @backstage/app-defaults@1.5.1-next.1
  - app-next-example-plugin@0.0.7-next.1
  - @backstage/frontend-plugin-api@0.6.1-next.1
  - @backstage/plugin-adr@0.6.14-next.1
  - @backstage/plugin-airbrake@0.3.31-next.1
  - @backstage/plugin-apache-airflow@0.2.21-next.1
  - @backstage/plugin-app-visualizer@0.1.2-next.1
  - @backstage/plugin-azure-sites@0.1.20-next.1
  - @backstage/plugin-badges@0.2.55-next.1
  - @backstage/plugin-catalog-graph@0.4.1-next.1
  - @backstage/plugin-catalog-unprocessed-entities@0.1.9-next.1
  - @backstage/plugin-cloudbuild@0.4.1-next.1
  - @backstage/plugin-code-coverage@0.2.24-next.1
  - @backstage/plugin-devtools@0.1.10-next.1
  - @backstage/plugin-dynatrace@9.0.1-next.1
  - @backstage/plugin-explore@0.4.17-next.1
  - @backstage/plugin-gcalendar@0.3.24-next.1
  - @backstage/plugin-gcp-projects@0.3.47-next.1
  - @backstage/plugin-gocd@0.1.37-next.1
  - @backstage/plugin-graphiql@0.3.4-next.1
  - @backstage/plugin-jenkins@0.9.6-next.1
  - @backstage/plugin-kafka@0.3.31-next.1
  - @backstage/plugin-kubernetes@0.11.6-next.1
  - @backstage/plugin-lighthouse@0.4.16-next.1
  - @backstage/plugin-linguist@0.1.16-next.1
  - @backstage/plugin-microsoft-calendar@0.1.13-next.1
  - @backstage/plugin-newrelic@0.3.46-next.1
  - @backstage/plugin-newrelic-dashboard@0.3.6-next.1
  - @backstage/plugin-octopus-deploy@0.2.13-next.1
  - @backstage/plugin-pagerduty@0.7.3-next.1
  - @backstage/plugin-playlist@0.2.5-next.1
  - @backstage/plugin-puppetdb@0.1.14-next.1
  - @backstage/plugin-rollbar@0.4.31-next.1
  - @backstage/plugin-scaffolder@1.18.1-next.1
  - @backstage/plugin-scaffolder-react@1.8.1-next.1
  - @backstage/plugin-search@1.4.7-next.1
  - @backstage/plugin-search-react@1.7.7-next.1
  - @backstage/plugin-sentry@0.5.16-next.1
  - @backstage/plugin-shortcuts@0.3.20-next.1
  - @backstage/plugin-stackstorm@0.1.12-next.1
  - @backstage/plugin-tech-insights@0.3.23-next.1
  - @backstage/plugin-tech-radar@0.6.14-next.1
  - @backstage/plugin-techdocs-module-addons-contrib@1.1.6-next.1
  - @backstage/plugin-todo@0.2.35-next.1
  - @backstage/plugin-user-settings@0.8.2-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/core-compat-api@0.2.1-next.1
  - @backstage/theme@0.5.2-next.0
  - @backstage/plugin-catalog-common@1.0.22-next.1
  - @backstage/plugin-linguist-common@0.1.2
  - @backstage/plugin-search-common@1.2.11-next.1

## app-next-example-plugin@0.0.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/frontend-plugin-api@0.6.1-next.1

## example-backend@0.2.93-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/plugin-entity-feedback-backend@0.2.11-next.1
  - @backstage/plugin-scaffolder-backend@1.22.0-next.1
  - @backstage/plugin-search-backend-module-elasticsearch@1.3.17-next.1
  - @backstage/plugin-app-backend@0.3.62-next.1
  - @backstage/plugin-signals-backend@0.1.0-next.1
  - @backstage/plugin-signals-node@0.1.0-next.1
  - @backstage/plugin-azure-devops-backend@0.6.0-next.1
  - @backstage/plugin-kubernetes-backend@0.16.0-next.1
  - example-app@0.2.93-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/plugin-adr-backend@0.4.11-next.1
  - @backstage/plugin-auth-backend@0.22.0-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/plugin-badges-backend@0.3.11-next.1
  - @backstage/plugin-catalog-backend@1.18.0-next.1
  - @backstage/plugin-code-coverage-backend@0.2.28-next.1
  - @backstage/plugin-devtools-backend@0.3.0-next.1
  - @backstage/plugin-events-backend@0.3.0-next.1
  - @backstage/plugin-explore-backend@0.0.24-next.1
  - @backstage/plugin-jenkins-backend@0.4.0-next.1
  - @backstage/plugin-kafka-backend@0.3.12-next.1
  - @backstage/plugin-lighthouse-backend@0.4.6-next.1
  - @backstage/plugin-linguist-backend@0.5.11-next.1
  - @backstage/plugin-nomad-backend@0.1.16-next.1
  - @backstage/plugin-permission-backend@0.5.37-next.1
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/plugin-permission-node@0.7.25-next.1
  - @backstage/plugin-playlist-backend@0.3.18-next.1
  - @backstage/plugin-proxy-backend@0.4.12-next.1
  - @backstage/plugin-rollbar-backend@0.1.59-next.1
  - @backstage/plugin-scaffolder-backend-module-confluence-to-markdown@0.2.15-next.1
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.2.17-next.1
  - @backstage/plugin-scaffolder-backend-module-rails@0.4.31-next.1
  - @backstage/plugin-search-backend@1.5.4-next.1
  - @backstage/plugin-search-backend-module-catalog@0.1.18-next.1
  - @backstage/plugin-search-backend-module-explore@0.1.18-next.1
  - @backstage/plugin-search-backend-module-pg@0.5.23-next.1
  - @backstage/plugin-search-backend-module-techdocs@0.1.18-next.1
  - @backstage/plugin-search-backend-node@1.2.18-next.1
  - @backstage/plugin-tech-insights-backend@0.5.28-next.1
  - @backstage/plugin-tech-insights-backend-module-jsonfc@0.1.46-next.1
  - @backstage/plugin-tech-insights-node@0.5.0-next.1
  - @backstage/plugin-techdocs-backend@1.9.7-next.1
  - @backstage/plugin-todo-backend@0.3.12-next.1
  - @backstage/catalog-client@1.6.1-next.0
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/plugin-azure-sites-common@0.1.3-next.1
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.11-next.1
  - @backstage/plugin-catalog-backend-module-unprocessed@0.3.11-next.1
  - @backstage/plugin-catalog-node@1.8.0-next.1
  - @backstage/plugin-events-node@0.3.0-next.1

## example-backend-next@0.0.21-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-entity-feedback-backend@0.2.11-next.1
  - @backstage/plugin-notifications-backend@0.1.0-next.1
  - @backstage/plugin-scaffolder-backend@1.22.0-next.1
  - @backstage/plugin-auth-backend-module-guest-provider@0.1.0-next.1
  - @backstage/plugin-scaffolder-backend-module-github@0.2.4-next.1
  - @backstage/plugin-app-backend@0.3.62-next.1
  - @backstage/plugin-signals-backend@0.1.0-next.1
  - @backstage/plugin-azure-devops-backend@0.6.0-next.1
  - @backstage/plugin-kubernetes-backend@0.16.0-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/backend-tasks@0.5.19-next.1
  - @backstage/plugin-adr-backend@0.4.11-next.1
  - @backstage/plugin-auth-backend@0.22.0-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/plugin-badges-backend@0.3.11-next.1
  - @backstage/plugin-catalog-backend@1.18.0-next.1
  - @backstage/plugin-catalog-backend-module-backstage-openapi@0.1.7-next.1
  - @backstage/plugin-catalog-backend-module-openapi@0.1.31-next.1
  - @backstage/plugin-devtools-backend@0.3.0-next.1
  - @backstage/plugin-jenkins-backend@0.4.0-next.1
  - @backstage/plugin-lighthouse-backend@0.4.6-next.1
  - @backstage/plugin-linguist-backend@0.5.11-next.1
  - @backstage/plugin-nomad-backend@0.1.16-next.1
  - @backstage/plugin-permission-backend@0.5.37-next.1
  - @backstage/plugin-permission-common@0.7.13-next.1
  - @backstage/plugin-permission-node@0.7.25-next.1
  - @backstage/plugin-playlist-backend@0.3.18-next.1
  - @backstage/plugin-proxy-backend@0.4.12-next.1
  - @backstage/plugin-search-backend@1.5.4-next.1
  - @backstage/plugin-search-backend-module-catalog@0.1.18-next.1
  - @backstage/plugin-search-backend-module-explore@0.1.18-next.1
  - @backstage/plugin-search-backend-module-techdocs@0.1.18-next.1
  - @backstage/plugin-search-backend-node@1.2.18-next.1
  - @backstage/plugin-sonarqube-backend@0.2.16-next.1
  - @backstage/plugin-techdocs-backend@1.9.7-next.1
  - @backstage/plugin-todo-backend@0.3.12-next.1
  - @backstage/backend-defaults@0.2.14-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/plugin-auth-backend-module-github-provider@0.1.11-next.1
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.11-next.1
  - @backstage/plugin-catalog-backend-module-unprocessed@0.3.11-next.1
  - @backstage/plugin-permission-backend-module-allow-all-policy@0.1.11-next.1

## e2e-test@0.2.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/create-app@0.5.12-next.1
  - @backstage/cli-common@0.1.13
  - @backstage/errors@1.2.4-next.0

## techdocs-cli-embedded-app@0.2.92-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/core-components@0.14.1-next.1
  - @backstage/cli@0.25.3-next.1
  - @backstage/plugin-catalog@1.17.1-next.1
  - @backstage/core-app-api@1.12.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/integration-react@1.1.25-next.1
  - @backstage/test-utils@1.5.1-next.1
  - @backstage/plugin-techdocs@1.10.1-next.1
  - @backstage/plugin-techdocs-react@1.1.17-next.1
  - @backstage/app-defaults@1.5.1-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/theme@0.5.2-next.0

## @internal/plugin-todo-list@1.0.23-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1

## @internal/plugin-todo-list-backend@1.0.23-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/errors@1.2.4-next.0

## @internal/plugin-todo-list-common@1.0.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-common@0.7.13-next.1
