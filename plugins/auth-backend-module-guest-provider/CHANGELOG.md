# @backstage/plugin-auth-backend-module-guest-provider

## 0.1.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.4-next.2
  - @backstage/plugin-auth-node@0.4.9-next.2
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0

## 0.1.0-next.1

### Patch Changes

- 72dd380: Ensure that the config schema is present
- Updated dependencies
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/catalog-model@1.4.5-next.0
  - @backstage/errors@1.2.4-next.0

## 0.1.0-next.0

### Minor Changes

- 1bedb23: Adds a new guest provider that maps guest users to actual tokens. This also shifts the default guest login to `user:development/guest` to reduce overlap with your production/real data. To change that (or set it back to the old default, use the new `auth.providers.guest.userEntityRef` config key) like so,

  ```yaml title=app-config.yaml
  auth:
    providers:
      guest:
        userEntityRef: user:default/guest
  ```

  This also adds a new property to control the ownership entity refs,

  ```yaml title=app-config.yaml
  auth:
    providers:
      guest:
        ownershipEntityRefs:
          - guests
          - development/custom
  ```

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.3-next.0
  - @backstage/plugin-auth-node@0.4.8-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/backend-plugin-api@0.6.13-next.0
  - @backstage/catalog-model@1.4.5-next.0
