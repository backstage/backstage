# Release v1.21.0-next.2

## @backstage/catalog-client@1.5.0-next.0

### Minor Changes

- 38340678c3: The internals of `CatalogClient` are now auto-generated using the `backstage-repo-tools schema openapi generate-client` command.

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3

## @backstage/cli@0.25.0-next.1

### Minor Changes

- 38340678c3: Updates the ESLint config to ignore issues created by generated files in `**/src/generated/**`.

### Patch Changes

- 0ffee55010: Toned down the warning message when git is not found
- c6f3743172: Added a warning when starting a standalone backend plugin that hasn't been updated to the new backend system.
- 3e358b0dff: Added deprecation warning for React Router v6 beta, please make sure you have migrated your apps to use React Router v6 stable as support for the beta version will be removed. See the [migration tutorial](https://backstage.io/docs/tutorials/react-router-stable-migration) for more information.
- 8056425e09: Updated dependency `@typescript-eslint/eslint-plugin` to `6.12.0`.
- 33e96e59e7: Switched the `@typescript-eslint/eslint-plugin` dependency back to using a `^` version range.
- Updated dependencies
  - @backstage/eslint-plugin@0.1.4-next.0
  - @backstage/integration@1.8.0-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/cli-common@0.1.13
  - @backstage/cli-node@0.2.0
  - @backstage/config@1.1.1
  - @backstage/config-loader@1.5.3
  - @backstage/errors@1.2.3
  - @backstage/release-manifests@0.0.11
  - @backstage/types@1.1.1

## @backstage/frontend-app-api@0.4.0-next.1

### Minor Changes

- e539735435: Updated core extension structure to make space for the sign-in page by adding `core.router`.

### Patch Changes

- 5eb6b8a7bc: Added the nav logo extension for customization of sidebar logo
- 1f12fb762c: Create a core components extension that allows adopters to override core app components such as `Progress`, `BootErrorPage`, `NotFoundErrorPage` and `ErrorBoundaryFallback`.
- 59709286b3: Collect and register feature flags from plugins and extension overrides.
- f27ee7d937: Migrate analytics route tracker component.
- a5a04739e1: Updates to provide `node` to extension factories instead of `id` and `source`.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.4.0-next.1
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/core-app-api@1.11.2-next.1
  - @backstage/config@1.1.1
  - @backstage/theme@0.5.0-next.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## @backstage/frontend-plugin-api@0.4.0-next.1

### Minor Changes

- a5a04739e1: The extension `factory` function now longer receives `id` or `source`, but instead now provides the extension's `AppNode` as `node`. The `ExtensionBoundary` component has also been updated to receive a `node` prop rather than `id` and `source`.

### Patch Changes

- 5eb6b8a7bc: Added the nav logo extension for customization of sidebar logo
- 1f12fb762c: Create factories for overriding default core components extensions.
- 59709286b3: Add feature flags to plugins and extension overrides.
- e539735435: Added `createSignInPageExtension`.
- f27ee7d937: Migrate analytics api and context files.
- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## @backstage/repo-tools@0.5.0-next.0

### Minor Changes

- aea8f8d329: **BREAKING**: API Reports generated for sub-path exports now place the name as a suffix rather than prefix, for example `api-report-alpha.md` instead of `alpha-api-report.md`. When upgrading to this version you'll need to re-create any such API reports and delete the old ones.
- 38340678c3: Adds a new command `schema openapi generate-client` that creates a Typescript client with Backstage flavor, including the discovery API and fetch API. This command doesn't currently generate a complete client and needs to be wrapped or exported manually by a separate Backstage plugin. See `@backstage/catalog-client/src/generated` for example output.

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.3
  - @backstage/cli-common@0.1.13
  - @backstage/cli-node@0.2.0
  - @backstage/errors@1.2.3

## @techdocs/cli@1.8.0-next.1

### Minor Changes

- b2dccad7b3: Support passing additional `mkdocs-server` CLI parameters (`--dirtyreload`, `--strict` and `--clean`) when run in containerized mode.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-techdocs-node@1.11.0-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.1.1

## @backstage/plugin-auth-backend-module-oauth2-proxy-provider@0.1.0-next.0

### Minor Changes

- 271aa12c7c: Release of `oauth2-proxy-provider` plugin

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-auth-node@0.4.2-next.1

## @backstage/plugin-auth-backend-module-vmware-cloud-provider@0.1.0-next.0

### Minor Changes

- ed02c69a3c: Add VMware Cloud auth backend module provider

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/plugin-auth-node@0.4.2-next.1

## @backstage/plugin-azure-devops-backend@0.5.0-next.1

### Minor Changes

- 844969cd97: **BREAKING** New `fromConfig` static method must be used now when creating an instance of the `AzureDevOpsApi`

  Added support for using the `AzureDevOpsCredentialsProvider`

### Patch Changes

- 043b724c56: Introduced new `AzureDevOpsAnnotatorProcessor` that adds the needed annotations automatically. Also, moved constants to common package so they can be shared more easily
- Updated dependencies
  - @backstage/plugin-azure-devops-common@0.3.2-next.0
  - @backstage/integration@1.8.0-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-catalog-node@1.5.1-next.1

## @backstage/plugin-catalog@1.16.0-next.2

### Minor Changes

- e223f2264d: Properly support both function- and string-form visibility filter expressions in the new extensions exported via `/alpha`.

### Patch Changes

- 53600976bb: Ensure that passed-in icons are taken advantage of in the presentation API
- a5a04739e1: Internal refactor of alpha exports due to a change in how extension factories are defined.
- 78a10bb085: Adding in spec.type chip to search results for clarity
- fb8f3bdbc2: Updated alpha translation message keys to use nested format and camel case.
- 531e1a2a79: Updated alpha plugin to include the `unregisterRedirect` external route.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.4.0-next.1
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-client@1.5.0-next.0
  - @backstage/plugin-search-react@1.7.4-next.1
  - @backstage/core-compat-api@0.0.1-next.1
  - @backstage/integration-react@1.1.22-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-scaffolder-common@1.4.3
  - @backstage/plugin-search-common@1.2.8

## @backstage/plugin-home@0.6.0-next.1

### Minor Changes

- 5a317f59c0: Added view of entities grouped by kind to make it easier to distinguish entities with different kind but same name

### Patch Changes

- 2b725913c1: Updated dependency `@rjsf/utils` to `5.14.3`.
  Updated dependency `@rjsf/core` to `5.14.3`.
  Updated dependency `@rjsf/material-ui` to `5.14.3`.
  Updated dependency `@rjsf/validator-ajv8` to `5.14.3`.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.4.0-next.1
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-client@1.5.0-next.0
  - @backstage/core-app-api@1.11.2-next.1
  - @backstage/plugin-home-react@0.1.6-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/theme@0.5.0-next.0
  - @backstage/types@1.1.1

## @backstage/plugin-pagerduty@0.7.0-next.1

### Minor Changes

- 5fca16fdf6: This package has been deprecated, consider using [@pagerduty/backstage-plugin](https://github.com/pagerduty/backstage-plugin) instead.

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/plugin-home-react@0.1.6-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.0

## @backstage/app-defaults@1.4.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/core-app-api@1.11.2-next.1
  - @backstage/plugin-permission-react@0.4.18-next.1
  - @backstage/theme@0.5.0-next.0

## @backstage/backend-app-api@0.5.9-next.1

### Patch Changes

- 1da5f434f3: Ensure redaction of secrets that have accidental extra whitespace around them
- 9f8f266ff4: Add redacting for secrets in stack traces of logs
- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/cli-common@0.1.13
  - @backstage/cli-node@0.2.0
  - @backstage/config@1.1.1
  - @backstage/config-loader@1.5.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.2-next.1
  - @backstage/plugin-permission-node@0.7.19-next.1

## @backstage/backend-common@0.20.0-next.1

### Patch Changes

- 2666675457: Updated dependency `@google-cloud/storage` to `^7.0.0`.
- Updated dependencies
  - @backstage/backend-app-api@0.5.9-next.1
  - @backstage/integration@1.8.0-next.1
  - @backstage/backend-dev-utils@0.1.2
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.1.1
  - @backstage/config-loader@1.5.3
  - @backstage/errors@1.2.3
  - @backstage/integration-aws-node@0.1.8
  - @backstage/types@1.1.1

## @backstage/backend-defaults@0.2.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.5.9-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1

## @backstage/backend-openapi-utils@0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## @backstage/backend-plugin-api@0.6.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.2-next.1
  - @backstage/plugin-permission-common@0.7.10

## @backstage/backend-tasks@0.5.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## @backstage/backend-test-utils@0.2.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-app-api@0.5.9-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.2-next.1

## @backstage/core-app-api@1.11.2-next.1

### Patch Changes

- 3e358b0dff: Added deprecation warning for React Router v6 beta, please make sure you have migrated your apps to use React Router v6 stable as support for the beta version will be removed. See the [migration tutorial](https://backstage.io/docs/tutorials/react-router-stable-migration) for more information.
- Updated dependencies
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## @backstage/core-compat-api@0.0.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.4.0-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/core-app-api@1.11.2-next.1

## @backstage/core-components@0.13.9-next.1

### Patch Changes

- e8f2acef80: Added a new `/testUtils` sub-path that initially exports a `mockBreakpoint` helper.
- 07dfdf3702: Updated dependency `linkifyjs` to `4.1.3`.
- a518c5a25b: Updated dependency `@react-hookz/web` to `^23.0.0`.
- f291757e70: Update `linkify-react` to version `4.1.3`
- Updated dependencies
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.0
  - @backstage/version-bridge@1.0.7

## @backstage/core-plugin-api@1.8.1-next.1

### Patch Changes

- 0c93dc37b2: The `createTranslationRef` function from the `/alpha` subpath can now also accept a nested object structure of default translation messages, which will be flatted using `.` separators.
- Updated dependencies
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## @backstage/create-app@0.5.8-next.2

### Patch Changes

- 375b6f7d68: CircelCI plugin moved permanently
- Updated dependencies
  - @backstage/cli-common@0.1.13

## @backstage/dev-utils@1.0.25-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/core-app-api@1.11.2-next.1
  - @backstage/app-defaults@1.4.6-next.1
  - @backstage/integration-react@1.1.22-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.5.0-next.0

## @backstage/eslint-plugin@0.1.4-next.0

### Patch Changes

- 107dc46ab1: The `no-undeclared-imports` rule will now prefer using version queries that already exist en the repo for the same dependency type when installing new packages.

## @backstage/frontend-test-utils@0.1.0-next.1

### Patch Changes

- e539735435: Updates for `core.router` addition.
- c21c9cf07b: Re-export mock API implementations as well as `TestApiProvider`, `TestApiRegistry`, `withLogCollector`, and `setupRequestMockHandlers` from `@backstage/test-utils`.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.4.0-next.1
  - @backstage/frontend-app-api@0.4.0-next.1
  - @backstage/test-utils@1.4.6-next.1
  - @backstage/types@1.1.1

## @backstage/integration@1.8.0-next.1

### Patch Changes

- 99fb54183b: Updated dependency `@azure/identity` to `^4.0.0`.
- Updated dependencies
  - @backstage/config@1.1.1

## @backstage/integration-react@1.1.22-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/integration@1.8.0-next.1
  - @backstage/config@1.1.1

## @backstage/test-utils@1.4.6-next.1

### Patch Changes

- e8f2acef80: Deprecated `mockBreakpoint`, as it is now available from `@backstage/core-components/testUtils` instead.
- Updated dependencies
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/core-app-api@1.11.2-next.1
  - @backstage/plugin-permission-react@0.4.18-next.1
  - @backstage/config@1.1.1
  - @backstage/theme@0.5.0-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.10

## @backstage/plugin-adr@0.6.11-next.1

### Patch Changes

- fb8f3bdbc2: Updated alpha translation message keys to use nested format and camel case.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.4.0-next.1
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/plugin-search-react@1.7.4-next.1
  - @backstage/integration-react@1.1.22-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.5.0-next.0
  - @backstage/plugin-adr-common@0.2.18-next.1
  - @backstage/plugin-search-common@1.2.8

## @backstage/plugin-adr-backend@0.4.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.5.0-next.0
  - @backstage/integration@1.8.0-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-adr-common@0.2.18-next.1
  - @backstage/plugin-search-common@1.2.8

## @backstage/plugin-adr-common@0.2.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.8.0-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/plugin-search-common@1.2.8

## @backstage/plugin-airbrake@0.3.28-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/test-utils@1.4.6-next.1
  - @backstage/dev-utils@1.0.25-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-airbrake-backend@0.3.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/config@1.1.1

## @backstage/plugin-allure@0.1.44-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-analytics-module-ga@0.1.36-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/config@1.1.1
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-analytics-module-ga4@0.1.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/config@1.1.1
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-analytics-module-newrelic-browser@0.0.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/config@1.1.1

## @backstage/plugin-apache-airflow@0.2.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1

## @backstage/plugin-api-docs@0.10.2-next.2

### Patch Changes

- e16e7ce6a5: Updated dependency `@asyncapi/react-component` to `1.2.2`.
- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/plugin-catalog@1.16.0-next.2
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-apollo-explorer@0.1.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-app-backend@0.3.56-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/config@1.1.1
  - @backstage/config-loader@1.5.3
  - @backstage/types@1.1.1
  - @backstage/plugin-app-node@0.1.8-next.1

## @backstage/plugin-app-node@0.1.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.8-next.1

## @backstage/plugin-auth-backend@0.20.1-next.1

### Patch Changes

- 7ac25759a5: `oauth2-proxy` auth implementation has been moved to `@backstage/plugin-auth-backend-module-oauth2-proxy-provider`
- bcbbf8e042: Updated dependency `@google-cloud/firestore` to `^7.0.0`.
- Updated dependencies
  - @backstage/plugin-auth-backend-module-oauth2-proxy-provider@0.1.0-next.0
  - @backstage/catalog-client@1.5.0-next.0
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/plugin-auth-backend-module-atlassian-provider@0.1.0-next.1
  - @backstage/plugin-auth-backend-module-github-provider@0.1.5-next.1
  - @backstage/plugin-auth-backend-module-gitlab-provider@0.1.5-next.1
  - @backstage/plugin-auth-backend-module-google-provider@0.1.5-next.1
  - @backstage/plugin-auth-backend-module-oauth2-provider@0.1.5-next.1
  - @backstage/plugin-auth-backend-module-okta-provider@0.0.1-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-backend-module-gcp-iap-provider@0.2.2-next.1
  - @backstage/plugin-auth-node@0.4.2-next.1
  - @backstage/plugin-catalog-node@1.5.1-next.1

## @backstage/plugin-auth-backend-module-atlassian-provider@0.1.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/plugin-auth-node@0.4.2-next.1

## @backstage/plugin-auth-backend-module-gcp-iap-provider@0.2.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.2-next.1

## @backstage/plugin-auth-backend-module-github-provider@0.1.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/plugin-auth-node@0.4.2-next.1

## @backstage/plugin-auth-backend-module-gitlab-provider@0.1.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/plugin-auth-node@0.4.2-next.1

## @backstage/plugin-auth-backend-module-google-provider@0.1.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/plugin-auth-node@0.4.2-next.1

## @backstage/plugin-auth-backend-module-microsoft-provider@0.1.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/plugin-auth-node@0.4.2-next.1

## @backstage/plugin-auth-backend-module-oauth2-provider@0.1.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/plugin-auth-node@0.4.2-next.1

## @backstage/plugin-auth-backend-module-okta-provider@0.0.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/plugin-auth-node@0.4.2-next.1

## @backstage/plugin-auth-backend-module-pinniped-provider@0.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/config@1.1.1
  - @backstage/plugin-auth-node@0.4.2-next.1

## @backstage/plugin-auth-node@0.4.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.5.0-next.0
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## @backstage/plugin-azure-devops@0.3.10-next.1

### Patch Changes

- 043b724c56: Introduced new `AzureDevOpsAnnotatorProcessor` that adds the needed annotations automatically. Also, moved constants to common package so they can be shared more easily
- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/plugin-azure-devops-common@0.3.2-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-azure-devops-common@0.3.2-next.0

### Patch Changes

- 043b724c56: Introduced new `AzureDevOpsAnnotatorProcessor` that adds the needed annotations automatically. Also, moved constants to common package so they can be shared more easily

## @backstage/plugin-azure-sites@0.1.17-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.5.0-next.0
  - @backstage/plugin-azure-sites-common@0.1.1

## @backstage/plugin-azure-sites-backend@0.1.18-next.1

### Patch Changes

- 99fb54183b: Updated dependency `@azure/identity` to `^4.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/config@1.1.1
  - @backstage/plugin-azure-sites-common@0.1.1

## @backstage/plugin-badges@0.2.52-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-badges-backend@0.3.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.5.0-next.0
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-auth-node@0.4.2-next.1

## @backstage/plugin-bazaar@0.2.20-next.2

### Patch Changes

- 5d796829bb: Internalize 'AboutField' to break catalog dependency
- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-client@1.5.0-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-bazaar-backend@0.3.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-auth-node@0.4.2-next.1

## @backstage/plugin-bitbucket-cloud-common@0.2.15-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.8.0-next.1

## @backstage/plugin-bitrise@0.1.55-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-catalog-backend@1.15.1-next.1

### Patch Changes

- 38340678c3: Update the OpenAPI spec to support the use of `openapi-generator`.
- 7123c58b3d: Updated dependency `@types/glob` to `^8.0.0`.
- Updated dependencies
  - @backstage/catalog-client@1.5.0-next.0
  - @backstage/integration@1.8.0-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-openapi-utils@0.1.1-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.2-next.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-catalog-node@1.5.1-next.1
  - @backstage/plugin-events-node@0.2.17-next.1
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/plugin-permission-node@0.7.19-next.1
  - @backstage/plugin-search-backend-module-catalog@0.1.12-next.1

## @backstage/plugin-catalog-backend-module-aws@0.3.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.8.0-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/plugin-kubernetes-common@0.7.2-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration-aws-node@0.1.8
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-catalog-node@1.5.1-next.1

## @backstage/plugin-catalog-backend-module-azure@0.1.27-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.8.0-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-catalog-node@1.5.1-next.1

## @backstage/plugin-catalog-backend-module-backstage-openapi@0.1.1-next.1

### Patch Changes

- eb44e92898: Support authenticated backends
- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-openapi-utils@0.1.1-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-catalog-node@1.5.1-next.1

## @backstage/plugin-catalog-backend-module-bitbucket@0.2.23-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.8.0-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.15-next.1
  - @backstage/plugin-catalog-node@1.5.1-next.1

## @backstage/plugin-catalog-backend-module-bitbucket-cloud@0.1.23-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.5.0-next.0
  - @backstage/integration@1.8.0-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.15-next.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-catalog-node@1.5.1-next.1
  - @backstage/plugin-events-node@0.2.17-next.1

## @backstage/plugin-catalog-backend-module-bitbucket-server@0.1.21-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.8.0-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-catalog-node@1.5.1-next.1

## @backstage/plugin-catalog-backend-module-gcp@0.1.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/plugin-kubernetes-common@0.7.2-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-node@1.5.1-next.1

## @backstage/plugin-catalog-backend-module-gerrit@0.1.24-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.8.0-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-catalog-node@1.5.1-next.1

## @backstage/plugin-catalog-backend-module-github@0.4.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.15.1-next.1
  - @backstage/catalog-client@1.5.0-next.0
  - @backstage/integration@1.8.0-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-catalog-node@1.5.1-next.1
  - @backstage/plugin-events-node@0.2.17-next.1

## @backstage/plugin-catalog-backend-module-github-org@0.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-backend-module-github@0.4.6-next.1
  - @backstage/plugin-catalog-node@1.5.1-next.1

## @backstage/plugin-catalog-backend-module-gitlab@0.3.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.8.0-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-node@1.5.1-next.1

## @backstage/plugin-catalog-backend-module-incremental-ingestion@0.4.12-next.1

### Patch Changes

- 43b2eb8f70: Ensure that cursors always come back as JSON on sqlite too
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.15.1-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-catalog-node@1.5.1-next.1
  - @backstage/plugin-events-node@0.2.17-next.1
  - @backstage/plugin-permission-common@0.7.10

## @backstage/plugin-catalog-backend-module-ldap@0.5.23-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-catalog-node@1.5.1-next.1

## @backstage/plugin-catalog-backend-module-msgraph@0.5.15-next.1

### Patch Changes

- 99fb54183b: Updated dependency `@azure/identity` to `^4.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-catalog-node@1.5.1-next.1

## @backstage/plugin-catalog-backend-module-openapi@0.1.25-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.15.1-next.1
  - @backstage/integration@1.8.0-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-catalog-node@1.5.1-next.1

## @backstage/plugin-catalog-backend-module-puppetdb@0.1.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-node@1.5.1-next.1

## @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-catalog-node@1.5.1-next.1
  - @backstage/plugin-scaffolder-common@1.4.3

## @backstage/plugin-catalog-backend-module-unprocessed@0.3.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/plugin-auth-node@0.4.2-next.1

## @backstage/plugin-catalog-graph@0.3.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-client@1.5.0-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.5.0-next.0
  - @backstage/types@1.1.1

## @backstage/plugin-catalog-import@0.10.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.4.0-next.1
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-client@1.5.0-next.0
  - @backstage/integration@1.8.0-next.1
  - @backstage/core-compat-api@0.0.1-next.1
  - @backstage/integration-react@1.1.22-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-catalog-common@1.0.18

## @backstage/plugin-catalog-node@1.5.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.5.0-next.0
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.18

## @backstage/plugin-catalog-react@1.9.2-next.1

### Patch Changes

- 53600976bb: Ensure that passed-in icons are taken advantage of in the presentation API

- 08d9e67199: Add default icon for kind resource.

- a5a04739e1: Internal refactor of alpha exports due to a change in how extension factories are defined.

- e223f2264d: Breaking alpha-API change to entity visibility filter functions to accept a bare entity as their first argument, instead of an object with an entity property.

  Functions that accept such filters now also support the string expression form of filters.

- Updated dependencies
  - @backstage/frontend-plugin-api@0.4.0-next.1
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/catalog-client@1.5.0-next.0
  - @backstage/integration-react@1.1.22-next.1
  - @backstage/plugin-permission-react@0.4.18-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-permission-common@0.7.10

## @backstage/plugin-catalog-unprocessed-entities@0.1.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-cicd-statistics@0.1.30-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-model@1.4.3

## @backstage/plugin-cicd-statistics-module-gitlab@0.1.24-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-cicd-statistics@0.1.30-next.1
  - @backstage/catalog-model@1.4.3

## @backstage/plugin-circleci@0.3.28-next.1

### Patch Changes

- 375b6f7d68: CircelCI plugin moved permanently
- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-cloudbuild@0.3.28-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-code-climate@0.1.28-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-code-coverage@0.2.21-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-code-coverage-backend@0.2.22-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.5.0-next.0
  - @backstage/integration@1.8.0-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-auth-node@0.4.2-next.1

## @backstage/plugin-codescene@0.1.20-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-config-schema@0.1.48-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.0
  - @backstage/types@1.1.1

## @backstage/plugin-cost-insights@0.12.17-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/theme@0.5.0-next.0
  - @backstage/plugin-cost-insights-common@0.1.2

## @backstage/plugin-devtools@0.1.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-permission-react@0.4.18-next.1
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-devtools-common@0.1.6

## @backstage/plugin-devtools-backend@0.2.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/cli-common@0.1.13
  - @backstage/config@1.1.1
  - @backstage/config-loader@1.5.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.2-next.1
  - @backstage/plugin-devtools-common@0.1.6
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/plugin-permission-node@0.7.19-next.1

## @backstage/plugin-dynatrace@8.0.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-entity-feedback@0.2.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.0
  - @backstage/plugin-entity-feedback-common@0.1.3

## @backstage/plugin-entity-feedback-backend@0.2.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.5.0-next.0
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/plugin-auth-node@0.4.2-next.1
  - @backstage/plugin-entity-feedback-common@0.1.3

## @backstage/plugin-entity-validation@0.1.13-next.1

### Patch Changes

- a518c5a25b: Updated dependency `@react-hookz/web` to `^23.0.0`.
- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-client@1.5.0-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.0
  - @backstage/plugin-catalog-common@1.0.18

## @backstage/plugin-events-backend@0.2.17-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/config@1.1.1
  - @backstage/plugin-events-node@0.2.17-next.1

## @backstage/plugin-events-backend-module-aws-sqs@0.2.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.2.17-next.1

## @backstage/plugin-events-backend-module-azure@0.1.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/plugin-events-node@0.2.17-next.1

## @backstage/plugin-events-backend-module-bitbucket-cloud@0.1.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/plugin-events-node@0.2.17-next.1

## @backstage/plugin-events-backend-module-gerrit@0.1.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/plugin-events-node@0.2.17-next.1

## @backstage/plugin-events-backend-module-github@0.1.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/config@1.1.1
  - @backstage/plugin-events-node@0.2.17-next.1

## @backstage/plugin-events-backend-module-gitlab@0.1.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/config@1.1.1
  - @backstage/plugin-events-node@0.2.17-next.1

## @backstage/plugin-events-backend-test-utils@0.1.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.2.17-next.1

## @backstage/plugin-events-node@0.2.17-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.8-next.1

## @backstage/plugin-explore@0.4.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.4.0-next.1
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/plugin-search-react@1.7.4-next.1
  - @backstage/plugin-explore-react@0.0.34-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.0
  - @backstage/plugin-explore-common@0.0.2
  - @backstage/plugin-search-common@1.2.8

## @backstage/plugin-explore-backend@0.0.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-explore-common@0.0.2
  - @backstage/plugin-search-backend-module-explore@0.1.12-next.1
  - @backstage/plugin-search-common@1.2.8

## @backstage/plugin-explore-react@0.0.34-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-explore-common@0.0.2

## @backstage/plugin-firehydrant@0.2.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-fossa@0.2.60-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-gcalendar@0.3.21-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-gcp-projects@0.3.44-next.1

### Patch Changes

- a518c5a25b: Updated dependency `@react-hookz/web` to `^23.0.0`.
- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-git-release-manager@0.3.40-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/integration@1.8.0-next.1
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-github-actions@0.6.9-next.1

### Patch Changes

- 08d7e4676a: Github Workflow Runs UI is modified to show in optional Card view instead of table, with branch selection option
- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/integration@1.8.0-next.1
  - @backstage/integration-react@1.1.22-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-github-deployments@0.1.59-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/integration@1.8.0-next.1
  - @backstage/integration-react@1.1.22-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-github-issues@0.2.17-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/integration@1.8.0-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-github-pull-requests-board@0.1.22-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/integration@1.8.0-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-gitops-profiles@0.3.43-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/config@1.1.1
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-gocd@0.1.34-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-graphiql@0.3.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.4.0-next.1
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/core-compat-api@0.0.1-next.1
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-graphql-voyager@0.1.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-home-react@0.1.6-next.1

### Patch Changes

- 2b725913c1: Updated dependency `@rjsf/utils` to `5.14.3`.
  Updated dependency `@rjsf/core` to `5.14.3`.
  Updated dependency `@rjsf/material-ui` to `5.14.3`.
  Updated dependency `@rjsf/validator-ajv8` to `5.14.3`.
- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1

## @backstage/plugin-ilert@0.2.17-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-jenkins@0.9.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.0
  - @backstage/plugin-jenkins-common@0.1.21

## @backstage/plugin-jenkins-backend@0.3.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.5.0-next.0
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-auth-node@0.4.2-next.1
  - @backstage/plugin-catalog-node@1.5.1-next.1
  - @backstage/plugin-jenkins-common@0.1.21
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/plugin-permission-node@0.7.19-next.1

## @backstage/plugin-kafka@0.3.28-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-kafka-backend@0.3.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## @backstage/plugin-kubernetes@0.11.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/plugin-kubernetes-common@0.7.2-next.1
  - @backstage/plugin-kubernetes-react@0.1.2-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.0
  - @backstage/types@1.1.1

## @backstage/plugin-kubernetes-backend@0.14.0-next.1

### Patch Changes

- ae94d3ce6f: Updated dependency `@aws-crypto/sha256-js` to `^5.0.0`.
- 99fb54183b: Updated dependency `@azure/identity` to `^4.0.0`.
- Updated dependencies
  - @backstage/catalog-client@1.5.0-next.0
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/plugin-kubernetes-common@0.7.2-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration-aws-node@0.1.8
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.2-next.1
  - @backstage/plugin-catalog-node@1.5.1-next.1
  - @backstage/plugin-kubernetes-node@0.1.2-next.1
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/plugin-permission-node@0.7.19-next.1

## @backstage/plugin-kubernetes-cluster@0.0.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/plugin-kubernetes-common@0.7.2-next.1
  - @backstage/plugin-kubernetes-react@0.1.2-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-kubernetes-common@0.7.2-next.1

### Patch Changes

- 5d796829bb: Remove unused dependency
- Updated dependencies
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.7.10

## @backstage/plugin-kubernetes-node@0.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-kubernetes-common@0.7.2-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/catalog-model@1.4.3

## @backstage/plugin-kubernetes-react@0.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-kubernetes-common@0.7.2-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## @backstage/plugin-lighthouse@0.4.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/theme@0.5.0-next.0
  - @backstage/plugin-lighthouse-common@0.1.4

## @backstage/plugin-lighthouse-backend@0.3.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.5.0-next.0
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-node@1.5.1-next.1
  - @backstage/plugin-lighthouse-common@0.1.4

## @backstage/plugin-linguist@0.1.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.0
  - @backstage/plugin-linguist-common@0.1.2

## @backstage/plugin-linguist-backend@0.5.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.5.0-next.0
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.2-next.1
  - @backstage/plugin-catalog-node@1.5.1-next.1
  - @backstage/plugin-linguist-common@0.1.2

## @backstage/plugin-microsoft-calendar@0.1.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-newrelic@0.3.43-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-newrelic-dashboard@0.3.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3

## @backstage/plugin-nomad@0.1.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-nomad-backend@0.1.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## @backstage/plugin-octopus-deploy@0.2.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-opencost@0.2.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-org@0.6.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-org-react@0.1.17-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-client@1.5.0-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-periskop@0.1.26-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-periskop-backend@0.2.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/config@1.1.1

## @backstage/plugin-permission-backend@0.5.31-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-auth-node@0.4.2-next.1
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/plugin-permission-node@0.7.19-next.1

## @backstage/plugin-permission-backend-module-allow-all-policy@0.1.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/plugin-auth-node@0.4.2-next.1
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/plugin-permission-node@0.7.19-next.1

## @backstage/plugin-permission-node@0.7.19-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-auth-node@0.4.2-next.1
  - @backstage/plugin-permission-common@0.7.10

## @backstage/plugin-permission-react@0.4.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/config@1.1.1
  - @backstage/plugin-permission-common@0.7.10

## @backstage/plugin-playlist@0.2.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/plugin-search-react@1.7.4-next.1
  - @backstage/plugin-permission-react@0.4.18-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.0
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/plugin-playlist-common@0.1.12

## @backstage/plugin-playlist-backend@0.3.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.5.0-next.0
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-auth-node@0.4.2-next.1
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/plugin-permission-node@0.7.19-next.1
  - @backstage/plugin-playlist-common@0.1.12

## @backstage/plugin-proxy-backend@0.4.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/config@1.1.1

## @backstage/plugin-puppetdb@0.1.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-rollbar@0.4.28-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-rollbar-backend@0.1.53-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/config@1.1.1

## @backstage/plugin-scaffolder@1.16.2-next.1

### Patch Changes

- 2b725913c1: Updated dependency `@rjsf/utils` to `5.14.3`.
  Updated dependency `@rjsf/core` to `5.14.3`.
  Updated dependency `@rjsf/material-ui` to `5.14.3`.
  Updated dependency `@rjsf/validator-ajv8` to `5.14.3`.
- a518c5a25b: Updated dependency `@react-hookz/web` to `^23.0.0`.
- b5fa6918dc: Fixing `headerOptions` not being passed through the `TemplatePage` component
- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-client@1.5.0-next.0
  - @backstage/plugin-scaffolder-react@1.6.2-next.1
  - @backstage/integration@1.8.0-next.1
  - @backstage/integration-react@1.1.22-next.1
  - @backstage/plugin-permission-react@0.4.18-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-scaffolder-common@1.4.3

## @backstage/plugin-scaffolder-backend@1.19.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.15.1-next.1
  - @backstage/catalog-client@1.5.0-next.0
  - @backstage/integration@1.8.0-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.2-next.1
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.5-next.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-catalog-node@1.5.1-next.1
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/plugin-permission-node@0.7.19-next.1
  - @backstage/plugin-scaffolder-common@1.4.3
  - @backstage/plugin-scaffolder-node@0.2.9-next.1

## @backstage/plugin-scaffolder-backend-module-confluence-to-markdown@0.2.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.8.0-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-scaffolder-node@0.2.9-next.1

## @backstage/plugin-scaffolder-backend-module-cookiecutter@0.2.32-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.8.0-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-scaffolder-node@0.2.9-next.1

## @backstage/plugin-scaffolder-backend-module-gitlab@0.2.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.8.0-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-scaffolder-node@0.2.9-next.1

## @backstage/plugin-scaffolder-backend-module-rails@0.4.25-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.8.0-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-scaffolder-node@0.2.9-next.1

## @backstage/plugin-scaffolder-backend-module-sentry@0.1.16-next.1

### Patch Changes

- 7f8a801e6d: Added examples for `sentry:project:create` scaffolder action and unit tests.
- Updated dependencies
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-scaffolder-node@0.2.9-next.1

## @backstage/plugin-scaffolder-backend-module-yeoman@0.2.29-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-scaffolder-node@0.2.9-next.1

## @backstage/plugin-scaffolder-node@0.2.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.8.0-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-scaffolder-common@1.4.3

## @backstage/plugin-scaffolder-react@1.6.2-next.1

### Patch Changes

- fa66d1b5b3: Fixed bug in `ReviewState` where `enum` value was displayed in step review instead of the corresponding label when using `enumNames`
- 2aee53bbeb: Add horizontal slider if stepper overflows
- 2b725913c1: Updated dependency `@rjsf/utils` to `5.14.3`.
  Updated dependency `@rjsf/core` to `5.14.3`.
  Updated dependency `@rjsf/material-ui` to `5.14.3`.
  Updated dependency `@rjsf/validator-ajv8` to `5.14.3`.
- a518c5a25b: Updated dependency `@react-hookz/web` to `^23.0.0`.
- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-client@1.5.0-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7
  - @backstage/plugin-scaffolder-common@1.4.3

## @backstage/plugin-search@1.4.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.4.0-next.1
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/plugin-search-react@1.7.4-next.1
  - @backstage/core-compat-api@0.0.1-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7
  - @backstage/plugin-search-common@1.2.8

## @backstage/plugin-search-backend@1.4.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-openapi-utils@0.1.1-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.2-next.1
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/plugin-permission-node@0.7.19-next.1
  - @backstage/plugin-search-backend-node@1.2.12-next.1
  - @backstage/plugin-search-common@1.2.8

## @backstage/plugin-search-backend-module-catalog@0.1.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.5.0-next.0
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-catalog-node@1.5.1-next.1
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/plugin-search-backend-node@1.2.12-next.1
  - @backstage/plugin-search-common@1.2.8

## @backstage/plugin-search-backend-module-elasticsearch@1.3.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/config@1.1.1
  - @backstage/integration-aws-node@0.1.8
  - @backstage/plugin-search-backend-node@1.2.12-next.1
  - @backstage/plugin-search-common@1.2.8

## @backstage/plugin-search-backend-module-explore@0.1.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/config@1.1.1
  - @backstage/plugin-explore-common@0.0.2
  - @backstage/plugin-search-backend-node@1.2.12-next.1
  - @backstage/plugin-search-common@1.2.8

## @backstage/plugin-search-backend-module-pg@0.5.17-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/config@1.1.1
  - @backstage/plugin-search-backend-node@1.2.12-next.1
  - @backstage/plugin-search-common@1.2.8

## @backstage/plugin-search-backend-module-stack-overflow-collator@0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/config@1.1.1
  - @backstage/plugin-search-backend-node@1.2.12-next.1
  - @backstage/plugin-search-common@1.2.8

## @backstage/plugin-search-backend-module-techdocs@0.1.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.5.0-next.0
  - @backstage/plugin-techdocs-node@1.11.0-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-catalog-node@1.5.1-next.1
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/plugin-search-backend-node@1.2.12-next.1
  - @backstage/plugin-search-common@1.2.8

## @backstage/plugin-search-backend-node@1.2.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/plugin-search-common@1.2.8

## @backstage/plugin-search-react@1.7.4-next.1

### Patch Changes

- a5a04739e1: Internal refactor of alpha exports due to a change in how extension factories are defined.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.4.0-next.1
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/theme@0.5.0-next.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7
  - @backstage/plugin-search-common@1.2.8

## @backstage/plugin-sentry@0.5.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-shortcuts@0.3.17-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/theme@0.5.0-next.0
  - @backstage/types@1.1.1

## @backstage/plugin-sonarqube@0.7.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/plugin-sonarqube-react@0.1.11-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-sonarqube-backend@0.2.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## @backstage/plugin-sonarqube-react@0.1.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/catalog-model@1.4.3

## @backstage/plugin-splunk-on-call@0.4.17-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-stack-overflow@0.1.23-next.1

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.4.0-next.1
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-search-react@1.7.4-next.1
  - @backstage/plugin-home-react@0.1.6-next.1
  - @backstage/config@1.1.1
  - @backstage/theme@0.5.0-next.0
  - @backstage/plugin-search-common@1.2.8

## @backstage/plugin-stack-overflow-backend@0.2.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/config@1.1.1
  - @backstage/plugin-search-backend-module-stack-overflow-collator@0.1.1-next.1
  - @backstage/plugin-search-common@1.2.8

## @backstage/plugin-stackstorm@0.1.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-tech-insights@0.3.20-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-tech-insights-common@0.2.12

## @backstage/plugin-tech-insights-backend@0.5.22-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.5.0-next.0
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-tech-insights-common@0.2.12
  - @backstage/plugin-tech-insights-node@0.4.14-next.1

## @backstage/plugin-tech-insights-backend-module-jsonfc@0.1.40-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-tech-insights-common@0.2.12
  - @backstage/plugin-tech-insights-node@0.4.14-next.1

## @backstage/plugin-tech-insights-node@0.4.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-tech-insights-common@0.2.12

## @backstage/plugin-tech-radar@0.6.11-next.2

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.4.0-next.1
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/core-compat-api@0.0.1-next.1
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-techdocs@1.9.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.4.0-next.1
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/plugin-search-react@1.7.4-next.1
  - @backstage/integration@1.8.0-next.1
  - @backstage/core-compat-api@0.0.1-next.1
  - @backstage/integration-react@1.1.22-next.1
  - @backstage/plugin-techdocs-react@1.1.14-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.0
  - @backstage/plugin-search-common@1.2.8

## @backstage/plugin-techdocs-addons-test-utils@1.0.25-next.2

### Patch Changes

- 5d796829bb: Remove unnecessary catalog dependency
- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/plugin-catalog@1.16.0-next.2
  - @backstage/core-app-api@1.11.2-next.1
  - @backstage/test-utils@1.4.6-next.1
  - @backstage/plugin-search-react@1.7.4-next.1
  - @backstage/plugin-techdocs@1.9.2-next.2
  - @backstage/integration-react@1.1.22-next.1
  - @backstage/plugin-techdocs-react@1.1.14-next.1
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-techdocs-backend@1.9.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.5.0-next.0
  - @backstage/integration@1.8.0-next.1
  - @backstage/plugin-techdocs-node@1.11.0-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/plugin-search-backend-module-techdocs@0.1.12-next.1
  - @backstage/plugin-search-common@1.2.8

## @backstage/plugin-techdocs-module-addons-contrib@1.1.3-next.1

### Patch Changes

- a518c5a25b: Updated dependency `@react-hookz/web` to `^23.0.0`.
- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/integration@1.8.0-next.1
  - @backstage/integration-react@1.1.22-next.1
  - @backstage/plugin-techdocs-react@1.1.14-next.1
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-techdocs-node@1.11.0-next.1

### Patch Changes

- 99fb54183b: Updated dependency `@azure/identity` to `^4.0.0`.
- 2666675457: Updated dependency `@google-cloud/storage` to `^7.0.0`.
- 4f773c15f6: Bumped the default TechDocs docker image version to the latest which was released several month ago
- Updated dependencies
  - @backstage/integration@1.8.0-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration-aws-node@0.1.8
  - @backstage/plugin-search-common@1.2.8

## @backstage/plugin-techdocs-react@1.1.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/version-bridge@1.0.7

## @backstage/plugin-todo@0.2.32-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-todo-backend@0.3.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.5.0-next.0
  - @backstage/integration@1.8.0-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-openapi-utils@0.1.1-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-catalog-node@1.5.1-next.1

## @backstage/plugin-user-settings@0.7.14-next.2

### Patch Changes

- fb8f3bdbc2: Updated alpha translation message keys to use nested format and camel case.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.4.0-next.1
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/core-app-api@1.11.2-next.1
  - @backstage/core-compat-api@0.0.1-next.1
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.0
  - @backstage/types@1.1.1

## @backstage/plugin-user-settings-backend@0.2.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.2-next.1

## @backstage/plugin-vault@0.1.23-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.0

## @backstage/plugin-vault-backend@0.4.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-vault-node@0.1.1-next.1

## @backstage/plugin-vault-node@0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.8-next.1

## @backstage/plugin-xcmetrics@0.2.46-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.0

## example-app@0.2.90-next.2

### Patch Changes

- Updated dependencies
  - @backstage/frontend-app-api@0.4.0-next.1
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/cli@0.25.0-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/plugin-catalog@1.16.0-next.2
  - @backstage/plugin-scaffolder-react@1.6.2-next.1
  - @backstage/plugin-home@0.6.0-next.1
  - @backstage/plugin-github-actions@0.6.9-next.1
  - @backstage/core-app-api@1.11.2-next.1
  - @backstage/plugin-search-react@1.7.4-next.1
  - @backstage/plugin-azure-devops@0.3.10-next.1
  - @backstage/plugin-scaffolder@1.16.2-next.1
  - @backstage/plugin-api-docs@0.10.2-next.2
  - @backstage/plugin-gcp-projects@0.3.44-next.1
  - @backstage/plugin-techdocs-module-addons-contrib@1.1.3-next.1
  - @backstage/plugin-user-settings@0.7.14-next.2
  - @backstage/plugin-adr@0.6.11-next.1
  - @backstage/plugin-pagerduty@0.7.0-next.1
  - @backstage/plugin-catalog-import@0.10.4-next.2
  - @backstage/plugin-explore@0.4.14-next.1
  - @backstage/plugin-graphiql@0.3.1-next.2
  - @backstage/plugin-search@1.4.4-next.2
  - @backstage/plugin-stack-overflow@0.1.23-next.1
  - @backstage/plugin-tech-radar@0.6.11-next.2
  - @backstage/plugin-techdocs@1.9.2-next.2
  - @backstage/app-defaults@1.4.6-next.1
  - @backstage/integration-react@1.1.22-next.1
  - @backstage/plugin-airbrake@0.3.28-next.1
  - @backstage/plugin-apache-airflow@0.2.18-next.1
  - @backstage/plugin-azure-sites@0.1.17-next.1
  - @backstage/plugin-badges@0.2.52-next.1
  - @backstage/plugin-catalog-graph@0.3.2-next.1
  - @backstage/plugin-catalog-unprocessed-entities@0.1.6-next.1
  - @backstage/plugin-cloudbuild@0.3.28-next.1
  - @backstage/plugin-code-coverage@0.2.21-next.1
  - @backstage/plugin-cost-insights@0.12.17-next.1
  - @backstage/plugin-devtools@0.1.7-next.1
  - @backstage/plugin-dynatrace@8.0.2-next.1
  - @backstage/plugin-entity-feedback@0.2.11-next.1
  - @backstage/plugin-gcalendar@0.3.21-next.1
  - @backstage/plugin-gocd@0.1.34-next.1
  - @backstage/plugin-jenkins@0.9.3-next.1
  - @backstage/plugin-kafka@0.3.28-next.1
  - @backstage/plugin-kubernetes@0.11.3-next.1
  - @backstage/plugin-kubernetes-cluster@0.0.4-next.1
  - @backstage/plugin-lighthouse@0.4.13-next.1
  - @backstage/plugin-linguist@0.1.13-next.1
  - @backstage/plugin-microsoft-calendar@0.1.10-next.1
  - @backstage/plugin-newrelic@0.3.43-next.1
  - @backstage/plugin-newrelic-dashboard@0.3.3-next.1
  - @backstage/plugin-nomad@0.1.9-next.1
  - @backstage/plugin-octopus-deploy@0.2.10-next.1
  - @backstage/plugin-org@0.6.18-next.1
  - @backstage/plugin-playlist@0.2.2-next.1
  - @backstage/plugin-puppetdb@0.1.11-next.1
  - @backstage/plugin-rollbar@0.4.28-next.1
  - @backstage/plugin-sentry@0.5.13-next.1
  - @backstage/plugin-shortcuts@0.3.17-next.1
  - @backstage/plugin-stackstorm@0.1.9-next.1
  - @backstage/plugin-tech-insights@0.3.20-next.1
  - @backstage/plugin-techdocs-react@1.1.14-next.1
  - @backstage/plugin-todo@0.2.32-next.1
  - @backstage/plugin-permission-react@0.4.18-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/theme@0.5.0-next.0
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-linguist-common@0.1.2
  - @backstage/plugin-search-common@1.2.8

## example-app-next@0.0.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.4.0-next.1
  - @backstage/frontend-app-api@0.4.0-next.1
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/cli@0.25.0-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/plugin-catalog@1.16.0-next.2
  - @backstage/plugin-scaffolder-react@1.6.2-next.1
  - @backstage/plugin-home@0.6.0-next.1
  - @backstage/plugin-github-actions@0.6.9-next.1
  - @backstage/core-app-api@1.11.2-next.1
  - @backstage/plugin-search-react@1.7.4-next.1
  - @backstage/plugin-azure-devops@0.3.10-next.1
  - @backstage/plugin-scaffolder@1.16.2-next.1
  - @backstage/plugin-api-docs@0.10.2-next.2
  - @backstage/plugin-gcp-projects@0.3.44-next.1
  - @backstage/plugin-techdocs-module-addons-contrib@1.1.3-next.1
  - @backstage/plugin-user-settings@0.7.14-next.2
  - @backstage/plugin-adr@0.6.11-next.1
  - @backstage/plugin-pagerduty@0.7.0-next.1
  - app-next-example-plugin@0.0.4-next.1
  - @backstage/core-compat-api@0.0.1-next.1
  - @backstage/plugin-catalog-import@0.10.4-next.2
  - @backstage/plugin-explore@0.4.14-next.1
  - @backstage/plugin-graphiql@0.3.1-next.2
  - @backstage/plugin-search@1.4.4-next.2
  - @backstage/plugin-tech-radar@0.6.11-next.2
  - @backstage/plugin-techdocs@1.9.2-next.2
  - @backstage/app-defaults@1.4.6-next.1
  - @backstage/integration-react@1.1.22-next.1
  - @backstage/plugin-airbrake@0.3.28-next.1
  - @backstage/plugin-apache-airflow@0.2.18-next.1
  - @backstage/plugin-azure-sites@0.1.17-next.1
  - @backstage/plugin-badges@0.2.52-next.1
  - @backstage/plugin-catalog-graph@0.3.2-next.1
  - @backstage/plugin-catalog-unprocessed-entities@0.1.6-next.1
  - @backstage/plugin-cloudbuild@0.3.28-next.1
  - @backstage/plugin-code-coverage@0.2.21-next.1
  - @backstage/plugin-cost-insights@0.12.17-next.1
  - @backstage/plugin-devtools@0.1.7-next.1
  - @backstage/plugin-dynatrace@8.0.2-next.1
  - @backstage/plugin-entity-feedback@0.2.11-next.1
  - @backstage/plugin-gcalendar@0.3.21-next.1
  - @backstage/plugin-gocd@0.1.34-next.1
  - @backstage/plugin-jenkins@0.9.3-next.1
  - @backstage/plugin-kafka@0.3.28-next.1
  - @backstage/plugin-kubernetes@0.11.3-next.1
  - @backstage/plugin-lighthouse@0.4.13-next.1
  - @backstage/plugin-linguist@0.1.13-next.1
  - @backstage/plugin-microsoft-calendar@0.1.10-next.1
  - @backstage/plugin-newrelic@0.3.43-next.1
  - @backstage/plugin-newrelic-dashboard@0.3.3-next.1
  - @backstage/plugin-octopus-deploy@0.2.10-next.1
  - @backstage/plugin-org@0.6.18-next.1
  - @backstage/plugin-playlist@0.2.2-next.1
  - @backstage/plugin-puppetdb@0.1.11-next.1
  - @backstage/plugin-rollbar@0.4.28-next.1
  - @backstage/plugin-sentry@0.5.13-next.1
  - @backstage/plugin-shortcuts@0.3.17-next.1
  - @backstage/plugin-stackstorm@0.1.9-next.1
  - @backstage/plugin-tech-insights@0.3.20-next.1
  - @backstage/plugin-techdocs-react@1.1.14-next.1
  - @backstage/plugin-todo@0.2.32-next.1
  - @backstage/plugin-permission-react@0.4.18-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/theme@0.5.0-next.0
  - @backstage/plugin-catalog-common@1.0.18
  - @backstage/plugin-linguist-common@0.1.2
  - @backstage/plugin-search-common@1.2.8

## app-next-example-plugin@0.0.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.4.0-next.1
  - @backstage/core-components@0.13.9-next.1

## example-backend@0.2.90-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend@0.20.1-next.1
  - @backstage/plugin-catalog-backend@1.15.1-next.1
  - @backstage/catalog-client@1.5.0-next.0
  - @backstage/plugin-azure-devops-backend@0.5.0-next.1
  - @backstage/plugin-kubernetes-backend@0.14.0-next.1
  - @backstage/integration@1.8.0-next.1
  - @backstage/plugin-azure-sites-backend@0.1.18-next.1
  - @backstage/backend-common@0.20.0-next.1
  - example-app@0.2.90-next.2
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/plugin-adr-backend@0.4.5-next.1
  - @backstage/plugin-app-backend@0.3.56-next.1
  - @backstage/plugin-auth-node@0.4.2-next.1
  - @backstage/plugin-badges-backend@0.3.5-next.1
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.5-next.1
  - @backstage/plugin-catalog-backend-module-unprocessed@0.3.5-next.1
  - @backstage/plugin-catalog-node@1.5.1-next.1
  - @backstage/plugin-code-coverage-backend@0.2.22-next.1
  - @backstage/plugin-devtools-backend@0.2.5-next.1
  - @backstage/plugin-entity-feedback-backend@0.2.5-next.1
  - @backstage/plugin-events-backend@0.2.17-next.1
  - @backstage/plugin-events-node@0.2.17-next.1
  - @backstage/plugin-explore-backend@0.0.18-next.1
  - @backstage/plugin-jenkins-backend@0.3.2-next.1
  - @backstage/plugin-kafka-backend@0.3.6-next.1
  - @backstage/plugin-lighthouse-backend@0.3.5-next.1
  - @backstage/plugin-linguist-backend@0.5.5-next.1
  - @backstage/plugin-nomad-backend@0.1.10-next.1
  - @backstage/plugin-permission-backend@0.5.31-next.1
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/plugin-permission-node@0.7.19-next.1
  - @backstage/plugin-playlist-backend@0.3.12-next.1
  - @backstage/plugin-proxy-backend@0.4.6-next.1
  - @backstage/plugin-rollbar-backend@0.1.53-next.1
  - @backstage/plugin-scaffolder-backend@1.19.2-next.1
  - @backstage/plugin-scaffolder-backend-module-confluence-to-markdown@0.2.9-next.1
  - @backstage/plugin-scaffolder-backend-module-rails@0.4.25-next.1
  - @backstage/plugin-search-backend@1.4.8-next.1
  - @backstage/plugin-search-backend-module-catalog@0.1.12-next.1
  - @backstage/plugin-search-backend-module-elasticsearch@1.3.11-next.1
  - @backstage/plugin-search-backend-module-explore@0.1.12-next.1
  - @backstage/plugin-search-backend-module-pg@0.5.17-next.1
  - @backstage/plugin-search-backend-module-techdocs@0.1.12-next.1
  - @backstage/plugin-search-backend-node@1.2.12-next.1
  - @backstage/plugin-search-common@1.2.8
  - @backstage/plugin-tech-insights-backend@0.5.22-next.1
  - @backstage/plugin-tech-insights-backend-module-jsonfc@0.1.40-next.1
  - @backstage/plugin-tech-insights-node@0.4.14-next.1
  - @backstage/plugin-techdocs-backend@1.9.1-next.1
  - @backstage/plugin-todo-backend@0.3.6-next.1

## example-backend-next@0.0.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend-module-backstage-openapi@0.1.1-next.1
  - @backstage/plugin-catalog-backend@1.15.1-next.1
  - @backstage/plugin-azure-devops-backend@0.5.0-next.1
  - @backstage/plugin-kubernetes-backend@0.14.0-next.1
  - @backstage/backend-defaults@0.2.8-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/plugin-adr-backend@0.4.5-next.1
  - @backstage/plugin-app-backend@0.3.56-next.1
  - @backstage/plugin-auth-node@0.4.2-next.1
  - @backstage/plugin-badges-backend@0.3.5-next.1
  - @backstage/plugin-catalog-backend-module-openapi@0.1.25-next.1
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.1.5-next.1
  - @backstage/plugin-catalog-backend-module-unprocessed@0.3.5-next.1
  - @backstage/plugin-devtools-backend@0.2.5-next.1
  - @backstage/plugin-entity-feedback-backend@0.2.5-next.1
  - @backstage/plugin-jenkins-backend@0.3.2-next.1
  - @backstage/plugin-lighthouse-backend@0.3.5-next.1
  - @backstage/plugin-linguist-backend@0.5.5-next.1
  - @backstage/plugin-nomad-backend@0.1.10-next.1
  - @backstage/plugin-permission-backend@0.5.31-next.1
  - @backstage/plugin-permission-backend-module-allow-all-policy@0.1.5-next.1
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/plugin-permission-node@0.7.19-next.1
  - @backstage/plugin-playlist-backend@0.3.12-next.1
  - @backstage/plugin-proxy-backend@0.4.6-next.1
  - @backstage/plugin-scaffolder-backend@1.19.2-next.1
  - @backstage/plugin-search-backend@1.4.8-next.1
  - @backstage/plugin-search-backend-module-catalog@0.1.12-next.1
  - @backstage/plugin-search-backend-module-explore@0.1.12-next.1
  - @backstage/plugin-search-backend-module-techdocs@0.1.12-next.1
  - @backstage/plugin-search-backend-node@1.2.12-next.1
  - @backstage/plugin-sonarqube-backend@0.2.10-next.1
  - @backstage/plugin-techdocs-backend@1.9.1-next.1
  - @backstage/plugin-todo-backend@0.3.6-next.1

## @backstage/backend-plugin-manager@0.0.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.15.1-next.1
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/backend-tasks@0.5.13-next.1
  - @backstage/cli-common@0.1.13
  - @backstage/cli-node@0.2.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.2-next.1
  - @backstage/plugin-events-backend@0.2.17-next.1
  - @backstage/plugin-events-node@0.2.17-next.1
  - @backstage/plugin-permission-common@0.7.10
  - @backstage/plugin-permission-node@0.7.19-next.1
  - @backstage/plugin-scaffolder-node@0.2.9-next.1
  - @backstage/plugin-search-backend-node@1.2.12-next.1
  - @backstage/plugin-search-common@1.2.8

## e2e-test@0.2.10-next.2

### Patch Changes

- Updated dependencies
  - @backstage/create-app@0.5.8-next.2
  - @backstage/cli-common@0.1.13
  - @backstage/errors@1.2.3

## techdocs-cli-embedded-app@0.2.89-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/cli@0.25.0-next.1
  - @backstage/plugin-catalog@1.16.0-next.2
  - @backstage/core-app-api@1.11.2-next.1
  - @backstage/test-utils@1.4.6-next.1
  - @backstage/plugin-techdocs@1.9.2-next.2
  - @backstage/app-defaults@1.4.6-next.1
  - @backstage/integration-react@1.1.22-next.1
  - @backstage/plugin-techdocs-react@1.1.14-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/theme@0.5.0-next.0

## @internal/plugin-todo-list@1.0.20-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/theme@0.5.0-next.0

## @internal/plugin-todo-list-backend@1.0.20-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-auth-node@0.4.2-next.1
