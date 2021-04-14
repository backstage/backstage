# @backstage/plugin-ilert

## Introduction

[iLert](https://www.ilert.com) is a platform for alerting, on-call management and uptime monitoring. It helps teams to reduce response times to critical incidents by extending monitoring tools with reliable alerting, automatic escalations, on-call schedules and other features to support the incident response process, such as [informing stakeholders](https://docs.ilert.com/getting-started/stakeholder-engagement) or creating tickets in external incident management tools.

## Overview

This plugin displays iLert information about an entity such as if there are any active incidents, wo is on-call now and uptime monitor status.

There is also an easy way to trigger an incident directly to the person who is currently on-call.

This plugin provides:

- Information details about the persons on-call
- A way to override current person on-call
- A list of incidents
- A way to trigger a new incident
- A way to reassign/acknowledge/resolve an incident
- A way to trigger an incident action
- A way to trigger an immediate maintenance
- A way to disable/enable an alert source
- A list of uptime monitors

## Setup instructions

Install the plugin:

```bash
yarn add @backstage/plugin-ilert
```

Then make sure to export the plugin in your app's [`plugins.ts`](https://github.com/backstage/backstage/blob/master/packages/app/src/plugins.ts)
to enable the plugin:

```js
export { plugin as ILert } from '@backstage/plugin-ilert';
```

Add it to the `EntityPage.tsx`:

```ts
import {
  isPluginApplicableToEntity as isILertAvailable,
  EntityILertCard,
} from '@backstage/plugin-ilert';
{
  isILertAvailable(entity) && (
    <Grid item md={6}>
      <EntityILertCard />
    </Grid>
  );
}
```

> To force iLert card for each entity just add the `<EntityILertCard />` component, so an instruction card will appears if no integration key is set.

## Add iLert explorer to the App sidebar

Modify your app routes in [`App.tsx`](https://github.com/backstage/backstage/blob/master/packages/app/src/App.tsx) to include the Router component exported from the plugin, for example:

```tsx
import { ILertPage } from '@backstage/plugin-ilert';

<Routes>
  // ...
  <Route path="/ilert" element={<ILertPage />} />
  // ...
</Routes>;
```

Modify your sidebar in [`Root.tsx`](https://github.com/backstage/backstage/blob/master/packages/app/src/components/Root/Root.tsx) to include the icon component exported from the plugin, for example:

```tsx
import { ILertIcon } from '@backstage/plugin-ilert';

<Sidebar>
  // ...
  <SidebarItem icon={ILertIcon} to="ilert" text="iLert" />
  // ...
</Sidebar>;
```

## Client configuration

If you want to override the default URL for api calls and detail pages, you can add it to `app-config.yaml`.

In `app-config.yaml`:

```yaml
ilert:
  baseUrl: https://my-org.ilert.com/
```

## Providing the Authorization Header

In order to make the API calls, you need to provide a new proxy config which will redirect to the [iLert API](https://api.ilert.com/api-docs/) endpoint it needs an [Authorization Header](https://api.ilert.com/api-docs/#section/Authentication).

Add the proxy configuration in `app-config.yaml`

```yaml
proxy:
  ...
  '/ilert':
    target: https://api.ilert.com
    allowedMethods: ['GET', 'POST', 'PUT']
    allowedHeaders: ['Authorization']
    headers:
      Authorization:
        $env: ILERT_AUTH_HEADER
```

Then start the backend passing the token as an environment variable:

```bash
$ ILERT_AUTH_HEADER='Basic <TOKEN>' yarn start
```

## Integration Key

The information displayed for each entity is based on the [alert source integration key](https://docs.ilert.com/integrations/backstage).

### Adding the integration key to the entity annotation

If you want to use this plugin for an entity, you need to label it with the below annotation:

```yml
annotations:
  ilert.com/integration-key: [INTEGRATION_KEY]
```
