# @backstage/plugin-scaffolder-backend

## 1.7.0-next.2

### Minor Changes

- 17ff77154c: Update the `github:publish` action to allow passing whether pull
  requests must be up to date with the default branch before merging.
- a8e9848479: Added optional `sourcePath` parameter to `publish:gitlab:merge-request` action, `targetPath` is now optional and falls back to current workspace path.

### Patch Changes

- 4880d43e25: Fixed setting default branch for Bitbucket Server
- Updated dependencies
  - @backstage/plugin-catalog-node@1.2.0-next.2
  - @backstage/plugin-catalog-backend@1.5.0-next.2
  - @backstage/backend-tasks@0.3.6-next.2
  - @backstage/backend-common@0.15.2-next.2
  - @backstage/backend-plugin-api@0.1.3-next.2
  - @backstage/plugin-auth-node@0.2.6-next.2
  - @backstage/catalog-client@1.1.1-next.2
  - @backstage/catalog-model@1.1.2-next.2
  - @backstage/config@1.0.3-next.2
  - @backstage/errors@1.1.2-next.2
  - @backstage/integration@1.3.2-next.2
  - @backstage/types@1.0.0
  - @backstage/plugin-scaffolder-common@1.2.1-next.2

## 1.7.0-next.1

### Patch Changes

- 489621f613: Switching off duplicated timestamp in case of logging via task logger in a custom action
- a35a27df70: Updated the `moduleId` of the experimental module export.
- Updated dependencies
  - @backstage/catalog-client@1.1.1-next.1
  - @backstage/backend-common@0.15.2-next.1
  - @backstage/backend-plugin-api@0.1.3-next.1
  - @backstage/backend-tasks@0.3.6-next.1
  - @backstage/catalog-model@1.1.2-next.1
  - @backstage/config@1.0.3-next.1
  - @backstage/errors@1.1.2-next.1
  - @backstage/integration@1.3.2-next.1
  - @backstage/types@1.0.0
  - @backstage/plugin-auth-node@0.2.6-next.1
  - @backstage/plugin-catalog-backend@1.4.1-next.1
  - @backstage/plugin-catalog-node@1.1.1-next.1
  - @backstage/plugin-scaffolder-common@1.2.1-next.1

## 1.7.0-next.0

### Minor Changes

- 253453fa14: Added a new property called `additionalTemplateGlobals` which allows you to add global functions to the scaffolder nunjucks templates.
- 304305dd20: Add `allowAutoMerge` option for `publish:github` action
- 694bfe2d61: Add functionality to shutdown scaffolder tasks if they are stale

### Patch Changes

- b681275e69: Ignore .git directories in Template Editor, increase upload limit for dry-runs to 10MB.
- Updated dependencies
  - @backstage/catalog-model@1.1.2-next.0
  - @backstage/backend-plugin-api@0.1.3-next.0
  - @backstage/plugin-catalog-backend@1.4.1-next.0
  - @backstage/catalog-client@1.1.1-next.0
  - @backstage/plugin-catalog-node@1.1.1-next.0
  - @backstage/plugin-scaffolder-common@1.2.1-next.0
  - @backstage/backend-common@0.15.2-next.0
  - @backstage/backend-tasks@0.3.6-next.0
  - @backstage/plugin-auth-node@0.2.6-next.0
  - @backstage/config@1.0.3-next.0
  - @backstage/errors@1.1.2-next.0
  - @backstage/integration@1.3.2-next.0
  - @backstage/types@1.0.0

## 1.6.0

### Minor Changes

- ea2eee9e6a: Add the option for a homepage when using the `github:publish` action
- 8872cc735d: Fixed a bug in plugin-scaffolder-backend where it ignores the skip migration database options.

  To use this new implementation you need to create the instance of `DatabaseTaskStore` using the `PluginDatabaseManager` instead of `Knex`;

  ```
  import { DatabaseManager, getRootLogger, loadBackendConfig } from '@backstage/backend-common';
  import { DatabaseTaskStore } from '@backstage/plugin-scaffolder-backend';

  const config = await loadBackendConfig({ argv: process.argv, logger: getRootLogger() });
  const databaseManager = DatabaseManager.fromConfig(config, { migrations: { skip: true } });
  const databaseTaskStore = await DatabaseTaskStore.create(databaseManager);
  ```

- 7db9613671: Added `projectId` for gitlab projects to be displayed in the `gitlab:publish` output
- d1f7ba58e3: Added `repositoryId` output when create a repository in Azure
- 1ff817b3f0: add entity metadata to the template info type

### Patch Changes

- eadf56bbbf: Bump `git-url-parse` version to `^13.0.0`
- de8ee4afe3: Provide information about the user into scaffolder template action's context
- 096631e571: Added support for handling broken symlinks within the scaffolder backend. This is intended for templates that may hold a symlink that is invalid at build time but valid within the destination repo.
- 0d8d650e32: Applied the fix from version 1.5.1 of this package, which is part of the v1.5.1 release of Backstage.
- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- 2df9955f4a: Removed the depreacated `publish:file` action, use the template editor to test templates instead.
- 0ecc9a6784: Properly set `ctx.isDryRun` when running actions in dry run mode. Also always log action inputs for debugging purposes when running in dry run mode.
- 6b9f6c0a4d: Added alpha `scaffolderPlugin` to be used with experimental backend system.
- 83c037cd46: Disable octokit throttling in publish:github:pull-request
- 2cbd533426: Uptake the `IdentityApi` change to use `getIdentity` instead of `authenticate` for retrieving the logged in users identity.
- ef9ab322de: Minor API signatures cleanup
- 50467bc15b: The number of task workers used to execute templates now default to 3, rather than 1.
- Updated dependencies
  - @backstage/backend-plugin-api@0.1.2
  - @backstage/backend-common@0.15.1
  - @backstage/plugin-auth-node@0.2.5
  - @backstage/plugin-catalog-node@1.1.0
  - @backstage/integration@1.3.1
  - @backstage/plugin-catalog-backend@1.4.0
  - @backstage/catalog-client@1.1.0
  - @backstage/catalog-model@1.1.1
  - @backstage/config@1.0.2
  - @backstage/errors@1.1.1
  - @backstage/plugin-scaffolder-common@1.2.0

## 1.6.0-next.3

### Patch Changes

- 50467bc15b: The number of task workers used to execute templates now default to 3, rather than 1.
- Updated dependencies
  - @backstage/plugin-catalog-node@1.1.0-next.2
  - @backstage/backend-plugin-api@0.1.2-next.2
  - @backstage/catalog-client@1.1.0-next.2
  - @backstage/catalog-model@1.1.1-next.0
  - @backstage/config@1.0.2-next.0
  - @backstage/errors@1.1.1-next.0
  - @backstage/integration@1.3.1-next.2
  - @backstage/plugin-catalog-backend@1.4.0-next.3
  - @backstage/backend-common@0.15.1-next.3
  - @backstage/plugin-scaffolder-common@1.2.0-next.1
  - @backstage/plugin-auth-node@0.2.5-next.3

## 1.6.0-next.2

### Minor Changes

- d1f7ba58e3: Added `repositoryId` output when create a repository in Azure

### Patch Changes

- eadf56bbbf: Bump `git-url-parse` version to `^13.0.0`
- 096631e571: Added support for handling broken symlinks within the scaffolder backend. This is intended for templates that may hold a symlink that is invalid at build time but valid within the destination repo.
- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- 6b9f6c0a4d: Added alpha `scaffolderPlugin` to be used with experimental backend system.
- 83c037cd46: Disable octokit throttling in publish:github:pull-request
- 2cbd533426: Uptake the `IdentityApi` change to use `getIdentity` instead of `authenticate` for retrieving the logged in users identity.
- Updated dependencies
  - @backstage/backend-plugin-api@0.1.2-next.1
  - @backstage/plugin-catalog-node@1.0.2-next.1
  - @backstage/backend-common@0.15.1-next.2
  - @backstage/integration@1.3.1-next.1
  - @backstage/plugin-catalog-backend@1.4.0-next.2
  - @backstage/plugin-auth-node@0.2.5-next.2
  - @backstage/catalog-client@1.0.5-next.1

## 1.6.0-next.1

### Minor Changes

- 7db9613671: Added `projectId` for gitlab projects to be displayed in the `gitlab:publish` output

### Patch Changes

- 0d8d650e32: Applied the fix from version 1.5.1 of this package, which is part of the v1.5.1 release of Backstage.
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.1
  - @backstage/plugin-catalog-backend@1.4.0-next.1

## 1.6.0-next.0

### Minor Changes

- ea2eee9e6a: Add the option for a homepage when using the `github:publish` action
- 8872cc735d: Fixed a bug in plugin-scaffolder-backend where it ignores the skip migration database options.

  To use this new implementation you need to create the instance of `DatabaseTaskStore` using the `PluginDatabaseManager` instead of `Knex`;

  ```
  import { DatabaseManager, getRootLogger, loadBackendConfig } from '@backstage/backend-common';
  import { DatabaseTaskStore } from '@backstage/plugin-scaffolder-backend';

  const config = await loadBackendConfig({ argv: process.argv, logger: getRootLogger() });
  const databaseManager = DatabaseManager.fromConfig(config, { migrations: { skip: true } });
  const databaseTaskStore = await DatabaseTaskStore.create(databaseManager);
  ```

- 1ff817b3f0: add entity metadata to the template info type

### Patch Changes

- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- 2df9955f4a: Removed the depreacated `publish:file` action, use the template editor to test templates instead.
- ef9ab322de: Minor API signatures cleanup
- Updated dependencies
  - @backstage/backend-common@0.15.1-next.0
  - @backstage/plugin-catalog-backend@1.3.2-next.0
  - @backstage/backend-plugin-api@0.1.2-next.0
  - @backstage/catalog-client@1.0.5-next.0
  - @backstage/integration@1.3.1-next.0
  - @backstage/plugin-scaffolder-common@1.2.0-next.0
  - @backstage/plugin-catalog-node@1.0.2-next.0

## 1.5.1

### Patch Changes

- Fix minimum required version for `vm2`

## 1.5.0

### Minor Changes

- c4b452e16a: Starting the implementation of the Wizard page for the `next` scaffolder plugin
- 593dea6710: Add support for Basic Auth for Bitbucket Server.
- 3b7930b3e5: Add support for Bearer Authorization header / token-based auth at Git commands.
- 3f1316f1c5: User Bearer Authorization header at Git commands with token-based auth at Bitbucket Server.
- eeff5046ae: Updated `publish:gitlab:merge-request` action to allow commit updates and deletes
- 692d5d3405: Added `reviewers` and `teamReviewers` parameters to `publish:github:pull-request` action to add reviewers on the pull request created by the action

### Patch Changes

- fc8a5f797b: Add a `publish:gerrit:review` scaffolder action
- c971afbf21: The `publish:file` action has been deprecated in favor of testing templates using the template editor instead. Note that this action is not and was never been installed by default.
- b10b6c4aa4: Fix issue on Windows where templated files where not properly skipped as intended.
- 56e1b4b89c: Fixed typos in alpha types.
- dad0f65494: Fail gracefully if an invalid `Authorization` header is passed to `POST /v2/tasks`
- 014b3b7776: Add missing `res.end()` in scaffolder backend `EventStream` usage
- Updated dependencies
  - @backstage/backend-common@0.15.0
  - @backstage/backend-plugin-api@0.1.1
  - @backstage/plugin-catalog-node@1.0.1
  - @backstage/integration@1.3.0
  - @backstage/plugin-catalog-backend@1.3.1

## 1.5.0-next.2

### Minor Changes

- 692d5d3405: Added `reviewers` and `teamReviewers` parameters to `publish:github:pull-request` action to add reviewers on the pull request created by the action

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.3.1-next.2

## 1.5.0-next.1

### Minor Changes

- c4b452e16a: Starting the implementation of the Wizard page for the `next` scaffolder plugin

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0-next.1
  - @backstage/integration@1.3.0-next.1
  - @backstage/plugin-catalog-backend@1.3.1-next.1

## 1.5.0-next.0

### Minor Changes

