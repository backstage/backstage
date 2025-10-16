# @backstage/plugin-app

## 0.3.1

### Patch Changes

- ae1dad0: Fixed an issue that caused the `NotFound` page to not render correctly when a Page was mounted at `/`.
- Updated dependencies
  - @backstage/core-components@0.18.2
  - @backstage/frontend-plugin-api@0.12.1
  - @backstage/theme@0.7.0
  - @backstage/core-plugin-api@1.11.1
  - @backstage/integration-react@1.2.11
  - @backstage/plugin-permission-react@0.4.37

## 0.3.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.2-next.2
  - @backstage/theme@0.6.9-next.0

## 0.3.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.2-next.1
  - @backstage/core-plugin-api@1.11.1-next.0
  - @backstage/integration-react@1.2.11-next.1
  - @backstage/plugin-permission-react@0.4.37-next.0
  - @backstage/frontend-plugin-api@0.12.1-next.1

## 0.3.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.2-next.0
  - @backstage/frontend-plugin-api@0.12.1-next.0
  - @backstage/integration-react@1.2.11-next.0
  - @backstage/core-plugin-api@1.11.0
  - @backstage/theme@0.6.8
  - @backstage/types@1.2.2
  - @backstage/version-bridge@1.0.11
  - @backstage/plugin-permission-react@0.4.36

## 0.3.0

### Minor Changes

- 99790db: Add implementation of OpenShift authentication provider.

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.12.0
  - @backstage/core-plugin-api@1.11.0
  - @backstage/core-components@0.18.0
  - @backstage/types@1.2.2
  - @backstage/integration-react@1.2.10

## 0.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.11.1-next.0
  - @backstage/core-components@0.17.6-next.0
  - @backstage/integration-react@1.2.10-next.0

## 0.2.0

### Minor Changes

- fda1bbc: **BREAKING**: The `componentsApi` implementation has been removed from the plugin and replaced with the new `SwappableComponentsApi` instead.

  If you were overriding the `componentsApi` implementation, you can now use the new `SwappableComponentsApi` instead.

  ```ts
  // old
  appPlugin.getExtension('api:app/components').override(...)

  // new
  appPlugin.getExtension('api:app/swappable-components').override(...)
  ```

- 29786f6: Updated the `app/nav` extension to use the new `NavContentBlueprint`, and removed support for extensions created with the now removed `NavLogoBlueprint`.
- 121899a: **BREAKING**: The `app-root-element` extension now only accepts `JSX.Element` in its `element` param, meaning overrides need to be updated.

### Patch Changes

- 91cbdf4: Log a warning when `SwappableComponent` extensions are installed outside of using the `app` plugin
- fda1bbc: Default implementations of core components are now provided by this package.

  A backwards compatible `componentsApi` implementation is also provided from this package which uses the `SwappableComponentsApi` as the implementation. This backwards compatible wrapper will be removed in the future.

- f2f133c: Internal update to use the new variant of `ApiBlueprint`.
- a08f95f: Added a new module for implementing public sign-in apps, exported as `appModulePublicSignIn` via the `/alpha` sub-path export. This replaces the `createPublicSignInApp` export from `@backstage/frontend-defaults`, which is now deprecated.
- 5d31d66: Updated the usage of the `RouterBlueprint` and `AppRootWrapperBlueprint` to use the lowercase `component` parameter
- 93b5e38: The default implementation of the Analytics API now collects and instantiates analytics implementations exposed via `AnalyticsImplementationBlueprint` extensions. If no such extensions are discovered, the API continues to do nothing with analytics events fired within Backstage. If multiple such extensions are discovered, every discovered implementation automatically receives analytics events.
- 9831f4e: Adjusted the dialog API types to have more sensible defaults
- Updated dependencies
  - @backstage/core-components@0.17.5
  - @backstage/frontend-plugin-api@0.11.0
  - @backstage/theme@0.6.8

## 0.2.0-next.2

### Minor Changes

