# @backstage/cli-module-actions

## 0.1.0

### Minor Changes

- c705d44: Added improved CLI output formatting and UX for the actions module. The `list` command now groups actions by plugin source with colored headers and action titles. The `execute --help` command renders full action details including markdown descriptions. Complex schema types like objects, arrays, and union types are now accepted as JSON flags. Error messages from the server are now surfaced directly. The `sources add` and `sources remove` commands accept multiple plugin IDs at once.

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.0
  - @backstage/cli-node@0.3.1

## 0.0.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.3.0-next.0
  - @backstage/cli-node@0.3.1-next.1

## 0.0.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/cli-node@0.3.1-next.0
  - @backstage/errors@1.2.7

## 0.0.1

### Patch Changes

- 42960f1: Added `actions` CLI module for listing and executing actions from the distributed actions registry. Includes `actions list`, `actions execute`, and `actions sources` commands for managing plugin sources.
- Updated dependencies
  - @backstage/cli-node@0.3.0
