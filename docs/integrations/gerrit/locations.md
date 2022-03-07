---
id: locations
title: Gerrit Locations
sidebar_label: Locations
description: Integrating source code stored in Gerrit into the Backstage catalog
---

The Gerrit integration supports loading catalog entities from Gerrit hosted gits. Entities can
be added to [static catalog configuration](../../features/software-catalog/configuration.md),
or registered with the
[catalog-import](https://github.com/backstage/backstage/tree/master/plugins/catalog-import)
plugin.

## Configuration

To use this integration, add configuration to your root `app-config.yaml`:

```yaml
integrations:
  gerrit:
    - host: gerrit.company.com
      apiBaseUrl: gerrit.company.com/gerrit
      username: ${GERRIT_USERNAME}
      password: ${GERRIT_PASSWORD}
```

Directly under the `gerrit` key is a list of provider configurations, where
you can list the Gerrit instances you want to fetch data from. Each entry is
a structure with up to four elements:

- `host`: The host of the Gerrit instance, e.g. `gerrit.company.com`.
- `apiBaseUrl`: The base url of the Gerrit API. This would typically be the address
  up to but not including the authentication ("/a/") prefix.
- `username` (optional): The Gerrit username to use in API requests. If
  neither a username nor password are supplied, anonymous access will be used.
- `password` (optional): The password or http token for the Gerrit user.
