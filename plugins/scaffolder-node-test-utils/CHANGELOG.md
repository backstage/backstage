# @backstage/plugin-scaffolder-node-test-utils

## 0.1.0

### Minor Changes

- f44589d: Introduced `createMockActionContext` to unify the way of creating scaffolder mock context.

  It will help to maintain tests in a long run during structural changes of action context.

### Patch Changes

- 2bd1410: Removed unused dependencies
- aa543c9: Add an initiator credentials getter to the default mock context.
- 563dfd0: Fix issue with package bundling, should be `dist/index.cjs.js` instead of `dist/index.esm.js`.
- bbd1fe1: Made "checkpoint" on scaffolder action context non-optional
- Updated dependencies
  - @backstage/backend-test-utils@0.3.4
  - @backstage/plugin-scaffolder-node@0.4.0
  - @backstage/backend-common@0.21.4
  - @backstage/types@1.1.1

## 0.1.0-next.2

### Patch Changes

- 2bd1410: Removed unused dependencies
- 563dfd0: Fix issue with package bundling, should be `dist/index.cjs.js` instead of `dist/index.esm.js`.
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.4.0-next.2
  - @backstage/backend-common@0.21.4-next.2
  - @backstage/backend-test-utils@0.3.4-next.2
  - @backstage/types@1.1.1

## 0.1.0-next.1

### Patch Changes

- aa543c9: Add an initiator credentials getter to the default mock context.
- bbd1fe1: Made "checkpoint" on scaffolder action context non-optional
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.4.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-test-utils@0.3.4-next.1
  - @backstage/types@1.1.1
  - @backstage/plugin-scaffolder-common@1.5.1-next.1

## 0.1.0-next.0

### Minor Changes

- f44589d: Introduced `createMockActionContext` to unify the way of creating scaffolder mock context.

  It will help to maintain tests in a long run during structural changes of action context.

### Patch Changes

- Updated dependencies
  - @backstage/backend-test-utils@0.3.3-next.0
  - @backstage/backend-common@0.21.3-next.0
  - @backstage/plugin-scaffolder-node@0.3.3-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-scaffolder-common@1.5.1-next.0
