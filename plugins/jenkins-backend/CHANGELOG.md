# @backstage/plugin-jenkins-backend

## 0.1.23

### Patch Changes

- 83f6a64d2c: bug fix: provide backstage token for rebuild api call
- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/backend-common@0.14.0
  - @backstage/plugin-auth-node@0.2.2
  - @backstage/catalog-client@1.0.3
  - @backstage/plugin-permission-common@0.6.2
  - @backstage/catalog-model@1.0.3
  - @backstage/plugin-jenkins-common@0.1.5

## 0.1.23-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.0-next.2
  - @backstage/plugin-auth-node@0.2.2-next.2

## 0.1.23-next.1

### Patch Changes

- 83f6a64d2c: bug fix: provide backstage token for rebuild api call
- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/backend-common@0.13.6-next.1
  - @backstage/catalog-client@1.0.3-next.0
  - @backstage/plugin-auth-node@0.2.2-next.1
  - @backstage/plugin-permission-common@0.6.2-next.0
  - @backstage/catalog-model@1.0.3-next.0
  - @backstage/plugin-jenkins-common@0.1.5-next.0

## 0.1.23-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.6-next.0
  - @backstage/plugin-auth-node@0.2.2-next.0

## 0.1.22

### Patch Changes

- 8cc75993a6: Fixed issue in `PermissionEvaluator` instance check that would cause unexpected "invalid union" errors.
- Updated dependencies
  - @backstage/backend-common@0.13.3
  - @backstage/config@1.0.1
  - @backstage/plugin-auth-node@0.2.1
  - @backstage/catalog-client@1.0.2
  - @backstage/catalog-model@1.0.2
  - @backstage/plugin-jenkins-common@0.1.4
  - @backstage/plugin-permission-common@0.6.1

## 0.1.22-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.2
  - @backstage/config@1.0.1-next.0
  - @backstage/catalog-model@1.0.2-next.0
  - @backstage/plugin-auth-node@0.2.1-next.1
  - @backstage/plugin-permission-common@0.6.1-next.0
  - @backstage/catalog-client@1.0.2-next.0
  - @backstage/plugin-jenkins-common@0.1.4-next.0

## 0.1.22-next.0

### Patch Changes

- 8cc75993a6: Fixed issue in `PermissionEvaluator` instance check that would cause unexpected "invalid union" errors.
- Updated dependencies
  - @backstage/backend-common@0.13.3-next.0
  - @backstage/plugin-auth-node@0.2.1-next.0

## 0.1.20

### Patch Changes

- 1917923ab8: Use `PermissionEvaluator` instead of `PermissionAuthorizer`, which is now deprecated.
- b013de3f50: feature: provide access token to JenkinsInstanceConfig. It can be passed to other backend calls if authentication enabled. DefaultJenkinsInfoProvider sends always this token to catalog api if access token exists.
- ca91107110: Fixed possible type error if jenkins response contains null values
- 71f8708f00: Make `resourceRef` required in `JenkinsApi` to match usage.
- Updated dependencies
  - @backstage/plugin-permission-common@0.6.0
  - @backstage/catalog-model@1.0.1
  - @backstage/plugin-auth-node@0.2.0
  - @backstage/backend-common@0.13.2
  - @backstage/plugin-jenkins-common@0.1.3
  - @backstage/catalog-client@1.0.1

## 0.1.20-next.2

### Patch Changes

- 1917923ab8: Use `PermissionEvaluator` instead of `PermissionAuthorizer`, which is now deprecated.
- b013de3f50: feature: provide access token to JenkinsInstanceConfig. It can be passed to other backend calls if authentication enabled. DefaultJenkinsInfoProvider sends always this token to catalog api if access token exists.
- Updated dependencies
  - @backstage/plugin-permission-common@0.6.0-next.1
  - @backstage/backend-common@0.13.2-next.2

## 0.1.20-next.1

### Patch Changes

- ca91107110: Fixed possible type error if jenkins response contains null values
- Updated dependencies
  - @backstage/plugin-permission-common@0.6.0-next.0
  - @backstage/plugin-jenkins-common@0.1.3-next.1
  - @backstage/backend-common@0.13.2-next.1

## 0.1.20-next.0

### Patch Changes

- 71f8708f00: Make `resourceRef` required in `JenkinsApi` to match usage.
- Updated dependencies
  - @backstage/catalog-model@1.0.1-next.0
  - @backstage/plugin-auth-node@0.2.0-next.0
  - @backstage/backend-common@0.13.2-next.0
  - @backstage/catalog-client@1.0.1-next.0
  - @backstage/plugin-jenkins-common@0.1.3-next.0

## 0.1.19

### Patch Changes

- 89c7e47967: Minor README update
- f24ef7864e: Minor typo fixes
- Updated dependencies
  - @backstage/backend-common@0.13.1
  - @backstage/catalog-model@1.0.0
  - @backstage/catalog-client@1.0.0
  - @backstage/config@1.0.0
  - @backstage/errors@1.0.0
  - @backstage/plugin-permission-common@0.5.3
  - @backstage/plugin-auth-node@0.1.6
  - @backstage/plugin-jenkins-common@0.1.2

## 0.1.18

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.0
  - @backstage/catalog-model@0.13.0
  - @backstage/catalog-client@0.9.0
  - @backstage/plugin-auth-node@0.1.5
  - @backstage/plugin-jenkins-common@0.1.1

