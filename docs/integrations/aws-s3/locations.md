---
id: locations
sidebar_label: Locations
title: Amazon Web Services S3 Locations
# prettier-ignore
description: Setting up an integration with Amazon Web Services S3
---

The AWS S3 integration supports loading catalog entities from an S3 Bucket.
Entities can be added to
[static catalog configuration](../../features/software-catalog/configuration.md),
or registered with the
[catalog-import](https://github.com/backstage/backstage/tree/master/plugins/catalog-import)
plugin.

## Configuration

To use this integration, add configuration to your root `app-config.yaml`:

```yaml
awsS3:
  - host: amazonaws.com
    accessKeyId: ${AWS_ACCESS_KEY_ID}
    secretAccessKey: ${AWS_SECRET_ACCESS_KEY}
```

Then make sure the environment variables `AWS_ACCESS_KEY_ID` and
`AWS_SECRET_ACCESS_KEY` are set when you run Backstage.

Users with multiple AWS accounts may want to use a role for S3 storage that is
in a different AWS account. Using the roleArn parameter as seen below, you can
instruct the AWS S3 reader to assume a role before accessing S3:

```yaml
awsS3:
  - host: amazonaws.com
    accessKeyId: ${AWS_ACCESS_KEY_ID}
    secretAccessKey: ${AWS_SECRET_ACCESS_KEY}
    roleArn: 'arn:aws:iam::xxxxxxxxxxxx:role/example-role'
```
