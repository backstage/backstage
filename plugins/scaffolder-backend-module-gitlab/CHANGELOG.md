# @backstage/plugin-scaffolder-backend-module-gitlab

## 0.7.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.1-next.1
  - @backstage/config@1.3.2-next.0
  - @backstage/errors@1.2.7-next.0
  - @backstage/plugin-scaffolder-node@0.6.3-next.1
  - @backstage/integration@1.16.1-next.0

## 0.7.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.6.3-next.0
  - @backstage/backend-plugin-api@1.1.1-next.0
  - @backstage/config@1.3.1
  - @backstage/errors@1.2.6
  - @backstage/integration@1.16.0

## 0.7.0

### Minor Changes

- c4ffd13: Added the autocomplete feature to GitlabRepoUrlPicker
- 32459d0: **BREAKING**: Upgraded the `gitbeaker` library to version 41. As part of this, the `scopes` parameter to the `gitlab:projectDeployToken:create` is no longer optional, so you will have to pass it a value (for example `['read_repository']`).

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.16.0
  - @backstage/backend-plugin-api@1.1.0
  - @backstage/plugin-scaffolder-node@0.6.2
  - @backstage/errors@1.2.6
  - @backstage/config@1.3.1

## 0.7.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.0-next.2
  - @backstage/errors@1.2.6-next.0
  - @backstage/plugin-scaffolder-node@0.6.2-next.2
  - @backstage/config@1.3.1-next.0
  - @backstage/integration@1.16.0-next.1

## 0.7.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.6.2-next.1
  - @backstage/backend-plugin-api@1.1.0-next.1
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5
  - @backstage/integration@1.16.0-next.0

## 0.7.0-next.0

### Minor Changes

- c4ffd13: Added the autocomplete feature to GitlabRepoUrlPicker
- 32459d0: **BREAKING**: Upgraded the `gitbeaker` library to version 41. As part of this, the `scopes` parameter to the `gitlab:projectDeployToken:create` is no longer optional, so you will have to pass it a value (for example `['read_repository']`).

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.16.0-next.0
  - @backstage/backend-plugin-api@1.0.3-next.0
  - @backstage/plugin-scaffolder-node@0.6.1-next.0
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5

## 0.6.1

### Patch Changes

- cdc8b4c: Improve error messages from Gitlab
- 2dbdccb: Removed circular import
- Updated dependencies
  - @backstage/config@1.3.0
  - @backstage/backend-plugin-api@1.0.2
  - @backstage/plugin-scaffolder-node@0.6.0
  - @backstage/errors@1.2.5
  - @backstage/integration@1.15.2

## 0.6.1-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.1
  - @backstage/plugin-scaffolder-node@0.5.1-next.3

## 0.6.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.1
  - @backstage/plugin-scaffolder-node@0.5.1-next.2

## 0.6.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.1
  - @backstage/plugin-scaffolder-node@0.5.1-next.1

## 0.6.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.1
  - @backstage/plugin-scaffolder-node@0.5.1-next.0

## 0.6.0

### Minor Changes

- 73f2ccf: declare correct type (number) for publish:gitlab output.projectId

### Patch Changes

- 9adfe46: GitLab MR: introduce 'skip' commit action.
- bc71718: Updated installation instructions in README to not include `/alpha`.
- 094eaa3: Remove references to in-repo backend-common
- f2f68cf: Updated `gitlab:group:ensureExists` action to instead use oauth client.
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.5.0
  - @backstage/integration@1.15.1
  - @backstage/backend-plugin-api@1.0.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.6.0-next.2

### Minor Changes

- 73f2ccf: declare correct type (number) for publish:gitlab output.projectId

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.15.1-next.1
  - @backstage/plugin-scaffolder-node@0.5.0-next.2
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.5.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.15.1-next.0
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-scaffolder-node@0.5.0-next.1

## 0.5.1-next.0

### Patch Changes

- 094eaa3: Remove references to in-repo backend-common
- f2f68cf: Updated `gitlab:group:ensureExists` action to instead use oauth client.
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.5.0-next.0
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.0

## 0.5.0

### Minor Changes

