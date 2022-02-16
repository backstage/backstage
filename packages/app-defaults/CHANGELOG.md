# @backstage/app-defaults

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
