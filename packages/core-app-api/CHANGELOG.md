# @backstage/core-app-api

## 1.16.0

### Minor Changes

- 9262001: The default auth injection middleware for the `FetchApi` will now also take configuration under `discovery.endpoints` into consideration when deciding whether to include credentials or not.
- 12f8e01: The `discovery.endpoints` configuration no longer requires both `internal` and `external` target when using the object form, instead falling back to the default.

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.10.5
  - @backstage/config@1.3.2
  - @backstage/types@1.2.1
  - @backstage/version-bridge@1.0.11

## 1.16.0-next.0

### Minor Changes

- 9262001: The default auth injection middleware for the `FetchApi` will now also take configuration under `discovery.endpoints` into consideration when deciding whether to include credentials or not.
- 12f8e01: The `discovery.endpoints` configuration no longer requires both `internal` and `external` target when using the object form, instead falling back to the default.

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.2
  - @backstage/core-plugin-api@1.10.4
  - @backstage/types@1.2.1
  - @backstage/version-bridge@1.0.11

## 1.15.5

### Patch Changes

- 58ec9e7: Removed older versions of React packages as a preparatory step for upgrading to React 19. This commit does not introduce any functional changes, but removes dependencies on previous React versions, allowing for a cleaner upgrade path in subsequent commits.
- Updated dependencies
  - @backstage/core-plugin-api@1.10.4
  - @backstage/version-bridge@1.0.11
  - @backstage/config@1.3.2
  - @backstage/types@1.2.1

## 1.15.5-next.0

### Patch Changes

- 58ec9e7: Removed older versions of React packages as a preparatory step for upgrading to React 19. This commit does not introduce any functional changes, but removes dependencies on previous React versions, allowing for a cleaner upgrade path in subsequent commits.
- Updated dependencies
  - @backstage/core-plugin-api@1.10.4-next.0
  - @backstage/version-bridge@1.0.11-next.0
  - @backstage/config@1.3.2
  - @backstage/types@1.2.1

## 1.15.4

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.10.3
  - @backstage/types@1.2.1
  - @backstage/config@1.3.2
  - @backstage/version-bridge@1.0.10

## 1.15.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.10.3-next.0
  - @backstage/types@1.2.1-next.0
  - @backstage/config@1.3.2-next.0
  - @backstage/version-bridge@1.0.10

## 1.15.3

### Patch Changes

- e5fa018: The OAuth 2 client implementations will now attempt to refresh the session when the existing session doesn't have the required scopes. The previous behavior was to only try to refresh the session of it was missing, and otherwise directly request a new session. This fixes an issue where some auth providers will not return access tokens with certain scopes unless explicitly requested, leading to an auth popup even if the underlying session already had been granted the requested scopes.
- 2830689: Decrease OAuth2 token refresh grace period
- Updated dependencies
  - @backstage/config@1.3.1
  - @backstage/core-plugin-api@1.10.2
  - @backstage/types@1.2.0
  - @backstage/version-bridge@1.0.10

## 1.15.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.3.1-next.0
  - @backstage/core-plugin-api@1.10.2-next.0
  - @backstage/types@1.2.0
  - @backstage/version-bridge@1.0.10

## 1.15.3-next.0

### Patch Changes

- e5fa018: The OAuth 2 client implementations will now attempt to refresh the session when the existing session doesn't have the required scopes. The previous behavior was to only try to refresh the session of it was missing, and otherwise directly request a new session. This fixes an issue where some auth providers will not return access tokens with certain scopes unless explicitly requested, leading to an auth popup even if the underlying session already had been granted the requested scopes.
- 2830689: Decrease OAuth2 token refresh grace period
- Updated dependencies
  - @backstage/config@1.3.0
  - @backstage/core-plugin-api@1.10.1
  - @backstage/types@1.2.0
  - @backstage/version-bridge@1.0.10

## 1.15.2

### Patch Changes

- 44b82da: The default config loader no longer requires `process.env.APP_CONFIG` to be set, allowing config to be read from other sources instead.
- Updated dependencies
  - @backstage/config@1.3.0
  - @backstage/types@1.2.0
  - @backstage/core-plugin-api@1.10.1
  - @backstage/version-bridge@1.0.10

## 1.15.1

### Patch Changes

- e969dc7: Move `@types/react` to a peer dependency.
- Updated dependencies
  - @backstage/core-plugin-api@1.10.0
  - @backstage/version-bridge@1.0.10
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 1.15.1-next.1

### Patch Changes

- e969dc7: Move `@types/react` to a peer dependency.
- Updated dependencies
  - @backstage/core-plugin-api@1.10.0-next.1
  - @backstage/version-bridge@1.0.10-next.0
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 1.15.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.10.0-next.0
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.9

## 1.15.0

### Minor Changes

- ddbeace: Added the ability to explicitly disable routes through the `bindRoutes` option by passing `false` as the route target. This also fixes a bug where route bindings in config were incorrectly prioritized above the ones in code in certain situations.

### Patch Changes

