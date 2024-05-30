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
    - region: eu-west-1
```

This most basic example can only be used if you are running Backstage on an instance that has an IAM identity with the following policies:

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "codecommit:GetFile",
                "codecommit:GetFolder"
            ],
            "Resource": "*",
            "Effect": "Allow"
        }
    ]
}
```

If you are running Backstage outside AWS and want to use Access key authentication, you can use the following configuration:

```yaml
integrations:
  awsCodeCommit:
    - region: eu-west-1
      accessKeyId: ${AWS_ACCESS_KEY_ID}
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
    - region: eu-west-1
      roleArn: 'arn:aws:iam::xxxxxxxxxxxx:role/example-role'
      externalId: 'some-id' # optional
```

Each entry is a structure with the following **required** elements:

- `region`: The AWS region to connect to, to communicate with the CodeCommit services

The configuration can also provide a `host` property like the other integrations. If it is not provided, it will be determined from the provided region.
i.e. When you provide `eu-west-1` as the region, Backstage will use the host `eu-west-1.console.aws.amazon.com` to check whether a provided url matches the integration.

## Register an entity on AWS CodeCommit

To register an entity that is stored in an AWS CodeCommit repository, you need to fetch the URL from the AWS Console:

- Navigate to the Code Commit service in the AWS Console ([https://console.aws.amazon.com/codecommit/home](https://console.aws.amazon.com/codecommit/home))
- _Optional: Make sure you select the correct region if you don't use the default one (us-east-1)_
- Select the repository where the entity file is stored
- Inside the repository navigate to the backstage entity file (`catalog-info.yaml`) and open the file
- Now you can copy-paste the URL from your browser inside Backstage

The format would be something like:
`https://{region}.console.aws.amazon.com/codesuite/codecommit/repositories/{reponame}/browse/refs/heads/{branch}/--/catalog-info.yaml`
