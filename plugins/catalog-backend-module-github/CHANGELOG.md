# @backstage/plugin-catalog-backend-module-github

## 0.2.3

### Patch Changes

- 427d8f4411: Added support for event based updates in the `GithubOrgEntityProvider`!
  Based on webhook events from GitHub the affected `User` or `Group` entity will be refreshed.
  This includes adding new entities, refreshing existing ones, and removing obsolete ones.

  Please find more information at
  https://backstage.io/docs/integrations/github/org#installation-with-events-support

- f8d91a8810: fixed `catalogPath` option to properly glob match on received GitHub events.
- 9f2b786fc9: Provide context for logged errors.
- 8e06f3cf00: Switched imports of `loggerToWinstonLogger` to `@backstage/backend-common`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.3.0
  - @backstage/backend-common@0.18.0
  - @backstage/catalog-model@1.1.5
  - @backstage/catalog-client@1.3.0
  - @backstage/backend-tasks@0.4.1
  - @backstage/plugin-catalog-node@1.3.1
  - @backstage/plugin-catalog-backend@1.7.0
  - @backstage/config@1.0.6
  - @backstage/plugin-events-node@0.2.1
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.10

## 0.2.3-next.2

### Patch Changes

- f8d91a8810: fixed `catalogPath` option to properly glob match on received GitHub events.
- 9f2b786fc9: Provide context for logged errors.
- 8e06f3cf00: Switched imports of `loggerToWinstonLogger` to `@backstage/backend-common`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.3.0-next.1
  - @backstage/backend-common@0.18.0-next.1
  - @backstage/backend-tasks@0.4.1-next.1
  - @backstage/catalog-client@1.3.0-next.2
  - @backstage/plugin-catalog-backend@1.7.0-next.2
  - @backstage/plugin-catalog-node@1.3.1-next.2
  - @backstage/plugin-events-node@0.2.1-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.10-next.1

## 0.2.3-next.1

### Patch Changes

- 427d8f4411: Added support for event based updates in the `GithubOrgEntityProvider`!
  Based on webhook events from GitHub the affected `User` or `Group` entity will be refreshed.
  This includes adding new entities, refreshing existing ones, and removing obsolete ones.

  Please find more information at
  https://backstage.io/docs/integrations/github/org#installation-with-events-support

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

## 0.2.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.0
  - @backstage/catalog-client@1.3.0-next.0
  - @backstage/plugin-catalog-backend@1.7.0-next.0
  - @backstage/backend-common@0.17.0
  - @backstage/backend-plugin-api@0.2.0
  - @backstage/backend-tasks@0.4.0
  - @backstage/config@1.0.5
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.1
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.10-next.0
  - @backstage/plugin-catalog-node@1.3.1-next.0
  - @backstage/plugin-events-node@0.2.0

## 0.2.2

### Patch Changes

- 70fa5ec3ec: Fixes the assignment of group member references in `GithubMultiOrgProcessor` so membership relations are resolved correctly.
- 884d749b14: Refactored to use `coreServices` from `@backstage/backend-plugin-api`.
- fe93cce743: Added the githubCredentialsProvider property to the GithubLocationAnalyzerOptions to be able to override the GithubCredentialsProvider.
- a0fd4af94a: Handle GitHub `push` events at the `GithubEntityProvider` by subscribing to the topic `github.push.`

  Implements `EventSubscriber` to receive events for the topic `github.push`.

  On `github.push`, the affected repository will be refreshed.
  This includes adding new Location entities, refreshing existing ones,
  and removing obsolete ones.

  Please find more information at
  https://backstage.io/docs/integrations/github/discovery#installation-with-events-support

- 3280711113: Updated dependency `msw` to `^0.49.0`.
- 754b5854df: Fix incorrectly exported GithubOrgEntityProvider as a type
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.6.0
  - @backstage/catalog-client@1.2.0
  - @backstage/backend-common@0.17.0
  - @backstage/plugin-catalog-node@1.3.0
  - @backstage/backend-tasks@0.4.0
  - @backstage/errors@1.1.4
  - @backstage/backend-plugin-api@0.2.0
  - @backstage/plugin-events-node@0.2.0
  - @backstage/integration@1.4.1
  - @backstage/types@1.0.2
  - @backstage/catalog-model@1.1.4
  - @backstage/config@1.0.5
  - @backstage/plugin-catalog-common@1.0.9

