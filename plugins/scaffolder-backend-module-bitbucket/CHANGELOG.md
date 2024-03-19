# @backstage/plugin-scaffolder-backend-module-bitbucket

## 0.2.4

### Patch Changes

- 2bd1410: Removed unused dependencies
- f44589d: Introduced `createMockActionContext` to unify the way of creating scaffolder mock context.

  It will help to maintain tests in a long run during structural changes of action context.

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.4.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.1.4
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.1.4
  - @backstage/integration@1.9.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/backend-plugin-api@0.6.14

## 0.2.4-next.2

### Patch Changes

- 2bd1410: Removed unused dependencies
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.4.0-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.1.4-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.1.4-next.2
  - @backstage/integration@1.9.1-next.2
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/config@1.2.0-next.1
  - @backstage/errors@1.2.4-next.0

## 0.2.4-next.1

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

## 0.2.3-next.0

### Patch Changes

- f44589d: Introduced `createMockActionContext` to unify the way of creating scaffolder mock context.

  It will help to maintain tests in a long run during structural changes of action context.

- Updated dependencies
  - @backstage/backend-common@0.21.3-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-scaffolder-node@0.3.3-next.0
  - @backstage/backend-plugin-api@0.6.13-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.1.3-next.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.1.3-next.0
  - @backstage/config@1.1.2-next.0
  - @backstage/integration@1.9.1-next.0

## 0.2.0

### Minor Changes

- 5eb6882: Split `@backstage/plugin-scaffolder-backend-module-bitbucket` into
  `@backstage/plugin-scaffolder-backend-module-bitbucket-cloud` and
  `@backstage/plugin-scaffolder-backend-module-bitbucket-server`.

  `@backstage/plugin-scaffolder-backend-module-bitbucket` was **deprecated** in favor of these two replacements.

  Please use any of the two replacements depending on your needs.

  ```diff
  - backend.add(import('@backstage/plugin-scaffolder-backend-module-bitbucket'));
  + backend.add(import('@backstage/plugin-scaffolder-backend-module-bitbucket-cloud'));
  + backend.add(import('@backstage/plugin-scaffolder-backend-module-bitbucket-server'));
  ```

### Patch Changes

- e9a5228: Exporting a default module for the new Backend System
- 8472188: Added or fixed the `repository` field in `package.json`.
- 6bb6f3e: Updated dependency `fs-extra` to `^11.2.0`.
  Updated dependency `@types/fs-extra` to `^11.0.0`.
- fc98bb6: Enhanced the pull request action to allow for adding new content to the PR as described in this issue #21762
- Updated dependencies
  - @backstage/backend-common@0.21.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.1.0
  - @backstage/backend-plugin-api@0.6.10
  - @backstage/integration@1.9.0
  - @backstage/plugin-scaffolder-node@0.3.0
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.1.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.2.0-next.3

### Patch Changes

- 8472188: Added or fixed the `repository` field in `package.json`.
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.3
  - @backstage/integration@1.9.0-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.1.0-next.1
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.1.0-next.1
  - @backstage/plugin-scaffolder-node@0.3.0-next.3
  - @backstage/backend-plugin-api@0.6.10-next.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.2.0-next.2

### Minor Changes

- 5eb6882: Split `@backstage/plugin-scaffolder-backend-module-bitbucket` into
  `@backstage/plugin-scaffolder-backend-module-bitbucket-cloud` and
  `@backstage/plugin-scaffolder-backend-module-bitbucket-server`.

  `@backstage/plugin-scaffolder-backend-module-bitbucket` was **deprecated** in favor of these two replacements.

  Please use any of the two replacements depending on your needs.

  ```diff
  - backend.add(import('@backstage/plugin-scaffolder-backend-module-bitbucket'));
  + backend.add(import('@backstage/plugin-scaffolder-backend-module-bitbucket-cloud'));
  + backend.add(import('@backstage/plugin-scaffolder-backend-module-bitbucket-server'));
  ```

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend-module-bitbucket-server@0.1.0-next.0
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/plugin-scaffolder-backend-module-bitbucket-cloud@0.1.0-next.0
  - @backstage/plugin-scaffolder-node@0.3.0-next.2
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.9.0-next.0

## 0.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/backend-common@0.21.0-next.1
  - @backstage/integration@1.9.0-next.0
  - @backstage/plugin-scaffolder-node@0.3.0-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.1.2-next.0

### Patch Changes

- e9a5228: Exporting a default module for the new Backend System
- fc98bb6: Enhanced the pull request action to allow for adding new content to the PR as described in this issue #21762
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.0
  - @backstage/plugin-scaffolder-node@0.3.0-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0

## 0.1.1

### Patch Changes

- a694f71: The Scaffolder builtin actions now contains an action for running pipelines from Bitbucket Cloud Rest API
- Updated dependencies
  - @backstage/backend-common@0.20.1
  - @backstage/plugin-scaffolder-node@0.2.10
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0

## 0.1.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.2
  - @backstage/plugin-scaffolder-node@0.2.10-next.2

## 0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.1
  - @backstage/integration@1.8.0
  - @backstage/config@1.1.1
  - @backstage/plugin-scaffolder-node@0.2.10-next.1
  - @backstage/errors@1.2.3

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0
  - @backstage/plugin-scaffolder-node@0.2.10-next.0

## 0.1.0

### Minor Changes

- 219d7f0: Create new scaffolder module for external integrations

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0
  - @backstage/plugin-scaffolder-node@0.2.9
  - @backstage/integration@1.8.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.1.0-next.0

### Minor Changes

- 219d7f0: Create new scaffolder module for external integrations

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.2.9-next.3
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0-next.1
