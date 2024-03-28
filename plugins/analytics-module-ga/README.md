# Analytics Module: Google Analytics

This plugin provides an opinionated implementation of the Backstage Analytics
API for Google Analytics. Once installed and configured, analytics events will
be sent to GA as your users navigate and use your Backstage instance.

This plugin contains no other functionality.

## Installation

1. Install the plugin package in your Backstage app:

```sh
# From your Backstage root directory
yarn --cwd packages/app add @backstage/plugin-analytics-module-ga
```

2. Wire up the API implementation to your App:

```tsx
// packages/app/src/apis.ts
import {
  analyticsApiRef,
  configApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { GoogleAnalytics } from '@backstage/plugin-analytics-module-ga';

export const apis: AnyApiFactory[] = [
  // Instantiate and register the GA Analytics API Implementation.
  createApiFactory({
    api: analyticsApiRef,
    deps: { configApi: configApiRef, identityApi: identityApiRef },
    factory: ({ configApi, identityApi }) =>
      GoogleAnalytics.fromConfig(configApi, {
        identityApi,
      }),
  }),
];
```

3. Configure the plugin in your `app-config.yaml`:

The following is the minimum configuration required to start sending analytics
events to GA. All that's needed is your Universal Analytics tracking ID:

```yaml
# app-config.yaml
app:
  analytics:
    ga:
      trackingId: UA-0000000-0
```

4. Update CSP in your `app-config.yaml`:

The following is the minimal content security policy required to load scripts from GA.

```yaml
backend:
  csp:
    connect-src: ["'self'", 'http:', 'https:']
    # Add these two lines below
    script-src: ["'self'", "'unsafe-eval'", 'https://www.google-analytics.com']
    img-src: ["'self'", 'data:', 'https://www.google-analytics.com']
```

## Configuration

In order to be able to analyze usage of your Backstage instance _by plugin_, we
strongly recommend configuring at least one [custom dimension][what-is-a-custom-dimension]
to capture Plugin IDs associated with events, including page views.

1. First, [configure the custom dimension in GA][configure-custom-dimension].
   Be sure to set the Scope to `hit`, and name it something like `Plugin`. Note
   the index of the dimension you just created (e.g. `1`, if this is the first
   custom dimension you've created in your GA property).
2. Then, add a mapping to your `app.analytics.ga` configuration that instructs
   the plugin to capture Plugin IDs on the custom dimension you just created.
   It should look like this:

```yaml
app:
  analytics:
    ga:
      trackingId: UA-0000000-0
      customDimensionsMetrics:
        - type: dimension
          index: 1
          source: context
          key: pluginId
```

You can configure additional custom dimension and metric collection by adding
more entries to the `customDimensionsMetrics` array:

```yaml
app:
  analytics:
    ga:
      customDimensionsMetrics:
        - type: dimension
          index: 1
          source: context
          key: pluginId
        - type: dimension
          index: 2
          source: context
          key: routeRef
        - type: dimension
          index: 3
          source: context
          key: extension
        - type: metric
          index: 1
          source: attributes
          key: someEventContextAttr
```

### User IDs

This plugin supports accurately deriving user-oriented metrics (like monthly
active users) using Google Analytics' [user ID views][ga-user-id-view]. To
enable this...

1. Be sure you've gone through the process of setting up a user ID view in your
   Backstage instance's Google Analytics property (see docs linked above).
2. Make sure you instantiate `GoogleAnalytics` with an `identityApi` instance
   passed to it, as shown in the installation section above.
3. Set `app.analytics.ga.identity` to either `required` or `optional` in your
   `app.config.yaml`, like this:

   ```yaml
   app:
     analytics:
       ga:
         trackingId: UA-0000000-0
         identity: optional
   ```

   Set `identity` to `optional` if you need accurate session counts, including
   cases where users do not sign in at all. Use `required` if you need all hits
   to be associated with a user ID without exception (and don't mind if some
   sessions are not captured, such as those where no sign in occur).

Note that, to comply with GA policies, the value of the User ID is
pseudonymized before being sent to GA. By default, it is a `sha256` hash of the
current user's `userEntityRef` as returned by the `identityApi`. To set a
different value, provide a `userIdTransform` function alongside `identityApi`
when you instantiate `GoogleAnalytics`. This function will be passed the
`userEntityRef` as an argument and should resolve to the value you wish to set
as the user ID. For example:

```typescript
import {
  analyticsApiRef,
  configApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { GoogleAnalytics } from '@backstage/plugin-analytics-module-ga';

export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: analyticsApiRef,
    deps: { configApi: configApiRef, identityApi: identityApiRef },
    factory: ({ configApi, identityApi }) =>
      GoogleAnalytics.fromConfig(configApi, {
        identityApi,
        userIdTransform: async (userEntityRef: string): Promise<string> => {
          return customHashingFunction(userEntityRef);
        },
      }),
  }),
];
```

### Enabling Site Search

If you wish to see all of the search events in the [Site Search](https://support.google.com/analytics/answer/1012264)
section of Google Analytics, you can enable sending virtual pageviews on every `search` event like so:

```yaml
app:
  analytics:
    ga:
      virtualSearchPageView:
        mode: only # Defaults to 'disabled'
        mountPath: /virtual-search # Defaults to '/search'
        searchQuery: term # Defaults to 'query'
        categoryQuery: sc # Omitted by default
```

Available `mode`s are:

- `disabled` - no virtual pageviews are sent, default behavior
- `only` - sends virtual pageviews _instead_ of `search` events
- `both` - sends both virtual pageviews _and_ `search` events

Virtual pageviews will be sent to the path specified in the `mountPath`, the search term will be
set as the value for query parameter `searchQuery` and category (if provided) will be set as the value for
query parameter `categoryQuery`, e.g. the example config above will result in
virtual pageviews being sent to `/virtual-search?term=SearchTermHere&sc=CategoryHere`.

### Debugging and Testing

In pre-production environments, you may wish to set additional configurations
to turn off reporting to Analytics and/or print debug statements to the
console. You can do so like this:

```yaml
app:
  analytics:
    ga:
      testMode: true # Prevents data being sent to GA
      debug: true # Logs analytics event to the web console
```

You might commonly set the above in an `app-config.local.yaml` file, which is
normally `gitignore`'d but loaded and merged in when Backstage is bootstrapped.

## Development

If you would like to contribute improvements to this plugin, the easiest way to
make and test changes is to do the following:

1. Clone the main Backstage monorepo `git clone git@github.com:backstage/backstage.git`
2. Install all dependencies `yarn install`
3. If one does not exist, create an `app-config.local.yaml` file in the root of
   the monorepo and add config for this plugin (see below)
4. Enter this plugin's working directory: `cd plugins/analytics-provider-ga`
5. Start the plugin in isolation: `yarn start`
6. Navigate to the playground page at `http://localhost:3000/ga`
7. Open the web console to see events fire when you navigate or when you
   interact with instrumented components.

Code for the isolated version of the plugin can be found inside the [/dev](./dev)
directory. Changes to the plugin are hot-reloaded.

### Recommended Dev Config

Paste this into your `app-config.local.yaml` while developing this plugin:

```yaml
app:
  analytics:
    ga:
      trackingId: UA-0000000-0
      debug: true
      testMode: true
      customDimensionsMetrics:
        - type: dimension
          index: 1
          source: context
          key: pluginId
```

[what-is-a-custom-dimension]: https://support.google.com/analytics/answer/2709828
[configure-custom-dimension]: https://support.google.com/analytics/answer/2709828#configuration
[ga-user-id-view]: https://support.google.com/analytics/answer/3123669
