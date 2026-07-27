# Usage analytics

The usage analytics plugin provides first-party, privacy-conscious analytics
for a Backstage installation that uses the legacy frontend system. It collects
events already emitted through the Backstage Analytics API, reports online
presence, and provides an administrative dashboard.

## Integrate the frontend plugin

Install the package in the frontend workspace:

```shell
yarn --cwd packages/app add @backstage/plugin-usage-analytics
```

The plugin supports the legacy frontend created with
`@backstage/app-defaults`. Complete the following steps in
`packages/app/src/App.tsx`.

### Register the plugin and collector

Register `usageAnalyticsPlugin` in the `plugins` array and
`usageAnalyticsCollectorApi` in the app-level `apis` array:

```tsx
import { createApp } from '@backstage/app-defaults';
import {
  usageAnalyticsCollectorApi,
  usageAnalyticsPlugin,
} from '@backstage/plugin-usage-analytics';
import { apis } from './apis';

const app = createApp({
  plugins: [usageAnalyticsPlugin],
  apis: [...apis, usageAnalyticsCollectorApi],
});
```

The collector must be registered in the app-level `apis` array. The plugin
itself only registers the client used to query usage reports. If the app does
not have a separate `apis` array, use `apis: [usageAnalyticsCollectorApi]`.

### Add the dashboard route

Import `UsageAnalyticsPage` and mount it inside the app's `FlatRoutes`:

```tsx
import { FlatRoutes } from '@backstage/core-app-api';
import { UsageAnalyticsPage } from '@backstage/plugin-usage-analytics';
import { Route } from 'react-router-dom';

const routes = (
  <FlatRoutes>
    {/* Existing routes */}
    <Route path="/usage-analytics" element={<UsageAnalyticsPage />} />
  </FlatRoutes>
);
```

The dashboard is now available at `/usage-analytics`. It requires
`usageAnalyticsReadAggregatesPermission`. The **Users** and **Sessions** tabs
additionally require `usageAnalyticsReadDetailsPermission`.

### How collection works

The collector buffers analytics events in the browser and sends presence
heartbeats independently. User identity is resolved by the backend from
Backstage credentials and is never accepted from the browser. Each open tab
has a separate session identifier. No additional instrumentation is required
for events already emitted through the Backstage Analytics API.

## Combine analytics implementations

An app can only register one factory for `analyticsApiRef`. If the app already
uses another analytics implementation, create one app-level factory that
forwards events to both implementations:

```tsx
import { MultipleAnalyticsApi } from '@backstage/core-app-api';
import {
  analyticsApiRef,
  createApiFactory,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import {
  UsageAnalyticsCollector,
  usageAnalyticsPlugin,
} from '@backstage/plugin-usage-analytics';

const combinedAnalyticsApi = createApiFactory({
  api: analyticsApiRef,
  deps: {
    discoveryApi: discoveryApiRef,
    fetchApi: fetchApiRef,
  },
  factory: ({ discoveryApi, fetchApi }) =>
    MultipleAnalyticsApi.fromApis([
      new UsageAnalyticsCollector({ discoveryApi, fetchApi }),
      otherAnalyticsApi,
    ]),
});

const app = createApp({
  plugins: [usageAnalyticsPlugin],
  apis: [...apis, combinedAnalyticsApi],
});
```

In this example, `otherAnalyticsApi` is the app's existing `AnalyticsApi`
implementation. Register either `usageAnalyticsCollectorApi` or
`combinedAnalyticsApi`, but not both, because an app can only have one factory
for `analyticsApiRef`.

## Install the backend plugin

Add the backend plugin to the Backstage backend:

```ts
backend.add(import('@backstage/plugin-usage-analytics-backend'));
```
