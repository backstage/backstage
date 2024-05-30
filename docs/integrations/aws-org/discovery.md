---
id: discovery
title: AWS Organization Discovery
sidebar_label: Discovery
# prettier-ignore
description: Automatically discovering AWS accounts from AWS organizations
---

:::info
This documentation is written for [the new backend system](../../backend-system/index.md) which is the default since Backstage [version 1.24](../../releases/v1.24.0.md).
:::

## AWS Organization Provider

The AWS Organization integration has a discovery provider for ingesting AWS accounts from an AWS organization into the software catalog. It will list organization accounts (including the org account) and provide entities to your software catalog. The current provider provides accounts as kind `Resource` with no owners. There are plans to make the kind and ownership customizable soon to allow for flexible requirements.

AWS recommends [organizing your AWS environment using multiple accounts](https://docs.aws.amazon.com/whitepapers/latest/organizing-your-aws-environment/organizing-your-aws-environment.html). You may have dozens or even hundreds of AWS accounts. This provider will help you manage ownership and the lifecycle of your accounts in Backstage.

## Installation

You will have to add the AWS Organization Entity provider to your backend as it is not installed by default, therefore you have to add a dependency on `@backstage/plugin-catalog-backend-module-aws-org` to your backend package.

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-catalog-backend-module-aws-org
```

And then update your backend by adding the following line:

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-catalog-backend'));
/* highlight-add-start */
backend.add(import('@backstage/plugin-catalog-backend-module-aws-org'));
```

## Configuration

To use the discovery provider, you'll need an AWS Organization and AWS credentials (prefferably an IAM role) your Backstage instance can assume.

Create an IAM role in your organization account with the following permissions. Adjust the trust relationship to match your environment. For example, if you run Backstage in ECS fargate allow your task role to assume a role in your organization account to list accounts.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VisualEditor0",
      "Effect": "Allow",
      "Action": [
        "organizations:ListAccounts",
        "organizations:ListTagsForResource"
      ],
      "Resource": "*"
    }
  ]
}
```

Once your role is provisioned add the required backstage AWS configuration. More information on this Backstage integration can be found [here](https://github.com/backstage/backstage/tree/master/packages/integration-aws-node#readme).

This example shows an IAM role in the organization account that can be assumed by backstage (running in AWS).

```yaml
integrations:
  aws:
    accounts:
      - accountId: '123456789123'
        roleName: 'backstage'
```

Then you can add an `aws-org` config to the catalog providers configuration:

```yaml
catalog:
  providers:
    aws-org:
      # the provider ID can be any camelCase string
      providerId:
        accountId: 123456789123 # string
        schedule: # same options as in TaskScheduleDefinition
          # supports cron, ISO duration, "human duration" as used in code
          frequency: { minutes: 30 }
          # supports ISO duration, "human duration" as used in code
          timeout: { minutes: 3 }
```

This provider supports multiple AWS organizations via unique provider IDs.

- **`accountId`**:
  AccountId used to lookup a configured AWS integration. The provider will use `@backstage/integration-aws-node` to manage AWS credentials. Typically your organization account.
- **`schedule`**:
  - **`frequency`**:
    How often you want the task to run. The system does its best to avoid overlapping invocations.
  - **`timeout`**:
    The maximum amount of time that a single task invocation can take.
  - **`initialDelay`** _(optional)_:
    The amount of time that should pass before the first invocation happens.
  - **`scope`** _(optional)_:
    `'global'` or `'local'`. Sets the scope of concurrency control.

More information about scheduling can be found on the [TaskScheduleDefinition](https://backstage.io/docs/reference/backend-tasks.taskscheduledefinition) page.
