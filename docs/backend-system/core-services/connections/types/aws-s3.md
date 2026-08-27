---
id: aws-s3
title: AWS S3 connections
description: Configure and consume AWS S3 connections
---

The `aws-s3` connection type represents an Amazon Simple Storage Service (S3)
or S3-compatible endpoint. It has
[multiton cardinality](../concepts.md#cardinality) and uses the `host`
[lookup strategy](../concepts.md#lookup-strategies).

## Configure AWS S3

```yaml title="app-config.yaml"
connections:
  - type: aws-s3
    title: Internal object storage
    host: s3.example.com
    endpoint: https://s3.example.com
    s3ForcePathStyle: true
    auth:
      - method: accessKey
        accessKeyId: ${S3_ACCESS_KEY_ID}
        secretAccessKey: ${S3_SECRET_ACCESS_KEY}
```

## Connection fields

| Field              | Required | Purpose                                                         |
| ------------------ | -------- | --------------------------------------------------------------- |
| `host`             | Yes      | Host matched against the resource URL supplied by the consumer. |
| `endpoint`         | No       | Custom S3 API endpoint.                                         |
| `s3ForcePathStyle` | No       | Whether an S3 client should use path-style bucket URLs.         |

## Authentication methods

| Method       | Required fields                  | Optional fields |
| ------------ | -------------------------------- | --------------- |
| `none`       | None                             | None            |
| `accessKey`  | `accessKeyId`, `secretAccessKey` | None            |
| `assumeRole` | `roleArn`                        | `externalId`    |

Use `none` explicitly for an endpoint that permits unauthenticated access. The
service does not infer unauthenticated access from a missing `auth` array.

For `assumeRole`, the service returns the role parameters. A separate AWS
credential provider performs role assumption and credential refresh.

## Lookup and selection

The consumer supplies a [lookup query](../concepts.md#lookup-queries) containing
a URL. The service selects the connection whose `host` matches the parsed URL
host exactly, including a port when one is present.

When more than one authentication entry is visible to the calling plugin, the
first visible entry is selected.

## Consume an AWS S3 connection

```ts
const connection = await connections.find({
  type: 'aws-s3',
  query: { url: 'https://s3.example.com/catalog/catalog-info.yaml' },
  authMethods: ['accessKey', 'assumeRole', 'none'],
});

connection.endpoint; // string | undefined
connection.s3ForcePathStyle; // boolean | undefined
```

Narrow `connection.auth.method` before reading method-specific credential
fields.

Return to the [built-in connection type index](../built-in-connection-types.md).