## 0.2.2-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.6.0-next.3
  - @backstage/backend-tasks@0.4.0-next.3
  - @backstage/backend-common@0.17.0-next.3
  - @backstage/backend-plugin-api@0.2.0-next.3
  - @backstage/catalog-client@1.2.0-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/integration@1.4.1-next.1
  - @backstage/types@1.0.2-next.1
  - @backstage/plugin-catalog-common@1.0.9-next.3
  - @backstage/plugin-catalog-node@1.3.0-next.3
  - @backstage/plugin-events-node@0.2.0-next.3

## 0.2.2-next.2

### Patch Changes

- 884d749b14: Refactored to use `coreServices` from `@backstage/backend-plugin-api`.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.6.0-next.2
  - @backstage/plugin-catalog-node@1.3.0-next.2
  - @backstage/backend-common@0.17.0-next.2
  - @backstage/backend-plugin-api@0.2.0-next.2
  - @backstage/backend-tasks@0.4.0-next.2
  - @backstage/catalog-client@1.2.0-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/integration@1.4.1-next.1
  - @backstage/types@1.0.2-next.1
  - @backstage/plugin-catalog-common@1.0.9-next.2
  - @backstage/plugin-events-node@0.2.0-next.2

## 0.2.2-next.1

### Patch Changes

- fe93cce743: Added the githubCredentialsProvider property to the GithubLocationAnalyzerOptions to be able to override the GithubCredentialsProvider.
- a0fd4af94a: Handle GitHub `push` events at the `GithubEntityProvider` by subscribing to the topic `github.push.`

  Implements `EventSubscriber` to receive events for the topic `github.push`.

  On `github.push`, the affected repository will be refreshed.
  This includes adding new Location entities, refreshing existing ones,
  and removing obsolete ones.

  Please find more information at
  https://backstage.io/docs/integrations/github/discovery#installation-with-events-support

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.1
  - @backstage/plugin-catalog-backend@1.6.0-next.1
  - @backstage/backend-tasks@0.4.0-next.1
  - @backstage/types@1.0.2-next.1
  - @backstage/backend-plugin-api@0.1.5-next.1
  - @backstage/plugin-catalog-node@1.2.2-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/integration@1.4.1-next.1
  - @backstage/catalog-client@1.2.0-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/plugin-catalog-common@1.0.9-next.1
  - @backstage/plugin-events-node@0.2.0-next.1

## 0.2.2-next.0

### Patch Changes

- 70fa5ec3ec: Fixes the assignment of group member references in `GithubMultiOrgProcessor` so membership relations are resolved correctly.
- 3280711113: Updated dependency `msw` to `^0.49.0`.
- 754b5854df: Fix incorrectly exported GithubOrgEntityProvider as a type
- Updated dependencies
  - @backstage/catalog-client@1.2.0-next.0
  - @backstage/plugin-catalog-backend@1.6.0-next.0
  - @backstage/backend-common@0.16.1-next.0
  - @backstage/integration@1.4.1-next.0
  - @backstage/types@1.0.2-next.0
  - @backstage/backend-plugin-api@0.1.5-next.0
  - @backstage/plugin-catalog-node@1.2.2-next.0
  - @backstage/backend-tasks@0.3.8-next.0
  - @backstage/catalog-model@1.1.4-next.0
  - @backstage/config@1.0.5-next.0
  - @backstage/errors@1.1.4-next.0

## 0.2.0

### Minor Changes

- 67fe5bc9a9: BREAKING: Support authenticated backends by including a server token for catalog requests. The constructor of `GithubLocationAnalyzer` now requires an instance of `TokenManager` to be supplied:

  ```diff
  ...
    builder.addLocationAnalyzers(
      new GitHubLocationAnalyzer({
        discovery: env.discovery,
        config: env.config,
  +     tokenManager: env.tokenManager,
      }),
    );
  ...
  ```

- f64d66a45c: Added the ability for the GitHub discovery provider to validate that catalog files exist before emitting them.

  Users can now set the `validateLocationsExist` property to `true` in their GitHub discovery configuration to opt in to this feature.
  This feature only works with `catalogPath`s that do not contain wildcards.

  When `validateLocationsExist` is set to `true`, the GitHub discovery provider will retrieve the object from the
  repository at the provided `catalogPath`.
  If this file exists and is non-empty, then it will be emitted as a location for further processing.
  If this file does not exist or is empty, then it will not be emitted.
  Not emitting locations that do not exist allows for far fewer calls to the GitHub API to validate locations that do not exist.

### Patch Changes