- d425fc4: **BREAKING**: The return values from `createBackendPlugin`, `createBackendModule`, and `createServiceFactory` are now simply `BackendFeature` and `ServiceFactory`, instead of the previously deprecated form of a function that returns them. For this reason, `createServiceFactory` also no longer accepts the callback form where you provide direct options to the service. This also affects all `coreServices.*` service refs.

  This may in particular affect tests; if you were effectively doing `createBackendModule({...})()` (note the parentheses), you can now remove those extra parentheses at the end. You may encounter cases of this in your `packages/backend/src/index.ts` too, where you add plugins, modules, and services. If you were using `createServiceFactory` with a function as its argument for the purpose of passing in options, this pattern has been deprecated for a while and is no longer supported. You may want to explore the new multiton patterns to achieve your goals, or moving settings to app-config.

  As part of this change, the `IdentityFactoryOptions` type was removed, and can no longer be used to tweak that service. The identity service was also deprecated some time ago, and you will want to [migrate to the new auth system](https://backstage.io/docs/tutorials/auth-service-migration) if you still rely on it.

### Patch Changes

- 5d1670f: Update README installation instructions
- Updated dependencies
  - @backstage/backend-common@0.25.0
  - @backstage/backend-plugin-api@1.0.0
  - @backstage/integration@1.15.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-scaffolder-node@0.4.11

## 0.5.0-next.2

### Patch Changes

- 5d1670f: Update README installation instructions
- Updated dependencies
  - @backstage/backend-common@0.25.0-next.2
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/integration@1.15.0-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-scaffolder-node@0.4.11-next.2

## 0.5.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.25.0-next.1
  - @backstage/backend-plugin-api@0.9.0-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.14.0
  - @backstage/plugin-scaffolder-node@0.4.11-next.1

## 0.5.0-next.0

### Minor Changes

- d425fc4: **BREAKING**: The return values from `createBackendPlugin`, `createBackendModule`, and `createServiceFactory` are now simply `BackendFeature` and `ServiceFactory`, instead of the previously deprecated form of a function that returns them. For this reason, `createServiceFactory` also no longer accepts the callback form where you provide direct options to the service. This also affects all `coreServices.*` service refs.

  This may in particular affect tests; if you were effectively doing `createBackendModule({...})()` (note the parentheses), you can now remove those extra parentheses at the end. You may encounter cases of this in your `packages/backend/src/index.ts` too, where you add plugins, modules, and services. If you were using `createServiceFactory` with a function as its argument for the purpose of passing in options, this pattern has been deprecated for a while and is no longer supported. You may want to explore the new multiton patterns to achieve your goals, or moving settings to app-config.

  As part of this change, the `IdentityFactoryOptions` type was removed, and can no longer be used to tweak that service. The identity service was also deprecated some time ago, and you will want to [migrate to the new auth system](https://backstage.io/docs/tutorials/auth-service-migration) if you still rely on it.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.0
  - @backstage/backend-common@0.25.0-next.0
  - @backstage/plugin-scaffolder-node@0.4.11-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.14.0

## 0.4.5

### Patch Changes

- da97131: Added test cases for gitlab:issues:create examples
- fad1b90: Allow the `createGitlabProjectVariableAction` to use oauth tokens
- aab708e: Added test cases for gitlab:issue:edit examples
- ef742dc: Added test cases for gitlab:projectAccessToken:create example
- 1ba4c2f: Added test cases for gitlab:pipeline:trigger examples
- a6603e4: Add custom action for merge request: **auto**

  The **Auto** action selects the committed action between _create_ and _update_.

  The **Auto** action fetches files using the **/projects/repository/tree endpoint**.
  After fetching, it checks if the file exists locally and in the repository. If it does, it chooses **update**; otherwise, it chooses **create**.

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/backend-common@0.24.0
  - @backstage/plugin-scaffolder-node@0.4.9
  - @backstage/integration@1.14.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.4.5-next.3

### Patch Changes

- da97131: Added test cases for gitlab:issues:create examples
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/backend-common@0.23.4-next.3
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.14.0-next.0
  - @backstage/plugin-scaffolder-node@0.4.9-next.3

## 0.4.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/plugin-scaffolder-node@0.4.9-next.2
  - @backstage/backend-common@0.23.4-next.2
  - @backstage/integration@1.14.0-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.4.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/backend-common@0.23.4-next.1
  - @backstage/integration@1.14.0-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-scaffolder-node@0.4.9-next.1

## 0.4.5-next.0

### Patch Changes

- fad1b90: Allow the `createGitlabProjectVariableAction` to use oauth tokens
- aab708e: Added test cases for gitlab:issue:edit examples
- ef742dc: Added test cases for gitlab:projectAccessToken:create example
- 1ba4c2f: Added test cases for gitlab:pipeline:trigger examples
- a6603e4: Add custom action for merge request: **auto**

  The **Auto** action selects the committed action between _create_ and _update_.

  The **Auto** action fetches files using the **/projects/repository/tree endpoint**.
  After fetching, it checks if the file exists locally and in the repository. If it does, it chooses **update**; otherwise, it chooses **create**.

- Updated dependencies
  - @backstage/backend-common@0.23.4-next.0
  - @backstage/integration@1.14.0-next.0
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-scaffolder-node@0.4.9-next.0

## 0.4.4

### Patch Changes

- 0ac124b: Updated configuration instructions
- 2fb0eb8: Added support for passing `variables` to `gitlab:pipeline:trigger`
- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/backend-common@0.23.3
  - @backstage/integration@1.13.0
  - @backstage/plugin-scaffolder-node@0.4.8
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.4.4-next.1

### Patch Changes

- 2fb0eb8: Added support for passing `variables` to `gitlab:pipeline:trigger`
- Updated dependencies
  - @backstage/backend-common@0.23.3-next.1
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.13.0-next.0
  - @backstage/plugin-scaffolder-node@0.4.8-next.1

## 0.4.3-next.0

### Patch Changes

- 0ac124b: Updated configuration instructions
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/backend-common@0.23.2-next.0
  - @backstage/integration@1.13.0-next.0
  - @backstage/plugin-scaffolder-node@0.4.7-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.4.1

### Patch Changes

- 78a0b08: Internal refactor to handle `BackendFeature` contract change.
- cf96041: Added `gitlab:issue:edit` action to edit existing GitLab issues
- d44a20a: Added additional plugin metadata to `package.json`.
- 829e0ec: Add new `gitlab:pipeline:trigger` action to trigger GitLab pipelines.
- Updated dependencies
  - @backstage/backend-common@0.23.0
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/integration@1.12.0
  - @backstage/plugin-scaffolder-node@0.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.4.1-next.3

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/integration@1.12.0-next.1
  - @backstage/plugin-scaffolder-node@0.4.5-next.3
  - @backstage/backend-common@0.23.0-next.3
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.4.1-next.2

### Patch Changes

- cf96041: Added `gitlab:issue:edit` action to edit existing GitLab issues
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/backend-common@0.23.0-next.2
  - @backstage/integration@1.12.0-next.0
  - @backstage/plugin-scaffolder-node@0.4.5-next.2
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.4.1-next.1

### Patch Changes

- 829e0ec: Add new `gitlab:pipeline:trigger` action to trigger GitLab pipelines.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.1
  - @backstage/backend-common@0.23.0-next.1
  - @backstage/plugin-scaffolder-node@0.4.5-next.1

## 0.4.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.1-next.0
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/plugin-scaffolder-node@0.4.5-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.11.0

## 0.4.0

### Minor Changes

- 18f736f: Add examples for `gitlab:projectVariable:create` scaffolder action & improve related tests

### Patch Changes

- 8fa8a00: Add merge method and squash option for project creation
- d229dc4: Move path utilities from `backend-common` to the `backend-plugin-api` package.
- ffc73ec: Add examples for `gitlab:repo:push` scaffolder action & improve related tests
- Updated dependencies
  - @backstage/backend-common@0.22.0
  - @backstage/backend-plugin-api@0.6.18
  - @backstage/plugin-scaffolder-node@0.4.4
  - @backstage/integration@1.11.0

## 0.4.0-next.2

### Minor Changes

- 18f736f: Add examples for `gitlab:projectVariable:create` scaffolder action & improve related tests

### Patch Changes

- 8fa8a00: Add merge method and squash option for project creation
- Updated dependencies
  - @backstage/backend-common@0.22.0-next.2
  - @backstage/plugin-scaffolder-node@0.4.4-next.2
  - @backstage/integration@1.11.0-next.0

## 0.3.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.0-next.1
  - @backstage/plugin-scaffolder-node@0.4.4-next.1
  - @backstage/backend-plugin-api@0.6.18-next.1

## 0.3.4-next.0

### Patch Changes

- ffc73ec: Add examples for `gitlab:repo:push` scaffolder action & improve related tests
- Updated dependencies
  - @backstage/backend-common@0.21.8-next.0
  - @backstage/backend-plugin-api@0.6.18-next.0
  - @backstage/plugin-scaffolder-node@0.4.4-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.10.0

## 0.3.3

### Patch Changes

- aa514d1: Add examples for `publish:gitlab:merge-request` scaffolder action & improve related tests
- 52f40ea: Add examples for `gitlab:group:ensureExists` scaffolder action & improve related tests
- 33f958a: Improve examples to ensure consistency across all publish actions
- d112225: Add examples for `gitlab:projectDeployToken:create` scaffolder action & improve related tests
- Updated dependencies
  - @backstage/backend-common@0.21.7
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/integration@1.10.0
  - @backstage/plugin-scaffolder-node@0.4.3
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.3.3-next.1

### Patch Changes

- 33f958a: Improve examples to ensure consistency across all publish actions
- Updated dependencies
  - @backstage/backend-common@0.21.7-next.1
  - @backstage/backend-plugin-api@0.6.17-next.1
  - @backstage/plugin-scaffolder-node@0.4.3-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.10.0-next.0

## 0.3.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.0
  - @backstage/integration@1.10.0-next.0
  - @backstage/backend-plugin-api@0.6.17-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-scaffolder-node@0.4.3-next.0

## 0.3.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.6
  - @backstage/backend-plugin-api@0.6.16
  - @backstage/plugin-scaffolder-node@0.4.2
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.9.1

## 0.3.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.5
  - @backstage/plugin-scaffolder-node@0.4.1
  - @backstage/backend-plugin-api@0.6.15
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.9.1

## 0.3.0

### Minor Changes

- 6bfb7b1: Output the `iid` as `issuesIid` from the `gitlab:issues:create` action

### Patch Changes

- f44589d: Introduced `createMockActionContext` to unify the way of creating scaffolder mock context.

  It will help to maintain tests in a long run during structural changes of action context.

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.4.0
  - @backstage/backend-common@0.21.4
  - @backstage/integration@1.9.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/backend-plugin-api@0.6.14

## 0.3.0-next.2

### Minor Changes

- 6bfb7b1: Output the `iid` as `issuesIid` from the `gitlab:issues:create` action

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.4.0-next.2
  - @backstage/integration@1.9.1-next.2
  - @backstage/backend-common@0.21.4-next.2
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/config@1.2.0-next.1
  - @backstage/errors@1.2.4-next.0

## 0.2.17-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/plugin-scaffolder-node@0.4.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/errors@1.2.4-next.0

## 0.2.16-next.0

### Patch Changes

- f44589d: Introduced `createMockActionContext` to unify the way of creating scaffolder mock context.

  It will help to maintain tests in a long run during structural changes of action context.

- Updated dependencies
  - @backstage/backend-common@0.21.3-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-scaffolder-node@0.3.3-next.0
  - @backstage/backend-plugin-api@0.6.13-next.0
  - @backstage/config@1.1.2-next.0
  - @backstage/integration@1.9.1-next.0

## 0.2.13

### Patch Changes

- e9a5228: Exporting a default module for the new Backend System
- 9aac2b0: Use `--cwd` as the first `yarn` argument
- 1cd2740: Use the Gitbeaker library for `gitlab:projectAccessToken:create` action, enabling the `expiresAt` option
- Updated dependencies
  - @backstage/backend-common@0.21.0
  - @backstage/backend-plugin-api@0.6.10
  - @backstage/integration@1.9.0
  - @backstage/plugin-scaffolder-node@0.3.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.2.13-next.3

### Patch Changes

- 1cd2740: Use the Gitbeaker library for `gitlab:projectAccessToken:create` action, enabling the `expiresAt` option
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.3
  - @backstage/integration@1.9.0-next.1
  - @backstage/plugin-scaffolder-node@0.3.0-next.3
  - @backstage/backend-plugin-api@0.6.10-next.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.2.13-next.2

### Patch Changes

- 9aac2b0: Use `--cwd` as the first `yarn` argument
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/plugin-scaffolder-node@0.3.0-next.2
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.9.0-next.0

## 0.2.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/backend-common@0.21.0-next.1
  - @backstage/integration@1.9.0-next.0
  - @backstage/plugin-scaffolder-node@0.3.0-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.2.13-next.0

### Patch Changes

- e9a5228: Exporting a default module for the new Backend System
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.0
  - @backstage/plugin-scaffolder-node@0.3.0-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0

## 0.2.12

### Patch Changes

- 604c9dd: Add Scaffolder custom action that creates GitLab issues called `gitlab:issues:create`
- 7c522c5: Add `gitlab:repo:push` scaffolder action to push files to arbitrary branch without creating a Merge Request
- Updated dependencies
  - @backstage/backend-common@0.20.1
  - @backstage/plugin-scaffolder-node@0.2.10
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0

## 0.2.12-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.2
  - @backstage/plugin-scaffolder-node@0.2.10-next.2

## 0.2.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.1
  - @backstage/integration@1.8.0
  - @backstage/config@1.1.1
  - @backstage/plugin-scaffolder-node@0.2.10-next.1
  - @backstage/errors@1.2.3

## 0.2.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0
  - @backstage/plugin-scaffolder-node@0.2.10-next.0

## 0.2.11

### Patch Changes

- 219d7f0: Extract some more actions to this library
- 0cbb03b: Fixing regular expression ReDoS with zod packages. Upgrading to latest. ref: https://security.snyk.io/vuln/SNYK-JS-ZOD-5925617
- Updated dependencies
  - @backstage/backend-common@0.20.0
  - @backstage/plugin-scaffolder-node@0.2.9
  - @backstage/integration@1.8.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.2.11-next.3

### Patch Changes

- 219d7f0: Extract some more actions to this library
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.2.9-next.3
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0-next.1

## 0.2.11-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0-next.1
  - @backstage/plugin-scaffolder-node@0.2.9-next.2

## 0.2.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.8.0-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-scaffolder-node@0.2.9-next.1

## 0.2.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.8.0-next.0
  - @backstage/plugin-scaffolder-node@0.2.9-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.2.10

### Patch Changes

- 26ca97ebaa: Add examples for `gitlab:projectAccessToken:create` scaffolder action & improve related tests
- Updated dependencies
  - @backstage/integration@1.7.2
  - @backstage/plugin-scaffolder-node@0.2.8
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.2.10-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.2.8-next.2

## 0.2.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.7.2-next.0
  - @backstage/plugin-scaffolder-node@0.2.8-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.2.10-next.0

### Patch Changes

- 26ca97ebaa: Add examples for `gitlab:projectAccessToken:create` scaffolder action & improve related tests
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.2.8-next.0
  - @backstage/integration@1.7.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.2.9

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.7.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-scaffolder-node@0.2.6
  - @backstage/config@1.1.1

## 0.2.9-next.2

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.7.1-next.1
  - @backstage/errors@1.2.3-next.0
  - @backstage/plugin-scaffolder-node@0.2.6-next.2
  - @backstage/config@1.1.1-next.0

## 0.2.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.2.5-next.1
  - @backstage/config@1.1.0
  - @backstage/errors@1.2.2
  - @backstage/integration@1.7.1-next.0

## 0.2.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.7.1-next.0
  - @backstage/plugin-scaffolder-node@0.2.5-next.0
  - @backstage/config@1.1.0
  - @backstage/errors@1.2.2

## 0.2.6

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0
  - @backstage/errors@1.2.2
  - @backstage/integration@1.7.0
  - @backstage/plugin-scaffolder-node@0.2.3

## 0.2.6-next.3

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.2
  - @backstage/errors@1.2.2-next.0
  - @backstage/integration@1.7.0-next.3
  - @backstage/plugin-scaffolder-node@0.2.3-next.3

## 0.2.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/integration@1.7.0-next.2
  - @backstage/plugin-scaffolder-node@0.2.3-next.2
  - @backstage/errors@1.2.1

## 0.2.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.0
  - @backstage/integration@1.7.0-next.1
  - @backstage/plugin-scaffolder-node@0.2.3-next.1
  - @backstage/errors@1.2.1

## 0.2.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.7.0-next.0
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/plugin-scaffolder-node@0.2.2-next.0

## 0.2.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.2.0
  - @backstage/integration@1.6.0
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1

## 0.2.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.6-next.2

## 0.2.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.6-next.1
  - @backstage/integration@1.5.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1

## 0.2.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/integration@1.5.1
  - @backstage/plugin-scaffolder-node@0.1.6-next.0

## 0.2.2

### Patch Changes

- dd367967e2e1: Fixed a bug in `gitlab:group:ensureExists` where `repos` was always set as the root group.
- Updated dependencies
  - @backstage/errors@1.2.1
  - @backstage/config@1.0.8
  - @backstage/integration@1.5.1
  - @backstage/plugin-scaffolder-node@0.1.5

## 0.2.2-next.1

### Patch Changes

- dd367967e2e1: Fixed a bug in `gitlab:group:ensureExists` where `repos` was always set as the root group.
- Updated dependencies
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1-next.0
  - @backstage/integration@1.5.1-next.0
  - @backstage/plugin-scaffolder-node@0.1.5-next.0

## 0.2.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1-next.0
  - @backstage/config@1.0.8
  - @backstage/integration@1.5.1-next.0
  - @backstage/plugin-scaffolder-node@0.1.5-next.0

## 0.2.1

### Patch Changes

- 50c4457119ec: Fixed publish configuration.
- 30e6edd7f6a5: Add support for dry run for `gitlab:group:ensureExists` action.
- f5a66052f04f: Tweak README
- Updated dependencies
  - @backstage/integration@1.5.0
  - @backstage/errors@1.2.0
  - @backstage/config@1.0.8
  - @backstage/plugin-scaffolder-node@0.1.4

## 0.2.1-next.3

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.7
  - @backstage/errors@1.2.0-next.0
  - @backstage/integration@1.5.0-next.0
  - @backstage/plugin-scaffolder-node@0.1.4-next.2

## 0.2.1-next.2

### Patch Changes

- 30e6edd7f6a5: Add support for dry run for `gitlab:group:ensureExists` action.
- Updated dependencies
  - @backstage/config@1.0.7

## 0.2.1-next.1

### Patch Changes

- 50c4457119ec: Fixed publish configuration.
- Updated dependencies
  - @backstage/integration@1.5.0-next.0
  - @backstage/errors@1.2.0-next.0
  - @backstage/plugin-scaffolder-node@0.1.4-next.1
  - @backstage/config@1.0.7

## 0.2.1-next.0

### Patch Changes

- f5a66052f04f: Tweak README
- Updated dependencies
  - @backstage/integration@1.4.5
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-scaffolder-node@0.1.4-next.0

## 0.2.0

### Minor Changes

- 439e2986be1: Add a new scaffolder action for gitlab to ensure a group exists

### Patch Changes

- f1496d4ab6f: Fix input schema validation issue for gitlab actions:

  - gitlab:group:ensureExists
  - gitlab:projectAccessToken:create
  - gitlab:projectDeployToken:create
  - gitlab:projectVariable:create

- Updated dependencies
  - @backstage/integration@1.4.5
  - @backstage/plugin-scaffolder-node@0.1.3
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5

## 0.2.0-next.2

### Minor Changes

- 439e2986be1: Add a new scaffolder action for gitlab to ensure a group exists

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.3-next.2
  - @backstage/config@1.0.7

## 0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.3-next.1
  - @backstage/config@1.0.7

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.4.5-next.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-scaffolder-node@0.1.3-next.0

## 0.1.0

### Minor Changes

- 1ad400bb2de: Add Gitlab Scaffolder Plugin

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.2
  - @backstage/integration@1.4.4
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5

## 0.1.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/integration@1.4.4-next.0
  - @backstage/plugin-scaffolder-node@0.1.2-next.3

## 0.1.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.2-next.2
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/integration@1.4.4-next.0

## 0.1.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.2-next.1
  - @backstage/integration@1.4.4-next.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5

## 0.1.0-next.0

### Minor Changes

- 1ad400bb2de: Add Gitlab Scaffolder Plugin

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.2-next.0
  - @backstage/config@1.0.7
  - @backstage/integration@1.4.3
  - @backstage/errors@1.1.5
