# @backstage/cli-module-build

## 0.1.1-next.2

### Patch Changes

- c16c508: When building dist-workspaces with --always-pack, batch `yarn pack` operations to avoid packing packages and their dependencies simultaneously.
- f14df56: Added experimental support for using `embedded-postgres` as the database for local development. Set `backend.database.client` to `embedded-postgres` in your app config to enable this. The `embedded-postgres` package must be installed as an explicit dependency in your project.
- Updated dependencies
  - @backstage/errors@1.3.0-next.0
  - @backstage/cli-common@0.2.1-next.1
  - @backstage/cli-node@0.3.1-next.1
  - @backstage/config-loader@1.10.10-next.1
  - @backstage/config@1.3.7-next.0
  - @backstage/module-federation-common@0.1.3-next.0

## 0.1.1-next.1

### Patch Changes

- 2e5c5f8: Bumped `glob` dependency from v7/v8/v11 to v13 to address security vulnerabilities in older versions. Bumped `rollup` from v4.27 to v4.59+ to fix a high severity path traversal vulnerability (GHSA-mw96-cpmx-2vgc).

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
