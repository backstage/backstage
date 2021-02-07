# Splunk On-Call

## Overview

This plugin displays Splunk On-Call information about an entity.

There is a way to trigger an new incident directly to specific users or/and specific teams.

This plugin requires that entities are annotated with a team name. See more further down in this document.

This plugin provides:

- A list of incidents
- A way to trigger a new incident to specific users or/and teams
- A way to acknowledge/resolve an incident
- Information details about the persons on-call

## Setup instructions

Install the plugin:

```bash
yarn add @backstage/plugin-splunkoncall
```

Add it to the app in `plugins.ts`:

```ts
export { plugin as SplunkOnCall } from '@backstage/plugin-splunk-on-call';
```

Add it to the `EntityPage.ts`:

```ts
import {
  isPluginApplicableToEntity as isSplunkOnCallAvailable,
  SplunkOnCallCard,
} from '@backstage/plugin-splunk-on-call';
// add to code
{
  isSplunkOnCallAvailable(entity) && (
    <Grid item md={6}>
      <SplunkOnCallCard entity={entity} />
    </Grid>
  );
}
```

## Client configuration

In order to be able to perform certain action (create-acknowledge-resolve an action), you need to provide the username of the user making the action.
The user supplied must be a valid Splunk On-Call user and a member of your organization.

In `app-config.yaml`:

```yaml
splunkOnCall:
  username: <SPLUNK_ON_CALL_USERNAME>
```

The user supplied must be a valid Splunk On-Call user and a member of your organization.

In order to be able to make certain API calls you need to add the `PATCH` method to the backend cors methods list.

```yaml
backend:
  # ...
  cors:
    methods: [GET, POST, PUT, DELETE, PATCH]
```

### Adding your team name to the entity annotation

The information displayed for each entity is based on the team name.
If you want to use this plugin for an entity, you need to label it with the below annotation:

```yaml
annotations:
  splunk-on-call.com/team: <SPLUNK_ON_CALL_TEAM_NAME>
```

## Providing the API key and API id

In order for the client to make requests to the [Splunk On-Call API](https://portal.victorops.com/public/api-docs.html#/) it needs an [API ID and an API Key](https://help.victorops.com/knowledge-base/api/).

Then start the backend passing the values as an environment variable:

```bash
$ SPLUNK_ON_CALL_API_KEY='' SPLUNK_ON_CALL_API_ID='' yarn start
```

This will proxy the request by adding `X-VO-Api-Id` and `X-VO-Api-Key` headers with the provided values.
