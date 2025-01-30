# @backstage/core-plugin-api

## 1.10.4-next.0

### Patch Changes

- 58ec9e7: Removed older versions of React packages as a preparatory step for upgrading to React 19. This commit does not introduce any functional changes, but removes dependencies on previous React versions, allowing for a cleaner upgrade path in subsequent commits.
- Updated dependencies
  - @backstage/version-bridge@1.0.11-next.0
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/types@1.2.1

## 1.10.3

### Patch Changes

- b40eb41: Move `Expand` and `ExpandRecursive` to `@backstage/types`
- Updated dependencies
  - @backstage/types@1.2.1
  - @backstage/config@1.3.2
  - @backstage/errors@1.2.7
  - @backstage/version-bridge@1.0.10

## 1.10.3-next.0

### Patch Changes

- b40eb41: Move `Expand` and `ExpandRecursive` to `@backstage/types`
- Updated dependencies
  - @backstage/types@1.2.1-next.0
  - @backstage/config@1.3.2-next.0
  - @backstage/errors@1.2.7-next.0
  - @backstage/version-bridge@1.0.10

## 1.10.2

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.6
  - @backstage/config@1.3.1
  - @backstage/types@1.2.0
  - @backstage/version-bridge@1.0.10

## 1.10.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.6-next.0
  - @backstage/config@1.3.1-next.0
  - @backstage/types@1.2.0
  - @backstage/version-bridge@1.0.10

## 1.10.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.0
  - @backstage/types@1.2.0
  - @backstage/errors@1.2.5
  - @backstage/version-bridge@1.0.10

## 1.10.0

### Minor Changes

- bfd4bec: **BREAKING PRODUCERS**: The `IconComponent` no longer accepts `fontSize="default"`. This has effectively been removed from Material-UI since its last two major versions, and has not worked properly for them in a long time.

  This change should not have an effect on neither users of MUI4 nor MUI5/6, since the updated interface should still let you send the respective `SvgIcon` types into interfaces where relevant (e.g. as app icons).

### Patch Changes

- e969dc7: Move `@types/react` to a peer dependency.
- 39001f4: Fixing issue with types for `ParamKeys` leading to type mismatches across versions
- Updated dependencies
  - @backstage/version-bridge@1.0.10
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 1.10.0-next.1

### Patch Changes

- e969dc7: Move `@types/react` to a peer dependency.
- Updated dependencies
  - @backstage/version-bridge@1.0.10-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 1.10.0-next.0

### Minor Changes

- bfd4bec: **BREAKING PRODUCERS**: The `IconComponent` no longer accepts `fontSize="default"`. This has effectively been removed from Material-UI since its last two major versions, and has not worked properly for them in a long time.

  This change should not have an effect on neither users of MUI4 nor MUI5/6, since the updated interface should still let you send the respective `SvgIcon` types into interfaces where relevant (e.g. as app icons).

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.9

## 1.9.4

### Patch Changes

- 836127c: Updated dependency `@testing-library/react` to `^16.0.0`.
- Updated dependencies
  - @backstage/version-bridge@1.0.9
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 1.9.4-next.0

### Patch Changes

- 836127c: Updated dependency `@testing-library/react` to `^16.0.0`.
- Updated dependencies
  - @backstage/version-bridge@1.0.9-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 1.9.3

### Patch Changes

- 35fbe09: A new `defaultTarget` option has been added to `createExternalRouteRef`. This allows one to specify a default target of the route by name, for example `'catalog.catalogIndex'`, which will be used if the target route is present in the app and there is no explicit route binding.
- Updated dependencies
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.8

## 1.9.3-next.0

### Patch Changes

- 35fbe09: Added a new `defaultTarget` option to `createExternalRouteRef`. I lets you specify a default target of the route by name, for example `'catalog.catalogIndex'`, which will be used if the target route is present in the app and there is no explicit route binding.
- Updated dependencies
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.8

## 1.9.2

### Patch Changes

- abfbcfc: Updated dependency `@testing-library/react` to `^15.0.0`.
- cb1e3b0: Updated dependency `@testing-library/dom` to `^10.0.0`.
- Updated dependencies
  - @backstage/version-bridge@1.0.8
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1

## 1.9.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 1.9.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/errors@1.2.4-next.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 1.9.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.4-next.0
  - @backstage/config@1.1.2-next.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 1.9.0

### Minor Changes

- f919be9: Added a utility API for VMware Cloud auth; the API ref is available in the
  `@backstage/core-plugin-api` and `@backstage/frontend-plugin-api` packages, the
  implementation is in `@backstage/core-app-api` and a factory has been added to
  `@backstage/app-defaults`.

### Patch Changes

- 8fe56a8: Widen `@types/react` dependency range to include version 18.
- e586f79: Throw a more specific exception `NotImplementedError` when an API implementation cannot be found.
- Updated dependencies
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 1.9.0-next.1

