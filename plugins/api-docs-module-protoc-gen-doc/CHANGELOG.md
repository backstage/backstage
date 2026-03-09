# @backstage/plugin-api-docs-module-protoc-gen-doc

## 0.1.11

### Patch Changes

- a7e0d50: Updated `react-router-dom` peer dependency to `^6.30.2` and explicitly disabled v7 future flags to suppress deprecation warnings.

## 0.1.11-next.0

### Patch Changes

- a7e0d50: Prepare for React Router v7 migration by updating to v6.30.2 across all NFS packages and enabling v7 future flags. Convert routes from splat paths to parent/child structure with Outlet components.

## 0.1.10

### Patch Changes

- a47fd39: Removes instances of default React imports, a necessary update for the upcoming React 19 migration.

  <https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html>

## 0.1.10-next.0

### Patch Changes

- a47fd39: Removes instances of default React imports, a necessary update for the upcoming React 19 migration.

  <https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html>

## 0.1.9

### Patch Changes

- 58ec9e7: Removed older versions of React packages as a preparatory step for upgrading to React 19. This commit does not introduce any functional changes, but removes dependencies on previous React versions, allowing for a cleaner upgrade path in subsequent commits.

## 0.1.9-next.0

### Patch Changes

- 58ec9e7: Removed older versions of React packages as a preparatory step for upgrading to React 19. This commit does not introduce any functional changes, but removes dependencies on previous React versions, allowing for a cleaner upgrade path in subsequent commits.

## 0.1.8

### Patch Changes

- e969dc7: Move `@types/react` to a peer dependency.

## 0.1.8-next.0

### Patch Changes

- e969dc7: Move `@types/react` to a peer dependency.

## 0.1.7

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.

## 0.1.7-next.0

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.

## 0.1.6

### Patch Changes

- 9aac2b0: Use `--cwd` as the first `yarn` argument
- 8fe56a8: Widen `@types/react` dependency range to include version 18.

## 0.1.6-next.0

### Patch Changes

- 9aac2b0: Use `--cwd` as the first `yarn` argument
- 8fe56a8: Widen `@types/react` dependency range to include version 18.

## 0.1.5

### Patch Changes

- 6c2b872153: Add official support for React 18.

## 0.1.5-next.0

### Patch Changes

- 6c2b872153: Add official support for React 18.

## 0.1.4

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.

## 0.1.3

### Patch Changes

- 482bb5c0bbf8: Moved `@types/react` to be a regular dependency
- 406b786a2a2c: Mark package as being free of side effects, allowing more optimized Webpack builds.

## 0.1.3-next.1

### Patch Changes

- 406b786a2a2c: Mark package as being free of side effects, allowing more optimized Webpack builds.

## 0.1.3-next.0

### Patch Changes

- 482bb5c0bbf8: Moved `@types/react` to be a regular dependency

## 0.1.2

### Patch Changes

- e0c6e8b9c3c: Update peer dependencies

## 0.1.2-next.0

### Patch Changes

- e0c6e8b9c3c: Update peer dependencies

## 0.1.1

### Patch Changes

- c51efce2a0: Update docs to always use `yarn add --cwd` for app & backend

## 0.1.0

### Minor Changes

- e0328f2107: Added the new `grpcDocsApiWidget` to render `protoc-gen-doc` generated descriptors by the `grpc-docs` package.

## 0.1.0-next.0

### Minor Changes

- e0328f2107: Added the new `grpcDocsApiWidget` to render `protoc-gen-doc` generated descriptors by the `grpc-docs` package.
