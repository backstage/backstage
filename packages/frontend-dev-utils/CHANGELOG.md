# @backstage/frontend-dev-utils

## 0.1.1

### Patch Changes

- Updated dependencies
  - @backstage/ui@0.14.0
  - @backstage/plugin-app@0.4.3
  - @backstage/frontend-plugin-api@0.16.0
  - @backstage/frontend-defaults@0.5.1

## 0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-app@0.4.3-next.1
  - @backstage/ui@0.14.0-next.1
  - @backstage/frontend-plugin-api@0.16.0-next.1
  - @backstage/frontend-defaults@0.5.1-next.1

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/ui@0.14.0-next.0
  - @backstage/plugin-app@0.4.3-next.0
  - @backstage/frontend-plugin-api@0.15.2-next.0
  - @backstage/frontend-defaults@0.5.1-next.0

## 0.1.0

### Minor Changes

- c25532a: Added `@backstage/frontend-dev-utils`, a new package that provides a minimal helper for wiring up a development app for frontend plugins using the new frontend system. It exports a `createDevApp` function that handles creating and rendering a development app from a `dev/` entry point. The dev app automatically bypasses the sign-in page and loads the `@backstage/ui` CSS. The options interface accepts `features` together with route bindings through `bindRoutes`.

### Patch Changes

- Updated dependencies
  - @backstage/ui@0.13.0
  - @backstage/frontend-plugin-api@0.15.0
  - @backstage/plugin-app@0.4.1
  - @backstage/frontend-defaults@0.5.0
