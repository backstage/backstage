# @backstage/plugin-devtools-backend

## 0.1.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-permission-node@0.7.11-next.2
  - @backstage/plugin-auth-node@0.2.17-next.2
  - @backstage/config-loader@1.4.0-next.1

## 0.1.3-next.1

### Patch Changes

- 629cbd194a87: Use `coreServices.rootConfig` instead of `coreService.config`
- 12a8c94eda8d: Add package repository and homepage metadata
- 2b4f77a4e900: Add DevTools configuration to enable dependency listing to be filtered with custom prefixes. For instance, in your `app-config.yaml`:

  ```yaml
  devTools:
    info:
      packagePrefixes:
        - @backstage/
        - @roadiehq/backstage-
        - @spotify/backstage-
  ```

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.1
  - @backstage/config-loader@1.4.0-next.1
  - @backstage/plugin-devtools-common@0.1.3-next.0
  - @backstage/plugin-auth-node@0.2.17-next.1
  - @backstage/backend-plugin-api@0.6.0-next.1
  - @backstage/plugin-permission-node@0.7.11-next.1
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-permission-common@0.7.7

## 0.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config-loader@1.4.0-next.0
  - @backstage/backend-common@0.19.2-next.0
  - @backstage/backend-plugin-api@0.5.5-next.0
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-auth-node@0.2.17-next.0
  - @backstage/plugin-devtools-common@0.1.2
  - @backstage/plugin-permission-common@0.7.7
  - @backstage/plugin-permission-node@0.7.11-next.0

## 0.1.2

### Patch Changes

- 4edd1ef71453: semver upgrade to 7.5.3
- ae261e79d256: Added alpha support for the [new backend system](https://backstage.io/docs/backend-system/)
- Updated dependencies
  - @backstage/errors@1.2.1
  - @backstage/backend-common@0.19.1
  - @backstage/backend-plugin-api@0.5.4
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.8
  - @backstage/config-loader@1.3.2
  - @backstage/types@1.1.0
  - @backstage/plugin-auth-node@0.2.16
  - @backstage/plugin-devtools-common@0.1.2
  - @backstage/plugin-permission-common@0.7.7
  - @backstage/plugin-permission-node@0.7.10

## 0.1.2-next.2

### Patch Changes

- 4edd1ef71453: semver upgrade to 7.5.3
- Updated dependencies
  - @backstage/backend-common@0.19.1-next.0
  - @backstage/backend-plugin-api@0.5.4-next.0
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.8
  - @backstage/config-loader@1.3.2-next.0
  - @backstage/errors@1.2.1-next.0
  - @backstage/types@1.1.0
  - @backstage/plugin-auth-node@0.2.16-next.0
  - @backstage/plugin-devtools-common@0.1.2-next.0
  - @backstage/plugin-permission-common@0.7.7-next.0
  - @backstage/plugin-permission-node@0.7.10-next.0

## 0.1.2-next.1

### Patch Changes

- ae261e79d256: Added alpha support for the [new backend system](https://backstage.io/docs/backend-system/)
- Updated dependencies
  - @backstage/config@1.0.8

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1-next.0
  - @backstage/backend-common@0.19.1-next.0
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.8
  - @backstage/config-loader@1.3.2-next.0
  - @backstage/types@1.1.0
  - @backstage/plugin-auth-node@0.2.16-next.0
  - @backstage/plugin-devtools-common@0.1.2-next.0
  - @backstage/plugin-permission-common@0.7.7-next.0
  - @backstage/plugin-permission-node@0.7.10-next.0

## 0.1.1

### Patch Changes

- c312192e61dd: Expose permissions through the metadata endpoint.
- 3d11596a72b5: Update plugin installation docs to be more consistent across documentations
- Updated dependencies
  - @backstage/backend-common@0.19.0
  - @backstage/types@1.1.0
  - @backstage/config-loader@1.3.1
  - @backstage/errors@1.2.0
  - @backstage/plugin-devtools-common@0.1.1
  - @backstage/plugin-auth-node@0.2.15
  - @backstage/plugin-permission-node@0.7.9
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.8
  - @backstage/plugin-permission-common@0.7.6

## 0.1.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.2
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.7
  - @backstage/config-loader@1.3.1-next.1
  - @backstage/errors@1.2.0-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.15-next.2
  - @backstage/plugin-devtools-common@0.1.1-next.0
  - @backstage/plugin-permission-common@0.7.6-next.0
  - @backstage/plugin-permission-node@0.7.9-next.2

## 0.1.1-next.1

### Patch Changes

- c312192e61dd: Expose permissions through the metadata endpoint.
- Updated dependencies
  - @backstage/backend-common@0.19.0-next.1
  - @backstage/errors@1.2.0-next.0
  - @backstage/plugin-devtools-common@0.1.1-next.0
  - @backstage/plugin-auth-node@0.2.15-next.1
  - @backstage/plugin-permission-node@0.7.9-next.1
  - @backstage/config-loader@1.3.1-next.1
  - @backstage/plugin-permission-common@0.7.6-next.0
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.1.1-next.0

### Patch Changes

- 3d11596a72b5: Update plugin installation docs to be more consistent across documentations
- Updated dependencies
  - @backstage/config-loader@1.3.1-next.0
  - @backstage/backend-common@0.18.6-next.0
  - @backstage/config@1.0.7
  - @backstage/cli-common@0.1.12
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.15-next.0
  - @backstage/plugin-devtools-common@0.1.0
  - @backstage/plugin-permission-common@0.7.5
  - @backstage/plugin-permission-node@0.7.9-next.0

## 0.1.0

### Minor Changes

- 347aeca204c: Introduced the DevTools plugin, checkout the plugin's [`README.md`](https://github.com/backstage/backstage/tree/master/plugins/devtools) for more details!

### Patch Changes

- Updated dependencies
  - @backstage/plugin-devtools-common@0.1.0
  - @backstage/backend-common@0.18.5
  - @backstage/config-loader@1.3.0
  - @backstage/plugin-permission-node@0.7.8
  - @backstage/plugin-auth-node@0.2.14
  - @backstage/cli-common@0.1.12
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-permission-common@0.7.5

## 0.1.0-next.0

### Minor Changes

- 347aeca204c: Introduced the DevTools plugin, checkout the plugin's [`README.md`](https://github.com/backstage/backstage/tree/master/plugins/devtools) for more details!

### Patch Changes

- Updated dependencies
  - @backstage/plugin-devtools-common@0.1.0-next.0
  - @backstage/config@1.0.7