- fda1bbc: **BREAKING**: The `componentsApi` implementation has been removed from the plugin and replaced with the new `SwappableComponentsApi` instead.

  If you were overriding the `componentsApi` implementation, you can now use the new `SwappableComponentsApi` instead.

  ```ts
  // old
  appPlugin.getExtension('api:app/components').override(...)

  // new
  appPlugin.getExtension('api:app/swappable-components').override(...)
  ```

### Patch Changes

- 91cbdf4: Log a warning when `SwappableComponent` extensions are installed outside of using the `app` plugin
- fda1bbc: Default implementations of core components are now provided by this package.

  A backwards compatible `componentsApi` implementation is also provided from this package which uses the `SwappableComponentsApi` as the implementation. This backwards compatible wrapper will be removed in the future.

- 9831f4e: Adjusted the dialog API types to have more sensible defaults
- Updated dependencies
  - @backstage/frontend-plugin-api@0.11.0-next.2
  - @backstage/core-components@0.17.5-next.2

## 0.2.0-next.1

### Minor Changes

- 121899a: **BREAKING**: The `app-root-element` extension now only accepts `JSX.Element` in its `element` param, meaning overrides need to be updated.

### Patch Changes

- a08f95f: Added a new module for implementing public sign-in apps, exported as `appModulePublicSignIn` via the `/alpha` sub-path export. This replaces the `createPublicSignInApp` export from `@backstage/frontend-defaults`, which is now deprecated.
- 5d31d66: Updated the usage of the `RouterBlueprint` and `AppRootWrapperBlueprint` to use the lowercase `component` parameter
- 93b5e38: The default implementation of the Analytics API now collects and instantiates analytics implementations exposed via `AnalyticsImplementationBlueprint` extensions. If no such extensions are discovered, the API continues to do nothing with analytics events fired within Backstage. If multiple such extensions are discovered, every discovered implementation automatically receives analytics events.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.11.0-next.1
  - @backstage/core-components@0.17.5-next.1
  - @backstage/core-plugin-api@1.10.9
  - @backstage/integration-react@1.2.9
  - @backstage/theme@0.6.8-next.0
  - @backstage/types@1.2.1
  - @backstage/plugin-permission-react@0.4.36

## 0.2.0-next.0

### Minor Changes

- 29786f6: Updated the `app/nav` extension to use the new `NavContentBlueprint`, and removed support for extensions created with the now removed `NavLogoBlueprint`.

### Patch Changes

- f2f133c: Internal update to use the new variant of `ApiBlueprint`.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.11.0-next.0
  - @backstage/theme@0.6.8-next.0
  - @backstage/core-components@0.17.5-next.0
  - @backstage/core-plugin-api@1.10.9
  - @backstage/integration-react@1.2.9
  - @backstage/types@1.2.1
  - @backstage/plugin-permission-react@0.4.36

## 0.1.11

### Patch Changes

- 09f5e36: Remove trailing slashes in the `AppRoutes` extension to ensure any nested routing behaves correctly.
- Updated dependencies
  - @backstage/core-components@0.17.4
  - @backstage/core-plugin-api@1.10.9
  - @backstage/theme@0.6.7
  - @backstage/integration-react@1.2.9
  - @backstage/frontend-plugin-api@0.10.4
  - @backstage/plugin-permission-react@0.4.36

## 0.1.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.4-next.1
  - @backstage/core-plugin-api@1.10.9-next.0
  - @backstage/integration-react@1.2.9-next.1
  - @backstage/plugin-permission-react@0.4.36-next.0
  - @backstage/frontend-plugin-api@0.10.4-next.1

## 0.1.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration-react@1.2.9-next.0
  - @backstage/theme@0.6.7-next.0
  - @backstage/core-components@0.17.4-next.0
  - @backstage/core-plugin-api@1.10.8
  - @backstage/frontend-plugin-api@0.10.4-next.0
  - @backstage/types@1.2.1
  - @backstage/plugin-permission-react@0.4.35

## 0.1.10

### Patch Changes

- 18c64e9: Added the `info.packageJson` option to the plugin instance for the new frontend system.
- Updated dependencies
  - @backstage/core-components@0.17.3
  - @backstage/core-plugin-api@1.10.8
  - @backstage/frontend-plugin-api@0.10.3
  - @backstage/integration-react@1.2.8
  - @backstage/theme@0.6.6
  - @backstage/types@1.2.1
  - @backstage/plugin-permission-react@0.4.35

