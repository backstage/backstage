# @backstage/plugin-catalog-backend-module-gitlab

## 0.2.1

### Patch Changes

- b12c41fafc4: Fix a corner case where returned users are null for bots
- Updated dependencies
  - @backstage/backend-common@0.18.5
  - @backstage/integration@1.4.5
  - @backstage/backend-tasks@0.5.2
  - @backstage/plugin-catalog-node@1.3.6
  - @backstage/backend-plugin-api@0.5.2
  - @backstage/catalog-model@1.3.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2

## 0.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/plugin-catalog-node@1.3.6-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1
  - @backstage/config@1.0.7

## 0.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.0
  - @backstage/integration@1.4.5-next.0
  - @backstage/backend-tasks@0.5.2-next.0
  - @backstage/plugin-catalog-node@1.3.6-next.0
  - @backstage/backend-plugin-api@0.5.2-next.0
  - @backstage/catalog-model@1.3.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2

## 0.2.0

### Minor Changes

- f64345108a0: **BREAKING**: The configuration of the `GitlabDiscoveryEntityProvider` has changed as follows:

  - The configuration key `branch` is now used to define the branch from which the catalog-info should be discovered.
  - The old configuration key `branch` is now called `fallbackBranch`. This value specifies which branch should be used
    if no default branch is defined on the project itself.

  To migrate to the new configuration value, rename `branch` to `fallbackBranch`

### Patch Changes

- 7b1b7bfdb7b: The gitlab org data integration now makes use of the GraphQL API to determine
  the relationships between imported User and Group entities, effectively making
  this integration usable without an administrator account's Personal Access
  Token.
- Updated dependencies
  - @backstage/backend-common@0.18.4
  - @backstage/backend-tasks@0.5.1
  - @backstage/catalog-model@1.3.0
  - @backstage/integration@1.4.4
  - @backstage/plugin-catalog-node@1.3.5
  - @backstage/backend-plugin-api@0.5.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2

## 0.2.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.3.0-next.0
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/backend-tasks@0.5.1-next.2
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/integration@1.4.4-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-node@1.3.5-next.3

## 0.2.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/backend-tasks@0.5.1-next.2
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/integration@1.4.4-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-node@1.3.5-next.2

## 0.2.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.1-next.1
  - @backstage/integration@1.4.4-next.0
  - @backstage/backend-common@0.18.4-next.1
  - @backstage/backend-plugin-api@0.5.1-next.1
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-node@1.3.5-next.1

## 0.2.0-next.0

### Minor Changes

- f64345108a0: **BREAKING**: The configuration of the `GitlabDiscoveryEntityProvider` has changed as follows:

  - The configuration key `branch` is now used to define the branch from which the catalog-info should be discovered.
  - The old configuration key `branch` is now called `fallbackBranch`. This value specifies which branch should be used
    if no default branch is defined on the project itself.

  To migrate to the new configuration value, rename `branch` to `fallbackBranch`

### Patch Changes

- 7b1b7bfdb7b: The gitlab org data integration now makes use of the GraphQL API to determine
  the relationships between imported User and Group entities, effectively making
  this integration usable without an administrator account's Personal Access
  Token.
- Updated dependencies
  - @backstage/backend-common@0.18.4-next.0
  - @backstage/config@1.0.7
  - @backstage/integration@1.4.3
  - @backstage/backend-plugin-api@0.5.1-next.0
  - @backstage/backend-tasks@0.5.1-next.0
  - @backstage/catalog-model@1.2.1
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-node@1.3.5-next.0

## 0.1.14

### Patch Changes

