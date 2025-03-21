---
id: locations
title: Gitea Locations
sidebar_label: Locations
description: Integrating source code stored in Gitea into the Backstage catalog
---

The Gitea integration supports loading catalog entities from a hosted repository. Entities can be added to
[static catalog configuration](../../features/software-catalog/configuration.md),
registered with the
[catalog-import](https://github.com/backstage/backstage/tree/master/plugins/catalog-import)
plugin.

## Configuration

To use this integration, add configuration to your root `app-config.yaml`:

```yaml
integrations:
  gitea:
    - host: gitea.example.com
      password: ${GITEA_TOKEN}
    - host: gitea.example.com
      username: ${GITEA_USERNAME}
      password: ${GITEA_PASSWORD}
```

Directly under the `gitea` key is a list of provider configurations, where you
can list the Gitea instances you want to be able to fetch
data from. Each entry is a structure with up to four elements:

- `host`: The host of the gitea instance that you want to match on.
- `baseUrl` (optional): Needed if the Gitea instance is not reachable at
  the base of the `host` option (e.g. `https://git.company.com/gitea`). This is the address that you would open in a browser.
- `username` (optional): The gitea username to use in API requests.
- `password` (optional): The password or api token to authenticate with.

You may supply only the `password` field, if authenticating via API access tokens (generated in Settings > Applications).