## 0.1.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.3-next.0
  - @backstage/frontend-plugin-api@0.10.3-next.1
  - @backstage/integration-react@1.2.7
  - @backstage/core-plugin-api@1.10.7
  - @backstage/theme@0.6.6
  - @backstage/types@1.2.1
  - @backstage/plugin-permission-react@0.4.34

## 0.1.10-next.0

### Patch Changes

- 18c64e9: Added the `info.packageJson` option to the plugin instance for the new frontend system.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.10.3-next.0
  - @backstage/integration-react@1.2.7

## 0.1.9

### Patch Changes

- fb58f20: Internal update to use the new `pluginId` option of `createFrontendPlugin`.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.10.2
  - @backstage/theme@0.6.6
  - @backstage/core-components@0.17.2
  - @backstage/core-plugin-api@1.10.7
  - @backstage/integration-react@1.2.7
  - @backstage/plugin-permission-react@0.4.34
  - @backstage/types@1.2.1

## 0.1.9-next.3

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.2-next.1
  - @backstage/core-plugin-api@1.10.7-next.0
  - @backstage/frontend-plugin-api@0.10.2-next.1
  - @backstage/integration-react@1.2.7-next.3
  - @backstage/theme@0.6.6-next.0
  - @backstage/types@1.2.1
  - @backstage/plugin-permission-react@0.4.34-next.1

## 0.1.9-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.10.7-next.0
  - @backstage/core-components@0.17.2-next.1
  - @backstage/frontend-plugin-api@0.10.2-next.1
  - @backstage/integration-react@1.2.7-next.2
  - @backstage/plugin-permission-react@0.4.34-next.1
  - @backstage/theme@0.6.6-next.0
  - @backstage/types@1.2.1

## 0.1.9-next.1

### Patch Changes

- fb58f20: Internal update to use the new `pluginId` option of `createFrontendPlugin`.
- Updated dependencies
  - @backstage/theme@0.6.6-next.0
  - @backstage/core-components@0.17.2-next.0
  - @backstage/frontend-plugin-api@0.10.2-next.0
  - @backstage/integration-react@1.2.7-next.1
  - @backstage/core-plugin-api@1.10.6
  - @backstage/types@1.2.1
  - @backstage/plugin-permission-react@0.4.34-next.0

## 0.1.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration-react@1.2.7-next.0
  - @backstage/core-components@0.17.1
  - @backstage/core-plugin-api@1.10.6
  - @backstage/frontend-plugin-api@0.10.1
  - @backstage/theme@0.6.5
  - @backstage/types@1.2.1
  - @backstage/plugin-permission-react@0.4.33

## 0.1.8

### Patch Changes

- a47fd39: Removes instances of default React imports, a necessary update for the upcoming React 19 migration.

  <https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html>

- Updated dependencies
  - @backstage/frontend-plugin-api@0.10.1
  - @backstage/integration-react@1.2.6
  - @backstage/core-components@0.17.1
  - @backstage/core-plugin-api@1.10.6
  - @backstage/plugin-permission-react@0.4.33
  - @backstage/theme@0.6.5
  - @backstage/types@1.2.1

## 0.1.8-next.1

### Patch Changes

- a47fd39: Removes instances of default React imports, a necessary update for the upcoming React 19 migration.

  <https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html>

- Updated dependencies
  - @backstage/frontend-plugin-api@0.10.1-next.1
  - @backstage/integration-react@1.2.6-next.1
  - @backstage/core-components@0.17.1-next.1
  - @backstage/core-plugin-api@1.10.6-next.0
  - @backstage/plugin-permission-react@0.4.33-next.0
  - @backstage/theme@0.6.5-next.0
  - @backstage/types@1.2.1

## 0.1.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.1-next.0
  - @backstage/integration-react@1.2.6-next.0
  - @backstage/frontend-plugin-api@0.10.1-next.0
  - @backstage/core-plugin-api@1.10.5
  - @backstage/theme@0.6.4
  - @backstage/types@1.2.1
  - @backstage/plugin-permission-react@0.4.32

