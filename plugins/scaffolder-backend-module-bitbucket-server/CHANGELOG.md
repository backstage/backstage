# @backstage/plugin-scaffolder-backend-module-bitbucket-server

## 0.2.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/integration@1.15.0-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-scaffolder-node@0.4.11-next.2

## 0.2.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.14.0
  - @backstage/plugin-scaffolder-node@0.4.11-next.1

## 0.2.0-next.0

### Minor Changes

- d425fc4: **BREAKING**: The return values from `createBackendPlugin`, `createBackendModule`, and `createServiceFactory` are now simply `BackendFeature` and `ServiceFactory`, instead of the previously deprecated form of a function that returns them. For this reason, `createServiceFactory` also no longer accepts the callback form where you provide direct options to the service. This also affects all `coreServices.*` service refs.

  This may in particular affect tests; if you were effectively doing `createBackendModule({...})()` (note the parentheses), you can now remove those extra parentheses at the end. You may encounter cases of this in your `packages/backend/src/index.ts` too, where you add plugins, modules, and services. If you were using `createServiceFactory` with a function as its argument for the purpose of passing in options, this pattern has been deprecated for a while and is no longer supported. You may want to explore the new multiton patterns to achieve your goals, or moving settings to app-config.

  As part of this change, the `IdentityFactoryOptions` type was removed, and can no longer be used to tweak that service. The identity service was also deprecated some time ago, and you will want to [migrate to the new auth system](https://backstage.io/docs/tutorials/auth-service-migration) if you still rely on it.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.0
  - @backstage/plugin-scaffolder-node@0.4.11-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.14.0

## 0.1.13

### Patch Changes

- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- e3b64be: Added examples for publish:bitbucketServer action and improve its test cases
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/plugin-scaffolder-node@0.4.9
  - @backstage/integration@1.14.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.13-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.14.0-next.0
  - @backstage/plugin-scaffolder-node@0.4.9-next.3

## 0.1.13-next.2

### Patch Changes

- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/plugin-scaffolder-node@0.4.9-next.2
  - @backstage/integration@1.14.0-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.13-next.1

### Patch Changes

- e3b64be: Added examples for publish:bitbucketServer action and improve its test cases
- Updated dependencies
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/integration@1.14.0-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-scaffolder-node@0.4.9-next.1

## 0.1.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.14.0-next.0
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-scaffolder-node@0.4.9-next.0

## 0.1.12

### Patch Changes

- 6a4ad4e: Instead of using hardcoded `targetBranch` now fetch the default branch from Bitbucket repository.
  This prevents from errors when no `targetBranch` is provided and the default repository branch is different from `master`, for example: `main`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/integration@1.13.0
  - @backstage/plugin-scaffolder-node@0.4.8
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.13.0-next.0
  - @backstage/plugin-scaffolder-node@0.4.8-next.1

## 0.1.11-next.0

### Patch Changes

- 6a4ad4e: Instead of using hardcoded `targetBranch` now fetch the default branch from Bitbucket repository.
  This prevents from errors when no `targetBranch` is provided and the default repository branch is different from `master`, for example: `main`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/integration@1.13.0-next.0
  - @backstage/plugin-scaffolder-node@0.4.7-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.9

### Patch Changes

- 78a0b08: Internal refactor to handle `BackendFeature` contract change.
- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/integration@1.12.0
  - @backstage/plugin-scaffolder-node@0.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.9-next.2

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/integration@1.12.0-next.1
  - @backstage/plugin-scaffolder-node@0.4.5-next.3
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/integration@1.12.0-next.0
  - @backstage/plugin-scaffolder-node@0.4.5-next.2
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/plugin-scaffolder-node@0.4.5-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.11.0

## 0.1.8

### Patch Changes

- 24dd655: Add examples for `publish:bitbucketServer:pull-request` scaffolder action & improve related tests
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.18
  - @backstage/plugin-scaffolder-node@0.4.4
  - @backstage/integration@1.11.0

## 0.1.8-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.4.4-next.2
  - @backstage/integration@1.11.0-next.0

## 0.1.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.4.4-next.1
  - @backstage/backend-plugin-api@0.6.18-next.1

## 0.1.8-next.0

### Patch Changes

- 24dd655: Add examples for `publish:bitbucketServer:pull-request` scaffolder action & improve related tests
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.18-next.0
  - @backstage/plugin-scaffolder-node@0.4.4-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.10.0

## 0.1.7

### Patch Changes

- 4a15c86: Add examples for `publish:bitbucketServer` scaffolder action & improve related tests
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/integration@1.10.0
  - @backstage/plugin-scaffolder-node@0.4.3
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.7-next.1

### Patch Changes

- 4a15c86: Add examples for `publish:bitbucketServer` scaffolder action & improve related tests
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.17-next.1
  - @backstage/plugin-scaffolder-node@0.4.3-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.10.0-next.0

## 0.1.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.10.0-next.0
  - @backstage/backend-plugin-api@0.6.17-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-scaffolder-node@0.4.3-next.0

## 0.1.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.16
  - @backstage/plugin-scaffolder-node@0.4.2
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.9.1

## 0.1.5

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.4.1
  - @backstage/backend-plugin-api@0.6.15
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.9.1

## 0.1.4

### Patch Changes

- 2bd1410: Removed unused dependencies
- 0e48aaf: Added an option to specify a commit author by adding `gitAuthorName` and `gitAuthorEmail` options to the `publish:bitbucketServer:pull-request` action
- f44589d: Introduced `createMockActionContext` to unify the way of creating scaffolder mock context.

  It will help to maintain tests in a long run during structural changes of action context.

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.4.0
  - @backstage/integration@1.9.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/backend-plugin-api@0.6.14

## 0.1.4-next.2

### Patch Changes

- 2bd1410: Removed unused dependencies
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.4.0-next.2
  - @backstage/integration@1.9.1-next.2
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/config@1.2.0-next.1
  - @backstage/errors@1.2.4-next.0

## 0.1.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/plugin-scaffolder-node@0.4.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/errors@1.2.4-next.0

## 0.1.3-next.0

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

## 0.1.0

### Minor Changes

- 5eb6882: New scaffolder module `@backstage/plugin-scaffolder-backend-module-bitbucket-server`.

  Extracted from `@backstage/plugin-scaffolder-backend-module-bitbucket`
  and replaces its actions related to Bitbucket Server.

  - `publish:bitbucketServer`
  - `publish:bitbucketServer:pull-request`

### Patch Changes

- 8472188: Added or fixed the `repository` field in `package.json`.
- 6bb6f3e: Updated dependency `fs-extra` to `^11.2.0`.
  Updated dependency `@types/fs-extra` to `^11.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.21.0
  - @backstage/backend-plugin-api@0.6.10
  - @backstage/integration@1.9.0
  - @backstage/plugin-scaffolder-node@0.3.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.1.0-next.1

### Patch Changes

- 8472188: Added or fixed the `repository` field in `package.json`.
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.3
  - @backstage/integration@1.9.0-next.1
  - @backstage/plugin-scaffolder-node@0.3.0-next.3
  - @backstage/backend-plugin-api@0.6.10-next.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.1.0-next.0

### Minor Changes

- 5eb6882: New scaffolder module `@backstage/plugin-scaffolder-backend-module-bitbucket-server`.

  Extracted from `@backstage/plugin-scaffolder-backend-module-bitbucket`
  and replaces its actions related to Bitbucket Server.

  - `publish:bitbucketServer`
  - `publish:bitbucketServer:pull-request`

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/plugin-scaffolder-node@0.3.0-next.2
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.9.0-next.0
