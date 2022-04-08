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

To use this integration, add at least one Gerrit configuration to your root `app-config.yaml`:

```yaml
integrations:
  gerrit:
    - host: gerrit.company.com
      apiBaseUrl: https://gerrit.company.com/gerrit
      gitilesBaseUrl: https://gerrit.company.com/gitiles
      username: ${GERRIT_USERNAME}
      password: ${GERRIT_PASSWORD}
```

Directly under the `gerrit` key is a list of provider configurations, where
you can list the Gerrit instances you want to fetch data from. Each entry is
a structure with up to four elements:

- `host`: The host of the Gerrit instance, e.g. `gerrit.company.com`.
- `apiBaseUrl` (optional): Needed if the Gerrit instance is not reachable at
  the base of the `host` option (e.g. `https://gerrit.company.com`) set the
  address here. This is the address that you would open in a browser.
- `gitilesBaseUrl` (optional): This is needed for creating a valid user-friendly url
  that can be used for browsing the content of the provider. If not set a default
  value will be created in the same way as the "baseUrl" option. There is no
  requirement to have Gitiles for the Backstage Gerrit integration but without it
  some links in the Backstage UI will be broken.
- `username` (optional): The Gerrit username to use in API requests. If
  neither a username nor password are supplied, anonymous access will be used.
- `password` (optional): The password or http token for the Gerrit user.
