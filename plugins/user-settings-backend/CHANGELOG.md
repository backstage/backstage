# @backstage/plugin-user-settings-backend

## 0.2.28-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.5-next.1
  - @backstage/backend-defaults@0.6.0-next.1
  - @backstage/backend-plugin-api@1.1.0-next.1
  - @backstage/plugin-signals-node@0.1.15-next.1
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5
  - @backstage/types@1.2.0
  - @backstage/plugin-user-settings-common@0.0.1

## 0.2.28-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.6.0-next.0
  - @backstage/backend-plugin-api@1.0.3-next.0
  - @backstage/plugin-auth-node@0.5.5-next.0
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5
  - @backstage/types@1.2.0
  - @backstage/plugin-signals-node@0.1.15-next.0
  - @backstage/plugin-user-settings-common@0.0.1

## 0.2.27

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.0
  - @backstage/backend-defaults@0.5.3
  - @backstage/types@1.2.0
  - @backstage/plugin-auth-node@0.5.4
  - @backstage/backend-plugin-api@1.0.2
  - @backstage/plugin-signals-node@0.1.14
  - @backstage/errors@1.2.5
  - @backstage/plugin-user-settings-common@0.0.1

## 0.2.27-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.5.3-next.3
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.5.4-next.2
  - @backstage/plugin-signals-node@0.1.14-next.3
  - @backstage/plugin-user-settings-common@0.0.1

## 0.2.27-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.5.3-next.2
  - @backstage/plugin-auth-node@0.5.4-next.2
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-signals-node@0.1.14-next.2
  - @backstage/plugin-user-settings-common@0.0.1

## 0.2.27-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.2-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.5.4-next.1
  - @backstage/plugin-signals-node@0.1.14-next.1
  - @backstage/plugin-user-settings-common@0.0.1

## 0.2.27-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.5.4-next.0
  - @backstage/backend-defaults@0.5.3-next.0
  - @backstage/backend-plugin-api@1.0.2-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-signals-node@0.1.14-next.0
  - @backstage/plugin-user-settings-common@0.0.1

## 0.2.25

### Patch Changes

- 3109c24: The export for the new backend system at the `/alpha` export is now also available via the main entry point, which means that you can remove the `/alpha` suffix from the import.
- Updated dependencies
  - @backstage/backend-defaults@0.5.1
  - @backstage/plugin-auth-node@0.5.3
  - @backstage/plugin-signals-node@0.1.12
  - @backstage/backend-plugin-api@1.0.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-user-settings-common@0.0.1

## 0.2.25-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.5.1-next.2
  - @backstage/plugin-auth-node@0.5.3-next.1
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-signals-node@0.1.12-next.1
  - @backstage/plugin-user-settings-common@0.0.1

## 0.2.25-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.5.1-next.1
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.5.3-next.0
  - @backstage/plugin-signals-node@0.1.12-next.0
  - @backstage/plugin-user-settings-common@0.0.1

## 0.2.25-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.5.1-next.0
  - @backstage/plugin-signals-node@0.1.12-next.0
  - @backstage/plugin-auth-node@0.5.3-next.0
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-user-settings-common@0.0.1

## 0.2.24

### Patch Changes