- 593dea6710: Add support for Basic Auth for Bitbucket Server.
- 3b7930b3e5: Add support for Bearer Authorization header / token-based auth at Git commands.
- 3f1316f1c5: User Bearer Authorization header at Git commands with token-based auth at Bitbucket Server.
- eeff5046ae: Updated `publish:gitlab:merge-request` action to allow commit updates and deletes

### Patch Changes

- fc8a5f797b: Add a `publish:gerrit:review` scaffolder action
- 014b3b7776: Add missing `res.end()` in scaffolder backend `EventStream` usage
- Updated dependencies
  - @backstage/backend-common@0.15.0-next.0
  - @backstage/integration@1.3.0-next.0
  - @backstage/backend-plugin-api@0.1.1-next.0
  - @backstage/plugin-catalog-backend@1.3.1-next.0
  - @backstage/plugin-catalog-node@1.0.1-next.0

## 1.4.0

### Minor Changes

- e1a08d872c: Added optional assignee parameter for Gitlab Merge Request action
- dab9bcf2e7: Add `protectEnforceAdmins` as an option to GitHub publish actions
- 4baf8a4ece: Update GitLab Merge Request Action to allow source branch to be deleted
- 91c1d12123: Export experimental `scaffolderCatalogExtension` for the new backend system. This export is not considered stable and should not be used in production.
- d10ccc2ed1: Introduced audit log message when a new scaffolder task is created
- 2db07887cb: Added two new scaffolder actions: `github:repo:create` and `github:repo:push`

### Patch Changes

- ff316b86d8: Add `copyWithoutTemplating` to the fetch template action input. `copyWithoutTemplating` also accepts an array of glob patterns. Contents of matched files or directories are copied without being processed, but paths are subject to rendering.

  Deprecate `copyWithoutRender` in favor of `copyWithoutTemplating`.

- 801d606909: Improve error messaging when passing in malformed auth
- 089d846962: Fix issues with optional directories and files
- ea6dcb84a4: Don't resolve symlinks, treat them as binary files and copy them as-is
- af02f54483: new setUserAsOwner flag for publish:gitlab action

  The field default is `false`. When true it will use the token configured in the gitlab integration for the matching host, to try and set the user logged in via `repoUrlPicker` `requestUserCredentials` OAuth flow as owner of the repository created in GitLab.

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 4e9a90e307: Updated dependency `luxon` to `^3.0.0`.
- 72622d9143: Updated dependency `yaml` to `^2.0.0`.
- 8006d0f9bf: Updated dependency `msw` to `^0.44.0`.
- 679b32172e: Updated dependency `knex` to `^2.0.0`.
- 511f49ee43: Updated dependency `octokit` to `^2.0.0`.
- 735853353b: Updated dependency `@octokit/webhooks` to `^10.0.0`.
- e2d7b76f43: Upgrade git-url-parse to 12.0.0.

  Motivation for upgrade is transitively upgrading parse-url which is vulnerable
  to several CVEs detected by Snyk.

  - SNYK-JS-PARSEURL-2935944
  - SNYK-JS-PARSEURL-2935947
  - SNYK-JS-PARSEURL-2936249

- 945a27fa6a: Add sourcePath option to publish:gerrit action
- 1764296a68: Allow to create Gerrit project using default owner
- Updated dependencies
  - @backstage/backend-plugin-api@0.1.0
  - @backstage/plugin-catalog-backend@1.3.0
  - @backstage/backend-common@0.14.1
  - @backstage/catalog-model@1.1.0
  - @backstage/plugin-catalog-node@1.0.0
  - @backstage/integration@1.2.2
  - @backstage/catalog-client@1.0.4
  - @backstage/errors@1.1.0
  - @backstage/plugin-scaffolder-common@1.1.2

## 1.4.0-next.3

### Minor Changes

- 91c1d12123: Export experimental `scaffolderCatalogExtension` for the new backend system. This export is not considered stable and should not be used in production.

### Patch Changes

- ea6dcb84a4: Don't resolve symlinks, treat them as binary files and copy them as-is
- af02f54483: new setUserAsOwner flag for publish:gitlab action

  The field default is `false`. When true it will use the token configured in the gitlab integration for the matching host, to try and set the user logged in via `repoUrlPicker` `requestUserCredentials` OAuth flow as owner of the repository created in GitLab.

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 4e9a90e307: Updated dependency `luxon` to `^3.0.0`.
- 72622d9143: Updated dependency `yaml` to `^2.0.0`.
- 511f49ee43: Updated dependency `octokit` to `^2.0.0`.
- 735853353b: Updated dependency `@octokit/webhooks` to `^10.0.0`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.1.0-next.0
  - @backstage/plugin-catalog-backend@1.3.0-next.3
  - @backstage/plugin-catalog-node@1.0.0-next.0
  - @backstage/backend-common@0.14.1-next.3
  - @backstage/catalog-client@1.0.4-next.2
  - @backstage/integration@1.2.2-next.3
  - @backstage/catalog-model@1.1.0-next.3

## 1.4.0-next.2

### Minor Changes

- 4baf8a4ece: Update GitLab Merge Request Action to allow source branch to be deleted
- 2db07887cb: Added two new scaffolder actions: `github:repo:create` and `github:repo:push`

### Patch Changes

- 679b32172e: Updated dependency `knex` to `^2.0.0`.
- e2d7b76f43: Upgrade git-url-parse to 12.0.0.

  Motivation for upgrade is transitively upgrading parse-url which is vulnerable
  to several CVEs detected by Snyk.

  - SNYK-JS-PARSEURL-2935944
  - SNYK-JS-PARSEURL-2935947
  - SNYK-JS-PARSEURL-2936249

- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/backend-common@0.14.1-next.2
  - @backstage/plugin-catalog-backend@1.2.1-next.2
  - @backstage/integration@1.2.2-next.2

## 1.4.0-next.1

### Patch Changes

- 801d606909: Improve error messaging when passing in malformed auth
- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.1
  - @backstage/backend-common@0.14.1-next.1
  - @backstage/errors@1.1.0-next.0
  - @backstage/plugin-catalog-backend@1.2.1-next.1
  - @backstage/catalog-client@1.0.4-next.1
  - @backstage/integration@1.2.2-next.1

## 1.4.0-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.1-next.0
  - @backstage/catalog-model@1.1.0-next.0
  - @backstage/integration@1.2.2-next.0
  - @backstage/plugin-catalog-backend@1.2.1-next.0
  - @backstage/catalog-client@1.0.4-next.0
  - @backstage/plugin-scaffolder-common@1.1.2-next.0

## 1.3.0

### Minor Changes

- 35a26131b3: **DEPRECATION**: The `projectid` input parameters to the `publish:gitlab:merge-request`, it's no longer required as it can be decoded from the `repoUrl` input parameter.
  **DEPRECATION**: The `projectid` output of the action in favour of `projectPath`
- 72dfcbc8bf: A new scaffolder action has been added: `gerrit:publish`
- ce0d8d7eb1: Fixed a bug in `publish:github` action that didn't permit to add users as collaborators.
  This fix required changing the way parameters are passed to the action.
  In order to add a team as collaborator, now you must use the `team` field instead of `username`.
  In order to add a user as collaborator, you must use the `user` field.

  It's still possible to use the field `username` but is deprecated in favor of `team`.

  ```yaml
  - id: publish
    name: Publish
    action: publish:github
    input:
      repoUrl: ...
      collaborators:
        - access: ...
          team: my_team
        - access: ...
          user: my_username
  ```

- 582003a059: - Added an optional `list` method on the `TaskBroker` and `TaskStore` interface to list tasks by an optional `userEntityRef`
  - Implemented a `list` method on the `DatabaseTaskStore` class to list tasks by an optional `userEntityRef`
  - Added a route under `/v2/tasks` to list tasks by a `userEntityRef` using the `createdBy` query parameter
- c042c5eaff: Add an option to not protect the default branch.
- f93af969cd: Added the ability to support running of templates that are not in the `default` namespace
- 3500c13a33: Added a new `/v2/dry-run` endpoint that allows for a synchronous dry run of a provided template. A `supportsDryRun` option has been added to `createTemplateAction`, which signals whether the action should be executed during dry runs. When enabled, the action context will have the new `isDryRun` property set to signal if the action is being executed during a dry run.

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- 6901f6be4a: Adds more of an explanation when the `publish:github` scaffolder action fails to create a repository.
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.2.0
  - @backstage/backend-common@0.14.0
  - @backstage/integration@1.2.1
  - @backstage/catalog-client@1.0.3
  - @backstage/catalog-model@1.0.3
  - @backstage/plugin-scaffolder-common@1.1.1

## 1.3.0-next.2

### Minor Changes

- ce0d8d7eb1: Fixed a bug in `publish:github` action that didn't permit to add users as collaborators.
  This fix required changing the way parameters are passed to the action.
  In order to add a team as collaborator, now you must use the `team` field instead of `username`.
  In order to add a user as collaborator, you must use the `user` field.

  It's still possible to use the field `username` but is deprecated in favor of `team`.

  ```yaml
  - id: publish
    name: Publish
    action: publish:github
    input:
      repoUrl: ...
      collaborators:
        - access: ...
          team: my_team
        - access: ...
          user: my_username
  ```

- 582003a059: - Added an optional `list` method on the `TaskBroker` and `TaskStore` interface to list tasks by an optional `userEntityRef`
  - Implemented a `list` method on the `DatabaseTaskStore` class to list tasks by an optional `userEntityRef`
  - Added a route under `/v2/tasks` to list tasks by a `userEntityRef` using the `createdBy` query parameter

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.0-next.2
  - @backstage/integration@1.2.1-next.2
  - @backstage/plugin-catalog-backend@1.2.0-next.2

## 1.3.0-next.1

### Minor Changes

- c042c5eaff: Add an option to not protect the default branch.

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/backend-common@0.13.6-next.1
  - @backstage/catalog-client@1.0.3-next.0
  - @backstage/integration@1.2.1-next.1
  - @backstage/plugin-catalog-backend@1.2.0-next.1
  - @backstage/catalog-model@1.0.3-next.0
  - @backstage/plugin-scaffolder-common@1.1.1-next.0

## 1.3.0-next.0

### Minor Changes

- 72dfcbc8bf: A new scaffolder action has been added: `gerrit:publish`

### Patch Changes

- 6901f6be4a: Adds more of an explanation when the `publish:github` scaffolder action fails to create a repository.
- Updated dependencies
  - @backstage/backend-common@0.13.6-next.0
  - @backstage/integration@1.2.1-next.0
  - @backstage/plugin-catalog-backend@1.2.0-next.0

## 1.2.0

### Minor Changes

- 9818112d12: Update the `github:publish` action to allow passing required status check
  contexts before merging to the main branch.
- f8baf7df44: Added the ability to reference the user in the `template.yaml` manifest
- 8d5a2238a9: Split `publish:bitbucket` into `publish:bitbucketCloud` and `publish:bitbucketServer`.

  In order to migrate from the deprecated action, you need to replace the use of action
  `publish:bitbucket` in your templates with the use of either `publish:bitbucketCloud`
  or `publish:bitbucketServer` - depending on which destination SCM provider you use.

  Additionally, these actions will not utilize `integrations.bitbucket` anymore,
  but `integrations.bitbucketCloud` or `integrations.bitbucketServer` respectively.
  You may or may not have migrated to these already.

  As described in a previous changeset, using these two replacement integrations configs
  will not compromise use cases which still rely on `integrations.bitbucket` as this was
  set up in a backwards compatible way.

  Additionally, please mind that the option `enableLFS` is only available (and always was)
  for Bitbucket Server use cases and therefore, is not even part of the schema for
  `publish:bitbucketCloud` anymore.

### Patch Changes

- 0fc65cbf89: Override default commit message and author details in GitHub, Azure, bitbucket
- cfc0f19699: Updated dependency `fs-extra` to `10.1.0`.
- Updated dependencies
  - @backstage/backend-common@0.13.3
  - @backstage/plugin-catalog-backend@1.1.2
  - @backstage/integration@1.2.0
  - @backstage/plugin-scaffolder-common@1.1.0
  - @backstage/config@1.0.1
  - @backstage/catalog-client@1.0.2
  - @backstage/catalog-model@1.0.2

## 1.2.0-next.1

### Minor Changes

