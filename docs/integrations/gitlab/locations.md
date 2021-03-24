---
id: locations
title: GitLab Locations
sidebar_label: Locations
description: Integrating source code stored in GitLab into the Backstage catalog
---

The GitLab integration supports loading catalog entities from gitlab.com or a
self-hosted GitLab. Entities can be added to
[static catalog configuration](../../features/software-catalog/configuration.md),
or registered with the
[catalog-import](https://github.com/backstage/backstage/tree/master/plugins/catalog-import)
plugin.

```yaml
integrations:
  gitlab:
    - host: gitlab.com
      token: ${GITLAB_TOKEN}
```

> Note: A public GitLab provider is added automatically at startup for
> convenience, so you only need to list it if you want to supply a
> [token](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html).

Directly under the `gitlab` key is a list of provider configurations, where you
can list the GitLab providers you want to fetch data from. Each entry is a
structure with up to four elements:

- `host`: The host of the GitLab instance, e.g. `gitlab.company.com`.
- `token` (optional): An authentication token as expected by GitLab. If this is
  not supplied, anonymous access will be used.
- `apiBaseUrl` (optional): The URL of the GitLab API. For self-hosted
  installations, it is commonly at `https://<host>/api/v4`. For gitlab.com, this
  configuration is not needed as it can be inferred.
- `baseUrl` (optional): The base URL for this provider, e.g.
  `https://gitlab.com`. If this is not provided, it is assumed to be
  `https://{host}`.