## 0.1.7

### Patch Changes

- 583fc54: Fixed extra app elements not being rendered as part of apps without a sign-in page.
- 0aa9d82: Added implementation of the new `DialogApi`.
- Updated dependencies
  - @backstage/core-components@0.17.0
  - @backstage/core-plugin-api@1.10.5
  - @backstage/frontend-plugin-api@0.10.0
  - @backstage/integration-react@1.2.5
  - @backstage/plugin-permission-react@0.4.32
  - @backstage/theme@0.6.4
  - @backstage/types@1.2.1

## 0.1.7-next.2

### Patch Changes

- 0aa9d82: Added implementation of the new `DialogApi`.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.10.0-next.2
  - @backstage/core-components@0.16.5-next.1
  - @backstage/core-plugin-api@1.10.4
  - @backstage/integration-react@1.2.5-next.0
  - @backstage/theme@0.6.4
  - @backstage/types@1.2.1
  - @backstage/plugin-permission-react@0.4.31

## 0.1.7-next.1

### Patch Changes

- 583fc54: Fixed extra app elements not being rendered as part of apps without a sign-in page.
- Updated dependencies
  - @backstage/core-components@0.16.5-next.0
  - @backstage/core-plugin-api@1.10.4
  - @backstage/frontend-plugin-api@0.9.6-next.1
  - @backstage/integration-react@1.2.4
  - @backstage/theme@0.6.4
  - @backstage/plugin-permission-react@0.4.31

## 0.1.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.9.6-next.0
  - @backstage/integration-react@1.2.4

## 0.1.6

### Patch Changes

- 58ec9e7: Removed older versions of React packages as a preparatory step for upgrading to React 19. This commit does not introduce any functional changes, but removes dependencies on previous React versions, allowing for a cleaner upgrade path in subsequent commits.
- Updated dependencies
  - @backstage/core-components@0.16.4
  - @backstage/frontend-plugin-api@0.9.5
  - @backstage/integration-react@1.2.4
  - @backstage/core-plugin-api@1.10.4
  - @backstage/plugin-permission-react@0.4.31
  - @backstage/theme@0.6.4

## 0.1.6-next.3

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.9.5-next.3
  - @backstage/core-components@0.16.4-next.1
  - @backstage/core-plugin-api@1.10.4-next.0
  - @backstage/integration-react@1.2.4-next.0
  - @backstage/theme@0.6.4-next.0
  - @backstage/plugin-permission-react@0.4.31-next.0

## 0.1.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.16.4-next.1
  - @backstage/core-plugin-api@1.10.4-next.0
  - @backstage/frontend-plugin-api@0.9.5-next.2
  - @backstage/integration-react@1.2.4-next.0
  - @backstage/theme@0.6.4-next.0
  - @backstage/plugin-permission-react@0.4.31-next.0

## 0.1.6-next.1

### Patch Changes

- 58ec9e7: Removed older versions of React packages as a preparatory step for upgrading to React 19. This commit does not introduce any functional changes, but removes dependencies on previous React versions, allowing for a cleaner upgrade path in subsequent commits.
- Updated dependencies
  - @backstage/core-components@0.16.4-next.0
  - @backstage/frontend-plugin-api@0.9.5-next.1
  - @backstage/integration-react@1.2.4-next.0
  - @backstage/core-plugin-api@1.10.4-next.0
  - @backstage/plugin-permission-react@0.4.31-next.0
  - @backstage/theme@0.6.4-next.0

## 0.1.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.9.5-next.0
  - @backstage/core-components@0.16.3
  - @backstage/core-plugin-api@1.10.3
  - @backstage/integration-react@1.2.3
  - @backstage/theme@0.6.3
  - @backstage/plugin-permission-react@0.4.30

## 0.1.5

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.9.4
  - @backstage/core-plugin-api@1.10.3
  - @backstage/core-components@0.16.3
  - @backstage/integration-react@1.2.3
  - @backstage/theme@0.6.3
  - @backstage/plugin-permission-react@0.4.30

