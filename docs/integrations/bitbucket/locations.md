---
id: locations
title: BitBucket Locations
sidebar_label: Locations
description: Documentation on BitBucket location integration
---

The BitBucket integration supports loading catalog entities from bitbucket.com
or a self-hosted BitBucket. Components can be added to
[static catalog configuration](../../features/software-catalog/configuration.md),
or registered with the
[catalog-import](https://github.com/backstage/backstage/tree/master/plugins/catalog-import)
plugin.

```yaml
integrations:
  bitbucket:
    - host: bitbucket.org
      username:
        $env: BITBUCKET_USERNAME
      token:
        $env: BITBUCKET_TOKEN
```

> Note: A public BitBucket provider is added automatically at startup for
> convenience, so you only need to list it if you want to supply a
> [token](https://confluence.atlassian.com/bitbucketserver/personal-access-tokens-939515499.html).

Directly under the `bitbucket` key is a list of provider configurations, where
you can list the BitBucket providers you want to fetch data from. Each entry is
a structure with up to four elements:

- `host`: The host of the BitBucket instance, e.g. `bitbucket.company.com`.
- `username`: The BitBucket username to use in API requests. If a username is
  not supplied, anonymous access will be used.
- `token` (optional): An personal access token as expected by BitBucket. Either
  an access token **or** a password may be supplied.
- `appPassword` (optional): The password for the BitBucket user. Either an
  appPassword **or** an access token may be supplied.
- `apiBaseUrl` (optional): The URL of the GitLab API. For self-hosted
  installations, it is commonly at `https://<host>/api/v4`. For gitlab.com, this
  configuration is not needed as it can be inferred.
