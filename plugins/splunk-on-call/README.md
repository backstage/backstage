# Splunk-On-Call

## Overview

## Setup instructions

Install the plugin:

```bash
yarn add @backstage/plugin-splunkoncall
```

Add it to the app in `plugins.ts`:

```ts
export { plugin as Pagerduty } from '@backstage/plugin-splunkoncall';
```

Add it to the `EntityPage.ts`:

```ts
import {
  isPluginApplicableToEntity as isSplunkOnCallAvailable,
  SplunkOnCallCard,
} from '@backstage/plugin-splunkoncall';
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

## Providing the API Token

In order for the client to make requests to the [SplunkOnCall API](https://developer.splunkoncall.com/docs/rest-api-v2/rest-api/) it needs an [API Token](https://support.splunkoncall.com/docs/generating-api-keys#generating-a-general-access-rest-api-key).

Then start the backend passing the token as an environment variable:

```bash
$ SPLUNK_ON_CALL_API_KEY='' SPLUNK_ON_CALL_API_ID='' yarn start
```

This will proxy the request by adding `X-VO-Api-Id` and `X-VO-Api-Key` headers with the provided values.
