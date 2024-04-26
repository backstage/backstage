# Analytics Module: New Relic Browser

This plugin provides an opinionated implementation of the Backstage Analytics API for New Relic Browser. Once installed and configured, analytics events will be sent to New Relic as your users navigate and use your Backstage instance.

This plugin contains no other functionality.

## Installation

1. Install the plugin package in your Backstage app:

```sh
# From your Backstage root directory
yarn --cwd packages/app add @backstage/plugin-analytics-module-newrelic-browser
```

2. Wire up the API implementation to your App:

```tsx
// packages/app/src/apis.ts
import {
  analyticsApiRef,
  configApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { NewRelicBrowser } from '@backstage/plugin-analytics-module-newrelic-browser';

export const apis: AnyApiFactory[] = [
  // Instantiate and register the New Relic Browser API Implementation.
  createApiFactory({
    api: analyticsApiRef,
    deps: { configApi: configApiRef, identityApi: identityApiRef },
    factory: ({ configApi, identityApi }) =>
      NewRelicBrowser.fromConfig(configApi, {
        identityApi,
      }),
  }),
];
```

3. Configure the plugin in your `app-config.yaml`:

The following is the minimum configuration required to start sending analytics
events to New Relic Browser. You find this information when creating a new application
in New Relic Browser using the Copy/Paste method.

```yaml
# app-config.yaml
app:
  analytics:
    newRelic:
      endpoint: 'bam.nr-data.net',
      accountId: '1234567'
      applicationId: '987654321'
      licenseKey: 'NRJS-12a3456bc78de9123f4'
```

> Note: Depending on New Relic's data center you are using you'll want to change the `endpoint` to `bam.eu01.nr-data.net` for the EU data center. Refer to [this document](https://docs.newrelic.com/docs/new-relic-solutions/get-started/networks/#data-ingest) for available endpoints.

## Configuration

By default the distributed tracing and cookies features are disabled. You can enable them by adding the following to your `app-config.yaml`:

```yaml
# app-config.yaml
app:
  analytics:
    newRelic:
      ...
      distributedTracing: true
      cookiesEnabled: true
```

### User IDs

This plugin supports sending user context to New Relic Browser by providing a User ID. This requires instantiating the `NewRelicBrowser` instance with an `identityApi` instance passed to it, but this is optional. If omitted the plugin will not send user context to New Relic Browser.

By default the user ID is calculated as a SHA-256 hash of the current user's `userEntityRef` as returned by the `identityApi`. To set a
different value, provide a `userIdTransform` function alongside `identityApi` when you instantiate `NewRelicBrowser`. This function will be passed the `userEntityRef` as an argument and should resolve to the value you wish to set as the user ID. For example:

```typescript
import {
  analyticsApiRef,
  configApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { GoogleAnalytics } from '@backstage/plugin-analytics-module-newrelic-browser';

export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: analyticsApiRef,
    deps: { configApi: configApiRef, identityApi: identityApiRef },
    factory: ({ configApi, identityApi }) =>
      NewRelicBrowser.fromConfig(configApi, {
        identityApi,
        userIdTransform: async (userEntityRef: string): Promise<string> => {
          return customHashingFunction(userEntityRef);
        },
      }),
  }),
];
```

## Development

If you would like to contribute improvements to this plugin, the easiest way to
make and test changes is to do the following:

1. Clone the main Backstage monorepo `git clone git@github.com:backstage/backstage.git`
2. Install all dependencies `yarn install`
3. If one does not exist, create an `app-config.local.yaml` file in the root of
   the monorepo and add config for this plugin (see below)
4. Enter this plugin's working directory: `cd plugins/analytics-provider-newrelic-browser`
5. Start the plugin in isolation: `yarn start`
6. Navigate to the playground page at `http://localhost:3000/newrelic`
7. Open the web console to see events fire when you navigate or when you
   interact with instrumented components.

Code for the isolated version of the plugin can be found inside the [/dev](./dev)
directory. Changes to the plugin are hot-reloaded.

#### Recommended Dev Config

Paste this into your `app-config.local.yaml` while developing this plugin:

```yaml
app:
  analytics:
    newRelic:
      accountId: '1234567'
      applicationId: '987654321'
      licenseKey: 'NRJS-12a3456bc78de9123f4'
      distributedTracingEnabled: true
      cookiesEnabled: true
      useEuEndpoint: false
```