### Minor Changes

- f919be9: Added a utility API for VMware Cloud auth; the API ref is available in the
  `@backstage/core-plugin-api` and `@backstage/frontend-plugin-api` packages, the
  implementation is in `@backstage/core-app-api` and a factory has been added to
  `@backstage/app-defaults`.

### Patch Changes

- 8fe56a8: Widen `@types/react` dependency range to include version 18.
- Updated dependencies
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 1.8.3-next.0

### Patch Changes

- e586f79: Throw a more specific exception `NotImplementedError` when an API implementation cannot be found.
- Updated dependencies
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 1.8.2

### Patch Changes

- 6878b1d: Removed unnecessary `i18next` dependency.
- Updated dependencies
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 1.8.2-next.0

### Patch Changes

- 6878b1d: Removed unnecessary `i18next` dependency.
- Updated dependencies
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 1.8.1

### Patch Changes

- 03d0b6d: Removed the alpha `convertLegacyRouteRef` utility, which as been moved to `@backstage/core-compat-api`
- 0c93dc3: The `createTranslationRef` function from the `/alpha` subpath can now also accept a nested object structure of default translation messages, which will be flatted using `.` separators.
- Updated dependencies
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 1.8.1-next.1

### Patch Changes

- 0c93dc37b2: The `createTranslationRef` function from the `/alpha` subpath can now also accept a nested object structure of default translation messages, which will be flatted using `.` separators.
- Updated dependencies
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 1.8.1-next.0

### Patch Changes

- 03d0b6dcdc: Removed the alpha `convertLegacyRouteRef` utility, which as been moved to `@backstage/core-compat-api`
- Updated dependencies
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 1.8.0

### Minor Changes

- 1e5b7d993a: `IconComponent` can now have a `fontSize` of `inherit`, which is useful for in-line icons.
- cb6db75bc2: Introduced `AnyRouteRefParams` as a replacement for `AnyParams`, which is now deprecated.

### Patch Changes

- 6c2b872153: Add official support for React 18.
- cb6db75bc2: Deprecated several types related to the routing system that are scheduled to be removed, as well as several fields on the route ref types themselves.
- 68fc9dc60e: Added a new `/alpha` export `convertLegacyRouteRef`, which is a temporary utility to allow existing route refs to be used with the new experimental packages.
- Updated dependencies
  - @backstage/version-bridge@1.0.7
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## 1.8.0-next.0

### Minor Changes

- 1e5b7d993a: `IconComponent` can now have a `fontSize` of `inherit`, which is useful for in-line icons.
- cb6db75bc2: Introduced `AnyRouteRefParams` as a replacement for `AnyParams`, which is now deprecated.

### Patch Changes

- 6c2b872153: Add official support for React 18.
- cb6db75bc2: Deprecated several types related to the routing system that are scheduled to be removed, as well as several fields on the route ref types themselves.
- 68fc9dc60e: Added a new `/alpha` export `convertLegacyRouteRef`, which is a temporary utility to allow existing route refs to be used with the new experimental packages.
- Updated dependencies
  - @backstage/version-bridge@1.0.7-next.0
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## 1.7.0

### Minor Changes

- 322bbcae24: Removed the exprimental plugin configuration API. The `__experimentalReconfigure()` from the plugin options as well as the `__experimentalConfigure()` method on plugin instances have both been removed.

### Patch Changes

- 0b55f773a7: Removed some unused dependencies
- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/version-bridge@1.0.6
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## 1.7.0-next.1

### Patch Changes

- 0b55f773a7: Removed some unused dependencies
- Updated dependencies
  - @backstage/config@1.1.1-next.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.5

## 1.7.0-next.0

### Minor Changes

- 322bbcae24: Removed the exprimental plugin configuration API. The `__experimentalReconfigure()` from the plugin options as well as the `__experimentalConfigure()` method on plugin instances have both been removed.

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.5

## 1.6.0

### Minor Changes

- 18619f793c94: Added the optional `expiresAt` field that may now be part of a `BackstageIdentityResponse`.
- 6e30769cc627: Introduced experimental support for internationalization.

### Patch Changes

- 406b786a2a2c: Mark package as being free of side effects, allowing more optimized Webpack builds.
- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/config@1.1.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.5

## 1.6.0-next.3

### Patch Changes

- 406b786a2a2c: Mark package as being free of side effects, allowing more optimized Webpack builds.
- Updated dependencies
  - @backstage/config@1.1.0-next.2
  - @backstage/types@1.1.1-next.0
  - @backstage/version-bridge@1.0.5-next.0

## 1.6.0-next.2

### Minor Changes

- 6e30769cc627: Introduced experimental support for internationalization.

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/types@1.1.0
  - @backstage/version-bridge@1.0.4

