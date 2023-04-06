---
id: locations
title: Bitbucket Server Locations
sidebar_label: Locations
# prettier-ignore
description: Integrating source code stored in Bitbucket Server into the Backstage catalog
---

The Bitbucket Server integration supports loading catalog entities from Bitbucket Server.
Entities can be added to
[static catalog configuration](../../features/software-catalog/configuration.md),
or registered with the
[catalog-import](https://github.com/backstage/backstage/tree/master/plugins/catalog-import)
plugin.

## Configuration

```yaml
integrations:
  bitbucketServer:
    - host: bitbucket.mycompany.com
      apiBaseUrl: https://bitbucket.mycompany.com/rest/api/1.0
      token: ${BITBUCKET_SERVER_TOKEN}
```

or with Basic Auth

```yaml
integrations:
  bitbucketServer:
    - host: bitbucket.company.com
      apiBaseUrl: https://bitbucket.mycompany.com/rest/api/1.0
      username: ${BITBUCKET_SERVER_USERNAME}
      password: ${BITBUCKET_SERVER_PASSWORD}
```

Directly under the `bitbucketServer` key is a list of provider configurations, where
you can list the Bitbucket Server providers you want to fetch data from. Each entry is
a structure with the following elements:

- `host`: The host of the Bitbucket Server instance, e.g. `bitbucket.mycompany.com`.
- `token` (optional):
  A [personal access token](https://confluence.atlassian.com/bitbucketserver/personal-access-tokens-939515499.html)
  as expected by Bitbucket Server.
- `username` (optional):
  use for [Basic Auth](https://developer.atlassian.com/server/bitbucket/how-tos/command-line-rest/#authentication) for Bitbucket Server.
- `password` (optional):
  use for [Basic Auth](https://developer.atlassian.com/server/bitbucket/how-tos/command-line-rest/#authentication) for Bitbucket Server.
  Note: a token can also be used as a substitute for the password, see [HTTP access tokens](https://confluence.atlassian.com/bitbucketserver/personal-access-tokens-939515499.html).
- `apiBaseUrl` (optional): The URL of the Bitbucket Server API. For self-hosted
  installations, it is commonly at `https://<host>/rest/api/1.0`.
