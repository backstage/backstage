# @backstage/core-plugin-api

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
