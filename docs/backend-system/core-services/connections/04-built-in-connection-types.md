---
id: built-in-connection-types
title: Built-in connection types
description: Directory of the built-in Backstage connection types
---

The `@backstage/connections` package provides the canonical
[connection types](./concepts.md#connection-type) in this directory. Each type
has its own guide with valid configuration, connection fields,
[authentication methods](./concepts.md#authentication-method), lookup behavior,
selection rules, and a typed consumption example.

## Cloud accounts and storage

- [AWS](./types/aws.md) resolves account credentials by AWS account number or
  Amazon Resource Name (ARN). It supports the `account` authentication method.
- [AWS S3](./types/aws-s3.md) represents Amazon Simple Storage Service (S3) and
  S3-compatible endpoints. It supports `none`, `accessKey`, and `assumeRole`.
- [Azure Blob Storage](./types/azure-blob-storage.md) supports account keys,
  shared access signature (SAS) tokens, connection strings, Microsoft Entra ID
  credentials, and unauthenticated access.
- [Google Cloud Storage](./types/google-gcs.md) supports service-account and
  unauthenticated access.

## Source control

- [AWS CodeCommit](./types/aws-codecommit.md) supports access keys and role
  assumption.
- [Azure DevOps](./types/azure.md) supports personal access tokens (PATs),
  client credentials, managed identities, and unauthenticated access.
- [Bitbucket Cloud](./types/bitbucket-cloud.md) supports tokens, app passwords,
  OAuth client credentials, and unauthenticated access.
- [Bitbucket Server](./types/bitbucket-server.md) supports tokens, basic
  authentication, and unauthenticated access.
- [Gerrit](./types/gerrit.md) supports basic authentication and
  unauthenticated access.
- [Gitea](./types/gitea.md) supports basic authentication and unauthenticated
  access.
- [GitHub](./types/github.md) supports tokens, GitHub Apps, and
  unauthenticated access, including app selection by organization.
- [GitLab](./types/gitlab.md) supports tokens and unauthenticated access.

## Developer platforms

- [Harness](./types/harness.md) supports token authentication with an optional
  additional API key.

## Common behavior

Every [configured connection](./concepts.md#configured-connection) supports the
framework-owned `type`, `title`, `match`, and `auth` fields. Every
[authentication entry](./concepts.md#authentication-entry) supports `method`,
`title`, and `match` in addition to the fields defined by its method.

Most built-in types have [multiton cardinality](./concepts.md#cardinality) and
use the `host` [lookup strategy](./concepts.md#lookup-strategies). Their
consumers pass `query: { url }`, and the service selects the connection whose
configured `host` matches the parsed URL host.

AWS is the exception. It is a singleton that accepts `accountId` or `arn` in
its [lookup query](./concepts.md#lookup-queries) and selects an account
authentication entry from within the connection.

Unless a type documents its own authentication selection rules, the service
returns the first authentication entry visible to the calling plugin. See
[What happens during `find`](./concepts.md#what-happens-during-find) for the
complete selection order.

## Inspect schemas programmatically

The `connectionTypes` registry exposes portable schemas without exposing Zod
objects. Generic tooling can inspect the JSON Schema for a connection type and
each authentication method:

```ts
import { connectionTypes } from '@backstage/connections';

const github = connectionTypes.github;

const connectionSchema = github.configSchema.schema().schema;
const authSchemas = github.authMethods.map(authMethod => ({
  method: authMethod.method,
  title: authMethod.title,
  schema: authMethod.configSchema.schema().schema,
}));
```

`configSchema` covers type-specific connection fields. Framework-owned fields
are added by the configuration pipeline and are not part of that schema.
