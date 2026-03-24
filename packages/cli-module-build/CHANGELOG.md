# @backstage/cli-module-build

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.2.1-next.0
  - @backstage/cli-node@0.3.1-next.0
  - @backstage/config-loader@1.10.10-next.0
  - @backstage/config@1.3.6
  - @backstage/errors@1.2.7
  - @backstage/module-federation-common@0.1.2

## 0.1.0

### Minor Changes

- 62d0849: Added `package bundle` command to create self-contained plugin bundles for dynamic loading, to be used by the `backend-dynamic-feature-service`. Supports backend and frontend plugins, with optional `--pre-packed-dir` for batch bundling from a pre-built workspace.
- 329f394: Initial release of the CLI module packages. Each module provides a set of commands that can be discovered automatically by `@backstage/cli` or executed standalone.

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.0
  - @backstage/cli-common@0.2.0
  - @backstage/module-federation-common@0.1.2
  - @backstage/config-loader@1.10.9
