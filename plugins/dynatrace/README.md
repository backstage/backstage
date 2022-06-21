# Dynatrace

Welcome to the Dynatrace plugin!

## Getting started

This plugin uses the Backstage proxy to communicate with Dynatrace's REST APIs.

### Setup

#### Dynatrace API Key

The Dynatrace plugin will require the following information, to be used in the configuration options detailed below:

- Dynatrace API URL, e.g. `https://my-dynatrace-instance.dynatrace.com/api/v2`
- Dynatrace API access token (see [documentation](https://www.dynatrace.com/support/help/dynatrace-api/basics/dynatrace-api-authentication)), with the following permissions:
  - `entities.read`
  - `problems.read`

#### Plugin Configuration

This plugin requires a proxy endpoint for Dynatrace configured in `app-config.yaml` like so:

```yaml
proxy:
  '/dynatrace':
    target: 'https://example.dynatrace.com/api/v2'
    headers:
      Authorization: 'Api-Token ${DYNATRACE_ACCESS_TOKEN}'
```

It also requires a baseUrl for rendering links to problems in the table like so:

```yaml
dynatrace:
  baseUrl: 'https://example.dynatrace.com'
```

#### Catalog Configuration

To show information from Dynatrace for a catalog entity, add the following annotation to `catalog-info.yaml`:

```yaml
# catalog-info.yaml
# [...]
metadata:
  annotations:
    dynatrace.com/dynatrace-entity-id: DYNATRACE_ENTITY_ID
# [...]
```

The `DYNATRACE_ENTITY_ID` can be found in Dynatrace by browsing to the entity (a service, synthetic, frontend, workload, etc.). It will be located in the browser address bar in the `id` parameter and has the format `ENTITY_TYPE-ENTITY_ID`, where `ENTITY_TYPE` will be one of `SERVICE`, `SYNTHETIC_TEST`, or other, and `ENTITY_ID` will be a string of characters containing uppercase letters and numbers.

## Disclaimer

This plugin is not officially supported by Dynatrace.