- f8baf7df44: Added the ability to reference the user in the `template.yaml` manifest

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.2
  - @backstage/plugin-catalog-backend@1.1.2-next.2
  - @backstage/plugin-scaffolder-common@1.1.0-next.0
  - @backstage/config@1.0.1-next.0
  - @backstage/catalog-model@1.0.2-next.0
  - @backstage/integration@1.2.0-next.1
  - @backstage/catalog-client@1.0.2-next.0

## 1.2.0-next.0

### Minor Changes

- 9818112d12: Update the `github:publish` action to allow passing required status check
  contexts before merging to the main branch.
- 8d5a2238a9: Split `publish:bitbucket` into `publish:bitbucketCloud` and `publish:bitbucketServer`.

  In order to migrate from the deprecated action, you need to replace the use of action
  `publish:bitbucket` in your templates with the use of either `publish:bitbucketCloud`
  or `publish:bitbucketServer` - depending on which destination SCM provider you use.

  Additionally, these actions will not utilize `integrations.bitbucket` anymore,
  but `integrations.bitbucketCloud` or `integrations.bitbucketServer` respectively.
  You may or may not have migrated to these already.

  As described in a previous changeset, using these two replacement integrations configs
  will not compromise use cases which still rely on `integrations.bitbucket` as this was
  set up in a backwards compatible way.

  Additionally, please mind that the option `enableLFS` is only available (and always was)
  for Bitbucket Server use cases and therefore, is not even part of the schema for
  `publish:bitbucketCloud` anymore.

### Patch Changes

- 0fc65cbf89: Override default commit message and author details in GitHub, Azure, bitbucket
- cfc0f19699: Updated dependency `fs-extra` to `10.1.0`.
- Updated dependencies
  - @backstage/backend-common@0.13.3-next.0
  - @backstage/integration@1.2.0-next.0
  - @backstage/plugin-catalog-backend@1.1.2-next.0

## 1.1.0

### Minor Changes

- 2a7d52ca2c: Override default commit message and author details in GitLab action
- f5f921dafb: Add new `draft` option to the `publish:github:pull-request` action.

### Patch Changes

- 64d9a031a8: build(deps): bump `isbinaryfile` from 4.0.8 to 5.0.0
- 2f3d3a1eae: build(deps): bump `@gitbeaker/core` from 34.6.0 to 35.6.0
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.1.0
  - @backstage/integration@1.1.0
  - @backstage/catalog-model@1.0.1
  - @backstage/backend-common@0.13.2
  - @backstage/catalog-client@1.0.1
  - @backstage/plugin-scaffolder-common@1.0.1

## 1.1.0-next.2

### Patch Changes

- 64d9a031a8: build(deps): bump `isbinaryfile` from 4.0.8 to 5.0.0
- 2f3d3a1eae: build(deps): bump `@gitbeaker/core` from 34.6.0 to 35.6.0
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.1.0-next.2
  - @backstage/catalog-model@1.0.1-next.1

## 1.1.0-next.1

### Minor Changes

- 2a7d52ca2c: Override default commit message and author details in GitLab action
- f5f921dafb: Add new `draft` option to the `publish:github:pull-request` action.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@1.1.0-next.1
  - @backstage/integration@1.1.0-next.1
  - @backstage/backend-common@0.13.2-next.1

## 1.0.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.0.1-next.0
  - @backstage/plugin-catalog-backend@1.0.1-next.0
  - @backstage/backend-common@0.13.2-next.0
  - @backstage/integration@1.0.1-next.0
  - @backstage/catalog-client@1.0.1-next.0
  - @backstage/plugin-scaffolder-common@1.0.1-next.0

## 1.0.0

### Major Changes

