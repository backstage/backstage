---
id: locations
sidebar_label: Locations
title: Amazon Web Services S3 Locations
description: Setting up an integration with Amazon Web Services S3
---

The AWS S3 integration supports loading catalog entities from an S3 Bucket.
Entities can be added to
[static catalog configuration](../../features/software-catalog/configuration.md),
or registered with the
[catalog-import](https://github.com/backstage/backstage/tree/master/plugins/catalog-import)
plugin.

## Configuration

To use this integration, add configuration to your `app-config.yaml`:

```yaml
integrations:
  awsS3:
    - accessKeyId: ${AWS_ACCESS_KEY_ID}
      secretAccessKey: ${AWS_SECRET_ACCESS_KEY}
```

Then make sure the environment variables `AWS_ACCESS_KEY_ID` and
`AWS_SECRET_ACCESS_KEY` are set when you run Backstage.

Users with multiple AWS accounts may want to use a role for S3 storage that is
in a different AWS account. Using the `roleArn` parameter as seen below, you can
instruct the AWS S3 reader to assume a role before accessing S3:

```yaml
integrations:
  awsS3:
    - accessKeyId: ${AWS_ACCESS_KEY_ID}
      secretAccessKey: ${AWS_SECRET_ACCESS_KEY}
      roleArn: 'arn:aws:iam::xxxxxxxxxxxx:role/example-role'
      externalId: 'some-id' # optional
```

If the AWS account of the role has its own entry under `aws.accounts` that
already assumes that same role, for example using a web identity token file,
the reader uses those credentials directly instead of assuming the role a
second time. This means that the role doesn't need to trust itself:

```yaml
aws:
  accounts:
    - accountId: '111111111111'
      roleName: 'example-role'
      webIdentityTokenFile: '/var/run/secrets/aws/token'

integrations:
  awsS3:
    - roleArn: 'arn:aws:iam::111111111111:role/example-role'
```

The role is still assumed a second time if `externalId` is set on the
integration, so that the external ID is always checked.

Configuration allows specifying custom S3 endpoint, along with
[path-style access](https://docs.aws.amazon.com/AmazonS3/latest/userguide/VirtualHosting.html)
to support integration with providers like
[LocalStack](https://github.com/localstack/localstack):

```yaml
integrations:
  awsS3:
    - endpoint: 'http://localhost:4566'
      s3ForcePathStyle: true
      accessKeyId: ${AWS_ACCESS_KEY_ID}
      secretAccessKey: ${AWS_SECRET_ACCESS_KEY}
```
