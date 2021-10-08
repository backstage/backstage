# Analytics Module: Google Analytics

This plugin provides an opinionated implementation of the Backstage Analytics
API for Google Analytics. Once installed and configured, analytics events will
be sent to GA as your users navigate and use your Backstage instance.

This plugin contains no other functionality.

## Installation

1. Install the plugin package in your Backstage app:
   `cd packages/app && yarn add @backstage/plugin-analytics-module-ga`
2. Wire up the API implementation to your App:

```tsx
// packages/app/src/apis.ts
import { analyticsApiRef, configApiRef } from '@backstage/core-plugin-api';
import { GoogleAnalytics } from '@backstage/plugin-analytics-module-ga';

export const apis: AnyApiFactory[] = [
  // Instantiate and register the GA Analytics API Implementation.
  createApiFactory({
    api: analyticsApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) => GoogleAnalytics.fromConfig(configApi),
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

#### Recommended Dev Config

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