- b58c70c223: This package has been promoted to v1.0! To understand how this change affects the package, please check out our [versioning policy](https://backstage.io/docs/overview/versioning-policy).

### Patch Changes

- 765639f98c: Added new `github:issues:label` action to apply labels to issues, and also output `pullRequestNumber` from `publish:github:pull-request`.
- efc73db10c: Use `better-sqlite3` instead of `@vscode/sqlite3`
- c8475ab3bb: Adding some documentation for exported things
- f24ef7864e: Minor typo fixes
- Updated dependencies
  - @backstage/plugin-catalog-backend@1.0.0
  - @backstage/backend-common@0.13.1
  - @backstage/catalog-model@1.0.0
  - @backstage/plugin-scaffolder-common@1.0.0
  - @backstage/integration@1.0.0
  - @backstage/catalog-client@1.0.0
  - @backstage/config@1.0.0
  - @backstage/errors@1.0.0
  - @backstage/types@1.0.0

## 0.18.0

### Minor Changes

- 310e905998: The following deprecations are now breaking and have been removed:

  - **BREAKING**: Support for `backstage.io/v1beta2` Software Templates has been removed. Please migrate your legacy templates to the new `scaffolder.backstage.io/v1beta3` `apiVersion` by following the [migration guide](https://backstage.io/docs/features/software-templates/migrating-from-v1beta2-to-v1beta3)

  - **BREAKING**: Removed the deprecated `TemplateMetadata`. Please use `TemplateInfo` instead.

  - **BREAKING**: Removed the deprecated `context.baseUrl`. It's now available on `context.templateInfo.baseUrl`.

  - **BREAKING**: Removed the deprecated `DispatchResult`, use `TaskBrokerDispatchResult` instead.

  - **BREAKING**: Removed the deprecated `runCommand`, use `executeShellCommond` instead.

  - **BREAKING**: Removed the deprecated `Status` in favour of `TaskStatus` instead.

  - **BREAKING**: Removed the deprecated `TaskState` in favour of `CurrentClaimedTask` instead.

- f9c7bdd899: **BREAKING**:

  - Removed the `createFetchCookiecutterAction` export, please use the `@backstage/plugin-scaffolder-backend-module-cookiecutter` package explicitly (see [its README](https://github.com/backstage/backstage/tree/master/plugins/scaffolder-backend-module-cookiecutter) for installation instructions).
  - Removed the `containerRunner` argument from the types `RouterOptions` (as used by `createRouter`) and `CreateBuiltInActionsOptions` (as used by `createBuiltinActions`).

- 5afbd16d43: **BREAKING**: Removed the previously deprecated `OctokitProvider` class.

### Patch Changes

- ab7cd7d70e: Do some groundwork for supporting the `better-sqlite3` driver, to maybe eventually replace `@vscode/sqlite3` (#9912)
- 8122e27717: Updating documentation for supporting `apiVersion: scaffolder.backstage.io/v1beta3`
- e0a69ba49f: build(deps): bump `fs-extra` from 9.1.0 to 10.0.1
- 3c2bc73901: Use `setupRequestMockHandlers` from `@backstage/backend-test-utils`
- 458d16869c: Allow passing more repo configuration for `publish:github` action
- Updated dependencies
  - @backstage/backend-common@0.13.0
  - @backstage/plugin-catalog-backend@0.24.0
  - @backstage/plugin-scaffolder-common@0.3.0
  - @backstage/catalog-model@0.13.0
  - @backstage/catalog-client@0.9.0

## 0.18.0-next.0

### Minor Changes

- 310e905998: The following deprecations are now breaking and have been removed:

  - **BREAKING**: Support for `backstage.io/v1beta2` Software Templates has been removed. Please migrate your legacy templates to the new `scaffolder.backstage.io/v1beta3` `apiVersion` by following the [migration guide](https://backstage.io/docs/features/software-templates/migrating-from-v1beta2-to-v1beta3)

  - **BREAKING**: Removed the deprecated `TemplateMetadata`. Please use `TemplateInfo` instead.

  - **BREAKING**: Removed the deprecated `context.baseUrl`. It's now available on `context.templateInfo.baseUrl`.

  - **BREAKING**: Removed the deprecated `DispatchResult`, use `TaskBrokerDispatchResult` instead.

  - **BREAKING**: Removed the deprecated `runCommand`, use `executeShellCommond` instead.

  - **BREAKING**: Removed the deprecated `Status` in favour of `TaskStatus` instead.

  - **BREAKING**: Removed the deprecated `TaskState` in favour of `CurrentClaimedTask` instead.

- f9c7bdd899: **BREAKING**:

  - Removed the `createFetchCookiecutterAction` export, please use the `@backstage/plugin-scaffolder-backend-module-cookiecutter` package explicitly (see [its README](https://github.com/backstage/backstage/tree/master/plugins/scaffolder-backend-module-cookiecutter) for installation instructions).
  - Removed the `containerRunner` argument from the types `RouterOptions` (as used by `createRouter`) and `CreateBuiltInActionsOptions` (as used by `createBuiltinActions`).

- 5afbd16d43: **BREAKING**: Removed the previously deprecated `OctokitProvider` class.

### Patch Changes

- ab7cd7d70e: Do some groundwork for supporting the `better-sqlite3` driver, to maybe eventually replace `@vscode/sqlite3` (#9912)
- 8122e27717: Updating documentation for supporting `apiVersion: scaffolder.backstage.io/v1beta3`
- e0a69ba49f: build(deps): bump `fs-extra` from 9.1.0 to 10.0.1
- 3c2bc73901: Use `setupRequestMockHandlers` from `@backstage/backend-test-utils`
- 458d16869c: Allow passing more repo configuration for `publish:github` action
- Updated dependencies
  - @backstage/backend-common@0.13.0-next.0
  - @backstage/plugin-catalog-backend@0.24.0-next.0
  - @backstage/plugin-scaffolder-common@0.3.0-next.0
  - @backstage/catalog-model@0.13.0-next.0
  - @backstage/catalog-client@0.9.0-next.0

## 0.17.3

### Patch Changes

- 5c7f2343ea: Applied fix from version 0.17.2 of this package, which is part of the v0.69.2 release of Backstage.
- 899f196af5: Use `getEntityByRef` instead of `getEntityByName` in the catalog client
- 34af86517c: ensure `apiBaseUrl` being set for Bitbucket integrations, replace hardcoded defaults
- d6deb5e440: Set timeout for scaffolder octokit client
- 83a83381b0: Use the new `processingResult` export from the catalog backend
- 7372f29473: Cleanup API report
- c7f6424a26: Applied fix from `v0.17.1` of this package which is part of the `v0.69.1` release of Backstage.
- 36aa63022b: Use `CompoundEntityRef` instead of `EntityName`, and `getCompoundEntityRef` instead of `getEntityName`, from `@backstage/catalog-model`.
- 8119a9e011: Fix the support for custom defaultBranch values for Bitbucket Cloud at the `publish:bitbucket` scaffolder action.
- Updated dependencies
  - @backstage/catalog-model@0.12.0
  - @backstage/catalog-client@0.8.0
  - @backstage/plugin-catalog-backend@0.23.0
  - @backstage/backend-common@0.12.0
  - @backstage/integration@0.8.0
  - @backstage/plugin-scaffolder-backend-module-cookiecutter@0.2.3
  - @backstage/plugin-scaffolder-common@0.2.3

## 0.17.2

### Patch Changes

- bug: `repoUrl` does not have a protocol in `publish:github:pull-request`

## 0.17.1

### Patch Changes

- bug: fixing `repoUrl` resolution for `publish:github:pull-request` action

## 0.17.0

### Minor Changes

- 91c6faeb7b: - **BREAKING** - the `/v2/tasks` endpoint now takes `templateRef` instead of `templateName` in the POST body. This should be a valid stringified `entityRef`.
- 7f193ff019: - **BREAKING** - `DatabaseTaskStore()` constructor is now removed. Please use the `DatabaseTaskStore.create()` method instead.

  - **BREAKING** - `TaskStore.createTask()` method now only takes one argument of type `TaskStoreCreateTaskOptions` which encapsulates the `spec` and `secrets`

  ```diff
  - TaskStore.createTask(spec, secrets)
  + TaskStore.createTask({ spec, secrets})
  ```

  - **BREAKING** - `TaskBroker.dispatch()` method now only takes one argument of type `TaskBrokerDispatchOptions` which encapsulates the `spec` and `secrets`

  ```diff
  - TaskBroker.dispatch(spec, secrets)
  + TaskBroker.dispatch({ spec, secrets})
  ```

- 9d9b2bab47: - **BREAKING** - Removed the re-export of types `TaskSpec` `TaskSpecV1Beta2` and `TaskSpecV1Beta3` these should now be import from `@backstage/plugin-scaffolder-common` directly.
  - **BREAKING** - Removed the `observe` method from the `TaskBroker` interface, this has now been replaced with an `Observable` implementation under `event# @backstage/plugin-scaffolder-backend.

### Patch Changes

- 9d9b2bab47: - **DEPRECATED** - Deprecated the `runCommand` export in favour of `executeShellCommand`. Please migrate to using the new method.
  - Added a type parameter to `TaskStoreEmitOptions` to type the `body` property
- 65a7939c6c: - **DEPRECATED** - `TaskState` has been deprecated in favour of `CurrentClaimedTask`
  - Narrowed the types from `JSONValue` to `JSONObject` as the usage is and should always be `JSONObject` for `complete` and `emitLog` `metadata` in `TaskContext`
- 67a7c02d26: Remove usages of `EntityRef` and `parseEntityName` from `@backstage/catalog-model`
- ed09ad8093: Updated usage of the `LocationSpec` type from `@backstage/catalog-model`, which is deprecated.
- 6981ac4ad2: - **DEPRECATED** - The `containerRunner` option passed to `createBuiltinActions` has now been deprecated.

  - **DEPRECATED** - The `createFetchCookiecutterAction` export has also been deprecated and will soon disappear from this plugin.

  The `fetch:cookiecutter` action will soon be removed from the default list of actions that are provided out of the box from the scaffolder plugin. It will still be supported, and maintained by the community, so you can install the package (`@backstage/plugin-scaffolder-backend-module-cookiecutter`) and pass it in as a custom action. Or you can migrate your templates to use [`fetch:template`](https://backstage.io/docs/features/software-templates/builtin-actions#migrating-from-fetchcookiecutter-to-fetchtemplate) with the `cookiecutterCompat` option.

- b1744f1153: - **DEPRECATED** - `OctokitProvider` has been deprecated and will be removed in upcoming versions
  This helper doesn't make sense to be export from the `plugin-scaffolder-backend` and possibly will be moved into the `integrations` package at a later date.
  All implementations have been moved over to a private implementation called `getOctokitOptions` which is then passed to the `Octokit` constructor. If you're using this API you should consider duplicating the logic that lives in `getOctokitOptions` and move away from the deprecated export.
- 0f37cdef19: Migrated over from the deprecated `spec.metadata` to `spec.templateInfo` for the `name` and the `baseUrl` of the template.
- 7f193ff019: - **DEPRECATED** - `Status` has been deprecated in favour of `TaskStatus`
  - **DEPRECATED** - `CompletedTaskState` has been deprecated in favour of `TaskCompletionState`
  - **DEPRECATED** - `DispatchResult` has been deprecated in favour of `TaskBrokerDispatchResult`
- df61ca71dd: Implemented required `getProcessorName` method for catalog processor.
- Updated dependencies
  - @backstage/backend-common@0.11.0
  - @backstage/plugin-catalog-backend@0.22.0
  - @backstage/plugin-scaffolder-common@0.2.2
  - @backstage/catalog-model@0.11.0
  - @backstage/catalog-client@0.7.2
  - @backstage/plugin-scaffolder-backend-module-cookiecutter@0.2.2
  - @backstage/integration@0.7.5

## 0.16.1

### Patch Changes

- Fix for the previous release with missing type declarations.
- Updated dependencies
  - @backstage/backend-common@0.10.9
  - @backstage/catalog-client@0.7.1
  - @backstage/catalog-model@0.10.1
  - @backstage/config@0.1.15
  - @backstage/errors@0.2.2
  - @backstage/integration@0.7.4
  - @backstage/types@0.1.3
  - @backstage/plugin-catalog-backend@0.21.5
  - @backstage/plugin-scaffolder-backend-module-cookiecutter@0.2.1
  - @backstage/plugin-scaffolder-common@0.2.1

## 0.16.0

### Minor Changes

- 661594bf43: **BREAKING**: Updated `TemplateAction` and related types to have its type parameter extend `JsonObject` instead of `InputBase`. The `createTemplateAction` has also been updated to pass through the `TInput` type parameter to the return type, meaning the `TemplateAction` retains its type. This can lead to breakages during type checking especially within tests.
- 8db2b671c6: **BREAKING**: `ctx.token` is now `ctx.secrets.backstageToken` in Actions. Please update any of your Actions that might call out to Backstage API's with this token.
- 5a1594330e: **BREAKING** - Removed the `CatalogEntityClient` export. This is no longer provider by this package,
  but you can implement one pretty simply yourself using the `CatalogApi` and applying filters to fetch templates.
- 7d3471db94: Remove the previously deprecated `scaffolder.provider` config for all providers.
  This config is no longer used anywhere, and adopters should use [`integrations` config](https://backstage.io/docs/integrations) instead.

### Patch Changes

- 1ed305728b: Bump `node-fetch` to version 2.6.7 and `cross-fetch` to version 3.1.5
- 3e59f90b51: Fix error handling of the `runCommand` helper to return `Error`
  instance.
- c77c5c7eb6: Added `backstage.role` to `package.json`
- 216725b434: Updated to use new names for `parseLocationRef` and `stringifyLocationRef`
- e72d371296: Use `TemplateEntityV1beta2` from `@backstage/plugin-scaffolder-common` instead
  of `@backstage/catalog-model`.
- 1433045c08: Removed unused `helmet` dependency.
- 27eccab216: Replaces use of deprecated catalog-model constants.
- Updated dependencies
  - @backstage/plugin-scaffolder-common@0.2.0
  - @backstage/plugin-catalog-backend@0.21.4
  - @backstage/backend-common@0.10.8
  - @backstage/catalog-client@0.7.0
  - @backstage/errors@0.2.1
  - @backstage/integration@0.7.3
  - @backstage/catalog-model@0.10.0
  - @backstage/config@0.1.14
  - @backstage/types@0.1.2
  - @backstage/plugin-scaffolder-backend-module-cookiecutter@0.2.0

## 0.15.24

### Patch Changes

- 2441d1cf59: chore(deps): bump `knex` from 0.95.6 to 1.0.2

  This also replaces `sqlite3` with `@vscode/sqlite3` 5.0.7

- 2bd5f24043: fix for the `gitlab:publish` action to use the `oauthToken` key when creating a
  `Gitlab` client. This only happens if `ctx.input.token` is provided else the key `token` will be used.
- 898a56578c: Bump `vm2` to version 3.9.6
- Updated dependencies
  - @backstage/catalog-client@0.6.0
  - @backstage/backend-common@0.10.7
  - @backstage/plugin-catalog-backend@0.21.3
  - @backstage/plugin-scaffolder-backend-module-cookiecutter@0.1.11

## 0.15.24-next.0

### Patch Changes

- 2441d1cf59: chore(deps): bump `knex` from 0.95.6 to 1.0.2

  This also replaces `sqlite3` with `@vscode/sqlite3` 5.0.7

- 2bd5f24043: fix for the `gitlab:publish` action to use the `oauthToken` key when creating a
  `Gitlab` client. This only happens if `ctx.input.token` is provided else the key `token` will be used.
- Updated dependencies
  - @backstage/backend-common@0.10.7-next.0
  - @backstage/plugin-catalog-backend@0.21.3-next.0
  - @backstage/plugin-scaffolder-backend-module-cookiecutter@0.1.11-next.0

## 0.15.23

### Patch Changes

- 2e0dbb0e50: Migrate from deprecated package @octokit/rest to octokit
- c95df1631e: Added support for templating secrets into actions input, and also added an extra `token` input argument to all publishers to provide a token that would override the `integrations.config`.
  You can find more information over at [Writing Templates](https://backstage.io/docs/features/software-templates/writing-templates#using-the-users-oauth-token)
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.21.2
  - @backstage/backend-common@0.10.6
  - @backstage/plugin-scaffolder-backend-module-cookiecutter@0.1.10

## 0.15.23-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.6-next.0
  - @backstage/plugin-catalog-backend@0.21.2-next.1
  - @backstage/plugin-scaffolder-backend-module-cookiecutter@0.1.10-next.1

## 0.15.23-next.0

### Patch Changes

- 2e0dbb0e50: Migrate from deprecated package @octokit/rest to octokit
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.21.2-next.0
  - @backstage/plugin-scaffolder-backend-module-cookiecutter@0.1.10-next.0

## 0.15.22

### Patch Changes

- b09dd8f43b: chore(deps): bump `@gitbeaker/node` from 34.6.0 to 35.1.0
- ac2f1eeec0: This change is for adding the option of inputs on the `github:actions:dispatch` Backstage Action. This will allow users to pass data from Backstage to the GitHub Action.
- 0d5e846a78: Expose a new option to provide additional template filters via `@backstage/scaffolder-backend`'s `createRouter()` function.
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.21.1
  - @backstage/backend-common@0.10.5

## 0.15.21

### Patch Changes

- b05d303226: Added the ability to support supplying secrets when creating tasks in the `scaffolder-backend`.

  **deprecation**: Deprecated `ctx.token` from actions in the `scaffolder-backend`. Please move to using `ctx.secrets.backstageToken` instead.

  **deprecation**: Deprecated `task.token` in `TaskSpec` in the `scaffolder-backend`. Please move to using `task.secrets.backstageToken` instead.

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.21.0
  - @backstage/integration@0.7.2
  - @backstage/backend-common@0.10.4
  - @backstage/config@0.1.13
  - @backstage/catalog-model@0.9.10
  - @backstage/catalog-client@0.5.5
  - @backstage/plugin-scaffolder-backend-module-cookiecutter@0.1.9
  - @backstage/plugin-scaffolder-common@0.1.3

## 0.15.21-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-backend@0.21.0-next.0
  - @backstage/backend-common@0.10.4-next.0
  - @backstage/config@0.1.13-next.0
  - @backstage/catalog-model@0.9.10-next.0
  - @backstage/catalog-client@0.5.5-next.0
  - @backstage/integration@0.7.2-next.0
  - @backstage/plugin-scaffolder-backend-module-cookiecutter@0.1.9-next.0
  - @backstage/plugin-scaffolder-common@0.1.3-next.0

## 0.15.20

### Patch Changes

- 9fbd3b90ae: fix: Register plugin to prioritise Component kind for entityRef
- 451ef0aa07: Fix token pass-through for software templates using beta 3 version
- 5333451def: Cleaned up API exports
- 3b4d8caff6: Allow a GitHubCredentialsProvider to be passed to the GitHub scaffolder tasks actions.
- Updated dependencies
  - @backstage/config@0.1.12
  - @backstage/integration@0.7.1
  - @backstage/backend-common@0.10.3
  - @backstage/plugin-catalog-backend@0.20.0
  - @backstage/errors@0.2.0
  - @backstage/catalog-client@0.5.4
  - @backstage/catalog-model@0.9.9
  - @backstage/plugin-scaffolder-backend-module-cookiecutter@0.1.8

## 0.15.19

### Patch Changes

- 7d4b4e937c: Uptake changes to the GitHub Credentials Provider interface.
- d078377f67: Support navigating back to pre-filled templates to update inputs of scaffolder tasks for resubmission
- 5f8ceba1b1: Support custom file name for `catalog:write` action
- Updated dependencies
  - @backstage/backend-common@0.10.1
  - @backstage/plugin-catalog-backend@0.19.4
  - @backstage/plugin-scaffolder-common@0.1.2
  - @backstage/integration@0.7.0
  - @backstage/plugin-scaffolder-backend-module-cookiecutter@0.1.7

## 0.15.18

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.0
  - @backstage/catalog-client@0.5.3
  - @backstage/plugin-catalog-backend@0.19.3
  - @backstage/plugin-scaffolder-backend-module-cookiecutter@0.1.6

## 0.15.17

### Patch Changes

- eec0750d8d: Makes cookiecutter a default, but optional action based on if a containerRunner argument is passed in to createRouter or createBuiltinActions
- ed52f74ab3: Adding changes to create GitLab Merge Request using custom action
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.19.2
  - @backstage/backend-common@0.9.14
  - @backstage/catalog-model@0.9.8

## 0.15.16

### Patch Changes

- 2a3fb13718: Bump esbuild to ^0.14.1
- Updated dependencies
  - @backstage/backend-common@0.9.13
  - @backstage/plugin-catalog-backend@0.19.1

## 0.15.15

### Patch Changes

- 0398ea25d3: Removed unused scaffolder visibility configuration; this has been moved to publish actions. Deprecated scaffolder provider configuration keys; these should use the integrations configuration instead.
- b055a6addc: Align on usage of `cross-fetch` vs `node-fetch` in frontend vs backend packages, and remove some unnecessary imports of either one of them
- c6b44d80ad: Add options to spawn in runCommand helper
- Updated dependencies
  - @backstage/integration@0.6.10
  - @backstage/plugin-catalog-backend@0.19.0
  - @backstage/plugin-scaffolder-backend-module-cookiecutter@0.1.5
  - @backstage/backend-common@0.9.12

## 0.15.14

### Patch Changes

- a096e4c4d7: Switched to executing scaffolder templating in a secure context for any template based on nunjucks, as it is [not secure by default](https://mozilla.github.io/nunjucks/api.html#user-defined-templates-warning).
- f9352ab606: Removed all usages of `path.resolve` in order to ensure that template paths are resolved in a safe way.
- e634a47ce5: Fix bug where there was error log lines written when failing to `JSON.parse` things that were not `JSON` values.
- 42ebbc18c0: Bump gitbeaker to the latest version
- Updated dependencies
  - @backstage/errors@0.1.5
  - @backstage/plugin-catalog-backend@0.18.0
  - @backstage/backend-common@0.9.11

## 0.15.13

### Patch Changes

- 26eb174ce8: Skip empty file names when scaffolding with nunjucks
- ecdcbd08ee: Expose template metadata to custom action handler in Scaffolder.
- Updated dependencies
  - @backstage/catalog-client@0.5.2
  - @backstage/catalog-model@0.9.7
  - @backstage/backend-common@0.9.10
  - @backstage/plugin-catalog-backend@0.17.4

## 0.15.12

### Patch Changes

- 9990df8a1f: Expose some classes and interfaces public so TaskWorkers can run externally from the scaffolder API.
- b45a34fb15: Adds a new endpoint for consuming logs from the Scaffolder that uses long polling instead of Server Sent Events.

  This is useful if Backstage is accessed from an environment that doesn't support SSE correctly, which happens in combination with certain enterprise HTTP Proxy servers.

  It is intended to switch the endpoint globally for the whole instance.
  If you want to use it, you can provide a reconfigured API to the `scaffolderApiRef`:

  ```tsx
  // packages/app/src/apis.ts

  // ...
  import {
    scaffolderApiRef,
    ScaffolderClient,
  } from '@backstage/plugin-scaffolder';

  export const apis: AnyApiFactory[] = [
    // ...

    createApiFactory({
      api: scaffolderApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        identityApi: identityApiRef,
        scmIntegrationsApi: scmIntegrationsApiRef,
      },
      factory: ({ discoveryApi, identityApi, scmIntegrationsApi }) =>
        new ScaffolderClient({
          discoveryApi,
          identityApi,
          scmIntegrationsApi,
          // use long polling instead of an eventsource
          useLongPollingLogs: true,
        }),
    }),
  ];
  ```

- a794c341ca: Fix a bug where only file mode 775 is considered an executable
- Updated dependencies
  - @backstage/backend-common@0.9.9
  - @backstage/catalog-client@0.5.1
  - @backstage/plugin-catalog-backend@0.17.3
  - @backstage/plugin-scaffolder-backend-module-cookiecutter@0.1.4

## 0.15.11

### Patch Changes

- 10615525f3: Switch to use the json and observable types from `@backstage/types`
- 41c49884d2: Start using the new `@backstage/types` package. Initially, this means using the `Observable` and `Json*` types from there. The types also remain in their old places but deprecated, and will be removed in a future release.
- e55a5dea09: Fixed bug where the mode of an executable file was ignored
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.17.2
  - @backstage/config@0.1.11
  - @backstage/errors@0.1.4
  - @backstage/integration@0.6.9
  - @backstage/backend-common@0.9.8
  - @backstage/catalog-model@0.9.6
  - @backstage/plugin-scaffolder-backend-module-cookiecutter@0.1.3
  - @backstage/plugin-scaffolder-common@0.1.1

## 0.15.10

### Patch Changes

- b149e94290: Allow `catalog:register` action to register optional locations
- 36e67d2f24: Internal updates to apply more strict checks to throw errors.
- Updated dependencies
  - @backstage/plugin-catalog-backend@0.17.1
  - @backstage/backend-common@0.9.7
  - @backstage/errors@0.1.3
  - @backstage/catalog-model@0.9.5

## 0.15.9

### Patch Changes

- 0f99f1170e: Make sure `sourcePath` of `publish:github:pull-request` can only be used to
  retrieve files from the workspace.

## 0.15.8

### Patch Changes

- 42c618abf6: Use `resolveSafeChildPath` in the `fetchContents` function to forbid reading files outside the base directory when a template is registered from a `file:` location.
- 18083d1821: Introduce the new `scaffolder.backstage.io/v1beta3` template kind with nunjucks support 🥋
- Updated dependencies
  - @backstage/integration@0.6.8
  - @backstage/plugin-catalog-backend@0.17.0

## 0.15.7

### Patch Changes

- ca3086a7ad: Fixed a bug where the `catalog:register` action would not return any entity when running towards recent versions of the catalog.
- Updated dependencies
  - @backstage/catalog-model@0.9.4
  - @backstage/backend-common@0.9.6
  - @backstage/catalog-client@0.5.0
  - @backstage/integration@0.6.7

## 0.15.6

### Patch Changes

- Updated dependencies
  - @backstage/integration@0.6.5
  - @backstage/catalog-client@0.4.0
  - @backstage/catalog-model@0.9.3
  - @backstage/backend-common@0.9.4
  - @backstage/config@0.1.10

## 0.15.5

### Patch Changes

- 618143c3c7: Action needed: If you are using the templates located at https://github.com/backstage/backstage/tree/master/ in your Backstage app directly using the URL via the `app-config.yaml`, you should copy over the templates inside your org and import from there. The templates have now been moved to https://github.com/backstage/software-templates. See https://github.com/backstage/backstage/issues/6415 for explanation.
- cfade02127: Change hardcoded branch `master` to \$defaultBranch in GitLab provider
- 96fef17a18: Upgrade git-parse-url to v11.6.0
- Updated dependencies
  - @backstage/backend-common@0.9.3
  - @backstage/integration@0.6.4

## 0.15.4

### Patch Changes

- 04aad2dab: Fix issue #7021 scaffolder action fetch:template preserves templates file permissions
- 21ccd4997: GitHub Webhook action in Scaffolder Backend has been improved to validate event names against Octokit Webhook event names list.
- Updated dependencies
  - @backstage/catalog-client@0.3.19
  - @backstage/catalog-model@0.9.2
  - @backstage/errors@0.1.2
  - @backstage/config@0.1.9
  - @backstage/backend-common@0.9.2

## 0.15.3

### Patch Changes

- 3f9dd1759: GitHub create repository webhook action: `github:webhook` for Backstage plugin Scaffolder has been added.
- 774b08a5c: GitHubWebhook Action can be created with a default webhook secret. This allows getting secret from environment variable as an alternative to get it from context.
- 536f4d844: Updated dependencies
- 0b92a1e74: refactor: extract common Octokit related code and use it in actions: `publish:github`, `github:actions:dispatch`, `github:webhook`.
- Updated dependencies
  - @backstage/integration@0.6.3
  - @backstage/catalog-model@0.9.1
  - @backstage/backend-common@0.9.1

## 0.15.2

### Patch Changes

- b438caf63: Add partial templating to `fetch:template` action.

  If an `templateFileExtension` input is given, only files with that extension get their content processed. If `templateFileExtension` is `true`, the `.njk` extension is used. The `templateFileExtension` input is incompatible with both `cookiecutterCompat` and `copyWithoutRender`.

  All other files get copied.

  All output paths are subject to applying templating logic.

- 1ce9b9571: Use more efficient approach to staging files in git during scaffolder actions
- Updated dependencies
  - @backstage/backend-common@0.9.0
  - @backstage/integration@0.6.2
  - @backstage/config@0.1.8
  - @backstage/plugin-scaffolder-backend-module-cookiecutter@0.1.2

## 0.15.1

### Patch Changes

- d622cfad1: GitHub branch protection option 'Require review from Code Owners' can be enabled by adding `requireCodeOwnersReview: true` in context input.

## 0.15.0

### Minor Changes

- e30646aeb: Add Bitbucket workspace and project fields to RepoUrlPicker to support Bitbucket cloud and server

### Patch Changes

- 8bedb75ae: Update Luxon dependency to 2.x
- Updated dependencies
  - @backstage/integration@0.6.0
  - @backstage/backend-common@0.8.9
  - @backstage/plugin-scaffolder-backend-module-cookiecutter@0.1.1

## 0.14.2

### Patch Changes

- 6cf48c609: Add the `scaffolder.defaultCommitMessage`, which defaults to `Initial commit`, so it can be customized.
- 48ea3d25b: The recommended value for a `backstage.io/techdocs-ref` annotation is now
  `dir:.`, indicating "documentation source files are located in the same
  directory relative to the catalog entity." Note that `url:<location>` values
  are still supported.
- Updated dependencies
  - @backstage/backend-common@0.8.8
  - @backstage/config@0.1.6
  - @backstage/integration@0.5.9

## 0.14.1

### Patch Changes

- c73f53bc2: Add new built-in action ci:github-actions-dispatch
- 7cea90592: - Move out the `cookiecutter` templating to its own module that is depended on by the `scaffolder-backend` plugin. No breaking change yet, but we will drop first class support for `cookiecutter` in the future and it will become an opt-in feature.
- eb740ee24: Moved sample software templates to the [backstage/software-templates](https://github.com/backstage/software-templates) repository. If you previously referenced the sample templates straight from `scaffolder-backend` plugin in the main [backstage/backstage](https://github.com/backstage/backstage) repository in your `app-config.yaml`, these references will need to be updated.

  See https://github.com/backstage/software-templates

- Updated dependencies
  - @backstage/catalog-client@0.3.17
  - @backstage/backend-common@0.8.7

## 0.14.0

### Minor Changes

- 96fc27698: Updated inputs for the `publish:github:pull-request` action.

  Now requires a `repoUrl` instead of separate `owner` and `repo` inputs. This aligns with the output of the `RepoUrlPicker` ui field used by the pull-request sample template.

### Patch Changes

- e75506fe7: Unsubscribe from broker after response is flushed
- ea1d956ef: Updating fs-extra to 10.0.0 to handle broken symbolic links correctly
- 31de5f27f: Add new `fetch:template` action which handles the same responsibilities as `fetch:cookiecutter` without the external dependency on `cookiecutter`. For information on migrating from `fetch:cookiecutter` to `fetch:template`, see the [migration guide](https://backstage.io/docs/features/software-templates/builtin-actions#migrating-from-fetch-cookiecutter-to-fetch-template) in the docs.
- 84d329e2a: Scaffolder: Added an 'eq' handlebars helper for use in software template YAML files. This can be used to execute a step depending on the value of an input, e.g.:

  ```yaml
  steps:
    id: 'conditional-step'
    action: 'custom-action'
    if: '{{ eq parameters.myvalue "custom" }}',
  ```

- ae84b20cf: Revert the upgrade to `fs-extra@10.0.0` as that seemed to have broken all installs inexplicably.
- Updated dependencies
  - @backstage/backend-common@0.8.6

## 0.13.0

### Minor Changes

- 60e830222: Support for `Template` kinds with version `backstage.io/v1alpha1` has now been removed. This means that the old method of running templates with `Preparers`, `Templaters` and `Publishers` has also been removed. If you had any logic in these abstractions, they should now be moved to `actions` instead, and you can find out more about those in the [documentation](https://backstage.io/docs/features/software-templates/writing-custom-actions)

  If you need any help migrating existing templates, there's a [migration guide](https://backstage.io/docs/features/software-templates/migrating-from-v1alpha1-to-v1beta2). Reach out to us on Discord in the #support channel if you're having problems.

  The `scaffolder-backend` now no longer requires these `Preparers`, `Templaters`, and `Publishers` to be passed in, now all it needs is the `containerRunner`.

  Please update your `packages/backend/src/plugins/scaffolder.ts` like the following

  ```diff
  - import {
  -  DockerContainerRunner,
  -  SingleHostDiscovery,
  - } from '@backstage/backend-common';
  + import { DockerContainerRunner } from '@backstage/backend-common';
    import { CatalogClient } from '@backstage/catalog-client';
  - import {
  -   CookieCutter,
  -   CreateReactAppTemplater,
  -   createRouter,
  -   Preparers,
  -   Publishers,
  -   Templaters,
  - } from '@backstage/plugin-scaffolder-backend';
  + import { createRouter } from '@backstage/plugin-scaffolder-backend';
    import Docker from 'dockerode';
    import { Router } from 'express';
    import type { PluginEnvironment } from '../types';

    export default async function createPlugin({
      config,
      database,
      reader,
  +   discovery,
    }: PluginEnvironment): Promise<Router> {
      const dockerClient = new Docker();
      const containerRunner = new DockerContainerRunner({ dockerClient });

  -   const cookiecutterTemplater = new CookieCutter({ containerRunner });
  -   const craTemplater = new CreateReactAppTemplater({ containerRunner });
  -   const templaters = new Templaters();

  -   templaters.register('cookiecutter', cookiecutterTemplater);
  -   templaters.register('cra', craTemplater);
  -
  -   const preparers = await Preparers.fromConfig(config, { logger });
  -   const publishers = await Publishers.fromConfig(config, { logger });

  -   const discovery = SingleHostDiscovery.fromConfig(config);
      const catalogClient = new CatalogClient({ discoveryApi: discovery });

      return await createRouter({
  -     preparers,
  -     templaters,
  -     publishers,
  +     containerRunner,
        logger,
        config,
        database,

  ```

- 7cad18e2f: Adding `config: Config` as a required argument to `createBuiltinActions` and downstream methods in order to support configuration of the default git author used for Scaffolder commits.

  The affected methods are:

  - `createBuiltinActions`
  - `createPublishGithubAction`
  - `createPublishGitlabAction`
  - `createPublishBitbucketAction`
  - `createPublishAzureAction`

  Call sites to these methods will need to be migrated to include the new `config` argument. See `createRouter` in `plugins/scaffolder-backend/src/service/router.ts` for an example of adding this new argument.

  To configure the default git author, use the `defaultAuthor` key under `scaffolder` in `app-config.yaml`:

  ```yaml
  scaffolder:
    defaultAuthor:
      name: Example
      email: example@example.com
  ```

### Patch Changes

- dad481793: add default branch property for publish GitLab, Bitbucket and Azure actions
- 62c2f10f7: Added filesystem remove/rename built-in actions
- 6841e0113: fix minor version of git-url-parse as 11.5.x introduced a bug for Bitbucket Server
- 11e66e804: bump azure-devops-node to 10.2.2
- 7a3ad92b5: Export the `fetchContents` from scaffolder-backend
- c2db794f5: add defaultBranch property for publish GitHub action
- 253136fba: removing mandatory of protection for the default branch, that could be handled by the GitHub automation in async manner, thus throwing floating errors
- Updated dependencies
  - @backstage/integration@0.5.8
  - @backstage/catalog-model@0.9.0
  - @backstage/backend-common@0.8.5
  - @backstage/catalog-client@0.3.16

## 0.12.4

### Patch Changes

- 1627daac2: Fix `catalog:write` on windows systems
- ab5cc376f: Use new utilities from `@backstage/backend-common` for safely resolving child paths
- Updated dependencies
  - @backstage/backend-common@0.8.4
  - @backstage/integration@0.5.7
  - @backstage/catalog-client@0.3.15

## 0.12.3

### Patch Changes

- a7f5fe7d7: created an action to write a catalog-info file
- 71416fb64: Moved installation instructions from the main [backstage.io](https://backstage.io) documentation to the package README file. These instructions are not generally needed, since the plugin comes installed by default with `npx @backstage/create-app`.
- c18a3c2ae: Correctly recognize whether the cookiecutter command exists
- Updated dependencies
  - @backstage/catalog-client@0.3.14
  - @backstage/catalog-model@0.8.4

## 0.12.2

### Patch Changes

- b49222176: Keep the empty string as empty string in `input` rather than replacing with `undefined` to make empty values ok for `cookiecutter`

## 0.12.1

### Patch Changes

- 55a834f3c: Use the correct parameter to create a public repository in Bitbucket Server for the v2 templates
- 745351190: Describe `publish:github` scaffolder action fields

  This change adds a description to the fields with examples of what to input. The
  `collaborators` description is also expanded a bit to make it more clear that
  these are additional compared to access and owner.

- 090dfe65d: Adds support to enable LFS for hosted Bitbucket
- 878c1851d: Add a `topics` input to `publish:github` action that can be used to set topics on the repository upon creation.
- 4ca322826: Migrate from the `command-exists-promise` dependency to `command-exists`.
- df3ac03cf: Use the correct parameter to create a public repository in Bitbucket Server.
- Updated dependencies
  - @backstage/backend-common@0.8.3
  - @backstage/catalog-model@0.8.3

## 0.12.0

### Minor Changes

- 66c6bfebd: Scaffolding a repository in Bitbucket will now use the apiBaseUrl if it is provided instead of only the host parameter

### Patch Changes

- 27a9b503a: Introduce conditional steps in scaffolder templates.

  A step can now include an `if` property that only executes a step if the
  condition is truthy. The condition can include handlebar templates.

  ```yaml
  - id: register
      if: '{{ not parameters.dryRun }}'
      name: Register
      action: catalog:register
      input:
      repoContentsUrl: '{{ steps.publish.output.repoContentsUrl }}'
      catalogInfoPath: '/catalog-info.yaml'
  ```

  Also introduces a `not` helper in handlebar templates that allows to negate
  boolean expressions.

- 55a253de2: Migrating old `backstage.io/v1alpha1` templates to `backstage.io/v1beta2`

  Deprecating the `create-react-app` Template. We're planning on removing the `create-react-app` templater, as it's been a little tricky to support and takes 15mins to run in a container. We've currently cached a copy of the output for `create-react-app` and ship that under our sample templates folder. If you want to continue using it, we suggest copying the template out of there and putting it in your own repository as it will be removed in upcoming releases.

  We also recommend removing this entry from your `app-config.yaml` if it exists:

  ```diff
  -    - type: url
  -      target: https://github.com/backstage/backstage/blob/master/plugins/scaffolder-backend/sample-templates/create-react-app/template.yaml
  -      rules:
  -        - allow: [Template]
  ```

- f26e6008f: Add `debug:log` action for debugging.
- 4f8cf50fe: Update gitbeaker past the broken version without a dist folder
- Updated dependencies [92963779b]
- Updated dependencies [27a9b503a]
- Updated dependencies [70bc30c5b]
- Updated dependencies [eda9dbd5f]
  - @backstage/backend-common@0.8.2
  - @backstage/catalog-model@0.8.2
  - @backstage/catalog-client@0.3.13
  - @backstage/integration@0.5.6

## 0.11.5

### Patch Changes

- 6fe1567a7: This adds a configuration option to the scaffolder plugin router, so we can allow for multiple `TaskWorkers`. Currently with only one `TaskWorker` you are limited to scaffolding one thing at a time. Set the `taskWorkers?: number` option in your scaffolder router to get more than 1 `TaskWorker`
- Updated dependencies [ebe802bc4]
- Updated dependencies [49d7ec169]
  - @backstage/catalog-model@0.8.1
  - @backstage/integration@0.5.5

## 0.11.4

### Patch Changes

- 260aaa684: Bump `@gitbeaker` dependencies to `29.x`.
- Updated dependencies [0fd4ea443]
- Updated dependencies [add62a455]
- Updated dependencies [704875e26]
  - @backstage/integration@0.5.4
  - @backstage/catalog-client@0.3.12
  - @backstage/catalog-model@0.8.0

## 0.11.3

### Patch Changes

- 021eb366a: Instead of failing, warn when you need to pay for GitHub Pro.

## 0.11.2

### Patch Changes

- f7f7783a3: Add Owner field in template card and new data distribution
  Add spec.owner as optional field into TemplateV1Alpha and TemplateV1Beta Schema
  Add relations ownedBy and ownerOf into Template entity
  Template documentation updated
- 65e6c4541: Remove circular dependencies
- 81d7b9c6f: Added deprecation warnings for `v1alpha1` templates
- 9962faa2b: Add branch protection for default branches of scaffolded GitHub repositories
- Updated dependencies [f7f7783a3]
- Updated dependencies [c7dad9218]
- Updated dependencies [65e6c4541]
- Updated dependencies [68fdbf014]
- Updated dependencies [5001de908]
  - @backstage/catalog-model@0.7.10
  - @backstage/backend-common@0.8.1
  - @backstage/integration@0.5.3

## 0.11.1

### Patch Changes

- 062bbf90f: chore: bump `@testing-library/user-event` from 12.8.3 to 13.1.8
- 82ca1ac22: The apiBaseUrl setting for Bitbucket Server integrations will now be used when it is set. Otherwise, it will default back to the host setting.
- fd39d4662: Move `jest-when` to the dev dependencies
- Updated dependencies [22fd8ce2a]
- Updated dependencies [10c008a3a]
- Updated dependencies [f9fb4a205]
- Updated dependencies [16be1d093]
  - @backstage/backend-common@0.8.0
  - @backstage/catalog-model@0.7.9

## 0.11.0

### Minor Changes

- e0bfd3d44: Migrate the plugin to use the `ContainerRunner` interface instead of `runDockerContainer(…)`.
  It also provides the `ContainerRunner` to the individual templaters instead of to the `createRouter` function.

  To apply this change to an existing backend application, add the following to `src/plugins/scaffolder.ts`:

  ```diff
  - import { SingleHostDiscovery } from '@backstage/backend-common';
  + import {
  +   DockerContainerRunner,
  +   SingleHostDiscovery,
  + } from '@backstage/backend-common';

    export default async function createPlugin({
      logger,
      config,
      database,
      reader,
    }: PluginEnvironment): Promise<Router> {
  +   const dockerClient = new Docker();
  +   const containerRunner = new DockerContainerRunner({ dockerClient });

  +   const cookiecutterTemplater = new CookieCutter({ containerRunner });
  -   const cookiecutterTemplater = new CookieCutter();
  +   const craTemplater = new CreateReactAppTemplater({ containerRunner });
  -   const craTemplater = new CreateReactAppTemplater();
      const templaters = new Templaters();

      templaters.register('cookiecutter', cookiecutterTemplater);
      templaters.register('cra', craTemplater);

      const preparers = await Preparers.fromConfig(config, { logger });
      const publishers = await Publishers.fromConfig(config, { logger });

  -   const dockerClient = new Docker();

      const discovery = SingleHostDiscovery.fromConfig(config);
      const catalogClient = new CatalogClient({ discoveryApi: discovery });

      return await createRouter({
        preparers,
        templaters,
        publishers,
        logger,
        config,
  -     dockerClient,
        database,
        catalogClient,
        reader,
      });
    }
  ```

### Patch Changes

- 38ca05168: The default `@octokit/rest` dependency was bumped to `"^18.5.3"`.
- 69eefb5ae: Fix GithubPR built-in action `credentialsProvider.getCredentials` URL.
  Adding Documentation for GitHub PR built-in action.
- 75c8cec39: bump `jsonschema` from 1.2.7 to 1.4.0
- Updated dependencies [e0bfd3d44]
- Updated dependencies [38ca05168]
- Updated dependencies [d8b81fd28]
- Updated dependencies [d1b1306d9]
  - @backstage/backend-common@0.7.0
  - @backstage/integration@0.5.2
  - @backstage/catalog-model@0.7.8
  - @backstage/config@0.1.5
  - @backstage/catalog-client@0.3.11

## 0.10.1

### Patch Changes

- a1783f306: Added the `nebula-preview` preview to `Octokit` for repository visibility.

## 0.10.0

### Minor Changes

- 49574a8a3: Fix some `spleling`.

  The `scaffolder-backend` has a configuration schema change that may be breaking
  in rare circumstances. Due to a typo in the schema, the
  `scaffolder.github.visibility`, `scaffolder.gitlab.visibility`, and
  `scaffolder.bitbucket.visibility` did not get proper validation that the value
  is one of the supported strings (`public`, `internal` (not available for
  Bitbucket), and `private`). If you had a value that was not one of these three,
  you may have to adjust your config.

### Patch Changes

- 84c54474d: Forward user token to scaffolder task for subsequent api requests
- Updated dependencies [d367f63b5]
- Updated dependencies [b42531cfe]
  - @backstage/backend-common@0.6.3

## 0.9.6

### Patch Changes

- d8ffec739: Add built-in publish action for creating GitHub pull requests.
- 7abec4dbc: Fix for the `file://` protocol check in the `FilePreparer` being too strict, breaking Windows.
- d840d30bc: Bitbucket server needs username to be set as well as the token or appPassword for the publishing process to work.

  ```yaml
  integrations:
    bitbucket:
      - host: bitbucket.mycompany.com
        apiBaseUrl: https://bitbucket.mycompany.com/rest/api/1.0
        token: token
        username: username
  ```

- b25846562: Enable the JSON parsing of the response from templated variables in the `v2beta1` syntax. Previously if template parameters json strings they were left as strings, they are now parsed as JSON objects.

  Before:

  ```yaml
  - id: test
    name: test-action
    action: custom:run
    input:
      input: '{"hello":"ben"}'
  ```

  Now:

  ```yaml
  - id: test
    name: test-action
    action: custom:run
    input:
      input:
        hello: ben
  ```

  Also added the `parseRepoUrl` and `json` helpers to the parameters syntax. You can now use these helpers to parse work with some `json` or `repoUrl` strings in templates.

  ```yaml
  - id: test
    name: test-action
    action: cookiecutter:fetch
    input:
      destination: '{{ parseRepoUrl parameters.repoUrl }}'
  ```

  Will produce a parsed version of the `repoUrl` of type `{ repo: string, owner: string, host: string }` that you can use in your actions. Specifically `cookiecutter` with `{{ cookiecutter.destination.owner }}` like the `plugins/scaffolder-backend/sample-templates/v1beta2-demo/template.yaml` example.

- a376e3ee8: Adds a collaborator field to GitHub publish action for multiple users and access levels
- 423a514c3: Fix execution of the GitHub Pull Request publish action on Windows.
- 0b7fd7a9d: Fix bug in pull request sample template.
- Updated dependencies [bb5055aee]
- Updated dependencies [5d0740563]
- Updated dependencies [442f34b87]
  - @backstage/catalog-model@0.7.7
  - @backstage/catalog-client@0.3.10

## 0.9.5

### Patch Changes

- 802b41b65: Allow custom directory to be specified for GitHub publish action
- Updated dependencies [97b60de98]
- Updated dependencies [98dd5da71]
- Updated dependencies [b779b5fee]
  - @backstage/catalog-model@0.7.6
  - @backstage/backend-common@0.6.2

## 0.9.4

### Patch Changes

- 2ab6f3ff0: Add OwnerPicker component to scaffolder for specifying a component's owner from users and groups in the catalog.
- 164cc4c53: Fix a bug with GitHub Apps support not parsing the URL correctly
- Updated dependencies [676ede643]
- Updated dependencies [b196a4569]
- Updated dependencies [8488a1a96]
- Updated dependencies [37e3a69f5]
  - @backstage/catalog-client@0.3.9
  - @backstage/catalog-model@0.7.5
  - @backstage/backend-common@0.6.1

## 0.9.3

### Patch Changes

- 9f2e51e89: Fixes bug in the `github:publish` action causing repositories to be set as private even if the visibility is set to internal
- 91e87c055: Add inputs for action `fetch:cookiecutter`: copyWithoutRender, extensions, imageName
- 113d3d59e: Added a `publish:file` action to use for local development. The action is not installed by default.

## 0.9.2

### Patch Changes

- 8b4f7e42a: Forward authorization on scaffolder backend requests
- 8686eb38c: Use errors from `@backstage/errors`
- Updated dependencies [8686eb38c]
- Updated dependencies [8686eb38c]
- Updated dependencies [0434853a5]
- Updated dependencies [8686eb38c]
  - @backstage/catalog-client@0.3.8
  - @backstage/backend-common@0.6.0
  - @backstage/config@0.1.4

## 0.9.1

### Patch Changes

- d7245b733: Remove runDockerContainer, and start using the utility function provided by @backstage/backend-common
- 0b42fff22: Make use of parseLocationReference/stringifyLocationReference
- c532c1682: Fixes task failures caused by undefined step input
- 761698831: Bump to the latest version of the Knex library.
- f98f212e4: Introduce scaffolder actions page which lists all available actions along with documentation about their input/output.

  Allow for actions to be extended with a description.

  The list actions page is by default available at `/create/actions`.

- 2e57922de: Update GitHub publisher to display a more helpful error message when repository access update fails.
- Updated dependencies [277644e09]
- Updated dependencies [52f613030]
- Updated dependencies [d7245b733]
- Updated dependencies [0b42fff22]
- Updated dependencies [0b42fff22]
- Updated dependencies [905cbfc96]
- Updated dependencies [761698831]
- Updated dependencies [d4e77ec5f]
  - @backstage/integration@0.5.1
  - @backstage/backend-common@0.5.6
  - @backstage/catalog-model@0.7.4
  - @backstage/catalog-client@0.3.7

## 0.9.0

### Minor Changes

- 8106c9528: The scaffolder has been updated to support the new `v1beta2` template schema which allows for custom template actions!

  See documentation for more information how to create and register new template actions.

  **Breaking changes**

  The backend scaffolder plugin now needs a `UrlReader` which can be pulled from the PluginEnvironment.

  The following change is required in `backend/src/plugins/scaffolder.ts`

  ```diff
   export default async function createPlugin({
     logger,
     config,
     database,
  +  reader,
   }: PluginEnvironment): Promise<Router> {

    // omitted code

    return await createRouter({
      preparers,
      templaters,
      publishers,
      logger,
      config,
      dockerClient,
      database,
      catalogClient,
  +   reader,
    });
  ```

- 96ccc8f69: Removed support for deprecated publisher auth configuration within the `scaffolder` configuration block, such as `scaffolder.github.token`. Access should instead be configured through `integrations` configuration.

  For example, replace the following configuration in `app-config.yaml`

  ```yaml
  scaffolder:
    github:
      token: my-token
  ```

  with

  ```yaml
  integrations:
    github:
      - host: github.com
        token: my-token
  ```

### Patch Changes

- 12d8f27a6: Move logic for constructing the template form to the backend, using a new `./parameter-schema` endpoint that returns the form schema for a given template.
- 12d8f27a6: Add version `backstage.io/v1beta2` schema for Template entities.
- f31b76b44: Consider both authentication methods for both `onprem` and `cloud` BitBucket
- f43192207: remove usage of res.send() for res.json() and res.end() to ensure content types are more consistently application/json on backend responses and error cases
- d0ed25196: Fixed file path resolution for templates with a file location
- Updated dependencies [12d8f27a6]
- Updated dependencies [497859088]
- Updated dependencies [8adb48df4]
  - @backstage/catalog-model@0.7.3
  - @backstage/backend-common@0.5.5

## 0.8.0

### Minor Changes

- a5f42cf66: # Stateless scaffolding

  The scaffolder has been redesigned to be horizontally scalable and to persistently store task state and execution logs in the database.

  Each scaffolder task is given a unique task ID which is persisted in the database.
  Tasks are then picked up by a `TaskWorker` which performs the scaffolding steps.
  Execution logs are also persisted in the database meaning you can now refresh the scaffolder task status page without losing information.

  The task status page is now dynamically created based on the step information stored in the database.
  This allows for custom steps to be displayed once the next version of the scaffolder template schema is available.

  The task page is updated to display links to both the git repository and to the newly created catalog entity.

  Component registration has moved from the frontend into a separate registration step executed by the `TaskWorker`. This requires that a `CatalogClient` is passed to the scaffolder backend instead of the old `CatalogEntityClient`.

  Make sure to update `plugins/scaffolder.ts`

  ```diff
   import {
     CookieCutter,
     createRouter,
     Preparers,
     Publishers,
     CreateReactAppTemplater,
     Templaters,
  -  CatalogEntityClient,
   } from '@backstage/plugin-scaffolder-backend';

  +import { CatalogClient } from '@backstage/catalog-client';

   const discovery = SingleHostDiscovery.fromConfig(config);
  -const entityClient = new CatalogEntityClient({ discovery });
  +const catalogClient = new CatalogClient({ discoveryApi: discovery })

   return await createRouter({
     preparers,
     templaters,
     publishers,
     logger,
     config,
     dockerClient,
  -  entityClient,
     database,
  +  catalogClient,
   });
  ```

  As well as adding the `@backstage/catalog-client` packages as a dependency of your backend package.

### Patch Changes

- Updated dependencies [bad21a085]
- Updated dependencies [a1f5e6545]
  - @backstage/catalog-model@0.7.2
  - @backstage/config@0.1.3

## 0.7.1

### Patch Changes

- edbc27bfd: Added githubApp authentication to the scaffolder-backend plugin
- fb28da212: Switched to using `'x-access-token'` for authenticating Git over HTTPS towards GitHub.
- 0ada34a0f: Minor typo in migration
- 29c8bcc53: Fixed the `prepare` step for when using local templates that were added to the catalog using the `file:` target configuration.
  No more `EPERM: operation not permitted` error messages.
- a341a8716: Fix parsing of the path to default to empty string not undefined if git-url-parse throws something we don't expect. Fixes the error `The "path" argument must be of type string.` when preparing.
- Updated dependencies [16fb1d03a]
- Updated dependencies [491f3a0ec]
- Updated dependencies [491f3a0ec]
- Updated dependencies [434b4e81a]
- Updated dependencies [fb28da212]
  - @backstage/backend-common@0.5.4
  - @backstage/integration@0.5.0

## 0.7.0

### Minor Changes

- 615103a63: Introduced `v2` Scaffolder REST API, which uses an implementation that is database backed, making the scaffolder instances stateless. The `createRouter` function now requires a `PluginDatabaseManager` instance to be passed in, commonly available as `database` in the plugin environment in the backend.

  This API should be considered unstable until used by the scaffolder frontend.

### Patch Changes

- 6ed2b47d6: Include Backstage identity token in requests to backend plugins.
- ffffea8e6: Minor updates to reflect the changes in `@backstage/integration` that made the fields `apiBaseUrl` and `apiUrl` mandatory.
- Updated dependencies [6ed2b47d6]
- Updated dependencies [ffffea8e6]
- Updated dependencies [82b2c11b6]
- Updated dependencies [965e200c6]
- Updated dependencies [ffffea8e6]
- Updated dependencies [72b96e880]
- Updated dependencies [5a5163519]
  - @backstage/catalog-client@0.3.6
  - @backstage/backend-common@0.5.3
  - @backstage/integration@0.4.0

## 0.6.0

### Minor Changes

- cdea0baf1: The scaffolder is updated to generate a unique workspace directory inside the temp folder. This directory is cleaned up by the job processor after each run.

  The prepare/template/publish steps have been refactored to operate on known directories, `template/` and `result/`, inside the temporary workspace path.

  Updated preparers to accept the template url instead of the entire template. This is done primarily to allow for backwards compatibility between v1 and v2 scaffolder templates.

  Fixes broken GitHub actions templating in the Create React App template.

  #### For those with **custom** preparers, templates, or publishers

  The preparer interface has changed, the prepare method now only takes a single argument, and doesn't return anything. As part of this change the preparers were refactored to accept a URL pointing to the target directory, rather than computing that from the template entity.

  The `workingDirectory` option was also removed, and replaced with a `workspacePath` option. The difference between the two is that `workingDirectory` was a place for the preparer to create temporary directories, while the `workspacePath` is the specific folder were the entire templating process for a single template job takes place. Instead of returning a path to the folder were the prepared contents were placed, the contents are put at the `<workspacePath>/template` path.

  ```diff
  type PreparerOptions = {
  -  workingDirectory?: string;
  +  /**
  +   * Full URL to the directory containg template data
  +   */
  +  url: string;
  +  /**
  +   * The workspace path that will eventually be the the root of the new repo
  +   */
  +  workspacePath: string;
    logger: Logger;
  };

  -prepare(template: TemplateEntityV1alpha1, opts?: PreparerOptions): Promise<string>
  +prepare(opts: PreparerOptions): Promise<void>;
  ```

  Instead of returning a path to the folder were the templaters contents were placed, the contents are put at the `<workspacePath>/result` path. All templaters now also expect the source template to be present in the `template` directory within the `workspacePath`.

  ```diff
  export type TemplaterRunOptions = {
  -  directory: string;
  +  workspacePath: string;
    values: TemplaterValues;
    logStream?: Writable;
    dockerClient: Docker;
  };

  -public async run(options: TemplaterRunOptions): Promise<TemplaterRunResult>
  +public async run(options: TemplaterRunOptions): Promise<void>
  ```

  Just like the preparer and templaters, the publishers have also switched to using `workspacePath`. The root of the new repo is expected to be located at `<workspacePath>/result`.

  ```diff
  export type PublisherOptions = {
    values: TemplaterValues;
  -  directory: string;
  +  workspacePath: string;
    logger: Logger;
  };
  ```

### Patch Changes

- a26668913: Attempt to fix windows test errors in master
- 529d16d27: # Repo visibility for GitLab and BitBucket repos

  **NOTE: This changes default repo visibility from `private` to `public` for GitLab and BitBucket** which
  is consistent with the GitHub default. If you were counting on `private` visibility, you'll need to update
  your scaffolder config to use `private`.

  This adds repo visibility feature parity with GitHub for GitLab and BitBucket.

  To configure the repo visibility, set scaffolder._type_.visibility as in this example:

  ```yaml
  scaffolder:
    github:
      visibility: private # 'public' or 'internal' or 'private' (default is 'public')
    gitlab:
      visibility: public # 'public' or 'internal' or 'private' (default is 'public')
    bitbucket:
      visibility: public # 'public' or 'private' (default is 'public')
  ```

- Updated dependencies [c4abcdb60]
- Updated dependencies [2430ee7c2]
- Updated dependencies [6e612ce25]
- Updated dependencies [025e122c3]
- Updated dependencies [064c513e1]
- Updated dependencies [7881f2117]
- Updated dependencies [3149bfe63]
- Updated dependencies [2e62aea6f]
- Updated dependencies [11cb5ef94]
  - @backstage/integration@0.3.2
  - @backstage/backend-common@0.5.2
  - @backstage/catalog-model@0.7.1

## 0.5.2

### Patch Changes

- 26a3a6cf0: Honor the branch ref in the url when cloning.

  This fixes a bug in the scaffolder prepare stage where a non-default branch
  was specified in the scaffolder URL but the default branch was cloned.
  For example, even though the `other` branch is specified in this example, the
  `master` branch was actually cloned:

  ```yaml
  catalog:
    locations:
      - type: url
        target: https://github.com/backstage/backstage/blob/other/plugins/scaffolder-backend/sample-templates/docs-template/template.yaml
  ```

  This also fixes a 404 in the prepare stage for GitLab URLs.

- 9dd057662: Upgrade [git-url-parse](https://www.npmjs.com/package/git-url-parse) to [v11.4.4](https://github.com/IonicaBizau/git-url-parse/pull/125) which fixes parsing an Azure DevOps branch ref.
- Updated dependencies [26a3a6cf0]
- Updated dependencies [664dd08c9]
- Updated dependencies [6800da78d]
- Updated dependencies [9dd057662]
  - @backstage/backend-common@0.5.1
  - @backstage/integration@0.3.1

## 0.5.1

### Patch Changes

- 0ea002378: Fixing issues with templating and full URL's as `storePath`'s

## 0.5.0

### Minor Changes

- ed6baab66: - Deprecating the `scaffolder.${provider}.token` auth duplication and favoring `integrations.${provider}` instead. If you receive deprecation warnings your config should change like the following:

  ```yaml
  scaffolder:
    github:
      token:
        $env: GITHUB_TOKEN
      visibility: public
  ```

  To something that looks like this:

  ```yaml
  integration:
    github:
      - host: github.com
        token:
          $env: GITHUB_TOKEN
  scaffolder:
    github:
      visibility: public
  ```

  You can also configure multiple different hosts under the `integration` config like the following:

  ```yaml
  integration:
    github:
      - host: github.com
        token:
          $env: GITHUB_TOKEN
      - host: ghe.mycompany.com
        token:
          $env: GITHUB_ENTERPRISE_TOKEN
  ```

  This of course is the case for all the providers respectively.

  - Adding support for cross provider scaffolding, you can now create repositories in for example Bitbucket using a template residing in GitHub.

  - Fix GitLab scaffolding so that it returns a `catalogInfoUrl` which automatically imports the project into the catalog.

  - The `Store Path` field on the `scaffolder` frontend has now changed so that you require the full URL to the desired destination repository.

  `backstage/new-repository` would become `https://github.com/backstage/new-repository` if provider was GitHub for example.

### Patch Changes

- Updated dependencies [def2307f3]
- Updated dependencies [0b135e7e0]
- Updated dependencies [294a70cab]
- Updated dependencies [fa8ba330a]
- Updated dependencies [0ea032763]
- Updated dependencies [5345a1f98]
- Updated dependencies [ed6baab66]
- Updated dependencies [09a370426]
- Updated dependencies [a93f42213]
  - @backstage/catalog-model@0.7.0
  - @backstage/backend-common@0.5.0
  - @backstage/integration@0.3.0

## 0.4.1

### Patch Changes

- 94fdf4955: Get rid of all usages of @octokit/types, and bump the rest of the octokit dependencies to the latest version
- cc068c0d6: Bump the gitbeaker dependencies to 28.x.

  To update your own installation, go through the `package.json` files of all of
  your packages, and ensure that all dependencies on `@gitbeaker/node` or
  `@gitbeaker/core` are at version `^28.0.2`. Then run `yarn install` at the root
  of your repo.

- 711ba55a2: Export all preparers and publishers properly
- Updated dependencies [466354aaa]
- Updated dependencies [f3b064e1c]
- Updated dependencies [abbee6fff]
- Updated dependencies [147fadcb9]
  - @backstage/integration@0.2.0
  - @backstage/catalog-model@0.6.1
  - @backstage/backend-common@0.4.3

## 0.4.0

### Minor Changes

- 5eb8c9b9e: Fix GitLab scaffolder publisher

### Patch Changes

- 7e3451700: bug(scaffolder): Ignore the .git folder when adding dot-files to the index

## 0.3.7

### Patch Changes

- 37a5244ef: Add scaffolding support for Bitbucket Cloud and Server.
- 00042e73c: Moving the Git actions to isomorphic-git instead of the node binding version of nodegit
- 9efbc5585: Add config schema for Bitbucket scaffolder
- Updated dependencies [5ecd50f8a]
- Updated dependencies [00042e73c]
- Updated dependencies [0829ff126]
- Updated dependencies [036a84373]
  - @backstage/backend-common@0.4.2
  - @backstage/integration@0.1.5

## 0.3.6

### Patch Changes

- 19554f6d6: Added GitHub Actions for Create React App, and allow better imports of files inside a module when they're exposed using `files` in `package.json`
- 33a82a713: GitLab preparer uses the right token (primarily the same one as the publisher, falling back to the integrations token)
- aed8f7f12: Clearer error message when preparer or publisher type can't be determined.

## 0.3.5

### Patch Changes

- 94c65a9d4: Added configuration schema for the commonly used properties
- Updated dependencies [c911061b7]
- Updated dependencies [1d1c2860f]
- Updated dependencies [0e6298f7e]
- Updated dependencies [4eafdec4a]
- Updated dependencies [ac3560b42]
  - @backstage/catalog-model@0.6.0
  - @backstage/backend-common@0.4.1

## 0.3.4

### Patch Changes

- 1e22f8e0b: Unify `dockerode` library and type dependency versions
- Updated dependencies [38e24db00]
- Updated dependencies [e3bd9fc2f]
- Updated dependencies [12bbd748c]
- Updated dependencies [83b6e0c1f]
- Updated dependencies [e3bd9fc2f]
  - @backstage/backend-common@0.4.0
  - @backstage/config@0.1.2
  - @backstage/catalog-model@0.5.0

## 0.3.3

### Patch Changes

- Updated dependencies [612368274]
- Updated dependencies [08835a61d]
- Updated dependencies [a9fd599f7]
- Updated dependencies [bcc211a08]
  - @backstage/backend-common@0.3.3
  - @backstage/catalog-model@0.4.0

## 0.3.2

### Patch Changes

- ef2831dde: Move constructing the catalog-info.yaml URL for scaffolded components to the publishers
- 5a1d8dca3: Fix React entity YAML filename to new standard
- Updated dependencies [1166fcc36]
- Updated dependencies [bff3305aa]
- Updated dependencies [1185919f3]
- Updated dependencies [b47dce06f]
  - @backstage/catalog-model@0.3.0
  - @backstage/backend-common@0.3.1

## 0.3.1

### Patch Changes

- d33f5157c: Extracted pushToRemote function for reuse between publishers
- Updated dependencies [1722cb53c]
- Updated dependencies [1722cb53c]
- Updated dependencies [7b37e6834]
- Updated dependencies [8e2effb53]
  - @backstage/backend-common@0.3.0

## 0.3.0

### Minor Changes

- 59166e5ec: `createRouter` of scaffolder backend will now require additional option as `entityClient` which could be generated by `CatalogEntityClient` in `plugin-scaffolder-backend` package. Here is example to generate `entityClient`.

  ```js
  import { CatalogEntityClient } from '@backstage/plugin-scaffolder-backend';
  import { SingleHostDiscovery } from '@backstage/backend-common';

  const discovery = SingleHostDiscovery.fromConfig(config);
  const entityClient = new CatalogEntityClient({ discovery });
  ```

  - Scaffolder's API `/v1/jobs` will accept `templateName` instead of `template` Entity.

### Patch Changes

- Updated dependencies [33b7300eb]
  - @backstage/backend-common@0.2.1

## 0.2.0

### Minor Changes

- 3e254503d: Add Azure DevOps support to the scaffolder backend

  This adds support for Azure DevOps to the scaffolder (preparer & publisher). I thought I should get this in there now since #2426 has been merged. I had a previous PR with only the preparer but I closed that in favor of this one.

  I stayed with the 'azure/api' structure but I guess we should try and go the same way as with GitHub here #2501

### Patch Changes

- 0c370c979: Update SSR template to pass CI
- 991a950e0: Added .fromConfig static factories for Preparers and Publishers + read integrations config to support url location types
- c926765a2: Allow templates to be located on non-default branch
- 6840a68df: Add authentication token to Scaffolder GitHub Preparer
- 1c8c43756: The new `scaffolder.github.baseUrl` config property allows to specify a custom base url for GitHub Enterprise instances
- 5e4551e3a: Added support for configuring the working directory of the Scaffolder:

  ```yaml
  backend:
    workingDirectory: /some-dir # Use this to configure a working directory for the scaffolder, defaults to the OS temp-dir
  ```

- e3d063ffa: Introduce PreparerOptions for PreparerBase
- Updated dependencies [3a4236570]
- Updated dependencies [e0be86b6f]
- Updated dependencies [f70a52868]
- Updated dependencies [12b5fe940]
- Updated dependencies [5249594c5]
- Updated dependencies [56e4eb589]
- Updated dependencies [e37c0a005]
- Updated dependencies [a768a07fb]
- Updated dependencies [f00ca3cb8]
- Updated dependencies [6579769df]
- Updated dependencies [5adfc005e]
- Updated dependencies [8c2b76e45]
- Updated dependencies [440a17b39]
- Updated dependencies [fa56f4615]
- Updated dependencies [8afce088a]
- Updated dependencies [b3d57961c]
- Updated dependencies [7bbeb049f]
  - @backstage/catalog-model@0.2.0
  - @backstage/backend-common@0.2.0
