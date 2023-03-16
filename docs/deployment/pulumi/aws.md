---
id: aws
title: Deploying Backstage on AWS Lightsail
sidebar_label: AWS
description: How to deploy Backstage on AWS Lightsail
---

> **DISCLAIMER: The `deploy` command is in alpha and still experimental. Do not use the `deploy` command for production deployments.**

Getting started with Backstage mostly starts with a proof-of-concept phase. To make the proof-of-concept phase more seamless there is the `deploy` command. The `deploy` command should make it easier for you to deploy your Backstage instance on a cloud provider. In this section we will focus on deploying `Backstage` on AWS Lightsail.

## What is AWS Lightsail

AWS Lightsail offers a simple way to run containers in the cloud. To learn more about AWS Lightsail, please refer to the [official documentation](https://lightsail.aws.amazon.com/ls/docs/en_us/articles/amazon-lightsail-container-services-deployments).

## Configuring the AWS CLI

First, install the [AWS CLI](https://aws.amazon.com/cli/). Afterwards, use the AWS CLI to configure your user. Make sure that the following environment variables `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are available.

## Configuring the Pulumi CLI

Second, install the [Pulumi CLI](https://www.pulumi.com/docs/get-started/install/).

## Deploying your instance on Lightsail

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

```bash
$ yarn backstage-cli deploy aws --stack backstage-poc --create-dockerfile
```

In the first part of the command, we are specifying that we want to deploy our instance on AWS. With the [`--stack`](https://www.pulumi.com/docs/reference/cli/pulumi_stack/) option, we are supplying Pulumi a reference to our container deployment. Furthermore, with the `--create-dockerfile` option, there will be a `Dockerfile` and `.dockerignore` created in the root of the project.

:::tip

By default, the `deploy` command looks for a `Dockerfile` in the root. If you want to use a different path, use the `--dockerfile` option. For example: `backstage-cli deploy aws --stack backstage-poc --dockerfile packages/backend/Dockerfile`

:::

After you run the command, Pulumi will start creating the following resources for you in AWS:

- ECR Repository
- Lightsail Container Service
- Lightsail Container Service Deployment
- Policy that allows Lightsail to pull from ECR

If it's the first time building the Docker image, it might take a while for everything to be fully provisioned. After the command is finished running, your Backstage instance should be up and running on AWS Lightsail! 🎉

### Cleaning up resources

Cleaning up the resources is also done with the deploy command.

```bash
$ yarn backstage-cli deploy --stack backstage-poc --destroy
```

This will delete everything that was originally created by the `deploy` command.