- 5d1670f: Update README installation instructions
- 164ce3e: In preparation to stop supporting to the legacy backend system, the `createRouter` function is now deprecated and we strongly recommend you [migrate](https://backstage.io/docs/backend-system/building-backends/migrating) your backend to the new system.
- d425fc4: Modules, plugins, and services are now `BackendFeature`, not a function that returns a feature.
- 1b98099: Replaced usage of the deprecated identity service with the new HTTP auth service for the new backend system.
- c2b63ab: Updated dependency `supertest` to `^7.0.0`.
- Updated dependencies
  - @backstage/backend-defaults@0.5.0
  - @backstage/plugin-signals-node@0.1.11
  - @backstage/backend-plugin-api@1.0.0
  - @backstage/plugin-auth-node@0.5.2
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-user-settings-common@0.0.1

## 0.2.24-next.2

### Patch Changes

- 5d1670f: Update README installation instructions
- c2b63ab: Updated dependency `supertest` to `^7.0.0`.
- Updated dependencies
  - @backstage/backend-defaults@0.5.0-next.2
  - @backstage/plugin-auth-node@0.5.2-next.2
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-signals-node@0.1.11-next.2
  - @backstage/plugin-user-settings-common@0.0.1

## 0.2.24-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-defaults@0.5.0-next.1
  - @backstage/plugin-auth-node@0.5.2-next.1
  - @backstage/backend-plugin-api@0.9.0-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-signals-node@0.1.11-next.1
  - @backstage/plugin-user-settings-common@0.0.1

## 0.2.24-next.0

### Patch Changes

- 164ce3e: In preparation to stop supporting to the legacy backend system, the `createRouter` function is now deprecated and we strongly recommend you [migrate](https://backstage.io/docs/backend-system/building-backends/migrating) your backend to the new system.
- d425fc4: Modules, plugins, and services are now `BackendFeature`, not a function that returns a feature.
- 1b98099: Replaced usage of the deprecated identity service with the new HTTP auth service for the new backend system.
- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.0
  - @backstage/backend-defaults@0.5.0-next.0
  - @backstage/plugin-auth-node@0.5.2-next.0
  - @backstage/plugin-signals-node@0.1.11-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-user-settings-common@0.0.1

## 0.2.22

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/backend-common@0.24.0
  - @backstage/plugin-auth-node@0.5.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-signals-node@0.1.9
  - @backstage/plugin-user-settings-common@0.0.1

## 0.2.22-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/backend-common@0.23.4-next.3
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.5.0-next.3
  - @backstage/plugin-signals-node@0.1.9-next.3
  - @backstage/plugin-user-settings-common@0.0.1

## 0.2.22-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/backend-common@0.23.4-next.2
  - @backstage/plugin-auth-node@0.5.0-next.2
  - @backstage/plugin-signals-node@0.1.9-next.2
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-user-settings-common@0.0.1

## 0.2.22-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/backend-common@0.23.4-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.18-next.1
  - @backstage/plugin-signals-node@0.1.9-next.1
  - @backstage/plugin-user-settings-common@0.0.1

## 0.2.22-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.4-next.0
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.18-next.0
  - @backstage/plugin-signals-node@0.1.9-next.0
  - @backstage/plugin-user-settings-common@0.0.1

## 0.2.21

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/backend-common@0.23.3
  - @backstage/plugin-auth-node@0.4.17
  - @backstage/plugin-signals-node@0.1.8
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-user-settings-common@0.0.1

## 0.2.21-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.3-next.1
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.17-next.1
  - @backstage/plugin-signals-node@0.1.8-next.1
  - @backstage/plugin-user-settings-common@0.0.1

## 0.2.20-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/backend-common@0.23.2-next.0
  - @backstage/plugin-auth-node@0.4.16-next.0
  - @backstage/plugin-signals-node@0.1.7-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-user-settings-common@0.0.1

## 0.2.18

### Patch Changes

- 8869b8e: Updated local development setup.
- 78a0b08: Internal refactor to handle `BackendFeature` contract change.
- d44a20a: Added additional plugin metadata to `package.json`.
- e6ec179: Use signals to update user settings across sessions
- Updated dependencies
  - @backstage/backend-common@0.23.0
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/plugin-auth-node@0.4.14
  - @backstage/plugin-user-settings-common@0.0.1
  - @backstage/plugin-signals-node@0.1.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.2.18-next.3

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- e6ec179: Use signals to update user settings across sessions
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/plugin-auth-node@0.4.14-next.3
  - @backstage/plugin-user-settings-common@0.0.1-next.0
  - @backstage/plugin-signals-node@0.1.5-next.3
  - @backstage/backend-common@0.23.0-next.3
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.2.18-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/backend-common@0.23.0-next.2
  - @backstage/plugin-auth-node@0.4.14-next.2
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.2.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.1
  - @backstage/backend-common@0.23.0-next.1
  - @backstage/plugin-auth-node@0.4.14-next.1

## 0.2.18-next.0

### Patch Changes

- 8869b8e: Updated local development setup.
- Updated dependencies
  - @backstage/backend-common@0.22.1-next.0
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/plugin-auth-node@0.4.14-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.2.17

### Patch Changes

- d229dc4: Move path utilities from `backend-common` to the `backend-plugin-api` package.
- Updated dependencies
  - @backstage/backend-common@0.22.0
  - @backstage/backend-plugin-api@0.6.18
  - @backstage/plugin-auth-node@0.4.13

## 0.2.17-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.0-next.1
  - @backstage/plugin-auth-node@0.4.13-next.1
  - @backstage/backend-plugin-api@0.6.18-next.1

## 0.2.17-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.4.13-next.0
  - @backstage/backend-common@0.21.8-next.0
  - @backstage/backend-plugin-api@0.6.18-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.2.16

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/plugin-auth-node@0.4.12
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.2.16-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.1
  - @backstage/backend-plugin-api@0.6.17-next.1
  - @backstage/plugin-auth-node@0.4.12-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.2.16-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.0
  - @backstage/backend-plugin-api@0.6.17-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.12-next.0

## 0.2.15

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.4.11
  - @backstage/backend-common@0.21.6
  - @backstage/backend-plugin-api@0.6.16
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.2.14

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.5
  - @backstage/plugin-auth-node@0.4.10
  - @backstage/backend-plugin-api@0.6.15
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 0.2.13

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.4
  - @backstage/plugin-auth-node@0.4.9
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/backend-plugin-api@0.6.14
  - @backstage/types@1.1.1

## 0.2.13-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.4-next.2
  - @backstage/plugin-auth-node@0.4.9-next.2
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/config@1.2.0-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1

## 0.2.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/plugin-auth-node@0.4.9-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1

## 0.2.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.3-next.0
  - @backstage/plugin-auth-node@0.4.8-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/backend-plugin-api@0.6.13-next.0
  - @backstage/config@1.1.2-next.0
  - @backstage/types@1.1.1

## 0.2.9

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0
  - @backstage/plugin-auth-node@0.4.4
  - @backstage/backend-plugin-api@0.6.10
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.2.9-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.3
  - @backstage/plugin-auth-node@0.4.4-next.3
  - @backstage/backend-plugin-api@0.6.10-next.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.2.9-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/plugin-auth-node@0.4.4-next.2
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.2.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/backend-common@0.21.0-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.4-next.1

## 0.2.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.0
  - @backstage/plugin-auth-node@0.4.4-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.2.8

### Patch Changes

- 4016f21: Remove some unused dependencies
- Updated dependencies
  - @backstage/backend-common@0.20.1
  - @backstage/backend-plugin-api@0.6.9
  - @backstage/plugin-auth-node@0.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.2.8-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.9-next.2
  - @backstage/backend-common@0.20.1-next.2
  - @backstage/plugin-auth-node@0.4.3-next.2

## 0.2.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.1
  - @backstage/config@1.1.1
  - @backstage/plugin-auth-node@0.4.3-next.1
  - @backstage/backend-plugin-api@0.6.9-next.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.2.8-next.0

### Patch Changes

- 4016f21: Remove some unused dependencies
- Updated dependencies
  - @backstage/backend-common@0.20.1-next.0
  - @backstage/backend-plugin-api@0.6.9-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.3-next.0

## 0.2.7

### Patch Changes

- 2633d64: Change user settings backend plugin id and fix when using user setting backend home page first will cause edit page loop render
- Updated dependencies
  - @backstage/backend-common@0.20.0
  - @backstage/plugin-auth-node@0.4.2
  - @backstage/backend-plugin-api@0.6.8
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.2.7-next.3

### Patch Changes

- 2633d64: Change user settings backend plugin id and fix when using user setting backend home page first will cause edit page loop render
- Updated dependencies
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/backend-plugin-api@0.6.8-next.3
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.2-next.3

## 0.2.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.2
  - @backstage/plugin-auth-node@0.4.2-next.2
  - @backstage/backend-plugin-api@0.6.8-next.2
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.2.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.1
  - @backstage/backend-plugin-api@0.6.8-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.2-next.1

## 0.2.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.0-next.0
  - @backstage/plugin-auth-node@0.4.2-next.0
  - @backstage/backend-plugin-api@0.6.8-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.2.6

### Patch Changes

- dd0350379b: Added dependency on `@backstage/config`
- 013611b42e: `knex` has been bumped to major version 3 and `better-sqlite3` to major version 9, which deprecate node 16 support.
- 8613ba3928: Switched to using `"exports"` field for `/alpha` subpath export.
- Updated dependencies
  - @backstage/backend-common@0.19.9
  - @backstage/backend-plugin-api@0.6.7
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.1

## 0.2.6-next.2

### Patch Changes

- [#20570](https://github.com/backstage/backstage/pull/20570) [`013611b42e`](https://github.com/backstage/backstage/commit/013611b42ed457fefa9bb85fddf416cf5e0c1f76) Thanks [@freben](https://github.com/freben)! - `knex` has been bumped to major version 3 and `better-sqlite3` to major version 9, which deprecate node 16 support.

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.7-next.2
  - @backstage/backend-common@0.19.9-next.2
  - @backstage/plugin-auth-node@0.4.1-next.2

## 0.2.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.9-next.1
  - @backstage/plugin-auth-node@0.4.1-next.1
  - @backstage/backend-plugin-api@0.6.7-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 0.2.6-next.0

### Patch Changes

- dd0350379b: Added dependency on `@backstage/config`
- 8613ba3928: Switched to using `"exports"` field for `/alpha` subpath export.
- Updated dependencies
  - @backstage/backend-common@0.19.9-next.0
  - @backstage/backend-plugin-api@0.6.7-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/plugin-auth-node@0.4.1-next.0

## 0.2.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8
  - @backstage/plugin-auth-node@0.4.0
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/backend-plugin-api@0.6.6
  - @backstage/types@1.1.1

## 0.2.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.8-next.2
  - @backstage/plugin-auth-node@0.4.0-next.2
  - @backstage/catalog-model@1.4.3-next.0
  - @backstage/errors@1.2.3-next.0
  - @backstage/backend-plugin-api@0.6.6-next.2
  - @backstage/types@1.1.1

## 0.2.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.7-next.1
  - @backstage/backend-plugin-api@0.6.5-next.1
  - @backstage/plugin-auth-node@0.3.2-next.1
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/types@1.1.1

## 0.2.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.3.2-next.0
  - @backstage/backend-common@0.19.7-next.0
  - @backstage/backend-plugin-api@0.6.5-next.0
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/types@1.1.1

## 0.2.1

### Minor Changes

- 71114ac50e02: **BREAKING**: The export for the new backend system has been moved to be the `default` export.

  For example, if you are currently importing the plugin using the following pattern:

  ```ts
  import { examplePlugin } from '@backstage/plugin-example-backend';

  backend.add(examplePlugin);
  ```

  It should be migrated to this:

  ```ts
  backend.add(import('@backstage/plugin-example-backend'));
  ```

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.5
  - @backstage/plugin-auth-node@0.3.0
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/types@1.1.1
  - @backstage/backend-plugin-api@0.6.3

## 0.2.0

Skipped due to publishing issues.

## 0.2.0-next.3

### Minor Changes

- 71114ac50e02: **BREAKING**: The export for the new backend system has been moved to be the `default` export.

  For example, if you are currently importing the plugin using the following pattern:

  ```ts
  import { examplePlugin } from '@backstage/plugin-example-backend';

  backend.add(examplePlugin);
  ```

  It should be migrated to this:

  ```ts
  backend.add(import('@backstage/plugin-example-backend'));
  ```

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.2-next.2
  - @backstage/errors@1.2.2-next.0
  - @backstage/types@1.1.1-next.0
  - @backstage/backend-plugin-api@0.6.3-next.3
  - @backstage/backend-common@0.19.5-next.3
  - @backstage/plugin-auth-node@0.3.0-next.3

## 0.1.15-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/plugin-auth-node@0.3.0-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## 0.1.15-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.5-next.1
  - @backstage/backend-plugin-api@0.6.3-next.1
  - @backstage/catalog-model@1.4.2-next.0
  - @backstage/plugin-auth-node@0.3.0-next.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## 0.1.14-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.3.0-next.0
  - @backstage/backend-common@0.19.4-next.0
  - @backstage/backend-plugin-api@0.6.2-next.0
  - @backstage/catalog-model@1.4.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## 0.1.12

### Patch Changes

- 12a8c94eda8d: Add package repository and homepage metadata
- Updated dependencies
  - @backstage/backend-common@0.19.2
  - @backstage/backend-plugin-api@0.6.0
  - @backstage/plugin-auth-node@0.2.17
  - @backstage/catalog-model@1.4.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## 0.1.12-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-common@0.19.2-next.2
  - @backstage/plugin-auth-node@0.2.17-next.2

## 0.1.12-next.1

### Patch Changes

- 12a8c94eda8d: Add package repository and homepage metadata
- Updated dependencies
  - @backstage/backend-common@0.19.2-next.1
  - @backstage/plugin-auth-node@0.2.17-next.1
  - @backstage/backend-plugin-api@0.6.0-next.1
  - @backstage/catalog-model@1.4.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## 0.1.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.2-next.0
  - @backstage/backend-plugin-api@0.5.5-next.0
  - @backstage/catalog-model@1.4.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-auth-node@0.2.17-next.0

## 0.1.11

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1
  - @backstage/backend-common@0.19.1
  - @backstage/backend-plugin-api@0.5.4
  - @backstage/catalog-model@1.4.1
  - @backstage/types@1.1.0
  - @backstage/plugin-auth-node@0.2.16

## 0.1.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1-next.0
  - @backstage/backend-common@0.19.1-next.0
  - @backstage/backend-plugin-api@0.5.4-next.0
  - @backstage/catalog-model@1.4.1-next.0
  - @backstage/types@1.1.0
  - @backstage/plugin-auth-node@0.2.16-next.0

## 0.1.10

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0
  - @backstage/types@1.1.0
  - @backstage/catalog-model@1.4.0
  - @backstage/errors@1.2.0
  - @backstage/backend-plugin-api@0.5.3
  - @backstage/plugin-auth-node@0.2.15

## 0.1.10-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.2
  - @backstage/catalog-model@1.4.0-next.1
  - @backstage/backend-plugin-api@0.5.3-next.2
  - @backstage/errors@1.2.0-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.15-next.2

## 0.1.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.0-next.1
  - @backstage/errors@1.2.0-next.0
  - @backstage/backend-plugin-api@0.5.3-next.1
  - @backstage/catalog-model@1.4.0-next.0
  - @backstage/plugin-auth-node@0.2.15-next.1
  - @backstage/types@1.0.2

## 0.1.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.6-next.0
  - @backstage/backend-plugin-api@0.5.3-next.0
  - @backstage/catalog-model@1.3.0
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.15-next.0

## 0.1.9

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5
  - @backstage/plugin-auth-node@0.2.14
  - @backstage/backend-plugin-api@0.5.2
  - @backstage/catalog-model@1.3.0
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2

## 0.1.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.1
  - @backstage/plugin-auth-node@0.2.14-next.1
  - @backstage/backend-plugin-api@0.5.2-next.1

## 0.1.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.5-next.0
  - @backstage/plugin-auth-node@0.2.14-next.0
  - @backstage/backend-plugin-api@0.5.2-next.0
  - @backstage/catalog-model@1.3.0
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2

## 0.1.8

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4
  - @backstage/catalog-model@1.3.0
  - @backstage/plugin-auth-node@0.2.13
  - @backstage/backend-plugin-api@0.5.1
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2

## 0.1.8-next.3

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.3.0-next.0
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.13-next.2

## 0.1.8-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.2
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/catalog-model@1.2.1
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.13-next.2

## 0.1.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.1
  - @backstage/backend-plugin-api@0.5.1-next.1
  - @backstage/catalog-model@1.2.1
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.13-next.1

## 0.1.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.4-next.0
  - @backstage/backend-plugin-api@0.5.1-next.0
  - @backstage/catalog-model@1.2.1
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.13-next.0

## 0.1.7

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.2.12
  - @backstage/backend-common@0.18.3
  - @backstage/errors@1.1.5
  - @backstage/backend-plugin-api@0.5.0
  - @backstage/catalog-model@1.2.1
  - @backstage/types@1.0.2

## 0.1.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-auth-node@0.2.12-next.2
  - @backstage/backend-common@0.18.3-next.2
  - @backstage/backend-plugin-api@0.4.1-next.2

## 0.1.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.1.5-next.0
  - @backstage/backend-common@0.18.3-next.1
  - @backstage/plugin-auth-node@0.2.12-next.1
  - @backstage/backend-plugin-api@0.4.1-next.1
  - @backstage/catalog-model@1.2.1-next.1
  - @backstage/types@1.0.2

## 0.1.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.4.1-next.0
  - @backstage/backend-common@0.18.3-next.0
  - @backstage/catalog-model@1.2.1-next.0
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.12-next.0

## 0.1.6

### Patch Changes

- 0ff03319be: Updated usage of `createBackendPlugin`.
- 4a6f38a535: Added a Backend System plugin feature
- Updated dependencies
  - @backstage/backend-plugin-api@0.4.0
  - @backstage/backend-common@0.18.2
  - @backstage/catalog-model@1.2.0
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.11

## 0.1.6-next.2

### Patch Changes

- 0ff03319be: Updated usage of `createBackendPlugin`.
- 4a6f38a535: Added a Backend System plugin feature
- Updated dependencies
  - @backstage/backend-plugin-api@0.4.0-next.2
  - @backstage/backend-common@0.18.2-next.2
  - @backstage/catalog-model@1.2.0-next.1
  - @backstage/plugin-auth-node@0.2.11-next.2
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2

## 0.1.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2-next.1
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.11-next.1

## 0.1.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/backend-common@0.18.2-next.0
  - @backstage/plugin-auth-node@0.2.11-next.0

## 0.1.4

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0
  - @backstage/catalog-model@1.1.5
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.9

## 0.1.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.1
  - @backstage/plugin-auth-node@0.2.9-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2

## 0.1.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.9-next.0

## 0.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.0
  - @backstage/backend-common@0.17.0
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2
  - @backstage/plugin-auth-node@0.2.8

## 0.1.3

### Patch Changes

- c507aee8a2: Ensured typescript type checks in migration files.
- Updated dependencies
  - @backstage/backend-common@0.17.0
  - @backstage/errors@1.1.4
  - @backstage/plugin-auth-node@0.2.8
  - @backstage/types@1.0.2
  - @backstage/catalog-model@1.1.4

## 0.1.3-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.3
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/types@1.0.2-next.1
  - @backstage/plugin-auth-node@0.2.8-next.3

## 0.1.3-next.2

### Patch Changes

- c507aee8a2: Ensured typescript type checks in migration files.
- Updated dependencies
  - @backstage/backend-common@0.17.0-next.2
  - @backstage/plugin-auth-node@0.2.8-next.2
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/types@1.0.2-next.1

## 0.1.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.1
  - @backstage/types@1.0.2-next.1
  - @backstage/plugin-auth-node@0.2.8-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/errors@1.1.4-next.1

## 0.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.1-next.0
  - @backstage/plugin-auth-node@0.2.8-next.0
  - @backstage/types@1.0.2-next.0
  - @backstage/catalog-model@1.1.4-next.0
  - @backstage/errors@1.1.4-next.0

## 0.1.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0
  - @backstage/catalog-model@1.1.3
  - @backstage/plugin-auth-node@0.2.7
  - @backstage/types@1.0.1
  - @backstage/errors@1.1.3

## 0.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.1
  - @backstage/plugin-auth-node@0.2.7-next.1
  - @backstage/catalog-model@1.1.3-next.0
  - @backstage/errors@1.1.3-next.0
  - @backstage/types@1.0.1-next.0

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.0
  - @backstage/catalog-model@1.1.3-next.0
  - @backstage/plugin-auth-node@0.2.7-next.0
  - @backstage/types@1.0.1-next.0
  - @backstage/errors@1.1.3-next.0

## 0.1.1

### Patch Changes

- f3463b176b: Use `Response.status` instead of `.send(number)`
- 2d3a5f09ab: Use `response.json` rather than `response.send` where appropriate, as outlined in `SECURITY.md`
- 82ac9bcfe5: Fix wrong import statement in `README.md`.
- Updated dependencies
  - @backstage/catalog-model@1.1.2
  - @backstage/backend-common@0.15.2
  - @backstage/plugin-auth-node@0.2.6
  - @backstage/errors@1.1.2
  - @backstage/types@1.0.0

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
