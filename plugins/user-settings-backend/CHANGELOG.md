# @backstage/plugin-user-settings-backend

## 0.1.1-next.2

### Patch Changes

- f3463b176b: Use `Response.status` instead of `.send(number)`
- 2d3a5f09ab: Use `response.json` rather than `response.send` where appropriate, as outlined in `SECURITY.md`
- Updated dependencies
  - @backstage/backend-common@0.15.2-next.2
  - @backstage/plugin-auth-node@0.2.6-next.2
  - @backstage/catalog-model@1.1.2-next.2
  - @backstage/errors@1.1.2-next.2
  - @backstage/types@1.0.0

## 0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2-next.1
  - @backstage/catalog-model@1.1.2-next.1
  - @backstage/errors@1.1.2-next.1
  - @backstage/types@1.0.0
  - @backstage/plugin-auth-node@0.2.6-next.1

## 0.1.1-next.0

### Patch Changes

- 82ac9bcfe5: Fix wrong import statement in `README.md`.
- Updated dependencies
  - @backstage/catalog-model@1.1.2-next.0
  - @backstage/backend-common@0.15.2-next.0
  - @backstage/plugin-auth-node@0.2.6-next.0
  - @backstage/errors@1.1.2-next.0
  - @backstage/types@1.0.0

## 0.1.0

### Minor Changes

- 108cdc3912: Added new plugin `@backstage/plugin-user-settings-backend` to store user related
  settings in the database.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.1
  - @backstage/plugin-auth-node@0.2.5
  - @backstage/catalog-model@1.1.1
  - @backstage/errors@1.1.1
