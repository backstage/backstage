---
id: locations
title: Bitbucket Cloud Locations
sidebar_label: Locations
description: Integrating source code stored in Bitbucket Cloud into the Backstage catalog
---

The Bitbucket Cloud integration supports loading catalog entities from [bitbucket.org](https://bitbucket.org).
Entities can be added to
[static catalog configuration](../../features/software-catalog/configuration.md),
or registered with the
[catalog-import](https://github.com/backstage/backstage/tree/master/plugins/catalog-import)
plugin.

## Configuration

API token usage example (recommended):

```yaml
integrations:
  bitbucketCloud:
    - username: user@domain.com # username -> user email
      token: my-token
```

Legacy:

```yaml
integrations:
  bitbucketCloud:
    - username: username
      appPassword: my-password
```

OAuth 2.0 client credentials flow:

```yaml
integrations:
  bitbucketCloud:
    - clientId: client-id
      clientSecret: client-secret
```

:::note Note

A public Bitbucket Cloud provider is added automatically at startup for
convenience, so you only need to list it if you want to supply credentials.

:::

:::note Note

The credential required for this type is either an [Api token](https://support.atlassian.com/bitbucket-cloud/docs/using-api-tokens/), an [App Password](https://support.atlassian.com/bitbucket-cloud/docs/app-passwords/) or an [OAuth 2.0 client credentials](https://support.atlassian.com/bitbucket-cloud/docs/use-oauth-on-bitbucket-cloud/). An Atlassian Account API key will not work.

:::

Directly under the `bitbucketCloud` key is a list of provider configurations, where
you can list the Bitbucket Cloud providers you want to fetch data from.
In the case of Bitbucket Cloud, you will have up to one entry.

This one entry will have the following elements:

- `username`: The Bitbucket Cloud username to use in API requests. If
  neither a username nor token are supplied, anonymous access will be used.
- `token`: The token used to authenticate requests.
- `appPassword`: The app password for the Bitbucket Cloud user.
- `clientId`: The OAuth client ID for Bitbucket Cloud (used with `clientSecret` for OAuth 2.0 client credentials flow).
- `clientSecret`: The OAuth client secret for Bitbucket Cloud (used with `clientId` for OAuth 2.0 client credentials flow).