## 0.1.18-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.0-next.0
  - @backstage/catalog-model@0.13.0-next.0
  - @backstage/catalog-client@0.9.0-next.0
  - @backstage/plugin-auth-node@0.1.5-next.0
  - @backstage/plugin-jenkins-common@0.1.1-next.0

## 0.1.17

### Patch Changes

- 899f196af5: Use `getEntityByRef` instead of `getEntityByName` in the catalog client
- 23e1c17bba: Jenkins plugin supports permissions now. We have added a new permission, so you can manage the permission for the users.
  A new permission `jenkinsExecutePermission` is provided in `jenkins-common` package. This permission rule will be applied to check rebuild actions
  if user is allowed to execute this action.

  > We use 'catalog-entity' as a resource type, so you need to integrate a policy to handle catalog-entity resources

  > You need to use this permission in your permission policy to check the user role/rights and return
  > `AuthorizeResult.ALLOW` to allow rebuild action to logged user. (e.g: you can check if user or related group owns the entity)

- 36aa63022b: Use `CompoundEntityRef` instead of `EntityName`, and `getCompoundEntityRef` instead of `getEntityName`, from `@backstage/catalog-model`.
- Updated dependencies
  - @backstage/catalog-model@0.12.0
  - @backstage/catalog-client@0.8.0
  - @backstage/backend-common@0.12.0
  - @backstage/plugin-jenkins-common@0.1.0
  - @backstage/plugin-permission-common@0.5.2
  - @backstage/plugin-auth-node@0.1.4

## 0.1.16

### Patch Changes

- 67a7c02d26: Remove usages of `EntityRef` and `parseEntityName` from `@backstage/catalog-model`
- Updated dependencies
  - @backstage/backend-common@0.11.0
  - @backstage/catalog-model@0.11.0
  - @backstage/catalog-client@0.7.2

## 0.1.15

### Patch Changes

- Fix for the previous release with missing type declarations.
- Updated dependencies
  - @backstage/backend-common@0.10.9
  - @backstage/catalog-client@0.7.1
  - @backstage/catalog-model@0.10.1
  - @backstage/config@0.1.15

## 0.1.14

### Patch Changes

- c77c5c7eb6: Added `backstage.role` to `package.json`
- 377fce4677: The `DefaultJenkinsInfoProvider.fromConfig` now requires an implementation of the `CatalogApi` rather than a `CatalogClient` instance.
- Updated dependencies
  - @backstage/backend-common@0.10.8
  - @backstage/catalog-client@0.7.0
  - @backstage/catalog-model@0.10.0
  - @backstage/config@0.1.14

## 0.1.13

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@0.6.0
  - @backstage/backend-common@0.10.7

## 0.1.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.7-next.0

## 0.1.12

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.6

## 0.1.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.6-next.0

## 0.1.11

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.4
  - @backstage/config@0.1.13
  - @backstage/catalog-model@0.9.10
  - @backstage/catalog-client@0.5.5

## 0.1.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.4-next.0
  - @backstage/config@0.1.13-next.0
  - @backstage/catalog-model@0.9.10-next.0
  - @backstage/catalog-client@0.5.5-next.0

## 0.1.10

### Patch Changes

- eb3fd85d3e: feature: add crumbIssuer option to Jenkins (optional) configuration, improve the UI to show a notification after executing the action re-build
- Updated dependencies
  - @backstage/backend-common@0.10.0
  - @backstage/catalog-client@0.5.3

## 0.1.9

### Patch Changes

- b055a6addc: Align on usage of `cross-fetch` vs `node-fetch` in frontend vs backend packages, and remove some unnecessary imports of either one of them
- Updated dependencies
  - @backstage/backend-common@0.9.12

## 0.1.8

### Patch Changes

- bab752e2b3: Change default port of backend from 7000 to 7007.

  This is due to the AirPlay Receiver process occupying port 7000 and preventing local Backstage instances on MacOS to start.

  You can change the port back to 7000 or any other value by providing an `app-config.yaml` with the following values:

  ```
  backend:
    listen: 0.0.0.0:7123
    baseUrl: http://localhost:7123
  ```

  More information can be found here: https://backstage.io/docs/conf/writing

- Updated dependencies
  - @backstage/backend-common@0.9.11

## 0.1.7

### Patch Changes

- e8a1c1afe2: Don't require a validation pattern for the Jenkins base URL.
- Updated dependencies
  - @backstage/backend-common@0.9.9
  - @backstage/catalog-client@0.5.1

## 0.1.6

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.9.4
  - @backstage/backend-common@0.9.6
  - @backstage/catalog-client@0.5.0

## 0.1.5

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@0.4.0
  - @backstage/catalog-model@0.9.3
  - @backstage/backend-common@0.9.4
  - @backstage/config@0.1.10

## 0.1.4

### Patch Changes

- 4c86555a2: Fix the case where lastBuild is null.
- Updated dependencies
  - @backstage/backend-common@0.9.0
  - @backstage/config@0.1.8

## 0.1.3

### Patch Changes

- efbb82dd3: Extract `JenkinsConfig` to make writing a custom `JenkinsInfoProvider` easier.
- Updated dependencies
  - @backstage/backend-common@0.8.10
  - @backstage/config@0.1.7

## 0.1.2

### Patch Changes

- eee05803a: Update `@backstage/backend-common` to `^0.8.6`
- Updated dependencies
  - @backstage/catalog-client@0.3.17
  - @backstage/backend-common@0.8.7
