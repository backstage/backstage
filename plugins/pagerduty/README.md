# PagerDuty + Backstage Integration Benefits

- Display relevant PagerDuty information about an entity within Backstage, such as the escalation policy, if there are any active incidents, and recent changes
- Trigger an incident to the currently on-call responder(s) for a service

# How it Works

- The Backstage PagerDuty plugin allows PagerDuty information about a Backstage entity to be displayed within Backstage. This includes active incidents, recent change events, as well as the current on-call responders' names, email addresses, and links to their profiles in PagerDuty.
- Incidents can be manually triggered via the plugin with a user-provided description, which will in turn notify the current on-call responders.

# Requirements

- Setup of the PagerDuty plugin for Backstage requires a PagerDuty Admin role in order to generate the necessary authorizations, such as the API token. If you do not have this role, please reach out to an Admin or Account Owner within your organization to request configuration of this plugin.

# Support

If you need help with this plugin, please reach out on the [Backstage Discord server](https://discord.gg/MUpMjP2).

# Integration Walk-through

## In PagerDuty

### Integrating With a PagerDuty Service

1. From the **Configuration** menu, select **Services**.
2. Get the service id (End of the URL for a specific service <org>.missionlane.com/service-directory/<service-id>)
3. Add the annotation of `pagerduty.com/service-id: <service-id>` to the catalog-info.yaml

## In Backstage

### Install the plugin

The file paths mentioned in the following steps are relative to your app's root directory — for example, the directory created by following the [Getting Started](https://backstage.io/docs/getting-started/) guide and creating your app with `npx @backstage/create-app`.

First, install the PagerDuty plugin via a CLI:

```bash
# From your Backstage app root directory
cd packages/app
yarn add @backstage/plugin-pagerduty
```

Next, add the plugin to `EntityPage.tsx` in `packages/app/src/components/catalog` by adding the following code snippets.

Add the following imports to the top of the file:

```ts
import {
  isPluginApplicableToEntity as isPagerDutyAvailable,
  EntityPagerDutyCard,
} from '@backstage/plugin-pagerduty';
```

Find `const overviewContent` in `EntityPage.tsx`, and add the following snippet inside the outermost `Grid` defined there, just before the closing `</Grid>` tag:

```ts
<EntitySwitch>
  <EntitySwitch.Case if={isPagerDutyAvailable}>
    <Grid item md={6}>
      <EntityPagerDutyCard />
    </Grid>
  </EntitySwitch.Case>
</EntitySwitch>
```

When you're done, the `overviewContent` definition should look something like this:

```ts
const overviewContent = (
  <Grid ...>
    ...
    <EntitySwitch>
      <EntitySwitch.Case if={isPagerDutyAvailable}>
        <Grid item md={6}>
          <EntityPagerDutyCard />
        </Grid>
      </EntitySwitch.Case>
    </EntitySwitch>
  </Grid>
);
```

### Configure the plugin

First, [annotate](https://backstage.io/docs/features/software-catalog/descriptor-format#annotations-optional) the appropriate entity with the PagerDuty integration key in its `.yaml` configuration file:

```yaml
annotations:
  pagerduty.com/service-id: [SERVICE_ID]
```

Next, provide the [API token](https://support.pagerduty.com/docs/generating-api-keys#generating-a-general-access-rest-api-key) that the client will use to make requests to the [PagerDuty API](https://developer.pagerduty.com/docs/rest-api-v2/rest-api/).

Add the proxy configuration in `app-config.yaml`:

```yaml
proxy:
  ...
  '/pagerduty':
    target: https://api.pagerduty.com
    headers:
      Authorization: Token token=${PAGERDUTY_TOKEN}
```

Then, start the backend, passing the PagerDuty API token as an environment variable:

```bash
$ PAGERDUTY_TOKEN='<TOKEN>' yarn start
```

This will proxy the request by adding an `Authorization` header with the provided token.

### Optional configuration

If you want to override the default URL used for events, you can add it to `app-config.yaml`:

```yaml
pagerduty:
  eventsBaseUrl: 'https://events.pagerduty.com/v2'
```

# How to Uninstall

1. Remove any configuration added in Backstage yaml files, such as the proxy configuration in `app-config.yaml` and the integration key in an entity's annotations.
2. Remove the added code snippets from `EntityPage.tsx`
3. Remove the plugin package:

```bash
# From your Backstage root directory
cd packages/app
yarn remove @backstage/plugin-pagerduty
```

4. [Delete the integration](https://support.pagerduty.com/docs/services-and-integrations#delete-an-integration-from-a-service) from the service in PagerDuty

# Feature Overview

## View any open incidents

![PagerDuty plugin showing no incidents and the on-call rotation](doc/pd1.png)

## Email link, and view contact information for staff on call

![PagerDuty plugin showing on-call rotation contact information](doc/pd2.png)

## Trigger an incident for a service

![PagerDuty plugin popup modal for creating an incident](doc/pd3.png)

![PagerDuty plugin showing an active incident](doc/pd4.png)
