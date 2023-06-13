---
id: koyeb
title: Deploying with Koyeb
sidebar_label: Koyeb
description: How to deploy Backstage to Koyeb
---

This guide explains how to deploy Backstage to [Koyeb](https://www.koyeb.com/), a serverless platform that provides the fastest way to deploy applications globally. Koyeb supports git-driven and container-based deployments.

Before you begin, make sure you have a [Koyeb account](https://app.koyeb.com/) to follow this guide.

## Configuring the CLI

First, install the
[Koyeb CLI](https://www.koyeb.com/docs/quickstart/koyeb-cli) and follow the instructions in the [quickstart guide](https://www.koyeb.com/docs/quickstart/koyeb-cli) to login.

Then, configure your `app-config.yaml` with your `baseUrl`:

```yaml
app:
  # Should be the same as backend.baseUrl when using the `app-backend` plugin
  baseUrl: https://<your-app>.koyeb.app

backend:
  baseUrl: https://<your-app>.koyeb.app
  listen:
    port: ${PORT]
      # The $PORT environment variable is a feature of Koyeb
      # https://www.koyeb.com/docs/apps/services
```

## Push and deploy Backstage to Koyeb

Push your Backstage application with its [Dockerfile](docker.md) to Koyeb using the following command:

```bash
koyeb app init example-backstage \
  --git github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME> \
  --git-branch main \
  --ports 8000:http \
  --routes /:8000 \
  --env PORT=8000
```

Your application will be built and deployed to Koyeb. Once the build has finished, you will be able to access your application running on Koyeb by clicking the URL ending with `.koyeb.app`.  

Congratulations! Now you should have Backstage up and running! 🎉


