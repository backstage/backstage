---
id: locations
title: Harness Locations
sidebar_label: Locations
description: Integrating source code stored in Harness Code into the Backstage catalog
---

The Harness Code integration supports loading catalog entities from a hosted repository. Entities can be added to
[static catalog configuration](../../features/software-catalog/configuration.md),
registered with the
[catalog-import](https://github.com/backstage/backstage/tree/master/plugins/catalog-import)
plugin.

## Configuration

To use this integration, add configuration to your root `app-config.yaml`:

```yaml
integrations:
  harness:
    - host: app.harness.io
      token: ${HARNESS_CODE_BEARER_TOKEN}
      apiKey: ${HARNESS_CODE_APIKEY}
```

Directly under the `harness` key is a list of provider configurations, where you
can list the Harness instances you want to be able to fetch

check out https://developer.harness.io/docs/platform/automation/api/add-and-manage-api-keys/ for more information

- `host`: The host of the Harness Code instance that you want to match on.
- `token` (optional): The password or api token to authenticate with.
- `apiKey` (optional): The apiKey to authenticate with.