- 67fe5bc9a9: Properly derive Github credentials when making requests in `GithubLocationAnalyzer` to support Github App authentication
- bef063dc8d: - Make it possible to inject custom user and team transformers when configuring the `GithubOrgEntityProvider`
- 4c9f7847e4: Updated dependency `msw` to `^0.48.0` while moving it to be a dev dependency.
- c1784a4980: Replaces in-code uses of `GitHub` with `Github` and deprecates old versions.
- Updated dependencies
  - @backstage/backend-common@0.16.0
  - @backstage/plugin-catalog-backend@1.5.1
  - @backstage/integration@1.4.0
  - @backstage/backend-tasks@0.3.7
  - @backstage/catalog-model@1.1.3
  - @backstage/types@1.0.1
  - @backstage/backend-plugin-api@0.1.4
  - @backstage/plugin-catalog-node@1.2.1
  - @backstage/catalog-client@1.1.2
  - @backstage/config@1.0.4
  - @backstage/errors@1.1.3

## 0.2.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.1
  - @backstage/backend-plugin-api@0.1.4-next.1
  - @backstage/backend-tasks@0.3.7-next.1
  - @backstage/plugin-catalog-backend@1.5.1-next.1
  - @backstage/plugin-catalog-node@1.2.1-next.1
  - @backstage/catalog-client@1.1.2-next.0
  - @backstage/catalog-model@1.1.3-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/errors@1.1.3-next.0
  - @backstage/integration@1.4.0-next.0
  - @backstage/types@1.0.1-next.0

## 0.2.0-next.0

### Minor Changes

- 67fe5bc9a9: BREAKING: Support authenticated backends by including a server token for catalog requests. The constructor of `GithubLocationAnalyzer` now requires an instance of `TokenManager` to be supplied:

  ```diff
  ...
    builder.addLocationAnalyzers(
      new GitHubLocationAnalyzer({
        discovery: env.discovery,
        config: env.config,
  +     tokenManager: env.tokenManager,
      }),
    );
  ...
  ```

- f64d66a45c: Added the ability for the GitHub discovery provider to validate that catalog files exist before emitting them.

  Users can now set the `validateLocationsExist` property to `true` in their GitHub discovery configuration to opt in to this feature.
  This feature only works with `catalogPath`s that do not contain wildcards.

  When `validateLocationsExist` is set to `true`, the GitHub discovery provider will retrieve the object from the
  repository at the provided `catalogPath`.
  If this file exists and is non-empty, then it will be emitted as a location for further processing.
  If this file does not exist or is empty, then it will not be emitted.
  Not emitting locations that do not exist allows for far fewer calls to the GitHub API to validate locations that do not exist.

### Patch Changes

- 67fe5bc9a9: Properly derive Github credentials when making requests in `GithubLocationAnalyzer` to support Github App authentication
- c1784a4980: Replaces in-code uses of `GitHub` with `Github` and deprecates old versions.
- Updated dependencies
  - @backstage/backend-common@0.16.0-next.0
  - @backstage/plugin-catalog-backend@1.5.1-next.0
  - @backstage/integration@1.4.0-next.0
  - @backstage/backend-tasks@0.3.7-next.0
  - @backstage/catalog-model@1.1.3-next.0
  - @backstage/types@1.0.1-next.0
  - @backstage/backend-plugin-api@0.1.4-next.0
  - @backstage/plugin-catalog-node@1.2.1-next.0
  - @backstage/catalog-client@1.1.2-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/errors@1.1.3-next.0

## 0.1.8

### Patch Changes

- 8749df3d02: `GitHubEntityProvider`: Add option to configure schedule via `app-config.yaml` instead of in code.

  Please find how to configure the schedule at the config at
  https://backstage.io/docs/integrations/github/discovery

- 7022aebf35: Added `GithubLocationAnalyzer`. This can be used to add to the `CatalogBuilder`. When added this will be used by `RepoLocationAnalyzer` to figure out if the given URL that you are trying to import from the /catalog-import page already contains catalog-info.yaml files.
- 51046b58b0: Use schedule from config at backend module.

  Also, it removes `GithubEntityProviderCatalogModuleOptions`
  in favor of config-only for the backend module setup
  like at other similar modules.

