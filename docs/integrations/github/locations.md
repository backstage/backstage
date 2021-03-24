---
id: locations
title: GitHub Locations
sidebar_label: Locations
description: Integrating source code stored in GitHub into the Backstage catalog
---

The GitHub integration supports loading catalog entities from github.com or
GitHub Enterprise. Entities can be added to
[static catalog configuration](../../features/software-catalog/configuration.md),
registered with the
[catalog-import](https://github.com/backstage/backstage/tree/master/plugins/catalog-import)
plugin, or [discovered](discovery.md) from a GitHub organization. Users and
Groups can also be [loaded from an organization](org.md).

## Configuration

To use this integration, add configuration to your root `app-config.yaml`:

```yaml
integrations:
  github:
    - host: github.com
      token: ${GITHUB_TOKEN}
    - host: ghe.example.net
      apiBaseUrl: https://ghe.example.net/api/v3
      rawBaseUrl: https://ghe.example.net/raw
      token: ${GHE_TOKEN}
```

> Note: A public GitHub provider is added automatically at startup for
> convenience, so you only need to list it if you want to supply a
> [token](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token).

Directly under the `github` key is a list of provider configurations, where you
can list the various GitHub-compatible providers you want to be able to fetch
data from. Each entry is a structure with up to four elements:

- `host` (optional): The host of the location target that you want to match on.
  The default host is `github.com`.
- `token` (optional): An authentication token as expected by GitHub. If
  supplied, it will be passed along with all calls to this provider, both API
  and raw. If it is not supplied, anonymous access will be used.
- `apiBaseUrl` (optional): If you want to communicate using the APIv3 method
  with this provider, specify the base URL for its endpoint here, with no
  trailing slash. Specifically when the target is GitHub, you can leave it out
  to be inferred automatically. For a GitHub Enterprise installation, it is
  commonly at `https://api.<host>` or `https://<host>/api/v3`.
- `rawBaseUrl` (optional): If you want to communicate using the raw HTTP method
  with this provider, specify the base URL for its endpoint here, with no
  trailing slash. Specifically when the target is public GitHub, you can leave
  it out to be inferred automatically. For a GitHub Enterprise installation, it
  is commonly at `https://<host>/raw`.

You need to supply either `apiBaseUrl` or `rawBaseUrl` or both (except for
public GitHub, for which we can infer them). The `apiBaseUrl` will always be
preferred over the other if a `token` is given, otherwise `rawBaseUrl` will be
preferred.

## Authentication with GitHub Apps

Alternatively, Backstage can use GitHub Apps for backend authentication. This
has higher rate limits, and a clearer authorization model. See the
[github-apps plugin](../../plugins/github-apps.md) for how to set this up.
