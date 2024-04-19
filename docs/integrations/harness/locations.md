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
```

Directly under the `harnessCode` key is a list of provider configurations, where you
can list the Gitea instances you want to be able to fetch
data from. Each entry is a structure with up to four elements:

- `host`: The host of the Harness Code instance that you want to match on.
- `baseUrl` (optional): Needed if the Harness Code instance is not reachable at
  the base of the `host` option (e.g. `https://app.harness.io`). This is the address that you would open in a browser.
- `username` (optional): The gitea username to use in API requests.
- `token` (optional): The password or api token to authenticate with.