- 7edb5909e8: Add missing config schema for the `GitHubEntityProvider`.
- be9474b103: Replaces in-code uses of `GitHub` by `Github` and deprecates old versions.

  Deprecates

  - `GitHubEntityProvider` replaced by `GithubEntityProvider`
  - `GitHubLocationAnalyzer` replaced by `GithubLocationAnalyzer`
  - `GitHubLocationAnalyzerOptions` replaced by `GithubLocationAnalyzerOptions`
  - `GitHubOrgEntityProvider` replaced by `GithubOrgEntityProvider`
  - `GitHubOrgEntityProviderOptions` replaced by `GithubOrgEntityProviderOptions`

  Renames

  - `GitHubLocationAnalyzer` to `GithubLocationAnalyzer`
  - `GitHubLocationAnalyzerOptions` to `GithubLocationAnalyzerOptions`

- a35a27df70: Updated the `moduleId` of the experimental module export.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.2.0
  - @backstage/catalog-model@1.1.2
  - @backstage/backend-common@0.15.2
  - @backstage/plugin-catalog-backend@1.5.0
  - @backstage/backend-tasks@0.3.6
  - @backstage/backend-plugin-api@0.1.3
  - @backstage/catalog-client@1.1.1
  - @backstage/config@1.0.3
  - @backstage/errors@1.1.2
  - @backstage/integration@1.3.2
  - @backstage/types@1.0.0

## 0.1.8-next.2

### Patch Changes

- 7022aebf35: Added `GitHubLocationAnalyzer`. This can be used to add to the `CatalogBuilder`. When added this will be used by `RepoLocationAnalyzer` to figure out if the given URL that you are trying to import from the /catalog-import page already contains catalog-info.yaml files.
- 7edb5909e8: Add missing config schema for the `GitHubEntityProvider`.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.2.0-next.2
  - @backstage/plugin-catalog-backend@1.5.0-next.2
  - @backstage/backend-tasks@0.3.6-next.2
  - @backstage/backend-common@0.15.2-next.2
  - @backstage/backend-plugin-api@0.1.3-next.2
  - @backstage/catalog-client@1.1.1-next.2
  - @backstage/catalog-model@1.1.2-next.2
  - @backstage/config@1.0.3-next.2
  - @backstage/errors@1.1.2-next.2
  - @backstage/integration@1.3.2-next.2
  - @backstage/types@1.0.0

## 0.1.8-next.1

### Patch Changes

- a35a27df70: Updated the `moduleId` of the experimental module export.
- Updated dependencies
  - @backstage/backend-common@0.15.2-next.1
  - @backstage/backend-plugin-api@0.1.3-next.1
  - @backstage/backend-tasks@0.3.6-next.1
  - @backstage/catalog-model@1.1.2-next.1
  - @backstage/config@1.0.3-next.1
  - @backstage/errors@1.1.2-next.1
  - @backstage/integration@1.3.2-next.1
  - @backstage/types@1.0.0
  - @backstage/plugin-catalog-backend@1.4.1-next.1
  - @backstage/plugin-catalog-node@1.1.1-next.1

## 0.1.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.2-next.0
  - @backstage/backend-plugin-api@0.1.3-next.0
  - @backstage/plugin-catalog-backend@1.4.1-next.0
  - @backstage/plugin-catalog-node@1.1.1-next.0
  - @backstage/backend-common@0.15.2-next.0
  - @backstage/backend-tasks@0.3.6-next.0
  - @backstage/config@1.0.3-next.0
  - @backstage/errors@1.1.2-next.0
  - @backstage/integration@1.3.2-next.0
  - @backstage/types@1.0.0

## 0.1.7

### Patch Changes

- 3c4a388537: New experimental alpha exports for use with the upcoming backend system.
- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- 3a62594a11: Add support for including (or excluding) Github repositories by topic
- 287a64bf97: Added the ability to configure the host for the `GitHubEntityProvider` to use against GitHub Enterprise
- 91e2abbd46: Remove the duplicated `scheduleFn` initialization in `GitHubEntityProvider`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.1.2
  - @backstage/backend-common@0.15.1
  - @backstage/plugin-catalog-node@1.1.0
  - @backstage/integration@1.3.1
  - @backstage/plugin-catalog-backend@1.4.0
  - @backstage/backend-tasks@0.3.5
  - @backstage/catalog-model@1.1.1
  - @backstage/config@1.0.2
  - @backstage/errors@1.1.1

## 0.1.7-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-node@1.1.0-next.2
  - @backstage/backend-plugin-api@0.1.2-next.2
  - @backstage/catalog-model@1.1.1-next.0
  - @backstage/config@1.0.2-next.0
  - @backstage/errors@1.1.1-next.0
  - @backstage/integration@1.3.1-next.2
  - @backstage/plugin-catalog-backend@1.4.0-next.3
  - @backstage/backend-common@0.15.1-next.3
  - @backstage/backend-tasks@0.3.5-next.1

