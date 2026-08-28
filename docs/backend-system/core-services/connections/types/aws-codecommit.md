---
id: aws-codecommit
title: AWS CodeCommit connections
description: Configure and consume AWS CodeCommit connections
---

The `aws-codecommit` connection type represents an AWS CodeCommit endpoint and
region. It has [multiton cardinality](../concepts.md#cardinality) and uses the
`host` [lookup strategy](../concepts.md#lookup-strategies), so each configured
entry must have a unique host.

## Configure AWS CodeCommit

```yaml title="app-config.yaml"
connections:
  - type: aws-codecommit
    host: git-codecommit.eu-west-1.amazonaws.com
    region: eu-west-1
    auth:
      - method: assumeRole
        roleArn: arn:aws:iam::123456789012:role/BackstageCodeCommit
        externalId: ${AWS_CODECOMMIT_EXTERNAL_ID}
```

## Connection fields

| Field    | Type     | Required | Description                                                     |
| -------- | -------- | -------- | --------------------------------------------------------------- |
| `host`   | `string` | Yes      | Host matched against the resource URL supplied by the consumer. |
| `region` | `string` | Yes      | AWS region containing the CodeCommit repositories.              |

## Authentication methods

AWS CodeCommit requires authentication and does not support the `none` method.

| Method       | Field             | Type     | Required | Description                                |
| ------------ | ----------------- | -------- | -------- | ------------------------------------------ |
| `accessKey`  | `accessKeyId`     | `string` | Yes      | Static AWS access key ID.                  |
| `accessKey`  | `secretAccessKey` | `string` | Yes      | Static AWS secret access key.              |
| `assumeRole` | `roleArn`         | `string` | Yes      | ARN of the role to assume.                 |
| `assumeRole` | `externalId`      | `string` | No       | External ID passed when assuming the role. |

The service returns the configured static access keys or role parameters. An
AWS credential provider is responsible for assuming the role and refreshing
temporary credentials.

## Lookup and selection

The consumer supplies a [lookup query](../concepts.md#lookup-queries) containing
a URL. The service parses `query.url` and selects the connection whose `host`
matches exactly.

When more than one authentication entry is visible to the calling plugin, the
first visible entry is selected. Use
[plugin scoping](../concepts.md#plugin-scoping) to supply different credentials
to a specific plugin; otherwise, configuration order determines which entry is
selected. The selected method must appear in the consumer's `authMethods` list.

## Consume an AWS CodeCommit connection

```ts
const connection = await connections.find({
  type: 'aws-codecommit',
  query: {
    url: 'https://git-codecommit.eu-west-1.amazonaws.com/v1/repos/example',
  },
  authMethods: ['accessKey', 'assumeRole'],
});

if (connection.auth.method === 'assumeRole') {
  connection.auth.roleArn; // string
  connection.auth.externalId; // string | undefined
}
```

Return to the [built-in connection type index](../built-in-connection-types.md).
