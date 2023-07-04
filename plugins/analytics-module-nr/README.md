# Analytics Module: New Relic Browser

This plugin provides an opinionated implementation of the Backstage Analytics API for New Relic Browser. Once installed and configured, analytics events will be sent to New Relic as your users navigate and use your Backstage instance.

This plugin contains no other functionality.

## Installation

1. Install the plugin package in your Backstage app:

```sh
# From your Backstage root directory
yarn add --cwd packages/app @backstage/plugin-analytics-module-nr
```

2. Wire up the API implementation to your App:

```tsx
// packages/app/src/apis.ts
import {
  analyticsApiRef,
  configApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { NewRelicBrowser } from '@backstage/plugin-analytics-module-nr';

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
    nr:
      accountId: '1234567'
      applicationId: '987654321'
      licenseKey: 'NRJS-12a3456bc78de9123f4'
      useEuEndpoint: false # Set this to true if you're using New Relic's EU data center
```

## Configuration

By default the distributed tracing and cookies features are disabled. You can enable them by adding the following to your `app-config.yaml`:

```yaml
# app-config.yaml
app:
  analytics:
    nr:
      ...
      distributedTracing: true
      cookiesEnabled: true
```

## Development

If you would like to contribute improvements to this plugin, the easiest way to
make and test changes is to do the following:

1. Clone the main Backstage monorepo `git clone git@github.com:backstage/backstage.git`
2. Install all dependencies `yarn install`
3. If one does not exist, create an `app-config.local.yaml` file in the root of
   the monorepo and add config for this plugin (see below)
4. Enter this plugin's working directory: `cd plugins/analytics-provider-nr`
5. Start the plugin in isolation: `yarn start`
6. Navigate to the playground page at `http://localhost:3000/nr`
7. Open the web console to see events fire when you navigate or when you
   interact with instrumented components.

Code for the isolated version of the plugin can be found inside the [/dev](./dev)
directory. Changes to the plugin are hot-reloaded.

#### Recommended Dev Config

Paste this into your `app-config.local.yaml` while developing this plugin:

```yaml
app:
  analytics:
    nr:
      accountId: '1234567'
      applicationId: '987654321'
      licenseKey: 'NRJS-12a3456bc78de9123f4'
      distributedTracingEnabled: true
      cookiesEnabled: true
      useEuEndpoint: false
```