## 0.1.7-next.2

### Patch Changes

- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- 3a62594a11: Add support for including (or excluding) Github repositories by topic
- Updated dependencies
  - @backstage/backend-plugin-api@0.1.2-next.1
  - @backstage/plugin-catalog-node@1.0.2-next.1
  - @backstage/backend-common@0.15.1-next.2
  - @backstage/integration@1.3.1-next.1
  - @backstage/plugin-catalog-backend@1.4.0-next.2

## 0.1.7-next.1

### Patch Changes

- 287a64bf97: Added the ability to configure the host for the `GitHubEntityProvider` to use against GitHub Enterprise
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.1
  - @backstage/plugin-catalog-backend@1.4.0-next.1

## 0.1.7-next.0

### Patch Changes

- 3c4a388537: New experimental alpha exports for use with the upcoming backend system.
- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.0
  - @backstage/backend-tasks@0.3.5-next.0
  - @backstage/plugin-catalog-backend@1.3.2-next.0
  - @backstage/backend-plugin-api@0.1.2-next.0
  - @backstage/integration@1.3.1-next.0
  - @backstage/plugin-catalog-node@1.0.2-next.0

## 0.1.6

### Patch Changes

- f48950e34b: Github Entity Provider functionality for adding entities to the catalog.

  This provider replaces the GithubDiscoveryProcessor functionality as providers offer more flexibility with scheduling ingestion, removing and preventing orphaned entities.

  More information can be found on the [GitHub Discovery](https://backstage.io/docs/integrations/github/discovery) page.

- c59d1ce487: Fixed bug where repository filter was including all archived repositories
- 97f0a37378: Improved support for wildcards in `catalogPath`
- Updated dependencies
  - @backstage/backend-common@0.15.0
  - @backstage/integration@1.3.0
  - @backstage/backend-tasks@0.3.4
  - @backstage/plugin-catalog-backend@1.3.1

## 0.1.6-next.2

### Patch Changes

- 97f0a37378: Improved support for wildcards in `catalogPath`
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.3.1-next.2

## 0.1.6-next.1

### Patch Changes

- f48950e34b: Github Entity Provider functionality for adding entities to the catalog.

  This provider replaces the GithubDiscoveryProcessor functionality as providers offer more flexibility with scheduling ingestion, removing and preventing orphaned entities.

  More information can be found on the [GitHub Discovery](https://backstage.io/docs/integrations/github/discovery) page.

- Updated dependencies
  - @backstage/backend-common@0.15.0-next.1
  - @backstage/integration@1.3.0-next.1
  - @backstage/plugin-catalog-backend@1.3.1-next.1

## 0.1.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0-next.0
  - @backstage/integration@1.3.0-next.0
  - @backstage/backend-tasks@0.3.4-next.0
  - @backstage/plugin-catalog-backend@1.3.1-next.0

## 0.1.5

### Patch Changes

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 0f25116d28: Updated dependency `@octokit/graphql` to `^5.0.0`.
- 8006d0f9bf: Updated dependency `msw` to `^0.44.0`.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.3.0
  - @backstage/backend-common@0.14.1
  - @backstage/catalog-model@1.1.0
  - @backstage/integration@1.2.2
  - @backstage/backend-tasks@0.3.3
  - @backstage/errors@1.1.0

## 0.1.5-next.2

### Patch Changes

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 0f25116d28: Updated dependency `@octokit/graphql` to `^5.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.3.0-next.3
  - @backstage/backend-common@0.14.1-next.3
  - @backstage/integration@1.2.2-next.3
  - @backstage/backend-tasks@0.3.3-next.3
  - @backstage/catalog-model@1.1.0-next.3

## 0.1.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.1
  - @backstage/backend-common@0.14.1-next.1
  - @backstage/errors@1.1.0-next.0
  - @backstage/plugin-catalog-backend@1.2.1-next.1
  - @backstage/backend-tasks@0.3.3-next.1
  - @backstage/integration@1.2.2-next.1

## 0.1.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.1-next.0
  - @backstage/catalog-model@1.1.0-next.0
  - @backstage/integration@1.2.2-next.0
  - @backstage/backend-tasks@0.3.3-next.0
  - @backstage/plugin-catalog-backend@1.2.1-next.0

## 0.1.4

### Patch Changes

- 8335a6f6f3: Adds an edit URL to the GitHub Teams Group entities.
- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.2.0
  - @backstage/backend-tasks@0.3.2
  - @backstage/backend-common@0.14.0
  - @backstage/integration@1.2.1
  - @backstage/catalog-model@1.0.3

## 0.1.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.0-next.2
  - @backstage/integration@1.2.1-next.2
  - @backstage/backend-tasks@0.3.2-next.2
  - @backstage/plugin-catalog-backend@1.2.0-next.2

## 0.1.4-next.1

### Patch Changes

- 8335a6f6f3: Adds an edit URL to the GitHub Teams Group entities.
- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/backend-tasks@0.3.2-next.1
  - @backstage/backend-common@0.13.6-next.1
  - @backstage/integration@1.2.1-next.1
  - @backstage/plugin-catalog-backend@1.2.0-next.1
  - @backstage/catalog-model@1.0.3-next.0

## 0.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.3.2-next.0
  - @backstage/backend-common@0.13.6-next.0
  - @backstage/integration@1.2.1-next.0
  - @backstage/plugin-catalog-backend@1.2.0-next.0

## 0.1.3

### Patch Changes

- a7de43f648: `GitHubOrgEntityProvider.fromConfig` now supports a `schedule` option like other
  entity providers, that makes it more convenient to leverage using the common
  task scheduler.

  If you want to use this in your own project, it is used something like the following:

  ```ts
  // In packages/backend/src/plugins/catalog.ts
  builder.addEntityProvider(
    GitHubOrgEntityProvider.fromConfig(env.config, {
      id: 'production',
      orgUrl: 'https://github.com/backstage',
      schedule: env.scheduler.createScheduledTaskRunner({
        frequency: { cron: '*/30 * * * *' },
        timeout: { minutes: 10 },
      }),
      logger: env.logger,
    }),
  );
  ```

- Updated dependencies
  - @backstage/backend-common@0.13.3
  - @backstage/plugin-catalog-backend@1.1.2
  - @backstage/backend-tasks@0.3.1
  - @backstage/integration@1.2.0
  - @backstage/config@1.0.1
  - @backstage/catalog-model@1.0.2

## 0.1.3-next.1

### Patch Changes

- a7de43f648: `GitHubOrgEntityProvider.fromConfig` now supports a `schedule` option like other
  entity providers, that makes it more convenient to leverage using the common
  task scheduler.

  If you want to use this in your own project, it is used something like the following:

  ```ts
  // In packages/backend/src/plugins/catalog.ts
  builder.addEntityProvider(
    GitHubOrgEntityProvider.fromConfig(env.config, {
      id: 'production',
      orgUrl: 'https://github.com/backstage',
      schedule: env.scheduler.createScheduledTaskRunner({
        frequency: { cron: '*/30 * * * *' },
        timeout: { minutes: 10 },
      }),
      logger: env.logger,
    }),
  );
  ```

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.2
  - @backstage/plugin-catalog-backend@1.1.2-next.2
  - @backstage/backend-tasks@0.3.1-next.1
  - @backstage/config@1.0.1-next.0
  - @backstage/catalog-model@1.0.2-next.0
  - @backstage/integration@1.2.0-next.1

## 0.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.0
  - @backstage/integration@1.2.0-next.0
  - @backstage/plugin-catalog-backend@1.1.2-next.0

## 0.1.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.1.0
  - @backstage/integration@1.1.0
  - @backstage/catalog-model@1.0.1
  - @backstage/backend-common@0.13.2

## 0.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.1.0-next.1
  - @backstage/integration@1.1.0-next.1
  - @backstage/backend-common@0.13.2-next.1

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.0.1-next.0
  - @backstage/plugin-catalog-backend@1.0.1-next.0
  - @backstage/backend-common@0.13.2-next.0
  - @backstage/integration@1.0.1-next.0

## 0.1.1

### Patch Changes

- 132189e466: Updated the code to handle User kind `spec.memberOf` now being optional.
- e949d68059: Made sure to move the catalog-related github and ldap config into their right places
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.0.0
  - @backstage/backend-common@0.13.1
  - @backstage/catalog-model@1.0.0
  - @backstage/integration@1.0.0
  - @backstage/config@1.0.0
  - @backstage/errors@1.0.0
  - @backstage/types@1.0.0

## 0.1.0

### Minor Changes

- d4934e19b1: Added package, moving out GitHub specific functionality from the catalog-backend

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.0
  - @backstage/plugin-catalog-backend@0.24.0
  - @backstage/catalog-model@0.13.0
