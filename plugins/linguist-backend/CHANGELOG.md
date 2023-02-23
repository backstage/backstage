# @backstage/plugin-linguist-backend

## 0.2.0-next.0

### Minor Changes

- 4a1c318853: **BREAKING** The linguist-backend `createRouter` now requires that the `tokenManger` is passed to the router.

### Patch Changes

- 2ea5782162: Fixed bug in LinguistBackendApi that caused initial batch of entities to be skipped.
- Updated dependencies
  - @backstage/catalog-client@1.4.0-next.0
  - @backstage/backend-tasks@0.4.4-next.0
  - @backstage/backend-common@0.18.3-next.0
  - @backstage/catalog-model@1.2.1-next.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.12-next.0
  - @backstage/plugin-linguist-common@0.1.0

## 0.1.0

### Minor Changes

- 75cfee5688: Introduced the Linguist plugin, checkout the plugin's `README.md` for more details!

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2
  - @backstage/catalog-model@1.2.0
  - @backstage/plugin-linguist-common@0.1.0
  - @backstage/backend-tasks@0.4.3
  - @backstage/catalog-client@1.3.1
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.11