## 0.1.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.9.4-next.0
  - @backstage/core-plugin-api@1.10.3-next.0
  - @backstage/core-components@0.16.3-next.0
  - @backstage/integration-react@1.2.3-next.0
  - @backstage/plugin-permission-react@0.4.30-next.0
  - @backstage/theme@0.6.3

## 0.1.4

### Patch Changes

- e5fa018: The OAuth 2 client implementations will now attempt to refresh the session when the existing session doesn't have the required scopes. The previous behavior was to only try to refresh the session of it was missing, and otherwise directly request a new session. This fixes an issue where some auth providers will not return access tokens with certain scopes unless explicitly requested, leading to an auth popup even if the underlying session already had been granted the requested scopes.
- 5f04976: Fixed a bug that caused missing code in published packages.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.9.3
  - @backstage/theme@0.6.3
  - @backstage/core-components@0.16.2
  - @backstage/core-plugin-api@1.10.2
  - @backstage/integration-react@1.2.2
  - @backstage/plugin-permission-react@0.4.29

## 0.1.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.16.2-next.2
  - @backstage/core-plugin-api@1.10.2-next.0
  - @backstage/frontend-plugin-api@0.9.3-next.2
  - @backstage/integration-react@1.2.2-next.1
  - @backstage/theme@0.6.3-next.0
  - @backstage/plugin-permission-react@0.4.29-next.0

## 0.1.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.16.2-next.1
  - @backstage/core-plugin-api@1.10.1
  - @backstage/frontend-plugin-api@0.9.3-next.1
  - @backstage/integration-react@1.2.2-next.0
  - @backstage/theme@0.6.3-next.0
  - @backstage/plugin-permission-react@0.4.28

## 0.1.4-next.0

### Patch Changes

- e5fa018: The OAuth 2 client implementations will now attempt to refresh the session when the existing session doesn't have the required scopes. The previous behavior was to only try to refresh the session of it was missing, and otherwise directly request a new session. This fixes an issue where some auth providers will not return access tokens with certain scopes unless explicitly requested, leading to an auth popup even if the underlying session already had been granted the requested scopes.
- 5f04976: Fixed a bug that caused missing code in published packages.
- Updated dependencies
  - @backstage/frontend-plugin-api@0.9.3-next.0
  - @backstage/theme@0.6.3-next.0
  - @backstage/core-components@0.16.2-next.0
  - @backstage/core-plugin-api@1.10.1
  - @backstage/integration-react@1.2.2-next.0
  - @backstage/plugin-permission-react@0.4.28

## 0.1.2

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.6.1
  - @backstage/core-components@0.16.0
  - @backstage/core-plugin-api@1.10.1
  - @backstage/frontend-plugin-api@0.9.1
  - @backstage/integration-react@1.2.1
  - @backstage/plugin-permission-react@0.4.28

## 0.1.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.16.0-next.2
  - @backstage/core-plugin-api@1.10.0
  - @backstage/frontend-plugin-api@0.9.1-next.2
  - @backstage/integration-react@1.2.0
  - @backstage/theme@0.6.1-next.0
  - @backstage/plugin-permission-react@0.4.27

## 0.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.6.1-next.0
  - @backstage/core-components@0.16.0-next.1
  - @backstage/core-plugin-api@1.10.0
  - @backstage/frontend-plugin-api@0.9.1-next.1
  - @backstage/integration-react@1.2.0
  - @backstage/plugin-permission-react@0.4.27

## 0.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.16.0-next.0
  - @backstage/core-plugin-api@1.10.0
  - @backstage/frontend-plugin-api@0.9.1-next.0
  - @backstage/integration-react@1.2.0
  - @backstage/theme@0.6.0
  - @backstage/plugin-permission-react@0.4.27

## 0.1.1

### Patch Changes

- b36be7a: Added missing default `SignInPageExtension` which by default uses guest auth, missing `ApiExtensions` for `scmAuth`
- Updated dependencies
  - @backstage/core-components@0.15.1
  - @backstage/frontend-plugin-api@0.9.0
  - @backstage/integration-react@1.2.0
  - @backstage/core-plugin-api@1.10.0
  - @backstage/plugin-permission-react@0.4.27
  - @backstage/theme@0.6.0

