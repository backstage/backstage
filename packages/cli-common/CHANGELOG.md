# @backstage/cli-common

## 0.1.8

### Patch Changes

- Fix for the previous release with missing type declarations.

## 0.1.7

### Patch Changes

- c77c5c7eb6: Added `backstage.role` to `package.json`

## 0.1.6

### Patch Changes

- 677bfc2dd0: Keep backstage.json in sync

  The `versions:bump` script now takes care about updating the `version` property inside `backstage.json` file. The file is created if is not present.

## 0.1.5

### Patch Changes

- c2d50a0073: Add docs to the last export of cli-common

## 0.1.4

### Patch Changes

- ca0559444c: Avoid usage of `.to*Case()`, preferring `.toLocale*Case('en-US')` instead.

## 0.1.3

### Patch Changes

- d1da88a19: Properly export all used types.

## 0.1.2

### Patch Changes

- ab5cc376f: Add new `isChildPath` export
