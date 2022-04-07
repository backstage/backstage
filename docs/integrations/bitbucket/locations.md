---
id: locations
title: Bitbucket Locations
sidebar_label: Locations
# prettier-ignore
description: Integrating source code stored in Bitbucket into the Backstage catalog
---

The Bitbucket integration supports loading catalog entities from bitbucket.org (Bitbucket Cloud)
or Bitbucket Server. Entities can be added to
[static catalog configuration](../../features/software-catalog/configuration.md),
or registered with the
[catalog-import](https://github.com/backstage/backstage/tree/master/plugins/catalog-import)
plugin.

## Bitbucket Cloud

```yaml
integrations:
  bitbucketCloud:
    - username: ${BITBUCKET_CLOUD_USERNAME}
      appPassword: ${BITBUCKET_CLOUD_PASSWORD}
```

> Note: A public Bitbucket Cloud provider is added automatically at startup for
> convenience, so you only need to list it if you want to supply credentials.

Directly under the `bitbucketCloud` key is a list of provider configurations, where
you can list the Bitbucket Cloud providers you want to fetch data from.
In the case of Bitbucket Cloud, you will have up to one entry.

This one entry will have the following elements:

- `username`: The Bitbucket Cloud username to use in API requests. If
  neither a username nor token are supplied, anonymous access will be used.
- `appPassword`: The app password for the Bitbucket Cloud user.

## Bitbucket Server

```yaml
integrations:
  bitbucketServer:
    - host: bitbucket.company.com
      token: ${BITBUCKET_SERVER_TOKEN}
```

Directly under the `bitbucketServer` key is a list of provider configurations, where
you can list the Bitbucket Server providers you want to fetch data from. Each entry is
a structure with the following elements:

- `host`: The host of the Bitbucket Server instance, e.g. `bitbucket.company.com`.
- `token` (optional):
  An [personal access token](https://confluence.atlassian.com/bitbucketserver/personal-access-tokens-939515499.html)
  as expected by Bitbucket Server.
- `apiBaseUrl` (optional): The URL of the Bitbucket Server API. For self-hosted
  installations, it is commonly at `https://<host>/rest/api/1.0`.
