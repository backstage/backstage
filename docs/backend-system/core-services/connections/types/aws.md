---
id: aws-connection
title: AWS connections
description: Configure and consume AWS account connections
---

The `aws` connection type represents credentials for one or more Amazon Web
Services (AWS) accounts. It has
[singleton cardinality](../concepts.md#cardinality), so configuration contains
at most one `aws` connection. Individual accounts are represented by
`account` [authentication entries](../concepts.md#authentication-entry) inside
that connection.

Unlike most built-in types, AWS uses the `aws`
[lookup strategy](../concepts.md#lookup-strategies). Consumers look up an
account number or Amazon Resource Name (ARN), not a URL host.

## Configure AWS

```yaml title="app-config.yaml"
connections:
  - type: aws
    title: Company AWS accounts
    roleName: BackstageReadRole
    region: eu-west-1
    auth:
      - method: account
        title: Main account
        mainAccount: true
        profile: backstage-main
      - method: account
        title: Production workload account
        accountId: '123456789012'
        roleName: BackstageReadRole
```

The main account is the fallback for lookups without an exact account entry.
It also supplies the source credentials when the connection-level `roleName`
is used to assume a role in another account.

## Connection fields

All AWS connection fields are optional:

| Field                  | Purpose                                                                                         |
| ---------------------- | ----------------------------------------------------------------------------------------------- |
| `roleName`             | Role to assume in an account that does not have its own authentication entry.                   |
| `partition`            | AWS partition for connection-level role assumption. Requires `roleName`.                        |
| `region`               | AWS region associated with connection-level role assumption. Requires `roleName`.               |
| `externalId`           | External ID passed during connection-level role assumption. Requires `roleName`.                |
| `webIdentityTokenFile` | Path to a web identity token used during connection-level role assumption. Requires `roleName`. |

`externalId` and `webIdentityTokenFile` are mutually exclusive.

## `account` authentication method

The `account` method supports these fields:

| Field                  | Purpose                                                                                         |
| ---------------------- | ----------------------------------------------------------------------------------------------- |
| `accountId`            | AWS account number represented by the entry. Required unless `mainAccount` is `true`.           |
| `mainAccount`          | Marks the entry as the fallback and source of credentials for connection-level role assumption. |
| `accessKeyId`          | Static access key ID. Must be configured with `secretAccessKey`.                                |
| `secretAccessKey`      | Static secret access key. Must be configured with `accessKeyId`.                                |
| `profile`              | Local AWS profile used for the account.                                                         |
| `roleName`             | Role to assume in this entry's account.                                                         |
| `partition`            | AWS partition for the entry's role. Requires `roleName`.                                        |
| `region`               | AWS region for the account or role.                                                             |
| `externalId`           | External ID passed when assuming the entry's role. Requires `roleName`.                         |
| `webIdentityTokenFile` | Path to a web identity token used when assuming the entry's role. Requires `roleName`.          |

The AWS type validates the complete connection:

- Account IDs must be unique.
- Only one entry can set `mainAccount: true`.
- The main account cannot define `roleName`.
- Static access-key fields must be supplied together.
- `profile` cannot be combined with static access keys or `roleName`.
- `webIdentityTokenFile` cannot be combined with static access keys, `profile`,
  or `externalId`.
- A connection-level `roleName` requires a main-account entry.

## Lookup and selection

Consumers can supply `accountId`, `arn`, or both. When both are present,
`accountId` takes precedence. The type extracts the account number from a valid
ARN when `accountId` is omitted.

Selection follows this order:

1. Return the entry whose `accountId` matches the query.
1. Return the entry marked `mainAccount` when no exact entry exists.
1. Return no match when neither entry exists.

A malformed ARN causes an `InputError` instead of falling back to the main
account.

## Consume an AWS connection

```ts
const connection = await connections.find({
  type: 'aws',
  query: {
    arn: 'arn:aws:iam::123456789012:role/BackstageReadRole',
  },
  authMethods: ['account'],
});

connection.auth.method; // 'account'
connection.auth.accountId; // string | undefined
connection.auth.roleName; // string | undefined
```

The returned fields are static inputs to an AWS credential provider. The
connection service does not load profiles, read web identity token files, or
perform role assumption.

Return to the [built-in connection type index](../built-in-connection-types.md).
