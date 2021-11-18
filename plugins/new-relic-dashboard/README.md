# New Relic Dashboard Plugin

Welcome to the new-relic-dashboard plugin!

## Features

- Adds New Relic Dashboard Pages Links to Overview section of the catalog
- Shows snapshot images of dashboards

## Getting started

This plugin uses the Backstage proxy to securely communicate with New Relic's APIs. Add the following to your app-config.yaml to enable this configuration:

```
proxy:
  '/newrelic/apm/api':
    target: https://api.newrelic.com/v2
    headers:
      X-Api-Key: ${NEW_RELIC_REST_API_KEY}
```
