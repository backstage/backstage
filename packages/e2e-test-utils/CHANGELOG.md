# @backstage/e2e-test-utils

## 0.1.2-next.1

### Patch Changes

- b96c20e: Added optional `channel` option to `generateProjects()` to allow customizing the Playwright browser channel for testing against different browsers variants. When not provided, the function defaults to 'chrome' to maintain backward compatibility.

  Example usage:

  ```ts
  import { generateProjects } from '@backstage/e2e-test-utils';

  export default defineConfig({
    projects: generateProjects({ channel: 'msedge' }),
  });
  ```

## 0.1.2-next.0

### Patch Changes

- 7455dae: Use node prefix on native imports

## 0.1.1

### Patch Changes

- 8472188: Added or fixed the `repository` field in `package.json`.
- 6bb6f3e: Updated dependency `fs-extra` to `^11.2.0`.
  Updated dependency `@types/fs-extra` to `^11.0.0`.

## 0.1.1-next.0

### Patch Changes

- 8472188: Added or fixed the `repository` field in `package.json`.

## 0.1.0

### Minor Changes

- f5b41b27a9: Initial release.

## 0.1.0-next.0

### Minor Changes

- f5b41b27a9: Initial release.
