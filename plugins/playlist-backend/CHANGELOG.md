# @backstage/plugin-playlist-backend

## 0.2.0-next.2

### Minor Changes

- eb25f7e12d: **BREAKING** The exported permission rules have changed to reflect the breaking changes made to the PermissionRule type.

  For example, the `playlistConditions.isOwner` API has changed from:

  ```ts
  playlistConditions.isOwner(['user:default/me', 'group:default/owner']);
  ```

  to:

  ```ts
  playlistConditions.isOwner({
    owners: ['user:default/me', 'group:default/owner'],
  });
  ```

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2-next.2
  - @backstage/plugin-permission-common@0.7.0-next.2
  - @backstage/plugin-permission-node@0.7.0-next.2
  - @backstage/backend-test-utils@0.1.29-next.2
  - @backstage/plugin-auth-node@0.2.6-next.2
  - @backstage/plugin-playlist-common@0.1.1-next.2
  - @backstage/catalog-client@1.1.1-next.2
  - @backstage/catalog-model@1.1.2-next.2
  - @backstage/config@1.0.3-next.2
  - @backstage/errors@1.1.2-next.2

## 0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.1.1-next.1
  - @backstage/backend-common@0.15.2-next.1
  - @backstage/backend-test-utils@0.1.29-next.1
  - @backstage/catalog-model@1.1.2-next.1
  - @backstage/config@1.0.3-next.1
  - @backstage/errors@1.1.2-next.1
  - @backstage/plugin-auth-node@0.2.6-next.1
  - @backstage/plugin-permission-common@0.6.5-next.1
  - @backstage/plugin-permission-node@0.6.6-next.1
  - @backstage/plugin-playlist-common@0.1.1-next.1

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.2-next.0
  - @backstage/backend-test-utils@0.1.29-next.0
  - @backstage/catalog-client@1.1.1-next.0
  - @backstage/backend-common@0.15.2-next.0
  - @backstage/plugin-auth-node@0.2.6-next.0
  - @backstage/plugin-permission-node@0.6.6-next.0
  - @backstage/config@1.0.3-next.0
  - @backstage/errors@1.1.2-next.0
  - @backstage/plugin-permission-common@0.6.5-next.0
  - @backstage/plugin-playlist-common@0.1.1-next.0

## 0.1.0

### Minor Changes

- d3737da337: Implement playlist plugin, check out the `README.md` for more details!

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.1
  - @backstage/plugin-auth-node@0.2.5
  - @backstage/plugin-permission-node@0.6.5
  - @backstage/catalog-client@1.1.0
  - @backstage/catalog-model@1.1.1
  - @backstage/config@1.0.2
  - @backstage/errors@1.1.1
  - @backstage/plugin-permission-common@0.6.4
  - @backstage/backend-test-utils@0.1.28
  - @backstage/plugin-playlist-common@0.1.0