- 90469c02c8c: Renamed `gitlabDiscoveryEntityProviderCatalogModule` to `catalogModuleGitlabDiscoveryEntityProvider` to match the [recommended naming patterns](https://backstage.io/docs/backend-system/architecture/naming-patterns).
- e675f902980: Make sure to not use deprecated exports from `@backstage/plugin-catalog-backend`
- 928a12a9b3e: Internal refactor of `/alpha` exports.
- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- af1095f1e11: The configuration key `branch` of the `GitlabDiscoveryEntityProvider` has been deprecated in favor of the configuration key `fallbackBranch`.
  It will be reused in future release to enforce a concrete branch to be used in catalog file discovery.
  To migrate to the new configuration value, rename `branch` to `fallbackBranch`.
- be129f8f3cd: filter gitlab groups by prefix
- Updated dependencies
  - @backstage/backend-tasks@0.5.0
  - @backstage/backend-common@0.18.3
  - @backstage/errors@1.1.5
  - @backstage/plugin-catalog-node@1.3.4
  - @backstage/backend-plugin-api@0.5.0
  - @backstage/catalog-model@1.2.1
  - @backstage/integration@1.4.3
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.1.14-next.2

### Patch Changes

- be129f8f3cd: filter gitlab groups by prefix
- Updated dependencies
  - @backstage/backend-tasks@0.5.0-next.2
  - @backstage/backend-common@0.18.3-next.2
  - @backstage/backend-plugin-api@0.4.1-next.2
  - @backstage/plugin-catalog-backend@1.8.0-next.2
  - @backstage/plugin-catalog-node@1.3.4-next.2
  - @backstage/config@1.0.7-next.0
  - @backstage/integration@1.4.3-next.0

## 0.1.14-next.1

### Patch Changes

- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- af1095f1e11: The configuration key `branch` of the `GitlabDiscoveryEntityProvider` has been deprecated in favor of the configuration key `fallbackBranch`.
  It will be reused in future release to enforce a concrete branch to be used in catalog file discovery.
  To migrate to the new configuration value, rename `branch` to `fallbackBranch`.
- Updated dependencies
  - @backstage/errors@1.1.5-next.0
  - @backstage/backend-common@0.18.3-next.1
  - @backstage/integration@1.4.3-next.0
  - @backstage/plugin-catalog-backend@1.8.0-next.1
  - @backstage/backend-plugin-api@0.4.1-next.1
  - @backstage/backend-tasks@0.4.4-next.1
  - @backstage/config@1.0.7-next.0
  - @backstage/catalog-model@1.2.1-next.1
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-node@1.3.4-next.1

## 0.1.14-next.0

### Patch Changes

- 928a12a9b3: Internal refactor of `/alpha` exports.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.8.0-next.0
  - @backstage/backend-tasks@0.4.4-next.0
  - @backstage/backend-plugin-api@0.4.1-next.0
  - @backstage/backend-common@0.18.3-next.0
  - @backstage/catalog-model@1.2.1-next.0
  - @backstage/plugin-catalog-node@1.3.4-next.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/types@1.0.2

## 0.1.13

### Patch Changes

- 49948f644f: The config now consistently uses the term 'instance' to refer to a single GitLab API host.
- 85b04f659a: Internal refactor to not use deprecated `substr`
- 52c5685ceb: Implement Group and User Catalog Provider
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.7.2
  - @backstage/backend-plugin-api@0.4.0
  - @backstage/backend-common@0.18.2
  - @backstage/catalog-model@1.2.0
  - @backstage/plugin-catalog-node@1.3.3
  - @backstage/backend-tasks@0.4.3
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/types@1.0.2

## 0.1.13-next.2

### Patch Changes

- 49948f644f: The config now consistently uses the term 'instance' to refer to a single GitLab API host.
- Updated dependencies
  - @backstage/backend-plugin-api@0.4.0-next.2
  - @backstage/backend-common@0.18.2-next.2
  - @backstage/plugin-catalog-backend@1.7.2-next.2
  - @backstage/catalog-model@1.2.0-next.1
  - @backstage/plugin-catalog-node@1.3.3-next.2
  - @backstage/backend-tasks@0.4.3-next.2
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/types@1.0.2

## 0.1.13-next.1

### Patch Changes

- 85b04f659a: Internal refactor to not use deprecated `substr`
- 52c5685ceb: Implement Group and User Catalog Provider
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.7.2-next.1
  - @backstage/backend-common@0.18.2-next.1
  - @backstage/backend-plugin-api@0.3.2-next.1
  - @backstage/backend-tasks@0.4.3-next.1
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-node@1.3.3-next.1

## 0.1.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/backend-common@0.18.2-next.0
  - @backstage/plugin-catalog-backend@1.7.2-next.0
  - @backstage/plugin-catalog-node@1.3.3-next.0
  - @backstage/backend-tasks@0.4.3-next.0
  - @backstage/backend-plugin-api@0.3.2-next.0

## 0.1.11

### Patch Changes

- 9f2b786fc9: Provide context for logged errors.
- 8e06f3cf00: Switched imports of `loggerToWinstonLogger` to `@backstage/backend-common`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.3.0
  - @backstage/backend-common@0.18.0
  - @backstage/catalog-model@1.1.5
  - @backstage/backend-tasks@0.4.1
  - @backstage/plugin-catalog-node@1.3.1
  - @backstage/plugin-catalog-backend@1.7.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/types@1.0.2

## 0.1.11-next.2

### Patch Changes

- 9f2b786fc9: Provide context for logged errors.
- 8e06f3cf00: Switched imports of `loggerToWinstonLogger` to `@backstage/backend-common`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.3.0-next.1
  - @backstage/backend-common@0.18.0-next.1
  - @backstage/backend-tasks@0.4.1-next.1
  - @backstage/plugin-catalog-backend@1.7.0-next.2
  - @backstage/plugin-catalog-node@1.3.1-next.2
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0
  - @backstage/types@1.0.2

## 0.1.11-next.1

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

## 0.1.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.0
  - @backstage/plugin-catalog-backend@1.7.0-next.0
  - @backstage/backend-common@0.17.0
  - @backstage/backend-plugin-api@0.2.0
  - @backstage/backend-tasks@0.4.0
  - @backstage/config@1.0.5
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.1
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-node@1.3.1-next.0

## 0.1.10

### Patch Changes

- 884d749b14: Refactored to use `coreServices` from `@backstage/backend-plugin-api`.
- 3280711113: Updated dependency `msw` to `^0.49.0`.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.6.0
  - @backstage/backend-common@0.17.0
  - @backstage/plugin-catalog-node@1.3.0
  - @backstage/backend-tasks@0.4.0
  - @backstage/errors@1.1.4
  - @backstage/backend-plugin-api@0.2.0
  - @backstage/integration@1.4.1
  - @backstage/types@1.0.2
  - @backstage/catalog-model@1.1.4
  - @backstage/config@1.0.5

## 0.1.10-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.6.0-next.3
  - @backstage/backend-tasks@0.4.0-next.3
  - @backstage/backend-common@0.17.0-next.3
  - @backstage/backend-plugin-api@0.2.0-next.3
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/integration@1.4.1-next.1
  - @backstage/types@1.0.2-next.1
  - @backstage/plugin-catalog-node@1.3.0-next.3

## 0.1.10-next.2

### Patch Changes

- 884d749b14: Refactored to use `coreServices` from `@backstage/backend-plugin-api`.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.6.0-next.2
  - @backstage/plugin-catalog-node@1.3.0-next.2
  - @backstage/backend-common@0.17.0-next.2
  - @backstage/backend-plugin-api@0.2.0-next.2
  - @backstage/backend-tasks@0.4.0-next.2
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/integration@1.4.1-next.1
  - @backstage/types@1.0.2-next.1

## 0.1.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.1
  - @backstage/plugin-catalog-backend@1.6.0-next.1
  - @backstage/backend-tasks@0.4.0-next.1
  - @backstage/types@1.0.2-next.1
  - @backstage/backend-plugin-api@0.1.5-next.1
  - @backstage/plugin-catalog-node@1.2.2-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/integration@1.4.1-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/errors@1.1.4-next.1

## 0.1.10-next.0

### Patch Changes

- 3280711113: Updated dependency `msw` to `^0.49.0`.
- Updated dependencies
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

## 0.1.9

### Patch Changes

- 6bb046bcbe: Add `gitlabDiscoveryEntityProviderCatalogModule` (new backend-plugin-api, alpha).
- 81cedb5033: `GitlabDiscoveryEntityProvider`: Add option to configure schedule via `app-config.yaml` instead of in code.

  Please find how to configure the schedule at the config at
  https://backstage.io/docs/integrations/gitlab/discovery

- 4c9f7847e4: Updated dependency `msw` to `^0.48.0` while moving it to be a dev dependency.
- Updated dependencies
  - @backstage/backend-common@0.16.0
  - @backstage/plugin-catalog-backend@1.5.1
  - @backstage/integration@1.4.0
  - @backstage/backend-tasks@0.3.7
  - @backstage/catalog-model@1.1.3
  - @backstage/types@1.0.1
  - @backstage/backend-plugin-api@0.1.4
  - @backstage/plugin-catalog-node@1.2.1
  - @backstage/config@1.0.4
  - @backstage/errors@1.1.3

## 0.1.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.1
  - @backstage/backend-plugin-api@0.1.4-next.1
  - @backstage/backend-tasks@0.3.7-next.1
  - @backstage/plugin-catalog-backend@1.5.1-next.1
  - @backstage/plugin-catalog-node@1.2.1-next.1
  - @backstage/catalog-model@1.1.3-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/errors@1.1.3-next.0
  - @backstage/integration@1.4.0-next.0
  - @backstage/types@1.0.1-next.0

## 0.1.9-next.0

### Patch Changes

- 6bb046bcbe: Add `gitlabDiscoveryEntityProviderCatalogModule` (new backend-plugin-api, alpha).
- 81cedb5033: `GitlabDiscoveryEntityProvider`: Add option to configure schedule via `app-config.yaml` instead of in code.

  Please find how to configure the schedule at the config at
  https://backstage.io/docs/integrations/gitlab/discovery

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.0
  - @backstage/plugin-catalog-backend@1.5.1-next.0
  - @backstage/integration@1.4.0-next.0
  - @backstage/backend-tasks@0.3.7-next.0
  - @backstage/catalog-model@1.1.3-next.0
  - @backstage/types@1.0.1-next.0
  - @backstage/backend-plugin-api@0.1.4-next.0
  - @backstage/plugin-catalog-node@1.2.1-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/errors@1.1.3-next.0

## 0.1.8

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.2
  - @backstage/backend-common@0.15.2
  - @backstage/plugin-catalog-backend@1.5.0
  - @backstage/backend-tasks@0.3.6
  - @backstage/config@1.0.3
  - @backstage/errors@1.1.2
  - @backstage/integration@1.3.2
  - @backstage/types@1.0.0

## 0.1.8-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.5.0-next.2
  - @backstage/backend-tasks@0.3.6-next.2
  - @backstage/backend-common@0.15.2-next.2
  - @backstage/catalog-model@1.1.2-next.2
  - @backstage/config@1.0.3-next.2
  - @backstage/errors@1.1.2-next.2
  - @backstage/integration@1.3.2-next.2
  - @backstage/types@1.0.0

## 0.1.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2-next.1
  - @backstage/backend-tasks@0.3.6-next.1
  - @backstage/catalog-model@1.1.2-next.1
  - @backstage/config@1.0.3-next.1
  - @backstage/errors@1.1.2-next.1
  - @backstage/integration@1.3.2-next.1
  - @backstage/types@1.0.0
  - @backstage/plugin-catalog-backend@1.4.1-next.1

## 0.1.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.2-next.0
  - @backstage/plugin-catalog-backend@1.4.1-next.0
  - @backstage/backend-common@0.15.2-next.0
  - @backstage/backend-tasks@0.3.6-next.0
  - @backstage/config@1.0.3-next.0
  - @backstage/errors@1.1.2-next.0
  - @backstage/integration@1.3.2-next.0
  - @backstage/types@1.0.0

## 0.1.7

### Patch Changes

- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- Updated dependencies
  - @backstage/backend-common@0.15.1
  - @backstage/integration@1.3.1
  - @backstage/plugin-catalog-backend@1.4.0
  - @backstage/backend-tasks@0.3.5
  - @backstage/catalog-model@1.1.1
  - @backstage/config@1.0.2
  - @backstage/errors@1.1.1

## 0.1.7-next.3

### Patch Changes

- Updated dependencies
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
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.2
  - @backstage/integration@1.3.1-next.1
  - @backstage/plugin-catalog-backend@1.4.0-next.2

## 0.1.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.1-next.1
  - @backstage/plugin-catalog-backend@1.4.0-next.1

## 0.1.7-next.0

### Patch Changes

- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.0
  - @backstage/backend-tasks@0.3.5-next.0
  - @backstage/plugin-catalog-backend@1.3.2-next.0
  - @backstage/integration@1.3.1-next.0

## 0.1.6

### Patch Changes

- 24979413a4: Enhancing GitLab provider with filtering projects by pattern RegExp

  ```yaml
  providers:
    gitlab:
      stg:
        host: gitlab.stg.company.io
        branch: main
        projectPattern: 'john/' # new option
        entityFilename: template.yaml
  ```

  With the aforementioned parameter you can filter projects, and keep only who belongs to the namespace "john".

- Updated dependencies
  - @backstage/backend-common@0.15.0
  - @backstage/integration@1.3.0
  - @backstage/backend-tasks@0.3.4
  - @backstage/plugin-catalog-backend@1.3.1

## 0.1.6-next.1

### Patch Changes

- 24979413a4: Enhancing GitLab provider with filtering projects by pattern RegExp

  ```yaml
  providers:
    gitlab:
      stg:
        host: gitlab.stg.company.io
        branch: main
        projectPattern: 'john/' # new option
        entityFilename: template.yaml
  ```

  With the aforementioned parameter you can filter projects, and keep only who belongs to the namespace "john".

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.3.1-next.2

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
- 8006d0f9bf: Updated dependency `msw` to `^0.44.0`.
- 49ff472c0b: Add the possibility in the `GitlabDiscoveryEntityProvider` to scan the whole project instead of concrete groups. For that, use a configuration like this one, where the group parameter is omitted (not mandatory anymore):

  ```yaml
  catalog:
    providers:
      gitlab:
        yourProviderId:
          host: gitlab-host # Identifies one of the hosts set up in the integrations
          branch: main # Optional. Uses `master` as default
          entityFilename: catalog-info.yaml # Optional. Defaults to `catalog-info.yaml`
  ```

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
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.3.0-next.3
  - @backstage/backend-common@0.14.1-next.3
  - @backstage/integration@1.2.2-next.3
  - @backstage/backend-tasks@0.3.3-next.3
  - @backstage/catalog-model@1.1.0-next.3

## 0.1.5-next.1

### Patch Changes

- 49ff472c0b: Add the possibility in the `GitlabDiscoveryEntityProvider` to scan the whole project instead of concrete groups. For that, use a configuration like this one, where the group parameter is omitted (not mandatory anymore):

  ```yaml
  catalog:
    providers:
      gitlab:
        yourProviderId:
          host: gitlab-host # Identifies one of the hosts set up in the integrations
          branch: main # Optional. Uses `master` as default
          entityFilename: catalog-info.yaml # Optional. Defaults to `catalog-info.yaml`
  ```

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

- eea8126171: Add a new provider `GitlabDiscoveryEntityProvider` as replacement for `GitlabDiscoveryProcessor`

  In order to migrate from the `GitlabDiscoveryProcessor` you need to apply
  the following changes:

  **Before:**

  ```yaml
  # app-config.yaml

  catalog:
    locations:
      - type: gitlab-discovery
        target: https://company.gitlab.com/prefix/*/catalog-info.yaml
  ```

  ```ts
  /* packages/backend/src/plugins/catalog.ts */

  import { GitlabDiscoveryProcessor } from '@backstage/plugin-catalog-backend-module-gitlab';

  const builder = await CatalogBuilder.create(env);
  /** ... other processors ... */
  builder.addProcessor(
    GitLabDiscoveryProcessor.fromConfig(env.config, { logger: env.logger }),
  );
  ```

  **After:**

  ```yaml
  # app-config.yaml

  catalog:
    providers:
      gitlab:
        yourProviderId: # identifies your dataset / provider independent of config changes
          host: gitlab-host # Identifies one of the hosts set up in the integrations
          branch: main # Optional. Uses `master` as default
          group: example-group # Group and subgroup (if needed) to look for repositories
          entityFilename: catalog-info.yaml # Optional. Defaults to `catalog-info.yaml`
  ```

  ```ts
  /* packages/backend/src/plugins/catalog.ts */

  import { GitlabDiscoveryEntityProvider } from '@backstage/plugin-catalog-backend-module-gitlab';

  const builder = await CatalogBuilder.create(env);
  /** ... other processors and/or providers ... */
  builder.addEntityProvider(
    ...GitlabDiscoveryEntityProvider.fromConfig(env.config, {
      logger: env.logger,
      schedule: env.scheduler.createScheduledTaskRunner({
        frequency: { minutes: 30 },
        timeout: { minutes: 3 },
      }),
    }),
  );
  ```

- bad907d794: The `last_activity_after` timestamp is now being omitted when querying the GitLab API for the first time.
- 3ac4522537: do not create location object if file with component definition do not exists in project, that decrease count of request to gitlab with 404 status code. Now we can create processor with new flag to enable this logic:

  ```ts
  const processor = GitLabDiscoveryProcessor.fromConfig(config, {
    logger,
    skipReposWithoutExactFileMatch: true,
  });
  ```

  **WARNING:** This new functionality does not support globs in the repo file path

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
  - @backstage/plugin-catalog-backend@1.2.0-next.2

## 0.1.4-next.1

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/backend-common@0.13.6-next.1
  - @backstage/integration@1.2.1-next.1
  - @backstage/plugin-catalog-backend@1.2.0-next.1
  - @backstage/catalog-model@1.0.3-next.0

## 0.1.4-next.0

### Patch Changes

- 3ac4522537: do not create location object if file with component definition do not exists in project, that decrease count of request to gitlab with 404 status code. Now we can create processor with new flag to enable this logic:

  ```ts
  const processor = GitLabDiscoveryProcessor.fromConfig(config, {
    logger,
    skipReposWithoutExactFileMatch: true,
  });
  ```

  **WARNING:** This new functionality does not support globs in the repo file path

- Updated dependencies
  - @backstage/backend-common@0.13.6-next.0
  - @backstage/integration@1.2.1-next.0
  - @backstage/plugin-catalog-backend@1.2.0-next.0

## 0.1.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3
  - @backstage/plugin-catalog-backend@1.1.2
  - @backstage/integration@1.2.0
  - @backstage/config@1.0.1
  - @backstage/catalog-model@1.0.2

## 0.1.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.2
  - @backstage/plugin-catalog-backend@1.1.2-next.2
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

- 66ba5d9023: Added package, moving out GitLab specific functionality from the catalog-backend

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.0
  - @backstage/plugin-catalog-backend@0.24.0
  - @backstage/catalog-model@0.13.0

## 0.1.0-next.0

### Minor Changes

- 66ba5d9023: Added package, moving out GitLab specific functionality from the catalog-backend

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.0-next.0
  - @backstage/plugin-catalog-backend@0.24.0-next.0
  - @backstage/catalog-model@0.13.0-next.0
