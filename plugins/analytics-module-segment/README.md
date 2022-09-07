# Analytics Module: Segment

This plugin provides an implementation of the Backstage Analytics API for
Segment. Once installed and configured, analytics events will be sent to
Segment as your users navigate and use your Backstage instance.

This plugin contains no other functionality.

## Installation

1. Install the plugin package in your Backstage app:
   `cd packages/app && yarn add @backstage/plugin-analytics-module-segment`
2. Wire up the API implementation to your App:

```tsx
// packages/app/src/apis.ts
import { analyticsApiRef, configApiRef } from '@backstage/core-plugin-api';
import { SegmentAnalytics } from '@backstage/plugin-analytics-module-segment';

export const apis: AnyApiFactory[] = [
  // Instantiate and register the GA Analytics API Implementation.
  createApiFactory({
    api: analyticsApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) => SegmentAnalytics.fromConfig(configApi),
  }),
];
```

3. Configure the plugin in your `app-config.yaml`:

The following is the minimum configuration required to start sending analytics
events to Segment. All that's needed is your Segment Write Key

```yaml
# app-config.yaml
app:
  analytics:
    segment:
      writeKey: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Debugging and Testing

In pre-production environments, you may wish to set additional configurations
to turn off reporting to Analytics. You can do so like this:

```yaml
app:
  analytics:
    segment:
      testMode: true # Prevents data being sent to Segment
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
4. Enter this plugin's working directory: `cd plugins/analytics-provider-segment`
5. Start the plugin in isolation: `yarn start`
6. Navigate to the playground page at `http://localhost:3000/segment`
7. Open the web console to see events fire when you navigate or when you
   interact with instrumented components.

Code for the isolated version of the plugin can be found inside the [/dev](./dev)
directory. Changes to the plugin are hot-reloaded.
