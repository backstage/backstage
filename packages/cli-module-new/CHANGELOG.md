# @backstage/cli-module-new

## 0.1.2-next.2

### Patch Changes

- 482ceed: Migrated from `assertError` to `toError` for error handling.
- Updated dependencies
  - @backstage/errors@1.3.0-next.0
  - @backstage/cli-common@0.2.1-next.1
  - @backstage/cli-node@0.3.1-next.1

## 0.1.1-next.1

### Patch Changes

- 64a91d0: Rename the legacy `frontend-plugin` to `frontend-plugin-legacy`

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-common@0.2.1-next.0
  - @backstage/cli-node@0.3.1-next.0
  - @backstage/errors@1.2.7

## 0.1.0

### Minor Changes

- 329f394: Initial release of the CLI module packages. Each module provides a set of commands that can be discovered automatically by `@backstage/cli` or executed standalone.

### Patch Changes

- edf2b77: Added support for the `cli-module` template role for scaffolding new CLI module packages.
- ea90ab0: The built-in `yarn new` templates have been moved to this package from `@backstage/cli`. The default template references have been updated from `@backstage/cli/templates/*` to `@backstage/cli-module-new/templates/*`. Existing references to `@backstage/cli/templates/*` in your root `package.json` will continue to work through a backwards compatibility rewrite.
- ebeb0d4: Updated the new frontend plugin template to use `@backstage/frontend-dev-utils` in its `dev/` entry point instead of wiring `createApp` manually. Generated plugins now get the same dev app helper setup as the built-in examples.
- 971cc94: The `new` command now prompts for the plugin package name when creating plugin modules, in order to properly populate the `package.json` file.
- a49a40d: Updated dependency `zod` to `^3.25.76 || ^4.0.0` & migrated to `/v3` or `/v4` imports.
- Updated dependencies
  - @backstage/cli-node@0.3.0
  - @backstage/cli-common@0.2.0
