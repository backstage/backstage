---
id: configuring-connections
title: Configure and manage connections
description: Create, change, scope, and migrate Backstage connection configuration
---

[Connections](./concepts.md#configured-connection) are configured as an array
at the root of `app-config.yaml`. The default service loads the array at
backend startup, validates every entry, and assigns display titles where they
are omitted.

:::caution[Experimental configuration]
The `connections` configuration format is experimental and can change while
the connections framework is developed.
:::

## Configure a connection

The following connection gives backend plugins token-authenticated access to
GitHub:

```yaml title="app-config.yaml"
connections:
  - type: github
    title: GitHub production
    host: github.com
    auth:
      - method: token
        token: ${GITHUB_TOKEN}
```

Set `type` to one of the
[built-in connection types](./built-in-connection-types.md). The
[connection type](./concepts.md#connection-type) determines the allowed
connection fields, [authentication methods](./concepts.md#authentication-method),
[lookup query](./concepts.md#lookup-queries), and validation rules.

Store secret values outside source control and reference them through
[environment variable substitution](../../../conf/writing.md#environment-variable-substitution).
The connection service validates the resolved values, so a missing or invalid
secret causes startup to fail with configuration context.

## Configure unauthenticated access

Every connection requires at least one
[authentication entry](./concepts.md#authentication-entry). When a type
supports unauthenticated access, use the `none` method:

```yaml title="app-config.yaml"
connections:
  - type: gitlab
    host: gitlab.com
    auth:
      - method: none
```

Not every type supports `none`. For example, `harness` requires token
authentication and `aws-codecommit` requires either access-key or assume-role
authentication.

## Configure multiple endpoints of one type

Connection types that use the host
[lookup strategy](./concepts.md#lookup-strategies) allow multiple entries when
each entry has a different host:

```yaml title="app-config.yaml"
connections:
  - type: github
    title: Public GitHub
    host: github.com
    auth:
      - method: token
        token: ${GITHUB_TOKEN}

  - type: github
    title: Company GitHub
    host: github.example.com
    apiBaseUrl: https://github.example.com/api/v3
    rawBaseUrl: https://github.example.com/raw
    auth:
      - method: token
        token: ${GITHUB_ENTERPRISE_TOKEN}
```

For host-based types, `ConnectionsService.find` parses the consumer's URL and
matches its host exactly. Do not include a scheme or path in `host`.

The default connection title is the connection type's title. When more than
one connection has the same type, the default includes the host, such as
`GitHub (github.example.com)`. Set `title` when an environment-specific name is
clearer.

Duplicate multiton connections with the same type and host are rejected.
Singleton types, such as `aws`, reject a second entry of the same type.

## Configure multiple authentication entries

A connection can contain more than one authentication entry. This supports
plugin-specific credentials and type-specific selection such as choosing a
GitHub App for one organization.

### Select a credential for a plugin

Use [plugin scoping](./concepts.md#plugin-scoping) through `match.plugins` on an
authentication entry to make it visible only to the listed plugin IDs:

```yaml title="app-config.yaml"
connections:
  - type: github
    host: github.com
    auth:
      - method: token
        title: Catalog token
        token: ${GITHUB_CATALOG_TOKEN}
        match:
          plugins:
            - catalog
      - method: token
        title: Default token
        token: ${GITHUB_DEFAULT_TOKEN}
```

For the `catalog` plugin, explicitly matched entries are placed before
unrestricted entries. Other plugins cannot see `GITHUB_CATALOG_TOKEN` and use
the unrestricted entry.

You can also restrict the complete connection:

```yaml title="app-config.yaml"
connections:
  - type: harness
    host: app.harness.io
    match:
      plugins:
        - harness
    auth:
      - method: token
        token: ${HARNESS_TOKEN}
```

Other plugins do not see this connection, even if they declare the `harness`
type.

:::note
Plugin matching controls which static credentials are handed to a backend
plugin. It does not grant external permissions or authorize frontend users.
:::

### Select a GitHub App by organization

The GitHub type uses the first path segment of the query URL as the
organization. It prefers an app whose `orgs` list contains that organization:

```yaml title="app-config.yaml"
connections:
  - type: github
    host: github.com
    auth:
      - method: app
        title: Backstage organization app
        appId: ${GITHUB_BACKSTAGE_APP_ID}
        privateKey: ${GITHUB_BACKSTAGE_PRIVATE_KEY}
        clientId: ${GITHUB_BACKSTAGE_CLIENT_ID}
        clientSecret: ${GITHUB_BACKSTAGE_CLIENT_SECRET}
        orgs:
          - backstage
      - method: token
        token: ${GITHUB_FALLBACK_TOKEN}
```

Use lowercase organization names in `orgs` because the URL organization is
normalized to lowercase before matching.

GitHub authentication selection prefers, in order:

1. An app whose `orgs` contains the query organization.
1. An app with no `orgs` restriction.
1. The only configured app, when exactly one app remains.
1. A token.
1. The `none` method.

The selected method must also appear in the consumer's `authMethods` list.

## Configure AWS accounts

The `aws` type is different from host-based types. One singleton connection
contains an `account` authentication entry for each AWS account:

```yaml title="app-config.yaml"
connections:
  - type: aws
    roleName: BackstageReadRole
    region: eu-west-1
    auth:
      - method: account
        title: Main AWS account
        mainAccount: true
        profile: backstage-main
      - method: account
        title: Workload account
        accountId: '123456789012'
        roleName: BackstageReadRole
```

A lookup can provide an `accountId` or an Amazon Resource Name (ARN). AWS uses
an exact account entry when one exists, then falls back to the entry marked
`mainAccount`. A connection-level `roleName` requires a main-account entry,
because that entry supplies the credentials used to assume the role in
accounts without their own entry.

See the [AWS connection type guide](./types/aws.md) for the available fields
and validation constraints.

## Change a connection

Connection configuration is static. To change a host, endpoint, credential,
plugin match, or authentication method:

1. Update the relevant entry in the configuration source for the environment.
1. Update any secret referenced by the entry.
1. Restart the backend so the default service reloads and validates the full
   connection list.
1. Exercise a plugin lookup for the affected type and target.

Changing an [authentication method](./concepts.md#authentication-method) can
affect consumers. Each consumer lists the methods it understands, and a lookup
fails if the configured selection resolves to an unsupported method. Check the
consuming plugins before removing an authentication entry or changing its
priority.

Backstage configuration arrays are replaced as a whole when configuration
sources are merged. If more than one configuration file defines `connections`,
the higher-priority array replaces the lower-priority array. Include the full
environment-specific connection list in the overriding source, or use config
includes and environment variable substitution to keep values organized.

## Migrate from legacy integrations

The default service converts supported legacy `integrations` configuration and
the legacy top-level `aws` configuration into connections. This lets existing
configuration continue to supply connection data while plugins migrate to the
connection service.

You can migrate one connection type at a time. For example:

```yaml title="app-config.yaml"
# Legacy configuration
integrations:
  github:
    - host: github.com
      token: ${GITHUB_TOKEN}

# Explicit connection configuration
connections:
  - type: gitlab
    host: gitlab.com
    auth:
      - method: token
        token: ${GITLAB_TOKEN}
```

Legacy GitHub and explicit GitLab entries are both loaded. When at least one
explicit connection exists for a type, all legacy entries of that type are
ignored and a warning is logged. An explicit GitHub entry therefore takes over
the complete GitHub connection set; it does not merge with individual legacy
GitHub hosts.

## Diagnose configuration and lookup failures

The service reports invalid configuration during backend startup. Common
causes include:

- An unknown connection type or authentication method.
- A missing required field.
- An empty or missing `auth` array.
- Two connections with the same type and host.
- More than one singleton connection.
- A whole-connection validation failure, such as duplicate AWS account IDs.

At lookup time, distinguish these outcomes:

- `NotFoundError` means no configured connection matched the type and query, or
  the type-specific authentication selector found no candidate.
- `NotAllowedError` means the plugin cannot see an authentication entry or the
  selected method is not supported by the consumer.
- `InputError` can indicate an invalid query, such as a malformed URL, or a
  lookup for a connection type the plugin did not declare.

See [Consume connections](./consuming-connections.md) for error handling in
plugin code.
