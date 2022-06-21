# @backstage/app-defaults

## 1.0.3

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.5
  - @backstage/core-app-api@1.0.3
  - @backstage/core-plugin-api@1.0.3
  - @backstage/plugin-permission-react@0.4.2

## 1.0.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.5-next.1
  - @backstage/core-app-api@1.0.3-next.0
  - @backstage/core-plugin-api@1.0.3-next.0
  - @backstage/plugin-permission-react@0.4.2-next.0

## 1.0.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.5-next.0

## 1.0.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.4
  - @backstage/core-plugin-api@1.0.2
  - @backstage/core-app-api@1.0.2
  - @backstage/plugin-permission-react@0.4.1

## 1.0.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.4-next.0
  - @backstage/core-plugin-api@1.0.2-next.0
  - @backstage/core-app-api@1.0.2-next.0
  - @backstage/plugin-permission-react@0.4.1-next.0

## 1.0.1

### Patch Changes

- 230ad0826f: Bump to using `@types/node` v16
- Updated dependencies
  - @backstage/plugin-permission-react@0.4.0
  - @backstage/core-app-api@1.0.1
  - @backstage/core-components@0.9.3
  - @backstage/core-plugin-api@1.0.1

## 1.0.1-next.2

### Patch Changes

- 230ad0826f: Bump to using `@types/node` v16
- Updated dependencies
  - @backstage/core-app-api@1.0.1-next.1
  - @backstage/core-components@0.9.3-next.2
  - @backstage/core-plugin-api@1.0.1-next.0
  - @backstage/plugin-permission-react@0.4.0-next.1

## 1.0.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-react@0.4.0-next.0

## 1.0.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-app-api@1.0.1-next.0
  - @backstage/core-components@0.9.3-next.0

## 1.0.0

### Major Changes

- b58c70c223: This package has been promoted to v1.0! To understand how this change affects the package, please check out our [versioning policy](https://backstage.io/docs/overview/versioning-policy).

### Patch Changes

- a422d7ce5e: chore(deps): bump `@testing-library/react` from 11.2.6 to 12.1.3
- Updated dependencies
  - @backstage/core-app-api@1.0.0
  - @backstage/core-components@0.9.2
  - @backstage/core-plugin-api@1.0.0
  - @backstage/plugin-permission-react@0.3.4

## 0.2.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.1

## 0.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.1-next.0

## 0.2.0

### Minor Changes

- af5eaa87f4: **BREAKING**: Removed deprecated `auth0AuthApiRef`, `oauth2ApiRef`, `samlAuthApiRef` and `oidcAuthApiRef` as these APIs are too generic to be useful. Instructions for how to migrate can be found at [https://backstage.io/docs/api/deprecations#generic-auth-api-refs](https://backstage.io/docs/api/deprecations#generic-auth-api-refs).

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.0
  - @backstage/core-app-api@0.6.0
  - @backstage/core-plugin-api@0.8.0
  - @backstage/plugin-permission-react@0.3.3

## 0.1.9

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.10
  - @backstage/core-plugin-api@0.7.0
  - @backstage/core-app-api@0.5.4
  - @backstage/plugin-permission-react@0.3.2

## 0.1.8

### Patch Changes

- c77c5c7eb6: Added `backstage.role` to `package.json`
- Updated dependencies
  - @backstage/core-app-api@0.5.3
  - @backstage/core-components@0.8.9
  - @backstage/core-plugin-api@0.6.1
  - @backstage/plugin-permission-react@0.3.1
  - @backstage/theme@0.2.15

## 0.1.7

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.8

## 0.1.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.8-next.0

## 0.1.6

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.7
  - @backstage/core-app-api@0.5.2

## 0.1.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.7-next.1
  - @backstage/core-app-api@0.5.2-next.0

## 0.1.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.7-next.0

## 0.1.5

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-react@0.3.0
  - @backstage/core-components@0.8.5
  - @backstage/core-plugin-api@0.6.0
  - @backstage/core-app-api@0.5.0

## 0.1.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-permission-react@0.3.0-next.0
  - @backstage/core-components@0.8.5-next.0
  - @backstage/core-plugin-api@0.6.0-next.0
  - @backstage/core-app-api@0.5.0-next.0

## 0.1.4

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.4
  - @backstage/core-plugin-api@0.5.0
  - @backstage/core-app-api@0.4.0
  - @backstage/plugin-permission-react@0.2.2

## 0.1.3

### Patch Changes

- 7927005152: Add `FetchApi` and related `fetchApiRef` which implement fetch, with an added Backstage token header when available.
- 1e49c23eb7: Added an instance of PermissionApi to the apis included by default in createApp.
- 68f8b10ccd: - Removed deprecation configuration option `theme` from `AppTheme` of the `AppThemeApi`
  - Removed reference to `theme` in the `app-defaults` default `AppTheme`
  - Removed logic in `AppThemeProvider` that creates `ThemeProvider` from `appTheme.theme`
- Updated dependencies
  - @backstage/core-app-api@0.3.0
  - @backstage/core-plugin-api@0.4.0
  - @backstage/plugin-permission-react@0.2.0
  - @backstage/core-components@0.8.2

## 0.1.2

### Patch Changes

- cd450844f6: Moved React dependencies to `peerDependencies` and allow both React v16 and v17 to be used.
- Updated dependencies
  - @backstage/core-components@0.8.0
  - @backstage/core-plugin-api@0.3.0
  - @backstage/core-app-api@0.2.0

## 0.1.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.7.4
  - @backstage/core-plugin-api@0.2.0
  - @backstage/core-app-api@0.1.21