## 1.6.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.0
  - @backstage/types@1.1.0
  - @backstage/version-bridge@1.0.4

## 1.6.0-next.0

### Minor Changes

- 18619f793c94: Added the optional `expiresAt` field that may now be part of a `BackstageIdentityResponse`.

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0
  - @backstage/version-bridge@1.0.4

## 1.5.3

### Patch Changes

- 8174cf4c0edf: Fixing MUI / Material UI references
- 13426ebd1235: Change `IconComponent` type to be compatible with Material UI v5 icons.
- Updated dependencies
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0
  - @backstage/version-bridge@1.0.4

## 1.5.3-next.1

### Patch Changes

- 8174cf4c0edf: Fixing MUI / Material UI references
- Updated dependencies
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0
  - @backstage/version-bridge@1.0.4

## 1.5.3-next.0

### Patch Changes

- 13426ebd1235: Change `IconComponent` type to be compatible with Material UI v5 icons.
- Updated dependencies
  - @backstage/config@1.0.8

## 1.5.2

### Patch Changes

- 12adfbc8fe2d: Fixed a bug that prevented accurate plugin and route data from being applied to `navigate` analytics events when users visited pages constructed with `<EntityLayout>`, `<TabbedLayout>`, and similar components that are used to gather one or more routable extensions under a given path.
- 74b216ee4e50: Add `PropsWithChildren` to usages of `ComponentType`, in preparation for React 18 where the children are no longer implicit.
- Updated dependencies
  - @backstage/types@1.1.0
  - @backstage/config@1.0.8
  - @backstage/version-bridge@1.0.4

## 1.5.2-next.0

### Patch Changes

- 74b216ee4e50: Add `PropsWithChildren` to usages of `ComponentType`, in preparation for React 18 where the children are no longer implicit.
- Updated dependencies
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.4

## 1.5.1

### Patch Changes

- 760f521b979: Add component name as data attribute for all components
- 2898b6c8d52: Minor type tweaks for TypeScript 5.0
- e0c6e8b9c3c: Update peer dependencies
- Updated dependencies
  - @backstage/version-bridge@1.0.4
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 1.5.1-next.1

### Patch Changes

- 2898b6c8d52: Minor type tweaks for TypeScript 5.0
- Updated dependencies
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.4-next.0

## 1.5.1-next.0

### Patch Changes

- e0c6e8b9c3c: Update peer dependencies
- Updated dependencies
  - @backstage/version-bridge@1.0.4-next.0
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 1.5.0

### Minor Changes

- ab750ddc4f2: The GitLab auth provider can now be used to get OpenID tokens.

### Patch Changes

- 928a12a9b3e: Internal refactor of `/alpha` exports.
- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- Updated dependencies
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.3

## 1.5.0-next.2

### Minor Changes

- ab750ddc4f2: The GitLab auth provider can now be used to get OpenID tokens.

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.7-next.0

## 1.4.1-next.1

### Patch Changes

- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- Updated dependencies
  - @backstage/config@1.0.7-next.0
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.3

## 1.4.1-next.0

### Patch Changes

- 928a12a9b3: Internal refactor of `/alpha` exports.
- Updated dependencies
  - @backstage/config@1.0.6
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.3

## 1.4.0

### Minor Changes

- db10b6ef65: Added a Bitbucket Server Auth Provider and added its API to the app defaults

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.3

## 1.3.0

### Minor Changes

