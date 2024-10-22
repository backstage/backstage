---
id: locations
title: Bitbucket Cloud Locations
sidebar_label: Locations
# prettier-ignore
description: Integrating source code stored in Bitbucket Cloud into the Backstage catalog
---

The Bitbucket Cloud integration supports loading catalog entities from [bitbucket.org](https://bitbucket.org).
Entities can be added to
[static catalog configuration](../../features/software-catalog/configuration.md),
or registered with the
[catalog-import](https://github.com/backstage/backstage/tree/master/plugins/catalog-import)
plugin.

## Configuration

```yaml
integrations:
  bitbucketCloud:
    - username: ${BITBUCKET_CLOUD_USERNAME}
      appPassword: ${BITBUCKET_CLOUD_PASSWORD}
      throttling: # optional
        count: 1 # number of requests per interval
        # suppports ISO duration, "human duration" as used in code
        interval: { seconds: 1 }
```

:::note Note

A public Bitbucket Cloud provider is added automatically at startup for
convenience, so you only need to list it if you want to supply credentials.

:::

:::note Note

The credential used for this is type [App Password](https://support.atlassian.com/bitbucket-cloud/docs/app-passwords/). An Atlassian Account API key will not work.

:::

Directly under the `bitbucketCloud` key is a list of provider configurations, where
you can list the Bitbucket Cloud providers you want to fetch data from.
In the case of Bitbucket Cloud, you will have up to one entry.

This one entry will have the following elements:

- `username`: The Bitbucket Cloud username to use in API requests. If
  neither a username nor token are supplied, anonymous access will be used.
- `appPassword`: The app password for the Bitbucket Cloud user.
- `throttling` (optional): The throttling configuration for the Bitbucket Cloud client.
  - `count`: The number of requests per interval.
  - `interval`: The interval for the throttling. Supports ISO duration, "human duration".