## 0.1.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.6.0-next.1
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/frontend-plugin-api@0.9.0-next.2
  - @backstage/plugin-permission-react@0.4.27-next.1

## 0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.15.1-next.1
  - @backstage/frontend-plugin-api@0.9.0-next.1
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/plugin-permission-react@0.4.27-next.1
  - @backstage/theme@0.5.8-next.0

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.9.0-next.0
  - @backstage/core-components@0.15.1-next.0
  - @backstage/core-plugin-api@1.10.0-next.0
  - @backstage/theme@0.5.7
  - @backstage/plugin-permission-react@0.4.27-next.0

## 0.1.0

### Minor Changes

- 2bb9517: Introduce the `@backstage/plugin-app` package to hold all of the built-in extensions for easy consumption and overriding.

### Patch Changes

- 52f9c5a: Deprecated the `namespace` option for `createExtensionBlueprint` and `createExtension`, these are no longer required and will default to the `pluginId` instead.

  You can migrate some of your extensions that use `createExtensionOverrides` to using `createFrontendModule` instead and providing a `pluginId` there.

  ```ts
  // Before
  createExtensionOverrides({
    extensions: [
      createExtension({
        name: 'my-extension',
        namespace: 'my-namespace',
        kind: 'test',
        ...
      })
    ],
  });

  // After
  createFrontendModule({
    pluginId: 'my-namespace',
    extensions: [
      createExtension({
        name: 'my-extension',
        kind: 'test',
        ...
      })
    ],
  });
  ```

- 57bf6ae: Fix issue with `AlertDisplay` and other components defined with `AppRootElementBlueprint` not being rendered when at the `SignInWrapper`
- 836127c: Updated dependency `@testing-library/react` to `^16.0.0`.
- Updated dependencies
  - @backstage/core-components@0.15.0
  - @backstage/frontend-plugin-api@0.8.0
  - @backstage/core-plugin-api@1.9.4
  - @backstage/theme@0.5.7
  - @backstage/plugin-permission-react@0.4.26

## 0.1.0-next.2

### Patch Changes

- 57bf6ae: Fix issue with `AlertDisplay` and other components defined with `AppRootElementBlueprint` not being rendered when at the `SignInWrapper`
- 836127c: Updated dependency `@testing-library/react` to `^16.0.0`.
- Updated dependencies
  - @backstage/core-components@0.14.11-next.1
  - @backstage/core-plugin-api@1.9.4-next.0
  - @backstage/frontend-plugin-api@0.8.0-next.2
  - @backstage/theme@0.5.7-next.0
  - @backstage/plugin-permission-react@0.4.26-next.0

## 0.1.0-next.1

### Patch Changes

- 52f9c5a: Deprecated the `namespace` option for `createExtensionBlueprint` and `createExtension`, these are no longer required and will default to the `pluginId` instead.

  You can migrate some of your extensions that use `createExtensionOverrides` to using `createFrontendModule` instead and providing a `pluginId` there.

  ```ts
  // Before
  createExtensionOverrides({
    extensions: [
      createExtension({
        name: 'my-extension',
        namespace: 'my-namespace',
        kind: 'test',
        ...
      })
    ],
  });

  // After
  createFrontendModule({
    pluginId: 'my-namespace',
    extensions: [
      createExtension({
        name: 'my-extension',
        kind: 'test',
        ...
      })
    ],
  });
  ```

- Updated dependencies
  - @backstage/frontend-plugin-api@0.8.0-next.1
  - @backstage/core-components@0.14.11-next.0
  - @backstage/core-plugin-api@1.9.3
  - @backstage/theme@0.5.6
  - @backstage/plugin-permission-react@0.4.25

## 0.1.0-next.0

### Minor Changes

- 2bb9517: Introduce the `@backstage/plugin-app` package to hold all of the built-in extensions for easy consumption and overriding.

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.8.0-next.0
  - @backstage/core-components@0.14.10
  - @backstage/core-plugin-api@1.9.3
  - @backstage/theme@0.5.6
  - @backstage/plugin-permission-react@0.4.25
