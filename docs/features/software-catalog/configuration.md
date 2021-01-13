---
id: configuration
title: Catalog Configuration
description: Documentation on Software Catalog Configuration
---

## Processors

The catalog makes use of so called processors to perform all kinds of ingestion
tasks, such as reading raw entity data from a remote source, parsing it,
transforming it, and validating it. These processors are configured under the
`catalog.processors` key.

### Processor: url

The `url` processor is responsible for fetching entity data from files in any
external provider like GitHub, GitLab, Bitbucket, etc. The configuration of this
processor lives under the top-level `integrations` key, as it is used by other
parts of Backstage too.

```yaml
integrations:
  github:
    - host: github.com
      token:
        $env: GITHUB_TOKEN
    - host: ghe.example.net
      apiBaseUrl: https://ghe.example.net/api/v3
      rawBaseUrl: https://ghe.example.net/raw
      token:
        $env: GHE_TOKEN
  gitlab:
    - host: gitlab.com
      token:
        $env: GITLAB_TOKEN
  bitbucket:
    - host: bitbucket.org
      username:
        $env: BITBUCKET_USERNAME
      appPassword:
        $env: BITBUCKET_APP_PASSWORD
  azure:
    - host: dev.azure.com
      token:
        $env: AZURE_TOKEN
```

Each key under `integrations` is a separate configuration for each external
provider. The providers each have their own configuration, so let's look at the
GitHub section as an example.

Directly under the `github` key is a list of provider configurations, where you
can list the various GitHub compatible providers you want to be able to fetch
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
  is commonly at `https://api.<host>` or `https://<host>/api/v3`.

You need to supply either `apiBaseUrl` or `rawBaseUrl` or both (except for
public GitHub, for which we can infer them). The `apiBaseUrl` will always be
preferred over the other if a `token` is given, otherwise `rawBaseUrl` will be
preferred.

If you do not supply a public GitHub provider, one will be added automatically,
silently at startup for convenience. So you only have to list it if you want to
supply a token for it - and if you do, you can also leave out the `apiBaseUrl`
and `rawBaseUrl` fields.

## Static Location Configuration

To enable declarative catalog setups, it is possible to add locations to the
catalog via [static configuration](../../conf/index.md). Locations are added to
the catalog under the `catalog.locations` key, for example:

```yaml
catalog:
  locations:
    - type: url
      target: https://github.com/backstage/backstage/blob/master/packages/catalog-model/examples/artist-lookup-component.yaml
```

The locations added through static configuration can not be removed through the
catalog locations API. To remove the locations, you have to remove them from the
configuration.

## Catalog Rules

By default the catalog will only allow ingestion of entities with the kind
`Component`, `API` and `Location`. In order to allow entities of other kinds to
be added, you need to add rules to the catalog. Rules are added either in a
separate `catalog.rules` key, or added to statically configured locations.

For example, given the following configuration:

```yaml
catalog:
  rules:
    - allow: [Component, API, Location, Template]

  locations:
    - type: url
      target: https://github.com/org/example/blob/master/org-data.yaml
      rules:
        - allow: [Group]
```

We are able to add entities of kind `Component`, `API`, `Location`, or
`Template` from any location, and `Group` entities from the `org-data.yaml`,
which will also be read as statically configured location.

Note that if the `catalog.rules` key is present it will replace the default
value, meaning that you need to add rules for the default kinds if you want
those to still be allowed.

The following configuration will reject any kind of entities from being added to
the catalog:

```yaml
catalog:
  rules: []
```
