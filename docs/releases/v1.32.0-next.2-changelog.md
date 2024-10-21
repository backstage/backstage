# Release v1.32.0-next.2

Upgrade Helper: [https://backstage.github.io/upgrade-helper/?to=1.32.0-next.2](https://backstage.github.io/upgrade-helper/?to=1.32.0-next.2)

## @backstage/backend-openapi-utils@0.2.0-next.1

### Minor Changes

- 66af016: Improved support for OpenAPI validation during Jest tests. Now, OpenAPI validation can happen as you are writing your Jest tests - you no longer have to run `repo schema openapi test`.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## @backstage/theme@0.6.0-next.1

### Minor Changes

- e77ff3d: Adds support for custom background colors in code blocks and inline code within TechDocs.

## @backstage/plugin-auth-backend-module-vmware-cloud-provider@0.4.0-next.1

### Minor Changes

- d0edfec: **BREAKING**: The `profileEmailMatchingUserEntityEmail` sign-in resolver has been removed as it was using an insecure fallback for resolving user identities. See <https://backstage.io/docs/auth/identity-resolver#sign-in-without-users-in-the-catalog> for how to create a custom sign-in resolver if needed as a replacement.

### Patch Changes

- 217458a: Updated configuration schema to include the new `allowedDomains` option for the `emailLocalPartMatchingUserEntityName` sign-in resolver.
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0

## @backstage/plugin-catalog@1.24.0-next.2

### Minor Changes

- cec8e8c: Adding negation keyword for entity filtering

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.14.0-next.2
  - @backstage/catalog-client@1.7.1-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/core-compat-api@0.3.1-next.2
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/errors@1.2.4
  - @backstage/frontend-plugin-api@0.9.0-next.2
  - @backstage/integration-react@1.2.0-next.2
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-permission-react@0.4.27-next.1
  - @backstage/plugin-scaffolder-common@1.5.6
  - @backstage/plugin-search-common@1.2.14
  - @backstage/plugin-search-react@1.8.1-next.2

## @backstage/plugin-catalog-backend-module-bitbucket-cloud@0.4.0-next.2

### Minor Changes

- 6343c8d: Fixes the event-based updates at `BitbucketCloudEntityProvider`.

  Previously, this entity provider had optional event support for legacy backends
  that could be enabled by passing `catalogApi`, `events`, and `tokenManager`.

  For the new/current backend system, the `catalogModuleBitbucketCloudEntityProvider`
  (`catalog.bitbucket-cloud-entity-provider`), event support was enabled by default.

  A recent change removed `tokenManager` as a dependency from the module as well as removed it as input.
  While this didn't break the instantiation of the module, it broke the event-based updates,
  and led to a runtime misbehavior, accompanied by an info log message.

  This change will replace the use of `tokenManager` with the use of `auth` (`AuthService`).

  Additionally, to simplify, it will make `catalogApi` and `events` required dependencies.
  For the current backend system, this change is transparent and doesn't require any action.
  For the legacy backend system, this change will require you to pass those dependencies
  if you didn't do it already.

  BREAKING CHANGES:

  _(For legacy backend users only.)_

  Previously optional `catalogApi`, and `events` are required now.
  A new required dependency `auth` was added.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/integration@1.15.1-next.1
  - @backstage/catalog-client@1.7.1-next.0
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/plugin-bitbucket-cloud-common@0.2.24-next.1
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-events-node@0.4.1-next.1

## @backstage/plugin-catalog-react@1.14.0-next.2

### Minor Changes

- 0801db6: Add catalog service mocks under the `/testUtils` subpath export.

  You can now use e.g. `const catalog = catalogApiMock.mock()` in your test and then do assertions on `catalog.getEntities` without awkward type casting.

### Patch Changes

- Updated dependencies
  - @backstage/frontend-test-utils@0.2.1-next.2
  - @backstage/catalog-client@1.7.1-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/core-compat-api@0.3.1-next.2
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/errors@1.2.4
  - @backstage/frontend-plugin-api@0.9.0-next.2
  - @backstage/integration-react@1.2.0-next.2
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.10-next.0
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-permission-react@0.4.27-next.1

## @backstage/plugin-home@0.8.0-next.2

### Minor Changes

- 9893bb5: **BREAKING** Implement usage of unused `limit` query parameter in visits API `.list()` function

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.14.0-next.2
  - @backstage/theme@0.6.0-next.1
  - @backstage/catalog-client@1.7.1-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/core-app-api@1.15.1-next.1
  - @backstage/core-compat-api@0.3.1-next.2
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/frontend-plugin-api@0.9.0-next.2
  - @backstage/plugin-home-react@0.1.18-next.2

## @backstage/plugin-scaffolder-backend-module-gitlab@0.6.0-next.2

### Minor Changes

- 73f2ccf: declare correct type (number) for publish:gitlab output.projectId

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.15.1-next.1
  - @backstage/plugin-scaffolder-node@0.5.0-next.2
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## @backstage/plugin-techdocs@1.11.0-next.2

### Minor Changes

- e77ff3d: Adds support for custom background colors in code blocks and inline code within TechDocs.

### Patch Changes

- e918061: Add support for mkdocs material palette conditional hashes.
- 720a2f9: Updated dependency `git-url-parse` to `^15.0.0`.
- e8b4966: Use more of the available space for the navigation sidebar.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.14.0-next.2
  - @backstage/integration@1.15.1-next.1
  - @backstage/theme@0.6.0-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/core-compat-api@0.3.1-next.2
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/errors@1.2.4
  - @backstage/frontend-plugin-api@0.9.0-next.2
  - @backstage/integration-react@1.2.0-next.2
  - @backstage/plugin-auth-react@0.1.7-next.2
  - @backstage/plugin-search-common@1.2.14
  - @backstage/plugin-search-react@1.8.1-next.2
  - @backstage/plugin-techdocs-common@0.1.0
  - @backstage/plugin-techdocs-react@1.2.9-next.2

## @backstage/app-defaults@1.5.12-next.2

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.6.0-next.1
  - @backstage/core-app-api@1.15.1-next.1
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/plugin-permission-react@0.4.27-next.1

## @backstage/backend-app-api@1.0.1-next.1

### Patch Changes

- ffd1f4a: Plugin lifecycle shutdown hooks are now performed before root lifecycle shutdown hooks.
- fd6e6f4: build(deps): bump `cookie` from 0.6.0 to 0.7.0
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.9.1
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-node@0.8.4-next.1

## @backstage/backend-defaults@0.5.1-next.2

### Patch Changes

- ffd1f4a: Plugin lifecycle shutdown hooks are now performed before root lifecycle shutdown hooks.
- ffd1f4a: The database manager now attempts to close any database connections in a root lifecycle shutdown hook.
- e36d12f: The task scheduler now attempts to abort any tasks if it detects that Backstage is being shut down.
- fd6e6f4: build(deps): bump `cookie` from 0.6.0 to 0.7.0
- 720a2f9: Updated dependency `git-url-parse` to `^15.0.0`.
- Updated dependencies
  - @backstage/cli-node@0.2.9-next.0
  - @backstage/backend-app-api@1.0.1-next.1
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/integration@1.15.1-next.1
  - @backstage/backend-dev-utils@0.1.5
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.9.1
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.4.1-next.1
  - @backstage/plugin-permission-node@0.8.4-next.1

## @backstage/backend-dynamic-feature-service@0.4.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.2.9-next.0
  - @backstage/backend-app-api@1.0.1-next.1
  - @backstage/backend-defaults@0.5.1-next.2
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/plugin-catalog-backend@1.26.2-next.2
  - @backstage/plugin-scaffolder-node@0.5.0-next.2
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.9.1
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-app-node@0.1.26-next.1
  - @backstage/plugin-events-backend@0.3.13-next.1
  - @backstage/plugin-events-node@0.4.1-next.1
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-permission-node@0.8.4-next.1
  - @backstage/plugin-search-backend-node@1.3.3-next.2
  - @backstage/plugin-search-common@1.2.14

## @backstage/backend-plugin-api@1.0.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.8.1

## @backstage/backend-test-utils@1.0.1-next.2

### Patch Changes

- fd6e6f4: build(deps): bump `cookie` from 0.6.0 to 0.7.0
- Updated dependencies
  - @backstage/backend-app-api@1.0.1-next.1
  - @backstage/backend-defaults@0.5.1-next.2
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.4.1-next.1

## @backstage/catalog-client@1.7.1-next.0

### Patch Changes

- 0040632: Add missing doc string to API
- Updated dependencies
  - @backstage/catalog-model@1.7.0
  - @backstage/errors@1.2.4

## @backstage/cli@0.28.0-next.2

### Patch Changes

- ea16633: Preserve directory structure for CommonJS build output, just like ESM. This makes the build output more stable and easier to browse, and allows for more effective tree shaking and lazy imports.

- 7955f9b: Tweaked the new package feature detection to not be active when building backend packages.

- 720a2f9: Updated dependency `git-url-parse` to `^15.0.0`.

- 2c5ecf5: Support `--max-warnings` flag for package linting

- 8fe740d: Added a new `--successCache` option to the `backstage-cli repo test` and `backstage-cli repo lint` commands. The cache keeps track of successful runs and avoids re-running for individual packages if they haven't changed. This option is intended only to be used in CI.

  In addition a `--successCacheDir <path>` option has also been added to be able to override the default cache directory.

- f0514c7: Disabled parsing of input source maps in the SWC transform for Jest.

- Updated dependencies
  - @backstage/cli-node@0.2.9-next.0
  - @backstage/eslint-plugin@0.1.10-next.1
  - @backstage/integration@1.15.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.9.1
  - @backstage/errors@1.2.4
  - @backstage/release-manifests@0.0.11
  - @backstage/types@1.1.1

## @backstage/cli-node@0.2.9-next.0

### Patch Changes

- fec7278: Added new `lockfile.getDependencyTreeHash(name)` utility.
- Updated dependencies
  - @backstage/cli-common@0.1.14
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## @backstage/core-compat-api@0.3.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/frontend-plugin-api@0.9.0-next.2
  - @backstage/version-bridge@1.0.10-next.0

## @backstage/core-components@0.15.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.6.0-next.1
  - @backstage/config@1.2.0
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/errors@1.2.4
  - @backstage/version-bridge@1.0.10-next.0

## @backstage/create-app@0.5.21-next.2

### Patch Changes

- Bumped create-app version.
- Updated dependencies
  - @backstage/cli-common@0.1.14

## @backstage/dev-utils@1.1.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.14.0-next.2
  - @backstage/theme@0.6.0-next.1
  - @backstage/app-defaults@1.5.12-next.2
  - @backstage/catalog-model@1.7.0
  - @backstage/core-app-api@1.15.1-next.1
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/integration-react@1.2.0-next.2

## @backstage/eslint-plugin@0.1.10-next.1

### Patch Changes

- b1c2a2d: Exclude `@material-ui/data-grid`

## @backstage/frontend-app-api@0.10.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0
  - @backstage/core-app-api@1.15.1-next.1
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/errors@1.2.4
  - @backstage/frontend-defaults@0.1.1-next.2
  - @backstage/frontend-plugin-api@0.9.0-next.2
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.10-next.0

## @backstage/frontend-defaults@0.1.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/frontend-app-api@0.10.0-next.2
  - @backstage/frontend-plugin-api@0.9.0-next.2
  - @backstage/plugin-app@0.1.1-next.2

## @backstage/frontend-plugin-api@0.9.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.10-next.0

## @backstage/frontend-test-utils@0.2.1-next.2

### Patch Changes

- 0801db6: Added an `ApiMock`, analogous to `ServiceMock` from the backend test utils.
- Updated dependencies
  - @backstage/config@1.2.0
  - @backstage/frontend-app-api@0.10.0-next.2
  - @backstage/frontend-plugin-api@0.9.0-next.2
  - @backstage/test-utils@1.6.1-next.2
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.10-next.0
  - @backstage/plugin-app@0.1.1-next.2

## @backstage/integration@1.15.1-next.1

### Patch Changes

- 720a2f9: Updated dependency `git-url-parse` to `^15.0.0`.
- Updated dependencies
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## @backstage/integration-react@1.2.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.15.1-next.1
  - @backstage/config@1.2.0
  - @backstage/core-plugin-api@1.10.0-next.1

## @backstage/repo-tools@0.10.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.2.9-next.0
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/cli-common@0.1.14
  - @backstage/config-loader@1.9.1
  - @backstage/errors@1.2.4

## @techdocs/cli@1.8.20-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.5.1-next.2
  - @backstage/plugin-techdocs-node@1.12.12-next.2
  - @backstage/catalog-model@1.7.0
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0

## @backstage/test-utils@1.6.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.6.0-next.1
  - @backstage/config@1.2.0
  - @backstage/core-app-api@1.15.1-next.1
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-permission-react@0.4.27-next.1

## @backstage/plugin-api-docs@0.11.11-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog@1.24.0-next.2
  - @backstage/plugin-catalog-react@1.14.0-next.2
  - @backstage/catalog-model@1.7.0
  - @backstage/core-compat-api@0.3.1-next.2
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/frontend-plugin-api@0.9.0-next.2
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-permission-react@0.4.27-next.1

## @backstage/plugin-app@0.1.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.6.0-next.1
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/frontend-plugin-api@0.9.0-next.2
  - @backstage/plugin-permission-react@0.4.27-next.1

## @backstage/plugin-app-backend@0.3.76-next.1

### Patch Changes

- 2c4ee26: Fixed unexpected behaviour where configuration supplied with `APP_CONFIG_*` environment variables where not filtered by the configuration schema.
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.9.1
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-app-node@0.1.26-next.1

## @backstage/plugin-app-node@0.1.26-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config-loader@1.9.1

## @backstage/plugin-app-visualizer@0.1.11-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/frontend-plugin-api@0.9.0-next.2

## @backstage/plugin-auth-backend@0.23.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-backend-module-cloudflare-access-provider@0.3.1-next.1
  - @backstage/plugin-auth-backend-module-atlassian-provider@0.3.1-next.1
  - @backstage/plugin-auth-backend-module-bitbucket-provider@0.2.1-next.1
  - @backstage/plugin-auth-backend-module-microsoft-provider@0.2.1-next.1
  - @backstage/plugin-auth-backend-module-onelogin-provider@0.2.1-next.1
  - @backstage/plugin-auth-backend-module-aws-alb-provider@0.2.1-next.1
  - @backstage/plugin-auth-backend-module-gcp-iap-provider@0.3.1-next.1
  - @backstage/plugin-auth-backend-module-github-provider@0.2.1-next.1
  - @backstage/plugin-auth-backend-module-gitlab-provider@0.2.1-next.1
  - @backstage/plugin-auth-backend-module-google-provider@0.2.1-next.1
  - @backstage/plugin-auth-backend-module-oauth2-provider@0.3.1-next.1
  - @backstage/plugin-auth-backend-module-oidc-provider@0.3.1-next.1
  - @backstage/plugin-auth-backend-module-okta-provider@0.1.1-next.1
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/catalog-client@1.7.1-next.0
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-backend-module-auth0-provider@0.1.1-next.1
  - @backstage/plugin-auth-backend-module-azure-easyauth-provider@0.2.1-next.1
  - @backstage/plugin-auth-backend-module-bitbucket-server-provider@0.1.1-next.1
  - @backstage/plugin-auth-backend-module-oauth2-proxy-provider@0.2.1-next.1

## @backstage/plugin-auth-backend-module-atlassian-provider@0.3.1-next.1

### Patch Changes

- 217458a: Updated configuration schema to include the new `allowedDomains` option for the `emailLocalPartMatchingUserEntityName` sign-in resolver.
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1

## @backstage/plugin-auth-backend-module-auth0-provider@0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1

## @backstage/plugin-auth-backend-module-aws-alb-provider@0.2.1-next.1

### Patch Changes

- 217458a: Updated configuration schema to include the new `allowedDomains` option for the `emailLocalPartMatchingUserEntityName` sign-in resolver.
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/errors@1.2.4
  - @backstage/plugin-auth-backend@0.23.1-next.1

## @backstage/plugin-auth-backend-module-azure-easyauth-provider@0.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/errors@1.2.4

## @backstage/plugin-auth-backend-module-bitbucket-provider@0.2.1-next.1

### Patch Changes

- 217458a: Updated configuration schema to include the new `allowedDomains` option for the `emailLocalPartMatchingUserEntityName` sign-in resolver.
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1

## @backstage/plugin-auth-backend-module-bitbucket-server-provider@0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1

## @backstage/plugin-auth-backend-module-cloudflare-access-provider@0.3.1-next.1

### Patch Changes

- 217458a: Updated configuration schema to include the new `allowedDomains` option for the `emailLocalPartMatchingUserEntityName` sign-in resolver.
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## @backstage/plugin-auth-backend-module-gcp-iap-provider@0.3.1-next.1

### Patch Changes

- 217458a: Updated configuration schema to include the new `allowedDomains` option for the `emailLocalPartMatchingUserEntityName` sign-in resolver.
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## @backstage/plugin-auth-backend-module-github-provider@0.2.1-next.1

### Patch Changes

- 217458a: Updated configuration schema to include the new `allowedDomains` option for the `emailLocalPartMatchingUserEntityName` sign-in resolver.
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1

## @backstage/plugin-auth-backend-module-gitlab-provider@0.2.1-next.1

### Patch Changes

- 217458a: Updated configuration schema to include the new `allowedDomains` option for the `emailLocalPartMatchingUserEntityName` sign-in resolver.
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1

## @backstage/plugin-auth-backend-module-google-provider@0.2.1-next.1

### Patch Changes

- 217458a: Updated configuration schema to include the new `allowedDomains` option for the `emailLocalPartMatchingUserEntityName` sign-in resolver.
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1

## @backstage/plugin-auth-backend-module-guest-provider@0.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/errors@1.2.4

## @backstage/plugin-auth-backend-module-microsoft-provider@0.2.1-next.1

### Patch Changes

- 217458a: Updated configuration schema to include the new `allowedDomains` option for the `emailLocalPartMatchingUserEntityName` sign-in resolver.
- daa02d6: Add `skipUserProfile` config flag to Microsoft authenticator
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1

## @backstage/plugin-auth-backend-module-oauth2-provider@0.3.1-next.1

### Patch Changes

- 217458a: Updated configuration schema to include the new `allowedDomains` option for the `emailLocalPartMatchingUserEntityName` sign-in resolver.
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1

## @backstage/plugin-auth-backend-module-oauth2-proxy-provider@0.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/errors@1.2.4

## @backstage/plugin-auth-backend-module-oidc-provider@0.3.1-next.1

### Patch Changes

- 217458a: Updated configuration schema to include the new `allowedDomains` option for the `emailLocalPartMatchingUserEntityName` sign-in resolver.
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/plugin-auth-backend@0.23.1-next.1

## @backstage/plugin-auth-backend-module-okta-provider@0.1.1-next.1

### Patch Changes

- 217458a: Updated configuration schema to include the new `allowedDomains` option for the `emailLocalPartMatchingUserEntityName` sign-in resolver.
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1

## @backstage/plugin-auth-backend-module-onelogin-provider@0.2.1-next.1

### Patch Changes

- 217458a: Updated configuration schema to include the new `allowedDomains` option for the `emailLocalPartMatchingUserEntityName` sign-in resolver.
- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1

## @backstage/plugin-auth-backend-module-pinniped-provider@0.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0

## @backstage/plugin-auth-node@0.5.3-next.1

### Patch Changes

- 217458a: Added a new `allowedDomains` option for the common `emailLocalPartMatchingUserEntityName` sign-in resolver.
- Updated dependencies
  - @backstage/catalog-client@1.7.1-next.0
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## @backstage/plugin-auth-react@0.1.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/errors@1.2.4

## @backstage/plugin-bitbucket-cloud-common@0.2.24-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.15.1-next.1

## @backstage/plugin-catalog-backend@1.26.2-next.2

### Patch Changes

- 720a2f9: Updated dependency `git-url-parse` to `^15.0.0`.
- f1cab41: Update catalog search table in transaction
- Updated dependencies
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/integration@1.15.1-next.1
  - @backstage/backend-openapi-utils@0.2.0-next.1
  - @backstage/catalog-client@1.7.1-next.0
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-events-node@0.4.1-next.1
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-permission-node@0.8.4-next.1
  - @backstage/plugin-search-backend-module-catalog@0.2.3-next.2

## @backstage/plugin-catalog-backend-module-aws@0.4.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.5.1-next.2
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/integration@1.15.1-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-kubernetes-common@0.8.3

## @backstage/plugin-catalog-backend-module-azure@0.2.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/integration@1.15.1-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.1.0

## @backstage/plugin-catalog-backend-module-backstage-openapi@0.4.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/backend-openapi-utils@0.2.0-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## @backstage/plugin-catalog-backend-module-bitbucket-server@0.2.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/integration@1.15.1-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## @backstage/plugin-catalog-backend-module-gcp@0.3.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/plugin-kubernetes-common@0.8.3

## @backstage/plugin-catalog-backend-module-gerrit@0.2.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/integration@1.15.1-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## @backstage/plugin-catalog-backend-module-github@0.7.5-next.2

### Patch Changes

- 720a2f9: Updated dependency `git-url-parse` to `^15.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/integration@1.15.1-next.1
  - @backstage/plugin-catalog-backend@1.26.2-next.2
  - @backstage/catalog-client@1.7.1-next.0
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-events-node@0.4.1-next.1

## @backstage/plugin-catalog-backend-module-github-org@0.3.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/plugin-catalog-backend-module-github@0.7.5-next.2
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/plugin-events-node@0.4.1-next.1

## @backstage/plugin-catalog-backend-module-gitlab@0.4.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.5.1-next.2
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/integration@1.15.1-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-events-node@0.4.1-next.1

## @backstage/plugin-catalog-backend-module-gitlab-org@0.2.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/plugin-catalog-backend-module-gitlab@0.4.3-next.2
  - @backstage/plugin-events-node@0.4.1-next.1

## @backstage/plugin-catalog-backend-module-incremental-ingestion@0.5.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/plugin-catalog-backend@1.26.2-next.2
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-events-node@0.4.1-next.1
  - @backstage/plugin-permission-common@0.8.1

## @backstage/plugin-catalog-backend-module-ldap@0.9.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.1.0

## @backstage/plugin-catalog-backend-module-logs@0.1.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.26.2-next.2
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/plugin-events-node@0.4.1-next.1

## @backstage/plugin-catalog-backend-module-msgraph@0.6.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.1.0

## @backstage/plugin-catalog-backend-module-openapi@0.2.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/integration@1.15.1-next.1
  - @backstage/plugin-catalog-backend@1.26.2-next.2
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.1.0

## @backstage/plugin-catalog-backend-module-puppetdb@0.2.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-scaffolder-common@1.5.6

## @backstage/plugin-catalog-backend-module-unprocessed@0.5.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-catalog-unprocessed-entities-common@0.0.4
  - @backstage/plugin-permission-common@0.8.1

## @backstage/plugin-catalog-graph@0.4.11-next.2

### Patch Changes

- 4d9f39e: Added InfoCard `action` attribute for CatalogGraphCard

  ```tsx
  const action = <Button title="Action Button" onClick={handleClickEvent()} />
  <CatalogGraphCard action={action} />
  ```

- Updated dependencies
  - @backstage/plugin-catalog-react@1.14.0-next.2
  - @backstage/catalog-client@1.7.1-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/core-compat-api@0.3.1-next.2
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/frontend-plugin-api@0.9.0-next.2
  - @backstage/types@1.1.1

## @backstage/plugin-catalog-import@0.12.5-next.2

### Patch Changes

- 720a2f9: Updated dependency `git-url-parse` to `^15.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.14.0-next.2
  - @backstage/integration@1.15.1-next.1
  - @backstage/catalog-client@1.7.1-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/core-compat-api@0.3.1-next.2
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/errors@1.2.4
  - @backstage/frontend-plugin-api@0.9.0-next.2
  - @backstage/integration-react@1.2.0-next.2
  - @backstage/plugin-catalog-common@1.1.0

## @backstage/plugin-catalog-node@1.13.1-next.1

### Patch Changes

- 0801db6: Documentation for the `testUtils` named export
- Updated dependencies
  - @backstage/catalog-client@1.7.1-next.0
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-permission-node@0.8.4-next.1

## @backstage/plugin-catalog-unprocessed-entities@0.2.9-next.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.7.0
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/errors@1.2.4

## @backstage/plugin-config-schema@0.1.60-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## @backstage/plugin-devtools@0.1.19-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-compat-api@0.3.1-next.2
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/errors@1.2.4
  - @backstage/frontend-plugin-api@0.9.0-next.2
  - @backstage/plugin-devtools-common@0.1.12
  - @backstage/plugin-permission-react@0.4.27-next.1

## @backstage/plugin-devtools-backend@0.4.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/cli-common@0.1.14
  - @backstage/config@1.2.0
  - @backstage/config-loader@1.9.1
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-devtools-common@0.1.12
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-permission-node@0.8.4-next.1

## @backstage/plugin-events-backend@0.3.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-openapi-utils@0.2.0-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.4.1-next.1

## @backstage/plugin-events-backend-module-aws-sqs@0.4.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.4.1-next.1

## @backstage/plugin-events-backend-module-azure@0.2.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/plugin-events-node@0.4.1-next.1

## @backstage/plugin-events-backend-module-bitbucket-cloud@0.2.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/plugin-events-node@0.4.1-next.1

## @backstage/plugin-events-backend-module-gerrit@0.2.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/plugin-events-node@0.4.1-next.1

## @backstage/plugin-events-backend-module-github@0.2.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/plugin-events-node@0.4.1-next.1

## @backstage/plugin-events-backend-module-gitlab@0.2.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/plugin-events-node@0.4.1-next.1

## @backstage/plugin-events-backend-test-utils@0.1.36-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-events-node@0.4.1-next.1

## @backstage/plugin-events-node@0.4.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## @backstage/plugin-home-react@0.1.18-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1

## @backstage/plugin-kubernetes@0.11.16-next.2

### Patch Changes

- 276cd3d: Updated dependency `@kubernetes-models/apimachinery` to `^2.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.14.0-next.2
  - @backstage/plugin-kubernetes-react@0.4.4-next.2
  - @backstage/catalog-model@1.7.0
  - @backstage/core-compat-api@0.3.1-next.2
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/frontend-plugin-api@0.9.0-next.2
  - @backstage/plugin-kubernetes-common@0.8.3

## @backstage/plugin-kubernetes-backend@0.18.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/catalog-client@1.7.1-next.0
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.8.3
  - @backstage/plugin-kubernetes-node@0.1.20-next.1
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-permission-node@0.8.4-next.1

## @backstage/plugin-kubernetes-cluster@0.0.17-next.2

### Patch Changes

- 276cd3d: Updated dependency `@kubernetes-models/apimachinery` to `^2.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.14.0-next.2
  - @backstage/plugin-kubernetes-react@0.4.4-next.2
  - @backstage/catalog-model@1.7.0
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/plugin-kubernetes-common@0.8.3

## @backstage/plugin-kubernetes-node@0.1.20-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.8.3

## @backstage/plugin-kubernetes-react@0.4.4-next.2

### Patch Changes

- 276cd3d: Updated dependency `@kubernetes-models/apimachinery` to `^2.0.0`.
- Updated dependencies
  - @backstage/catalog-model@1.7.0
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-kubernetes-common@0.8.3

## @backstage/plugin-notifications@0.3.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.6.0-next.1
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-notifications-common@0.0.5
  - @backstage/plugin-signals-react@0.0.6-next.1

## @backstage/plugin-notifications-backend@0.4.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/catalog-client@1.7.1-next.0
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-events-node@0.4.1-next.1
  - @backstage/plugin-notifications-common@0.0.5
  - @backstage/plugin-notifications-node@0.2.7-next.1
  - @backstage/plugin-signals-node@0.1.12-next.1

## @backstage/plugin-notifications-backend-module-email@0.3.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/catalog-client@1.7.1-next.0
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/types@1.1.1
  - @backstage/plugin-notifications-common@0.0.5
  - @backstage/plugin-notifications-node@0.2.7-next.1

## @backstage/plugin-notifications-node@0.2.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.7.1-next.0
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/plugin-notifications-common@0.0.5
  - @backstage/plugin-signals-node@0.1.12-next.1

## @backstage/plugin-org@0.6.31-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.14.0-next.2
  - @backstage/catalog-model@1.7.0
  - @backstage/core-compat-api@0.3.1-next.2
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/frontend-plugin-api@0.9.0-next.2
  - @backstage/plugin-catalog-common@1.1.0

## @backstage/plugin-org-react@0.1.30-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.14.0-next.2
  - @backstage/catalog-client@1.7.1-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1

## @backstage/plugin-permission-backend@0.5.50-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-permission-node@0.8.4-next.1

## @backstage/plugin-permission-backend-module-allow-all-policy@0.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-permission-node@0.8.4-next.1

## @backstage/plugin-permission-node@0.8.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.8.1

## @backstage/plugin-proxy-backend@0.5.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## @backstage/plugin-scaffolder@1.26.0-next.2

### Patch Changes

- e6bbfce: Add tests for the `TemplateEditorToolbarTemplatesMenu` component.
- 4e9702e: Add tests for the new pages header navigation.
- f989c47: Add translation to the editor toolbar component.
- d4cafc8: Standardize template editor pages desktop and mobile layouts.
- 720a2f9: Updated dependency `git-url-parse` to `^15.0.0`.
- 01ffa58: Add tests for the `useTemplateDirectory` hook.
- 3ac4766: Add an actions filter on the list actions page and drawer.
- c18d925: Add tests for the `TemplateEditorToolbarFilesMenu` component.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.14.0-next.2
  - @backstage/integration@1.15.1-next.1
  - @backstage/catalog-client@1.7.1-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/core-compat-api@0.3.1-next.2
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/errors@1.2.4
  - @backstage/frontend-plugin-api@0.9.0-next.2
  - @backstage/integration-react@1.2.0-next.2
  - @backstage/types@1.1.1
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-permission-react@0.4.27-next.1
  - @backstage/plugin-scaffolder-common@1.5.6
  - @backstage/plugin-scaffolder-react@1.13.0-next.2

## @backstage/plugin-scaffolder-backend@1.26.0-next.2

### Patch Changes

- f1f0076: handle step.if: false
- Updated dependencies
  - @backstage/plugin-scaffolder-backend-module-github@0.5.1-next.2
  - @backstage/backend-defaults@0.5.1-next.2
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.1-next.2
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.6.0-next.2
  - @backstage/integration@1.15.1-next.1
  - @backstage/plugin-scaffolder-backend-module-azure@0.2.1-next.2
  - @backstage/catalog-client@1.7.1-next.0
  - @backstage/plugin-scaffolder-node@0.5.0-next.2
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-bitbucket-cloud-common@0.2.24-next.1
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.1-next.1
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-permission-node@0.8.4-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.1-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.1-next.2
  - @backstage/plugin-scaffolder-backend-module-gerrit@0.2.1-next.2
  - @backstage/plugin-scaffolder-backend-module-gitea@0.2.1-next.2
  - @backstage/plugin-scaffolder-common@1.5.6

## @backstage/plugin-scaffolder-backend-module-azure@0.2.1-next.2

### Patch Changes

- b06aa48: Updated dependency `azure-devops-node-api` to `^14.0.0`.
- Updated dependencies
  - @backstage/integration@1.15.1-next.1
  - @backstage/plugin-scaffolder-node@0.5.0-next.2
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## @backstage/plugin-scaffolder-backend-module-bitbucket@0.3.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.1-next.2
  - @backstage/integration@1.15.1-next.1
  - @backstage/plugin-scaffolder-node@0.5.0-next.2
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.1-next.2

## @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.2.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.15.1-next.1
  - @backstage/plugin-scaffolder-node@0.5.0-next.2
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-bitbucket-cloud-common@0.2.24-next.1

## @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.2.1-next.2

### Patch Changes

- db54c57: Add `reviewers` input parameter to `publish:bitbucketServer:pull-request`
- Updated dependencies
  - @backstage/integration@1.15.1-next.1
  - @backstage/plugin-scaffolder-node@0.5.0-next.2
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## @backstage/plugin-scaffolder-backend-module-confluence-to-markdown@0.3.1-next.2

### Patch Changes

- 720a2f9: Updated dependency `git-url-parse` to `^15.0.0`.
- Updated dependencies
  - @backstage/integration@1.15.1-next.1
  - @backstage/plugin-scaffolder-node@0.5.0-next.2
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## @backstage/plugin-scaffolder-backend-module-cookiecutter@0.3.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.5.1-next.2
  - @backstage/integration@1.15.1-next.1
  - @backstage/plugin-scaffolder-node@0.5.0-next.2
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## @backstage/plugin-scaffolder-backend-module-gcp@0.2.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.15.1-next.1
  - @backstage/plugin-scaffolder-node@0.5.0-next.2
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## @backstage/plugin-scaffolder-backend-module-gerrit@0.2.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.15.1-next.1
  - @backstage/plugin-scaffolder-node@0.5.0-next.2
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## @backstage/plugin-scaffolder-backend-module-gitea@0.2.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.15.1-next.1
  - @backstage/plugin-scaffolder-node@0.5.0-next.2
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## @backstage/plugin-scaffolder-backend-module-github@0.5.1-next.2

### Patch Changes

- 8ce0c4c: Add `github:branch-protection:create` scaffolder action to set branch protection on an existing repository. Example usage:

  ```yaml
  - id: set-branch-protection
    name: Set Branch Protection
    action: github:branch-protection:create
    input:
      repoUrl: 'github.com?repo=backstage&owner=backstage'
      branch: master
      enforceAdmins: true # default
      requiredApprovingReviewCount: 1 # default
      requireBranchesToBeUpToDate: true # default
      requireCodeOwnerReviews: true
      dismissStaleReviews: true
      requiredConversationResolution: true
  ```

- Updated dependencies
  - @backstage/integration@1.15.1-next.1
  - @backstage/catalog-client@1.7.1-next.0
  - @backstage/plugin-scaffolder-node@0.5.0-next.2
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## @backstage/plugin-scaffolder-backend-module-notifications@0.1.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.5.0-next.2
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/plugin-notifications-common@0.0.5
  - @backstage/plugin-notifications-node@0.2.7-next.1

## @backstage/plugin-scaffolder-backend-module-rails@0.5.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.15.1-next.1
  - @backstage/plugin-scaffolder-node@0.5.0-next.2
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## @backstage/plugin-scaffolder-backend-module-sentry@0.2.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.5.0-next.2
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## @backstage/plugin-scaffolder-backend-module-yeoman@0.4.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.5.0-next.2
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/types@1.1.1
  - @backstage/plugin-scaffolder-node-test-utils@0.1.13-next.2

## @backstage/plugin-scaffolder-node@0.5.0-next.2

### Patch Changes

- d7a736c: Use `branch` function instead of `checkout` function when creating branch
- Updated dependencies
  - @backstage/integration@1.15.1-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-scaffolder-common@1.5.6

## @backstage/plugin-scaffolder-node-test-utils@0.1.13-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-test-utils@1.0.1-next.2
  - @backstage/plugin-scaffolder-node@0.5.0-next.2
  - @backstage/types@1.1.1

## @backstage/plugin-scaffolder-react@1.13.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.14.0-next.2
  - @backstage/theme@0.6.0-next.1
  - @backstage/catalog-client@1.7.1-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/frontend-plugin-api@0.9.0-next.2
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.10-next.0
  - @backstage/plugin-permission-react@0.4.27-next.1
  - @backstage/plugin-scaffolder-common@1.5.6

## @backstage/plugin-search@1.4.18-next.2

### Patch Changes

- 88d03d8: Updated the default SearchType.Accordion behavior to remain open after result type selection. This is a UX improvement to reduce the number of clicks needed when toggling result type filters.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.14.0-next.2
  - @backstage/core-compat-api@0.3.1-next.2
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/errors@1.2.4
  - @backstage/frontend-plugin-api@0.9.0-next.2
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.10-next.0
  - @backstage/plugin-search-common@1.2.14
  - @backstage/plugin-search-react@1.8.1-next.2

## @backstage/plugin-search-backend@1.5.18-next.2

### Patch Changes

- 66af016: Fix to schema to allow arbitrary query parameters.
- Updated dependencies
  - @backstage/backend-defaults@0.5.1-next.2
  - @backstage/backend-openapi-utils@0.2.0-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-permission-node@0.8.4-next.1
  - @backstage/plugin-search-backend-node@1.3.3-next.2
  - @backstage/plugin-search-common@1.2.14

## @backstage/plugin-search-backend-module-catalog@0.2.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/catalog-client@1.7.1-next.0
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-search-backend-node@1.3.3-next.2
  - @backstage/plugin-search-common@1.2.14

## @backstage/plugin-search-backend-module-elasticsearch@1.5.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/integration-aws-node@0.1.12
  - @backstage/plugin-search-backend-node@1.3.3-next.2
  - @backstage/plugin-search-common@1.2.14

## @backstage/plugin-search-backend-module-explore@0.2.3-next.2

### Patch Changes

- c052931: Updated dependency `@backstage-community/plugin-explore-common` to `^0.0.6`.
- Updated dependencies
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/plugin-search-backend-node@1.3.3-next.2
  - @backstage/plugin-search-common@1.2.14

## @backstage/plugin-search-backend-module-pg@0.5.36-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/plugin-search-backend-node@1.3.3-next.2
  - @backstage/plugin-search-common@1.2.14

## @backstage/plugin-search-backend-module-stack-overflow-collator@0.3.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/plugin-search-backend-node@1.3.3-next.2
  - @backstage/plugin-search-common@1.2.14

## @backstage/plugin-search-backend-module-techdocs@0.2.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/plugin-techdocs-node@1.12.12-next.2
  - @backstage/catalog-client@1.7.1-next.0
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-search-backend-node@1.3.3-next.2
  - @backstage/plugin-search-common@1.2.14

## @backstage/plugin-search-backend-node@1.3.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.5.1-next.2
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-search-common@1.2.14

## @backstage/plugin-search-react@1.8.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.6.0-next.1
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/frontend-plugin-api@0.9.0-next.2
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.10-next.0
  - @backstage/plugin-search-common@1.2.14

## @backstage/plugin-signals@0.0.11-next.2

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.6.0-next.1
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/types@1.1.1
  - @backstage/plugin-signals-react@0.0.6-next.1

## @backstage/plugin-signals-backend@0.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.4.1-next.1
  - @backstage/plugin-signals-node@0.1.12-next.1

## @backstage/plugin-signals-node@0.1.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1
  - @backstage/plugin-events-node@0.4.1-next.1

## @backstage/plugin-techdocs-addons-test-utils@1.0.40-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog@1.24.0-next.2
  - @backstage/plugin-catalog-react@1.14.0-next.2
  - @backstage/plugin-techdocs@1.11.0-next.2
  - @backstage/core-app-api@1.15.1-next.1
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/integration-react@1.2.0-next.2
  - @backstage/test-utils@1.6.1-next.2
  - @backstage/plugin-search-react@1.8.1-next.2
  - @backstage/plugin-techdocs-react@1.2.9-next.2

## @backstage/plugin-techdocs-backend@1.10.14-next.2

### Patch Changes

- fbdc631: Allow to pass StorageOptions to GCS Publisher
- Updated dependencies
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/plugin-techdocs-node@1.12.12-next.2
  - @backstage/integration@1.15.1-next.1
  - @backstage/catalog-client@1.7.1-next.0
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-search-backend-module-techdocs@0.2.3-next.2
  - @backstage/plugin-techdocs-common@0.1.0

## @backstage/plugin-techdocs-module-addons-contrib@1.1.16-next.2

### Patch Changes

- 720a2f9: Updated dependency `git-url-parse` to `^15.0.0`.
- e8b4966: Use more of the available space for the navigation sidebar.
- Updated dependencies
  - @backstage/integration@1.15.1-next.1
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/integration-react@1.2.0-next.2
  - @backstage/plugin-techdocs-react@1.2.9-next.2

## @backstage/plugin-techdocs-node@1.12.12-next.2

### Patch Changes

- 7774828: Updated dependency `@smithy/node-http-handler` to `^3.0.0`.
- 720a2f9: Updated dependency `git-url-parse` to `^15.0.0`.
- fbdc631: Allow to pass StorageOptions to GCS Publisher
- Updated dependencies
  - @backstage/integration@1.15.1-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration-aws-node@0.1.12
  - @backstage/plugin-search-common@1.2.14
  - @backstage/plugin-techdocs-common@0.1.0

## @backstage/plugin-techdocs-react@1.2.9-next.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/version-bridge@1.0.10-next.0

## @backstage/plugin-user-settings@0.8.14-next.2

### Patch Changes

- 0040632: `useUserProfile` will now use the user's picture stored in the catalog as a fallback if the identity provider doesn't return a picture.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.14.0-next.2
  - @backstage/theme@0.6.0-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/core-app-api@1.15.1-next.1
  - @backstage/core-compat-api@0.3.1-next.2
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/errors@1.2.4
  - @backstage/frontend-plugin-api@0.9.0-next.2
  - @backstage/types@1.1.1
  - @backstage/plugin-signals-react@0.0.6-next.1
  - @backstage/plugin-user-settings-common@0.0.1

## @backstage/plugin-user-settings-backend@0.2.25-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.5.1-next.2
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-signals-node@0.1.12-next.1
  - @backstage/plugin-user-settings-common@0.0.1

## example-app@0.2.102-next.2

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.28.0-next.2
  - @backstage/plugin-scaffolder@1.26.0-next.2
  - @backstage/plugin-catalog@1.24.0-next.2
  - @backstage/plugin-catalog-react@1.14.0-next.2
  - @backstage/plugin-home@0.8.0-next.2
  - @backstage/plugin-techdocs@1.11.0-next.2
  - @backstage/plugin-catalog-import@0.12.5-next.2
  - @backstage/plugin-techdocs-module-addons-contrib@1.1.16-next.2
  - @backstage/plugin-kubernetes-cluster@0.0.17-next.2
  - @backstage/plugin-kubernetes@0.11.16-next.2
  - @backstage/plugin-search@1.4.18-next.2
  - @backstage/plugin-user-settings@0.8.14-next.2
  - @backstage/theme@0.6.0-next.1
  - @backstage/plugin-catalog-graph@0.4.11-next.2
  - @backstage/app-defaults@1.5.12-next.2
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/core-app-api@1.15.1-next.1
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/frontend-app-api@0.10.0-next.2
  - @backstage/integration-react@1.2.0-next.2
  - @backstage/plugin-api-docs@0.11.11-next.2
  - @backstage/plugin-auth-react@0.1.7-next.2
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-catalog-unprocessed-entities@0.2.9-next.2
  - @backstage/plugin-devtools@0.1.19-next.2
  - @backstage/plugin-notifications@0.3.2-next.2
  - @backstage/plugin-org@0.6.31-next.2
  - @backstage/plugin-permission-react@0.4.27-next.1
  - @backstage/plugin-scaffolder-react@1.13.0-next.2
  - @backstage/plugin-search-common@1.2.14
  - @backstage/plugin-search-react@1.8.1-next.2
  - @backstage/plugin-signals@0.0.11-next.2
  - @backstage/plugin-techdocs-react@1.2.9-next.2

## example-app-next@0.0.16-next.2

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.28.0-next.2
  - @backstage/plugin-scaffolder@1.26.0-next.2
  - @backstage/plugin-catalog@1.24.0-next.2
  - @backstage/plugin-catalog-react@1.14.0-next.2
  - @backstage/plugin-home@0.8.0-next.2
  - @backstage/plugin-techdocs@1.11.0-next.2
  - @backstage/plugin-catalog-import@0.12.5-next.2
  - @backstage/plugin-techdocs-module-addons-contrib@1.1.16-next.2
  - @backstage/plugin-kubernetes-cluster@0.0.17-next.2
  - @backstage/plugin-kubernetes@0.11.16-next.2
  - @backstage/plugin-search@1.4.18-next.2
  - @backstage/plugin-user-settings@0.8.14-next.2
  - @backstage/theme@0.6.0-next.1
  - @backstage/plugin-catalog-graph@0.4.11-next.2
  - @backstage/app-defaults@1.5.12-next.2
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/core-app-api@1.15.1-next.1
  - @backstage/core-compat-api@0.3.1-next.2
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/frontend-app-api@0.10.0-next.2
  - @backstage/frontend-defaults@0.1.1-next.2
  - @backstage/frontend-plugin-api@0.9.0-next.2
  - @backstage/integration-react@1.2.0-next.2
  - @backstage/plugin-api-docs@0.11.11-next.2
  - @backstage/plugin-app@0.1.1-next.2
  - @backstage/plugin-app-visualizer@0.1.11-next.2
  - @backstage/plugin-auth-react@0.1.7-next.2
  - @backstage/plugin-catalog-common@1.1.0
  - @backstage/plugin-catalog-unprocessed-entities@0.2.9-next.2
  - @backstage/plugin-notifications@0.3.2-next.2
  - @backstage/plugin-org@0.6.31-next.2
  - @backstage/plugin-permission-react@0.4.27-next.1
  - @backstage/plugin-scaffolder-react@1.13.0-next.2
  - @backstage/plugin-search-common@1.2.14
  - @backstage/plugin-search-react@1.8.1-next.2
  - @backstage/plugin-signals@0.0.11-next.2
  - @backstage/plugin-techdocs-react@1.2.9-next.2

## app-next-example-plugin@0.0.16-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.15.1-next.2
  - @backstage/frontend-plugin-api@0.9.0-next.2

## example-backend@0.0.31-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend-module-github@0.5.1-next.2
  - @backstage/backend-defaults@0.5.1-next.2
  - @backstage/plugin-auth-backend-module-github-provider@0.2.1-next.1
  - @backstage/plugin-scaffolder-backend@1.26.0-next.2
  - @backstage/plugin-search-backend@1.5.18-next.2
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/plugin-app-backend@0.3.76-next.1
  - @backstage/plugin-catalog-backend@1.26.2-next.2
  - @backstage/plugin-search-backend-module-explore@0.2.3-next.2
  - @backstage/plugin-techdocs-backend@1.10.14-next.2
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/plugin-auth-backend@0.23.1-next.1
  - @backstage/plugin-auth-backend-module-guest-provider@0.2.1-next.1
  - @backstage/plugin-catalog-backend-module-backstage-openapi@0.4.1-next.1
  - @backstage/plugin-catalog-backend-module-openapi@0.2.2-next.2
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.1-next.1
  - @backstage/plugin-catalog-backend-module-unprocessed@0.5.1-next.1
  - @backstage/plugin-devtools-backend@0.4.1-next.1
  - @backstage/plugin-events-backend@0.3.13-next.1
  - @backstage/plugin-kubernetes-backend@0.18.7-next.1
  - @backstage/plugin-notifications-backend@0.4.1-next.1
  - @backstage/plugin-permission-backend@0.5.50-next.1
  - @backstage/plugin-permission-backend-module-allow-all-policy@0.2.1-next.1
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-permission-node@0.8.4-next.1
  - @backstage/plugin-proxy-backend@0.5.7-next.1
  - @backstage/plugin-search-backend-module-catalog@0.2.3-next.2
  - @backstage/plugin-search-backend-module-techdocs@0.2.3-next.2
  - @backstage/plugin-search-backend-node@1.3.3-next.2
  - @backstage/plugin-signals-backend@0.2.1-next.1

## example-backend-legacy@0.2.103-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.5.1-next.2
  - @backstage/plugin-scaffolder-backend@1.26.0-next.2
  - @backstage/plugin-search-backend@1.5.18-next.2
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/plugin-app-backend@0.3.76-next.1
  - @backstage/plugin-catalog-node@1.13.1-next.1
  - @backstage/plugin-scaffolder-backend-module-gitlab@0.6.0-next.2
  - @backstage/integration@1.15.1-next.1
  - @backstage/plugin-catalog-backend@1.26.2-next.2
  - @backstage/plugin-scaffolder-backend-module-confluence-to-markdown@0.3.1-next.2
  - @backstage/plugin-search-backend-module-explore@0.2.3-next.2
  - @backstage/catalog-client@1.7.1-next.0
  - @backstage/plugin-techdocs-backend@1.10.14-next.2
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/plugin-auth-backend@0.23.1-next.1
  - @backstage/plugin-catalog-backend-module-scaffolder-entity-model@0.2.1-next.1
  - @backstage/plugin-catalog-backend-module-unprocessed@0.5.1-next.1
  - @backstage/plugin-devtools-backend@0.4.1-next.1
  - @backstage/plugin-events-backend@0.3.13-next.1
  - @backstage/plugin-events-node@0.4.1-next.1
  - @backstage/plugin-kubernetes-backend@0.18.7-next.1
  - @backstage/plugin-permission-backend@0.5.50-next.1
  - @backstage/plugin-permission-common@0.8.1
  - @backstage/plugin-permission-node@0.8.4-next.1
  - @backstage/plugin-proxy-backend@0.5.7-next.1
  - @backstage/plugin-scaffolder-backend-module-rails@0.5.1-next.2
  - @backstage/plugin-search-backend-module-catalog@0.2.3-next.2
  - @backstage/plugin-search-backend-module-elasticsearch@1.5.7-next.2
  - @backstage/plugin-search-backend-module-pg@0.5.36-next.2
  - @backstage/plugin-search-backend-module-techdocs@0.2.3-next.2
  - @backstage/plugin-search-backend-node@1.3.3-next.2
  - @backstage/plugin-signals-backend@0.2.1-next.1
  - @backstage/plugin-signals-node@0.1.12-next.1

## e2e-test@0.2.21-next.2

### Patch Changes

- Updated dependencies
  - @backstage/create-app@0.5.21-next.2
  - @backstage/cli-common@0.1.14
  - @backstage/errors@1.2.4

## @internal/frontend@0.0.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.9.0-next.2
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.10-next.0

## @internal/scaffolder@0.0.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-react@1.13.0-next.2

## techdocs-cli-embedded-app@0.2.101-next.2

### Patch Changes

- Updated dependencies
  - @backstage/cli@0.28.0-next.2
  - @backstage/plugin-catalog@1.24.0-next.2
  - @backstage/plugin-techdocs@1.11.0-next.2
  - @backstage/theme@0.6.0-next.1
  - @backstage/app-defaults@1.5.12-next.2
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/core-app-api@1.15.1-next.1
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/integration-react@1.2.0-next.2
  - @backstage/test-utils@1.6.1-next.2
  - @backstage/plugin-techdocs-react@1.2.9-next.2

## @internal/plugin-todo-list@1.0.32-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1

## @internal/plugin-todo-list-backend@1.0.32-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/errors@1.2.4
