# @backstage/core-app-api

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