- ea69e46: The `defaultConfigLoader` now also reads configuration from scripts tags with `type="backstage.io/config"`. The tag is expected to contain a JSON-serialized array of `AppConfig` objects. If any of these script tags are present, the injected runtime configuration in the static assets will no longer be used.
- b537bd7: Allow custom star icons to be provided via the `star` and `unstarred` icon overrides. See how to override existing icons in the [Backstage documentation](https://backstage.io/docs/getting-started/app-custom-theme/#custom-icons).
- 836127c: Updated dependency `@testing-library/react` to `^16.0.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.9.4
  - @backstage/version-bridge@1.0.9
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 1.14.3-next.0

### Patch Changes

- ea69e46: The `defaultConfigLoader` now also reads configuration from scripts tags with `type="backstage.io/config"`. The tag is expected to contain a JSON-serialized array of `AppConfig` objects. If any of these script tags are present, the injected runtime configuration in the static assets will no longer be used.
- b537bd7: Allow custom star icons to be provided via the `star` and `unstarred` icon overrides. See how to override existing icons in the [Backstage documentation](https://backstage.io/docs/getting-started/app-custom-theme/#custom-icons).
- 836127c: Updated dependency `@testing-library/react` to `^16.0.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.9.4-next.0
  - @backstage/version-bridge@1.0.9-next.0
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 1.14.2

### Patch Changes

- 9a46a81: The request to delete the session cookie when running the app in protected mode is now done with a plain `fetch` rather than `FetchApi`. This fixes a bug where the app would immediately try to sign-in again when removing the cookie during logout.
- Updated dependencies
  - @backstage/config@1.2.0
  - @backstage/core-plugin-api@1.9.3
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.8

## 1.14.1-next.0

### Patch Changes

- 9a46a81: The request to delete the session cookie when running the app in protected mode is now done with a plain `fetch` rather than `FetchApi`. This fixes a bug where the app would immediately try to sign-in again when removing the cookie during logout.
- Updated dependencies
  - @backstage/config@1.2.0
  - @backstage/core-plugin-api@1.9.3
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.8

## 1.14.0

### Minor Changes

- d3c39fc: Allow for the disabling of external routes through config, which was rendered impossible after the introduction of default targets.

  ```yaml
  app:
    routes:
      bindings:
        # This has the effect of removing the button for registering new
        # catalog entities in the scaffolder template list view
        scaffolder.registerComponent: false
  ```

### Patch Changes

- db2e2d5: Updated config schema to support app.routes.bindings
- Updated dependencies
  - @backstage/config@1.2.0
  - @backstage/core-plugin-api@1.9.3
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.8

## 1.13.1-next.1

### Patch Changes

- db2e2d5: Updated config schema to support app.routes.bindings
- Updated dependencies
  - @backstage/core-plugin-api@1.9.3
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.8

## 1.13.0-next.0

### Minor Changes

- d3c39fc: Allow for the disabling of external routes through config, which was rendered impossible after the introduction of default targets.

  ```yaml
  app:
    routes:
      bindings:
        # This has the effect of removing the button for registering new
        # catalog entities in the scaffolder template list view
        scaffolder.registerComponent: false
  ```

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.9.3
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.8

## 1.12.6

### Patch Changes

- 35fbe09: Added support for configuration of route bindings through static configuration, and default targets for external route refs.

  In addition to configuring route bindings through code, it is now also possible to configure route bindings under the `app.routes.bindings` key, for example:

  ```yaml
  app:
    routes:
      bindings:
        catalog.createComponent: catalog-import.importPage
  ```

  Each key in the route binding object is of the form `<plugin-id>.<externalRouteName>`, where the route name is key used in the `externalRoutes` object passed to `createPlugin`. The value is of the same form, but with the name taken from the plugin `routes` option instead.

  The equivalent of the above configuration in code is the following:

  ```ts
  const app = createApp({
    // ...
    bindRoutes({ bind }) {
      bind(catalogPlugin.externalRoutes, {
        createComponent: catalogImportPlugin.routes.importPage,
      });
    },
  });
  ```

- Updated dependencies
  - @backstage/core-plugin-api@1.9.3
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.8

## 1.12.6-next.0

### Patch Changes

- 35fbe09: Added support for configuration of route bindings through static configuration, and default targets for external route refs.

  In addition to configuring route bindings through code, it is now also possible to configure route bindings under the `app.routes.bindings` key, for example:

  ```yaml
  app:
    routes:
      bindings:
        catalog.createComponent: catalog-import.importPage
  ```

  Each key in the route binding object is of the form `<plugin-id>.<externalRouteName>`, where the route name is key used in the `externalRoutes` object passed to `createPlugin`. The value is of the same form, but with the name taken from the plugin `routes` option instead.

  The equivalent of the above configuration in code is the following:

  ```ts
  const app = createApp({
    // ...
    bindRoutes({ bind }) {
      bind(catalogPlugin.externalRoutes, {
        createComponent: catalogImportPlugin.routes.importPage,
      });
    },
  });
  ```

- Updated dependencies
  - @backstage/core-plugin-api@1.9.3-next.0
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.8

## 1.12.5

### Patch Changes

- 1bed9a3: The Backstage identity session expiration check will no longer fall back to using the provider expiration. This was introduced to smooth out the rollout of Backstage release 1.18, and is no longer needed.

## 1.12.4

### Patch Changes

- c884b9a: The app is now aware of if it is being served from the `app-backend` with a separate public and protected bundles. When in protected mode the app will now continuously refresh the session cookie, as well as clear the cookie if the user signs out.
- abfbcfc: Updated dependency `@testing-library/react` to `^15.0.0`.
- cb1e3b0: Updated dependency `@testing-library/dom` to `^10.0.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.9.2
  - @backstage/version-bridge@1.0.8
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1

## 1.12.4-next.0

### Patch Changes

- c884b9a: The app is now aware of if it is being served from the `app-backend` with a separate public and protected bundles. When in protected mode the app will now continuously refresh the session cookie, as well as clear the cookie if the user signs out.
- Updated dependencies
  - @backstage/config@1.2.0
  - @backstage/core-plugin-api@1.9.1
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 1.12.3

### Patch Changes

- e8f026a: Use ESM exports of react-use library
- Updated dependencies
  - @backstage/core-plugin-api@1.9.1
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 1.12.2

### Patch Changes

- e8f026a: Use ESM exports of react-use library
- Updated dependencies
  - @backstage/core-plugin-api@1.9.1
  - @backstage/config@1.2.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 1.12.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0
  - @backstage/core-plugin-api@1.9.1
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 1.12.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/core-plugin-api@1.9.1-next.1
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 1.12.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.2-next.0
  - @backstage/core-plugin-api@1.9.1-next.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 1.12.0

### Minor Changes

- f919be9: Added a utility API for VMware Cloud auth; the API ref is available in the
  `@backstage/core-plugin-api` and `@backstage/frontend-plugin-api` packages, the
  implementation is in `@backstage/core-app-api` and a factory has been added to
  `@backstage/app-defaults`.

### Patch Changes

- 9aac2b0: Use `--cwd` as the first `yarn` argument
- 8fe56a8: Widen `@types/react` dependency range to include version 18.
- 7da67ce: Change `defaultScopes` for Bitbucket auth from invalid `team` to `account`.
- Updated dependencies
  - @backstage/core-plugin-api@1.9.0
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 1.12.0-next.1

### Minor Changes

- f919be9: Added a utility API for VMware Cloud auth; the API ref is available in the
  `@backstage/core-plugin-api` and `@backstage/frontend-plugin-api` packages, the
  implementation is in `@backstage/core-app-api` and a factory has been added to
  `@backstage/app-defaults`.

### Patch Changes

- 9aac2b0: Use `--cwd` as the first `yarn` argument
- 8fe56a8: Widen `@types/react` dependency range to include version 18.
- Updated dependencies
  - @backstage/core-plugin-api@1.9.0-next.1
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 1.11.4-next.0

### Patch Changes

- 7da67ce: Change `defaultScopes` for Bitbucket auth from invalid `team` to `account`.
- Updated dependencies
  - @backstage/core-plugin-api@1.8.3-next.0
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 1.11.3

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.8.2
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 1.11.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.8.2-next.0
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 1.11.2

### Patch Changes

- 3e358b0: Added deprecation warning for React Router v6 beta, please make sure you have migrated your apps to use React Router v6 stable as support for the beta version will be removed. See the [migration tutorial](https://backstage.io/docs/tutorials/react-router-stable-migration) for more information.
- 0cbb03b: Fixing regular expression ReDoS with zod packages. Upgrading to latest. ref: https://security.snyk.io/vuln/SNYK-JS-ZOD-5925617
- Updated dependencies
  - @backstage/core-plugin-api@1.8.1
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 1.11.2-next.1

### Patch Changes

- 3e358b0dff: Added deprecation warning for React Router v6 beta, please make sure you have migrated your apps to use React Router v6 stable as support for the beta version will be removed. See the [migration tutorial](https://backstage.io/docs/tutorials/react-router-stable-migration) for more information.
- Updated dependencies
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 1.11.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.8.1-next.0
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 1.11.1

### Patch Changes

- 6c2b872153: Add official support for React 18.
- 89d13e5618: Add current and default scopes when refreshing session
- 9ab0572217: Add component data `core.type` marker for `AppRouter` and `FlatRoutes`.
- Updated dependencies
  - @backstage/core-plugin-api@1.8.0
  - @backstage/version-bridge@1.0.7
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## 1.11.1-next.0

### Patch Changes

- 6c2b872153: Add official support for React 18.
- 89d13e5618: Add current and default scopes when refreshing session
- 9ab0572217: Add component data `core.type` marker for `AppRouter` and `FlatRoutes`.
- Updated dependencies
  - @backstage/core-plugin-api@1.8.0-next.0
  - @backstage/version-bridge@1.0.7-next.0
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## 1.11.0

### Minor Changes

- c9d9bfeca2: URL encode some well known unsafe characters in `RouteResolver` (and therefore `useRouteRef`)

### Patch Changes

- 29e4d8b76b: Fixed bug in `AppRouter` to determine the correct `signOutTargetUrl` if `app.baseUrl` contains a `basePath`
- acca17e91a: Wrap entire app in `<Suspense>`, enabling support for using translations outside plugins.
- 1a0616fa10: Add missing resource and template app icons
- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- f1b349cfba: Fixed a bug in `TranslationApi` implementation where in some cases it wouldn't notify subscribers of language changes.
- Updated dependencies
  - @backstage/core-plugin-api@1.7.0
  - @backstage/version-bridge@1.0.6
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## 1.11.0-next.2

### Minor Changes

- c9d9bfeca2: URL encode some well known unsafe characters in `RouteResolver` (and therefore `useRouteRef`)

### Patch Changes

- acca17e91a: Wrap entire app in `<Suspense>`, enabling support for using translations outside plugins.
- Updated dependencies
  - @backstage/core-plugin-api@1.7.0-next.1
  - @backstage/config@1.1.1-next.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.5

## 1.10.1-next.1

### Patch Changes

- 1a0616fa10: Add missing resource and template app icons
- Updated dependencies
  - @backstage/core-plugin-api@1.7.0-next.0
  - @backstage/config@1.1.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.5

## 1.10.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.7.0-next.0
  - @backstage/config@1.1.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.5

## 1.10.0

### Minor Changes

- 18619f793c94: Fixed two bugs in how the `OAuth2Session` type represents the underlying data. The `expiresAt` and `backstageIdentity` are now both optional, since that's what they are in practice. This is not considered a breaking change since it was effectively a bug in the modelling of the state that this type represents, and the type was not used in any other external contract.
- 18619f793c94: The `OAuth` class which is used by all OAuth providers will now consider both the session expiration of both the Backstage identity as well as the upstream identity provider, and refresh the session with either of them is about to expire.
- 6e30769cc627: Introduced experimental support for internationalization.

### Patch Changes

- 406b786a2a2c: Mark package as being free of side effects, allowing more optimized Webpack builds.
- 9fe827b380e1: Internal refactor
- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/config@1.1.0
  - @backstage/core-plugin-api@1.6.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.5

## 1.10.0-next.3

### Patch Changes

- 406b786a2a2c: Mark package as being free of side effects, allowing more optimized Webpack builds.
- 9fe827b380e1: Internal refactor
- Updated dependencies
  - @backstage/config@1.1.0-next.2
  - @backstage/core-plugin-api@1.6.0-next.3
  - @backstage/types@1.1.1-next.0
  - @backstage/version-bridge@1.0.5-next.0

## 1.10.0-next.2

### Minor Changes

- 6e30769cc627: Introduced experimental support for internationalization.

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/types@1.1.0
  - @backstage/version-bridge@1.0.4

## 1.10.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.0
  - @backstage/core-plugin-api@1.6.0-next.1
  - @backstage/types@1.1.0
  - @backstage/version-bridge@1.0.4

## 1.10.0-next.0

### Minor Changes

- 18619f793c94: Fixed two bugs in how the `OAuth2Session` type represents the underlying data. The `expiresAt` and `backstageIdentity` are now both optional, since that's what they are in practice. This is not considered a breaking change since it was effectively a bug in the modelling of the state that this type represents, and the type was not used in any other external contract.
- 18619f793c94: The `OAuth` class which is used by all OAuth providers will now consider both the session expiration of both the Backstage identity as well as the upstream identity provider, and refresh the session with either of them is about to expire.

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.6.0-next.0
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0
  - @backstage/version-bridge@1.0.4

## 1.9.1

### Patch Changes

- 9ae4e7e63836: Fixed a bug that could cause `navigate` analytics events to be misattributed to the plugin mounted on the root route (e.g. the `home` plugin at `/`) when the route that was navigated to wasn't associated with a routable extension.
- Updated dependencies
  - @backstage/core-plugin-api@1.5.3
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0
  - @backstage/version-bridge@1.0.4

## 1.9.1-next.0

### Patch Changes

- 9ae4e7e63836: Fixed a bug that could cause `navigate` analytics events to be misattributed to the plugin mounted on the root route (e.g. the `home` plugin at `/`) when the route that was navigated to wasn't associated with a routable extension.
- Updated dependencies
  - @backstage/core-plugin-api@1.5.3
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0
  - @backstage/version-bridge@1.0.4

## 1.9.0

### Minor Changes

- a77ddf7ccd71: add login in popup options to config popup width and height

### Patch Changes

- 8174cf4c0edf: Fixing MUI / Material UI references
- Updated dependencies
  - @backstage/core-plugin-api@1.5.3
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0
  - @backstage/version-bridge@1.0.4

## 1.8.2-next.1

### Patch Changes

- 8174cf4c0edf: Fixing MUI / Material UI references
- Updated dependencies
  - @backstage/core-plugin-api@1.5.3-next.1
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0
  - @backstage/version-bridge@1.0.4

## 1.8.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.5.3-next.0
  - @backstage/config@1.0.8

## 1.8.1

### Patch Changes

- 12adfbc8fe2d: Fixed a bug that prevented accurate plugin and route data from being applied to `navigate` analytics events when users visited pages constructed with `<EntityLayout>`, `<TabbedLayout>`, and similar components that are used to gather one or more routable extensions under a given path.
- ac677bc30ae0: Expose discovery.endpoints configuration to use FrontendHostDiscovery
- 74b216ee4e50: Add `PropsWithChildren` to usages of `ComponentType`, in preparation for React 18 where the children are no longer implicit.
- Updated dependencies
  - @backstage/core-plugin-api@1.5.2
  - @backstage/types@1.1.0
  - @backstage/config@1.0.8
  - @backstage/version-bridge@1.0.4

## 1.8.1-next.0

### Patch Changes

- 74b216ee4e50: Add `PropsWithChildren` to usages of `ComponentType`, in preparation for React 18 where the children are no longer implicit.
- Updated dependencies
  - @backstage/core-plugin-api@1.5.2-next.0
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.4

## 1.8.0

### Minor Changes

- c89437db899: The analytics' `navigate` event will now include the route parameters as attributes of the navigate event

### Patch Changes

- b645d70034a: Fixed a bug in the Azure auth provider which prevented getting access tokens with multiple scopes for one resource
- 42d817e76ab: Added `FrontendHostDiscovery` for config driven discovery implementation
- Updated dependencies
  - @backstage/config@1.0.7
  - @backstage/core-plugin-api@1.5.1
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.4

## 1.8.0-next.1

### Minor Changes

- c89437db899: The analytics' `navigate` event will now include the route parameters as attributes of the navigate event

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.5.1
  - @backstage/config@1.0.7

## 1.7.1-next.0

### Patch Changes

- 42d817e76ab: Added `FrontendHostDiscovery` for config driven discovery implementation
- Updated dependencies
  - @backstage/core-plugin-api@1.5.1
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.4

## 1.7.0

### Minor Changes

- 7908d72e033: Introduce a new global config parameter, `enableExperimentalRedirectFlow`. When enabled, auth will happen with an in-window redirect flow rather than through a popup window.
- c15e0cedbe1: The `AuthConnector` interface now supports specifying a set of scopes when
  refreshing a session. The `DefaultAuthConnector` implementation passes the
  `scope` query parameter to the auth-backend plugin appropriately. The
  `RefreshingAuthSessionManager` passes any scopes in its `GetSessionRequest`
  appropriately.

### Patch Changes

- 1e4f5e91b8e: Bump `zod` and `zod-to-json-schema` dependencies.
- e0c6e8b9c3c: Update peer dependencies
- Updated dependencies
  - @backstage/core-plugin-api@1.5.1
  - @backstage/version-bridge@1.0.4
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 1.7.0-next.3

### Minor Changes

- c15e0cedbe1: The `AuthConnector` interface now supports specifying a set of scopes when
  refreshing a session. The `DefaultAuthConnector` implementation passes the
  `scope` query parameter to the auth-backend plugin appropriately. The
  `RefreshingAuthSessionManager` passes any scopes in its `GetSessionRequest`
  appropriately.

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.7
  - @backstage/core-plugin-api@1.5.1-next.1
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.4-next.0

## 1.7.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.5.1-next.1
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.4-next.0

## 1.7.0-next.1

### Patch Changes

- 1e4f5e91b8e: Bump `zod` and `zod-to-json-schema` dependencies.
- e0c6e8b9c3c: Update peer dependencies
- Updated dependencies
  - @backstage/core-plugin-api@1.5.1-next.0
  - @backstage/version-bridge@1.0.4-next.0
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 1.7.0-next.0

### Minor Changes

- 7908d72e033: Introduce a new global config parameter, `enableExperimentalRedirectFlow`. When enabled, auth will happen with an in-window redirect flow rather than through a popup window.

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.5.0
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.3

## 1.6.0

### Minor Changes

- 456eaa8cf83: `OAuth2` now gets ID tokens from a session with the `openid` scope explicitly
  requested.

  This should not be considered a breaking change, because spec-compliant OIDC
  providers will already be returning ID tokens if and only if the `openid` scope
  is granted.

  This change makes the dependence explicit, and removes the burden on
  OAuth2-based providers which require an ID token (e.g. this is done by various
  default [auth handlers](https://backstage.io/docs/auth/identity-resolver/#authhandler)) to add
  `openid` to their default scopes. _That_ could carry another indirect benefit:
  by removing `openid` from the default scopes for a provider, grants for
  resource-specific access tokens can avoid requesting excess ID token-related
  scopes.

### Patch Changes

- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.5.0
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.3

## 1.6.0-next.2

### Minor Changes

- 456eaa8cf83: `OAuth2` now gets ID tokens from a session with the `openid` scope explicitly
  requested.

  This should not be considered a breaking change, because spec-compliant OIDC
  providers will already be returning ID tokens if and only if the `openid` scope
  is granted.

  This change makes the dependence explicit, and removes the burden on
  OAuth2-based providers which require an ID token (e.g. this is done by various
  default [auth handlers](https://backstage.io/docs/auth/identity-resolver/#authhandler)) to add
  `openid` to their default scopes. _That_ could carry another indirect benefit:
  by removing `openid` from the default scopes for a provider, grants for
  resource-specific access tokens can avoid requesting excess ID token-related
  scopes.

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.5.0-next.2
  - @backstage/config@1.0.7-next.0

## 1.5.1-next.1

### Patch Changes

- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.4.1-next.1
  - @backstage/config@1.0.7-next.0
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.3

## 1.5.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.4.1-next.0
  - @backstage/config@1.0.6
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.3

## 1.5.0

### Minor Changes

- db10b6ef65: Added a Bitbucket Server Auth Provider and added its API to the app defaults

### Patch Changes

- dff4d8ddb1: Fixed an issue where an explicit port the frontend base URL could break the app.
- Updated dependencies
  - @backstage/core-plugin-api@1.4.0
  - @backstage/config@1.0.6
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.3

## 1.4.1-next.0

### Patch Changes

- dff4d8ddb1: Fixed an issue where an explicit port the frontend base URL could break the app.
- Updated dependencies
  - @backstage/config@1.0.6
  - @backstage/core-plugin-api@1.3.0
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.3

## 1.4.0

### Minor Changes

- bca8e8b393: Allow defining application level feature flags. See [Feature Flags documentation](https://backstage.io/docs/plugins/feature-flags#in-the-application) for reference.

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.3.0
  - @backstage/config@1.0.6
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.3

## 1.4.0-next.1

### Minor Changes

- bca8e8b393: Allow defining application level feature flags. See [Feature Flags documentation](https://backstage.io/docs/plugins/feature-flags#in-the-application) for reference.

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.3.0-next.1
  - @backstage/config@1.0.6-next.0
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.3

## 1.3.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6-next.0
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.3

## 1.3.0

### Minor Changes

- e0d9c9559a: Added a new `AppRouter` component and `app.createRoot()` method that replaces `app.getRouter()` and `app.getProvider()`, which are now deprecated. The new `AppRouter` component is a drop-in replacement for the old router component, while the new `app.createRoot()` method is used instead of the old provider component.

  An old app setup might look like this:

  ```tsx
  const app = createApp(/* ... */);

  const AppProvider = app.getProvider();
  const AppRouter = app.getRouter();

  const routes = ...;

  const App = () => (
    <AppProvider>
      <AlertDisplay />
      <OAuthRequestDialog />
      <AppRouter>
        <Root>{routes}</Root>
      </AppRouter>
    </AppProvider>
  );

  export default App;
  ```

  With these new APIs, the setup now looks like this:

  ```tsx
  import { AppRouter } from '@backstage/core-app-api';

  const app = createApp(/* ... */);

  const routes = ...;

  export default app.createRoot(
    <>
      <AlertDisplay />
      <OAuthRequestDialog />
      <AppRouter>
        <Root>{routes}</Root>
      </AppRouter>
    </>,
  );
  ```

  Note that `app.createRoot()` accepts a React element, rather than a component.

### Patch Changes

- d3fea4ae0a: Internal fixes to avoid implicit usage of globals
- b05dcd5530: Move the `zod` dependency to a version that does not collide with other libraries
- b4b5b02315: Tweak feature flag registration so that it happens immediately before the first rendering of the app, rather than just after.
- 6870b43dd1: Fix for the automatic rewriting of base URLs.
- 203271b746: Prevent duplicate feature flag components from rendering in the settings when using <FeatureFlagged /> components
- 3280711113: Updated dependency `msw` to `^0.49.0`.
- 19356df560: Updated dependency `zen-observable` to `^0.9.0`.
- c3fa90e184: Updated dependency `zen-observable` to `^0.10.0`.
- 8015ff1258: Tweaked wording to use inclusive terminology
- 653d7912ac: Made `WebStorage` notify its subscribers when `localStorage` values change in other tabs/windows
- 63310e3987: Apps will now rewrite the `app.baseUrl` configuration to match the current `location.origin`. The `backend.baseUrl` will also be rewritten in the same way when the `app.baseUrl` and `backend.baseUrl` have matching origins. This will reduce the need for separate frontend builds for different environments.
- Updated dependencies
  - @backstage/core-plugin-api@1.2.0
  - @backstage/version-bridge@1.0.3
  - @backstage/types@1.0.2
  - @backstage/config@1.0.5

## 1.3.0-next.4

### Minor Changes

- e0d9c9559a: Added a new `AppRouter` component and `app.createRoot()` method that replaces `app.getRouter()` and `app.getProvider()`, which are now deprecated. The new `AppRouter` component is a drop-in replacement for the old router component, while the new `app.createRoot()` method is used instead of the old provider component.

  An old app setup might look like this:

  ```tsx
  const app = createApp(/* ... */);

  const AppProvider = app.getProvider();
  const AppRouter = app.getRouter();

  const routes = ...;

  const App = () => (
    <AppProvider>
      <AlertDisplay />
      <OAuthRequestDialog />
      <AppRouter>
        <Root>{routes}</Root>
      </AppRouter>
    </AppProvider>
  );

  export default App;
  ```

  With these new APIs, the setup now looks like this:

  ```tsx
  import { AppRouter } from '@backstage/core-app-api';

  const app = createApp(/* ... */);

  const routes = ...;

  export default app.createRoot(
    <>
      <AlertDisplay />
      <OAuthRequestDialog />
      <AppRouter>
        <Root>{routes}</Root>
      </AppRouter>
    </>,
  );
  ```

  Note that `app.createRoot()` accepts a React element, rather than a component.

### Patch Changes

- b05dcd5530: Move the `zod` dependency to a version that does not collide with other libraries
- Updated dependencies
  - @backstage/config@1.0.5-next.1
  - @backstage/core-plugin-api@1.2.0-next.2
  - @backstage/types@1.0.2-next.1
  - @backstage/version-bridge@1.0.3-next.0

## 1.2.1-next.3

### Patch Changes

- 6870b43dd1: Fix for the automatic rewriting of base URLs.
- 653d7912ac: Made `WebStorage` notify its subscribers when `localStorage` values change in other tabs/windows
- Updated dependencies
  - @backstage/config@1.0.5-next.1
  - @backstage/core-plugin-api@1.2.0-next.2
  - @backstage/types@1.0.2-next.1
  - @backstage/version-bridge@1.0.3-next.0

## 1.2.1-next.2

### Patch Changes

- b4b5b02315: Tweak feature flag registration so that it happens immediately before the first rendering of the app, rather than just after.
- 203271b746: Prevent duplicate feature flag components from rendering in the settings when using <FeatureFlagged /> components
- 8015ff1258: Tweaked wording to use inclusive terminology
- 63310e3987: Apps will now rewrite the `app.baseUrl` configuration to match the current `location.origin`. The `backend.baseUrl` will also be rewritten in the same way when the `app.baseUrl` and `backend.baseUrl` have matching origins. This will reduce the need for separate frontend builds for different environments.
- Updated dependencies
  - @backstage/core-plugin-api@1.2.0-next.2
  - @backstage/config@1.0.5-next.1
  - @backstage/types@1.0.2-next.1
  - @backstage/version-bridge@1.0.3-next.0

## 1.2.1-next.1

### Patch Changes

- d3fea4ae0a: Internal fixes to avoid implicit usage of globals
- c3fa90e184: Updated dependency `zen-observable` to `^0.10.0`.
- Updated dependencies
  - @backstage/version-bridge@1.0.3-next.0
  - @backstage/core-plugin-api@1.1.1-next.1
  - @backstage/types@1.0.2-next.1
  - @backstage/config@1.0.5-next.1

## 1.2.1-next.0

### Patch Changes

- 3280711113: Updated dependency `msw` to `^0.49.0`.
- 19356df560: Updated dependency `zen-observable` to `^0.9.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.1.1-next.0
  - @backstage/types@1.0.2-next.0
  - @backstage/config@1.0.5-next.0
  - @backstage/version-bridge@1.0.2

## 1.2.0

### Minor Changes

- 9b737e5f2e: Updated the React Router wiring to make use of the new `basename` property of the router components in React Router v6 stable. To implement this, a new optional `basename` property has been added to the `Router` app component, which can be forwarded to the concrete router implementation in order to support this new behavior. This is done by default in any app that does not have a `Router` component override.
- 127fcad26d: Deprecated the `homepage` config as the component that used it - `HomepageTimer` - has been removed and replaced by the `HeaderWorldClock` in the home plugin

### Patch Changes

- Updated dependencies
  - @backstage/version-bridge@1.0.2
  - @backstage/core-plugin-api@1.1.0
  - @backstage/types@1.0.1
  - @backstage/config@1.0.4

## 1.2.0-next.0

### Minor Changes

- 9b737e5f2e: Updated the React Router wiring to make use of the new `basename` property of the router components in React Router v6 stable. To implement this, a new optional `basename` property has been added to the `Router` app component, which can be forwarded to the concrete router implementation in order to support this new behavior. This is done by default in any app that does not have a `Router` component override.
- 127fcad26d: Deprecated the `homepage` config as the component that used it - `HomepageTimer` - has been removed and replaced by the `HeaderWorldClock` in the home plugin

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.1.0-next.0
  - @backstage/types@1.0.1-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/version-bridge@1.0.1

## 1.1.1

### Patch Changes

- 27e6404aba: Fixed a bug where gathered index routes would fail to bind routable extensions. This would typically show up when placing a routable extension in the entity page overview tab.
- Updated dependencies
  - @backstage/core-plugin-api@1.0.7
  - @backstage/config@1.0.3
  - @backstage/types@1.0.0
  - @backstage/version-bridge@1.0.1

## 1.1.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.3-next.2
  - @backstage/core-plugin-api@1.0.7-next.2
  - @backstage/types@1.0.0
  - @backstage/version-bridge@1.0.1

## 1.1.1-next.1

### Patch Changes

- 27e6404aba: Fixed a bug where gathered index routes would fail to bind routable extensions. This would typically show up when placing a routable extension in the entity page overview tab.
- Updated dependencies
  - @backstage/core-plugin-api@1.0.7-next.1
  - @backstage/config@1.0.3-next.1
  - @backstage/types@1.0.0
  - @backstage/version-bridge@1.0.1

## 1.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.3-next.0
  - @backstage/core-plugin-api@1.0.7-next.0
  - @backstage/types@1.0.0
  - @backstage/version-bridge@1.0.1

## 1.1.0

### Minor Changes

- a448fea691: Updated the routing system to be compatible with React Router v6 stable.

### Patch Changes

- 817f3196f6: Updated React Router dependencies to be peer dependencies.
- f9ec4e46e3: When using React Router v6 stable, it is now possible for components within the `Route` element tree to have `path` props, although they will be ignored.
- 7d47def9c4: Removed dependency on `@types/jest`.
- 744fea158b: Added `getSystemIcons()` function to the `AppContext` available through `useApp` that will pull a list of all the icons that have been registered in the App.
- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- 8448b53dd6: Clarify that the `WebStorage` observable returns `JsonValue` items.
- 70299c99d5: Updated `FlatRoutes` to be compatible with React Router v6 stable.
- e9d40ebf54: If you'd like to send analytics events to multiple implementations, you may now
  do so using the `MultipleAnalyticsApi` implementation provided by this package.

  ```tsx
  import { MultipleAnalyticsApi } from '@backstage/core-app-api';
  import {
    analyticsApiRef,
    configApiRef,
    storageApiRef,
    identityApiRef,
  } from '@internal/backstage/core-plugin-api';
  import { CustomAnalyticsApi } from '@internal/analytics';
  import { VendorAnalyticsApi } from '@vendor/analytics';

  createApiFactory({
    api: analyticsApiRef,
    deps: { configApi: configApiRef, identityApi: identityApiRef, storageApi: storageApiRef },
    factory: ({ configApi, identityApi, storageApi }) =>
      MultipleAnalyticsApi.fromApis([
        VendorAnalyticsApi.fromConfig(configApi, { identityApi }),
        CustomAnalyticsApi.fromConfig(configApi, { identityApi, storageApi }),
      ]),
  }),
  ```

- Updated dependencies
  - @backstage/core-plugin-api@1.0.6
  - @backstage/config@1.0.2

## 1.1.0-next.3

### Patch Changes

- 7d47def9c4: Removed dependency on `@types/jest`.
- Updated dependencies
  - @backstage/config@1.0.2-next.0
  - @backstage/core-plugin-api@1.0.6-next.3

## 1.1.0-next.2

### Patch Changes

- f9ec4e46e3: When using React Router v6 stable, it is now possible for components within the `Route` element tree to have `path` props, although they will be ignored.
- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- e9d40ebf54: If you'd like to send analytics events to multiple implementations, you may now
  do so using the `MultipleAnalyticsApi` implementation provided by this package.

  ```tsx
  import { MultipleAnalyticsApi } from '@backstage/core-app-api';
  import {
    analyticsApiRef,
    configApiRef,
    storageApiRef,
    identityApiRef,
  } from '@internal/backstage/core-plugin-api';
  import { CustomAnalyticsApi } from '@internal/analytics';
  import { VendorAnalyticsApi } from '@vendor/analytics';

  createApiFactory({
    api: analyticsApiRef,
    deps: { configApi: configApiRef, identityApi: identityApiRef, storageApi: storageApiRef },
    factory: ({ configApi, identityApi, storageApi }) =>
      MultipleAnalyticsApi.fromApis([
        VendorAnalyticsApi.fromConfig(configApi, { identityApi }),
        CustomAnalyticsApi.fromConfig(configApi, { identityApi, storageApi }),
      ]),
  }),
  ```

- Updated dependencies
  - @backstage/core-plugin-api@1.0.6-next.2

## 1.1.0-next.1

### Minor Changes

- a448fea691: Updated the routing system to be compatible with React Router v6 stable.

### Patch Changes

- 817f3196f6: Updated React Router dependencies to be peer dependencies.
- 70299c99d5: Updated `FlatRoutes` to be compatible with React Router v6 stable.
- Updated dependencies
  - @backstage/core-plugin-api@1.0.6-next.1

## 1.0.6-next.0

### Patch Changes

- 744fea158b: Added `getSystemIcons()` function to the `AppContext` available through `useApp` that will pull a list of all the icons that have been registered in the App.
- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.0.6-next.0

## 1.0.5

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.0.5

## 1.0.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.0.5-next.0

## 1.0.4

### Patch Changes

- 881fc75a75: Internal tweak removing usage of explicit type parameters for the `BackstagePlugin` type.
- 8fe2357101: The `signOut` method of the `IdentityApi` will now navigate the user back to the base URL of the app as indicated by the `app.baseUrl` config.
- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 8006d0f9bf: Updated dependency `msw` to `^0.44.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.0.4

## 1.0.4-next.1

### Patch Changes

- 881fc75a75: Internal tweak removing usage of explicit type parameters for the `BackstagePlugin` type.
- a70869e775: Updated dependency `msw` to `^0.43.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.0.4-next.0

## 1.0.4-next.0

### Patch Changes

- 8fe2357101: The `signOut` method of the `IdentityApi` will now navigate the user back to the base URL of the app as indicated by the `app.baseUrl` config.

## 1.0.3

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- 19781483a2: Handle URLs as the first argument to `fetchApi`, when using the `plugin:` protocol
- Updated dependencies
  - @backstage/core-plugin-api@1.0.3

## 1.0.3-next.0

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.0.3-next.0

## 1.0.2

### Patch Changes

- 1fae1f57c9: Fix SAML session schema to no longer require the (deprecated) id, to unbreak session data storage.
- Updated dependencies
  - @backstage/core-plugin-api@1.0.2
  - @backstage/config@1.0.1

## 1.0.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.1-next.0
  - @backstage/core-plugin-api@1.0.2-next.1

## 1.0.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.0.2-next.0

## 1.0.1

### Patch Changes

- 7c7919777e: build(deps-dev): bump `@testing-library/react-hooks` from 7.0.2 to 8.0.0
- 24254fd433: build(deps): bump `@testing-library/user-event` from 13.5.0 to 14.0.0
- 3ff2bfb66e: Refactored the route collection logic to prepare for future changes and avoid duplicate element tree traversal for the analytics context.
- a7bb762dab: fixed empty body issue for POST requests using FetchAPI with 'plugin://' prefix
- 230ad0826f: Bump to using `@types/node` v16
- c47509e1a0: Implemented changes suggested by Deepsource.io including multiple double non-null assertion operators and unexpected awaits for non-promise values.
- Updated dependencies
  - @backstage/core-plugin-api@1.0.1
  - @backstage/version-bridge@1.0.1

## 1.0.1-next.1

### Patch Changes

- 24254fd433: build(deps): bump `@testing-library/user-event` from 13.5.0 to 14.0.0
- 3ff2bfb66e: Refactored the route collection logic to prepare for future changes and avoid duplicate element tree traversal for the analytics context.
- 230ad0826f: Bump to using `@types/node` v16
- Updated dependencies
  - @backstage/core-plugin-api@1.0.1-next.0

## 1.0.1-next.0

### Patch Changes

- a7bb762dab: fixed empty body issue for POST requests using FetchAPI with 'plugin://' prefix
- c47509e1a0: Implemented changes suggested by Deepsource.io including multiple double non-null assertion operators and unexpected awaits for non-promise values.

## 1.0.0

### Major Changes

- b58c70c223: This package has been promoted to v1.0! To understand how this change affects the package, please check out our [versioning policy](https://backstage.io/docs/overview/versioning-policy).

### Patch Changes

- a422d7ce5e: chore(deps): bump `@testing-library/react` from 11.2.6 to 12.1.3
- f24ef7864e: Minor typo fixes
- Updated dependencies
  - @backstage/core-plugin-api@1.0.0
  - @backstage/version-bridge@1.0.0
  - @backstage/config@1.0.0
  - @backstage/types@1.0.0

## 0.6.0

### Minor Changes

- bb2bb36651: **BREAKING**: Removed the deprecated `get` method from `StorageAPI` and its implementations, this method has been replaced by the `snapshot` method. The return value from snapshot no longer includes `newValue` which has been replaced by `value`. For getting notified when a value changes, use `observe# @backstage/core-app-api.
- f3cce3dcf7: **BREAKING**: Removed export of `GithubSession` and `SamlSession` which are only used internally.
- af5eaa87f4: **BREAKING**: Removed deprecated `auth0AuthApiRef`, `oauth2ApiRef`, `samlAuthApiRef` and `oidcAuthApiRef` as these APIs are too generic to be useful. Instructions for how to migrate can be found at [https://backstage.io/docs/api/deprecations#generic-auth-api-refs](https://backstage.io/docs/api/deprecations#generic-auth-api-refs).
- dbf84eee55: **BREAKING**: Removed the deprecated `GithubAuth.normalizeScopes` method.

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@0.8.0

## 0.5.4

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@0.7.0

## 0.5.3

### Patch Changes

- 1ed305728b: Bump `node-fetch` to version 2.6.7 and `cross-fetch` to version 3.1.5
- c77c5c7eb6: Added `backstage.role` to `package.json`
- Updated dependencies
  - @backstage/core-plugin-api@0.6.1
  - @backstage/config@0.1.14
  - @backstage/types@0.1.2
  - @backstage/version-bridge@0.1.2

## 0.5.2

### Patch Changes

- 40775bd263: Switched out the `GithubAuth` implementation to use the common `OAuth2` implementation. This relies on the simultaneous change in `@backstage/plugin-auth-backend` that enabled access token storage in cookies rather than the current solution that's based on `LocalStorage`.

  > **NOTE:** Make sure you upgrade the `auth-backend` deployment before or at the same time as you deploy this change.

## 0.5.2-next.0

### Patch Changes

- 40775bd263: Switched out the `GithubAuth` implementation to use the common `OAuth2` implementation. This relies on the simultaneous change in `@backstage/plugin-auth-backend` that enabled access token storage in cookies rather than the current solution that's based on `LocalStorage`.

  > **NOTE:** Make sure you upgrade the `auth-backend` deployment before or at the same time as you deploy this change.

## 0.5.1

### Patch Changes

- f959c22787: Asynchronous methods on the identity API can now reliably be called at any time, including early in the bootstrap process or prior to successful sign-in.

  Previously in such situations, a `Tried to access IdentityApi before app was loaded` error would be thrown. Now, those methods will wait and resolve eventually (as soon as a concrete identity API is provided).

## 0.5.0

### Minor Changes

- ceebe25391: Removed deprecated `SignInResult` type, which was replaced with the new `onSignInSuccess` callback.

### Patch Changes

- fb565073ec: Add an `allowUrl` callback option to `FetchMiddlewares.injectIdentityAuth`
- f050eec2c0: Added validation during the application startup that detects if there are any plugins present that have not had their required external routes bound. Failing the validation will cause a hard crash as it is a programmer error. It lets you detect early on that there are dangling routes, rather than having them cause an error later on.
- Updated dependencies
  - @backstage/core-plugin-api@0.6.0
  - @backstage/config@0.1.13

## 0.5.0-next.0

### Minor Changes

- ceebe25391: Removed deprecated `SignInResult` type, which was replaced with the new `onSignInSuccess` callback.

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@0.6.0-next.0
  - @backstage/config@0.1.13-next.0

## 0.4.0

### Minor Changes

- e2eb92c109: Removed previously deprecated `ApiRegistry` export.

### Patch Changes

- 34442cd5cf: Fixed an issue where valid SAML and GitHub sessions would be considered invalid and not be stored.

  Deprecated the `SamlSession` and `GithubSession` types.

- 784d8078ab: Removed direct and transitive Material UI dependencies.
- Updated dependencies
  - @backstage/config@0.1.12
  - @backstage/core-plugin-api@0.5.0

## 0.3.1

### Patch Changes

- 4ce51ab0f1: Internal refactor of the `react-use` imports to use `react-use/lib/*` instead.
- Updated dependencies
  - @backstage/core-plugin-api@0.4.1
  - @backstage/core-components@0.8.3

## 0.3.0

### Minor Changes

- a195284c7b: Updated `WebStorageApi` to reflect the `StorageApi` changes in `@backstage/core-plugin-api`.
- b3605da81c: - Removed deprecated definition `createApp` from `@backstage/core-app-api` which has been replaced by `@backstage/app-defaults#createApp`
  - Removed deprecated type `BackstagePluginWithAnyOutput`
  - Removed deprecated constructors for `GithubAuth`, `OAuth2`, and `SamlAuth` as the `create` method should be used instead
- 68f8b10ccd: - Removed deprecation configuration option `theme` from `AppTheme` of the `AppThemeApi`
  - Removed reference to `theme` in the `app-defaults` default `AppTheme`
  - Removed logic in `AppThemeProvider` that creates `ThemeProvider` from `appTheme.theme`

### Patch Changes

- 7927005152: Add `FetchApi` and related `fetchApiRef` which implement fetch, with an added Backstage token header when available.
- 518ddc00bc: Schema-validate local storage cached session info on load
- Updated dependencies
  - @backstage/app-defaults@0.1.3
  - @backstage/core-plugin-api@0.4.0
  - @backstage/core-components@0.8.2

## 0.2.1

### Patch Changes

- c11ce4f552: Deprecated `Auth0Auth`, pointing to using `OAuth2` directly instead.
- 9d6503e86c: Switched out usage of deprecated `OAuthRequestApi` types from `@backstage/core-plugin-api`.
- Updated dependencies
  - @backstage/core-plugin-api@0.3.1
  - @backstage/core-components@0.8.1

## 0.2.0

### Minor Changes

- a036b65c2f: **BREAKING CHANGE**

  The app `SignInPage` component has been updated to switch out the `onResult` callback for a new `onSignInSuccess` callback. This is an immediate breaking change without any deprecation period, as it was deemed to be the way of making this change that had the lowest impact.

  The new `onSignInSuccess` callback directly accepts an implementation of an `IdentityApi`, rather than a `SignInResult`. The `SignInPage` from `@backstage/core-component` has been updated to fit this new API, and as long as you pass on `props` directly you should not see any breakage.

  However, if you implement your own custom `SignInPage`, then this will be a breaking change and you need to migrate over to using the new callback. While doing so you can take advantage of the `UserIdentity.fromLegacy` helper from `@backstage/core-components` to make the migration simpler by still using the `SignInResult` type. This helper is also deprecated though and is only provided for immediate migration. Long-term it will be necessary to build the `IdentityApi` using for example `UserIdentity.create` instead.

  The following is an example of how you can migrate existing usage immediately using `UserIdentity.fromLegacy`:

  ```ts
  onResult(signInResult);
  // becomes
  onSignInSuccess(UserIdentity.fromLegacy(signInResult));
  ```

  The following is an example of how implement the new `onSignInSuccess` callback of the `SignInPage` using `UserIdentity.create`:

  ```ts
  const identityResponse = await authApi.getBackstageIdentity();
  // Profile is optional and will be removed, but allows the
  // synchronous getProfile method of the IdentityApi to be used.
  const profile = await authApi.getProfile();
  onSignInSuccess(
    UserIdentity.create({
      identity: identityResponse.identity,
      authApi,
      profile,
    }),
  );
  ```

### Patch Changes

- cd450844f6: Moved React dependencies to `peerDependencies` and allow both React v16 and v17 to be used.
- dcd1a0c3f4: Minor improvement to the API reports, by not unpacking arguments directly
- Updated dependencies
  - @backstage/core-components@0.8.0
  - @backstage/core-plugin-api@0.3.0
  - @backstage/app-defaults@0.1.2
  - @backstage/version-bridge@0.1.1

## 0.1.24

### Patch Changes

- 0e7f256034: Fixed a bug where `useRouteRef` would fail in situations where relative navigation was needed and the app was is mounted on a sub-path. This would typically show up as a failure to navigate to a tab on an entity page.
- Updated dependencies
  - @backstage/core-components@0.7.6
  - @backstage/theme@0.2.14
  - @backstage/core-plugin-api@0.2.2

## 0.1.23

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

- 000190de69: The `ApiRegistry` from `@backstage/core-app-api` class has been deprecated and will be removed in a future release. To replace it, we have introduced two new helpers that are exported from `@backstage/test-utils`, namely `TestApiProvider` and `TestApiRegistry`.

  These two new helpers are more tailored for writing tests and development setups, as they allow for partial implementations of each of the APIs.

  When migrating existing code it is typically best to prefer usage of `TestApiProvider` when possible, so for example the following code:

  ```tsx
  render(
    <ApiProvider
      apis={ApiRegistry.from([
        [identityApiRef, mockIdentityApi as unknown as IdentityApi]
      ])}
    >
      {...}
    </ApiProvider>
  )
  ```

  Would be migrated to this:

  ```tsx
  render(
    <TestApiProvider apis={[[identityApiRef, mockIdentityApi]]}>
      {...}
    </TestApiProvider>
  )
  ```

  In cases where the `ApiProvider` is used in a more standalone way, for example to reuse a set of APIs across multiple tests, the `TestApiRegistry` can be used instead. Note that the `TestApiRegistry` only has a single static factory method, `.from()`, and it is slightly different from the existing `.from()` method on `ApiRegistry` in that it doesn't require the API pairs to be wrapped in an outer array.

  Usage that looks like this:

  ```ts
  const apis = ApiRegistry.with(
    identityApiRef,
    mockIdentityApi as unknown as IdentityApi,
  ).with(configApiRef, new ConfigReader({}));
  ```

  OR like this:

  ```ts
  const apis = ApiRegistry.from([
    [identityApiRef, mockIdentityApi as unknown as IdentityApi],
    [configApiRef, new ConfigReader({})],
  ]);
  ```

  Would be migrated to this:

  ```ts
  const apis = TestApiRegistry.from(
    [identityApiRef, mockIdentityApi],
    [configApiRef, new ConfigReader({})],
  );
  ```

  If your app is still using the `ApiRegistry` to construct the `apis` for `createApp`, we recommend that you move over to use the new method of supplying API factories instead, using `createApiFactory`.

- Updated dependencies
  - @backstage/core-plugin-api@0.2.1
  - @backstage/core-components@0.7.5

## 0.1.22

### Patch Changes

- Reverted the `createApp` TypeScript type to match the one before version `0.1.21`, as it was an accidental breaking change.

## 0.1.21

### Patch Changes

- 0b1de52732: Migrated to using new `ErrorApiError` and `ErrorApiErrorContext` names.
- ecd1fcb80a: Deprecated the `BackstagePluginWithAnyOutput` type.
- 32bfbafb0f: Start exporting and marking several types as public to address errors in the API report.
- 014cbf8cb9: The `createApp` function from `@backstage/core-app-api` has been deprecated, with two new options being provided as a replacement.

  The first and most commonly used one is `createApp` from the new `@backstage/app-defaults` package, which behaves just like the existing `createApp`. In the future this method is likely to be expanded to add more APIs and other pieces into the default setup, for example the Utility APIs from `@backstage/integration-react`.

  The other option that we now provide is to use `createSpecializedApp` from `@backstage/core-app-api`. This is a more low-level API where you need to provide a full set of options, including your own `components`, `icons`, `defaultApis`, and `themes`. The `createSpecializedApp` way of creating an app is particularly useful if you are not using `@backstage/core-components` or Material UI, as it allows you to avoid those dependencies completely.

- 475edb5bc5: move the BehaviorSubject init into the constructor
- Updated dependencies
  - @backstage/core-components@0.7.4
  - @backstage/core-plugin-api@0.2.0
  - @backstage/app-defaults@0.1.1

## 0.1.20

### Patch Changes

- 78c512ce8f: I have added default icons for the catalog, scaffolder, techdocs, and search.
- 8b4284cd5c: Improve API documentation for @backstage/core-plugin-api
- Updated dependencies
  - @backstage/core-components@0.7.3
  - @backstage/theme@0.2.13
  - @backstage/core-plugin-api@0.1.13

## 0.1.19

### Patch Changes

- 10615525f3: Switch to use the json and observable types from `@backstage/types`
- 41c49884d2: Start using the new `@backstage/types` package. Initially, this means using the `Observable` and `Json*` types from there. The types also remain in their old places but deprecated, and will be removed in a future release.
- 925a967f36: Replace usage of test-utils-core with test-utils
- 6b615e92c8: Api cleanup, adding `@public` where necessary and tweaking some comments
- Updated dependencies
  - @backstage/config@0.1.11
  - @backstage/theme@0.2.12
  - @backstage/core-components@0.7.2
  - @backstage/core-plugin-api@0.1.12

## 0.1.18

### Patch Changes

- 202f322927: Atlassian auth provider

  - AtlassianAuth added to core-app-api
  - Atlassian provider added to plugin-auth-backend
  - Updated user-settings with Atlassian connection

- 36e67d2f24: Internal updates to apply more strict checks to throw errors.
- Updated dependencies
  - @backstage/core-components@0.7.1
  - @backstage/core-plugin-api@0.1.11

## 0.1.17

### Patch Changes

- 75bc878221: Internal refactor to avoid importing all of `@material-ui/core`.
- Updated dependencies
  - @backstage/core-components@0.7.0
  - @backstage/theme@0.2.11

## 0.1.16

### Patch Changes

- d9fd798cc8: The Core App API now automatically instruments all route location changes using
  the new Analytics API. Each location change triggers a `navigate` event, which
  is an analogue of a "pageview" event in traditional web analytics systems. In
  addition to the path, these events provide plugin-level metadata via the
  analytics context, which can be useful for analyzing plugin usage:

  ```json
  {
    "action": "navigate",
    "subject": "/the-path/navigated/to?with=params#and-hashes",
    "context": {
      "extension": "App",
      "pluginId": "id-of-plugin-that-exported-the-route",
      "routeRef": "associated-route-ref-id"
    }
  }
  ```

  These events can be identified and handled by checking for the action
  `navigate` and the extension `App`.

- 4c3eea7788: Bitbucket Cloud authentication - based on the existing GitHub authentication + changes around BB apis and updated scope.

  - BitbucketAuth added to core-app-api.
  - Bitbucket provider added to plugin-auth-backend.
  - Cosmetic entry for Bitbucket connection in user-settings Authentication Providers tab.

- d6ad46eb22: Stop calling connector.removeSession in StaticAuthSessionManager, instead just discarding the
  session locally.
- Updated dependencies
  - @backstage/core-components@0.6.1
  - @backstage/core-plugin-api@0.1.10

## 0.1.15

### Patch Changes

- 0c4ee1876f: Enables late registration of plugins into the application by updating ApiHolder when additional plugins have been added in.
- Updated dependencies
  - @backstage/core-plugin-api@0.1.9
  - @backstage/core-components@0.6.0

## 0.1.14

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.5.0
  - @backstage/config@0.1.10

## 0.1.13

### Patch Changes

- 671015f132: Switch to using utilities from `@backstage/version-bridge'.
- bd1981d609: Allow users to specify their own AppThemeProvider
- Updated dependencies
  - @backstage/core-components@0.4.2
  - @backstage/core-plugin-api@0.1.8

## 0.1.12

### Patch Changes

- 841666a19: Removed deprecated internal functions.
- Updated dependencies
  - @backstage/core-components@0.4.1
  - @backstage/config@0.1.9
  - @backstage/core-plugin-api@0.1.7

## 0.1.11

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.4.0

## 0.1.10

### Patch Changes

- cfcb486aa: Add system icons for the built-in entity types and use them in the entity list of the `catalog-import` plugin.
- 392b36fa1: Added support for using authenticating via GitHub Apps in addition to GitHub OAuth Apps. It used to be possible to use GitHub Apps, but they did not handle session refresh correctly.

  Note that GitHub Apps handle OAuth scope at the app installation level, meaning that the `scope` parameter for `getAccessToken` has no effect. When calling `getAccessToken` in open source plugins, one should still include the appropriate scope, but also document in the plugin README what scopes are required in the case of GitHub Apps.

  In addition, the `authHandler` and `signInResolver` options have been implemented for the GitHub provider in the auth backend.

- Updated dependencies
  - @backstage/core-components@0.3.3
  - @backstage/config@0.1.8

## 0.1.9

### Patch Changes

- 72a31c29a: Add support for additional app origins
- Updated dependencies
  - @backstage/config@0.1.7
  - @backstage/core-components@0.3.2
  - @backstage/theme@0.2.10

## 0.1.8

### Patch Changes

- 362657623: Add support for serving the app with a base path other than `/`, which is enabled by including the path in `app.baseUrl`.
- 56c773909: Switched `@types/react` dependency to request `*` rather than a specific version.
- Updated dependencies
  - @backstage/core-components@0.3.1
  - @backstage/core-plugin-api@0.1.6

## 0.1.7

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.3.0
  - @backstage/config@0.1.6
  - @backstage/core-plugin-api@0.1.5

## 0.1.6

### Patch Changes

- 9d40fcb1e: - Bumping `material-ui/core` version to at least `4.12.2` as they made some breaking changes in later versions which broke `Pagination` of the `Table`.
  - Switching out `material-table` to `@material-table/core` for support for the later versions of `material-ui/core`
  - This causes a minor API change to `@backstage/core-components` as the interface for `Table` re-exports the `prop` from the underlying `Table` components.
  - `onChangeRowsPerPage` has been renamed to `onRowsPerPageChange`
  - `onChangePage` has been renamed to `onPageChange`
  - Migration guide is here: https://material-table-core.com/docs/breaking-changes
- Updated dependencies
  - @backstage/core-components@0.2.0
  - @backstage/core-plugin-api@0.1.4
  - @backstage/theme@0.2.9

## 0.1.5

### Patch Changes

- ea249c6e6: Fix a bug in `FlatRoutes` that prevented outlets from working with the root route, as well as matching root routes too broadly.
- Updated dependencies
  - @backstage/core-components@0.1.6

## 0.1.4

### Patch Changes

- 62abffee4: Reintroduce export of `defaultConfigLoader`.
- Updated dependencies
  - @backstage/core-components@0.1.4

## 0.1.3

### Patch Changes

- dc3e7ce68: Introducing new UnhandledErrorForwarder installed by default. For catching unhandled promise rejections, you can override the API to align with general error handling.
- 5f4339b8c: Adding `FeatureFlag` component and treating `FeatureFlags` as first class citizens to composability API
- Updated dependencies
  - @backstage/core-plugin-api@0.1.3

## 0.1.2

### Patch Changes

- 9bca2a252: Fixes a type bug where supplying all app icons to `createApp` was required, rather than just a partial list.
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

- da8cba44f: Deprecate and disable the extension creation methods, which were added to this package by mistake and should only exist within `@backstage/core-plugin-api`.
- 9bca2a252: Update `createApp` options to allow plugins with unknown output types in order to improve forwards and backwards compatibility.
- Updated dependencies [e47336ea4]
- Updated dependencies [75b8537ce]
- Updated dependencies [da8cba44f]
  - @backstage/core-components@0.1.2
  - @backstage/core-plugin-api@0.1.2

## 0.1.1

### Patch Changes

- e7c5e4b30: Update installation instructions in README.
- Updated dependencies [031ccd45f]
- Updated dependencies [e7c5e4b30]
  - @backstage/core-plugin-api@0.1.1
  - @backstage/core-components@0.1.1
  - @backstage/theme@0.2.8