- bca8e8b393: Allow defining application level feature flags. See [Feature Flags documentation](https://backstage.io/docs/plugins/feature-flags#in-the-application) for reference.

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.3

## 1.3.0-next.1

### Minor Changes

- bca8e8b393: Allow defining application level feature flags. See [Feature Flags documentation](https://backstage.io/docs/plugins/feature-flags#in-the-application) for reference.

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6-next.0
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.3

## 1.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6-next.0
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.3

## 1.2.0

### Minor Changes

- 9a1864976a: Added a new `display` property to the `AlertMessage` which can accept the values `permanent` or `transient`.

  Here's a rough example of how to trigger an alert using the new `display` property:

  ```ts
  import { alertApiRef, useApi } from '@backstage/core-plugin-api';

  const ExampleTransient = () => {
    const alertApi = useApi(alertApiRef);
    alertApi.post({
      message: 'Example of Transient Alert',
      severity: 'success',
      display: 'transient',
    });
  };
  ```

### Patch Changes

- d56127c712: useRouteRef - Limit re-resolving to location pathname changes only
- 3280711113: Updated dependency `msw` to `^0.49.0`.
- 19356df560: Updated dependency `zen-observable` to `^0.9.0`.
- c3fa90e184: Updated dependency `zen-observable` to `^0.10.0`.
- Updated dependencies
  - @backstage/version-bridge@1.0.3
  - @backstage/types@1.0.2
  - @backstage/config@1.0.5

## 1.2.0-next.2

### Minor Changes

- 9a1864976a: Added a new `display` property to the `AlertMessage` which can accept the values `permanent` or `transient`.

  Here's a rough example of how to trigger an alert using the new `display` property:

  ```ts
  import { alertApiRef, useApi } from '@backstage/core-plugin-api';

  const ExampleTransient = () => {
    const alertApi = useApi(alertApiRef);
    alertApi.post({
      message: 'Example of Transient Alert',
      severity: 'success',
      display: 'transient',
    });
  };
  ```

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.5-next.1
  - @backstage/types@1.0.2-next.1
  - @backstage/version-bridge@1.0.3-next.0

## 1.1.1-next.1

### Patch Changes

- c3fa90e184: Updated dependency `zen-observable` to `^0.10.0`.
- Updated dependencies
  - @backstage/version-bridge@1.0.3-next.0
  - @backstage/types@1.0.2-next.1
  - @backstage/config@1.0.5-next.1

## 1.1.1-next.0

### Patch Changes

- 3280711113: Updated dependency `msw` to `^0.49.0`.
- 19356df560: Updated dependency `zen-observable` to `^0.9.0`.
- Updated dependencies
  - @backstage/types@1.0.2-next.0
  - @backstage/config@1.0.5-next.0
  - @backstage/version-bridge@1.0.2

## 1.1.0

### Minor Changes

- a228f113d0: The app `Router` component now accepts an optional `basename` property.

### Patch Changes

- Updated dependencies
  - @backstage/version-bridge@1.0.2
  - @backstage/types@1.0.1
  - @backstage/config@1.0.4

## 1.1.0-next.0

### Minor Changes

- a228f113d0: The app `Router` component now accepts an optional `basename` property.

### Patch Changes

- Updated dependencies
  - @backstage/types@1.0.1-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/version-bridge@1.0.1

## 1.0.7

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.3
  - @backstage/types@1.0.0
  - @backstage/version-bridge@1.0.1

## 1.0.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.3-next.2
  - @backstage/types@1.0.0
  - @backstage/version-bridge@1.0.1

## 1.0.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.3-next.1
  - @backstage/types@1.0.0
  - @backstage/version-bridge@1.0.1

## 1.0.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.3-next.0
  - @backstage/types@1.0.0
  - @backstage/version-bridge@1.0.1

## 1.0.6

### Patch Changes

- 817f3196f6: Updated React Router dependencies to be peer dependencies.
- 7d47def9c4: Removed dependency on `@types/jest`.
- 744fea158b: Added `getSystemIcons()` function to the `AppContext` available through `useApp` that will pull a list of all the icons that have been registered in the App.
- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- ef9ab322de: Minor API signatures cleanup
- Updated dependencies
  - @backstage/config@1.0.2

## 1.0.6-next.3

### Patch Changes

- 7d47def9c4: Removed dependency on `@types/jest`.
- Updated dependencies
  - @backstage/config@1.0.2-next.0

## 1.0.6-next.2

### Patch Changes

- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.

## 1.0.6-next.1

### Patch Changes

- 817f3196f6: Updated React Router dependencies to be peer dependencies.

## 1.0.6-next.0

### Patch Changes

- 744fea158b: Added `getSystemIcons()` function to the `AppContext` available through `useApp` that will pull a list of all the icons that have been registered in the App.
- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- ef9ab322de: Minor API signatures cleanup

## 1.0.5

### Patch Changes

- 80da5162c7: Introduced a new experimental feature that allows you to declare plugin-wide options for your plugin by defining
  `__experimentalConfigure` in your `createPlugin` options. See https://backstage.io/docs/plugins/customization.md for more information.

  This is an experimental feature and it will have breaking changes in the future.

- 87649a06bf: Add a note that the `fetchApi` utility should not be used on sign-in page implementations and similar.

## 1.0.5-next.0

### Patch Changes

- 80da5162c7: Introduced a new experimental feature that allows you to declare plugin-wide options for your plugin by defining
  `__experimentalConfigure` in your `createPlugin` options. See https://backstage.io/docs/plugins/customization.md for more information.

  This is an experimental feature and it will have breaking changes in the future.

## 1.0.4

### Patch Changes

- 881fc75a75: Internal tweak removing usage of explicit type parameters for the `BackstagePlugin` type.
- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 8006d0f9bf: Updated dependency `msw` to `^0.44.0`.
- 2990fff4e5: Enabled the `@backstage/core-plugin-api/alpha` entry point.

## 1.0.4-next.0

### Patch Changes

- 881fc75a75: Internal tweak removing usage of explicit type parameters for the `BackstagePlugin` type.
- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 2990fff4e5: Enabled the `@backstage/core-plugin-api/alpha` entry point.

## 1.0.3

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.

## 1.0.3-next.0

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.

## 1.0.2

### Patch Changes

- b653a5595c: The authentication APIs are no longer `@alpha`. Since the `@backstage/core-plugin-api` has no `/alpha` entrypoint, the only effect of marking the APIs as `@alpha` was to hide them in documentation. They are still expected to be widely used and there will be a migration path if they are changed in the future.
- Updated dependencies
  - @backstage/config@1.0.1

## 1.0.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.1-next.0

## 1.0.2-next.0

### Patch Changes

- b653a5595c: The authentication APIs are no longer `@alpha`. Since the `@backstage/core-plugin-api` has no `/alpha` entrypoint, the only effect of marking the APIs as `@alpha` was to hide them in documentation. They are still expected to be widely used and there will be a migration path if they are changed in the future.

## 1.0.1

### Patch Changes

- 7c7919777e: build(deps-dev): bump `@testing-library/react-hooks` from 7.0.2 to 8.0.0
- 24254fd433: build(deps): bump `@testing-library/user-event` from 13.5.0 to 14.0.0
- 230ad0826f: Bump to using `@types/node` v16
- Updated dependencies
  - @backstage/version-bridge@1.0.1

## 1.0.1-next.0

### Patch Changes

- 24254fd433: build(deps): bump `@testing-library/user-event` from 13.5.0 to 14.0.0
- 230ad0826f: Bump to using `@types/node` v16

## 1.0.0

### Major Changes

- b58c70c223: This package has been promoted to v1.0! To understand how this change affects the package, please check out our [versioning policy](https://backstage.io/docs/overview/versioning-policy).

### Patch Changes

- a422d7ce5e: chore(deps): bump `@testing-library/react` from 11.2.6 to 12.1.3
- f24ef7864e: Minor typo fixes
- Updated dependencies
  - @backstage/version-bridge@1.0.0
  - @backstage/config@1.0.0
  - @backstage/types@1.0.0

## 0.8.0

### Minor Changes

- bb2bb36651: **BREAKING**: Removed the deprecated `get` method from `StorageAPI` and its implementations, this method has been replaced by the `snapshot` method. The return value from snapshot no longer includes `newValue` which has been replaced by `value`. For getting notified when a value changes, use `observe# @backstage/core-plugin-api.
- af5eaa87f4: **BREAKING**: Removed deprecated `auth0AuthApiRef`, `oauth2ApiRef`, `samlAuthApiRef` and `oidcAuthApiRef` as these APIs are too generic to be useful. Instructions for how to migrate can be found at [https://backstage.io/docs/api/deprecations#generic-auth-api-refs](https://backstage.io/docs/api/deprecations#generic-auth-api-refs).
- a480f670c7: **BREAKING**: OAuth provider id is now required when passing a provider to `createAuthRequester`.

## 0.7.0

### Minor Changes

- 33cd215b11: **BREAKING**: Removed deprecated `AnyAnalyticsContext` type which is replaced by `AnalyticsContextValue`

## 0.6.1

### Patch Changes

- 1ed305728b: Bump `node-fetch` to version 2.6.7 and `cross-fetch` to version 3.1.5
- c77c5c7eb6: Added `backstage.role` to `package.json`
- 2714145cf5: Removes unused react-use dependency.
- Updated dependencies
  - @backstage/config@0.1.14
  - @backstage/types@0.1.2
  - @backstage/version-bridge@0.1.2

## 0.6.0

### Minor Changes

- ceebe25391: Removed deprecated `IdentityApi` methods: `getUserId`, `getIdToken`, and `getProfile`.

  Existing usage of `getUserId` can be replaced by `getBackstageIdentity`, more precisely the equivalent of the previous `userId` can be retrieved like this:

  ```ts
  import { parseEntityRef } from '@backstage/catalog-model';

  const identity = await identityApi.getBackstageIdentity();
  const { name: userId } = parseEntityRef(identity.userEntityRef);
  ```

  Note that it is recommended to consume the entire `userEntityRef` rather than parsing out just the name, in order to support namespaces.

  Existing usage of `getIdToken` can be replaced by `getCredentials`, like this:

  ```ts
  const { token } = await identityApi.getCredentials();
  ```

  And existing usage of `getProfile` is replaced by `getProfileInfo`, which returns the same profile object, but is now async.

- ceebe25391: Removed deprecated `SignInResult` type, which was replaced with the new `onSignInSuccess` callback.
- d879072b0c: Removed the deprecated `id` field of `BackstageIdentityResponse`.

  Existing usage can be replaced by parsing the `name` of the `identity.userEntityRef` with `parseEntityRef` from `@backstage/catalog-model`, although note that it is recommended to consume the entire `userEntityRef` in order to support namespaces.

- 94c02b4246: Removed deprecated `BackstageIdentity` type, which was replaced by `BackstageIdentityResponse`.
- 234a36405b: Removed deprecated `OAuthRequestApi` types: `AuthProvider`, `AuthRequesterOptions`, `AuthRequester`, and `PendingAuthRequest`.

### Patch Changes

- Updated dependencies
  - @backstage/config@0.1.13

## 0.6.0-next.0

### Minor Changes

- ceebe25391: Removed deprecated `IdentityApi` methods: `getUserId`, `getIdToken`, and `getProfile`.

  Existing usage of `getUserId` can be replaced by `getBackstageIdentity`, more precisely the equivalent of the previous `userId` can be retrieved like this:

  ```ts
  import { parseEntityRef } from '@backstage/catalog-model';

  const identity = await identityApi.getBackstageIdentity();
  const { name: userId } = parseEntityRef(identity.userEntityRef);
  ```

  Note that it is recommended to consume the entire `userEntityRef` rather than parsing out just the name, in order to support namespaces.

  Existing usage of `getIdToken` can be replaced by `getCredentials`, like this:

  ```ts
  const { token } = await identityApi.getCredentials();
  ```

  And existing usage of `getProfile` is replaced by `getProfileInfo`, which returns the same profile object, but is now async.

- ceebe25391: Removed deprecated `SignInResult` type, which was replaced with the new `onSignInSuccess` callback.
- d879072b0c: Removed the deprecated `id` field of `BackstageIdentityResponse`.

  Existing usage can be replaced by parsing the `name` of the `identity.userEntityRef` with `parseEntityRef` from `@backstage/catalog-model`, although note that it is recommended to consume the entire `userEntityRef` in order to support namespaces.

- 94c02b4246: Removed deprecated `BackstageIdentity` type, which was replaced by `BackstageIdentityResponse`.
- 234a36405b: Removed deprecated `OAuthRequestApi` types: `AuthProvider`, `AuthRequesterOptions`, `AuthRequester`, and `PendingAuthRequest`.

### Patch Changes

- Updated dependencies
  - @backstage/config@0.1.13-next.0

## 0.5.0

### Minor Changes

- 784d8078ab: Removed the deprecated `OldIconComponent` type.
- e2eb92c109: Removed previously deprecated exports: `PluginHooks`, `PluginOutput`, and `FeatureFlagOutput`.

  The deprecated `register` method of `PluginConfig` has been removed, as well as the deprecated `output` method of `BackstagePlugin`.

### Patch Changes

- 784d8078ab: Removed direct and transitive Material UI dependencies.
- Updated dependencies
  - @backstage/config@0.1.12

## 0.4.1

### Patch Changes

- c534ef2242: Deprecated `OldIconComponent`. Existing usage should be replaced with `IconComponent`.

## 0.4.0

### Minor Changes

- a195284c7b: **BREAKING CHANGE** The `StorageApi` has received several updates that fills in gaps for some use-cases and makes it easier to avoid mistakes:

  - The `StorageValueChange` type has been renamed to `StorageValueSnapshot`, the `newValue` property has been renamed to `value`, the stored value type has been narrowed to `JsonValue`, and it has received a new `presence` property that is `'unknown'`, `'absent'`, or `'present'`.
  - The `get` method has been deprecated in favor of a new `snapshot` method, which returns a `StorageValueSnapshot`.
  - The `observe# @backstage/core-plugin-api method has had its contract changed. It should now emit values when the`presence`of a key changes, this may for example happen when remotely stored values are requested on page load and the presence switches from`'unknown'`to either`'absent'`or`'present'`.

  The above changes have been made with deprecations in place to maintain much of the backwards compatibility for consumers of the `StorageApi`. The only breaking change is the narrowing of the stored value type, which may in some cases require the addition of an explicit type parameter to the `get` and `observe# @backstage/core-plugin-api methods.

- f6722d2458: - Removed deprecated option `description` from `ApiRefConfig`
  - Removed descriptions from all plugin API refs
  - Removed deprecated parameters `path`, `icon`, and `title` in `createRouteRef`
  - Removed deprecated types `Error` and `ErrorContext` from `ErrorApi`
- 68f8b10ccd: - Removed deprecation configuration option `theme` from `AppTheme` of the `AppThemeApi`
  - Removed reference to `theme` in the `app-defaults` default `AppTheme`
  - Removed logic in `AppThemeProvider` that creates `ThemeProvider` from `appTheme.theme`
- 6b69b44862: Removed deprecated types `ApiRefType` and `ApiRefsToTypes`

### Patch Changes

- 7927005152: Add `FetchApi` and related `fetchApiRef` which implement fetch, with an added Backstage token header when available.

## 0.3.1

### Patch Changes

- 18d4f500af: Deprecated the `AnyAnalyticsContext` type and mark the `AnalyticsApi` experimental.
- 8a7372cfd5: Deprecated `auth0AuthApiRef`, `oauth2ApiRef`, `oidcAuthApiRef`, `samlAuthApiRef`, and marked the rest of the auth `ApiRef`s as experimental. For more information on how to address the deprecations, see https://backstage.io/docs/api/deprecations#generic-auth-api-refs.
- 760791a642: Renamed `AuthProvider` to `AuthProviderInfo` and add a required 'id' property to match the majority of usage. The `AuthProvider` type without the `id` property still exists but is deprecated, and all usage of it without an `id` is deprecated as well. For example, calling `createAuthRequest` without a `provider.id` is deprecated and it will be required in the future.

  The following types have been renamed. The old names are still exported but deprecated, and are scheduled for removal in a future release.

  - Renamed `AuthRequesterOptions` to `OAuthRequesterOptions`
  - Renamed `AuthRequester` to `OAuthRequester`
  - Renamed `PendingAuthRequest` to `PendingOAuthRequest`

## 0.3.0

### Minor Changes

- a036b65c2f: The `IdentityApi` has received several updates. The `getUserId`, `getProfile`, and `getIdToken` have all been deprecated.

  The replacement for `getUserId` is the new `getBackstageIdentity` method, which provides both the `userEntityRef` as well as the `ownershipEntityRefs` that are used to resolve ownership. Existing usage of the user ID would typically be using a fixed entity kind and namespace, for example `` `user:default/${identityApi.getUserId()}` ``, this kind of usage should now instead use the `userEntityRef` directly.

  The replacement for `getProfile` is the new async `getProfileInfo`.

  The replacement for `getIdToken` is the new `getCredentials` method, which provides an optional token to the caller like before, but it is now wrapped in an object for forwards compatibility.

  The deprecated `idToken` field of the `BackstageIdentity` type has been removed, leaving only the new `token` field, which should be used instead. The `BackstageIdentity` also received a new `identity` field, which is a decoded version of the information within the token. Furthermore the `BackstageIdentity` has been renamed to `BackstageIdentityResponse`, with the old name being deprecated.

  We expect most of the breaking changes in this update to have low impact since the `IdentityApi` implementation is provided by the app, but it is likely that some tests need to be updated.

  Another breaking change is that the `SignInPage` props have been updated, and the `SignInResult` type is now deprecated. This is unlikely to have any impact on the usage of this package, but it is an important change that you can find more information about in the [`@backstage/core-app-api` CHANGELOG.md](https://github.com/backstage/backstage/blob/master/packages/core-app-api/CHANGELOG.md).

### Patch Changes

- cd450844f6: Moved React dependencies to `peerDependencies` and allow both React v16 and v17 to be used.
- dcd1a0c3f4: Minor improvement to the API reports, by not unpacking arguments directly
- Updated dependencies
  - @backstage/version-bridge@0.1.1

## 0.2.2

### Patch Changes

- b291d0ed7e: Tweaked the logged deprecation warning for `createRouteRef` to hopefully make it more clear.
- bacb94ea8f: Documented the options of each of the extension creation functions.
- Updated dependencies
  - @backstage/theme@0.2.14

## 0.2.1

### Patch Changes

- 950b36393c: Deprecated `register` option of `createPlugin` and the `outputs` methods of the plugin instance.

  Introduces the `featureFlags` property to define your feature flags instead.

## 0.2.0

### Minor Changes

- 7e18ed7f29: Removed the unused `UserFlags` type.
- 7df99cdb77: Remove exports of unused types(`RouteOptions` and `RoutePath`).

### Patch Changes

- 37ebea2d68: Add deprecation warnings around `title` `icon` and `path` as they are no longer controlled when creating `routeRefs`
- 2dd2a7b2cc: Deprecated the `theme` property on `AppTheme`, replacing it with `Provider`. See https://backstage.io/docs/api/deprecations#app-theme for more details.
- b6a4bacdc4: Deprecated the `Error` and `ErrorContext` types, replacing them with identical `ErrorApiError` and `ErrorApiErrorContext` types.

## 0.1.13

### Patch Changes

- 4a336fd292: Deprecate use of extensions without name. Adds a warning to the developer console to prompt integrators to provide names for extensions.
- 8b4284cd5c: Improve API documentation for @backstage/core-plugin-api
- e059aea7b9: Deprecate unused ApiRef types
- Updated dependencies
  - @backstage/theme@0.2.13

## 0.1.12

### Patch Changes

- 41c49884d2: Start using the new `@backstage/types` package. Initially, this means using the `Observable` and `Json*` types from there. The types also remain in their old places but deprecated, and will be removed in a future release.
- 925a967f36: Replace usage of test-utils-core with test-utils
- Updated dependencies
  - @backstage/config@0.1.11
  - @backstage/theme@0.2.12

## 0.1.11

### Patch Changes

- 202f322927: Atlassian auth provider

  - AtlassianAuth added to core-app-api
  - Atlassian provider added to plugin-auth-backend
  - Updated user-settings with Atlassian connection

- 36e67d2f24: Internal updates to apply more strict checks to throw errors.

## 0.1.10

### Patch Changes

- 829bc698f4: Introducing the Analytics API: a lightweight way for plugins to instrument key
  events that could help inform a Backstage Integrator how their instance of
  Backstage is being used. The API consists of the following:

  - `useAnalytics()`, a hook to be used inside plugin components which retrieves
    an Analytics Tracker.
  - `tracker.captureEvent()`, a method on the tracker used to instrument key
    events. The method expects an action (the event name) and a subject (a unique
    identifier of the object the action is being taken on).
  - `<AnalyticsContext />`, a way to declaratively attach additional information
    to any/all events captured in the underlying React tree. There is also a
    `withAnalyticsContext()` HOC utility.
  - The `tracker.captureEvent()` method also accepts an `attributes` option for
    providing additional run-time information about an event, as well as a
    `value` option for capturing a numeric/metric value.

  By default, captured events are not sent anywhere. In order to collect and
  redirect events to an analytics system, the `analyticsApi` will need to be
  implemented and instantiated by an App Integrator.

- 4c3eea7788: Bitbucket Cloud authentication - based on the existing GitHub authentication + changes around BB apis and updated scope.

  - BitbucketAuth added to core-app-api.
  - Bitbucket provider added to plugin-auth-backend.
  - Cosmetic entry for Bitbucket connection in user-settings Authentication Providers tab.

## 0.1.9

### Patch Changes

- 98bd661240: Improve compatibility between different versions by defining the route reference type using a string key rather than a unique symbol. This change only applies to type checking and has no effect on the runtime value, where we still use the symbol.

## 0.1.8

### Patch Changes

- 671015f132: Switch to using utilities from `@backstage/version-bridge'.

## 0.1.7

### Patch Changes

- 3d238b028: Migrated component data attachment method to have better compatibility with component proxies such as `react-hot-loader`.
- Updated dependencies
  - @backstage/config@0.1.9

## 0.1.6

### Patch Changes

- 56c773909: Switched `@types/react` dependency to request `*` rather than a specific version.

## 0.1.5

### Patch Changes

- c4d8ff963: Switched frontend identity code to use `token` instead of the deprecated `idToken` field
- Updated dependencies
  - @backstage/config@0.1.6

## 0.1.4

### Patch Changes

- 9d40fcb1e: - Bumping `material-ui/core` version to at least `4.12.2` as they made some breaking changes in later versions which broke `Pagination` of the `Table`.
  - Switching out `material-table` to `@material-table/core` for support for the later versions of `material-ui/core`
  - This causes a minor API change to `@backstage/core-components` as the interface for `Table` re-exports the `prop` from the underlying `Table` components.
  - `onChangeRowsPerPage` has been renamed to `onRowsPerPageChange`
  - `onChangePage` has been renamed to `onPageChange`
  - Migration guide is here: https://material-table-core.com/docs/breaking-changes
- Updated dependencies
  - @backstage/theme@0.2.9

## 0.1.3

### Patch Changes

- 5f4339b8c: Adding `FeatureFlag` component and treating `FeatureFlags` as first class citizens to composability API

## 0.1.2

### Patch Changes

- 75b8537ce: This change adds automatic error boundaries around extensions.

  This means that all exposed parts of a plugin are wrapped in a general error boundary component, that is plugin aware. The default design for the error box is borrowed from `@backstage/errors`. To override the default "fallback", one must provide a component named `ErrorBoundaryFallback` to `createApp`, like so:

  ```ts
  const app = createApp({
    components: {
      ErrorBoundaryFallback: props => {
        // a custom fallback component
        return (
          <>
            <h1>Oops.</h1>
            <h2>
              The plugin {props.plugin.getId()} failed with{' '}
              {props.error.message}
            </h2>
            <button onClick={props.resetError}>Try again</button>
          </>
        );
      },
    },
  });
  ```

  The props here include:

  - `error`. An `Error` object or something that inherits it that represents the error that was thrown from any inner component.
  - `resetError`. A callback that will simply attempt to mount the children of the error boundary again.
  - `plugin`. A `BackstagePlugin` that can be used to look up info to be presented in the error message. For instance, you may want to keep a map of your internal plugins and team names or slack channels and present these when an error occurs. Typically, you'll do that by getting the plugin ID with `plugin.getId()`.

- da8cba44f: Apply fixes to the extension creation API that were mistakenly applied to `@backstage/core-app-api` instead.

## 0.1.1

### Patch Changes

- 031ccd45f: Made the deprecated `icon` fields compatible with the `IconComponent` type from `@backstage/core` in order to smooth out the migration.
- e7c5e4b30: Update installation instructions in README.
- Updated dependencies [e7c5e4b30]
  - @backstage/theme@0.2.8
