# @backstage/core-plugin-api

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
