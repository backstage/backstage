# @backstage/plugin-linguist-backend

## 0.3.0-next.0

### Minor Changes

- bbf91840a52a: **BREAKING**: Removed public constructor from `LinguistBackendApi`. Removed export of `LinguistBackendDatabase` and `LinguistBackendStore`

  Several improvements to the Linguist backend have been made:

  - Added tests for the `LinguistBackendDatabase` and `LinguistBackendApi`
  - Added support for using SQLite as a database, helpful for local development
  - Removed the default from the `processes_date` column
  - Converted the `LinguistBackendApi` into an Interface
  - Added the `LinguistBackendClient` which implements the `LinguistBackendApi` Interface
  - Unprocessed entities will get processed before stale entities
  - Entities in the Linguist database but not in the Catalog anymore will be deleted
  - Improved the README's headings

### Patch Changes

- 3d11596a72b5: Update plugin installation docs to be more consistent across documentations
- Updated dependencies
  - @backstage/catalog-client@1.4.2-next.0
  - @backstage/backend-common@0.18.6-next.0
  - @backstage/config@1.0.7
  - @backstage/backend-tasks@0.5.3-next.0
  - @backstage/catalog-model@1.3.0
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.15-next.0
  - @backstage/plugin-linguist-common@0.1.0

## 0.2.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5
  - @backstage/backend-tasks@0.5.2
  - @backstage/plugin-auth-node@0.2.14
  - @backstage/catalog-client@1.4.1
  - @backstage/catalog-model@1.3.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-linguist-common@0.1.0

## 0.2.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/backend-tasks@0.5.2-next.1
  - @backstage/plugin-auth-node@0.2.14-next.1
  - @backstage/config@1.0.7

## 0.2.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.0
  - @backstage/backend-tasks@0.5.2-next.0
  - @backstage/plugin-auth-node@0.2.14-next.0
  - @backstage/catalog-client@1.4.1
  - @backstage/catalog-model@1.3.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-linguist-common@0.1.0

## 0.2.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4
  - @backstage/catalog-client@1.4.1
  - @backstage/backend-tasks@0.5.1
  - @backstage/catalog-model@1.3.0
  - @backstage/plugin-auth-node@0.2.13
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-linguist-common@0.1.0

## 0.2.1-next.3

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.3.0-next.0
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/backend-tasks@0.5.1-next.2
  - @backstage/catalog-client@1.4.1-next.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.13-next.2
  - @backstage/plugin-linguist-common@0.1.0

## 0.2.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/catalog-client@1.4.1-next.0
  - @backstage/backend-tasks@0.5.1-next.2
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.13-next.2
  - @backstage/plugin-linguist-common@0.1.0

## 0.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-tasks@0.5.1-next.1
  - @backstage/backend-common@0.18.4-next.1
  - @backstage/catalog-client@1.4.0
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.13-next.1
  - @backstage/plugin-linguist-common@0.1.0

## 0.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.0
  - @backstage/config@1.0.7
  - @backstage/backend-tasks@0.5.1-next.0
  - @backstage/catalog-client@1.4.0
  - @backstage/catalog-model@1.2.1
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.13-next.0
  - @backstage/plugin-linguist-common@0.1.0

## 0.2.0

### Minor Changes

- 4a1c318853d: **BREAKING** The linguist-backend `createRouter` now requires that the `tokenManger` is passed to the router.

### Patch Changes

- 8a298b47240: Added support for linguist-js options using the linguistJSOptions in the plugin, the available config can be found [here](https://www.npmjs.com/package/linguist-js#API).
- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- 2ea57821629: Fixed bug in LinguistBackendApi that caused initial batch of entities to be skipped.
- b271d5ca052: Allow kind to be configurable

  ```ts
  return createRouter({ schedule: schedule, kind: ['Component'] }, { ...env });
  ```

- Updated dependencies
  - @backstage/catalog-client@1.4.0
  - @backstage/plugin-auth-node@0.2.12
  - @backstage/backend-tasks@0.5.0
  - @backstage/backend-common@0.18.3
  - @backstage/errors@1.1.5
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/plugin-linguist-common@0.1.0

## 0.2.0-next.2

### Patch Changes

- 8a298b47240: Added support for linguist-js options using the linguistJSOptions in the plugin, the available config can be found [here](https://www.npmjs.com/package/linguist-js#API).
- Updated dependencies
  - @backstage/plugin-auth-node@0.2.12-next.2
  - @backstage/backend-tasks@0.5.0-next.2
  - @backstage/backend-common@0.18.3-next.2
  - @backstage/config@1.0.7-next.0

## 0.2.0-next.1

### Patch Changes

- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- b271d5ca052: Allow kind to be configurable

  ```ts
  return createRouter({ schedule: schedule, kind: ['Component'] }, { ...env });
  ```

- Updated dependencies
  - @backstage/errors@1.1.5-next.0
  - @backstage/backend-common@0.18.3-next.1
  - @backstage/catalog-client@1.4.0-next.1
  - @backstage/plugin-auth-node@0.2.12-next.1
  - @backstage/backend-tasks@0.4.4-next.1
  - @backstage/config@1.0.7-next.0
  - @backstage/catalog-model@1.2.1-next.1
  - @backstage/types@1.0.2
  - @backstage/plugin-linguist-common@0.1.0

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
