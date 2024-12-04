# @backstage/release-manifests

## 0.0.12-next.1

### Patch Changes

- b29eaea: Allow overriding the fetch function used inside getManifestByVersion

## 0.0.12-next.0

### Patch Changes

- 2e140dc: Switch to native fetch for loading release manifests

## 0.0.11

### Patch Changes

- 4aa43f62aa: Updated dependency `cross-fetch` to `^4.0.0`.

## 0.0.10

### Patch Changes

- 406b786a2a2c: Mark package as being free of side effects, allowing more optimized Webpack builds.
- 8cec7664e146: Removed `@types/node` dependency

## 0.0.10-next.1

### Patch Changes

- 406b786a2a2c: Mark package as being free of side effects, allowing more optimized Webpack builds.

## 0.0.10-next.0

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency

## 0.0.9

### Patch Changes

- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.

## 0.0.9-next.0

### Patch Changes

- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.

## 0.0.8

### Patch Changes

- 3280711113: Updated dependency `msw` to `^0.49.0`.

## 0.0.8-next.0

### Patch Changes

- 3280711113: Updated dependency `msw` to `^0.49.0`.

## 0.0.7

### Patch Changes

- a4496131fa: Added a fallback that fetches manifests from `https://raw.githubusercontent.com` if `https://versions.backstage.io` is unavailable.

## 0.0.7-next.0

### Patch Changes

- a4496131fa: Added a fallback that fetches manifests from `https://raw.githubusercontent.com` if `https://versions.backstage.io` is unavailable.

## 0.0.6

### Patch Changes

- 7d47def9c4: Removed dependency on `@types/jest`.
- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.

## 0.0.6-next.2

### Patch Changes

- 7d47def9c4: Removed dependency on `@types/jest`.

## 0.0.6-next.1

### Patch Changes

- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.

## 0.0.6-next.0

### Patch Changes

- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.

## 0.0.5

### Patch Changes

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 8006d0f9bf: Updated dependency `msw` to `^0.44.0`.

## 0.0.5-next.0

### Patch Changes

- a70869e775: Updated dependency `msw` to `^0.43.0`.

## 0.0.4

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.

## 0.0.4-next.0

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.

## 0.0.3

### Patch Changes

- 6e830352d4: Updated dependency `@types/node` to `^16.0.0`.

## 0.0.3-next.0

### Patch Changes

- 6e830352d4: Updated dependency `@types/node` to `^16.0.0`.

## 0.0.2

### Patch Changes

- 1ed305728b: Bump `node-fetch` to version 2.6.7 and `cross-fetch` to version 3.1.5
- c77c5c7eb6: Added `backstage.role` to `package.json`

## 0.0.1

### Patch Changes

- aeb5c69abb: Introduces a new package with utilities for fetching release manifests.
  This package will primarily be used by the `@backstage/cli` package.
