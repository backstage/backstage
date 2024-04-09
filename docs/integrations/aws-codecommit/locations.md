---
id: locations
sidebar_label: Locations
title: Amazon Web Services CodeCommit Locations
# prettier-ignore
description: Setting up an integration with Amazon Web Services CodeCommit
---

The AWS CodeCommit integration supports loading catalog entities from CodeCommit Repositories.
Entities can be added to
[static catalog configuration](../../features/software-catalog/configuration.md),
or registered with the
[catalog-import](https://github.com/backstage/backstage/tree/master/plugins/catalog-import)
plugin.

## Configuration

To use this integration, add configuration to your `app-config.yaml`:

```yaml
integrations:
  awsCodeCommit:
    - accessKeyId: ${AWS_ACCESS_KEY_ID}
      secretAccessKey: ${AWS_SECRET_ACCESS_KEY}
```

Then make sure the environment variables `AWS_ACCESS_KEY_ID` and
`AWS_SECRET_ACCESS_KEY` are set when you run Backstage.

Users with multiple AWS accounts may want to use a role for CodeCommit that is
in a different AWS account. Using the `roleArn` parameter as seen below, you can
instruct the AWS CodeCommit reader to assume a role before accessing CodeCommit:

```yaml
integrations:
  awsCodeCommit:
    - accessKeyId: ${AWS_ACCESS_KEY_ID}
      secretAccessKey: ${AWS_SECRET_ACCESS_KEY}
      roleArn: 'arn:aws:iam::xxxxxxxxxxxx:role/example-role'
      externalId: 'some-id' # optional
```

When no entries are added, the AWS CodeCommit reader will add a default entry that uses the [standard credentials provider chain](https://docs.aws.amazon.com/AWSJavaSDK/latest/javadoc/com/amazonaws/auth/DefaultAWSCredentialsProviderChain.html).
