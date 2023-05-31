---
id: aws
title: Deploying Backstage on AWS Lightsail
sidebar_label: AWS
description: How to deploy Backstage on AWS Lightsail
---

> **DISCLAIMER: The `deploy` command is in alpha and still experimental. Do not use the `deploy` command for production deployments.**

Getting started with Backstage often involves setting up an instance on a cloud provider and sharing it with your team so they can experiment. To make this cloud deployment easier, we've built a `deploy` command to stand up a proof-of-concept instance on AWS (using Lightsail).

## What is AWS Lightsail

:::tip

AWS offers a free tier for up to three months on $10 USD/month Container service (Micro -1 node). By default we use the `nano` node, so if you are a new user this approach shouldn't cost you anything. For more information, refer to the [pricing](https://aws.amazon.com/lightsail/pricing/) documentation.

:::

AWS Lightsail offers a simple way to run containers in the cloud. To learn more about AWS Lightsail, please refer to the [official documentation](https://lightsail.aws.amazon.com/ls/docs/en_us/articles/amazon-lightsail-container-services-deployments).

## Creating user in AWS

- Open the AWS console and navigate to the IAM section
- In the left side menu click on `Users` and then click on `Add users`
- Specify a username and then click on `Next`
- Afterwards you can assign permissions, select `Attach policies directly` and then click on `Create policy`.
  This should take you to a new window in which you can create a new policy based on `JSON`.
  Copy over the following:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VisualEditor0",
      "Effect": "Allow",
      "Action": [
        "ecr:DescribeImageReplicationStatus",
        "ecr:ListTagsForResource",
        "ecr:UploadLayerPart",
        "ecr:BatchGetRepositoryScanningConfiguration",
        "ecr:DeleteRepository",
        "ecr:GetRegistryScanningConfiguration",
        "ecr:CompleteLayerUpload",
        "ecr:TagResource",
        "ecr:DescribeRepositories",
        "ecr:DeleteRepositoryPolicy",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetLifecyclePolicy",
        "ecr:GetRegistryPolicy",
        "ecr:PutLifecyclePolicy",
        "ecr:DescribeImageScanFindings",
        "ecr:GetLifecyclePolicyPreview",
        "ecr:CreateRepository",
        "ecr:DescribeRegistry",
        "ecr:GetDownloadUrlForLayer",
        "ecr:GetAuthorizationToken",
        "ecr:DeleteLifecyclePolicy",
        "ecr:PutImage",
        "ecr:UntagResource",
        "ecr:SetRepositoryPolicy",
        "ecr:BatchGetImage",
        "ecr:InitiateLayerUpload",
        "ecr:GetRepositoryPolicy",
        "lightsail:CreateContainerService",
        "lightsail:GetKeyPair",
        "lightsail:GetContainerServiceDeployments",
        "lightsail:CreateContainerServiceRegistryLogin",
        "lightsail:GetContainerImages",
        "lightsail:UntagResource",
        "lightsail:RegisterContainerImage",
        "lightsail:GetContainerServices",
        "lightsail:GetContainerServicePowers",
        "lightsail:GetKeyPairs",
        "lightsail:CreateContainerServiceDeployment",
        "lightsail:GetContainerServiceMetricData",
        "lightsail:GetContainerAPIMetadata",
        "lightsail:DeleteContainerService",
        "lightsail:GetContainerLog",
        "lightsail:TagResource"
      ],
      "Resource": "*"
    },
    {
      "Sid": "Statement1",
      "Effect": "Allow",
      "Action": [],
      "Resource": []
    }
  ]
}
```

Then click on `Next` and give the policy a name and a description of your liking. Afterwards, click on `Create policy`.

- Navigate back to the user creation window and press on the refresh button and search for the policy you just created. Now, create the user.
- Now you will be redirected to all users, click on the user you just created and click on `Security credentials`
- Scroll below and click on `Create access key`
- Choose `Command Line Interface (CLI)`
- Now export the following values

```bash
$ export AWS_ACCESS_KEY_ID=... (first value)
$ export AWS_SECRET_ACCESS_KEY=.... (second secret value)
```

## Configuring the Pulumi CLI

Second, install the [Pulumi CLI](https://www.pulumi.com/docs/get-started/install/).

Then we need to execute the following commands, to set Pulumi up:

```bash
$ pulumi login --local
$ export PULUMI_CONFIG_PASSPHRASE="<your-secret>"
```

By using `pulumi login --local` we are making sure that Pulumi stores our state on the local file disk. The environment variable `PULUMI_CONFIG_PASSPHRASE` is used by Pulumi to generate a unique key for your stack

## Deploying your instance on Lightsail

:::warning

Make sure that [Docker](https://docs.docker.com/) is running before you start this section.

:::

After you have made your changes to your local instance, it's time to deploy it on Lightsail.

First, we need to configure the `app-config.yaml` and update the `baseUrl`.

```diff
app:
-  baseUrl: http://localhost:3000
+  baseUrl: ${BACKSTAGE_HOST}

backend:
-  baseUrl: http://localhost:7007
+  baseUrl: ${BACKSTAGE_HOST}
  listen:
    port: 7007
```

The environment variable `BACKSTAGE_HOST` will be set to the endpoint that AWS Lightsail creates.

In addition, you should create a `app-config.local.yaml`:

```bash
$ touch app-config.local.yaml
```

And then update the file with the following yaml:

```yaml
app:
  baseUrl: http://localhost:3000

backend:
  baseUrl: http://localhost:7007
```

Now we can deploy our instance!

```bash
$ npx backstage-deploy aws --stack backstage-poc --create-dockerfile
```

In the first part of the command, we are specifying that we want to deploy our instance on AWS. With the [`--stack`](https://www.pulumi.com/docs/reference/cli/pulumi_stack/) option, we are providing Pulumi a reference to our container deployment. Furthermore, with the `--create-dockerfile` option, there will be a `Dockerfile` and `.dockerignore` created in the root of the project.

After running the command, Pulumi will start creating the following resources for you in AWS:

- ECR Repository
- Lightsail Container Service
- Lightsail Container Service Deployment
- Policy that allows Lightsail to pull from ECR

If it's the first time building the Docker image, it might take a while for everything to be fully provisioned. After the command is finished running, your Backstage instance should be up and running on AWS Lightsail! 🎉

### Cleaning up resources

Cleaning up the resources is also done with the deploy command.

```bash
$ npx backstage-deploy aws --stack backstage-poc --destroy
```

This will delete everything that was originally created by the `deploy` command.
