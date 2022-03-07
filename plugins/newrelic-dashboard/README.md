# New Relic Dashboard Plugin

Welcome to the newrelic-dashboard plugin!

## Features

- Adds New Relic Dashboard Pages Links to Overview section of the catalog
- Shows Snapshots of dashboards in New Relic

## Getting started

This plugin uses the Backstage proxy to securely communicate with New Relic's APIs. We use NerdGraph (New Relic's GraphQL API)

To generate a New Relic API Key , you can visit this [link](https://one.newrelic.com/launcher/api-keys-ui.api-keys-launcher)

1. Add the following to your app-config.yaml to enable this configuration:

```
// app-config.yaml
proxy:
  '/newrelic/api':
    target: https://api.newrelic.com
    headers:
      X-Api-Key: ${NEW_RELIC_USER_KEY}
```

2. Add the following to `EntityPage.tsx` to display New Relic Dashboard Tab

```
// In packages/app/src/components/catalog/EntityPage.tsx
import {
  isNewRelicDashboardAvailable,
  EntityNewRelicDashboardContent,
  EntityNewRelicDashboardCard,
} from '@backstage/plugin-newrelic-dashboard';

const serviceEntityPage = (
  <EntityLayout>
    {/* other tabs... */}
    <EntityLayout.Route
      if={isNewRelicDashboardAvailable}
      path="/newrelic-dashboard"
      title="New Relic Dashboard"
    >
      <EntityNewRelicDashboardContent />
    </EntityLayout.Route>
```

3. Add the following in `EntityPage.tsx` to display dashboard links in overview page

```
const overviewContent = (
    {/* other tabs... */}
    <EntitySwitch>
      <EntitySwitch.Case if={isNewRelicDashboardAvailable}>
        <Grid item md={6} xs={12}>
          <EntityNewRelicDashboardCard />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>
```

4. Add `newrelic.com/dashboard-guid` annotation in catalog descriptor file

To Obtain the dashboard's GUID: Click the info icon by the dashboard's name to access the See metadata and manage tags modal and see the dashboard's GUID.

```
// catalog-info.yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  # ...
  annotations:
    newrelic.com/dashboard-guid: <dashboard_guid>
spec:
  type: service
```

All set , you will be able to see the plugin in action!
